"use strict";

function seedGameOfLifeLogic(gameOfLifeLogicModule) {
  gameOfLifeLogicModule.clearLiveCells();
  gameOfLifeLogicModule.addSimpleGliderGoingUpAndLeft(2, 2);
  gameOfLifeLogicModule.addSimpleGliderGoingDownAndRight(7, 77);
}

function getStartingBoardCoordinates() {
  const rc = {
      minRowIndex: 1,
      minColumnIndex: 1,
      maxRowIndex: 10,
      maxColumnIndex: 80
  };
  return rc;
}

//Create the object graph
const bornNeighborCounts = [3];
const survivesNeighborCounts = [2, 3];
const logicModule =
  TwoDimensionalGameOfLifeLogic(bornNeighborCounts, survivesNeighborCounts);
seedGameOfLifeLogic(logicModule);
const startingBoardCoordinates = getStartingBoardCoordinates();
const htmlGenerationModule =
    GameOfLifeHtmlGeneration_HtmlTable(logicModule);
const eventHandlerModule =
    GameOfLifeEventHandlerModule(
        htmlGenerationModule,
        logicModule,
        startingBoardCoordinates);

const htmlElements = htmlGenerationModule.deriveBoardAndControlElements(
    0,  //iterationCount
    startingBoardCoordinates,
    eventHandlerModule.handleCellClick,
    eventHandlerModule.handleAdvanceAStepClick,
    eventHandlerModule.handleAddRowClick,
    eventHandlerModule.handleAddColumnClick,
    eventHandlerModule.handleClearClick,
    eventHandlerModule.handleRunClick);
const rootElement = document.getElementById("root");
htmlElements.forEach(element => {
  rootElement.appendChild(element)
});
