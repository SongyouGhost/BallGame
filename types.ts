
export interface Ball {
  id: string;
  color: string;
}

export type Grid = Ball[][];

export interface GameStatus {
  steps: number;
  isWon: boolean;
  heldBall: Ball | null;
}
