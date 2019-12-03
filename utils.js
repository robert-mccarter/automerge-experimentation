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
