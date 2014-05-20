define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		Turret = require('entities/turret'),
		damageComponent = require('components/damage');
	
	function Hero(props,game) {
		Phaser.Sprite.call(this, game, props.x, props.y, 'hero-ground');
		
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 16;
		this.height = 16;
		// END
		
		this.revive(Hero.HIT_POINTS);
		
		this.controls = {
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
			action: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		};
		
		this.anchor.setTo(0.5, 1);
		this.poweredUp = false;
		this.stunned = false;
		this.readySpawn = false;
		this.power = Hero.STARTING_POWER;
		this.powerCapacity = Hero.STARTING_POWER;
		this.powerRegenRate = Hero.STARTING_POWER_REGEN_RATE;
		this.powerDrainRate = Hero.STARTING_POWER_DRAIN_RATE;
		
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.allowRotation = false;
		this.body.collideWorldBounds = true;
		this.body.allowGravity = false;
		this.body.drag = new Phaser.Point(Hero.DRAG, Hero.DRAG);
		
		//easy accessors
		this.drag = this.body.drag;
		this.velocity = this.body.velocity;
		this.acceleration = this.body.acceleration;
		
		game.add.existing(this);
		
		this.turrets = game.add.group();
		window.hero = this;	//debug
	}
	
	Hero.HIT_POINTS = 10;
	Hero.MAX_VELOCITY = 200;
	Hero.MAX_DASH_VELOCITY = 300;
	Hero.DRAG = 1000;
	Hero.THRUST = 3000;
	Hero.MOVE_VELOCITY = 300;
	Hero.STUN_TIME = 700;
	Hero.STARTING_POWER = 1000;
	Hero.STARTING_POWER_REGEN_RATE = 0;
	Hero.STARTING_POWER_DRAIN_RATE = 400;

	Hero.preload = function(game) {
		Turret.preload(game);
	};
	
	Hero.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Hero.prototype, damageComponent, {
		constructor: Hero,
		update: function() {
			var turret;
			
			if(this.stunned) {
				this.stunned = this.game.time.now < this.stunnedTime + Hero.STUN_TIME;
				return;
			}
			this.move();
			
			if(this.controls.action.isDown) {
				this.readySpawn = true;
			} else if(this.readySpawn) {
				this.readySpawn = false;
				this.spawnTurret();
			}
		},
		move: function() {
			var velocity = this.velocity,
				controls = this.controls,
				moveVelocity = Hero.MOVE_VELOCITY,
				maxVelocity =  this.poweredUp ? Hero.MAX_DASH_VELOCITY : Hero.MAX_VELOCITY,
				vx = 0,
				vy = 0;
			
			if (controls.left.isDown) {
				vx = -moveVelocity;
			} else if (controls.right.isDown) {
				vx = moveVelocity;
			}
			
			if(vx || vy) {
				velocity.x = vx;
				velocity.y = vy;
			}
		},
		spawnTurret: function() {
			if(this.power <= Turret.COST) {
				return;
			}
			
			this.power -= Turret.COST;
			
			var turret = this.turrets.getFirstDead();
			
			if(!turret) {
				turret = new Turret({x: this.x, y:this.y}, this.game);
				this.turrets.add(turret);
			} else {
				turret.reset(this.x, this.y);
				turret.revive();
			}
		},
		stun: function() {
			this.stunned = true;
			this.stunnedTime = this.game.time.now;
			this.stop();
		},
		stop: function() {
			this.acceleration.x = this.acceleration.y = 0;
			this.velocity.x = this.velocity.y = 0;
		}
	});
	
	return Hero;
});