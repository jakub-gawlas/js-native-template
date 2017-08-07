/**
 * Return position in source ({ line, row }) where error occured
 * @param {*} error 
 * @param {*} startLine 
 * @param {*} startRow 
 */
function getErrorPosition(error, { startLine = 0, startRow = 0 }) {
  const stack = error.stack;
  const secondLine = stack.split('\n')[1];
  const position = secondLine
    .substring(0, secondLine.length - 1)
    .split('<anonymous>')
    .pop();
  const [, line, row] = position.split(':');
  return {
    line: line - startLine,
    row: line > 1 ? row : row - startRow,
  };
}

module.exports = getErrorPosition;
