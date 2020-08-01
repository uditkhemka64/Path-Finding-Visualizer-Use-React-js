import { no_of_rows, no_of_columns, currentStatus, getNewGridWithWallToggled} from './PathFindingVisualizer';


export function recursiveDivisionMaze1(rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, type, nodeToAnimate) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }

  if (orientation === "horizontal") {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];
    for (let row = 0; row < no_of_rows; row++) {
      for (let col = 0; col < no_of_columns; col++) {
        let r = row;
        let c = col;
        if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
          let currentId = `node-${r}-${c}`;
          let currentHTMLNode = document.getElementById(currentId);
          let current = currentStatus[r][c];
          current = "wall";
          let node = rowStart;
          node.row = r;
          node.col = c;
          nodeToAnimate.push(node);
        }
      }
    }
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivisionMaze1(rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls, type);
    }
    else {
      recursiveDivisionMaze1(rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls, type);
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivisionMaze1(currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls, type);
    }
    else {
      recursiveDivisionMaze1(currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls, type);
    }
  }
  else {
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];
    for (let row = 0; row < no_of_rows; row++) {
      for (let col = 0; col < no_of_columns; col++) {
        let r = row;
        let c = col;
        if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
          let currentId = `node-${r}-${c}`;
          let currentHTMLNode = document.getElementById(currentId);
          let current = currentStatus[r][c];
          current = "wall";
          let node = rowStart;
          node.row = r;
          node.col = c;
          nodeToAnimate.push(node);
        }
      }
    }
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze1(rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls, type);
    }
    else {
      recursiveDivisionMaze1(rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls, type);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze1(rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls, type);
    }
    else {
      recursiveDivisionMaze1(rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls, type);
    }
  }
}

