"use strict";

const GameOfLifeControlHtmlGeneration = function (gameOfLifeLogicModule) {
    const rowIndexAttributeName = "rowIndex";
    const columnIndexAttributeName = "columnIndex";
    const iterationCountElementId = "iterationCount";

    function getRowIndexFrom(cellTDElement) {
        const rowIndex =
          Number(cellTDElement.getAttribute(rowIndexAttributeName));
        return rowIndex;
    }

    function getColumnIndexFrom(cellTDElement) {
        const columnIndex =
          Number(cellTDElement.getAttribute(columnIndexAttributeName));
        return columnIndex;
    }

    function getCoordinatesFromClickEventTarget(e) {
      const tdElement = e.target;
      return {
        rowIndex: getRowIndexFrom(tdElement),
        columnIndex: getColumnIndexFrom(tdElement)
      };
    }

    function renderRunStopButtonAsRun(fnHandleRunClick) {
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

    function deriveButtonContainerElement(
            fnAdvanceOneStepHandler,
            fnAddRowHandler,
            fnAddColumnHandler,
            fnClearHandler,
            fnRunHandler) {
        const advanceOneStepButton =
          deriveButton("Advance a step", fnAdvanceOneStepHandler);
        const addRowButton = deriveButton("Add Row", fnAddRowHandler);
        const addColumnButton = deriveButton("Add Column", fnAddColumnHandler);
        const resetButton = deriveButton("Clear", fnClearHandler);
        const runButton = deriveButton("Run", fnRunHandler);
        runButton.setAttribute("id", "btnRun");
    
        const buttonContainerElement = document.createElement("div");
        buttonContainerElement.appendChild(advanceOneStepButton);
        buttonContainerElement.appendChild(addRowButton);
        buttonContainerElement.appendChild(addColumnButton);
        buttonContainerElement.appendChild(resetButton);
        buttonContainerElement.appendChild(runButton);
        
        return buttonContainerElement;
    }

    function deriveBoardAndControlElements(
            iterationCount,
            fnAdvanceOneStepHandler,
            fnAddRowHandler,
            fnAddColumnHandler,
            fnClearHandler,
            fnRunHandler) {
        const ruleDescriptionElement =
          deriveRuleDescriptionElement();
        const iterationCountElement =
          deriveIterationCountParagraph(iterationCount);

        const buttonContainerElement =
          deriveButtonContainerElement(
            fnAdvanceOneStepHandler,
            fnAddRowHandler,
            fnAddColumnHandler,
            fnClearHandler,
            fnRunHandler);

        return [
          iterationCountElement,
          buttonContainerElement,
          ruleDescriptionElement];
    }

    return {
        renderRunStopButtonAsRun: renderRunStopButtonAsRun,
        renderRunStopButtonAsStop: renderRunStopButtonAsStop,
        updateIterationCount: updateIterationCount,
        deriveBoardAndControlElements: deriveBoardAndControlElements,
        getCoordinatesFromClickEventTarget: getCoordinatesFromClickEventTarget
    };
};
