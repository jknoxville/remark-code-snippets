type Args = { start?: any; file?: any; end?: any; }

exports.parseArgs = function(meta: string): Args {
    const result: Args = {};
    meta.split(' ').forEach(arg => {
        const keyLength = arg.indexOf('=');
        if (keyLength < 0) {
            return;
        }
        const key = arg.slice(0, keyLength);
        const value = arg.slice(keyLength + 1);
        // @ts-ignore
        result[key] = value;
    });

    return result;
}
