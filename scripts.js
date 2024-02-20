"use strict";

//todo: use filter, map, and reduce where I can
//todo: disable buttons when running
//todo: generate html dynamically instead of with strings
//todo: convert to use revealing module pattern

function LiveCell(rowIndex, columnIndex) {
    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;
}

function deriveOuterCoordinatesOf(rowIndexes, columnIndexes) {
    var minRowIndex = Math.min(...rowIndexes);
    var maxRowIndex = Math.max(...rowIndexes);
    var minColumnIndex = Math.min(...columnIndexes);
    var maxColumnIndex = Math.max(...columnIndexes);
    return {
        minRowIndex: minRowIndex,
        maxRowIndex: maxRowIndex,
        minColumnIndex: minColumnIndex,
        maxColumnIndex: maxColumnIndex
    }
}

function deriveOuterCoordinateOfCells(cells) {
    var rowIndexes = cells.map(function (cell) {
        return cell.rowIndex;
    });
    var columnIndexes = cells.map(function (cell) {
        return cell.columnIndex;
    });
    return deriveOuterCoordinatesOf(rowIndexes, columnIndexes);
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

function generateBoardFrom(liveCells, boardCoordinates) {
    var board = "<table>" + generateBoardHeaderRowFrom(boardCoordinates.minColumnIndex, boardCoordinates.maxColumnIndex);
    for (var rowIndex = boardCoordinates.minRowIndex; rowIndex <= boardCoordinates.maxRowIndex; rowIndex++) {
        board += generateRowFrom(liveCells, rowIndex, boardCoordinates.minColumnIndex, boardCoordinates.maxColumnIndex);
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

function DeriveLiveCellsFromBoard() {
    var cellTDElements = document.querySelectorAll(".cell");
    //todo: consider doing this with a map function?
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
    //todo: consider doing this with a filter function?
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
    var outerCoordinatesOfCells = deriveOuterCoordinateOfCells(liveCells);
    outerCoordinatesOfCells.minRowIndex -= 1;
    outerCoordinatesOfCells.minColumnIndex -= 1;
    outerCoordinatesOfCells.maxRowIndex += 1;
    outerCoordinatesOfCells.maxColumnIndex += 1;

    var newLiveCells = new Array();
    for (var rowIndex = outerCoordinatesOfCells.minRowIndex; rowIndex <= outerCoordinatesOfCells.maxRowIndex; rowIndex++) {
        for (var columnIndex = outerCoordinatesOfCells.minColumnIndex; columnIndex <= outerCoordinatesOfCells.maxColumnIndex; columnIndex++) {
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
    var liveCells = [
        //up and left traveler
        new LiveCell(2, 2),
        new LiveCell(2, 3),
        new LiveCell(2, 4),
        new LiveCell(3, 2),
        new LiveCell(4, 3),

        //down and right traveler
        new LiveCell(7, 78),
        new LiveCell(8, 79),
        new LiveCell(9, 77),
        new LiveCell(9, 78),
        new LiveCell(9, 79),

    ];
    var startingBoardCoordinates = {
        minRowIndex: 1,
        minColumnIndex: 1,
        maxRowIndex: 10,
        maxColumnIndex: 80
    };

    document.querySelector("#board").innerHTML = generateBoardFrom(liveCells, startingBoardCoordinates);
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

function deriveBoardCoordinates() {
    var cellTDElements = document.querySelectorAll(".cell");
    var rowIndexes = Array.from(cellTDElements).map(function (cellTDElement) {
        return getRowIndexFrom(cellTDElement);
    })
    var columnIndexes = Array.from(cellTDElements).map(function (cellTDElement) {
        return getColumnIndexFrom(cellTDElement);
    })
    return deriveOuterCoordinatesOf(rowIndexes, columnIndexes);
}

function UpdateBoard() {
    var liveCells = DeriveLiveCellsFromBoard();
    if (liveCells.length === 0) {
        Reset();
        return;
    }
    var newLiveCells = DeriveNewLiveCellsFrom(liveCells);
    if (newLiveCells.length === 0) {
        Reset();
        return;
    }

    var boardCoordinates = deriveBoardCoordinates();
    var outerNewLiveCellCoordinates = deriveOuterCoordinateOfCells(newLiveCells);
    //expand the board if necessary
    boardCoordinates.minRowIndex = Math.min(boardCoordinates.minRowIndex, outerNewLiveCellCoordinates.minRowIndex);
    boardCoordinates.minColumnIndex = Math.min(boardCoordinates.minColumnIndex, outerNewLiveCellCoordinates.minColumnIndex);
    boardCoordinates.maxRowIndex = Math.max(boardCoordinates.maxRowIndex, outerNewLiveCellCoordinates.maxRowIndex);
    boardCoordinates.maxColumnIndex = Math.max(boardCoordinates.maxColumnIndex, outerNewLiveCellCoordinates.maxColumnIndex);
    document.querySelector("#board").innerHTML = generateBoardFrom(newLiveCells, boardCoordinates);
}

function advanceAStep() {
    UpdateIterationCount();
    UpdateBoard();
}

function handleAdvanceAStepClick() {
    advanceAStep();
}

function handleAddRowClick() {
    var liveCells = DeriveLiveCellsFromBoard();
    var boardCoordinates = deriveBoardCoordinates();
    boardCoordinates.maxRowIndex += 1;
    document.querySelector("#board").innerHTML = generateBoardFrom(liveCells, boardCoordinates);
}

function handleAddColumnClick() {
    var liveCells = DeriveLiveCellsFromBoard();
    var boardCoordinates = deriveBoardCoordinates();
    boardCoordinates.maxColumnIndex += 1;
    document.querySelector("#board").innerHTML = generateBoardFrom(liveCells, boardCoordinates);
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
