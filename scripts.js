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

    var liveCells = [];
    var iterationCount = 0;

    function addSimpleGliderGoingUpAndLeft(rowIndex, columnIndex) {
        liveCells.push(
            new LiveCell(rowIndex, columnIndex),
            new LiveCell(rowIndex, columnIndex + 1),
            new LiveCell(rowIndex, columnIndex + 2),
            new LiveCell(rowIndex + 1, columnIndex),
            new LiveCell(rowIndex + 2, columnIndex + 1)
        );
    }

    function addSimpleGliderGoingDownAndRight(rowIndex, columnIndex) {
        liveCells.push(
            new LiveCell(rowIndex, columnIndex + 1),
            new LiveCell(rowIndex + 1, columnIndex + 2),
            new LiveCell(rowIndex + 2, columnIndex),
            new LiveCell(rowIndex + 2, columnIndex + 1),
            new LiveCell(rowIndex + 2, columnIndex + 2)
        );
    }

    function outerCoordinatesOfLiveCells() {
        var rowIndexes = liveCells.map(function (cell) {
            return cell.rowIndex;
        });
        var columnIndexes = liveCells.map(function (cell) {
            return cell.columnIndex;
        });
        return GridUtilities.deriveMinAndMaxRowAndColumnIndexesFrom(rowIndexes, columnIndexes);
    }

    function isThereALiveCellAt(rowIndex, columnIndex) {
        var matchingLiveCells = liveCells.filter(function (liveCell) {
            return liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex
        });
        return matchingLiveCells.length;
    }

    function deriveNumberOfLiveNeighbors(rowIndex, columnIndex) {
        var liveNeighborCells = liveCells.filter(function (liveCell) {
            return liveCell.rowIndex >= rowIndex - 1
                && liveCell.rowIndex <= rowIndex + 1
                && liveCell.columnIndex >= columnIndex - 1
                && liveCell.columnIndex <= columnIndex + 1
                && !(liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex);
        });
        return liveNeighborCells.length;
    }

    function deriveNewLiveCells() {
        //find indexes just outside the live cells
        var outerCoordinatesOfCells = outerCoordinatesOfLiveCells();
        outerCoordinatesOfCells.minRowIndex -= 1;
        outerCoordinatesOfCells.minColumnIndex -= 1;
        outerCoordinatesOfCells.maxRowIndex += 1;
        outerCoordinatesOfCells.maxColumnIndex += 1;

        var newLiveCells = new Array();
        for (var rowIndex = outerCoordinatesOfCells.minRowIndex; rowIndex <= outerCoordinatesOfCells.maxRowIndex; rowIndex++) {
            for (var columnIndex = outerCoordinatesOfCells.minColumnIndex; columnIndex <= outerCoordinatesOfCells.maxColumnIndex; columnIndex++) {
                var liveNeighborCount = deriveNumberOfLiveNeighbors(rowIndex, columnIndex);
                if ((isThereALiveCellAt(rowIndex, columnIndex) && (liveNeighborCount === 2 || liveNeighborCount === 3)) || liveNeighborCount === 3) {
                    newLiveCells.push(new LiveCell(rowIndex, columnIndex));
                }
            }
        }
        return newLiveCells;
    }

    function advanceOneStep() {
        liveCells = deriveNewLiveCells();
        iterationCount++;
    }

    function toggleLiveCell(rowIndex, columnIndex) {
        var index = liveCells.indexOf(function (liveCell) {
            return liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex;
        });
        if (index = -1) {
            liveCells.push(new LiveCell(rowIndex, columnIndex));
        } else {
            liveCells.splice(index, 1);
        }
    }

    function isAnyLiveCells() {
        return liveCells.length;
    }

    function clear() {
        liveCells = [];
        iterationCount = 0;
    }

    function getIterationCount() {
        return iterationCount;
    }

    return {
        addSimpleGliderGoingUpAndLeft: addSimpleGliderGoingUpAndLeft,
        addSimpleGliderGoingDownAndRight: addSimpleGliderGoingDownAndRight,
        outerCoordinatesOfCells: outerCoordinatesOfLiveCells,
        isThereALiveCellAt: isThereALiveCellAt,
        advanceOneStep: advanceOneStep,
        toggleLiveCell: toggleLiveCell,
        isAnyLiveCells: isAnyLiveCells,
        clear: clear,
        getIterationCount: getIterationCount
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
        iterationCountDiv.textContent = GameOfLifeLogic.getIterationCount();
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

    function generateRowElementFrom(rowIndex, leftColumnIndex, rightColumnIndex) {
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
            if (GameOfLifeLogic.isThereALiveCellAt(rowIndex, columnIndex)) {
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

    function generateBoardAsTableHtmlElementFrom(boardCoordinates) {
        var tableElement = document.createElement("table");
        tableElement.appendChild(generateBoardHeaderTRElementFrom(boardCoordinates.minColumnIndex, boardCoordinates.maxColumnIndex));
        for (var rowIndex = boardCoordinates.minRowIndex; rowIndex <= boardCoordinates.maxRowIndex; rowIndex++) {
            tableElement.appendChild(generateRowElementFrom(rowIndex, boardCoordinates.minColumnIndex, boardCoordinates.maxColumnIndex));
        }
        return tableElement;
    }

    function renderBoard(boardAsHtmlTableElement) {
        document.querySelector("#board").replaceChildren(boardAsHtmlTableElement);
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
        GameOfLifeLogic.advanceOneStep();
        if (!GameOfLifeLogic.isAnyLiveCells()) {
            reset();
            return;
        }
        var boardOuterCoordinates = deriveBoardOuterCoordinates();
        var outerNewLiveCellCoordinates = GameOfLifeLogic.outerCoordinatesOfCells();

        //expand board outer coordinates if necessary
        boardOuterCoordinates.minRowIndex = Math.min(boardOuterCoordinates.minRowIndex, outerNewLiveCellCoordinates.minRowIndex);
        boardOuterCoordinates.minColumnIndex = Math.min(boardOuterCoordinates.minColumnIndex, outerNewLiveCellCoordinates.minColumnIndex);
        boardOuterCoordinates.maxRowIndex = Math.max(boardOuterCoordinates.maxRowIndex, outerNewLiveCellCoordinates.maxRowIndex);
        boardOuterCoordinates.maxColumnIndex = Math.max(boardOuterCoordinates.maxColumnIndex, outerNewLiveCellCoordinates.maxColumnIndex);
        var boardAsHtmlTableElement = generateBoardAsTableHtmlElementFrom(boardOuterCoordinates);
        renderBoard(boardAsHtmlTableElement);
    }

    function reRenderBoardWithNew(boardOuterCoordinates) {
        var boardAsHtmlTableElement = generateBoardAsTableHtmlElementFrom(boardOuterCoordinates);
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
        GameOfLifeLogic.clear();
        GameOfLifeLogic.addSimpleGliderGoingUpAndLeft(2, 2);
        GameOfLifeLogic.addSimpleGliderGoingDownAndRight(7, 77);
        var startingBoardCoordinates = {
            minRowIndex: 1,
            minColumnIndex: 1,
            maxRowIndex: 10,
            maxColumnIndex: 80
        };
        var boardAsHtmlTableElement = generateBoardAsTableHtmlElementFrom(startingBoardCoordinates);
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
        GameOfLifeLogic.toggleLiveCell(elementCoordinates.rowIndex, elementCoordinates.columnIndex);
    }

    function handleAdvanceAStepClick() {
        GameOfLifeLogic.advanceOneStep();
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
