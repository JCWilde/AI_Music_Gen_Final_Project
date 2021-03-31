
// this function just combines all of the on notes of both measures and pushes them together...
// This is what im going to use for shoving the melody and chord measures together.
combine_measures = function(m1, m2) {
    var res = new Measure();
    for(var t in m1.timeSlices)
        for(var n in m1.timeSlices[t].notes)
            res.timeSlices[t].notes[n].pressed = (m1.timeSlices[t].notes[n].pressed || m2.timeSlices[t].notes[n].pressed);
    return res;
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

get_slide_neighbor_melody = function(w, KEY) {
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
        change_by = [0,0,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,4,4,5,5,5,6,7,7,8];
        var nchange = choice(change_by) * (Math.random() <= .5?1:-1);
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

get_slide_neighbor_chords = function(w, KEY) {

    var n = new Measure();
    //n.timeSlices[0].notes[mainKey].pressed = true;
    for(var t = 0; t < w.timeSlices.length; t++) {
        // This entire loop should be dedicated to finding the chord progression this measure is using...
        
        var notes = [];
        for(var i in base_measure.timeSlices[t].notes)
            if(base_measure.timeSlices[t].notes[i].pressed)
                notes.push(base_measure.timeSlices[t].notes[i].note);
        var res = "";
        var rootDiff = notes[0];
        for(var i in notes) res += (notes[i] - rootDiff) + " ";

        


    }
    return n;
}

// This area above is reserved for the get_neighbor functions

// --------------------------------------------------------------------------------------------------------------------------------------------------

// This area is reserved for the higher level generation functions

createSection = function(amt, start_from, KEY, get_neighbor = get_slide_neighbor_melody) {
    var section = [start_from];
    for(var i = 0; i < amt - 1; i++) 
        section.push(get_neighbor(section[section.length - 1], KEY));
    return section;
}

notTooRandom = function() {
    var isChord = false;
    if(document.getElementById("isChord").checked) {
        for(var t in base_measure.timeSlices) {
            var notes = [];
            for(var i in base_measure.timeSlices[t].notes)
                if(base_measure.timeSlices[t].notes[i].pressed)
                    notes.push(base_measure.timeSlices[t].notes[i].note);
            var res = "";
            var rootDiff = notes[0];
            for(var i in notes) res += (notes[i] - rootDiff) + " ";
            if(!chords_check.includes(res.trim()))
                return "<span style='border: 1px solid #000; background-color: #fff; padding-left: 5px; padding-right: 5px; padding-top: 2px; padding-bottom: 2px; color: red;'>Not a valid set of chords</span>";
        }
        isChord = True;
    } else {
        for(var t in base_measure.timeSlices) {
            var notes = [];
            for(var i in base_measure.timeSlices[t].notes)
                if(base_measure.timeSlices[t].notes[i].pressed)
                    notes.push(base_measure.timeSlices[t].notes[i].note);
            if(notes.length > 1)
                return "<span style='border: 1px solid #000; background-color: #fff; padding-left: 5px; padding-right: 5px; padding-top: 2px; padding-bottom: 2px; color: red;'>Not a valid melody</span>";
        }
    }

    if(isChord) {

    }
    
    /*

    var MAIN_KEY = parseInt(document.getElementById('key').value);
    var intro = createSection(2, base_measure, MAIN_KEY);
    var chorus = createSection(4, intro[intro.length - 1], MAIN_KEY);
    var verse1 = createSection(6, chorus[chorus.length - 1], MAIN_KEY);
    var verse2 = createSection(6, chorus[chorus.length - 1], MAIN_KEY);
    var bridge = createSection(4, chorus[chorus.length - 1], MAIN_KEY);
    var outro = createSection(2, chorus[chorus.length - 1], MAIN_KEY);



    measures = intro.concat(chorus).concat(verse1).concat(chorus).concat(verse2).concat(chorus).concat(bridge).concat(chorus).concat(outro);
    */
    return "<span style='border: 1px solid #000; background-color: #fff; padding-left: 5px; padding-right: 5px; padding-top: 2px; padding-bottom: 2px; color: green;'>Finished</span>";
}