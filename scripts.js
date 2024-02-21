"use strict";

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
        var liveNeighborCells = liveCells.filter(function (liveCell) {
            return liveCell.rowIndex >= rowIndex - 1
                && liveCell.rowIndex <= rowIndex + 1
                && liveCell.columnIndex >= columnIndex - 1
                && liveCell.columnIndex <= columnIndex + 1
                && !(liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex);
        });
        return liveNeighborCells.length;
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
    const rowIndexAttributeName = "rowIndex";
    const columnIndexAttributeName = "columnIndex";
    const iterationCountElementId = "iterationCount";
    const liveAttributeName = "live";
    const liveCellCSSClassToken = "liveCell";
    const gameOfLifeCellCSSClassToken = "cell";

    function getRowIndexFrom(cellTDElement) {
        var rowIndex = Number(cellTDElement.getAttribute(rowIndexAttributeName));
        return rowIndex;
    }

    function getColumnIndexFrom(cellTDElement) {
        var columnIndex = Number(cellTDElement.getAttribute(columnIndexAttributeName));
        return columnIndex;
    }

    function updateIterationCount() {
        var iterationCountDiv = document.getElementById(iterationCountElementId);
        var iterationCount = Number(iterationCountDiv.textContent);
        iterationCountDiv.textContent = iterationCount + 1;
    }

    function generateBoardHeaderTRElementFrom(leftColumnIndex, rightColumnIndex) {
        var firstTHElement = document.createElement("th");
        firstTHElement.classList.add("noPadding");
        firstTHElement.innerHTML = "&nbsp";
        var rc = document.createElement("tr");
        rc.appendChild(firstTHElement);
        for (var i = leftColumnIndex; i <= rightColumnIndex; i++) {
            var nextTHElement = document.createElement("th");
            nextTHElement.classList.add("noPadding");
            var textNode = document.createTextNode(Math.abs(i % 10));
            nextTHElement.appendChild(textNode);
            rc.appendChild(nextTHElement);
        }
        return rc;
    }

    function generateRowElementFrom(liveCells, rowIndex, leftColumnIndex, rightColumnIndex) {
        var tdElement = document.createElement("td");
        tdElement.classList.add("noPadding");
        var textNode = document.createTextNode(Math.abs(rowIndex % 10));
        tdElement.appendChild(textNode);
        var rc = document.createElement("tr");
        rc.appendChild(tdElement);
        for (var columnIndex = leftColumnIndex; columnIndex <= rightColumnIndex; columnIndex++) {
            var tdElement = document.createElement("td");
            tdElement.setAttribute(rowIndexAttributeName, rowIndex);
            tdElement.setAttribute(columnIndexAttributeName, columnIndex);
            tdElement.classList.add(gameOfLifeCellCSSClassToken);
            tdElement.setAttribute("onclick", "GameOfLifeEventHandlerModule.handleCellClick(this)");
            if (GameOfLifeLogic.isThereALiveCellAt(liveCells, rowIndex, columnIndex)) {
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

    function generateBoardAsTableHtmlElementFrom(liveCells, boardCoordinates) {
        var tableElement = document.createElement("table");
        tableElement.appendChild(generateBoardHeaderTRElementFrom(boardCoordinates.minColumnIndex, boardCoordinates.maxColumnIndex));
        for (var rowIndex = boardCoordinates.minRowIndex; rowIndex <= boardCoordinates.maxRowIndex; rowIndex++) {
            tableElement.appendChild(generateRowElementFrom(liveCells, rowIndex, boardCoordinates.minColumnIndex, boardCoordinates.maxColumnIndex));
        }
        return tableElement;
    }

    function renderBoard(boardAsHtmlTableElement) {
        document.querySelector("#board").replaceChildren(boardAsHtmlTableElement);
    }

    function deriveLiveCellsFromBoard() {
        var cellTDElements = document.querySelectorAll("." + gameOfLifeCellCSSClassToken);
        //todo: consider doing this with a map function?
        var liveCells = new Array();
        for (var i = 0; i < cellTDElements.length; i++) {
            var cellTDElement = cellTDElements[i];
            var isLive = cellTDElement.hasAttribute(liveAttributeName);
            if (isLive) {
                var rowIndex = getRowIndexFrom(cellTDElement);
                var columnIndex = getColumnIndexFrom(cellTDElement);
                liveCells.push(new GameOfLifeLogic.LiveCell(rowIndex, columnIndex));
            }
        }
        return liveCells;
    }

    function deriveBoardOuterCoordinates() {
        var cellTDElements = document.querySelectorAll("." + gameOfLifeCellCSSClassToken);
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
        var boardAsHtmlTableElement = generateBoardAsTableHtmlElementFrom(newLiveCells, boardOuterCoordinates);
        renderBoard(boardAsHtmlTableElement);
    }

    function reRenderBoardWithNew(boardOuterCoordinates) {
        var liveCells = deriveLiveCellsFromBoard();
        var boardAsHtmlTableElement = generateBoardAsTableHtmlElementFrom(liveCells, boardOuterCoordinates);
        renderBoard(boardAsHtmlTableElement);
    }

    function toggleLiveness(tdElement) {
        if (tdElement.hasAttribute(liveAttributeName)) {
            tdElement.removeAttribute(liveAttributeName);
            tdElement.classList.remove(liveCellCSSClassToken);
        }
        else {
            tdElement.setAttribute(liveAttributeName, "");
            tdElement.classList.add(liveCellCSSClassToken);
        }
        return {
            rowIndex: getRowIndexFrom(tdElement),
            columnIndex: getColumnIndexFrom(tdElement)
        };
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
        var iterationCountDiv = document.getElementById(iterationCountElementId);
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
        var boardAsHtmlTableElement = generateBoardAsTableHtmlElementFrom(liveCells, startingBoardCoordinates);
        renderBoard(boardAsHtmlTableElement);
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

var GameOfLifeEventHandlerModule = function (gameOfLifeHtmlGenerationModule) {
    function handleCellClick(tdElement) {
        var elementCoordinates = gameOfLifeHtmlGenerationModule.toggleLiveness(tdElement);
    }

    function handleAdvanceAStepClick() {
        gameOfLifeHtmlGenerationModule.advanceAStep();
    }

    function handleAddRowClick() {
        gameOfLifeHtmlGenerationModule.addRow();
    }

    function handleAddColumnClick() {
        gameOfLifeHtmlGenerationModule.addColumn();
    }

    function handleResetClick() {
        gameOfLifeHtmlGenerationModule.reset();
    }

    function handleRunClick() {
        var runButton = document.getElementById("btnRun");
        runButton.value = "Stop";
        runButton.setAttribute("onclick", "GameOfLifeEventHandlerModule.handleStopClick()");
        gameOfLifeHtmlGenerationModule.start();
    }

    function handleStopClick() {
        gameOfLifeHtmlGenerationModule.stop();
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
}(GameOfLifeHtmlGeneration_HtmlTable);  //inject the HtmlTable version of GOLHtmlGeneration module. Currently this is the only one but I'm thinking of writing another.

GameOfLifeHtmlGeneration_HtmlTable.reset();
