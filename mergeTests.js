const Automerge = require('automerge')
const { timeIt, loadDataFromFile } = require('./utils');
const { changeLargeDocument } = require('./change');

// Load the file and create two identical documents from it
const serializedDataPromise = loadDataFromFile( "Document 1", "c:/tmp/automerge-output.doc1.json");
serializedDataPromise.then( serializedData => {
    console.log("Data loaded, creating Automerge documents...");
    let doc1 = Automerge.load(serializedData);
    let doc2 = Automerge.load(serializedData);

    // Change the first one slightly
    const totalNumberOfChanges = 10;
    let [unused, doc2_changed] = changeLargeDocument(doc2, totalNumberOfChanges);

    let [mergeTime, _] = timeIt( () => Automerge.merge(doc1, doc2_changed) );
    console.log(`Merge time: ${Math.floor(mergeTime)}ms`);
}).catch( error => {
    console.error("Failed: ", error);
});
