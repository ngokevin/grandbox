function rect(e) {
    p = getCoords(e);
    createRectangle(e.data.world, p.x, p.y, 2, 2);
}

function circle(e) {
    p = getCoords(e);
    createCircle(e.data.world, p.x, p.y, 1);
}
