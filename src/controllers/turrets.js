define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		Turret = require('entities/turret'),
		injector = require('injector');

	function Turrets() {
		this.game = injector.get('game');
		this.turrets = this.game.add.group();
	}

	Turrets.prototype = {
		update: function(game) {
		},
		spawnTurret: function(x, y) {
			var turret = this.turrets.getFirstDead();
			
			if(!turret) {
				turret = new Turret({x: x, y:y});
				this.turrets.add(turret);
			} else {
				turret.reset(x, y);
				turret.revive();
			}
		}
	};
	
	Turrets.preload = function(game) {
		Turret.preload(game);
	};

	return Turrets;
});