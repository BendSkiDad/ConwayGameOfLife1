'use strict'

import * as logic from "./gameOfLifeLogic.js"

export const GameOfLifeBoardGeneration = function (startingBoardExtent, boardContainerElement) {
  let currentBoardExtent = startingBoardExtent

  const rowIndexAttributeName = 'rowIndex'
  const columnIndexAttributeName = 'columnIndex'
  const liveAttributeName = 'live'
  const liveCellCSSClassToken = 'liveCell'
  const gameOfLifeCellCSSClassToken = 'cell'

  function updateCurrentBoardExtentToReflectLiveCells () {
    const extentOfLiveCells = logic.getExtentOfLiveCells()
    currentBoardExtent = logic.getCellExtentThatEncompasses(currentBoardExtent, extentOfLiveCells)
  }

  function getRowIndexFrom (cellTDElement) {
    const rowIndex =
      Number(cellTDElement.getAttribute(rowIndexAttributeName))
    return rowIndex
  }

  function getColumnIndexFrom (cellTDElement) {
    const columnIndex =
      Number(cellTDElement.getAttribute(columnIndexAttributeName))
    return columnIndex
  }

  function getCoordinatesFromClickEventTarget (e) {
    const tdElement = e.target
    return {
      rowIndex: getRowIndexFrom(tdElement),
      columnIndex: getColumnIndexFrom(tdElement)
    }
  }

  function generateBoardHeaderTRElementFrom (leftColumnIndex, rightColumnIndex) {
    const firstTHElement = document.createElement('th')
    firstTHElement.classList.add('noPadding')
    firstTHElement.innerHTML = '&nbsp'
    const rc = document.createElement('tr')
    rc.appendChild(firstTHElement)
    for (let i = leftColumnIndex; i <= rightColumnIndex; i++) {
      const nextTHElement = document.createElement('th')
      nextTHElement.classList.add('noPadding')
      const textNode = document.createTextNode(Math.abs(i % 10))
      nextTHElement.appendChild(textNode)
      rc.appendChild(nextTHElement)
    }
    return rc
  }

  function generateRowElementFrom (rowIndex) {
    const tdElement = document.createElement('td')
    tdElement.classList.add('noPadding')
    const textNode = document.createTextNode(Math.abs(rowIndex % 10))
    tdElement.appendChild(textNode)
    const rc = document.createElement('tr')
    rc.appendChild(tdElement)
    for (let columnIndex = currentBoardExtent.upperLeftCell.columnIndex; columnIndex <= currentBoardExtent.lowerRightCell.columnIndex; columnIndex++) {
      const tdElement = document.createElement('td')
      tdElement.setAttribute(rowIndexAttributeName, rowIndex)
      tdElement.setAttribute(columnIndexAttributeName, columnIndex)
      tdElement.classList.add(gameOfLifeCellCSSClassToken)
      tdElement.addEventListener('click', handleCellClick)
      if (logic.isThereALiveCellAt(rowIndex, columnIndex)) {
        tdElement.setAttribute(liveAttributeName, '')
        tdElement.classList.add(liveCellCSSClassToken)
      } else {
        tdElement.removeAttribute(liveAttributeName)
        tdElement.innerHTML = '&nbsp'
      }
      rc.appendChild(tdElement)
    }
    return rc
  }

  function generateBoardAsTableHtmlElementFrom () {
    const tableElement = document.createElement('table')
    const boardHeaderTRElement =
      generateBoardHeaderTRElementFrom(
        currentBoardExtent.upperLeftCell.columnIndex,
        currentBoardExtent.lowerRightCell.columnIndex)
    tableElement.appendChild(boardHeaderTRElement)
    for (let rowIndex = currentBoardExtent.upperLeftCell.rowIndex; rowIndex <= currentBoardExtent.lowerRightCell.rowIndex; rowIndex++) {
      const rowElement = generateRowElementFrom(rowIndex)
      tableElement.appendChild(rowElement)
    }
    return tableElement
  }

  function handleCellClick (e) {
    const coordinates = getCoordinatesFromClickEventTarget(e)
    logic.toggleCellLiveness(
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
    const boardAsHtmlTableElement = generateBoardAsTableHtmlElementFrom()
    boardContainerElement.replaceChildren(boardAsHtmlTableElement)
  }

  return {
    addRow,
    addColumn,
    updateBoardElement
  }
}
