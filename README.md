# JS Native Template

## Installation

```bash
yarn add js-native-template
```

## Examples

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

### Catch errors

```js
const createParser = require('js-native-template');

const parse = createParser();

(async () => {
  try {
  const result = await parse('Throw error: ${nonExisting}');
  } catch(err){
    // err.message === 'nonExisting is not defined at 1:16' - position of occured error is relative in parsed string
  }
})();
```
