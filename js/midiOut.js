
let measures = [];
var base_measure = [];

class midiTimeSlice {
    t = 0; // What time the time slice belongs to for the measure
    notes = [];
    constructor(_t) {
        this.t = _t; // setting the id time for our time slice
        for(var i = 0; i < 25; i++) this.notes.push(new midiBox(i, this.t));
    }
}

class Measure {
    timeSlices = [];
    amtx = parseInt(document.getElementById("note_length").value);
    constructor() {
        this.timeSlices = [];
        for (var x = 0; x < this.amtx; x++)
            this.timeSlices.push(new midiTimeSlice(x));
    }
    getNotes() {
        var notes = [];
        for(var i in this.timeSlices)
            for(var j in this.timeSlices[i].notes)
                notes.push(this.timeSlices[i].notes[j]);
        return notes;
    }
}

var amtx = 8;

generate = function() {
    amtx = parseInt(document.getElementById("note_length").value);
    document.getElementById("genText").innerHTML = "<span style='border: 1px solid #000; background-color: #fff; padding-left: 5px; padding-right: 5px; padding-top: 2px; padding-bottom: 2px; color: red;'>Getting Ready...</span>";
    setupOut();
    document.getElementById("genText").innerHTML = "<span style='border: 1px solid #000; background-color: #fff; padding-left: 5px; padding-right: 5px; padding-top: 2px; padding-bottom: 2px; color: red;'>Try again...</span>";
    notTooRandom();

    document.getElementById("genText").innerHTML = "<span style='border: 1px solid #000; background-color: #fff; padding-left: 5px; padding-right: 5px; padding-top: 2px; padding-bottom: 2px; color: green;'>Finished</span>";
    document.getElementById("prev/downloadBtns").innerHTML = "<button id='preview_button' onclick='playGen(measures);'>Preview</button><button>Download</button>"
}

setupOut = function() {
    measures = [];
    for(var i = 0; i < amtx; i++) 
        measures.push(new Measure());
    grabBaseMeasure();
}

getParamMeasure = function() {
    console.log(SKETCH.notes);
}

completelyRandom = function() {
    for(var i in measures)
        for(var t = 0; t < measures[i].amtx; t++)
            for(var j in measures[i].timeSlices)
                for(var x in measures[i].timeSlices[j].notes)
                    if(Math.random() < 0.01) measures[i].timeSlices[j].notes[x].pressed = true;
}

/*
 * get neighbors is just trying to find what measures that fit inside the scope of their scale that will also work fit seemlessly into the song.
 */
get_random_neighbor = function(w) {
    // w is a single measure to the left or right of the output measures
    // N is a list of measures that could fit next to w.
    // fit is defined by having continuity between w -> N[any] -> w

    // the basic logic of this first test is just to randomly choose notes.
    var mainKey = w.timeSlices[w.timeSlices.length - 1].notes[0].nDiff;

    var n = new Measure();
    n.timeSlices[0].notes[mainKey].pressed = true;
    for(var t = 1; t < w.timeSlices.length; t++) {
        var ct = w.timeSlices[0].notes[0].ct;
        var rn = chordTypes[ct][0][Math.floor(Math.random() * chordTypes[ct][0].length)];
        n.timeSlices[t].notes[rn].pressed = Math.random() > 0.10;
    }
    return n;
}

get_slide_neighbor = function(w) {
    // the basic logic of this first test is just to slide the notes up or down by a certain amount.
    var mainKey = w.timeSlices[w.timeSlices.length - 1].notes[0].nDiff;

    var n = new Measure();
    //n.timeSlices[0].notes[mainKey].pressed = true;
    for(var t = 0; t < w.timeSlices.length; t++) {

        // this grabs each note in the current time slice within the measure w
        var notes = [];
        for(var i in w.timeSlices[t].notes)
            if(w.timeSlices[t].notes[i].pressed)
                notes.push(w.timeSlices[t].notes[i].note);
        
        var ct = w.timeSlices[0].notes[0].ct;
        change_by = [0,0,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3];
        var nchange = change_by[Math.floor(Math.random() * change_by.length)] * (Math.random() <= .5?1:-1);
        for(var i in notes) {
            if(chordTypes[ct][0].includes(notes[i])) {
                var nloc;
                for(nloc = 0; nloc < chordTypes[ct][0].length; nloc++) {
                    if(chordTypes[ct][0][nloc] === notes[i])
                        break;
                }
                if(nloc + nchange > chordTypes[ct][0].length - 1 || nloc + nchange < 0) nchange *= -1;
                var fnote = (fnote >= 0 && fnote <= 24) ? chordTypes[ct][0][nloc + nchange]: chordTypes[ct][0][nloc];
                
                n.timeSlices[t].notes[fnote].pressed = Math.random() > 0.05;
            } else {
                var nloc = notes[i];
                if(nloc + nchange > 24 || nloc + nchange < 0) nchange *= -1;
                var fnote = (fnote >= 0 && fnote <= 24) ? nloc + nchange: nloc;
                n.timeSlices[t].notes[fnote].pressed = Math.random() > 0.05;
            }
        }
    }
    return n;
}

createSection = function(amt, start_from, get_neighbor = get_slide_neighbor) {
    var section = [start_from];
    for(var i = 0; i < amt - 1; i++) 
        section.push(get_neighbor(section[section.length - 1]));
    return section;
}

notTooRandom = function() {
    var intro = createSection(2, base_measure);
    var chorus = createSection(4, intro[intro.length - 1]);
    var verse1 = createSection(6, chorus[chorus.length - 1]);
    var verse2 = createSection(6, chorus[chorus.length - 1]);
    var bridge = createSection(4, chorus[chorus.length - 1]);
    var outro = createSection(2, chorus[chorus.length - 1]);

    measures = intro.concat(chorus).concat(verse1).concat(chorus).concat(verse2).concat(chorus).concat(bridge).concat(chorus).concat(outro);
}

grabBaseMeasure = function() {
    res = new Measure();
    for(var x in SKETCH.notes)
        res.timeSlices[SKETCH.notes[x].time].notes[SKETCH.notes[x].note].pressed = SKETCH.notes[x].pressed;
    base_measure = res;
    return res
}

playGen = async function(lst) {
    console.log(lst);
    if(document.getElementById("preview_button").innerHTML === "Preview") {
        document.getElementById("preview_button").innerHTML = "Wait";
        for(var i in lst) {
            await playMidi(lst[i].getNotes());
        }
    }
    document.getElementById("preview_button").innerHTML = "Preview";
}