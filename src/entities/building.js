define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser'),
		damageComponent = require('components/damage'),
		instanceManager = require('instance-manager');

	function Building(props) {
		var game = instanceManager.get('game');
		Phaser.Sprite.call(this, game, props.x, props.y, 'building3');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 50;
		this.height = 200;
		// END

		this.smoothed = false;
		this.revive(Building.HIT_POINTS);
		this.anchor.setTo(0.5, 1);

		game.physics.enable(this, Phaser.Physics.ARCADE);
		game.add.existing(this);
		this.body.immovable = true;
		this.priorHealth = this.health;
	}

	Building.HIT_POINTS = 4;
	Building.preload = function(game) {
		game.load.image('building1', 'assets/images/building1.png');
		game.load.image('building2', 'assets/images/building2.png');
		game.load.image('building3', 'assets/images/building3.png');
	};

	Building.prototype = Object.create(Phaser.Sprite.prototype);

	_.extend(Building.prototype, damageComponent, {
		constructor: Building,
		update: function() {
			if(!this.health) {
				this.kill();
				return;
			} else if(this.health != this.priorHealth) {
				this.loadTexture('building' + this.health);
				this.priorHealth = this.health;
			}
		},
	});

	Building.create = function(props) {
		var building,
			buildings = instanceManager.get('buildings');

		building = buildings.getFirstDead();

		if(!building) {
			building = new Building(props);
			buildings.add(building);
		} else {
			building.reset(props.x, props.y);
			building.revive();
		}

		return building;
	};

	return Building;
});
