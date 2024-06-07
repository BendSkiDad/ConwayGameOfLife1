'use strict'

import * as logic from "./gameOfLifeLogic.js"

export const GameOfLifeBoardGeneration = function (startingBoardExtent, gameOfLifeLogicModule, boardContainerElement) {
  let currentBoardExtent = startingBoardExtent
  const cellWidth = 20
  const cellHeight = cellWidth
  const lineBetweenCellsWidth = 1

  function updateCurrentBoardExtentToReflectLiveCells () {
    const extentOfLiveCells = logic.getExtentOfLiveCells()
    currentBoardExtent = logic.getCellExtentThatEncompasses(currentBoardExtent, extentOfLiveCells)
  }

  function generateBoardAsCanvasHtmlElement () {
    const columnCount = currentBoardExtent.lowerRightCell.columnIndex -
        currentBoardExtent.upperLeftCell.columnIndex + 1
    const rowCount = currentBoardExtent.lowerRightCell.rowIndex -
        currentBoardExtent.upperLeftCell.rowIndex + 1
    const canvasElement = document.createElement('canvas')
    canvasElement.setAttribute('id', 'idCanvas')
    canvasElement.width = (columnCount * cellWidth) + lineBetweenCellsWidth
    canvasElement.height = (rowCount * cellHeight) + lineBetweenCellsWidth
    canvasElement.addEventListener('click', handleCanvasClick)
    const ctx = canvasElement.getContext('2d')
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = lineBetweenCellsWidth
    ctx.fillStyle = 'grey'
    for (let canvasColumnIndex = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
      for (let canvasRowIndex = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
        const xCoord = cellWidth * canvasColumnIndex + lineBetweenCellsWidth / 2
        const yCoord = cellHeight * canvasRowIndex + lineBetweenCellsWidth / 2
        const logicRowIndex = canvasRowIndex + currentBoardExtent.upperLeftCell.rowIndex
        const logicColumnIndex = canvasColumnIndex + currentBoardExtent.upperLeftCell.columnIndex
        if (gameOfLifeLogicModule.isThereALiveCellAt(logicRowIndex, logicColumnIndex)) {
          ctx.fillStyle = 'yellow'
        }
        ctx.fillRect(xCoord, yCoord, cellWidth, cellHeight)
        ctx.strokeRect(xCoord, yCoord, cellWidth, cellHeight)
        ctx.fillStyle = 'grey'
      }
    }
    return canvasElement
  }

  function handleCanvasClick (e) {
    const coordinates = {
      rowIndex: Math.trunc(e.offsetY / (cellHeight + lineBetweenCellsWidth / 2)) + currentBoardExtent.upperLeftCell.rowIndex,
      columnIndex: Math.trunc(e.offsetX / (cellWidth + lineBetweenCellsWidth / 2)) + currentBoardExtent.upperLeftCell.columnIndex
    }
    gameOfLifeLogicModule.toggleCellLiveness(
      coordinates.rowIndex,
      coordinates.columnIndex)
    updateBoardElement()
  }

  function addRow () {
    updateCurrentBoardExtentToReflectLiveCells()
    currentBoardExtent.lowerRightCell.rowIndex += 1
  }

  function addColumn () {
    updateCurrentBoardExtentToReflectLiveCells()
    currentBoardExtent.lowerRightCell.columnIndex += 1
  }

  function updateBoardElement () {
    updateCurrentBoardExtentToReflectLiveCells()
    const boardAsHtmlCanvasElement = generateBoardAsCanvasHtmlElement()
    boardContainerElement.replaceChildren(boardAsHtmlCanvasElement)
  }

  return {
    addRow,
    addColumn,
    updateBoardElement
  }
}
