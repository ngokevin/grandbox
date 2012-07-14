$(document).ready(function() {

    function dbg(str) { console.log(str); }

    var keys = [];
    $(document).keyup(function(e) { keys[e.keyCode] = false; });
    $(document).keydown(function(e) { keys[e.keyCode] = true; });

    var opts = {
        'width': 2, 'height':2, 'radius': 2, 'bounciness': 2.2
    }
    var width, height, windowWidth, windowHeight;

    // The canvas.
    var canvas = document.getElementById('canvas');
    var $canvas = $(canvas);
    var ctx = $canvas.get(0).getContext('2d');
    $canvas.on('touchmove', false);
    $canvas.on('touchstart', false);
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
    var world = createWorld();
    ground(world, width / 2, height, width, 30);

    // The player.
    var player = { object: createPlayerBall(world), canJump: false };

    // Tools and tools selectors.
    var tool = rect;
    var tools = {
        'tool-rect': { tool: rect, opts: $('.opt-width, .opt-height') },
        'tool-circle': { tool: circle, opts: $('.opt-radius') },
        'tool-springboard': { tool: springboard, opts: $('.opt-width, .opt-bounciness') },
    }
    $('.tool-select').click(function() {
        $('.tool-select').removeClass('selected');
        $(this).addClass('selected');
        $canvas.unbind('click');
        $('.opt-select').hide(200, 'linear');
        tools[this.id].opts.show(300, 'linear');
        $canvas.click({'world': world, 'opts': opts}, tools[this.id].tool);
    });
    $('.opt-select').hide();
    $('.tool-rect').addClass('selected');
    tools['tool-rect'].opts.show();
    $canvas.click({'world': world, 'opts': opts}, tool);

    // Tool options and sliders.
    function initSlider($label, $slider, optName) {
        $label.html(opts[optName]);
        return $slider.slider({
            min: .1, max: 10, value: opts[optName], step: .1,
            slide: function(event, ui) { $label.html(ui.value); opts[optName] = ui.value; },
            change: function(event, ui) { $label.html(ui.value); opts[optName] = ui.value; },
        });
    }
    initSlider($('#val-width'), $('#opt-width'), 'width');
    initSlider($('#val-height'), $('#opt-height'), 'height');
    initSlider($('#val-radius'), $('#opt-radius'), 'radius');
    initSlider($('#val-bounciness'), $('#opt-bounciness'), 'bounciness');

    // Collision listener.
    var listener = new Box2D.Dynamics.b2ContactListener;
    listener.BeginContact = function(contact) {
        var a = contact.GetFixtureA().GetBody();
        var b = contact.GetFixtureB().GetBody();
        if (a.GetUserData() == 'player' || b.GetUserData() == 'player') {
            var playerObj = (a.GetUserData() == 'player' ?
                             a.GetPosition() :
                             b.GetPosition());
            var groundObj = (playerObj == a.GetPosition() ?
                             b.GetPosition() :
                             a.GetPosition());
            if (playerObj.y < groundObj.y){
                player.canJump = true;
            }
        }
    }
    listener.EndContact = function(contact) {
        var a = contact.GetFixtureA().GetBody();
        var b = contact.GetFixtureB().GetBody();
        if (a.GetUserData() == 'player' || b.GetUserData() == 'player') {
            var playerObj;
            if (a.GetUserData() == 'player') {
                playerObj = a;
            } else {
                playerObj = b;
            }
            if (!playerObj.GetFixtureList().length) {
                player.canJump = false;
            }
        }
    }
    world.SetContactListener(listener);

    // Setup debug draw.
    setupDebugDraw(world, canvas);

    function step() {
        world.Step(
            1 / 60, // frame-rate
            10,  // velocity iterations
            10  // position iterations
        );
        handleInteractions(player, keys, canvas);
        world.DrawDebugData();
        world.ClearForces();
        requestAnimFrame(step);
    }
    requestAnimFrame(step);

    // Expose global stuff.
    caniverse = {
    }
});
