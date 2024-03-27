"use strict";

const GridUtilities = function () {
    function deriveMinAndMaxRowAndColumnIndexesFrom(rowIndexes, columnIndexes) {
        const minRowIndex = Math.min(...rowIndexes);
        const maxRowIndex = Math.max(...rowIndexes);
        const minColumnIndex = Math.min(...columnIndexes);
        const maxColumnIndex = Math.max(...columnIndexes);
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

const GameOfLifeLogic = function () {
    function LiveCell(rowIndex, columnIndex) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }

    let liveCells = [];
    let iterationCount = 0;

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
        const rowIndexes = liveCells.map(function (cell) {
            return cell.rowIndex;
        });
        const columnIndexes = liveCells.map(function (cell) {
            return cell.columnIndex;
        });
        return GridUtilities.deriveMinAndMaxRowAndColumnIndexesFrom(rowIndexes, columnIndexes);
    }

    function isThereALiveCellAt(rowIndex, columnIndex) {
        const matchingLiveCells = liveCells.filter(function (liveCell) {
            return liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex
        });
        return matchingLiveCells.length;
    }

    function deriveNumberOfLiveNeighbors(rowIndex, columnIndex) {
        const liveNeighborCells = liveCells.filter(function (liveCell) {
            return liveCell.rowIndex >= rowIndex - 1
                && liveCell.rowIndex <= rowIndex + 1
                && liveCell.columnIndex >= columnIndex - 1
                && liveCell.columnIndex <= columnIndex + 1
                && !(liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex);
        });
        return liveNeighborCells.length;
    }

    function deriveNextSetOfLiveCellsFromCurrentLiveCells() {
        //find indexes just outside the live cells
        const outerCoordinatesOfCells = outerCoordinatesOfLiveCells();
        outerCoordinatesOfCells.minRowIndex -= 1;
        outerCoordinatesOfCells.minColumnIndex -= 1;
        outerCoordinatesOfCells.maxRowIndex += 1;
        outerCoordinatesOfCells.maxColumnIndex += 1;

        const newLiveCells = new Array();
        for (let rowIndex = outerCoordinatesOfCells.minRowIndex; rowIndex <= outerCoordinatesOfCells.maxRowIndex; rowIndex++) {
            for (let columnIndex = outerCoordinatesOfCells.minColumnIndex; columnIndex <= outerCoordinatesOfCells.maxColumnIndex; columnIndex++) {
                const liveNeighborCount = deriveNumberOfLiveNeighbors(rowIndex, columnIndex);
                if ((isThereALiveCellAt(rowIndex, columnIndex) && (liveNeighborCount === 2 || liveNeighborCount === 3)) || liveNeighborCount === 3) {
                    newLiveCells.push(new LiveCell(rowIndex, columnIndex));
                }
            }
        }
        return newLiveCells;
    }

    function advanceOneStep() {
        liveCells = deriveNextSetOfLiveCellsFromCurrentLiveCells();
        iterationCount++;
    }

    function toggleLiveCell(rowIndex, columnIndex) {
        const index = liveCells.findIndex(function (liveCell) {
            return liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex;
        });
        if (index === -1) {
            liveCells.push(new LiveCell(rowIndex, columnIndex));
        } else {
            liveCells.splice(index, 1);
        }
    }

    function clearLiveCells() {
        liveCells = [];
        iterationCount = 0;
    }

    function getIterationCount() {
        return iterationCount;
    }

    return {
        addSimpleGliderGoingUpAndLeft: addSimpleGliderGoingUpAndLeft,
        addSimpleGliderGoingDownAndRight: addSimpleGliderGoingDownAndRight,
        outerCoordinatesOfLiveCells: outerCoordinatesOfLiveCells,
        isThereALiveCellAt: isThereALiveCellAt,
        advanceOneStep: advanceOneStep,
        toggleLiveCell: toggleLiveCell,
        clearLiveCells: clearLiveCells,
        getIterationCount: getIterationCount
    }
}();

const GameOfLifeHtmlGeneration_HtmlTable = function () {
    const rowIndexAttributeName = "rowIndex";
    const columnIndexAttributeName = "columnIndex";
    const iterationCountElementId = "iterationCount";
    const liveAttributeName = "live";
    const liveCellCSSClassToken = "liveCell";
    const gameOfLifeCellCSSClassToken = "cell";

    function getRowIndexFrom(cellTDElement) {
        const rowIndex = Number(cellTDElement.getAttribute(rowIndexAttributeName));
        return rowIndex;
    }

    function getColumnIndexFrom(cellTDElement) {
        const columnIndex = Number(cellTDElement.getAttribute(columnIndexAttributeName));
        return columnIndex;
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

    function generateRowElementFrom(rowIndex, leftColumnIndex, rightColumnIndex) {
        const tdElement = document.createElement("td");
        tdElement.classList.add("noPadding");
        const textNode = document.createTextNode(Math.abs(rowIndex % 10));
        tdElement.appendChild(textNode);
        const rc = document.createElement("tr");
        rc.appendChild(tdElement);
        for (let columnIndex = leftColumnIndex; columnIndex <= rightColumnIndex; columnIndex++) {
            const tdElement = document.createElement("td");
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

    function generateBoardAsTableHtmlElementFrom(boardOuterCoordinates) {
        const tableElement = document.createElement("table");
        tableElement.appendChild(generateBoardHeaderTRElementFrom(boardOuterCoordinates.minColumnIndex, boardOuterCoordinates.maxColumnIndex));
        for (let rowIndex = boardOuterCoordinates.minRowIndex; rowIndex <= boardOuterCoordinates.maxRowIndex; rowIndex++) {
            tableElement.appendChild(generateRowElementFrom(rowIndex, boardOuterCoordinates.minColumnIndex, boardOuterCoordinates.maxColumnIndex));
        }
        return tableElement;
    }

    function deriveOuterCoordinatesOfExistingBoard() {
        const cellTDElements = document.querySelectorAll("." + gameOfLifeCellCSSClassToken);
        const rowIndexes = Array.from(cellTDElements).map(function (cellTDElement) {
            return getRowIndexFrom(cellTDElement);
        })
        const columnIndexes = Array.from(cellTDElements).map(function (cellTDElement) {
            return getColumnIndexFrom(cellTDElement);
        })
        return GridUtilities.deriveMinAndMaxRowAndColumnIndexesFrom(rowIndexes, columnIndexes);
    }

    function renderBoard(boardOuterCoordinates) {
        const outerLiveCellCoordinates = GameOfLifeLogic.outerCoordinatesOfLiveCells();

        //expand board outer coordinates if necessary
        boardOuterCoordinates.minRowIndex = Math.min(boardOuterCoordinates.minRowIndex, outerLiveCellCoordinates.minRowIndex);
        boardOuterCoordinates.minColumnIndex = Math.min(boardOuterCoordinates.minColumnIndex, outerLiveCellCoordinates.minColumnIndex);
        boardOuterCoordinates.maxRowIndex = Math.max(boardOuterCoordinates.maxRowIndex, outerLiveCellCoordinates.maxRowIndex);
        boardOuterCoordinates.maxColumnIndex = Math.max(boardOuterCoordinates.maxColumnIndex, outerLiveCellCoordinates.maxColumnIndex);
        const boardAsHtmlTableElement = generateBoardAsTableHtmlElementFrom(boardOuterCoordinates);
        document.querySelector("#board").replaceChildren(boardAsHtmlTableElement);
    }

    function toggleLivenessOf(tdElement) {
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

    function addRow() {
        const boardOuterCoordinates = deriveOuterCoordinatesOfExistingBoard();
        boardOuterCoordinates.maxRowIndex += 1;
        renderBoard(boardOuterCoordinates);
    }

    function addColumn() {
        const boardOuterCoordinates = deriveOuterCoordinatesOfExistingBoard();
        boardOuterCoordinates.maxColumnIndex += 1;
        renderBoard(boardOuterCoordinates);
    }

    function renderRunStopButtonAsRun() {
        const runButton = document.getElementById("btnRun");
        runButton.value = "Run";
        runButton.setAttribute("onclick", "GameOfLifeEventHandlerModule.handleRunClick()");
    }

    function renderRunStopButtonAsStop() {
        const runButton = document.getElementById("btnRun");
        runButton.value = "Stop";
        runButton.setAttribute("onclick", "GameOfLifeEventHandlerModule.handleStopClick()");
    }

    function renderIterationCount() {
        const iterationCountDiv = document.getElementById(iterationCountElementId);
        iterationCountDiv.textContent = GameOfLifeLogic.getIterationCount();
    }

    function renderBoardUsingMinimumOuterCoordinatesAndLiveCells(minimumOuterCoordinates) {
        renderBoard(minimumOuterCoordinates);
    }

    function renderBoardUsingExistingBoardAndLiveCells() {
        const boardOuterCoordinates = deriveOuterCoordinatesOfExistingBoard();
        renderBoard(boardOuterCoordinates);
    }

    return {
        toggleLivenessOf: toggleLivenessOf,
        addRow: addRow,
        addColumn: addColumn,
        renderRunStartButtonAsRun: renderRunStopButtonAsRun,
        renderRunStopButtonAsStop: renderRunStopButtonAsStop,
        renderIterationCount: renderIterationCount,
        renderBoardUsingMinimumOuterCoordinatesAndLiveCells: renderBoardUsingMinimumOuterCoordinatesAndLiveCells,
        renderBoardUsingExistingBoardAndLiveCells: renderBoardUsingExistingBoardAndLiveCells
    };
}();

const GameOfLifeEventHandlerModule = function (gameOfLifeHtmlGenerationModule) {
    let interval;
    let isRunning = false;

    function advanceOneStep() {
        GameOfLifeLogic.advanceOneStep();
        gameOfLifeHtmlGenerationModule.renderBoardUsingExistingBoardAndLiveCells();
        gameOfLifeHtmlGenerationModule.renderIterationCount();
    }

    function start() {
        gameOfLifeHtmlGenerationModule.renderRunStopButtonAsStop();
        interval = setInterval(advanceOneStep, 1000);
        isRunning = true;
    }

    function stop() {
        clearInterval(interval);
        isRunning = false;
        gameOfLifeHtmlGenerationModule.renderRunStartButtonAsRun();
    }

    function reset() {
        if (isRunning) {
            stop();
        }
        GameOfLifeLogic.clearLiveCells();

        GameOfLifeLogic.addSimpleGliderGoingUpAndLeft(2, 2);
        GameOfLifeLogic.addSimpleGliderGoingDownAndRight(7, 77);
        const startingBoardCoordinates = {
            minRowIndex: 1,
            minColumnIndex: 1,
            maxRowIndex: 10,
            maxColumnIndex: 80
        };
        gameOfLifeHtmlGenerationModule.renderBoardUsingMinimumOuterCoordinatesAndLiveCells(startingBoardCoordinates);
        gameOfLifeHtmlGenerationModule.renderIterationCount();
    }

    function handleCellClick(tdElement) {
        const elementCoordinates = gameOfLifeHtmlGenerationModule.toggleLivenessOf(tdElement);
        GameOfLifeLogic.toggleLiveCell(elementCoordinates.rowIndex, elementCoordinates.columnIndex);
    }

    function handleAdvanceAStepClick() {
        advanceOneStep();
    }

    function handleAddRowClick() {
        gameOfLifeHtmlGenerationModule.addRow();
    }

    function handleAddColumnClick() {
        gameOfLifeHtmlGenerationModule.addColumn();
    }

    function handleResetClick() {
        reset();
    }

    function handleRunClick() {
        start();
    }

    function handleStopClick() {
        stop();
    }

    return {
        handleCellClick: handleCellClick,
        handleAdvanceAStepClick: handleAdvanceAStepClick,
        handleAddRowClick: handleAddRowClick,
        handleAddColumnClick: handleAddColumnClick,
        reset: reset,
        handleResetClick: handleResetClick,
        handleRunClick: handleRunClick,
        handleStopClick: handleStopClick
    };
}(GameOfLifeHtmlGeneration_HtmlTable);  //inject the HtmlTable version of GOLHtmlGeneration module. Currently this is the only one but I'm thinking of writing another.

GameOfLifeEventHandlerModule.reset();
