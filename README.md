# slanted

Generate beautiful static documentation for your API from Slate compatible markdown, using [Slant](https://github.com/Mermade/slant).

## Installation and use

Install cli using NPM:

```shell
npm install -g slanted

slanted openapi.md --inline
```

or as a library

```shell
npm install --save slanted
```

```js
const { slanted } = require('slanted')

(async function () {
  await slanted({
    filepath: 'openapi.md',
    inline: true
  })
})()
```
