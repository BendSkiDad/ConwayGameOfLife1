"use strict";

const GameOfLifeEventHandlerModule = function (controlHtmlGenerationModule, gameOfLifeLogicModule, boardGenerationModule) {
    let interval;
    let isRunning = false;

    function advanceOneStep() {
        gameOfLifeLogicModule.advanceOneStep();
        const boardAsHtmlTableElement =
            boardGenerationModule.deriveBoardElement(handleCellClick);
        document.querySelector("#board").replaceChildren(
            boardAsHtmlTableElement);
        controlHtmlGenerationModule.updateIterationCount();
    }

    function start() {
        interval = setInterval(advanceOneStep, 1000);
        isRunning = true;
        controlHtmlGenerationModule.renderRunStopButtonAsStop();
    }

    function stop() {
        clearInterval(interval);
        isRunning = false;
        controlHtmlGenerationModule.renderRunStopButtonAsRun();
    }

    function clear() {
        if (isRunning) {
            stop();
        }
        gameOfLifeLogicModule.clearLiveCells();
        const boardAsHtmlTableElement =
          boardGenerationModule.deriveBoardElement(handleCellClick);
        document.querySelector("#board").replaceChildren(
            boardAsHtmlTableElement);
    }

    function handleCellClick(e) {
        const coordinates =
          boardGenerationModule.getCoordinatesFromClickEventTarget(e);
        gameOfLifeLogicModule.toggleCellLiveness(
            coordinates.rowIndex,
            coordinates.columnIndex);
        const boardAsHtmlTableElement =
            boardGenerationModule.deriveBoardElement(handleCellClick);
        document.querySelector("#board").replaceChildren(
            boardAsHtmlTableElement);
    }

    function handleAdvanceAStepClick() {
        advanceOneStep();
    }

    function handleAddRowClick() {
        boardGenerationModule.addRow();
        const boardAsHtmlTableElement =
            boardGenerationModule.deriveBoardElement(handleCellClick);
        document.querySelector("#board").replaceChildren(
            boardAsHtmlTableElement);
    }

    function handleAddColumnClick() {
        boardGenerationModule.addColumn();
        const boardAsHtmlTableElement =
            boardGenerationModule.deriveBoardElement(handleCellClick);
        document.querySelector("#board").replaceChildren(
            boardAsHtmlTableElement);
    }

    function handleClearClick() {
        clear();
    }

    function handleRunClick(e) {
        if(isRunning) {
            stop();
        } else {
            start();
        }
    }

    function handleCanvasClick(e) {
        alert("the canvas was clicked at clientX: " + e.clientX + " and clientY: " + e.clientY + " and pageX: " + e.pageX + " and pageY: " + e.pageY + " and offsetX: " + e.offsetX  + " and offsetY: " + e.offsetY);
        const coordinates = {
            rowIndex: 8,
            columnIndex: 20
        };
        gameOfLifeLogicModule.toggleCellLiveness(
            coordinates.rowIndex,
            coordinates.columnIndex);
        const boardAsHtmlTableElement =
            boardGenerationModule.deriveBoardElement(handleCanvasClick);
        document.querySelector("#board").replaceChildren(
            boardAsHtmlTableElement);

    }

    return {
        handleCellClick: handleCellClick,
        handleAdvanceAStepClick: handleAdvanceAStepClick,
        handleAddRowClick: handleAddRowClick,
        handleAddColumnClick: handleAddColumnClick,
        handleClearClick: handleClearClick,
        handleRunClick: handleRunClick,

        handleCanvasClick: handleCanvasClick
    };
};
