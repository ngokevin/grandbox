$(document).ready(function() {

    function dbg(str) { console.log(str); }

    var world, keys = [];
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
    createGround(world, width / 2, height, width, 10, 'ground');

    // The player.
    var player = {
        object: createPlayerBall(world),
        canJump: false,
    };

    // Tools and tools selectors.
    var tool = rect;
    var tools = {
        'tool-rect': rect,
        'tool-circle': circle,
    }
    $('.tool-select').click(function() {
        $('.tool-select').removeClass('selected');
        $(this).addClass('selected');
        $canvas.unbind('click');
        $canvas.click({'world': world}, tools[this.id]);
    });
    $('#tool-rect').addClass('selected');
    $canvas.click({'world': world}, tool);

    $(document).keyup(function(e) { keys[e.keyCode] = false; });
    $(document).keydown(function(e) { keys[e.keyCode] = true; });

    // Setup debug draw.
    setupDebugDraw(world, canvas);

    function step() {
        world.Step(
            1 / 60, // frame-rate
            10,  // velocity iterations
            10  // position iterations
        );
        handleInteractions(world, player, keys);
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
