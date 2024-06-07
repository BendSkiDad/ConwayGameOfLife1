'use strict'
import * as logic from "./gameOfLifeLogic.js"

export const GameOfLifeControlHtmlGeneration = function (boardGenerationModule) {
  //const iterationCountElementId = 'iterationCount'
  const runButton = deriveButton('Run', handleRunClick)
  const iterationCountElement = document.createElement('span')
  let interval
  let isRunning = false

  function renderRunStopButtonAsRun () {
      runButton.value = 'Run'
  }

  function renderRunStopButtonAsStop () {
      runButton.value = 'Stop'
  }

  function updateIterationCount () {
      iterationCountElement.textContent = logic.getIterationCount().toString()
  }

  function deriveRuleDescriptionElement () {
      const rule = logic.getBornAndSuvivesRule()
      const ruleText = 'Rule: B' + rule.arrBornNeighborCounts.join('') + '/S' + rule.arrSurviveNeighborCounts.join('')
      const textNode = document.createTextNode(ruleText)
      const pElement = document.createElement('p')
      pElement.appendChild(textNode)
      return pElement
  }

  function deriveIterationCountParagraph (iterationCount) {
      const labelTextNode = document.createTextNode('Iteration Count:')
      const countTextNode = document.createTextNode(iterationCount.toString())
      iterationCountElement.appendChild(countTextNode)
      const pElement = document.createElement('p')
      pElement.appendChild(labelTextNode)
      pElement.appendChild(iterationCountElement)
      return pElement
  }

  function deriveButton (value, fnClickHandler) {
      const button = document.createElement('input')
      button.setAttribute('type', 'button')
      button.setAttribute('value', value)
      if(fnClickHandler) {
          button.addEventListener('click', fnClickHandler)
      }
      button.classList.add('button')
      return button
  }

  function deriveButtonContainerElement () {
      const advanceOneStepButton =
          deriveButton('Advance a step', handleAdvanceAStepClick)
      const addRowButton = deriveButton('Add Row', handleAddRowClick)
      const addColumnButton = deriveButton('Add Column', handleAddColumnClick)
      const resetButton = deriveButton('Clear', handleClearClick)

      const buttonContainerElement = document.createElement('div')
      buttonContainerElement.appendChild(advanceOneStepButton)
      buttonContainerElement.appendChild(addRowButton)
      buttonContainerElement.appendChild(addColumnButton)
      buttonContainerElement.appendChild(resetButton)
      buttonContainerElement.appendChild(runButton)

      return buttonContainerElement
  }

  function controlElements (iterationCount) {
    const ruleDescriptionElement =
          deriveRuleDescriptionElement()
    const iterationCountElement =
          deriveIterationCountParagraph(iterationCount)
    const buttonContainerElement = deriveButtonContainerElement()
    return [
      iterationCountElement,
      buttonContainerElement,
      ruleDescriptionElement]
  }

  // event handlers and their helper methods
  function advanceOneStep () {
      logic.advanceOneStep()
      boardGenerationModule.updateBoardElement()
      updateIterationCount()
  }

  function start () {
      interval = setInterval(advanceOneStep, 1000)
      isRunning = true
      renderRunStopButtonAsStop()
  }

  function stop () {
      clearInterval(interval)
      isRunning = false
      renderRunStopButtonAsRun()
  }

  function clear () {
      if (isRunning) {
          stop()
      }
      logic.clearLiveCells()
      boardGenerationModule.updateBoardElement()
  }

  function handleAdvanceAStepClick () {
      advanceOneStep()
  }

  function handleAddRowClick () {
      boardGenerationModule.addRow()
      boardGenerationModule.updateBoardElement()
  }

  function handleAddColumnClick () {
      boardGenerationModule.addColumn()
      boardGenerationModule.updateBoardElement()
  }

  function handleClearClick () {
      clear()
  }

  function handleRunClick (e) {
      if (isRunning) {
          stop()
      } else {
          start()
      }
  }

  return {
    controlElements
  }
}
