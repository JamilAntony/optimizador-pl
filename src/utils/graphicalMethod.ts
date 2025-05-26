import type { Point, Constraint, LPProblem } from '@/types/lpTypes';

export const generateGraphicalMethodSteps = (
  problem: LPProblem,
): {
  steps: string[];
  points: Point[];
  optimal: Point | null;
} => {
  if (problem.variables.length !== 2) {
    return {
      steps: ['El método gráfico solo está disponible para problemas con 2 variables.'],
      points: [],
      optimal: null
    };
  }

  const steps: string[] = [];
  const points: Point[] = [];
  let optimal: Point | null = null;

  // Step 1: Plot constraints
  steps.push('1. Graficar las restricciones:');
  problem.constraints.forEach((constraint: Constraint, index: number) => {
    steps.push(`   ${index + 1}. ${formatConstraint(constraint)}`);
  });

  // Step 2: Find intersection points
  steps.push('\n2. Encontrar los puntos de intersección:');
  
  // Add points from constraint intersections
  for (let i = 0; i < problem.constraints.length; i++) {
    for (let j = i + 1; j < problem.constraints.length; j++) {
      const c1 = problem.constraints[i];
      const c2 = problem.constraints[j];
      
      // Solve system of equations
      const det = c1.coefficients[0] * c2.coefficients[1] - c1.coefficients[1] * c2.coefficients[0];
      if (Math.abs(det) > 1e-10) {
        const x = (c1.value * c2.coefficients[1] - c2.value * c1.coefficients[1]) / det;
        const y = (c1.coefficients[0] * c2.value - c2.coefficients[0] * c1.value) / det;
        
        // Check if point satisfies all constraints
        const isFeasible = isPointFeasible(x, y, problem.constraints);

        if (isFeasible && x >= -1e-10 && y >= -1e-10) {
          const point: Point = {
            x: Math.max(0, x),
            y: Math.max(0, y),
            label: `(${x.toFixed(2)}, ${y.toFixed(2)})`
          };
          points.push(point);
          steps.push(`   Punto de intersección: ${point.label}`);
        }
      }
    }
  }

  // Add points from axis intersections
  problem.constraints.forEach((constraint) => {
    // x-axis intersection
    if (Math.abs(constraint.coefficients[0]) > 1e-10) {
      const x = constraint.value / constraint.coefficients[0];
      const y = 0;
      if (x >= 0 && isPointFeasible(x, y, problem.constraints)) {
        const point: Point = { x, y, label: `(${x.toFixed(2)}, 0)` };
        points.push(point);
        steps.push(`   Punto de intersección con eje x: ${point.label}`);
      }
    }
    
    // y-axis intersection
    if (Math.abs(constraint.coefficients[1]) > 1e-10) {
      const x = 0;
      const y = constraint.value / constraint.coefficients[1];
      if (y >= 0 && isPointFeasible(x, y, problem.constraints)) {
        const point: Point = { x, y, label: `(0, ${y.toFixed(2)})` };
        points.push(point);
        steps.push(`   Punto de intersección con eje y: ${point.label}`);
      }
    }
  });

  // Add origin if feasible
  if (isPointFeasible(0, 0, problem.constraints)) {
    const origin: Point = { x: 0, y: 0, label: '(0, 0)' };
    points.push(origin);
    steps.push('   Punto de origen: (0, 0)');
  }

  // Step 3: Find optimal point
  steps.push('\n3. Evaluar la función objetivo en cada punto factible:');
  let bestValue = problem.objective.type === 'max' ? -Infinity : Infinity;
  points.forEach(point => {
    const value = problem.objective.coefficients[0] * point.x + problem.objective.coefficients[1] * point.y;
    steps.push(`   En ${point.label}: ${value.toFixed(2)}`);
    
    if ((problem.objective.type === 'max' && value > bestValue) ||
        (problem.objective.type === 'min' && value < bestValue)) {
      bestValue = value;
      optimal = { ...point };
    }
  });

  // Step 4: Conclusion
  if (optimal) {
    steps.push(`\n4. Solución óptima: ${optimal}`);
    steps.push(`   Valor objetivo: ${bestValue.toFixed(2)}`);
  } else {
    steps.push('\n4. No se encontró solución óptima');
  }

  return { steps, points, optimal };
};

// Helper function to check if a point is feasible
const isPointFeasible = (x: number, y: number, constraints: Constraint[]): boolean => {
  return constraints.every(constraint => {
    const value = constraint.coefficients[0] * x + constraint.coefficients[1] * y;
    switch (constraint.operator) {
      case '<=': return value <= constraint.value + 1e-10;
      case '>=': return value >= constraint.value - 1e-10;
      case '=': return Math.abs(value - constraint.value) < 1e-10;
    }
  });
};

const formatConstraint = (constraint: Constraint) => {
  return constraint.coefficients
    .map((coef, i) => `${coef}x${i + 1}`)
    .join(' + ') + ` ${constraint.operator} ${constraint.value}`;
}; 