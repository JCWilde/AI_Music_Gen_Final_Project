var synth = new Tone.PolySynth().toMaster();

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

class midiBox {
    noteText = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    nDiff = 0;
    noffest = parseInt(document.getElementById("octave").value);
    ct = parseInt(document.getElementById('chord_type').value);

    note = 0;
    time = 0;
    pressed = false;

    constructor(_note, _time) {
        this.note = _note;
        this.time = _time;

        // This is pretty much the same code from set music, the basic idea is that each time
        // slice will be able to have its own key, this will allow for key switches over time.
        this.noteText = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        this.nDiff = parseInt(document.getElementById('key').value);
        for (var i = 0; i < this.nDiff; i++) this.noteText.push(this.noteText.shift());
        this.noffset = parseInt(document.getElementById("octave").value);
        this.ct = parseInt(document.getElementById('chord_type').value);
    }

    setMusicInfo(_nDiff) {
        this.noteText = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        this.nDiff = _nDiff;
        for (var i = 0; i < this.nDiff; i++) this.noteText.push(this.noteText.shift());
        this.noffset = (parseInt(document.getElementById("octave").value));
        this.ct = parseInt(document.getElementById('chord_type').value);
    }
    
    getNote() {
        var oct = this.noffset + Math.floor((this.note + this.nDiff) / 12);
        return this.noteText[this.note % 12] + oct.toString();
    }
}

/*
 * Chord Types is a reference to the type of chord the song is using at the time, either major minor, or the diminished variations... 
 * The first part of each chord type is all the non-accidental keys within the chord except for the roots and fifths.
 * The second part is the fifth. I include this information only for the input section so that when you are entering midi, it
 * Feels more like one of those online midi editors. Otherwise, I can just put the two lists together and choose notes or I could
 * Use the 5th notes to let the generator know what a good note to land on would be.
 */
const chordTypes = [
    [
        // major
        [2, 4, 5, 9, 11, 14, 16, 17, 21, 23],
        [7, 19]
    ],
    [
        // minor
        [2, 3, 5, 8, 10, 14, 15, 17, 20, 22],
        [7, 19]
    ],
    [
        // Diminished Whole-Half
        [1, 3, 4, 7, 9, 10, 13, 15, 16, 19, 21, 22],
        [6, 18]
    ],
    [   
        // Diminished Half-Whole
        [2, 3, 5, 8, 9, 11, 14, 15, 17, 20, 21, 23],
        [6, 18]
    ],
];

/*
 * Plays audio from a source of midiBoxes using Tone.js... This is my weird way out and my version of
 * a midi player for the time being. Maybe not the best thing, but it does work.
 */
AUDIO_PLAYING = false;
playMidi = async function(notes, BPM = 120) {
    if(!AUDIO_PLAYING) {
        AUDIO_PLAYING = true;
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
    await sleep(500);
    AUDIO_PLAYING = false;
}