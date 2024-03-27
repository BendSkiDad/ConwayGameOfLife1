"use strict";

const GridUtilities = function () {
    function deriveMinAndMaxRowAndColumnIndexesFrom(rowIndexes, columnIndexes) {
        const minRowIndex = Math.min(...rowIndexes);
        const maxRowIndex = Math.max(...rowIndexes);
        const minColumnIndex = Math.min(...columnIndexes);
        const maxColumnIndex = Math.max(...columnIndexes);
        return {
            minRowIndex: minRowIndex,
            maxRowIndex: maxRowIndex,
            minColumnIndex: minColumnIndex,
            maxColumnIndex: maxColumnIndex
        }
    }

    return {
        deriveMinAndMaxRowAndColumnIndexesFrom: deriveMinAndMaxRowAndColumnIndexesFrom
    }
}();
