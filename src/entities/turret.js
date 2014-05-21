define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser'),
		damageComponent = require('components/damage');
	
	function Turret(props, game) {
		Phaser.Sprite.call(this, game, props.x, props.y, 'turret');
		
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 24;
		this.height = 64;
		// END
		
		this.revive(Turret.HEALTH);
		this.anchor.setTo(0.5, 1);
		this.coolDown = 800;
		this.ready = false;
		this.lastFire = 0;
		this.range = Turret.RANGE;
		this.rangeOutline = game.add.graphics(props.x, props.y);
		//this.rangeOutline.visible = false;
		this.rangeOutline.lineStyle(1, 0xff0000, .5);
		this.rangeOutline.drawCircle(0, 0, this.range);
		
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.immovable = true;
		this.events.onKilled.add(function() {
			this.rangeOutline.visible = false;
		}, this);
		this.events.onRevived.add(function() {
			this.rangeOutline.visible = true;
		}, this);
		window.turret = this;
	}
	
	Turret.HEALTH = 2;
	Turret.COST = 150;
	Turret.RANGE = 350;
	
	Turret.preload = function(game) {
		game.load.image('turret', 'assets/images/turret.png');
	};
	
	Turret.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Turret.prototype, damageComponent, {
		constructor: Turret,
		update: function() {
			this.ready = this.game.time.now - this.lastFire > this.coolDown;
		},
		affect: function(meteors) {
			var closestMeteor,
				closestDistance,
				game = this.game,
				arcade = game.physics.arcade;
			
			if(!this.ready) {
				return;
			}
			
			meteors.forEachAlive(function(meteor) {
				var distance = arcade.distanceBetween(this, meteor);
				if(distance >= this.range) {
					return;
				}
				
				if(!closestMeteor || distance < closestDistance) {
					closestMeteor = meteor;
					closestDistance = distance;
				}
			}, this);
			
			if(closestMeteor) {
				this.fireAt(closestMeteor);
			}
		},
		fireAt: function(meteor) {
			meteor.damage(1);
			this.lastFire = this.game.time.now;
		}
	});

	return Turret;
});