"use strict";

const GameOfLifeHtmlGeneration_HtmlTable = function (gameOfLifeLogicModule) {
    const rowIndexAttributeName = "rowIndex";
    const columnIndexAttributeName = "columnIndex";
    const iterationCountElementId = "iterationCount";
    const liveAttributeName = "live";
    const liveCellCSSClassToken = "liveCell";
    const gameOfLifeCellCSSClassToken = "cell";

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

    function generateBoardHeaderTRElementFrom(leftColumnIndex, rightColumnIndex) {
        const firstTHElement = document.createElement("th");
        firstTHElement.classList.add("noPadding");
        firstTHElement.innerHTML = "&nbsp";
        const rc = document.createElement("tr");
        rc.appendChild(firstTHElement);
        for (let i = leftColumnIndex; i <= rightColumnIndex; i++) {
            const nextTHElement = document.createElement("th");
            nextTHElement.classList.add("noPadding");
            const textNode = document.createTextNode(Math.abs(i % 10));
            nextTHElement.appendChild(textNode);
            rc.appendChild(nextTHElement);
        }
        return rc;
    }

    function generateRowElementFrom(
            rowIndex,
            leftColumnIndex,
            rightColumnIndex,
            fnHandleCellClick) {
        const tdElement = document.createElement("td");
        tdElement.classList.add("noPadding");
        const textNode = document.createTextNode(Math.abs(rowIndex % 10));
        tdElement.appendChild(textNode);
        const rc = document.createElement("tr");
        rc.appendChild(tdElement);
        for (let columnIndex = leftColumnIndex; columnIndex <= rightColumnIndex; columnIndex++) {
            const tdElement = document.createElement("td");
            tdElement.setAttribute(rowIndexAttributeName, rowIndex);
            tdElement.setAttribute(columnIndexAttributeName, columnIndex);
            tdElement.classList.add(gameOfLifeCellCSSClassToken);
            tdElement.addEventListener("click", fnHandleCellClick);
            if (gameOfLifeLogicModule.isThereALiveCellAt(rowIndex, columnIndex)) {
                tdElement.setAttribute(liveAttributeName, "");
                tdElement.classList.add(liveCellCSSClassToken);
            }
            else {
                tdElement.removeAttribute(liveAttributeName);
                tdElement.innerHTML = "&nbsp";
            }
            rc.appendChild(tdElement);
        }
        return rc;
    }

    function generateBoardAsTableHtmlElementFrom(
            startingBoardCoordinates,
            fnHandleCellClick) {
        const tableElement = document.createElement("table");
        const boardHeaderTRElement =
          generateBoardHeaderTRElementFrom(
            startingBoardCoordinates.minColumnIndex,
            startingBoardCoordinates.maxColumnIndex);
        tableElement.appendChild(boardHeaderTRElement);
        for (let rowIndex = startingBoardCoordinates.minRowIndex; rowIndex <= startingBoardCoordinates.maxRowIndex; rowIndex++) {
            const rowElement =
              generateRowElementFrom(
                rowIndex,
                startingBoardCoordinates.minColumnIndex,
                startingBoardCoordinates.maxColumnIndex,
                fnHandleCellClick);
            tableElement.appendChild(rowElement);
        }
        return tableElement;
    }

    function deriveOuterCoordinatesOfExistingBoard() {
        const cellTDElements =
          document.querySelectorAll("." + gameOfLifeCellCSSClassToken);
        const rowIndexes = Array.from(cellTDElements).map(function (cellTDElement) {
            return getRowIndexFrom(cellTDElement);
        });
        const columnIndexes = Array.from(cellTDElements).map(function (cellTDElement) {
            return getColumnIndexFrom(cellTDElement);
        });
        const minAndMaxRowAndColumnIndexes =
            GridUtilities.deriveMinAndMaxRowAndColumnIndexesFrom(
                rowIndexes,
                columnIndexes);
        return minAndMaxRowAndColumnIndexes;
    }

    function deriveBoardElement(startingBoardCoordinates, fnHandleCellClick) {
        const outerLiveCellCoordinates =
          gameOfLifeLogicModule.outerCoordinatesOfLiveCells();

        //expand board outer coordinates if necessary
        startingBoardCoordinates.minRowIndex =
          Math.min(
            startingBoardCoordinates.minRowIndex,
            outerLiveCellCoordinates.minRowIndex);
        startingBoardCoordinates.minColumnIndex =
          Math.min(
            startingBoardCoordinates.minColumnIndex,
            outerLiveCellCoordinates.minColumnIndex);
        startingBoardCoordinates.maxRowIndex =
          Math.max(
            startingBoardCoordinates.maxRowIndex,
            outerLiveCellCoordinates.maxRowIndex);
        startingBoardCoordinates.maxColumnIndex =
          Math.max(
            startingBoardCoordinates.maxColumnIndex,
            outerLiveCellCoordinates.maxColumnIndex);
        const boardAsHtmlTableElement =
          generateBoardAsTableHtmlElementFrom(
            startingBoardCoordinates,
            fnHandleCellClick);
        return boardAsHtmlTableElement;
    }

    function getCoordinatesFromClickEventTarget(e) {
      const tdElement = e.target;
      return {
        rowIndex: getRowIndexFrom(tdElement),
        columnIndex: getColumnIndexFrom(tdElement)
      };
    }

    function deriveBoardWithAdditionalRow(fnCellClickHandler) {
        const boardOuterCoordinates = deriveOuterCoordinatesOfExistingBoard();
        boardOuterCoordinates.maxRowIndex += 1;
        const boardAsHtmlTableElement =
          deriveBoardElement(
            boardOuterCoordinates,
            fnCellClickHandler);
        return boardAsHtmlTableElement;
    }

    function deriveBoardWithAdditionalColumn(fnCellClickHandler) {
        const boardOuterCoordinates = deriveOuterCoordinatesOfExistingBoard();
        boardOuterCoordinates.maxColumnIndex += 1;
        const boardAsHtmlTableElement =
          deriveBoardElement(boardOuterCoordinates, fnCellClickHandler);
        return boardAsHtmlTableElement;
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

    function deriveBoardUsingMinimumOuterCoordinatesAndLiveCells(startingBoardCoordinates, fnCellClickHandler) {
        const boardAsHtmlTableElement =
          deriveBoardElement(startingBoardCoordinates, fnCellClickHandler);
        return boardAsHtmlTableElement;
    }

    function deriveBoardUsingExistingBoardAndLiveCells(fnCellClickHandler) {
        const boardOuterCoordinates = deriveOuterCoordinatesOfExistingBoard();
        const boardAsHtmlTableElement =
          deriveBoardElement(boardOuterCoordinates, fnCellClickHandler);
        return boardAsHtmlTableElement;
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
            startingBoardCoordinates,
            fnCellClickHandler,
            fnAdvanceOneStepHandler,
            fnAddRowHandler,
            fnAddColumnHandler,
            fnClearHandler,
            fnRunHandler) {
        const ruleDescriptionElement =
          deriveRuleDescriptionElement();
        const iterationCountElement =
          deriveIterationCountParagraph(iterationCount);
        const boardTableElement =
          deriveBoardElement(startingBoardCoordinates, fnCellClickHandler);
        const boardPElement = document.createElement("p");
        boardPElement.setAttribute("id", "board");
        boardPElement.appendChild(boardTableElement);
        const buttonContainerElement =
          deriveButtonContainerElement(
            fnAdvanceOneStepHandler,
            fnAddRowHandler,
            fnAddColumnHandler,
            fnClearHandler,
            fnRunHandler);

        return [
          iterationCountElement,
          boardPElement,
          buttonContainerElement,
          ruleDescriptionElement];
    }

    return {
        deriveBoardWithAdditionalRow: deriveBoardWithAdditionalRow,
        deriveBoardWithAdditionalColumn: deriveBoardWithAdditionalColumn,
        renderRunStopButtonAsRun: renderRunStopButtonAsRun,
        renderRunStopButtonAsStop: renderRunStopButtonAsStop,
        updateIterationCount: updateIterationCount,
        deriveBoardUsingMinimumOuterCoordinatesAndLiveCells: deriveBoardUsingMinimumOuterCoordinatesAndLiveCells,
        deriveBoardUsingExistingBoardAndLiveCells: deriveBoardUsingExistingBoardAndLiveCells,
        deriveBoardAndControlElements: deriveBoardAndControlElements,
        getCoordinatesFromClickEventTarget: getCoordinatesFromClickEventTarget
    };
};
