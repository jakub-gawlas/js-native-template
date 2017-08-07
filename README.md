# JS Native Template

## Installation

```bash
yarn add js-native-template
```

## Using

### Basic

```js
const createParser = require('js-native-template');

const parse = createParser();

(async () => {
  const result = await parse('Sum: 1 + 1 = ${1+1}');
  // result === 'Sum: 1 + 1 = 2'
})();
```

### With custom methods

```js
const createParser = require('js-native-template');

const methods = {
  echo: (x) => x,
  asyncEcho: async (x) => x
}

const parse = createParser(methods);

(async () => {
  const result = await parse('Echoes: ${echo("foo").toUpperCase()} ${asyncEcho("bar")}');
  // result === 'Echoes: FOO bar'
)();
```
