exports.parseArgs = function(meta) {
    const result = {};
    meta.split(' ').forEach(arg => {
        const keyLength = arg.indexOf('=');
        if (keyLength < 0) {
            return;
        }
        const key = arg.slice(0, keyLength);
        const value = arg.slice(keyLength + 1);
        result[key] = value;
    });

    return result;
}
