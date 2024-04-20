"use strict";

function seedGameOfLifeLogic(gameOfLifeLogicModule) {
  gameOfLifeLogicModule.clearLiveCells();
  gameOfLifeLogicModule.addSimpleGliderGoingUpAndLeft(2, 2);
  gameOfLifeLogicModule.addSimpleGliderGoingDownAndRight(7, 77);
}

//Create the object graph
const bornNeighborCounts = [3];
const survivesNeighborCounts = [2, 3];
const logicModule =
  TwoDimensionalGameOfLifeLogic(bornNeighborCounts, survivesNeighborCounts);
seedGameOfLifeLogic(logicModule);
const startingBoardCoordinates = {
  minRowIndex: 1,
  minColumnIndex: 1,
  maxRowIndex: 10,
  maxColumnIndex: 80
};
//const boardGenerationModule = GameOfLifeBoardGeneration_HtmlTable(logicModule, startingBoardCoordinates);
const boardGenerationModule = GameOfLifeBoardGeneration_Canvas(logicModule, startingBoardCoordinates);
const controlHtmlGenerationModule =
    GameOfLifeControlHtmlGeneration(logicModule);
const eventHandlerModule =
    GameOfLifeEventHandlerModule(
        controlHtmlGenerationModule,
        logicModule,
        boardGenerationModule);

// const boardElement =
//     boardGenerationModule.deriveBoardElement();
const boardElement =
    boardGenerationModule.deriveBoardElement();
const boardPElement = document.createElement("p");
boardPElement.setAttribute("id", "board");
boardPElement.appendChild(boardElement);

const controlElements = controlHtmlGenerationModule.deriveControlElements(
    0,  //iterationCount
    eventHandlerModule.handleAdvanceAStepClick,
    eventHandlerModule.handleAddRowClick,
    eventHandlerModule.handleAddColumnClick,
    eventHandlerModule.handleClearClick,
    eventHandlerModule.handleRunClick);
const rootElement = document.getElementById("root");
rootElement.appendChild(boardPElement);
controlElements.forEach(element => {
  rootElement.appendChild(element)
});
