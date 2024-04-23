'use strict'

export const GridUtilities = function () {
  function deriveMinAndMaxRowAndColumnIndexesFrom (rowIndexes, columnIndexes) {
    const minRowIndex = Math.min(...rowIndexes)
    const maxRowIndex = Math.max(...rowIndexes)
    const minColumnIndex = Math.min(...columnIndexes)
    const maxColumnIndex = Math.max(...columnIndexes)
    return {
      minRowIndex,
      maxRowIndex,
      minColumnIndex,
      maxColumnIndex
    }
  }

  return {
    deriveMinAndMaxRowAndColumnIndexesFrom
  }
}
