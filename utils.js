const fs = require('fs');
const { performance } = require('perf_hooks');

module.exports.createRandomPosition = () => {
    return Math.floor( Math.random() * 1000 ) - 500;
}

module.exports.timeIt = function( innerFn ) {
    // "Start" the timer
    const t0 = performance.now();

    // Call the function we want to performance test
    const result = innerFn();

    // Grab the resulting end-time and return the results
    const t1 = performance.now();
    const totalMilliseconds = t1 - t0;
    return [totalMilliseconds, result];
}

module.exports.saveDataToFile = function( title, savePath, data ) {
    if( !data )
        throw new Error("Must provide data to save");
    console.log(`Saving ${title}...`);
    fs.writeFile(savePath, data, { encoding: "utf8" }, err => {
        if( err )
            return console.log("Failed to serialize: ", err);
        console.log(`Successfully saved ${title}`);
    });

    return data;
}

module.exports.loadDataFromFile = async function( title, loadPath ) {
    console.log(`Loading ${title}...`);
    return fs.readFileSync(loadPath, "utf8");
}
