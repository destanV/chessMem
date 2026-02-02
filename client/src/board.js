const pieceThemePath = "/public/images/fresca/{piece}.svg"; 

export const boardConfigs = {
  view: {
    draggable: false,
    dropOffBoard: "trash",
    sparePieces: false,
    pieceTheme: pieceThemePath,
  },
  play: {
    draggable: true,
    dropOffBoard: "trash",
    sparePieces: true,
    pieceTheme: pieceThemePath,
  }
};

export function createBoard(elementId, config) {
  return Chessboard(elementId, config);
}