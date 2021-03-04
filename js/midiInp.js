var synth = new Tone.PolySynth().toMaster();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

playMidi = async function(notes, BPM = 120) {
    var amt = document.getElementById('note_length').value;
    for (var b = 0; b < parseInt(amt); b++) {
        var N = [];
        for (var box in notes)
            if (notes[box].time === b && notes[box].pressed)
                N.push(notes[box].getNote());
        for (var n in N)
            synth.triggerAttackRelease(N[n], amt.toString() + "n");
        await sleep((60000 / BPM) / (parseInt(amt) / 4));
    }
}

function sketch_idnameofdiv(p) {
    midiBox = function(_note, _time) {
        this.note = _note;
        this.time = _time;
        this.pressed = false;
        this.color = SKETCH.color(0, 0, 0, 0);
        this.show = function() {
            p.stroke(p.color('#222222'));
            p.fill(this.color);
            p.rect((this.time * LSIZE) + textOffset, (p.windowHeight * 0.5) - (this.note * HSIZE) - HSIZE, LSIZE, HSIZE);
        }
        this.update = function(n) {
            switch (n) {
                case 0:
                    if (this.mouseInside()) {
                        this.pressed = !this.pressed;
                        if (this.pressed) {
                            this.color = p.color(0, 150, 0, 200);
                            // play note
                            synth.triggerAttackRelease(this.getNote(), document.getElementById('note_length').value + "n");
                        } else
                            this.color = p.color(0, 0, 0, 0);
                    }
                    break;
                case 1:
                    if (!this.pressed) {
                        if (this.mouseInside())
                            this.color = p.color(0, 0, 150, 200);
                        else
                            this.color = p.color(0, 0, 0, 0);
                    }
                    break;
            }
        }

        this.mouseInside = function() {
            if (p.mouseX - textOffset > this.time * LSIZE && p.mouseX - textOffset < this.time * LSIZE + LSIZE)
                if (p.mouseY > (p.windowHeight * 0.5) - (this.note * HSIZE) - HSIZE && p.mouseY < ((p.windowHeight * 0.5) - (this.note * HSIZE)))
                    return true;
            return false;
        }

        this.getNote = function() {
            var oct = parseInt(document.getElementById('octave').value) + Math.floor(this.note / 12);
            return noteText[this.note % 12] + oct.toString();
        }
    }
    let amtx = 16;
    let amty = 25;
    let HSIZE = 0;
    let LSIZE = 0;
    let textOffset = 32;
    let noffset = 0;
    let noteText = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let notes = [];

    let chordTypes = [
        [
            [2, 4, 5, 9, 11, 14, 16, 17, 21, 23],
            [7, 19]
        ],
        [
            [2, 3, 5, 8, 10, 14, 15, 17, 20, 22],
            [7, 19]
        ],
        [
            [1, 3, 4, 7, 9, 10, 13, 15, 16, 19, 21, 22],
            [6, 18]
        ],
        [
            [2, 3, 5, 8, 9, 11, 14, 15, 17, 20, 21, 23],
            [6, 18]
        ],
    ];
    let ct = 0;

    p.setup = function() {
        notes = [];

        amtx = parseInt(document.getElementById("note_length").value);

        p.createCanvas(document.getElementById('midiParam').clientWidth, p.windowHeight * 0.5);
        HSIZE = p.windowHeight * 0.5 / amty;
        LSIZE = (document.getElementById('midiParam').clientWidth - textOffset) / amtx;

        for (var x = 0; x < amtx; x++)
            for (var y = 0; y < amty; y++)
                notes.push(new midiBox(y, x));

        p.setNoteText();
        p.setChordType();
        p.notes = notes;
    }

    p.draw = function() {
        p.clear();

        // draw background color
        p.noStroke();
        var inKey = p.color('#D9D7DD');
        var outKey = p.color('#6C5A49');
        var main = p.color('#2274A5');
        var fifth = p.color('#E3B23C');
        for (var i = 0; i < 25; i++) {
            if ([0, 12, 24].includes(i)) p.fill(main);
            else if (chordTypes[ct][1].includes(i)) p.fill(fifth);
            else if (chordTypes[ct][0].includes(i)) p.fill(inKey);
            else p.fill(outKey);
            p.rect(0, (p.windowHeight * 0.5) - (i * HSIZE) - HSIZE, document.getElementById('midiParam').clientWidth, HSIZE + 1);
        }

        // show text
        p.textSize(HSIZE - 2);
        p.fill(0);
        for (var i = 0; i <= amty; i++)
            p.text(noteText[i % noteText.length], 4, (amty * HSIZE) - (HSIZE * i) - 3);

        // show notes
        p.stroke(0.5);
        for (var i in notes)
            notes[i].show();

    }

    p.setNoteText = function() {
        noteText = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        var n = parseInt(document.getElementById('key').value)
        var temp = [];
        for (var i = 0; i < n; i++) {
            temp.push(noteText[0]);
            noteText.shift();
        }
        for (var i = 0; i < n; i++)
            noteText.push(temp[i]);
        noffset = (parseInt(document.getElementById("octave").value)) + n;
    }

    p.setChordType = function() { ct = parseInt(document.getElementById('chord_type').value); }

    p.mousePressed = function() {
        for (var i in notes) {
            notes[i].update(1);
        }
    }

    p.mouseDragged = function() {
        for (var i in notes) {
            notes[i].update(1);
        }
    }

    p.mouseReleased = function() {
        for (var i in notes) {
            notes[i].update(0);
        }
        p.notes = notes;
    }

    p.windowResized = function() {
        p.resizeCanvas(document.getElementById('midiParam').clientWidth, p.windowHeight * 0.5);
        HSIZE = p.windowHeight * 0.5 / amty;
        LSIZE = (document.getElementById('midiParam').clientWidth - textOffset) / amtx;
    }
}
let SKETCH = new p5(sketch_idnameofdiv, 'midiParam')