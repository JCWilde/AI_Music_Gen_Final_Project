
let measures = []
let ready = false;

class midiTimeSlice {
    t = 0; // What time the time slice belongs to for the measure
    notes = [];
    constructor(_t) {
        this.t = _t; // setting the id time for our time slice
        for(var i = 0; i < 25; i++) this.notes.push(new midiBox(this.t, i))
    }
}

class Measure {
    timeSlices = [];
    amtx = 16;
    constructor() {
        this.timeSlices = [];
        this.amtx = parseInt(document.getElementById("note_length").value);
        for (var x = 0; x < this.amtx; x++)
            this.timeSlices.push(new midiTimeSlice(x));
    }
}

generate = function() {
    setupOut();
    completelyRandom();
}

setupOut = function() {
    ready = true;
    measures = [];
    for(var i = 0; i < 16; i++) 
        measures.push(new Measure());
}

getParamMeasure = function() {
    console.log(SKETCH.notes);
}

completelyRandom = function() {
    for(var i in measures) {
        for(var t = 0; t < measures[i].amtx; t++) {
            for(var j in measures[i].timeSlices) {
                for(var x in measures[i].timeSlices[j].notes) {
                    if(Math.random() < .1) measures[i].timeSlices[j].notes[x].pressed = true;
                }
            }
        }
    }
}

playGen = async function() {
    if(ready) 
        for(var i in measures) {
            notes = [];
            for(var j in measures[i].timeSlices)
                for(var x in measures[i].timeSlices[j].notes)
                    notes.push(measures[i].timeSlices[j].notes[x]);
            await playMidi(notes);
        }
    else alert("You haven't generated anything yet!");
}