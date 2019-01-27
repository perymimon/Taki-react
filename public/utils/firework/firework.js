import {FireworkExplosions} from './FireworkExplosions';
import {Particle} from './particle';
import {Library} from './library';


export function Fireworks() {

    // declare the variables we need
    var particles = [],
        mainCanvas = null,
        mainContext = null,
        fireworkCanvas = null,
        fireworkContext = null,
        viewportWidth = 0,
        viewportHeight = 0,
        fireworkExplosions = FireworkExplosions(createParticle);

    /**
     * Create DOM elements and get your game on
     */
    function initialize(canvasId) {
        return new Promise(function (resolve) {


            // start by measuring the viewport
            onWindowResize();

            // create a canvas for the fireworks
            mainCanvas = document.getElementById(canvasId);
            mainContext = mainCanvas.getContext('2d');

            // and another one for, like,ז
            // because that's rad n all
            fireworkCanvas = document.createElement('canvas');
            fireworkContext = fireworkCanvas.getContext('2d');

            // set up the colours for the fireworks
            createFireworkPalette(11);

            // set the dimensions on the canvas
            setMainCanvasDimensions();

            // add the canvas in
            // document.body.appendChild(mainCanvas);
            document.addEventListener('mouseup', createFirework, true);
            document.addEventListener('touchend', createFirework, true);

            // and now we set off
            update();
            resolve();
        })
    }

    /**
     * Pass through function to create a
     * new firework on touch / click
     */
    function createFirework() {
        createParticle();
    }

    /**
     * Creates a block of colours for the
     * fireworks to use as their colouring
     */
    function createFireworkPalette(gridSize) {

        var size = gridSize * 10;
        fireworkCanvas.width = size;
        fireworkCanvas.height = size;
        fireworkContext.globalCompositeOperation = 'source-over';

        // create 100 blocks which cycle through
        // the rainbow... HSL is teh r0xx0rz
        for (var c = 0; c < 100; c++) {

            var marker = (c * gridSize);
            var gridX = marker % size;
            var gridY = Math.floor(marker / size) * gridSize;

            fireworkContext.fillStyle = "hsl(" + Math.round(c * 3.6) + ",100%,60%)";
            fireworkContext.fillRect(gridX, gridY, gridSize, gridSize);
            fireworkContext.drawImage(
                Library.bigGlow,
                gridX,
                gridY);
        }
    }

    /**
     * Update the canvas based on the
     * detected viewport size
     */
    function setMainCanvasDimensions() {
        mainCanvas.width = viewportWidth;
        mainCanvas.height = viewportHeight;
    }

    /**
     * The main loop where everything happens
     */
    function update() {
        clearContext();
        requestAnimationFrame(update);
        drawFireworks();
    }

    /**
     * Clears out the canvas with semi transparent
     * black. The bonus of this is the trails effect we get
     */
    function clearContext() {
        mainContext.fillStyle = "rgba(0,0,0,0.2)";
        mainContext.fillRect(0, 0, viewportWidth, viewportHeight);
    }

    /**
     * Passes over all particles particles
     * and draws them
     */
    function drawFireworks() {
        var a = particles.length;

        while (a--) {
            var firework = particles[a];

            // if the update comes back as true
            // then our firework should explode
            if (firework.update()) {

                // kill off the firework, replace it
                // with the particles for the exploded version
                particles.splice(a, 1);

                // if the firework isn't using physics
                // then we know we can safely(!) explode it... yeah.
                if (!firework.usePhysics) {

                    if (Math.random() < 0.8) {
                        fireworkExplosions.star(firework);
                    } else {
                        fireworkExplosions.circle(firework);
                    }
                }
            }

            // pass the canvas context and the firework
            // colours to the
            firework.render(mainContext, fireworkCanvas);
        }
    }

    /**
     * Creates a new particle / firework
     */
    function createParticle(pos, target, vel, color, usePhysics) {

        pos = pos || {};
        target = target || {};
        vel = vel || {};

        const particle = new Particle(
            // position
            {
                x: pos.x || viewportWidth * 0.5,
                y: pos.y || viewportHeight + 10,
            },

            // target
            {
                y: target.y || 150 + Math.random() * 100,
            },

            // velocity
            {
                x: vel.x || Math.random() * 3 - 1.5,
                y: vel.y || 0,
            },

            color || Math.floor(Math.random() * 100) * 11,

            usePhysics);

        particles.push(particle);
    }

    /**
     * Callback for window resizing -
     * sets the viewport dimensions
     */
    function onWindowResize() {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
    }

    // declare an API
    return {
        initialize: initialize,
        createParticle: createParticle,
    };

};
