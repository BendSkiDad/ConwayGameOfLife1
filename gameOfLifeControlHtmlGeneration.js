"use strict";

const GameOfLifeControlHtmlGeneration = function (gameOfLifeLogicModule, boardGenerationModule) {
    const iterationCountElementId = "iterationCount";

    function renderRunStopButtonAsRun() {
        const runButton = document.getElementById("btnRun");
        runButton.value = "Run";
    }

    function renderRunStopButtonAsStop() {
        const runButton = document.getElementById("btnRun");
        runButton.value = "Stop";
    }

    function updateIterationCount() {
        const iterationCountDiv =
          document.getElementById(iterationCountElementId);
        iterationCountDiv.textContent = gameOfLifeLogicModule.getIterationCount();
    }

    function deriveRuleDescriptionElement() {
      const rule = gameOfLifeLogicModule.getBornAndSuvivesRule();
      const ruleText = "Rule: B" + rule.arrBornNeighborCount.join("") + "/S" + rule.arrSurvivesNeighborCount.join("");
      const textNode = document.createTextNode(ruleText);
      const pElement = document.createElement("p");
      pElement.appendChild(textNode);
      return pElement;
    }

    function deriveIterationCountParagraph(iterationCount) {
        const labelTextNode = document.createTextNode("Iteration Count:");
        const spanElement = document.createElement("span");
        spanElement.setAttribute("id", iterationCountElementId);
        const countTextNode = document.createTextNode(iterationCount);
        spanElement.appendChild(countTextNode);
        const pElement = document.createElement("p");
        pElement.appendChild(labelTextNode);
        pElement.appendChild(spanElement);
        return pElement;
    }

    function deriveButton(value, fnClickHandler) {
        const button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", value);
        button.addEventListener("click", fnClickHandler);
        button.classList.add("button");
        return button;
    }

    function deriveButtonContainerElement() {
        const advanceOneStepButton =
          deriveButton("Advance a step", handleAdvanceAStepClick);
        const addRowButton = deriveButton("Add Row", handleAddRowClick);
        const addColumnButton = deriveButton("Add Column", handleAddColumnClick);
        const resetButton = deriveButton("Clear", handleClearClick);
        const runButton = deriveButton("Run", handleRunClick);
        runButton.setAttribute("id", "btnRun");
    
        const buttonContainerElement = document.createElement("div");
        buttonContainerElement.appendChild(advanceOneStepButton);
        buttonContainerElement.appendChild(addRowButton);
        buttonContainerElement.appendChild(addColumnButton);
        buttonContainerElement.appendChild(resetButton);
        buttonContainerElement.appendChild(runButton);
        
        return buttonContainerElement;
    }

    function deriveControlElements(iterationCount) {
        const ruleDescriptionElement =
          deriveRuleDescriptionElement();
        const iterationCountElement =
          deriveIterationCountParagraph(iterationCount);

        const buttonContainerElement = deriveButtonContainerElement();

        return [
          iterationCountElement,
          buttonContainerElement,
          ruleDescriptionElement];
    }


    //event handlers and their helper methods
    let interval;
    let isRunning = false;

    function advanceOneStep() {
        gameOfLifeLogicModule.advanceOneStep();
        boardGenerationModule.updateBoardElement();
        updateIterationCount();
    }

    function start() {
        interval = setInterval(advanceOneStep, 1000);
        isRunning = true;
        renderRunStopButtonAsStop();
    }

    function stop() {
        clearInterval(interval);
        isRunning = false;
        renderRunStopButtonAsRun();
    }

    function clear() {
        if (isRunning) {
            stop();
        }
        gameOfLifeLogicModule.clearLiveCells();
        boardGenerationModule.updateBoardElement();
    }

    function handleAdvanceAStepClick() {
        advanceOneStep();
    }

    function handleAddRowClick() {
        boardGenerationModule.addRow();
        boardGenerationModule.updateBoardElement();
    }

    function handleAddColumnClick() {
        boardGenerationModule.addColumn();
        boardGenerationModule.updateBoardElement();
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
        renderRunStopButtonAsRun: renderRunStopButtonAsRun,
        renderRunStopButtonAsStop: renderRunStopButtonAsStop,
        updateIterationCount: updateIterationCount,
        deriveControlElements: deriveControlElements
    };
};
