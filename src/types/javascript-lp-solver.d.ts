declare module 'javascript-lp-solver' {
  export interface Model {
    optimize: string;
    opType: 'max' | 'min';
    constraints: { [key: string]: { [key: string]: number } };
    variables: { [key: string]: { [key: string]: number } };
  }

  export interface Solution {
    feasible: boolean;
    result: number;
    [key: string]: any;
  }

  export const solver: {
    Solve: (model: Model) => Solution;
  };
} 