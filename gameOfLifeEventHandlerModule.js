"use strict";

const GameOfLifeEventHandlerModule = function (controlHtmlGenerationModule, gameOfLifeLogicModule, boardGenerationModule) {
    let interval;
    let isRunning = false;

    function advanceOneStep() {
        gameOfLifeLogicModule.advanceOneStep();
        const boardElement =
            boardGenerationModule.deriveBoardElement();
        document.querySelector("#board").replaceChildren(
            boardElement);
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
        const boardElement =
          boardGenerationModule.deriveBoardElement();
        document.querySelector("#board").replaceChildren(
            boardElement);
    }

    function handleAdvanceAStepClick() {
        advanceOneStep();
    }

    function handleAddRowClick() {
        boardGenerationModule.addRow();
        const boardElement =
            boardGenerationModule.deriveBoardElement();
        document.querySelector("#board").replaceChildren(
            boardElement);
    }

    function handleAddColumnClick() {
        boardGenerationModule.addColumn();
        const boardElement =
            boardGenerationModule.deriveBoardElement();
        document.querySelector("#board").replaceChildren(
            boardElement);
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

    return {
        handleAdvanceAStepClick: handleAdvanceAStepClick,
        handleAddRowClick: handleAddRowClick,
        handleAddColumnClick: handleAddColumnClick,
        handleClearClick: handleClearClick,
        handleRunClick: handleRunClick
    };
};
