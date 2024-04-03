"use strict";

const GameOfLifeEventHandlerModule = function (gameOfLifeHtmlGenerationModule, gameOfLifeLogicModule, startingBoardCoordinates) {
    let interval;
    let isRunning = false;

    function advanceOneStep() {
        gameOfLifeLogicModule.advanceOneStep();
        const boardAsHtmlTableElement =
          gameOfLifeHtmlGenerationModule.deriveBoardUsingExistingBoardAndLiveCells(
            handleCellClick);
        document.querySelector("#board").replaceChildren(
            boardAsHtmlTableElement);
        gameOfLifeHtmlGenerationModule.updateIterationCount();
    }

    function start() {
        interval = setInterval(advanceOneStep, 1000);
        isRunning = true;
        gameOfLifeHtmlGenerationModule.renderRunStopButtonAsStop();
    }

    function stop() {
        clearInterval(interval);
        isRunning = false;
        gameOfLifeHtmlGenerationModule.renderRunStopButtonAsRun();
    }

    function clear() {
        if (isRunning) {
            stop();
        }
        gameOfLifeLogicModule.clearLiveCells();
        const boardAsHtmlTableElement =
          gameOfLifeHtmlGenerationModule.deriveBoardUsingMinimumOuterCoordinatesAndLiveCells(
            startingBoardCoordinates,
            handleCellClick);
        document.querySelector("#board").replaceChildren(
            boardAsHtmlTableElement);
    }

    function handleCellClick(e) {
        const coordinates =
          gameOfLifeHtmlGenerationModule.getCoordinatesFromClickEventTarget(e);
        gameOfLifeLogicModule.toggleCellLiveness(
            coordinates.rowIndex,
            coordinates.columnIndex);
        const boardAsHtmlTableElement =
          gameOfLifeHtmlGenerationModule.deriveBoardUsingExistingBoardAndLiveCells(
              handleCellClick);
        document.querySelector("#board").replaceChildren(
            boardAsHtmlTableElement);
    }

    function handleAdvanceAStepClick() {
        advanceOneStep();
    }

    function handleAddRowClick() {
        const boardAsHtmlTableElement =
          gameOfLifeHtmlGenerationModule.deriveBoardWithAdditionalRow(
            handleCellClick);
        document.querySelector("#board").replaceChildren(
            boardAsHtmlTableElement);
    }

    function handleAddColumnClick() {
        const boardAsHtmlTableElement =
          gameOfLifeHtmlGenerationModule.deriveBoardWithAdditionalColumn(
            handleCellClick);
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

    return {
        handleCellClick: handleCellClick,
        handleAdvanceAStepClick: handleAdvanceAStepClick,
        handleAddRowClick: handleAddRowClick,
        handleAddColumnClick: handleAddColumnClick,
        handleClearClick: handleClearClick,
        handleRunClick: handleRunClick
    };
};
