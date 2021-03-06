
function sketch_idnameofdiv(p) {
    class midiBoxInp extends midiBox {

        color = SKETCH.color(0, 0, 0, 0);
        show() {
            p.stroke(p.color('#222222'));
            p.fill(this.color);
            p.rect((this.time * LSIZE) + textOffset, (p.windowHeight * SIZEOFMIDIBOX) - (this.note * HSIZE) - HSIZE, LSIZE, HSIZE);
        }
        update(n) {
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
        mouseInside() {
            if (p.mouseX - textOffset > this.time * LSIZE && p.mouseX - textOffset < this.time * LSIZE + LSIZE)
                if (p.mouseY > (p.windowHeight * SIZEOFMIDIBOX) - (this.note * HSIZE) - HSIZE && p.mouseY < ((p.windowHeight * SIZEOFMIDIBOX) - (this.note * HSIZE)))
                    return true;
            return false;
        }
    }
    
    const SIZEOFMIDIBOX = 0.65;
    let amtx = 16;
    let amty = 25;
    let HSIZE = 0;
    let LSIZE = 0;
    let textOffset = 32;
    let notes = [];

    p.setup = function() {
        notes = [];

        amtx = parseInt(document.getElementById("note_length").value);

        p.createCanvas(document.getElementById('midiParam').clientWidth - 15, p.windowHeight * SIZEOFMIDIBOX);
        HSIZE = p.windowHeight * SIZEOFMIDIBOX / amty;
        LSIZE = (document.getElementById('midiParam').clientWidth - textOffset - 15) / amtx;

        for (var x = 0; x < amtx; x++)
            for (var y = 0; y < amty; y++)
                notes.push(new midiBoxInp(y, x));

        setMusicInfo();
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
            p.rect(0, (p.windowHeight * SIZEOFMIDIBOX) - (i * HSIZE) - HSIZE, document.getElementById('midiParam').clientWidth, HSIZE + 1);
        }

        // show text
        p.textSize(HSIZE - 5);
        p.fill(0);
        for (var i = 0; i <= amty; i++)
            p.text(noteText[i % noteText.length], 4, (amty * HSIZE) - (HSIZE * i) - 3);

        // show notes
        p.stroke(0.5);
        for (var i in notes)
            notes[i].show();

    }

    p.mousePressed = function() { for (var i in notes) notes[i].update(1); }

    p.mouseDragged = function() { for (var i in notes) notes[i].update(1); }

    p.mouseReleased = function() {
        for (var i in notes)
            notes[i].update(0);
        p.notes = notes;
    }

    p.windowResized = function() {
        p.resizeCanvas(document.getElementById('midiParam').clientWidth - 15, p.windowHeight * SIZEOFMIDIBOX);
        HSIZE = p.windowHeight * SIZEOFMIDIBOX / amty;
        LSIZE = (document.getElementById('midiParam').clientWidth - textOffset - 15) / amtx;
    }
}
let SKETCH = new p5(sketch_idnameofdiv, 'midiParam')