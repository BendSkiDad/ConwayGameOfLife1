"use strict";

//todo: use filter, map, and reduce where I can
//todo: disable buttons when running
//todo: generate html dynamically instead of with strings
//todo: convert to use revealing module pattern

function LiveCell(rowIndex, columnIndex) {
    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;
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

function isThereALiveCellAt(liveCells, rowIndex, columnIndex) {
    for (var i = 0; i < liveCells.length; i++) {
        if (liveCells[i].rowIndex === rowIndex && liveCells[i].columnIndex === columnIndex) {
            return true;
        }
    }
    return false;
}

function generateBoardHeaderRowFrom(leftColumnIndex, rightColumnIndex) {
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
        if (isThereALiveCellAt(liveCells, rowIndex, columnIndex)) {
            TDElement.setAttribute("live", "");
            TDElement.classList.add("liveCell");
        }
        else {
            TDElement.removeAttribute("live");
            TDElement.innerHTML = "&nbsp";
        }
        rowText += TDElement.outerHTML;
    }
    return rowText + "</tr>";
}

function generateBoardFrom(liveCells, minAndMaxRowAndColumnIndexes) {
    var board = "<table>" + generateBoardHeaderRowFrom(minAndMaxRowAndColumnIndexes.minColumnIndex, minAndMaxRowAndColumnIndexes.maxColumnIndex);
    for (var rowIndex = minAndMaxRowAndColumnIndexes.minRowIndex; rowIndex <= minAndMaxRowAndColumnIndexes.maxRowIndex; rowIndex++) {
        board += generateRowFrom(liveCells, rowIndex, minAndMaxRowAndColumnIndexes.minColumnIndex, minAndMaxRowAndColumnIndexes.maxColumnIndex);
    }
    return board + "</table>";
}

function getRowIndexFrom(cellTDElement) {
    var rowIndex = Number(cellTDElement.getAttribute("rowIndex"));
    return rowIndex;
}

function getColumnIndexFrom(cellTDElement) {
    var columnIndex = Number(cellTDElement.getAttribute("columnIndex"));
    return columnIndex;
}

function DeriveLiveCellsBoard() {
    var cellTDElements = document.querySelectorAll(".cell");
    var liveCells = new Array();
    for (var i = 0; i < cellTDElements.length; i++) {
        var cellTDElement = cellTDElements[i];
        var isLive = cellTDElement.hasAttribute("live");
        if (isLive) {
            var rowIndex = getRowIndexFrom(cellTDElement);
            var columnIndex = getColumnIndexFrom(cellTDElement);
            liveCells.push(new LiveCell(rowIndex, columnIndex));
        }
    }
    return liveCells;
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
            if ((isThereALiveCellAt(liveCells, rowIndex, columnIndex) && (liveNeighborCount === 2 || liveNeighborCount === 3)) || liveNeighborCount === 3) {
                newLiveCells.push(new LiveCell(rowIndex, columnIndex));
            }
        }
    }
    return newLiveCells;
}

function handleCellClick(tdElement) {
    if (tdElement.hasAttribute("live")) {
        tdElement.removeAttribute("live");
        tdElement.classList.remove("liveCell");
    }
    else {
        tdElement.setAttribute("live", "");
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
    var minAndMaxRowAndColumnIndexes = {
        minRowIndex: 1,
        minColumnIndex: 1,
        maxRowIndex: 10,
        maxColumnIndex: 80
    };

    document.querySelector("#board").innerHTML = generateBoardFrom(liveCells, minAndMaxRowAndColumnIndexes);
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

function deriveMinAndMaxRowAndColumnIndexesFromBoard() {
    var cellTDElements = document.querySelectorAll(".cell");
    var arrRowIndexes = Array.from(cellTDElements).map(function (cellTDElement) {
        return getRowIndexFrom(cellTDElement);
    })
    var minRowIndex = Math.min(...arrRowIndexes);
    var maxRowIndex = Math.max(...arrRowIndexes);
    var arrColumnIndexes = Array.from(cellTDElements).map(function (cellTDElement) {
        return getColumnIndexFrom(cellTDElement);
    })
    var minColumnIndex = Math.min(...arrColumnIndexes);
    var maxColumnIndex = Math.max(...arrColumnIndexes);
    return {
        minRowIndex: minRowIndex,
        maxRowIndex: maxRowIndex,
        minColumnIndex: minColumnIndex,
        maxColumnIndex: maxColumnIndex
    }
}

function UpdateBoard() {
    var liveCells = DeriveLiveCellsBoard();
    if (liveCells.length === 0) {
        Reset();
        return;
    }
    var newLiveCells = DeriveNewLiveCellsFrom(liveCells);
    if (newLiveCells.length === 0) {
        Reset();
        return;
    }

    var minAndMaxRowAndColumnIndexes = deriveMinAndMaxRowAndColumnIndexesFromBoard();
    //expand the board if necessary
    minAndMaxRowAndColumnIndexes.minRowIndex = Math.min(minAndMaxRowAndColumnIndexes.minRowIndex, findMinRowIndexOf(newLiveCells));
    minAndMaxRowAndColumnIndexes.minColumnIndex = Math.min(minAndMaxRowAndColumnIndexes.minColumnIndex, findMinColumnIndexOf(newLiveCells));
    minAndMaxRowAndColumnIndexes.maxRowIndex = Math.max(minAndMaxRowAndColumnIndexes.maxRowIndex, findMaxRowIndexOf(newLiveCells));
    minAndMaxRowAndColumnIndexes.maxColumnIndex = Math.max(minAndMaxRowAndColumnIndexes.maxColumnIndex, findMaxColumnIndexOf(newLiveCells));
    document.querySelector("#board").innerHTML = generateBoardFrom(newLiveCells, minAndMaxRowAndColumnIndexes);
}

function advanceAStep() {
    UpdateIterationCount();
    UpdateBoard();
}

function handleAdvanceAStepClick() {
    advanceAStep();
}

function handleAddRowClick() {
    var liveCells = DeriveLiveCellsBoard();
    var minAndMaxRowAndColumnIndexes = deriveMinAndMaxRowAndColumnIndexesFromBoard();
    minAndMaxRowAndColumnIndexes.maxRowIndex += 1;
    document.querySelector("#board").innerHTML = generateBoardFrom(liveCells, minAndMaxRowAndColumnIndexes);
}

function handleAddColumnClick() {
    var liveCells = DeriveLiveCellsBoard();
    var minAndMaxRowAndColumnIndexes = deriveMinAndMaxRowAndColumnIndexesFromBoard();
    minAndMaxRowAndColumnIndexes.maxColumnIndex += 1;
    document.querySelector("#board").innerHTML = generateBoardFrom(liveCells, minAndMaxRowAndColumnIndexes);
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
