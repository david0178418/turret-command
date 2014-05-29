define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser'),
		Beam = require('entities/beam'),
		damageComponent = require('components/damage'),
		Beam = require('entities/beam'),
		instanceManager = require('instance-manager');
	
	function Turret(props) {
		var game = instanceManager.get('game');
		Phaser.Sprite.call(this, game, props.x, props.y, 'turret');
		
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 24;
		this.height = 64;
		// END
		
		this.revive(Turret.HEALTH);
		this.anchor.setTo(0.5, 1);
		this.inputEnabled = true;
		this.coolDown = 800;
		this.ready = false;
		this.lastFire = 0;
		this.range = Turret.RANGE;
		this.rangeOutline = game.add.graphics(props.x, props.y);
		//this.rangeOutline.visible = false;
		this.rangeOutline.lineStyle(1, 0xff0000, 0.5);
		this.rangeOutline.drawCircle(0, 0, this.range);
		this.rangeOutline.visible = false;
		
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.immovable = true;
		this.events.onKilled.add(function() {
			this.rangeOutline.visible = false;
		}, this);
		this.events.onRevived.add(function() {
			this.rangeOutline.visible = true;
		}, this);
		this.events.onInputOver.add(this.highlight, this);
		this.events.onInputOut.add(this.unhighlight, this);
	}
	
	Turret.HEALTH = 2;
	Turret.COST = 150;
	Turret.RANGE = 700;
	
	Turret.preload = function(game) {
		game.load.image('turret', '');
	};
	
	Turret.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Turret.prototype, damageComponent, {
		constructor: Turret,
		update: function() {
			this.ready = this.game.time.now - this.lastFire > this.coolDown;
		},
		affect: function(meteors) {
			var lowestMeteor,
				lowestAltitude,
				game = this.game,
				arcade = game.physics.arcade;
			
			if(!this.ready) {
				return;
			}
			
			meteors.forEachAlive(function(meteor) {
				var altitude,
					distance = arcade.distanceBetween(this, meteor);
				
				if(distance >= this.range) {
					return;
				}
				
				altitude = this.game.world.height - meteor.y;
				
				if(!lowestMeteor || altitude < lowestAltitude) {
					lowestMeteor = meteor;
					lowestAltitude = altitude;
				}
			}, this);
			
			if(lowestMeteor) {
				this.fireAt(lowestMeteor);
				
				if(lowestMeteor.isDead()) {
					
				}
			}
		},
		fireAt: function(meteor) {
			var beam = Beam.create();
			
			beam.fire(this.x, this.y - this.height, meteor.x, meteor.y);
			meteor.damage(1);
			this.lastFire = this.game.time.now;
		},
		
		highlight: function() {
			this.rangeOutline.visible = true;
		},
		unhighlight: function() {
			this.rangeOutline.visible = false;
		}
	});
	
	//Unify this with all the others that use "create"
	Turret.create = function(x, y) {
		var turret,
			turrets = instanceManager.get('turrets');
		
		turret = turrets.getFirstDead();
		
		if(!turret) {
			turret = new Turret({x: x, y:y});
			turrets.add(turret);
		} else {
			turret.reset(x, y);
			turret.revive();
		}
	};

	return Turret;
});