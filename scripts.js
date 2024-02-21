"use strict";

//todo: generate html dynamically instead of with strings
//todo: store the live cells in the GameOfLifeLogic module and access them there instead of generating the live cells from the Html. This will require adding or removing a cell upon click of the TD element

var GridUtilities = function () {
    function deriveMinAndMaxRowAndColumnIndexesFrom(rowIndexes, columnIndexes) {
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

    return {
        deriveMinAndMaxRowAndColumnIndexesFrom: deriveMinAndMaxRowAndColumnIndexesFrom
    }
}();

var GameOfLifeLogic = function () {
    function LiveCell(rowIndex, columnIndex) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }

    function deriveOuterCoordinatesOfCells(cells) {
        var rowIndexes = cells.map(function (cell) {
            return cell.rowIndex;
        });
        var columnIndexes = cells.map(function (cell) {
            return cell.columnIndex;
        });
        return GridUtilities.deriveMinAndMaxRowAndColumnIndexesFrom(rowIndexes, columnIndexes);
    }

    function isThereALiveCellAt(liveCells, rowIndex, columnIndex) {
        var matchingLiveCells = liveCells.filter(function (liveCell) {
            return liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex
        });
        return matchingLiveCells.length;
    }

    function deriveNumberOfLiveNeighbors(rowIndex, columnIndex, liveCells) {
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

    function deriveNewLiveCellsFrom(liveCells) {
        //find indexes just outside the live cells
        var outerCoordinatesOfCells = deriveOuterCoordinatesOfCells(liveCells);
        outerCoordinatesOfCells.minRowIndex -= 1;
        outerCoordinatesOfCells.minColumnIndex -= 1;
        outerCoordinatesOfCells.maxRowIndex += 1;
        outerCoordinatesOfCells.maxColumnIndex += 1;

        var newLiveCells = new Array();
        for (var rowIndex = outerCoordinatesOfCells.minRowIndex; rowIndex <= outerCoordinatesOfCells.maxRowIndex; rowIndex++) {
            for (var columnIndex = outerCoordinatesOfCells.minColumnIndex; columnIndex <= outerCoordinatesOfCells.maxColumnIndex; columnIndex++) {
                var liveNeighborCount = deriveNumberOfLiveNeighbors(rowIndex, columnIndex, liveCells);
                if ((isThereALiveCellAt(liveCells, rowIndex, columnIndex) && (liveNeighborCount === 2 || liveNeighborCount === 3)) || liveNeighborCount === 3) {
                    newLiveCells.push(new LiveCell(rowIndex, columnIndex));
                }
            }
        }
        return newLiveCells;
    }

    return {
        LiveCell: LiveCell,
        deriveOuterCoordinatesOfCells: deriveOuterCoordinatesOfCells,
        isThereALiveCellAt: isThereALiveCellAt,
        deriveNewLiveCellsFrom: deriveNewLiveCellsFrom
    }
}();

var GameOfLifeHtmlGeneration_HtmlTable = function () {
    function getRowIndexFrom(cellTDElement) {
        var rowIndex = Number(cellTDElement.getAttribute("rowIndex"));
        return rowIndex;
    }

    function getColumnIndexFrom(cellTDElement) {
        var columnIndex = Number(cellTDElement.getAttribute("columnIndex"));
        return columnIndex;
    }

    function updateIterationCount() {
        var iterationCountDiv = document.getElementById("iterationCount");
        var iterationCount = Number(iterationCountDiv.textContent);
        iterationCountDiv.textContent = iterationCount + 1;
    }

    function generateBoardHeaderHtmlRowFrom(leftColumnIndex, rightColumnIndex) {
        var headerOutputRow = "<tr>" + "<th class='noPadding'>" + "&nbsp" + "</th>";
        for (var i = leftColumnIndex; i <= rightColumnIndex; i++) {
            headerOutputRow += "<th class='noPadding'>" + Math.abs(i % 10) + "</th>";
        }
        return headerOutputRow + "</tr>";
    }

    function generateRowHtmlFrom(liveCells, rowIndex, leftColumnIndex, rightColumnIndex) {
        var rowText = "<tr>" + "<td class='noPadding'>" + "<strong>" + Math.abs(rowIndex % 10) + "</strong>" + "</td>";
        for (var columnIndex = leftColumnIndex; columnIndex <= rightColumnIndex; columnIndex++) {
            var TDElement = document.createElement("td");
            TDElement.setAttribute("rowIndex", rowIndex);
            TDElement.setAttribute("columnIndex", columnIndex);
            TDElement.classList.add("cell");
            TDElement.setAttribute("onclick", "GameOfLifeEventHandlerModule.handleCellClick(this)");
            if (GameOfLifeLogic.isThereALiveCellAt(liveCells, rowIndex, columnIndex)) {
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

    function generateBoardHtmlFrom(liveCells, boardCoordinates) {
        var board = "<table>" + generateBoardHeaderHtmlRowFrom(boardCoordinates.minColumnIndex, boardCoordinates.maxColumnIndex);
        for (var rowIndex = boardCoordinates.minRowIndex; rowIndex <= boardCoordinates.maxRowIndex; rowIndex++) {
            board += generateRowHtmlFrom(liveCells, rowIndex, boardCoordinates.minColumnIndex, boardCoordinates.maxColumnIndex);
        }
        return board + "</table>";
    }

    function renderBoard(boardHtml) {
        document.querySelector("#board").innerHTML = boardHtml;
    }

    function deriveLiveCellsFromBoard() {
        var cellTDElements = document.querySelectorAll(".cell");
        //todo: consider doing this with a map function?
        var liveCells = new Array();
        for (var i = 0; i < cellTDElements.length; i++) {
            var cellTDElement = cellTDElements[i];
            var isLive = cellTDElement.hasAttribute("live");
            if (isLive) {
                var rowIndex = getRowIndexFrom(cellTDElement);
                var columnIndex = getColumnIndexFrom(cellTDElement);
                liveCells.push(new GameOfLifeLogic.LiveCell(rowIndex, columnIndex));
            }
        }
        return liveCells;
    }

    function deriveBoardOuterCoordinates() {
        var cellTDElements = document.querySelectorAll(".cell");
        var rowIndexes = Array.from(cellTDElements).map(function (cellTDElement) {
            return getRowIndexFrom(cellTDElement);
        })
        var columnIndexes = Array.from(cellTDElements).map(function (cellTDElement) {
            return getColumnIndexFrom(cellTDElement);
        })
        return GridUtilities.deriveMinAndMaxRowAndColumnIndexesFrom(rowIndexes, columnIndexes);
    }

    function advanceBoardAStep() {
        var liveCells = deriveLiveCellsFromBoard();
        if (liveCells.length === 0) {
            reset();
            return;
        }
        var newLiveCells = GameOfLifeLogic.deriveNewLiveCellsFrom(liveCells);
        if (newLiveCells.length === 0) {
            reset();
            return;
        }

        var boardOuterCoordinates = deriveBoardOuterCoordinates();
        var outerNewLiveCellCoordinates = GameOfLifeLogic.deriveOuterCoordinatesOfCells(newLiveCells);
        //expand board outer coordinates if necessary
        boardOuterCoordinates.minRowIndex = Math.min(boardOuterCoordinates.minRowIndex, outerNewLiveCellCoordinates.minRowIndex);
        boardOuterCoordinates.minColumnIndex = Math.min(boardOuterCoordinates.minColumnIndex, outerNewLiveCellCoordinates.minColumnIndex);
        boardOuterCoordinates.maxRowIndex = Math.max(boardOuterCoordinates.maxRowIndex, outerNewLiveCellCoordinates.maxRowIndex);
        boardOuterCoordinates.maxColumnIndex = Math.max(boardOuterCoordinates.maxColumnIndex, outerNewLiveCellCoordinates.maxColumnIndex);
        var boardHtml = generateBoardHtmlFrom(newLiveCells, boardOuterCoordinates);
        renderBoard(boardHtml);
    }

    function reRenderBoardWithNew(boardOuterCoordinates) {
        var liveCells = deriveLiveCellsFromBoard();
        var boardHtml = generateBoardHtmlFrom(liveCells, boardOuterCoordinates);
        renderBoard(boardHtml);
    }

    function toggleLiveness(tdElement) {
        if (tdElement.hasAttribute("live")) {
            tdElement.removeAttribute("live");
            tdElement.classList.remove("liveCell");
        }
        else {
            tdElement.setAttribute("live", "");
            tdElement.classList.add("liveCell");
        }
    }

    function advanceAStep() {
        updateIterationCount();
        advanceBoardAStep();
    }

    function addRow() {
        var boardOuterCoordinates = deriveBoardOuterCoordinates();
        boardOuterCoordinates.maxRowIndex += 1;
        reRenderBoardWithNew(boardOuterCoordinates);
    }

    function addColumn() {
        var boardOuterCoordinates = deriveBoardOuterCoordinates();
        boardOuterCoordinates.maxColumnIndex += 1;
        reRenderBoardWithNew(boardOuterCoordinates);

    }

    function stop() {
        clearInterval(interval);
        isRunning = false;
        var runButton = document.getElementById("btnRun");
        runButton.value = "Run";
        runButton.setAttribute("onclick", "GameOfLifeEventHandlerModule.handleRunClick()");
    }

    function reset() {
        if (isRunning) {
            stop();
        }
        var iterationCountDiv = document.getElementById("iterationCount");
        iterationCountDiv.textContent = 0;
        var liveCells = [
            //up and left traveler
            new GameOfLifeLogic.LiveCell(2, 2),
            new GameOfLifeLogic.LiveCell(2, 3),
            new GameOfLifeLogic.LiveCell(2, 4),
            new GameOfLifeLogic.LiveCell(3, 2),
            new GameOfLifeLogic.LiveCell(4, 3),

            //down and right traveler
            new GameOfLifeLogic.LiveCell(7, 78),
            new GameOfLifeLogic.LiveCell(8, 79),
            new GameOfLifeLogic.LiveCell(9, 77),
            new GameOfLifeLogic.LiveCell(9, 78),
            new GameOfLifeLogic.LiveCell(9, 79),

        ];
        var startingBoardCoordinates = {
            minRowIndex: 1,
            minColumnIndex: 1,
            maxRowIndex: 10,
            maxColumnIndex: 80
        };
        var boardHtml = generateBoardHtmlFrom(liveCells, startingBoardCoordinates);
        renderBoard(boardHtml);
    }

    function start() {
        interval = setInterval(GameOfLifeHtmlGeneration_HtmlTable.advanceAStep, 1000);
        isRunning = true;
    }

    var interval;
    var isRunning = false;

    return {
        toggleLiveness: toggleLiveness,
        advanceAStep: advanceAStep,
        addRow: addRow,
        addColumn: addColumn,
        stop: stop,
        reset: reset,
        start: start
    };
}();

var GameOfLifeEventHandlerModule = function () {
    function handleCellClick(tdElement) {
        GameOfLifeHtmlGeneration_HtmlTable.toggleLiveness(tdElement);
    }

    function handleAdvanceAStepClick() {
        GameOfLifeHtmlGeneration_HtmlTable.advanceAStep();
    }

    function handleAddRowClick() {
        GameOfLifeHtmlGeneration_HtmlTable.addRow();
    }

    function handleAddColumnClick() {
        GameOfLifeHtmlGeneration_HtmlTable.addColumn();
    }

    function handleResetClick() {
        GameOfLifeHtmlGeneration_HtmlTable.reset();
    }

    function handleRunClick() {
        var runButton = document.getElementById("btnRun");
        runButton.value = "Stop";
        runButton.setAttribute("onclick", "GameOfLifeEventHandlerModule.handleStopClick()");
        GameOfLifeHtmlGeneration_HtmlTable.start();
    }

    function handleStopClick() {
        GameOfLifeHtmlGeneration_HtmlTable.stop();
    }

    return {
        handleCellClick: handleCellClick,
        handleAdvanceAStepClick: handleAdvanceAStepClick,
        handleAddRowClick: handleAddRowClick,
        handleAddColumnClick: handleAddColumnClick,
        handleResetClick: handleResetClick,
        handleRunClick: handleRunClick,
        handleStopClick: handleStopClick
    };
}();

GameOfLifeHtmlGeneration_HtmlTable.reset();
