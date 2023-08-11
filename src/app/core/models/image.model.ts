export interface PuzzlePiece {
  backgroundPosition: string;
  left: number;
  top: number;
  image: string,
  id: string
}

export interface PuzzleDetails {
  PuzzlePieces: PuzzlePiece[],
  puzzleImage: string
}
