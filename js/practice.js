$(document).ready(function() {

    function dbg(str) { console.log(str); }

    var SCALE = 30;
    var width = $(window).width() * .8;
    var height = $(window).height() * .8;




    // Set up canvas.
    var canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;


    // The world.
    var world = new b2World(
        new b2Vec2(0, 10), // gravity
        true // allow sleep
    );


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
    bodyDef.position.x = width / 2 / SCALE;
    bodyDef.position.y = height / SCALE;

    // Shape: the actual 2D geometrical object.
    fixDef.shape = new b2PolygonShape;
    // half height, half width parameters
    fixDef.shape.SetAsBox((600 / SCALE) / 2, (10 / SCALE) / 2);

    // Add to world.
    world.CreateBody(bodyDef).CreateFixture(fixDef);


    // Falling objects.
    // b2_dynamicBody bodyDef allows movement as opposed to static ground.
    bodyDef.type = b2Body.b2_dynamicBody;
    for(var i = 0; i < 10; ++i) {
        if(Math.random() > 0.5) {
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(
                  Math.random() //half width
               ,  Math.random() //half height
            );
        } else {
            fixDef.shape = new b2CircleShape(
                Math.random() // radius
            );
        }
        bodyDef.position.x = Math.random() * 25;
        bodyDef.position.y = Math.random() * 10;
        // world.CreateBody(bodyDef).CreateFixture(fixDef);
    }
    canvas.onclick = function(e) {
        p = getCoords(e);
        fixDef.shape = new b2PolygonShape;
        var halfWidth = 1;
        var halfHeight = 1;
        fixDef.shape.SetAsBox(
            halfWidth, halfHeight
        );
        bodyDef.position.x = p.x / SCALE;
        bodyDef.position.y = p.y / SCALE;
        world.CreateBody(bodyDef).CreateFixture(fixDef);
    };


    // Setup debug draw.
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(canvas.getContext("2d"));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);


    function update() {
        world.Step(
            1 / 60, // frame-rate
            10,  // velocity iterations
            10  // position iterations
        );
        world.DrawDebugData();
        world.ClearForces();

        requestAnimFrame(update);
    };
    requestAnimFrame(update);


    function getCoords(e) {
        if (e.offsetX) {
            return { x: e.offsetX, y: e.offsetY };
        }
        else if (e.layerX) {
            return { x: e.layerX, y: e.layerY };
            }
        else {
            return { x: e.pageX, y: e.pageY };
        }
    }
}
