"use strict";

const TwoDimensionalGameOfLifeLogic = function (arrBornNeighborCount, arrSurvivesNeighborCount) {
    function LiveCell(rowIndex, columnIndex) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }

    let liveCells = [];
    let iterationCount = 0;

    function addSimpleGliderGoingUpAndLeft(rowIndex, columnIndex) {
        liveCells.push(
            new LiveCell(rowIndex, columnIndex),
            new LiveCell(rowIndex, columnIndex + 1),
            new LiveCell(rowIndex, columnIndex + 2),
            new LiveCell(rowIndex + 1, columnIndex),
            new LiveCell(rowIndex + 2, columnIndex + 1)
        );
    }

    function addSimpleGliderGoingDownAndRight(rowIndex, columnIndex) {
        liveCells.push(
            new LiveCell(rowIndex, columnIndex + 1),
            new LiveCell(rowIndex + 1, columnIndex + 2),
            new LiveCell(rowIndex + 2, columnIndex),
            new LiveCell(rowIndex + 2, columnIndex + 1),
            new LiveCell(rowIndex + 2, columnIndex + 2)
        );
    }

    function outerCoordinatesOfLiveCells() {
        const rowIndexes = liveCells.map(function (cell) {
            return cell.rowIndex;
        });
        const columnIndexes = liveCells.map(function (cell) {
            return cell.columnIndex;
        });
        const minAndMaxRowAndColumnIndexes = 
            GridUtilities.deriveMinAndMaxRowAndColumnIndexesFrom(
                rowIndexes, columnIndexes);
        return minAndMaxRowAndColumnIndexes;
    }

    function isThereALiveCellAt(rowIndex, columnIndex) {
        const matchingLiveCells = liveCells.filter(function (liveCell) {
            return liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex
        });
        return matchingLiveCells.length;
    }

    function deriveNumberOfLiveNeighbors(rowIndex, columnIndex) {
        const liveNeighborCells = liveCells.filter(function (liveCell) {
            return liveCell.rowIndex >= rowIndex - 1
                && liveCell.rowIndex <= rowIndex + 1
                && liveCell.columnIndex >= columnIndex - 1
                && liveCell.columnIndex <= columnIndex + 1
                && !(liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex);
        });
        return liveNeighborCells.length;
    }

    function deriveNextSetOfLiveCellsFromCurrentLiveCells() {
        //find indexes just outside the live cells
        const liveCellCoordinatesExpandedBy1 = outerCoordinatesOfLiveCells();
        liveCellCoordinatesExpandedBy1.minRowIndex -= 1;
        liveCellCoordinatesExpandedBy1.minColumnIndex -= 1;
        liveCellCoordinatesExpandedBy1.maxRowIndex += 1;
        liveCellCoordinatesExpandedBy1.maxColumnIndex += 1;

        const newLiveCells = new Array();
        for (let rowIndex = liveCellCoordinatesExpandedBy1.minRowIndex; rowIndex <= liveCellCoordinatesExpandedBy1.maxRowIndex; rowIndex++) {
            for (let columnIndex = liveCellCoordinatesExpandedBy1.minColumnIndex; columnIndex <= liveCellCoordinatesExpandedBy1.maxColumnIndex; columnIndex++) {
                const liveNeighborCount =
                  deriveNumberOfLiveNeighbors(rowIndex, columnIndex);
                if ((isThereALiveCellAt(rowIndex, columnIndex) && arrSurvivesNeighborCount.includes(liveNeighborCount)) || arrBornNeighborCount.includes(liveNeighborCount)) {
                    newLiveCells.push(new LiveCell(rowIndex, columnIndex));
                }
            }
        }
        return newLiveCells;
    }

    function advanceOneStep() {
        liveCells = deriveNextSetOfLiveCellsFromCurrentLiveCells();
        iterationCount++;
    }

    function toggleCellLiveness(rowIndex, columnIndex) {
        const index = liveCells.findIndex(function (liveCell) {
            return liveCell.rowIndex === rowIndex && liveCell.columnIndex === columnIndex;
        });
        if (index === -1) {
            liveCells.push(new LiveCell(rowIndex, columnIndex));
        } else {
            liveCells.splice(index, 1);
        }
    }

    function clearLiveCells() {
        liveCells = [];
        //iterationCount = 0;
    }

    function getIterationCount() {
        return iterationCount;
    }

    return {
        addSimpleGliderGoingUpAndLeft: addSimpleGliderGoingUpAndLeft,
        addSimpleGliderGoingDownAndRight: addSimpleGliderGoingDownAndRight,
        outerCoordinatesOfLiveCells: outerCoordinatesOfLiveCells,
        isThereALiveCellAt: isThereALiveCellAt,
        advanceOneStep: advanceOneStep,
        toggleCellLiveness: toggleCellLiveness,
        clearLiveCells: clearLiveCells,
        getIterationCount: getIterationCount
    }
};
