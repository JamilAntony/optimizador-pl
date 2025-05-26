import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { LPProblem, Point, SimplexStep, Solution } from '../types/lpTypes';
import { generateGraphicalMethodSteps } from '../utils/graphicalMethod';
import { generateSimplexSteps } from '../utils/simplexMethod';
import ProblemInputForm from '../components/ProblemInputForm';
import SimplexMethodSteps from '../components/SimplexMethodSteps';
import GraphicalMethodSteps from '../components/GraphicalMethodSteps';
import Layout from '@/components/Layout';
import type { Model } from 'javascript-lp-solver';
import * as solver from 'javascript-lp-solver';
import { loadSlim } from 'tsparticles-slim';
import Particles from 'react-tsparticles';
import ExportPDFButton from '../components/ExportPDFButton';

const LinearProgrammingPage: React.FC = () => {
  const [variables, setVariables] = useState<string[]>([]);
  const [objective, setObjective] = useState<LPProblem['objective']>({
    coefficients: [],
    type: 'max',
  });
  const [constraints, setConstraints] = useState<LPProblem['constraints']>([]);
  const [solutionMethod, setSolutionMethod] = useState<'graphical' | 'simplex' | null>(null);
  const [graphicalSteps, setGraphicalSteps] = useState<{
    steps: string[];
    feasiblePoints: Point[];
    optimalPoint?: Point;
  } | null>(null);
  const [simplexSteps, setSimplexSteps] = useState<SimplexStep[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const validateInputs = () => {
    if (!variables || variables.length < 2) {
      return 'Debe haber al menos dos variables.';
    }
    if (!objective.coefficients || objective.coefficients.length !== variables.length) {
      return 'La función objetivo debe tener coeficientes para todas las variables.';
    }
    for (const coef of objective.coefficients) {
      if (typeof coef !== 'number' || isNaN(coef)) {
        return 'Todos los coeficientes de la función objetivo deben ser números válidos.';
      }
    }
    if (!constraints || constraints.length < 1) {
      return 'Debe haber al menos una restricción.';
    }
    for (const constraint of constraints) {
      if (!constraint.coefficients || constraint.coefficients.length !== variables.length) {
        return 'Cada restricción debe tener coeficientes para todas las variables.';
      }
      for (const coef of constraint.coefficients) {
        if (typeof coef !== 'number' || isNaN(coef)) {
          return 'Todos los coeficientes de las restricciones deben ser números válidos.';
        }
      }
      if (typeof constraint.value !== 'number' || isNaN(constraint.value)) {
        return 'Todos los valores de las restricciones deben ser números válidos.';
      }
    }
    return null;
  };

  const handleSolve = () => {
    setError(null);
    setGraphicalSteps(null);
    setSimplexSteps(null);
    if (solutionMethod === 'graphical' && variables.length > 2) {
      setError('El método gráfico solo está disponible para problemas de 2 variables.');
      return;
    }
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const model: Model = {
        optimize: 'cost',
        opType: objective.type === 'max' ? 'max' : 'min',
        constraints: {} as Record<string, Record<string, number>>,
        variables: {} as Record<string, Record<string, number>>,
      };
      constraints.forEach((constraint, index) => {
        const constraintName = `c${index + 1}`;
        model.constraints[constraintName] = {
          [constraint.operator]: constraint.value,
        };
      });
      variables.forEach((variable, varIndex) => {
        model.variables[variable] = {};
        constraints.forEach((constraint, constIndex) => {
          model.variables[variable][`c${constIndex + 1}`] = constraint.coefficients[varIndex];
        });
        model.variables[variable]['cost'] = objective.coefficients[varIndex];
      });
      const result = (solver as any).default.Solve(model) as Solution;
      if (!result.feasible) {
        throw new Error('El problema no tiene solución factible');
      }
      if (solutionMethod === 'graphical') {
        const { steps, points, optimal } = generateGraphicalMethodSteps(
          { objective, constraints, variables },
          
        );
        setGraphicalSteps({
          steps,
          feasiblePoints: points,
          optimalPoint: optimal || undefined,
        });
        setSimplexSteps(null);
      } else if (solutionMethod === 'simplex') {
        const steps = generateSimplexSteps(
          { objective, constraints, variables },
          
        );
        setSimplexSteps(steps);
        setGraphicalSteps(null);
      } else {
        setError('Selecciona un método de solución.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al resolver el problema');
      setGraphicalSteps(null);
      setSimplexSteps(null);
    }
  };

  const handleObjectiveChange = (type: 'max' | 'min', coefficients: number[]) => {
    setObjective({ type, coefficients });
  };

  return (
    <Layout>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: 'transparent' },
          fpsLimit: 60,
          particles: {
            number: { value: 40 },
            size: { value: 3 },
            color: { value: "#6366f1" },
            links: {
              enable: true,
              color: "#a5b4fc",
              distance: 150,
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              outModes: { default: "bounce" },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 100 },
              push: { quantity: 4 },
            },
          },
        }}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <div className="relative z-10">
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 rounded-3xl shadow-xl border border-blue-200 p-6 flex flex-col items-center gap-6"
          >
            <h2 className="text-2xl font-bold text-indigo-700 text-center">
              Selecciona el método de solución
            </h2>
            <div className="flex justify-center space-x-6 px-4">
              {['graphical', 'simplex'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => {
                    setSolutionMethod(method as 'graphical' | 'simplex');
                    setGraphicalSteps(null);
                    setSimplexSteps(null);
                    setError(null);
                  }}
                  className={`transition-all duration-300 px-6 py-2 min-w-[140px] font-semibold rounded-xl text-lg tracking-wide ring-2 ring-offset-2
                  ${solutionMethod === method
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white ring-indigo-400 scale-105 shadow-lg'
                      : 'bg-white text-indigo-600 ring-indigo-200 hover:bg-indigo-50 hover:scale-105'}
                      `}
                >
                  {method === 'graphical' ? '📈 Método Gráfico' : '📊 Método Simplex'}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
        {solutionMethod && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 rounded-3xl shadow-xl border border-indigo-200 p-6 sm:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 text-center">
                Configuración del Problema
              </h2>
              <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <ProblemInputForm
                  variables={variables}
                  objective={objective}
                  constraints={constraints}
                  onObjectiveChange={handleObjectiveChange}
                  onConstraintChange={(index, constraint) => {
                    const newConstraints = [...constraints];
                    newConstraints[index] = constraint;
                    setConstraints(newConstraints);
                  }}
                  onAddConstraint={() => {
                    setConstraints([
                      ...constraints,
                      { coefficients: variables.map(() => 0), operator: '<=', value: 0 },
                    ]);
                  }}
                  onRemoveConstraint={(index) => {
                    setConstraints(constraints.filter((_, i) => i !== index));
                  }}
                  onVariablesChange={(newVariables, newCoefficients, newConstraints) => {
                    setVariables(newVariables);
                    setObjective(obj => ({ ...obj, coefficients: newCoefficients }));
                    setConstraints(newConstraints);
                  }}
                />
              </div>
              <div className="flex justify-center pt-6">
                <button
                  onClick={handleSolve}
                  className="group relative inline-flex items-center px-8 py-3 font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg hover:scale-105 transition transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="absolute inset-0 bg-white opacity-10 blur-sm group-hover:opacity-20 transition duration-300" />
                  <span className="relative z-10 text-lg">Resolver Problema</span>
                </button>
              </div>
            </motion.div>
            <div className="flex flex-col gap-8">
              <div id="resultado-pdf">
                {solutionMethod && (
                  <div className="text-center">
                    <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                      Resolviendo por método: {solutionMethod === 'graphical' ? 'Gráfico' : 'Simplex'}
                    </span>
                  </div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-red-100 border border-red-300 rounded-3xl p-6 shadow text-center"
                  >
                    <p className="text-red-700 text-lg font-semibold">{error}</p>
                  </motion.div>
                )}
                {graphicalSteps && solutionMethod === 'graphical' && (
                  <GraphicalMethodSteps
                    objective={objective}
                    constraints={constraints}
                    variables={variables}
                    feasiblePoints={graphicalSteps.feasiblePoints}
                    optimalPoint={graphicalSteps.optimalPoint}
                    steps={graphicalSteps.steps}
                  />
                )}
                {simplexSteps && solutionMethod === 'simplex' && (
                  <SimplexMethodSteps
                    steps={simplexSteps}
                    variables={variables}
                  />
                )}
                {!error && !graphicalSteps && !simplexSteps && (
                  <div className="bg-white/80 rounded-3xl p-8 text-center border border-indigo-100 shadow">
                    <p className="text-indigo-400 text-lg">
                      Ingrese los datos del problema y haga clic en <span className="font-bold text-indigo-600">"Resolver"</span> para ver la solución
                    </p>
                  </div>
                )}
              </div>
              {(graphicalSteps || simplexSteps) && (
                <div className="flex justify-center">
                  <ExportPDFButton targetId="resultado-pdf" filename={`resultado-${solutionMethod}`} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LinearProgrammingPage;
