declare module 'react-plotly.js' {
  import { Component } from 'react';

  interface PlotProps {
    data: Array<{
      x: number[];
      y: number[];
      type: string;
      mode?: string;
      name?: string;
      text?: string[];
      hoverinfo?: string;
    }>;
    layout: {
      title?: string;
      xaxis?: { title?: string };
      yaxis?: { title?: string };
      [key: string]: any;
    };
    style?: React.CSSProperties;
  }

  export default class Plot extends Component<PlotProps> {}
} 