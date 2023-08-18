export interface Coordinate {
  x: number;
  y: number;
  status: string;
  mine: boolean;
  text?: number;
}

export type CoordinateMine = Pick<Coordinate, 'x' | 'y'>;
