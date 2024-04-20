"use strict";

//create and add a container element for the board
const boardContainerElement = document.createElement("p");
boardContainerElement.setAttribute("id", "board");
const rootElement = document.getElementById("root");
rootElement.appendChild(boardContainerElement);

//Create and seed the object graph
const bornNeighborCounts = [3];
const survivesNeighborCounts = [2, 3];
const logicModule =
  TwoDimensionalGameOfLifeLogic(bornNeighborCounts, survivesNeighborCounts);
logicModule.clearLiveCells();
logicModule.addSimpleGliderGoingUpAndLeft(2, 2);
logicModule.addSimpleGliderGoingDownAndRight(7, 7);
const startingBoardCoordinates = {
  minRowIndex: 1,
  minColumnIndex: 1,
  maxRowIndex: 10,
  maxColumnIndex: 10
};

// const boardGenerationModule =
//   GameOfLifeBoardGeneration_HtmlTable(logicModule, startingBoardCoordinates, boardContainerElement);
const boardGenerationModule =
  GameOfLifeBoardGeneration_Canvas(logicModule, startingBoardCoordinates, boardContainerElement);
const controlHtmlGenerationModule =
    GameOfLifeControlHtmlGeneration(logicModule);
const eventHandlerModule =
    GameOfLifeEventHandlerModule(
        controlHtmlGenerationModule,
        logicModule,
        boardGenerationModule);

boardGenerationModule.updateBoardElement();

const controlElements = controlHtmlGenerationModule.deriveControlElements(
    0,  //iterationCount
    eventHandlerModule.handleAdvanceAStepClick,
    eventHandlerModule.handleAddRowClick,
    eventHandlerModule.handleAddColumnClick,
    eventHandlerModule.handleClearClick,
    eventHandlerModule.handleRunClick);
controlElements.forEach(element => {
  rootElement.appendChild(element)
});
