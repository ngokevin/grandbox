var _history = []; // Yeah, it's global. So what?


function ground(world, x, y, w, h) {
    _history.push(createGround(world, x, y, w, h, 'ground'));

    addToHistory('Ground', {'id': history.length - 1, 'w': w, 'h': h}, 'rect-icon',
                 world, history);
}


function rect(e) {
    var p = getCoords(e);
    var w = e.data.opts.width;
    var h = e.data.opts.height;
    var a = e.data.opts.angle;
    _history.push(createRectangle(e.data.world, p.x, p.y, w, h, a));

    addToHistory('Box', {'id': history.length - 1, 'w': w, 'h': h}, 'rect-icon',
                 e.data.world, history);
}


function platform(e) {
    var p = getCoords(e);
    var w = e.data.opts.width;
    var h = e.data.opts.height;
    var a = e.data.opts.angle;
    _history.push(createPlatform(e.data.world, p.x, p.y, w, h, a));

    addToHistory('Platform', {'id': history.length - 1, 'w': w, 'h': h}, 'platform-icon',
                 e.data.world, history);
}


function circle(e) {
    var p = getCoords(e);
    var r = e.data.opts.radius;
    _history.push(createCircle(e.data.world, p.x, p.y, r));

    addToHistory('Ball', {'id': history.length - 1, 'r': r}, 'circle-icon',
                 e.data.world, history);
}


function springboard(e) {
    var p = getCoords(e);
    var w = e.data.opts.width;
    var bounce = e.data.opts.bounciness;
    var a = e.data.opts.angle;
    _history.push(createSpringboard(e.data.world, p.x, p.y, w, 5, a, bounce));

    addToHistory('Sprngbrd', {'id': history.length - 1, 'w': w}, 'springboard-icon',
                 e.data.world, history);
}


function landmine(e) {
    var p = getCoords(e);
    var blast = e.data.opts.bounciness;
    _history.push(createLandMine(e.data.world, p.x, p.y, .5, 1, blast));

    addToHistory('Land Mine', {'id': history.length - 1, 'blast': blast}, 'landmine-icon',
                 e.data.world, history);
}
