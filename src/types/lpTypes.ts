export type Constraint = {
  coefficients: number[];
  operator: '<=' | '>=' | '=';
  value: number;
};

export type LPProblem = {
  objective: {
    coefficients: number[];
    type: 'max' | 'min';
  };
  constraints: Constraint[];
  variables: string[];
};

export type Point = {
  x: number;
  y: number;
  label: string;
};

export type Solution = {
  feasible: boolean;
  [key: string]: any;
};

export interface Tableau {
  basicVars: string[];
  nonBasicVars: string[];
  coefficients: number[][];
  rhs: number[];
  z: number[];
  z0: number;
}

export interface SimplexStep {
  tableau: Tableau;
  pivot?: {
    row: number;
    col: number;
  };
  enteringVar?: string;
  leavingVar?: string;
  explanation: string;
} 
