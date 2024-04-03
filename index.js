"use strict";

const arrBornNeighborCount = [3];
const arrSurvivesNeighborCount = [2, 3];
const logicModule =
  TwoDimensionalGameOfLifeLogic(arrBornNeighborCount, arrSurvivesNeighborCount);
const htmlGenerationModule =
    GameOfLifeHtmlGeneration_HtmlTable(logicModule);
const eventHandlerModule =
    GameOfLifeEventHandlerModule(
        htmlGenerationModule,
        logicModule);
const rootElement = document.getElementById("root");
const elements = eventHandlerModule.initializePage();
elements.forEach(element => {
  rootElement.appendChild(element)
});
