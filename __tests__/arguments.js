const {parseArgs} = require('../arguments.js');

test("Just file name", () => {
    expect(parseArgs("file=some/path ")).toEqual(
        {
            file: 'some/path'
        }
    );
});

test("File name, start and end", () => {
    expect(parseArgs("file=some/path start=start_here end=end_here")).toEqual(
        {
            file: 'some/path',
            start: 'start_here',
            end: 'end_here',
        }
    );
});
