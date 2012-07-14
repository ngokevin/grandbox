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
    world = createWorld();
    createGround(world, width / 2, height, width, 10);

    // Tools and tools selectors.
    var tool = rect;
    var tools = {
        'rect': rect,
        'circle': circle,
    }
    $('.tool-select').click(function() {
        $canvas.unbind('click');
        $canvas.click({'world': world}, tools[this.id]);
    });
    $canvas.click({'world': world}, tool);

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

    // Expose global stuff.
    caniverse = {
        'world': world,
    }
});
