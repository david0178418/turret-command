define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		Building = require('entities/building');

	function Buildings(game) {
		this.game = game;
		this.cities = game.add.group();
		this.cities.add(new Building({
			x: 100,
			y: game.world.height
		}, game));
		
		this.cities.add(new Building({
			x: game.world.width / 2,
			y: game.world.height
		}, game));
		
		this.cities.add(new Building({
			x: game.world.width - 100,
			y: game.world.height
		}, game));
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