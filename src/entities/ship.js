define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser'),
		Beam = require('entities/beam'),
		damageComponent = require('components/damage'),
		instanceManager = require('instance-manager');
	
	function Ship(props) {
		var game = instanceManager.get('game');
		Phaser.Sprite.call(this, game, props.x, props.y, 'ship');
		
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 100;
		this.height = 40;
		// END
		
		this.revive(Ship.HEALTH);
		this.anchor.setTo(1, 0.5);
		this.coolDown = 1200;
		this.ready = false;
		this.lastFire = 0;
		this.range = Ship.RANGE;
		this.flightPath = game.add.tween(this);
		this.flightPath.to({
			x: props.direction === Ship.DIRECTIONS.WEST ? props.x - 3000: props.x +3000
		}, 10000);
		this.flightPath.start();
		this.playerTargets = instanceManager.get('playerTargets');
		
		game.physics.enable(this, Phaser.Physics.ARCADE);
		
		game.add.existing(this);
	}
	
	Ship.HEALTH = 4;
	Ship.RANGE = 700;
	Ship.DIRECTIONS = {
		EAST: 1,
		WEST: 2,
	};
	
	Ship.preload = function(game) {
		game.load.image('ship', '');
	};
	
	Ship.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Ship.prototype, damageComponent, {
		constructor: Ship,
		update: function() {
			this.ready = this.game.time.now - this.lastFire > this.coolDown;
			
			if(this.ready) {
				this.affect(this.playerTargets);
			}
		},
		fireAt: function(target) {
			var beam = Beam.create();
			
			beam.fire(this.x, this.y, target.x, target.y);
			target.damage(1);
			this.lastFire = this.game.time.now;
		},
		affect: function(targets) {
			var closestTarget,
				closestDistance,
				game = this.game,
				arcade = game.physics.arcade;
			
			if(!this.ready) {
				return;
			}
			
			targets.forEachAlive(function(target) {
				var distance = arcade.distanceBetween(this, target);
				
				if(distance >= this.range) {
					return;
				}
				
				if(!closestTarget || distance < closestDistance) {
					closestTarget = target;
					closestDistance = distance;
				}
			}, this);
			
			if(closestTarget) {
				this.fireAt(closestTarget);
			}
		},
	});
	
	Ship.create = function(props) {
		var ship,
			ships = instanceManager.get('ships');
		
		ship = ships.getFirstDead();
		
		if(!ship) {
			ship = new Ship(props);
			ships.add(ship);
		} else {
			ship.reset(props.x, props.y);
			ship.revive();
		}
		
		return ship;
	};
	
	//TODO remove global debug
	window.Ship = Ship;

	return Ship;
});