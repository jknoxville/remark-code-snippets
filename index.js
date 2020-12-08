const fs = require('fs');
const path = require('path');
const visit = require('unist-util-visit');
const {parseArgs} = require('./arguments.js');

function codeImport(options = {}) {
  return function transformer(tree, file) {
    const codes = [];
    const promises = [];

    visit(tree, 'code', (node, index, parent) => {
      codes.push([node, index, parent]);
    });

    for (const [node] of codes) {
      const args = parseArgs(node.meta);
      if (!args.file) {
        continue;
      }
      const fileAbsPath = path.resolve(file.dirname, args.file);

      if (options.async) {
        promises.push(
          new Promise((resolve, reject) => {
            fs.readFile(fileAbsPath, 'utf8', (err, fileContent) => {
              if (err) {
                reject(err);
                return;
              }

              node.value = getSnippet(fileContent, args);
              resolve();
            });
          })
        );
      } else {
        const fileContent = fs.readFileSync(fileAbsPath, 'utf8');

        node.value = getSnippet(fileContent, args);
      }
    }

    if (promises.length) {
      return Promise.all(promises);
    }
  };
}

function getSnippet(fileContent, args) {
  let lines = fileContent.trim().split('\n');

  let startingLine = 0;
  let endingLine = undefined;

  if (args.start) {
    const numbers = getLineNumbersOfOccurrence(lines, args.start);
    if (numbers.length === 0) {
      throw new Error(`Code block start marker "${args.start}" not found in file ${args.file}`);
    }
    if (numbers.length > 1) {
      throw new Error(`Ambiguous code block start marker. Found more than once in ${args.file}, at lines ${numbers}`);
    }
    startingLine = numbers[0] + 1;
  }

  if (args.end) {
    const numbers = getLineNumbersOfOccurrence(lines, args.end);
    if (numbers.length === 0) {
      throw new Error(`Code block end marker "${args.end}" not found in file ${args.file}`);
    }
    if (numbers.length > 1) {
      throw new Error(`Ambiguous code block end marker. Found more than once in ${args.file}, at lines ${numbers}`);
    }
    endingLine = numbers[0];
  }

  lines = lines.slice(startingLine, endingLine);

  return lines.join('\n');
}

function getLineNumbersOfOccurrence(lines, searchTerm) {
  let lineNumbers = [];
  lines.forEach((line, index) => {
    const startIndex = line.indexOf(searchTerm);
    if (startIndex > -1) {
      lineNumbers.push(index);
    }
  });
  return lineNumbers;
}

module.exports = codeImport;
