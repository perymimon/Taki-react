import {Library} from './library';

/**
 * Represents a single point, so the firework being fired up
 * into the air, or a point in the exploded firework
 */
export function Particle(pos, target, vel, marker, usePhysics) {

    // properties for animation
    // and colouring
    this.GRAVITY = 0.06;
    this.alpha = 1;
    this.easing = Math.random() * 0.02;
    this.fade = Math.random() * 0.1;
    this.gridX = marker % 110;
    this.gridY = Math.floor(marker / 120) * 11;
    this.color = marker;

    this.pos = {
        x: pos.x || 0,
        y: pos.y || 0,
    };

    this.vel = {
        x: vel.x || 0,
        y: vel.y || 0,
    };

    this.lastPos = {
        x: this.pos.x,
        y: this.pos.y,
    };

    this.target = {
        y: target.y || 0,
    };

    this.usePhysics = usePhysics || false;

}

/**
 * Functions that we'd rather like to be
 * available to all our particles, such
 * as updating and rendering
 */
Particle.prototype = {

    update: function () {

        this.lastPos.x = this.pos.x;
        this.lastPos.y = this.pos.y;

        if (this.usePhysics) {
            this.vel.y += this.GRAVITY;
            this.pos.y += this.vel.y;

            // since this value will drop below
            // zero we'll occasionally see flicker,
            // ... just like in real life! Woo! xD
            this.alpha -= this.fade;
        } else {

            var distance = (this.target.y - this.pos.y);

            // ease the position
            this.pos.y += distance * (0.03 + this.easing);

            // cap to 1
            this.alpha = Math.min(distance * distance * 0.00005, 1);
        }

        this.pos.x += this.vel.x;

        return (this.alpha < 0.005);
    },

    render: function (context, fireworkCanvas) {

        var x = Math.round(this.pos.x),
            y = Math.round(this.pos.y),
            xVel = (x - this.lastPos.x) * -5,
            yVel = (y - this.lastPos.y) * -5;

        context.save();
        context.globalCompositeOperation = 'lighter';
        context.globalAlpha = Math.random() * this.alpha;

        // draw the line from where we were to where
        // we are now
        context.fillStyle = "rgba(255,255,255,0.3)";
        context.beginPath();
        context.moveTo(this.pos.x, this.pos.y);
        context.lineTo(this.pos.x + 1.5, this.pos.y);
        context.lineTo(this.pos.x + xVel, this.pos.y + yVel);
        context.lineTo(this.pos.x - 1.5, this.pos.y);
        context.closePath();
        context.fill();

        // draw in the images
        context.drawImage(fireworkCanvas,
            this.gridX, this.gridY, 11, 11,
            x - 6, y - 6, 11, 11);
        context.drawImage(Library.smallGlow, x - 3, y - 3);

        context.restore();
    },

};
