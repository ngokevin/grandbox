var history = []; // Yeah, it's global. So what?

function rect(e) {
    p = getCoords(e);
    w = e.data.opts['width']
    h = e.data.opts['height']
    history.push(createRectangle(e.data.world, p.x, p.y, w, h));

    addToHistory('Rectangle', {'id': history.length - 1, 'w': w, 'h': h}, 'rect-icon');
}

function circle(e) {
    p = getCoords(e);
    r = e.data.opts['radius'];
    history.push(createCircle(e.data.world, p.x, p.y, r));

    addToHistory('Circle', {'id': history.length - 1, 'r': r}, 'circle-icon');
}
