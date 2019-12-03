// This is how you load Automerge in Node. In a browser, simply including the
// script tag will set up the Automerge object.
const Automerge = require('automerge')
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




// Let's say doc1 is the application state on device 1.
// Further down we'll simulate a second device.
// We initialize the document to initially contain an empty list of widgets.
let doc1 = Automerge.from({ widgets: [] })

const preCreatedWidgets = preCreateWidgets(100);
addWidgetsToDoc(doc1, 100, preCreatedWidgets, 0);


doc1 = Automerge.change(doc1, 'Add card', doc => {
    const object = createRandomWidget();
    doc.widgets.push(object);
    doc.widgets.push(object);

    for( let i = 0; i<100; i+=1 ) {
       doc.widgets.push(  createRandomWidget() );
    }//for
})



const result = Automerge.save(doc1);

console.log( result );
