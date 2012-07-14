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
    // The ground.
    // Fixture definition: attributions of the object.
    var fixDef = new b2FixtureDef;
    fixDef.density = 5.5;
    fixDef.friction = 0.5;
    fixDef.restitution = .001; // bounciness
    // Body definition: where in the world the object is.
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.userData = id;
    // Position center of object, not upper left.
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    // Shape: the actual 2D geometrical object.
    fixDef.shape = new b2PolygonShape;
    // half height, half width parameters
    fixDef.shape.SetAsBox(w / SCALE / 2, h / SCALE /  2);
    // Add to world.
    return world.CreateBody(bodyDef).CreateFixture(fixDef);
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
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}


function createCircle(world, x, y, r) {
    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2CircleShape(r);

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
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
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = 500 / SCALE;
    bodyDef.position.y = 300 / SCALE;
    bodyDef.linearDamping = .03;
    bodyDef.allowSleep = false;
    bodyDef.userData = 'player';
    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}


function handleInteractions(world, player, keys) {
	// Up arrow.
	var collision = world.m_contactList;
	player.canJump = false;
	if (collision != null){
        a = collision.m_fixtureA.m_body;
        b = collision.m_fixtureB.m_body;

		if (a.GetUserData() == 'player'||
        b.GetUserData() == 'player') {
            var playerObj = (a.GetUserData() == 'player' ?
                             a.GetPosition() :
                             b.GetPosition());
            var groundObj = (a.GetUserData() == 'player' ?
                             b.GetPosition() :
                             a.GetPosition());
            if (playerObj.y < groundObj.y){
                player.canJump = true;
            }
		}
	}

	var vel = player.object.m_body.m_linearVelocity;
	if (keys[38] && player.canJump){
		vel.y = -150 / SCALE;
	}

	// Left/right arrows.
	if (keys[37]){
		vel.x = -60 / SCALE;
	}
	else if (keys[39]){
		vel.x = 60 / SCALE;
	}
	player.object.m_body.m_linearVelocity = vel;
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


function addToHistory(objName, objData, icon) {
    item = $('<li>').append($('<p>').html(objName)).addClass('historyItem');
    $('#history').prepend(item);
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
