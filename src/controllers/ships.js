define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		Ship = require('entities/ship'),
		instanceManager = require('instance-manager');

	function Ships() {
		this.game = instanceManager.get('game');
		this.baseInterval = 5000;
		this.intervalRange = 10000;
		this.nextSpawn = 10000;
		this.level = 0;
		this.killCount = 0;
	}

	Ships.TRAVERSAL_BASE_TIME = 12000;
	Ships.TRAVERSAL_TIME_RANGE = 3000;
	Ships.SPAWN_HEIGHT_MAX = 550;
	Ships.SPAWN_HEIGHT_MIN = 250;

	Ships.prototype = {
		update: function() {
			this.nextSpawn -= this.game.time.elapsed;

			if(this.nextSpawn < 0) {
				this.spawnShip(this.game);

				this.nextSpawn = this.baseInterval + _.random(this.intervalRange);
			}
		},

		incrementKills: function() {
			this.killCount++;
		},

		spawnShip: function() {
			var goEast = _.random(0, 1),
				properties = {
					x: goEast ? - 100: this.game.world.width + 100,
					y: _.random(Ships.SPAWN_HEIGHT_MIN, Ships.SPAWN_HEIGHT_MAX),
					direction: goEast ? Ship.DIRECTIONS.EAST : Ship.DIRECTIONS.WEST,
					flightTime: Ships.TRAVERSAL_BASE_TIME + _.random(-Ships.TRAVERSAL_TIME_RANGE, Ships.TRAVERSAL_TIME_RANGE),
				};

			var y = Ship.create(properties);
		},
	};

	Ships.preload = function(game) {
		Ship.preload(game);
	};

	return Ships;
});
