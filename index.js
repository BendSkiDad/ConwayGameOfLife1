"use strict";

const eventHandler =
    GameOfLifeEventHandlerModule(
        GameOfLifeHtmlGeneration_HtmlTable,
        GameOfLifeLogic);
const rootElement = document.getElementById("root");
eventHandler.initializePage(rootElement);

