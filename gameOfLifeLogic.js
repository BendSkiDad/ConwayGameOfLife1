'use strict'

export class Cell {
  constructor (rowIndex, columnIndex) {
    this.rowIndex = rowIndex
    this.columnIndex = columnIndex
  }

  isNeighborOf(rowIndex, columnIndex) {
    return this.rowIndex >= rowIndex - 1 &&
      this.rowIndex <= rowIndex + 1 &&
      this.columnIndex >= columnIndex - 1 &&
      this.columnIndex <= columnIndex + 1
  }

  isMe(rowIndex, columnIndex) {
    return this.rowIndex === rowIndex && this.columnIndex === columnIndex
  }
}

export class CellExtent {
  upperLeftCell
  lowerRightCell

  constructor(upperLeftCell, lowerRightCell) {
      this.upperLeftCell = upperLeftCell
      this.lowerRightCell = lowerRightCell
  }
}

function incrementCellExtent (target, increment) {
  target.upperLeftCell.rowIndex -= increment
  target.upperLeftCell.columnIndex -= increment
  target.lowerRightCell.rowIndex += increment
  target.lowerRightCell.columnIndex += increment
  return target
}

export function getCellExtentThatEncompasses(first, second) {
  const upperLeftRowIndex = Math.min(first.upperLeftCell.rowIndex, second.upperLeftCell.rowIndex)
  const upperLeftColumnIndex = Math.min(first.upperLeftCell.columnIndex, second.upperLeftCell.columnIndex)        
  const lowerRightRowIndex = Math.max(first.lowerRightCell.rowIndex, second.lowerRightCell.rowIndex)
  const lowerRightColumnIndex = Math.max(first.lowerRightCell.columnIndex, second.lowerRightCell.columnIndex)
  const upperLeftCell = new Cell(upperLeftRowIndex, upperLeftColumnIndex)
  const lowerRightCell = new Cell(lowerRightRowIndex, lowerRightColumnIndex)
  const rc = new CellExtent(upperLeftCell, lowerRightCell)
  return rc
}

let liveCells = []
let iterationCount = 0

export function getExtentOfLiveCells () {
  const rowIndexes = liveCells.map(function (cell) {
    return cell.rowIndex
  })
  const columnIndexes = liveCells.map(function (cell) {
    return cell.columnIndex
  })
  const minRowIndex = Math.min(...rowIndexes)
  const maxRowIndex = Math.max(...rowIndexes)
  const minColumnIndex = Math.min(...columnIndexes)
  const maxColumnIndex = Math.max(...columnIndexes)

  const upperLeftCell = new Cell(minRowIndex, minColumnIndex)
  const lowerRightCell = new Cell(maxRowIndex, maxColumnIndex)
  const rc = new CellExtent(upperLeftCell, lowerRightCell)
  return rc
}

export const TwoDimensionalGameOfLifeLogic = function (arrBornNeighborCount, arrSurvivesNeighborCount) {

  function addSimpleGliderGoingUpAndLeft (rowIndex, columnIndex) {
    liveCells.push(
      new Cell(rowIndex, columnIndex),
      new Cell(rowIndex, columnIndex + 1),
      new Cell(rowIndex, columnIndex + 2),
      new Cell(rowIndex + 1, columnIndex),
      new Cell(rowIndex + 2, columnIndex + 1))
  }

  function addSimpleGliderGoingDownAndRight (rowIndex, columnIndex) {
    liveCells.push(
      new Cell(rowIndex, columnIndex + 1),
      new Cell(rowIndex + 1, columnIndex + 2),
      new Cell(rowIndex + 2, columnIndex),
      new Cell(rowIndex + 2, columnIndex + 1),
      new Cell(rowIndex + 2, columnIndex + 2))
  }

  function isThereALiveCellAt (rowIndex, columnIndex) {
    return liveCells.some(function(liveCell) {
      return liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex
    })
  }

  function deriveNumberOfLiveNeighbors (rowIndex, columnIndex) {
    const liveNeighborCells = liveCells.filter(function (liveCell) {
      return liveCell.isNeighborOf(rowIndex, columnIndex) && !liveCell.isMe(rowIndex, columnIndex)
    })
    return liveNeighborCells.length
  }

  function deriveNextSetOfLiveCellsFromCurrentLiveCells () {
    // find indexes just outside the live cells
    const extentOfLiveCellsExpandedBy1 = incrementCellExtent(getExtentOfLiveCells(), 1)

    const newLiveCells = []
    for (let rowIndex = extentOfLiveCellsExpandedBy1.upperLeftCell.rowIndex; rowIndex <= extentOfLiveCellsExpandedBy1.lowerRightCell.rowIndex; rowIndex++) {
      for (let columnIndex = extentOfLiveCellsExpandedBy1.upperLeftCell.columnIndex; columnIndex <= extentOfLiveCellsExpandedBy1.lowerRightCell.columnIndex; columnIndex++) {
        const liveNeighborCount =
          deriveNumberOfLiveNeighbors(rowIndex, columnIndex)
        if ((isThereALiveCellAt(rowIndex, columnIndex) && arrSurvivesNeighborCount.includes(liveNeighborCount)) || arrBornNeighborCount.includes(liveNeighborCount)) {
          newLiveCells.push(new Cell(rowIndex, columnIndex))
        }
      }
    }
    return newLiveCells
  }

  function advanceOneStep () {
    liveCells = deriveNextSetOfLiveCellsFromCurrentLiveCells()
    iterationCount++
  }

  function toggleCellLiveness (rowIndex, columnIndex) {
    const index = liveCells.findIndex(function (liveCell) {
      return liveCell.isMe(rowIndex, columnIndex)
    })
    if (index === -1) {
      liveCells.push(new Cell(rowIndex, columnIndex))
    } else {
      liveCells.splice(index, 1)
    }
  }

  function clearLiveCells () {
    liveCells = []
  }

  function getIterationCount () {
    return iterationCount
  }

  function getBornAndSuvivesRule () {
    return {
      arrBornNeighborCount,
      arrSurvivesNeighborCount
    }
  }

  return {
    addSimpleGliderGoingUpAndLeft,
    addSimpleGliderGoingDownAndRight,
    isThereALiveCellAt,
    advanceOneStep,
    toggleCellLiveness,
    clearLiveCells,
    getIterationCount,
    getBornAndSuvivesRule
  }
}
