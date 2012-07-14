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
    $canvasWrap = $('#canvas-wrap');
    var ctx = $canvas.get(0).getContext('2d');
    $canvas.addClass('fade-in')
    $('#panel').addClass('slide-in');

    logo = new Image();
    logo.src = 'http://i.imgur.com/3e5dA.png'

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
    var currentTool = 'tool-rect';
    var tools = {
        'tool-rect': { tool: rect, opts: $('.opt-width, .opt-height') },
        'tool-platform': { tool: platform, opts: $('.opt-width, .opt-height') },
        'tool-circle': { tool: circle, opts: $('.opt-radius') },
        'tool-springboard': { tool: springboard, opts: $('.opt-width, .opt-bounciness') },
        'tool-landmine': { tool: landmine, opts: $('.opt-blast') },
    }
    $('.tool-select').click(function() {
        $('.tool-select').removeClass('selected');
        $(this).addClass('selected');
        $canvas.unbind('click');
        $('.opt-select').hide(200, 'linear');
        tools[this.id].opts.show(300, 'linear');
        $canvas.click({'world': world, 'opts': opts}, tools[this.id].tool);
        currentTool = this.id;
    });
    var tool = rect;
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
    initSlider($('#val-blast'), $('#opt-blast'), 'blast');

    // Collision listener.
    var listener = new Box2D.Dynamics.b2ContactListener;
    listener.BeginContact = function(contact) {
        var a = contact.GetFixtureA().GetBody();
        var b = contact.GetFixtureB().GetBody();

        // Player against other surfaces.
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

        // Uh oh, land mine.
        if (a.GetUserData() == 'landmine' || b.GetUserData() == 'landmine') {
            var landmineObj = a.GetUserData() == 'landmineObj' ? a : b;
            var otherObj = landmineObj == a.GetPosition() ? b : a;
            if (otherObj.GetPosition().y > landmineObj.GetPosition().y){
                landmineObj.ApplyImpulse(
                    new b2Vec2(Math.cos(45 * (Math.PI / 180)) * 5,
                               Math.sin(45 * (Math.PI / 180)) * 5),
                    landmineObj.GetWorldCenter()
                );
                world.DestroyBody(landmineObj);
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

    var mouseX, mouseY;
    $(document).mousemove(function(e){
        mouseX = e.pageX, mouseY = e.pageY;
    });

    // Setup debug draw.
    setupDebugDraw(world, canvas);

    function step() {
        world.Step(
            1 / 40, // frame-rate
            10,  // velocity iterations
            10  // position iterations
        );
        handleInteractions(player, keys, canvas);

        ctx.clearRect(-1 * width, 0, 4 * width, height);
        world.DrawDebugData();
        world.ClearForces();

        // If mouse in canvas, draw preview.
        var marginLeft = parseInt($canvasWrap.css('marginLeft'));
        var marginTop = parseInt($canvasWrap.css('marginTop'));
        if (mouseX > marginLeft &&
            mouseX < marginLeft + width &&
            mouseY > marginTop  &&
            mouseY < marginTop + height) {
            switch(currentTool) {
                case 'tool-rect': case 'tool-platform': case 'tool-springboard':
                    ctx.strokeRect(mouseX - marginLeft - opts.width * SCALE / 2 - 8,
                                   mouseY - marginTop - opts.height * SCALE / 2,
                                   opts.width * SCALE, opts.height * SCALE);
                    break;
                case 'tool-circle':
                    ctx.beginPath();
                    ctx.arc(mouseX - marginLeft - 8,
                            mouseY - marginTop,
                            opts.radius * SCALE, 0, 2 * Math.PI);
                    ctx.stroke();
                    break;
                case 'tool-landmine':
                    ctx.strokeRect(mouseX - marginLeft - .5 * SCALE / 2 - 8,
                                   mouseY - marginTop - SCALE / 2 + 15,
                                   .5 * SCALE, 1);
                    break;
            }
        }


        ctx.drawImage(logo, width / 2 / SCALE, 10);
        requestAnimFrame(step);
    }
    requestAnimFrame(step);

    // Expose global stuff.
    caniverse = {
    }
});
