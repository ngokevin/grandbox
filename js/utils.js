// Better than setTimeout or setInterval for animations.
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function(/* function */ callback, /* DOMElement */ element){
             window.setTimeout(callback, 1000 / 60);
           };
})();


function createWorld() {
    return new b2World (
        new b2Vec2(0, 10), // gravity
        true // allow sleep
    );
}


function createGround(world, x, y, w, h) {
    // The ground.
    // Fixture definition: attributions of the object.
    var fixDef = new b2FixtureDef;
    fixDef.density = 5.5;
    fixDef.friction = 0.5;
    fixDef.restitution = .001; // bounciness
    // Body definition: where in the world the object is.
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    // Position center of object, not upper left.
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    // Shape: the actual 2D geometrical object.
    fixDef.shape = new b2PolygonShape;
    // half height, half width parameters
    fixDef.shape.SetAsBox(w / SCALE / 2, h / SCALE /  2);
    // Add to world.
    world.CreateBody(bodyDef).CreateFixture(fixDef);
}


function createRectangle(world, x, y, w, h) {
    var halfWidth = w / 2;
    var halfHeight = h / 2;

    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(
        halfWidth, halfHeight
    );

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    world.CreateBody(bodyDef).CreateFixture(fixDef);
}


function createCircle(world, x, y, r) {
    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2CircleShape(r);

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    world.CreateBody(bodyDef).CreateFixture(fixDef);
}


function setupDebugDraw(world, canvas) {
    // Setup debug draw.
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(canvas.getContext('2d'));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
}


function getCoords(e) {
    p = {}
    if (e.offsetX) {
        p = { x: e.offsetX, y: e.offsetY };
    } else if (e.layerX) {
        p = { x: e.layerX, y: e.layerY };
    } else {
        p = { x: e.pageX, y: e.pageY };
    }
    p.x -= parseInt($('#canvas-wrap').css('marginLeft'));
    p.y -= parseInt($('#canvas-wrap').css('marginTop'));
    return p;
}
