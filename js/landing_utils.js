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


function createGround(world, x, y, w, h, id) {
    if (!id) { id = 'ground'; }

    // Fixture definition: attributions of the object.
    var fixDef = new b2FixtureDef;
    // Shape: the actual 2D geometrical object.
    // half height, half width parameters
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(3 * w / SCALE / 2, h / SCALE /  2);
    fixDef.density = 5.5;
    fixDef.friction = 0.5;
    fixDef.restitution = .001; // bounciness

    // Body definition: where in the world the object is.
    var bodyDef = new b2BodyDef;
    bodyDef.userData = id;
    bodyDef.type = b2Body.b2_staticBody;
    // Position center of object, not upper left.
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;

    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}


function createRectangle(world, x, y, w, h, id) {
    if (!id) { id = 'rect'; }

    var halfWidth = w / 2;
    var halfHeight = h / 2;

    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(
        halfWidth, halfHeight
    );

    var bodyDef = new b2BodyDef;
    bodyDef.userData = id;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}


function createPlayerBall(world) {
    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2CircleShape(20 / SCALE);
    fixDef.density = 0.1;
    fixDef.restitution = 0.5;
    fixDef.friction = 1;

    var bodyDef = new b2BodyDef;
    bodyDef.userData = 'player';
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = $('#canvas').width() / 2 / SCALE;
    bodyDef.position.y = 0 / SCALE;
    bodyDef.linearDamping = .03;
    bodyDef.allowSleep = false;
    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}


// Too lazy to scope correctly.
var steps = 0; // since last keypress.
function handleInteractions(player, keys, canvas) {
    steps += .001; // don't want var to get too large.

	// Left/right arrows.
	var vel = player.object.GetBody().GetLinearVelocity();
	if (keys[37]){
		vel.x = -60 / SCALE;
        steps = 0;
	}
	else if (keys[39]){
		vel.x = 60 / SCALE;
        steps = 0;
	}
	// Up arrow.
	if (keys[38] && player.canJump){
		vel.y = -180 / SCALE;
	}

    // Add in pseudo-friction.
    if (steps > 0 && vel.x != 0) {
        var before = vel.x;
        if (vel.x > 0) {
            var after_friction = (60 - steps * 1200) / SCALE;
        }
        else {
            var after_friction = (-60 + steps * 1200) / SCALE;
        }
        // Don't reverse direction.
        if (vel.x >= 0 && after_friction <= 0 ||
            vel.x <= 0 && after_friction >= 0) {
            vel.x = 0;
        } else {
            vel.x = after_friction;
        }
    }
	var vel = player.object.GetBody().SetLinearVelocity(vel);
}


function setupDebugDraw(world, canvas) {
    // Setup debug draw.
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(canvas.getContext('2d'));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(1.0);
    debugDraw.SetLineThickness(2.0);
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
        p.x -= parseInt($('#canvas-wrap').css('marginLeft'));
        p.y -= parseInt($('#canvas-wrap').css('marginTop'));
    }
    return p;
}
