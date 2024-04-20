"use strict";

const GameOfLifeBoardGeneration_HtmlTable = function(gameOfLifeLogicModule, startingBoardCoordinates) {
  const rowIndexAttributeName = "rowIndex";
  const columnIndexAttributeName = "columnIndex";
  const liveAttributeName = "live";
  const liveCellCSSClassToken = "liveCell";
  const gameOfLifeCellCSSClassToken = "cell";

  let currentBoardOuterCoordinates = startingBoardCoordinates;

  function generateBoardHeaderTRElementFrom(leftColumnIndex, rightColumnIndex) {
    const firstTHElement = document.createElement("th");
    firstTHElement.classList.add("noPadding");
    firstTHElement.innerHTML = "&nbsp";
    const rc = document.createElement("tr");
    rc.appendChild(firstTHElement);
    for (let i = leftColumnIndex; i <= rightColumnIndex; i++) {
        const nextTHElement = document.createElement("th");
        nextTHElement.classList.add("noPadding");
        const textNode = document.createTextNode(Math.abs(i % 10));
        nextTHElement.appendChild(textNode);
        rc.appendChild(nextTHElement);
    }
    return rc;
  }

  function generateRowElementFrom(
        rowIndex,
        fnHandleCellClick) {
    const tdElement = document.createElement("td");
    tdElement.classList.add("noPadding");
    const textNode = document.createTextNode(Math.abs(rowIndex % 10));
    tdElement.appendChild(textNode);
    const rc = document.createElement("tr");
    rc.appendChild(tdElement);
    for (let columnIndex = currentBoardOuterCoordinates.minColumnIndex; columnIndex <= currentBoardOuterCoordinates.maxColumnIndex; columnIndex++) {
        const tdElement = document.createElement("td");
        tdElement.setAttribute(rowIndexAttributeName, rowIndex);
        tdElement.setAttribute(columnIndexAttributeName, columnIndex);
        tdElement.classList.add(gameOfLifeCellCSSClassToken);
        tdElement.addEventListener("click", fnHandleCellClick);
        if (gameOfLifeLogicModule.isThereALiveCellAt(rowIndex, columnIndex)) {
            tdElement.setAttribute(liveAttributeName, "");
            tdElement.classList.add(liveCellCSSClassToken);
        }
        else {
            tdElement.removeAttribute(liveAttributeName);
            tdElement.innerHTML = "&nbsp";
        }
        rc.appendChild(tdElement);
    }
    return rc;
  }

  function generateBoardAsTableHtmlElementFrom(fnHandleCellClick) {
    const tableElement = document.createElement("table");
    const boardHeaderTRElement =
      generateBoardHeaderTRElementFrom(
        currentBoardOuterCoordinates.minColumnIndex,
        currentBoardOuterCoordinates.maxColumnIndex);
    tableElement.appendChild(boardHeaderTRElement);
    for (let rowIndex = currentBoardOuterCoordinates.minRowIndex; rowIndex <= currentBoardOuterCoordinates.maxRowIndex; rowIndex++) {
        const rowElement =
          generateRowElementFrom(
            rowIndex,
            fnHandleCellClick);
        tableElement.appendChild(rowElement);
    }
    return tableElement;
  }

  function updateCurrentBoardOuterCoordinatesToReflectLiveCells() {
    const outerLiveCellCoordinates =
      gameOfLifeLogicModule.outerCoordinatesOfLiveCells();

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

  function deriveOuterCoordinatesOfExistingBoard() {
    return currentBoardOuterCoordinates;
  }

  function addRow() {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    const boardOuterCoordinates = deriveOuterCoordinatesOfExistingBoard();
    boardOuterCoordinates.maxRowIndex += 1;
  }

  function addColumn() {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    const boardOuterCoordinates = deriveOuterCoordinatesOfExistingBoard();
    boardOuterCoordinates.maxColumnIndex += 1;
  }

  function deriveBoardElement(fnHandleCellClick) {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    const boardAsHtmlTableElement =
      generateBoardAsTableHtmlElementFrom(fnHandleCellClick);
    return boardAsHtmlTableElement;
  }

  return {
    addRow: addRow,
    addColumn: addColumn,
    deriveBoardElement: deriveBoardElement
  };
};