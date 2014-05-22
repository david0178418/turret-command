define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		Building = require('entities/building'),
		injector = require('injector');

	function Buildings() {
		var game = injector.get('game');
		this.cities = game.add.group();
		this.cities.add(new Building({
			x: 100,
			y: game.world.height
		}));
		
		this.cities.add(new Building({
			x: game.world.width / 2,
			y: game.world.height
		}));
		
		this.cities.add(new Building({
			x: game.world.width - 100,
			y: game.world.height
		}));
	}

	Buildings.prototype = {
		update: function(game) {
		},
	};
	
	Buildings.preload = function(game) {
		Building.preload(game);
	};

	return Buildings;
});