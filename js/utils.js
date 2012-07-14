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


function createCircle(world, x, y, r, id) {
    if (!id) { id = 'circle'; }

    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2CircleShape(r);

    var bodyDef = new b2BodyDef;
    bodyDef.userData = id;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}


function createSpringboard(world, x, y, w, h, bounce, id) {
    if (!id) { id = 'springboard'; }

    var halfWidth = w / 2;
    var halfHeight = h / 2 / SCALE;

    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.restitution = bounce;
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


function createLandMine(world, x, y, w, h, blast, id) {
    if (!id) { id = 'landmine'; }

    var halfWidth = w / 2;
    var halfHeight = h / 2 / SCALE;

    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.restitution = 0;
    fixDef.shape.SetAsBox(
        halfWidth, halfHeight
    );
    fixDef.blast = blast;

    var bodyDef = new b2BodyDef;
    bodyDef.userData = id;
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
    bodyDef.userData = 'player';
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = $('#canvas').width() / 2 / SCALE;
    bodyDef.position.y = ($('#canvas').height() / 2) / SCALE;
    bodyDef.linearDamping = .03;
    bodyDef.allowSleep = false;
    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}


// Too lazy to scope correctly.
var offsetX = 0;
var lastX = null;
var steps = 0; // since last keypress.
function handleInteractions(player, keys, canvas) {
    steps += .001; // don't want var to get too large.

    if (lastX != null) {
        var x = player.object.GetBody().GetPosition().x;
        var translateX = (lastX - x) * SCALE;
        offsetX += translateX;
        canvas.getContext('2d').translate(translateX, 0);
        lastX = x;
    }

	// Left/right arrows.
	var vel = player.object.GetBody().GetLinearVelocity();
	if (keys[37]){
		vel.x = -60 / SCALE;
        steps = 0;
        lastX = player.object.GetBody().GetPosition().x;
	}
	else if (keys[39]){
		vel.x = 60 / SCALE;
        steps = 0;
        lastX = player.object.GetBody().GetPosition().x;
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
    debugDraw.SetFillAlpha(.75);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
}


function addToHistory(objName, objData, icon, world, history) {
    if (history.length == 1) {
        $('#no-items').toggle();
    }

    var item = $('<li>').addClass('history-item');
    item.append($('<p>').html(objData.id));
    item.append($('<p>').html(objName));
    item.append($('<div>').addClass(icon));

    var deleteButton = $('<i>').addClass('icon-trash icon-large delete');
    deleteButton.click(function(e) {
        e.preventDefault();
        world.DestroyBody(history[objData.id].GetBody());
        $(this).parent().remove();

        if (!$('.history-item').length) {
            $('#no-items').toggle();
        }
    });
    item.append(deleteButton);

    // Using the passed in object values, create a sublist.
    var sublist = $('<ul>').addClass('item-details');
    for (key in objData) {
        if (key == 'id') { continue; }
        var subitem = $('<li>').addClass('item-detail');
        subitem.append($('<p>').html(key).addClass('item-detail-key'));
        subitem.append($('<p>').html(objData[key]).addClass('item-detail-val'));
        sublist.append(subitem);
    }
    sublist.hide();
    item.append(sublist);

    // Expand on click, handle weird opacity stuff.
    item.click(function() {
        sublist.toggle(200, 'linear');
    });

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
    if (offsetX) {
        p.x -= offsetX;
    }
    return p;
}
