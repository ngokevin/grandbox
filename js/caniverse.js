$(document).ready(function() {
    var world;
    var width, height, windowWidth, windowHeight, PANEL = 280;
    var canvas = document.getElementById('canvas');
    var $canvas = $(canvas);
    var ctx = $canvas.get(0).getContext('2d');

    $canvas.on('touchmove', false);
    $canvas.on('touchstart', false);

    var marginLeft, marginTop;
    function adjustWindow() {
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        $canvas.attr('width', (windowWidth - PANEL) * .8);
        $canvas.attr('height', windowHeight * .8);
        width = $canvas.width();
        height = $canvas.height();

        marginLeft = (windowWidth - PANEL - width) / 2;
        marginTop =  (windowHeight - height) / 2;
        $('#canvas-wrap').css('marginLeft', marginLeft).css('marginTop', marginTop);
    }
    adjustWindow();
    window.onresize = adjustWindow;

    // The world.
    world = new b2World(
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
    fixDef.shape.SetAsBox((windowWidth / SCALE) / 2, (10 / SCALE) / 2);
    // Add to world.
    world.CreateBody(bodyDef).CreateFixture(fixDef);

    canvas.onclick = function(e) {
        p = getCoords(e);
        createRectangle(world, 2, 2, p.x, p.y);
    };

    // Setup debug draw.
    setupDebugDraw(world, canvas);

    function step() {
        world.Step(
            1 / 60, // frame-rate
            10,  // velocity iterations
            10  // position iterations
        );
        world.DrawDebugData();
        world.ClearForces();
        requestAnimFrame(step);
    }
    requestAnimFrame(step);

    return  {
    };
});
