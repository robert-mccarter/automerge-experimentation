const Automerge = require('automerge')
const { timeIt, createRandomPosition } = require('./utils');

function changeWidget(doc, widgetIndex) {
    return Automerge.change(doc, 'Add widget', doc => {
        // Grab the widget
        if( widgetIndex > doc.widgets.length )
            console.error("Invalid index for changing widget: ", widgetIndex);
        const widget = doc.widgets[widgetIndex];

        // Update some properties of the widget
        widget.x = createRandomPosition();
        widget.y = createRandomPosition();
        widget.changed = true;
        if( widget.changeCounter )
            widget.changeCounter += 1;
        else widget.changeCounter = 1;
    });
}

module.exports.changeLargeDocument = function(doc, totalChanges) {
    console.log("Changing document...");

    let timeMs = 0;
    const timings = [];
    for( let i=0; i<totalChanges; i+=1 ) {
        const len =  doc.widgets.length;
        const randomChangeIndex =  Math.floor(Math.random()*len);
        [timeMs, doc] = timeIt( () => changeWidget(doc, randomChangeIndex) );

        timings.push( {i, changed: 1, timeMs} )
        if( i % 100 == 0 )
            console.log(`${i} - Changed 1 widgets in ${Math.floor(timeMs)}ms`);
    }

    console.log("Created document");
    return [timings, doc];
}
