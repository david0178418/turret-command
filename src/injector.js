define(function(require, exports) {
	"use strict";
	
	//TODO remove debug global
	window.injector = exports;
		
	var inits = {
		game: function() {
			var CONFIG = require('config'),
				Phaser = require('phaser');

			//TODO remove debug global
			return window.game = new Phaser.Game(CONFIG.screen.width, CONFIG.screen.height, Phaser.AUTO, 'phaser');
		},

		hero: function() {
			var CONFIG = require('config'),
				Hero = require('entities/hero');

			//TODO remove debug global
			return window.hero = new Hero({x: CONFIG.stage.width/2, y: CONFIG.stage.height});
		},
		
		turrets: function() {
			var Turrets = require('controllers/turrets');
			return new Turrets();
		},

		meteors: function() {
			var Meteors = require('controllers/meteors');
			return new Meteors();
		},

		resourceFragments: function() {
			var ResourceFragments = require('controllers/resource-fragments');

			return new ResourceFragments();
		},
		
		hud: function() {
			var Hud = require('entities/hud');
			return new Hud();
		},
	},
		
	instances = {};
		
	exports.get = function(dependency) {
		if(!instances[dependency]) {
			this.reset(dependency);
		}

		return instances[dependency];
	};
	
	exports.reset = function(dependency) {
		instances[dependency] = inits[dependency]();
	};
});