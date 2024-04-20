"use strict";

const GameOfLifeBoardGeneration_Canvas = function (gameOfLifeLogicModule, startingBoardCoordinates, boardContainerElement) {
  const currentBoardOuterCoordinates = startingBoardCoordinates;
  const cellWidth = 13;
  const cellHeight = 13;
  const lineBetweenCellsWidth = 1;

  function updateCurrentBoardOuterCoordinatesToReflectLiveCells() {
    const outerLiveCellCoordinates = gameOfLifeLogicModule.outerCoordinatesOfLiveCells();

    //expand currrent board outer coordinates if necessary
    currentBoardOuterCoordinates.minRowIndex =
      Math.min(
        currentBoardOuterCoordinates.minRowIndex,
        outerLiveCellCoordinates.minRowIndex);
    currentBoardOuterCoordinates.minColumnIndex =
      Math.min(
        currentBoardOuterCoordinates.minColumnIndex,
        outerLiveCellCoordinates.minColumnIndex);
    currentBoardOuterCoordinates.maxRowIndex =
      Math.max(
        currentBoardOuterCoordinates.maxRowIndex,
        outerLiveCellCoordinates.maxRowIndex);
    currentBoardOuterCoordinates.maxColumnIndex =
      Math.max(
        currentBoardOuterCoordinates.maxColumnIndex,
        outerLiveCellCoordinates.maxColumnIndex);
  }

  function generateBoardAsCanvasHtmlElementFrom() {
    const canvasElement = document.createElement("canvas");
    const columnCount = currentBoardOuterCoordinates.maxColumnIndex -
      currentBoardOuterCoordinates.minColumnIndex + 1;
    const rowCount = currentBoardOuterCoordinates.maxRowIndex -
      currentBoardOuterCoordinates.minRowIndex + 1;
    canvasElement.setAttribute("id", "idCanvas");
    canvasElement.width = columnCount * cellWidth + columnCount - 1;
    canvasElement.height = rowCount * cellHeight + rowCount - 1;
    canvasElement.addEventListener("click", handleCanvasClick);
    const ctx = canvasElement.getContext("2d");
    ctx.strokeStyle = "blue";
    ctx.lineWidth = lineBetweenCellsWidth;
    ctx.fillStyle = "grey";
    for (let canvasColumnIndex = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
      for (let canvasRowIndex = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
        let xCoord = canvasColumnIndex * (cellWidth + 1);
        let yCoord = canvasRowIndex * (cellHeight + 1);
        ctx.strokeRect(xCoord, yCoord, cellWidth, cellHeight);
        let logicRowIndex = canvasRowIndex + currentBoardOuterCoordinates.minRowIndex;
        let logicColumnIndex = canvasColumnIndex + currentBoardOuterCoordinates.minColumnIndex;
        if (gameOfLifeLogicModule.isThereALiveCellAt(logicRowIndex, logicColumnIndex)) {
          ctx.fillStyle = "yellow";
        }
        ctx.fillRect(xCoord, yCoord, cellWidth, cellHeight);
        ctx.fillStyle = "grey";
      }
    }
    return canvasElement;
  }

  function addRow() {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    currentBoardOuterCoordinates.maxRowIndex += 1;
  }

  function addColumn() {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    currentBoardOuterCoordinates.maxColumnIndex += 1;
  }

  function updateBoardElement() {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    const boardAsHtmlCanvasElement = generateBoardAsCanvasHtmlElementFrom();
    boardContainerElement.replaceChildren(boardAsHtmlCanvasElement);
  }

  function handleCanvasClick(e) {
    const coordinates = {
      rowIndex: Math.trunc(e.offsetY / (cellHeight + lineBetweenCellsWidth)) + currentBoardOuterCoordinates.minRowIndex,
      columnIndex: Math.trunc(e.offsetX / (cellWidth + lineBetweenCellsWidth)) + currentBoardOuterCoordinates.minColumnIndex
    };
    gameOfLifeLogicModule.toggleCellLiveness(
      coordinates.rowIndex,
      coordinates.columnIndex);
    updateBoardElement();
  }

  return {
    addRow: addRow,
    addColumn: addColumn,
    updateBoardElement: updateBoardElement
  };
};
