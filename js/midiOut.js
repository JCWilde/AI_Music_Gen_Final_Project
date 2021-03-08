
let bars = []
let ready = false;

class Bar {
    notes = [];
    amtx = 16;
    amty = 25;
    constructor() {
        this.notes = [];
        this.amtx = parseInt(document.getElementById("note_length").value);
        for (var x = 0; x < this.amtx; x++)
            for (var y = 0; y < this.amty; y++)
                this.notes.push(new midiBox(y, x));
    }
}

generate = function() {
    setupOut();
    completelyRandom();
}

setupOut = function() {
    ready = true;
    bars = [];
    for(var i = 0; i < 16; i++) 
        bars.push(new Bar());
}

completelyRandom = function() {
    for(var i in bars) {
        for(var t = 0; t < bars[i].amtx; t++) {
            for(var box in bars[i].notes) {
                if(bars[i].notes[box].time === t && Math.random() < 0.1) {
                    bars[i].notes[box].pressed = true;
                }
            }
        }
    }
}

playGen = async function() {
    if(ready) 
        for(var i in bars) {
            console.log(i);
            await playMidi(bars[i].notes);
        }
    else alert("You haven't generated anything yet!");
}