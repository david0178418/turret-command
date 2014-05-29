define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser'),
		damageComponent = require('components/damage'),
		gunComponent = require('components/gun'),
		laserGunComponent = require('components/laser-gun'),
		targetClosest = require('components/target-closest'),
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
		this.flightPath = game.add.tween(this);
		this.flightPath.to({
			x: props.direction === Ship.DIRECTIONS.WEST ? props.x - 3000: props.x +3000
		}, 10000);
		this.flightPath.start();
		this.playerTargets = instanceManager.get('playerTargets');
		this.initGun({
			cooldown: Ship.cooldown,
		});
		this.initTargetClosest({
			targetAction: this.fireAt,
			range: Ship.RANGE,
		});
		
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
	_.extend(Ship.prototype,
		damageComponent, 
		gunComponent,
		laserGunComponent,
		targetClosest, {
			constructor: Ship,
			update: function() {
				if(this.isDead()) {
					this.kill();
					return;
				}

				if(this.gunReady()) {
					this.aquireTarget(this.playerTargets);
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