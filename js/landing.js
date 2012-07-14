$(document).ready(function() {

    var keys = [];
    $(document).keyup(function(e) { keys[e.keyCode] = false; });
    $(document).keydown(function(e) { keys[e.keyCode] = true; });
    $('.left-btn').mouseup(function(e) { keys[37] = false ; });
    $('.left-btn').mousedown(function(e) { keys[37] = true; });
    $('.right-btn').mouseup(function(e) { keys[39] = false ; });
    $('.right-btn').mousedown(function(e) { keys[39] = true; });

    var canvas = document.getElementById('canvas');
    var $canvas = $(canvas);
    var ctx = $canvas.get(0).getContext('2d');

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    canvas.width = $(document.body).width();
    var width = $canvas.width();
    var height = $canvas.height();

    // The world.
    var world = createWorld();
    createGround(world, width / 2, height + .9, width, 1);

    // The player.
    var player = { object: createPlayerBall(world), canJump: false };

    // Setup debug draw.
    setupDebugDraw(world, canvas);

    createRectangle(world, width - 10, height, .2, .2, 'editor');
    createRectangle(world, 10, height, .2, .2, 'play');

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

        // window.location.href = HOSTNAME + 'editor.html';
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

    function step() {
        world.Step(
            1 / 45, // frame-rate
            10,  // velocity iterations
            10  // position iterations
        );
        handleInteractions(player, keys, canvas);
        world.DrawDebugData();
        world.ClearForces();
        requestAnimFrame(step);
    }
    requestAnimFrame(step);

});
