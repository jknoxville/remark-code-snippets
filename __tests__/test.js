const codeImport = require('../');
const remark = require('remark');
const path = require('path');

test('Basic file import', () => {
  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`js file=./__fixtures__/say-hi.js
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./__fixtures__/say-hi.js
    function doSomething() {
        return 1;
    }

    // start_here

    console.log('Hello remark-code-snippets!');

    // end_here

    function doSomethingElse() {
        return 2;
    }
    \`\`\`
    "
  `);
});

test('Basic file import between markers', () => {
  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`js file=./__fixtures__/say-hi.js start=start_here end=end_here
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./__fixtures__/say-hi.js start=start_here end=end_here

    console.log('Hello remark-code-snippets!');

    \`\`\`
    "
  `);
});

test('Just a start marker', () => {
  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`js file=./__fixtures__/say-hi.js start=start_here
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./__fixtures__/say-hi.js start=start_here

    console.log('Hello remark-code-snippets!');

    // end_here

    function doSomethingElse() {
        return 2;
    }
    \`\`\`
    "
  `);
});

test('Just an end marker', () => {
  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`js file=./__fixtures__/say-hi.js end=end_here
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./__fixtures__/say-hi.js end=end_here
    function doSomething() {
        return 1;
    }

    // start_here

    console.log('Hello remark-code-snippets!');

    \`\`\`
    "
  `);
});

test('Start marker not found', () => {
  expect(() =>
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`js file=./__fixtures__/say-hi.js start=dont_start_here
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toThrow();
});

test('End marker not found', () => {
  expect(() =>
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`js file=./__fixtures__/say-hi.js end=dont_end_here
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toThrow();
});

test('Ambiguous start marker', () => {
  expect(() =>
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`js file=./__fixtures__/say-hi.js start=here
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toThrow();
});

test('Ambiguous end marker', () => {
  expect(() =>
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`js file=./__fixtures__/say-hi.js end=here
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toThrow();
});
