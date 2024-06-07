'use strict'
import * as logic from "./gameOfLifeLogic.js"
//import { GameOfLifeBoardGeneration } from './gameOfLifeBoardGeneration_HtmlTable.js'
import { GameOfLifeBoardGeneration } from './gameOfLifeBoardGeneration_Canvas.js'
import { GameOfLifeControlHtmlGeneration } from './gameOfLifeControlHtmlGeneration.js'

// create and add a container element for the board
const boardContainerElement = document.createElement('p')
boardContainerElement.setAttribute('id', 'board')
const rootElement = document.getElementById('root')
rootElement.appendChild(boardContainerElement)

logic.clearLiveCells()
logic.addSimpleGliderGoingUpAndLeft(2, 2)
logic.addSimpleGliderGoingDownAndRight(7, 7)

const startingUpperLeftCell = new logic.Cell(1, 1)
const startingLowerRightCell = new logic.Cell(10, 20)
const startingBoardExtent =
    new logic.CellExtent(
        startingUpperLeftCell,
        startingLowerRightCell
    )
const boardGenerationModule =
    GameOfLifeBoardGeneration(startingBoardExtent, boardContainerElement)
const controlHtmlGenerationModule =
    GameOfLifeControlHtmlGeneration(boardGenerationModule)
boardGenerationModule.updateBoardElement()
const controlElements =
    controlHtmlGenerationModule.controlElements(0) // iterationCount
controlElements.forEach(element => {
  rootElement.appendChild(element)
})
