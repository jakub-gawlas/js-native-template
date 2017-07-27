'use strict';

let customArgs = {};
function parser(methods = {}) {
  const dynamicFunc = createParser(methods);
  return async (src, args = {}) => {
    if (!src) throw new Error('Nothing to parse.');
    customArgs = args;
    const normalized = normalize(src);
    const parsed = await dynamicFunc(normalized);
    return denormalize(parsed);
  };
}

function createParser(availableMethods) {
  const methodsNames = Object.keys(availableMethods);
  const methods = methodsNames.map(x => availableMethods[x]);
  const func = new Function(
    'parse',
    ...methodsNames,
    'src',
    'return eval("parse`" + src + "`")'
  );
  return func.bind(null, parse, ...methods);
}

async function parse(statics, ...dynamics) {
  const evaluated = await Promise.all(
    dynamics.map(async x => await evaluate(x))
  );
  return statics.reduce((res, x, i) => `${res}${x}${evaluated[i] || ''}`, '');
}

async function evaluate(expression) {
  if (expression instanceof Function) {
    return expression(customArgs[expression.name]);
  }
  if (expression instanceof Promise) {
    return await expression;
  }
  return expression;
}

const SINGLE_QUOTE_REPLACEMENT = '\0';
/**
 * Replaces single quotes
 * @param {string} src 
 */
function normalize(src) {
  return src.replace(/\`/g, SINGLE_QUOTE_REPLACEMENT);
}
function denormalize(src) {
  const regex = new RegExp(SINGLE_QUOTE_REPLACEMENT, 'g');
  return src.replace(regex, '`');
}

module.exports = parser;
