const codeImport = require('..');
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

test('Basic file import with baseDir', () => {
  expect(
    remark()
      .use(codeImport, {baseDir: '__fixtures__'})
      .processSync({
        contents: `
\`\`\`js file=./say-hi.js
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js file=./say-hi.js
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

test('Test without additional args', () => {
  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`js
Something
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "\`\`\`js
    Something
    \`\`\`
    "
  `);
});

test('Test without additional args or language tag', () => {
  expect(
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`
Something
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toMatchInlineSnapshot(`
    "    Something
    "
  `);
});

test('Test without langauge tag', () => {
  expect(() =>
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\` file=./__fixtures__/say-hi.js start=start_here end=end_here
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toThrowErrorMatchingInlineSnapshot(
    `"Language tag missing on code block snippet in /Users/jknox/github/remark-code-snippets/test.md"`
  );
});

test('Test without langauge tag and without space', () => {
  expect(() =>
    remark()
      .use(codeImport, {})
      .processSync({
        contents: `
\`\`\`file=./__fixtures__/say-hi.js start=start_here end=end_here
\`\`\`
`,
        path: path.resolve('test.md'),
      })
      .toString()
  ).toThrowErrorMatchingInlineSnapshot(
    `"Language tag missing on code block snippet in /Users/jknox/github/remark-code-snippets/test.md"`
  );
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
  ).toThrowErrorMatchingInlineSnapshot(
    `"Code block start marker \\"dont_start_here\\" not found in file ./__fixtures__/say-hi.js"`
  );
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
  ).toThrowErrorMatchingInlineSnapshot(
    `"Code block end marker \\"dont_end_here\\" not found in file ./__fixtures__/say-hi.js"`
  );
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
  ).toThrowErrorMatchingInlineSnapshot(
    `"Ambiguous code block start marker. Found more than once in ./__fixtures__/say-hi.js, at lines 4,8"`
  );
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
  ).toThrowErrorMatchingInlineSnapshot(
    `"Ambiguous code block end marker. Found more than once in ./__fixtures__/say-hi.js, at lines 4,8"`
  );
});
