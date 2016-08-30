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
		Phaser.Sprite.call(this, game, props.x, props.y, 'ship0');
		this.playerTargets = instanceManager.get('playerTargets');
		this.initGun({
			cooldown: Ship.COOLDOWN,
		});
		this.initTargetClosest({
			targetAction: this.fireAt,
			range: Ship.RANGE,
		});

		this.revive(Ship.HEALTH);
		this.anchor.setTo(1, 0.5);

		game.physics.enable(this, Phaser.Physics.ARCADE);

		this.startFlightPath(props);

		game.add.existing(this);
	}

	Ship.COOLDOWN = 1800;
	Ship.HEALTH = 4;
	Ship.RANGE = 700;
	Ship.DIRECTIONS = {
		EAST: 1,
		WEST: 2,
	};

	Ship.preload = function(game) {
		game.load.image('ship0', 'assets/images/ship0.png');
	};

	Ship.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Ship.prototype,
		damageComponent,
		gunComponent,
		laserGunComponent,
		targetClosest, {
			constructor: Ship,
			startFlightPath: function(props) {
				var flightPath = this.game.add.tween(this);

				flightPath.to({
					x: props.direction === Ship.DIRECTIONS.WEST ? props.x - 3000: props.x +3000,
				}, props.flightTime);
				flightPath.start();

				if(props.direction === Ship.DIRECTIONS.WEST) {
					this.scale.setTo(1, 1);
					this.anchor.x = 0;
				} else {
					this.scale.setTo(-1, 1);
					this.anchor.x = this.width;
				}
			},
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
		// TODO Figure out why follow-up games break ships
		if(!ship) {
			ship = new Ship(props);
			ships.add(ship);
		} else {
			ship.reset(props.x, props.y);
			ship.startFlightPath(props);
			ship.revive(Ship.HEALTH);
		}

		return ship;
	};

	//TODO remove global debug
	window.Ship = Ship;

	return Ship;
});
