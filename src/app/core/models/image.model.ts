export interface PuzzlePiece {
  backgroundPosition: string;
  left: number;
  top: number;
  image: string,
  id: string
}

export interface PuzzleDetails {
  PuzzlePiece: PuzzlePiece[],
  puzzleImage: string
}
