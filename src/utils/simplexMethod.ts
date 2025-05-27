import type { LPProblem } from '@/types/lpTypes';

interface Tableau {
  basicVars: string[];
  nonBasicVars: string[];
  coefficients: number[][];
  rhs: number[];
  z: number[];
  z0: number;
}

interface SimplexStep {
  tableau: Tableau;
  pivot?: { row: number; col: number };
  enteringVar?: string;
  leavingVar?: string;
  explanation: string;
}

export const generateSimplexSteps = (problem: LPProblem): SimplexStep[] => {
  const steps: SimplexStep[] = [];
  const numVars = problem.variables.length;
  const numConstraints = problem.constraints.length;

  // Initial tableau
  const initialTableau: Tableau = {
    basicVars: Array(numConstraints).fill('').map((_, i) => `s${i + 1}`),
    nonBasicVars: [...problem.variables],
    coefficients: problem.constraints.map(constraint => [...constraint.coefficients]),
    rhs: problem.constraints.map(constraint => constraint.value),
    z: problem.objective.coefficients.map(coef => 
      problem.objective.type === 'max' ? -coef : coef),
    z0: 0
  };

  steps.push({
    tableau: initialTableau,
    explanation: 'Tabla inicial del método simplex'
  });

  // Simulate simplex iterations
  let currentTableau = { ...initialTableau };
  let iteration = 1;

  while (iteration <= 10) { // Limit iterations to prevent infinite loops
    // Find entering variable based on objective type
    const enteringVarIndex = problem.objective.type === 'max' 
      ? currentTableau.z.findIndex(coef => coef < 0)
      : currentTableau.z.findIndex(coef => coef > 0);
    
    if (enteringVarIndex === -1) break;

    // Find leaving variable (minimum ratio test)
    let minRatio = Infinity;
    let leavingVarIndex = -1;
    
    for (let i = 0; i < numConstraints; i++) {
      if (currentTableau.coefficients[i][enteringVarIndex] > 0) {
        const ratio = currentTableau.rhs[i] / currentTableau.coefficients[i][enteringVarIndex];
        if (ratio < minRatio) {
          minRatio = ratio;
          leavingVarIndex = i;
        }
      }
    }

    if (leavingVarIndex === -1) {
      steps.push({
        tableau: currentTableau,
        explanation: 'El problema es no acotado'
      });
      break;
    }

    // Perform pivot operation
    const pivotRow = leavingVarIndex;
    const pivotCol = enteringVarIndex;
    const pivotElement = currentTableau.coefficients[pivotRow][pivotCol];

    // Update tableau
    const newTableau: Tableau = {
      basicVars: [...currentTableau.basicVars],
      nonBasicVars: [...currentTableau.nonBasicVars],
      coefficients: currentTableau.coefficients.map(row => [...row]),
      rhs: [...currentTableau.rhs],
      z: [...currentTableau.z],
      z0: currentTableau.z0
    };

    // Update basic variables
    newTableau.basicVars[pivotRow] = newTableau.nonBasicVars[pivotCol];

    // Update coefficients and RHS
    for (let i = 0; i < numConstraints; i++) {
      if (i !== pivotRow) {
        const factor = newTableau.coefficients[i][pivotCol] / pivotElement;
        for (let j = 0; j < numVars; j++) {
          newTableau.coefficients[i][j] -= factor * newTableau.coefficients[pivotRow][j];
        }
        newTableau.rhs[i] -= factor * newTableau.rhs[pivotRow];
      }
    }

    // Update z-row
    const zFactor = newTableau.z[pivotCol] / pivotElement;
    for (let j = 0; j < numVars; j++) {
      newTableau.z[j] -= zFactor * newTableau.coefficients[pivotRow][j];
    }
    newTableau.z0 -= zFactor * newTableau.rhs[pivotRow];

    // Normalize pivot row
    for (let j = 0; j < numVars; j++) {
      newTableau.coefficients[pivotRow][j] /= pivotElement;
    }
    newTableau.rhs[pivotRow] /= pivotElement;

    steps.push({
      tableau: newTableau,
      pivot: { row: pivotRow, col: pivotCol },
      enteringVar: newTableau.nonBasicVars[pivotCol],
      leavingVar: currentTableau.basicVars[pivotRow],
      explanation: `Iteración ${iteration}: Pivote en la posición (${pivotRow + 1}, ${pivotCol + 1})`
    });

    currentTableau = newTableau;
    iteration++;
  }

// Add final solution
if (iteration <= 10) {
  const isOptimal = problem.objective.type === 'max' 
    ? currentTableau.z.every(coef => coef >= 0)
    : currentTableau.z.every(coef => coef <= 0);

  // ✅ CORRECCIÓN AQUÍ
  if (problem.objective.type === 'max') {
    currentTableau.z0 *= -1;
  }

  steps.push({
    tableau: currentTableau,
    explanation: isOptimal ? 'Solución óptima encontrada' : 'No se encontró solución óptima'
  });
}


  return steps;
}; 