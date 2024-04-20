"use strict";

const GameOfLifeBoardGeneration_HtmlTable = function(gameOfLifeLogicModule, startingBoardCoordinates) {
  const rowIndexAttributeName = "rowIndex";
  const columnIndexAttributeName = "columnIndex";
  const liveAttributeName = "live";
  const liveCellCSSClassToken = "liveCell";
  const gameOfLifeCellCSSClassToken = "cell";

  let currentBoardOuterCoordinates = startingBoardCoordinates;

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

  function getRowIndexFrom(cellTDElement) {
    const rowIndex =
      Number(cellTDElement.getAttribute(rowIndexAttributeName));
    return rowIndex;
  }

  function getColumnIndexFrom(cellTDElement) {
    const columnIndex =
      Number(cellTDElement.getAttribute(columnIndexAttributeName));
    return columnIndex;
  }

  function getCoordinatesFromClickEventTarget(e) {
    const tdElement = e.target;
    return {
      rowIndex: getRowIndexFrom(tdElement),
      columnIndex: getColumnIndexFrom(tdElement)
    };
  }

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

  function addRow() {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    currentBoardOuterCoordinates.maxRowIndex += 1;
  }

  function addColumn() {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    currentBoardOuterCoordinates.maxColumnIndex += 1;
  }

  function deriveBoardElement(fnHandleCellClick) {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    const boardAsHtmlTableElement =
      generateBoardAsTableHtmlElementFrom(fnHandleCellClick);
    return boardAsHtmlTableElement;
  }

  return {
    getCoordinatesFromClickEventTarget: getCoordinatesFromClickEventTarget,
    addRow: addRow,
    addColumn: addColumn,
    deriveBoardElement: deriveBoardElement
  };
};

const GameOfLifeBoardGeneration_Canvas = function(gameOfLifeLogicModule, startingBoardCoordinates) {
  let currentBoardOuterCoordinates = startingBoardCoordinates;

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

  function generateBoardAsCanvasHtmlElementFrom(fnCanvasClickHandler) {
    const canvasElement = document.createElement("canvas");
    const columnCount = currentBoardOuterCoordinates.maxColumnIndex - currentBoardOuterCoordinates.minColumnIndex + 1;
    const rowCount = currentBoardOuterCoordinates.maxRowIndex - currentBoardOuterCoordinates.minRowIndex + 1;
    const columnWidth = 10;
    const rowHeight = 13;
    canvasElement.setAttribute("id", "idCanvas");
    canvasElement.width = columnCount * columnWidth + columnCount - 1;
    canvasElement.height = rowCount * rowHeight + rowCount - 1;
    canvasElement.addEventListener("click", fnCanvasClickHandler);
    const ctx = canvasElement.getContext("2d");
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.fillStyle = "grey";
    for(let canvasColumnIndex = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
      for(let canvasRowIndex = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
        let xCoord = canvasColumnIndex * (columnWidth + 1);
        let yCoord = canvasRowIndex * (rowHeight + 1);
        ctx.strokeRect(xCoord, yCoord, columnWidth, rowHeight);
        if(gameOfLifeLogicModule.isThereALiveCellAt(canvasRowIndex + currentBoardOuterCoordinates.minRowIndex, canvasColumnIndex + currentBoardOuterCoordinates.minColumnIndex)) {
          ctx.fillStyle = "yellow";
        }
        ctx.fillRect(xCoord, yCoord, columnWidth, rowHeight);
        ctx.fillStyle = "grey";
      }
    }
    return canvasElement;
  }

  function getCoordinatesFromClickEventTarget(e) {
    

  }

  function addRow() {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    currentBoardOuterCoordinates.maxRowIndex += 1;
  }

  function addColumn() {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    currentBoardOuterCoordinates.maxColumnIndex += 1;
  }

  function deriveBoardElement(fnHandleCanvasClick) {
    updateCurrentBoardOuterCoordinatesToReflectLiveCells();
    const boardAsHtmlCanvasElement =
      generateBoardAsCanvasHtmlElementFrom(fnHandleCanvasClick);
    return boardAsHtmlCanvasElement;
  }

  return {
    getCoordinatesFromClickEventTarget: getCoordinatesFromClickEventTarget,
    addRow: addRow,
    addColumn: addColumn,
    deriveBoardElement: deriveBoardElement
  };
};
