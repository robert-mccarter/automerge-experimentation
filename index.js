// This is how you load Automerge in Node. In a browser, simply including the
// script tag will set up the Automerge object.
const Automerge = require('automerge')
const fs = require('fs');
const { performance } = require('perf_hooks');


// ////////////////////////////////////////////////////////////////////////////////////////////////
// Performance testing functions
// ////////////////////////////////////////////////////////////////////////////////////////////////

function timeIt( innerFn ) {
    // "Start" the timer
    const t0 = performance.now();

    // Call the function we want to performance test
    const result = innerFn();

    // Grab the resulting end-time and return the results
    const t1 = performance.now();
    const totalMilliseconds = t1 - t0;
    return [totalMilliseconds, result];
}



// ////////////////////////////////////////////////////////////////////////////////////////////////
// Create Widget functions
// ////////////////////////////////////////////////////////////////////////////////////////////////

function createRandomPosition() {
    return Math.floor( Math.random() * 1000 ) - 500;
}

function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ )
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

// Create a random widget with a (probably) unique ID and a counter
let counter = 0;
function createRandomWidget() {
    const x = createRandomPosition();
    const y = createRandomPosition();
    const name = makeId(10);
    counter += 1;
    return { name, x, y, counter, done: false };
}


/**
 * Pre-create a collection of widgets, so the actual widget creation
 * is not part of our performance timing
 */
function preCreateWidgets(numberOfWidgets) {
    console.log("Creating test widgets...");

    const widgets = [];
    for( i=0; i<numberOfWidgets; i+=1 ) {
        const newWidget = createRandomWidget();
        widgets.push( newWidget );
    }//for

    console.log(`Created ${widgets.length} test widgets`);
    return widgets;
}


function addWidgetsToDoc( doc, numberOfWidgets, preCreatedWidgets, startIndex) {
    return Automerge.change(doc, 'Add widget', doc => {
        for( i=0; i<numberOfWidgets; i+=1 ) {
            // Grab the next pre-created widget
            let widget = undefined;
            if( preCreatedWidgets ) {
                widget = preCreatedWidgets[ startIndex + i ];
                if( !widget ) {
                    console.error(`Failed to find widget at index ${i}`);
                    return;
                }
            } else
                widget = createRandomWidget();

            // Add it to the document using the change method
            doc.widgets.push( widget );
        }//for
    });
}


function createLargeDocument(preCreatedWidgets, blockSize) {
    console.log("Creating document...");
    let doc = Automerge.from({ widgets: [] });

    // Ensure the block-size is valid
    const numberOfWidgets = preCreatedWidgets.length;
    blockSize = blockSize || 1000;
    if( blockSize > numberOfWidgets )
        blockSize = Math.floor(numberOfWidgets / 10);

    let timeMs = 0;
    const timings = [];
    for( let i=0; i<numberOfWidgets; i+=blockSize ) {
        // Insert another block of widgets
        [timeMs, doc] = timeIt( () => addWidgetsToDoc(doc, blockSize, preCreatedWidgets, i) );

        // Print a nice message and record the time
        const endOfBlock = i+blockSize;
        timings.push( {endOfBlock, blockSize, timeMs} )
        console.log(`${endOfBlock} - Added ${blockSize} widgets in ${Math.floor(timeMs)}ms`);
    }

    if( doc.widgets.length == numberOfWidgets )
         console.log(`Successfully created document with ${numberOfWidgets} widgets`);
    else console.error(`Failed to create ${numberOfWidgets} - created ${doc.widgets.length}`);

    return [timings, doc];
}



// ////////////////////////////////////////////////////////////////////////////////////////////////
// Main test code
// ////////////////////////////////////////////////////////////////////////////////////////////////

function saveDocument( savePath, doc ) {
    if( !doc )
        throw new Error("Must provide a document to save");
    const serialized = Automerge.save(doc);
    console.log("Saving...");
    fs.writeFile(savePath, serialized, err => {
        if( err )
            return console.log("Failed to serialize: ", err);
        console.log("Successfully saved");
    });

    return serialized;
}


// Run it!
const numberOfWidgets = 10000;
const blockSize = 1000;
const preCreatedWidgets = preCreateWidgets(numberOfWidgets);
let [timings, doc1] = createLargeDocument(preCreatedWidgets, blockSize);

saveDocument("c:/tmp/automerge-output.doc.json", doc1);
