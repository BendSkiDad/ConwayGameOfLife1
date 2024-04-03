"use strict";

function seedGameOfLifeLogic(gameOfLifeLogicModule) {
  gameOfLifeLogicModule.clearLiveCells();

  gameOfLifeLogicModule.addSimpleGliderGoingUpAndLeft(2, 2);
  gameOfLifeLogicModule.addSimpleGliderGoingDownAndRight(7, 77);
}

function getStartingBoardCoordinates() {
  const startingBoardCoordinates = {
      minRowIndex: 1,
      minColumnIndex: 1,
      maxRowIndex: 10,
      maxColumnIndex: 80
  };
  return startingBoardCoordinates;
}

function deriveHtmlPageElements(startingBoardCoordinates) {
  const elements = htmlGenerationModule.deriveBoardAndControlElements(
      0,
      startingBoardCoordinates,
      eventHandlerModule.handleCellClick,
      eventHandlerModule.handleAdvanceAStepClick,
      eventHandlerModule.handleAddRowClick,
      eventHandlerModule.handleAddColumnClick,
      eventHandlerModule.handleClearClick,
      eventHandlerModule.handleRunClick);
  return elements;
}

//Create the object graph
const arrBornNeighborCount = [3];
const arrSurvivesNeighborCount = [2, 3];
const logicModule =
  TwoDimensionalGameOfLifeLogic(arrBornNeighborCount, arrSurvivesNeighborCount);
const htmlGenerationModule =
    GameOfLifeHtmlGeneration_HtmlTable(logicModule);
const startingBoardCoordinates = getStartingBoardCoordinates();
seedGameOfLifeLogic(logicModule);
const eventHandlerModule =
    GameOfLifeEventHandlerModule(
        htmlGenerationModule,
        logicModule,
        startingBoardCoordinates);

const htmlElements = deriveHtmlPageElements(startingBoardCoordinates);
const rootElement = document.getElementById("root");
htmlElements.forEach(element => {
  rootElement.appendChild(element)
});
