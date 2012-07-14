function rect(e) {
    p = getCoords(e);
    w = e.data.opts['width']
    h = e.data.opts['height']
    createRectangle(e.data.world, p.x, p.y, w, h);
}

function circle(e) {
    p = getCoords(e);
    r = e.data.opts['radius'];
    createCircle(e.data.world, p.x, p.y, r);
}
