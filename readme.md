# Automerge experimentation

This is a quick experimentation I threw together to test various performance aspects of Automerge.

My primary objective was hacking up some code to learn and test Automerge, so I haven't added very much documentation or been too concerned with the code quality.

## Files

* [`index.js`](./index.js)
  The main tests, which create the output files later used by `mergeTests.js`
* [`mergeTests.js`](./mergeTests.js)
* loads the previously created file (twice), makes a few changes and then times how long it takes to merge them together.
* [`change.js`](./change.js)
  The code that makes changes to an Automerge document.
  This file is used by both `index.js` and `mergeTets.js`.
* [`utils.js`](./utils.js)
  Simple little helper functions, that create a random
  x/y "position" value, a timer function, and save/load
  functions.

## Hacks

The biggest hack is the complete lack of command line parsing.

If you want to change the number of items created, where files are saved, etc. just hack on the code.  :-)
