define(function(require) {
	"use strict";

	var _ = require('lodash');
	var Phaser = require('phaser');
	var damageComponent = require('components/damage');
	var instanceManager = require('instance-manager');

	function Building(props) {
		var game = instanceManager.get('game');
		Phaser.Sprite.call(this, game, props.x, props.y, 'generator0');

		this.smoothed = false;
		this.revive(Building.HIT_POINTS);
		this.anchor.setTo(0.5, 1);

		game.physics.enable(this, Phaser.Physics.ARCADE);
		game.add.existing(this);
		this.body.immovable = true;
		this.priorHealth = this.health;
	}

	Building.HIT_POINTS = 3;
	Building.preload = function(game) {
		game.load.image('generator0', 'assets/images/generator0.png');
		game.load.image('generator1', 'assets/images/generator1.png');
		game.load.image('generator2', 'assets/images/generator2.png');
	};

	Building.prototype = Object.create(Phaser.Sprite.prototype);

	_.extend(Building.prototype, damageComponent, {
		constructor: Building,
		update: function() {
			if(!this.health) {
				this.kill();
				this.destroy();
				return;
			} else if(this.health != this.priorHealth) {
				this.loadTexture('generator' + (Building.HIT_POINTS - this.health));
				this.priorHealth = this.health;
			}
		},
	});

	Building.create = function(props) {
		var building;
		var buildings = instanceManager.get('buildings');

		building = new Building(props);
		buildings.add(building);

		return building;
	};

	return Building;
});
