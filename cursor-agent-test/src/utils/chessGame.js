// Chess Game Logic Utility

export const createInitialBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }
  
  // Place other pieces
  const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: pieceOrder[col], color: 'black' };
    board[7][col] = { type: pieceOrder[col], color: 'white' };
  }
  
  return board;
};

export const isValidPosition = (row, col) => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

export const isPieceAt = (board, row, col) => {
  return isValidPosition(row, col) && board[row][col] !== null;
};

export const isEnemyPiece = (board, row, col, color) => {
  return isPieceAt(board, row, col) && board[row][col].color !== color;
};

export const isFriendlyPiece = (board, row, col, color) => {
  return isPieceAt(board, row, col) && board[row][col].color === color;
};

export const getPossibleMoves = (board, fromRow, fromCol) => {
  const piece = board[fromRow][fromCol];
  if (!piece) return [];
  
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, fromRow, fromCol, piece.color);
    case 'rook':
      return getRookMoves(board, fromRow, fromCol, piece.color);
    case 'knight':
      return getKnightMoves(board, fromRow, fromCol, piece.color);
    case 'bishop':
      return getBishopMoves(board, fromRow, fromCol, piece.color);
    case 'queen':
      return getQueenMoves(board, fromRow, fromCol, piece.color);
    case 'king':
      return getKingMoves(board, fromRow, fromCol, piece.color);
    default:
      return [];
  }
};

const getPawnMoves = (board, row, col, color) => {
  const moves = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  
  // Move forward one square
  if (isValidPosition(row + direction, col) && !isPieceAt(board, row + direction, col)) {
    moves.push([row + direction, col]);
    
    // Move forward two squares from starting position
    if (row === startRow && !isPieceAt(board, row + 2 * direction, col)) {
      moves.push([row + 2 * direction, col]);
    }
  }
  
  // Capture diagonally
  for (const colOffset of [-1, 1]) {
    const newRow = row + direction;
    const newCol = col + colOffset;
    if (isValidPosition(newRow, newCol) && isEnemyPiece(board, newRow, newCol, color)) {
      moves.push([newRow, newCol]);
    }
  }
  
  return moves;
};

const getRookMoves = (board, row, col, color) => {
  const moves = [];
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  
  for (const [rowDir, colDir] of directions) {
    for (let i = 1; i < 8; i++) {
      const newRow = row + i * rowDir;
      const newCol = col + i * colDir;
      
      if (!isValidPosition(newRow, newCol)) break;
      
      if (isPieceAt(board, newRow, newCol)) {
        if (isEnemyPiece(board, newRow, newCol, color)) {
          moves.push([newRow, newCol]);
        }
        break;
      }
      
      moves.push([newRow, newCol]);
    }
  }
  
  return moves;
};

const getKnightMoves = (board, row, col, color) => {
  const moves = [];
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  
  for (const [rowOffset, colOffset] of knightMoves) {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    
    if (isValidPosition(newRow, newCol) && !isFriendlyPiece(board, newRow, newCol, color)) {
      moves.push([newRow, newCol]);
    }
  }
  
  return moves;
};

const getBishopMoves = (board, row, col, color) => {
  const moves = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  
  for (const [rowDir, colDir] of directions) {
    for (let i = 1; i < 8; i++) {
      const newRow = row + i * rowDir;
      const newCol = col + i * colDir;
      
      if (!isValidPosition(newRow, newCol)) break;
      
      if (isPieceAt(board, newRow, newCol)) {
        if (isEnemyPiece(board, newRow, newCol, color)) {
          moves.push([newRow, newCol]);
        }
        break;
      }
      
      moves.push([newRow, newCol]);
    }
  }
  
  return moves;
};

const getQueenMoves = (board, row, col, color) => {
  return [...getRookMoves(board, row, col, color), ...getBishopMoves(board, row, col, color)];
};

const getKingMoves = (board, row, col, color) => {
  const moves = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (const [rowOffset, colOffset] of directions) {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    
    if (isValidPosition(newRow, newCol) && !isFriendlyPiece(board, newRow, newCol, color)) {
      moves.push([newRow, newCol]);
    }
  }
  
  return moves;
};

export const findKing = (board, color) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return [row, col];
      }
    }
  }
  return null;
};

export const isInCheck = (board, color) => {
  const kingPosition = findKing(board, color);
  if (!kingPosition) return false;
  
  const [kingRow, kingCol] = kingPosition;
  const enemyColor = color === 'white' ? 'black' : 'white';
  
  // Check if any enemy piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === enemyColor) {
        const possibleMoves = getPossibleMoves(board, row, col);
        if (possibleMoves.some(([moveRow, moveCol]) => moveRow === kingRow && moveCol === kingCol)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

export const wouldBeInCheck = (board, fromRow, fromCol, toRow, toCol, color) => {
  // Create a copy of the board with the move applied
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[fromRow][fromCol];
  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;
  
  return isInCheck(newBoard, color);
};

export const getValidMoves = (board, fromRow, fromCol) => {
  const piece = board[fromRow][fromCol];
  if (!piece) return [];
  
  const possibleMoves = getPossibleMoves(board, fromRow, fromCol);
  
  // Filter out moves that would put own king in check
  return possibleMoves.filter(([toRow, toCol]) => 
    !wouldBeInCheck(board, fromRow, fromCol, toRow, toCol, piece.color)
  );
};

export const isCheckmate = (board, color) => {
  if (!isInCheck(board, color)) return false;
  
  // Check if any piece can make a move that gets out of check
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const validMoves = getValidMoves(board, row, col);
        if (validMoves.length > 0) {
          return false;
        }
      }
    }
  }
  
  return true;
};

export const isStalemate = (board, color) => {
  if (isInCheck(board, color)) return false;
  
  // Check if player has any valid moves
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const validMoves = getValidMoves(board, row, col);
        if (validMoves.length > 0) {
          return false;
        }
      }
    }
  }
  
  return true;
};

export const makeMove = (board, fromRow, fromCol, toRow, toCol) => {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[fromRow][fromCol];
  
  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;
  
  return newBoard;
};

export const getGameStatus = (board, currentPlayer) => {
  if (isCheckmate(board, currentPlayer)) {
    const winner = currentPlayer === 'white' ? 'Black' : 'White';
    return `Checkmate! ${winner} wins!`;
  }
  
  if (isStalemate(board, currentPlayer)) {
    return 'Stalemate! The game is a draw.';
  }
  
  if (isInCheck(board, currentPlayer)) {
    return `${currentPlayer === 'white' ? 'White' : 'Black'} is in check!`;
  }
  
  return `${currentPlayer === 'white' ? 'White' : 'Black'} to move`;
};

export const convertMoveToNotation = (board, fromRow, fromCol, toRow, toCol) => {
  const piece = board[fromRow][fromCol];
  if (!piece) return '';
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  const fromSquare = files[fromCol] + ranks[fromRow];
  const toSquare = files[toCol] + ranks[toRow];
  
  const isCapture = board[toRow][toCol] !== null;
  const pieceSymbol = piece.type === 'pawn' ? '' : piece.type.charAt(0).toUpperCase();
  
  return `${pieceSymbol}${isCapture ? 'x' : ''}${toSquare}`;
};