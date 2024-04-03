"use strict";

const GameOfLifeEventHandlerModule = function (gameOfLifeHtmlGenerationModule, gameOfLifeLogicModule) {
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
        gameOfLifeHtmlGenerationModule.renderRunStopButtonAsStop(
            handleRunClick,
            handleStopClick);
        interval = setInterval(advanceOneStep, 1000);
        isRunning = true;
    }

    function stop() {
        clearInterval(interval);
        isRunning = false;
        gameOfLifeHtmlGenerationModule.renderRunStopButtonAsRun(
            handleRunClick,
            handleStopClick);
    }

    function seedGameOfLifeLogicAndGetStartingBoardCoordinates() {
        gameOfLifeLogicModule.clearLiveCells();

        gameOfLifeLogicModule.addSimpleGliderGoingUpAndLeft(2, 2);
        gameOfLifeLogicModule.addSimpleGliderGoingDownAndRight(7, 77);
        const startingBoardCoordinates = {
            minRowIndex: 1,
            minColumnIndex: 1,
            maxRowIndex: 10,
            maxColumnIndex: 80
        };
        return startingBoardCoordinates;
    }

    function reset() {
        if (isRunning) {
            stop();
        }
        gameOfLifeLogicModule.clearLiveCells();
        const startingBoardCoordinates =
          seedGameOfLifeLogicAndGetStartingBoardCoordinates();
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

    function handleResetClick() {
        reset();
    }

    function handleRunClick(e) {
        start();
    }

    function handleStopClick(e) {
        stop();
    }

    function initializePage(rootElement) {
        const startingBoardCoordinates =
          seedGameOfLifeLogicAndGetStartingBoardCoordinates();
        const elements = gameOfLifeHtmlGenerationModule.deriveBoardAndControlElements(
            0,
            startingBoardCoordinates,
            handleCellClick,
            handleAdvanceAStepClick,
            handleAddRowClick,
            handleAddColumnClick,
            handleResetClick,
            handleRunClick);
        elements.forEach(element => {
          rootElement.appendChild(element)
        });
    }

    return {
        initializePage: initializePage
    };
};
