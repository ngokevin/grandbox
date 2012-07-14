var history = []; // Yeah, it's global. So what?


function rect(e) {
    var p = getCoords(e);
    var w = e.data.opts.width;
    var h = e.data.opts.height;
    history.push(createRectangle(e.data.world, p.x, p.y, w, h));

    addToHistory('Box', {'id': history.length - 1, 'w': w, 'h': h}, 'rect-icon',
                 e.data.world, history);
}


function circle(e) {
    var p = getCoords(e);
    var r = e.data.opts.radius;
    history.push(createCircle(e.data.world, p.x, p.y, r));

    addToHistory('Ball', {'id': history.length - 1, 'r': r}, 'circle-icon',
                 e.data.world, history);
}


function springboard(e) {
    var p = getCoords(e);
    var w = e.data.opts.width;
    var bounce = e.data.opts.bounciness;
    var h = 5 / SCALE;
    history.push(createSpringboard(e.data.world, p.x, p.y, w, h, bounce));

    addToHistory('Springboard', {'id': history.length - 1, 'w': w}, 'springboard-icon',
                 e.data.world, history);
}
