# `remark-code-snippets`

Remark plugin for importing snippets of source files, as code blocks, based on markers found in the file.

[![npm version](https://badge.fury.io/js/remark-code-snippets.svg)](https://badge.fury.io/js/remark-code-snippets)

## Installation

```sh
yarn add -D remark-code-snippets
```

## Setup

See [**Using plugins**](https://github.com/remarkjs/remark/blob/master/doc/plugins.md#using-plugins) in the official documentation.

## Usage

Adds file, start, and end options to code blocks in markdown.

When file is specified, that files contents are inserted into the code block. The path is relative to the markdown file importing it.

When start is specified, the file is searched for that keyword, and if found, only lines after the line containing the keyword are included.

When end is specified, the file is searched for that keyword, and if found, only lines up to the line containing the keyword are included.

If start or end are supplied, and either of those keywords are not found in the file, or more than one occurrence of them are found, then we intentionally fail the transformation.

When a source file contains the following:
```js
console.log('This will not be included');

// start_here

console.log('This will be included');

// end_here

console.log('This will also not be included');
```

...then the following code block:

````md
```js file=./say-hi.js start=start_here end=end_here
```
````

...will be transformed into:

````md
```js file=./say-hi.js start=start_here end=end_here
console.log('This willl be included');
```
````

## Options

- `async`: By default, this plugin uses `readFileSync` to read the contents of the files. Set this to `true` if you want to use `readFile` for non-blocking IO.

## Testing

After installing dependencies with `yarn`, the tests can be run with: `yarn test`

