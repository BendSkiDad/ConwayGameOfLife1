"use strict";

function Cell(rowIndex, columnIndex, live) {
  this.rowIndex = rowIndex;
  this.columnIndex = columnIndex;
  this.live = live;
}

function findMinColumnIndexOf(cells) {
  var minColumnIndex = cells[0].columnIndex;
  for (var i = 1; i < cells.length; i++) {
    if (cells[i].columnIndex < minColumnIndex) {
      minColumnIndex = cells[i].columnIndex;
    }
  }
  return minColumnIndex;
}

function findMinRowIndexOf(cells) {
  var minRowIndex = cells[0].rowIndex;
  for (var i = 1; i < cells.length; i++) {
    if (cells[i].rowIndex < minRowIndex) {
      minRowIndex = cells[i].rowIndex;
    }
  }
  return minRowIndex;
}

function findMaxColumnIndexOf(cells) {
  var maxColumnIndex = cells[0].columnIndex;
  for (var i = 1; i < cells.length; i++) {
    if (cells[i].columnIndex > maxColumnIndex) {
      maxColumnIndex = cells[i].columnIndex;
    }
  }
  return maxColumnIndex;
}

function findMaxRowIndexOf(cells) {
  var maxRowIndex = cells[0].rowIndex;
  for (var i = 1; i < cells.length; i++) {
    if (cells[i].rowIndex > maxRowIndex) {
      maxRowIndex = cells[i].rowIndex;
    }
  }
  return maxRowIndex;
}

function isLiveCellAt(cells, rowIndex, columnIndex) {
  for (var i = 0; i < cells.length; i++) {
    if (isLive(cells[i]) && cells[i].rowIndex === rowIndex && cells[i].columnIndex === columnIndex) {
      return true;
    }
  }
  return false;
}

function generateHeaderOutputRowFrom(leftColumnIndex, rightColumnIndex) {
  var headerOutputRow = "<tr>" + "<th class='noPadding'>" + "&nbsp" + "</th>";
  for (var i = leftColumnIndex; i <= rightColumnIndex; i++) {
      headerOutputRow += "<th class='noPadding'>" + Math.abs(i % 10) + "</th>";
  }
  return headerOutputRow + "</tr>";
}

function generateRowFrom(liveCells, rowIndex, leftColumnIndex, rightColumnIndex) {
  var rowText = "<tr>" + "<td class='noPadding'>" + "<strong>" + Math.abs(rowIndex % 10) + "</strong>" + "</td>";
  for (var columnIndex = leftColumnIndex; columnIndex <= rightColumnIndex; columnIndex++) {
    var TDElement = document.createElement("td");
    TDElement.setAttribute("rowIndex", rowIndex);
    TDElement.setAttribute("columnIndex", columnIndex);
    TDElement.classList.add("cell");
    TDElement.setAttribute("onclick", "handleCellClick(this)");
    if (isLiveCellAt(liveCells, rowIndex, columnIndex)) {
      TDElement.setAttribute("live", "true");
      TDElement.classList.add("liveCell");
    }
    else {
      TDElement.setAttribute("live", "false");
      TDElement.innerHTML = "&nbsp";
    }
    rowText += TDElement.outerHTML;
  }
  return rowText + "</tr>";
}

function generateBoardFrom(liveCells, upperLeftRowIndex, upperLeftColumnIndex, lowerRightRowIndex, lowerRightColumnIndex) {
  var board = "<table>" + generateHeaderOutputRowFrom(upperLeftColumnIndex, lowerRightColumnIndex);
  for (var rowIndex = upperLeftRowIndex; rowIndex <= lowerRightRowIndex; rowIndex++) {
    board += generateRowFrom(liveCells, rowIndex, upperLeftColumnIndex, lowerRightColumnIndex);
  }
  return board + "</table>";
}

function DeriveCellFrom(cellTDElement) {
  var rowIndex = Number(cellTDElement.getAttribute("rowIndex"));
  var columnIndex = Number(cellTDElement.getAttribute("columnIndex"));
  var live = cellTDElement.getAttribute("live");
  var cell = new Cell(rowIndex, columnIndex, live);
  return cell;
}

function DeriveCellsArrayFrom(cellTDElements) {
  var cells = new Array();
  for (var i = 0; i < cellTDElements.length; i++) {
    var cellTDElement = cellTDElements[i];
    var cell = DeriveCellFrom(cellTDElement);
    cells.push(cell);
  }
  return cells;
}

function numberOfLiveNeighbors(rowIndex, columnIndex, liveCells) {
  var count = 0;
  for (var i = 0; i < liveCells.length; i++) {
    var liveCell = liveCells[i];
    if (
      liveCell.rowIndex >= rowIndex - 1
      && liveCell.rowIndex <= rowIndex + 1
      && liveCell.columnIndex >= columnIndex - 1
      && liveCell.columnIndex <= columnIndex + 1
      && !(liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex)
    ) {
      count++;
    }
  }
  return count;
}

function DeriveNewLiveCellsFrom(liveCells) {
    //find indexes just outside the live cells
    var upperLeftRowIndex = findMinRowIndexOf(liveCells) - 1;
    var upperLeftColumnIndex = findMinColumnIndexOf(liveCells) - 1;
    var lowerRightRowIndex = findMaxRowIndexOf(liveCells) + 1;
    var lowerRightColumnIndex = findMaxColumnIndexOf(liveCells) + 1;

    var newLiveCells = new Array();
    for (var rowIndex = upperLeftRowIndex; rowIndex <= lowerRightRowIndex; rowIndex++) {
        for (var columnIndex = upperLeftColumnIndex; columnIndex <= lowerRightColumnIndex; columnIndex++) {
            var liveNeighborCount = numberOfLiveNeighbors(rowIndex, columnIndex, liveCells);
            if ((isLiveCellAt(liveCells, rowIndex, columnIndex) && (liveNeighborCount === 2 || liveNeighborCount === 3)) || liveNeighborCount === 3) {
                newLiveCells.push(new Cell(rowIndex, columnIndex, "true"));
            }
        }
    }
    return newLiveCells;
}

function isLive(cell) {
  return cell.live === "true";
}

function handleCellClick(tdElement) {
    if (tdElement.getAttribute("live") === "true") {
        tdElement.setAttribute("live", "false");
        tdElement.classList.remove("liveCell");
    }
    else {
        tdElement.setAttribute("live", "true");
        tdElement.classList.add("liveCell");
    }
}

var interval;
var isRunning = false;

function Stop() {
    clearInterval(interval);
    isRunning = false;
    var runButton = document.getElementById("btnRun");
    runButton.value = "Run";
    runButton.setAttribute("onclick", "handleRunClick()");
}

function Reset() {
  var liveCells = [];
  document.querySelector("#board").innerHTML = generateBoardFrom(liveCells, 1, 1, 10, 80);
  var iterationCountDiv = document.getElementById("iterationCount");
  iterationCountDiv.textContent = 0;
  if (isRunning) {
    Stop();
  }
}

function UpdateIterationCount() {
  var iterationCountDiv = document.getElementById("iterationCount");
  var iterationCount = Number(iterationCountDiv.textContent);
  iterationCountDiv.textContent = iterationCount + 1;
}

function UpdateBoard() {
  var cellTDElements = document.querySelectorAll(".cell");
  var cells = DeriveCellsArrayFrom(cellTDElements);
  var liveCells = cells.filter(isLive);

  if (liveCells.length === 0) {
    Reset();
    return;
  }

  var newLiveCells = DeriveNewLiveCellsFrom(liveCells);

  if (newLiveCells.length === 0) {
    Reset();
    return;
  }

  var upperLeftRowIndex = Math.min(findMinRowIndexOf(cells), findMinRowIndexOf(newLiveCells));
  var upperLeftColumnIndex = Math.min(findMinColumnIndexOf(cells), findMinColumnIndexOf(newLiveCells));
  var lowerRightRowIndex = Math.max(findMaxRowIndexOf(cells), findMaxRowIndexOf(newLiveCells));
  var lowerRightColumnIndex = Math.max(findMaxColumnIndexOf(cells), findMaxColumnIndexOf(newLiveCells));
  document.querySelector("#board").innerHTML = generateBoardFrom(newLiveCells, upperLeftRowIndex, upperLeftColumnIndex, lowerRightRowIndex, lowerRightColumnIndex);
}

function advanceAStep() {
  UpdateIterationCount();
  UpdateBoard();
}

function handleAdvanceAStepClick() {
    advanceAStep();
}

function handleAddRowClick() {
    var cellTDElements = document.querySelectorAll(".cell");
    var cells = DeriveCellsArrayFrom(cellTDElements);

    var upperLeftRowIndex = findMinRowIndexOf(cells);
    var upperLeftColumnIndex = findMinColumnIndexOf(cells);
    var lowerRightRowIndex = findMaxRowIndexOf(cells);
    var lowerRightColumnIndex = findMaxColumnIndexOf(cells);

    document.querySelector("#board").innerHTML = generateBoardFrom(cells, upperLeftRowIndex, upperLeftColumnIndex, lowerRightRowIndex + 1, lowerRightColumnIndex);
}

function handleAddColumnClick() {
    var cellTDElements = document.querySelectorAll(".cell");
    var cells = DeriveCellsArrayFrom(cellTDElements);

    var upperLeftRowIndex = findMinRowIndexOf(cells);
    var upperLeftColumnIndex = findMinColumnIndexOf(cells);
    var lowerRightRowIndex = findMaxRowIndexOf(cells);
    var lowerRightColumnIndex = findMaxColumnIndexOf(cells);

    document.querySelector("#board").innerHTML = generateBoardFrom(cells, upperLeftRowIndex, upperLeftColumnIndex, lowerRightRowIndex, lowerRightColumnIndex + 1);
}

function handleResetClick() {
    Reset();
}

function handleRunClick() {
    interval = setInterval(advanceAStep, 1000);
    isRunning = true;
    var runButton = document.getElementById("btnRun");
    runButton.value = "Stop";
    runButton.setAttribute("onclick", "handleStopClick()");
}

function handleStopClick() {
    Stop();
}

Reset();
