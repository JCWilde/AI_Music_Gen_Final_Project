
let bars = []

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

setup_out = function() {
    bars = [];
    for(var i = 0; i < 16; i++) 
        bars.push(new Bar());
}