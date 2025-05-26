// src/components/ProblemInputForm.tsx con diseño profesional
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LPProblem, Constraint } from '@/types/lpTypes';

interface ProblemInputFormProps {
  variables: string[];
  objective: LPProblem['objective'];
  constraints: Constraint[];
  onObjectiveChange: (type: 'max' | 'min', coefficients: number[]) => void;
  onConstraintChange: (index: number, constraint: Constraint) => void;
  onAddConstraint: () => void;
  onRemoveConstraint: (index: number) => void;
  onVariablesChange: (variables: string[], newCoefficients: number[], newConstraints: Constraint[]) => void;
}

const MIN_VARIABLES = 2;

const ProblemInputForm: React.FC<ProblemInputFormProps> = ({
  variables,
  objective,
  constraints,
  onObjectiveChange,
  onConstraintChange,
  onAddConstraint,
  onRemoveConstraint,
  onVariablesChange,
}) => {
  const displayValue = (val: number) => (typeof val === 'number' && !isNaN(val) ? val : 0);
  const handleBlur = (value: string, onChange: (v: number) => void) => {
    if (value === '' || value === undefined) onChange(0);
  };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>, value: number) => {
    if (value === 0) e.target.select();
  };
  const handleVariableCountChange = (count: number) => {
    let newCount = Math.max(MIN_VARIABLES, count);
    let newVariables = [...variables];
    if (newCount > variables.length) {
      const alphabet = 'xyzabcdefghijklmnopqrstuvw';
      for (let i = variables.length; i < newCount; i++) {
        newVariables.push(alphabet[i] || `v${i + 1}`);
      }
    } else if (newCount < variables.length) {
      newVariables = newVariables.slice(0, newCount);
    }
    let newCoefficients = [...objective.coefficients];
    if (newCount > newCoefficients.length) {
      for (let i = newCoefficients.length; i < newCount; i++) newCoefficients.push(0);
    } else {
      newCoefficients = newCoefficients.slice(0, newCount);
    }
    let newConstraints = constraints.map(constraint => {
      let newCoefs = [...constraint.coefficients];
      if (newCount > newCoefs.length) {
        for (let i = newCoefs.length; i < newCount; i++) newCoefs.push(0);
      } else {
        newCoefs = newCoefs.slice(0, newCount);
      }
      return { ...constraint, coefficients: newCoefs };
    });
    onVariablesChange(newVariables, newCoefficients, newConstraints);
  };

  const handleVariableNameChange = (index: number, name: string) => {
    const newVariables = [...variables];
    newVariables[index] = name || `v${index + 1}`;
    onVariablesChange(newVariables, objective.coefficients, constraints);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-6"
    >
      {/* Variable Count and Names Section */}
      <div className="w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-sm font-medium text-blue-700 dark:text-blue-200">Cantidad de variables:</label>
          <input
            type="text"
            value={variables.length}
            onChange={e => {
              const val = Number(e.target.value);
              if (!isNaN(val) && val >= MIN_VARIABLES) handleVariableCountChange(val);
            }}
            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          {variables.map((variable, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <label className="text-sm text-blue-700 dark:text-blue-200">Nombre {idx + 1}:</label>
              <input
                type="text"
                value={variable}
                onChange={e => handleVariableNameChange(idx, e.target.value)}
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          ))}
        </div>
      </div>
          
      {/* Objective Function Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Función Objetivo</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Tipo:</label>
            <select
              value={objective.type}
              onChange={(e) => onObjectiveChange(e.target.value as 'max' | 'min', objective.coefficients)}
              className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="max">Maximizar</option>
              <option value="min">Minimizar</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {variables.map((variable, index) => (
              <div key={variable} className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 w-8">{variable}:</label>
                <input
                  type="number"
                  value={displayValue(objective.coefficients[index])}
                  onFocus={e => handleFocus(e, objective.coefficients[index])}
                  onBlur={e => handleBlur(e.target.value, (v) => {
                    const newCoefficients = [...objective.coefficients];
                    newCoefficients[index] = v;
                    onObjectiveChange(objective.type, newCoefficients);
                  })}
                  onChange={(e) => {
                    const newCoefficients = [...objective.coefficients];
                    newCoefficients[index] = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    onObjectiveChange(objective.type, newCoefficients);
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  step="any"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Constraints Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Restricciones</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddConstraint}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Agregar Restricción
          </motion.button>
        </div>
        <div className="space-y-4">
          <AnimatePresence>
            {constraints.map((constraint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              >
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {variables.map((variable, varIndex) => (
                    <div key={variable} className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 w-8">{variable}:</label>
                      <input
                        type="number"
                        value={displayValue(constraint.coefficients[varIndex])}
                        onFocus={e => handleFocus(e, constraint.coefficients[varIndex])}
                        onBlur={e => handleBlur(e.target.value, (v) => {
                          const newCoefficients = [...constraint.coefficients];
                          newCoefficients[varIndex] = v;
                          onConstraintChange(index, { ...constraint, coefficients: newCoefficients });
                        })}
                        onChange={(e) => {
                          const newCoefficients = [...constraint.coefficients];
                          newCoefficients[varIndex] = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          onConstraintChange(index, { ...constraint, coefficients: newCoefficients });
                        }}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        step="any"
                      />
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <select
                      value={constraint.operator}
                      onChange={(e) => onConstraintChange(index, { ...constraint, operator: e.target.value as Constraint['operator'] })}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="<=">≤</option>
                      <option value=">=">≥</option>
                      <option value="=">=</option>
                    </select>
                    <input
                      type="number"
                      value={displayValue(constraint.value)}
                      onFocus={e => handleFocus(e, constraint.value)}
                      onBlur={e => handleBlur(e.target.value, (v) => {
                        onConstraintChange(index, { ...constraint, value: v });
                      })}
                      onChange={(e) => {
                        let newValue: number = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        onConstraintChange(index, { ...constraint, value: newValue });
                      }}
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      step="any"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveConstraint(index)}
                  className="ml-4 inline-flex items-center p-2 text-white bg-red-500 hover:bg-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  title="Eliminar restricción"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemInputForm;
