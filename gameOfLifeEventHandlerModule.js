"use strict";

const GameOfLifeEventHandlerModule = function (controlHtmlGenerationModule, gameOfLifeLogicModule, boardGenerationModule) {
    let interval;
    let isRunning = false;

    function advanceOneStep() {
        gameOfLifeLogicModule.advanceOneStep();
        boardGenerationModule.updateBoardElement();
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
        boardGenerationModule.updateBoardElement();
    }

    function handleAdvanceAStepClick() {
        advanceOneStep();
    }

    function handleAddRowClick() {
        boardGenerationModule.addRow();
        boardGenerationModule.updateBoardElement();
    }

    function handleAddColumnClick() {
        boardGenerationModule.addColumn();
        boardGenerationModule.updateBoardElement();
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
