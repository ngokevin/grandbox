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
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-1000, -1000);
    worldAABB.maxVertex.Set(1000, 1000);
    var gravity = new b2Vec2(0, 300);
    var doSleep = true;
    var world = new b2World(worldAABB, gravity, doSleep);
    return world;
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


function createRectangle(world, w, h, x, y) {
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

