define(function(require, exports) {
	"use strict";
	
	//TODO remove debug global
	var injector = window.injector = exports;
		
	var resources = {
		game: {
			cache: true,
			init: function() {
				var CONFIG = require('config'),
					Phaser = require('phaser');

				//TODO remove debug global
				return window.game = new Phaser.Game(CONFIG.screen.width, CONFIG.screen.height, Phaser.AUTO, 'phaser');
			},
		},

		hero: {
			cache: true,
			init: function() {
				var CONFIG = require('config'),
					Hero = require('entities/hero');

				//TODO remove debug global
				return window.hero = new Hero({x: CONFIG.stage.width/2, y: CONFIG.stage.height});
			}
		},
		
		turrets: {
			cache: true,
			init: function() {
				var Turrets = require('controllers/turrets');
				return new Turrets();
			},
		},

		meteors: {
			cache: true,
			init: function() {
				var Meteors = require('controllers/meteors');
				return new Meteors();
			},
		},

		resourceFragments: {
			cache: true,
			init: function() {
				var ResourceFragments = require('controllers/resource-fragments');

				return new ResourceFragments();
			},
		},
		
		hud: {
			cache: true,
			init: function() {
				var Hud = require('entities/hud');
				return new Hud();
			},
		},
		
		meteorTrail: {
			cache: false,
			init: function() {
				var game = injector.get('game');
				
				return null;
			}
		}
	},
		
	instances = {};
		
	exports.get = function(resourceName) {
		var resourceInstance = instances[resourceName];
		
		if(!resourceInstance) {
			resourceInstance = resources[resourceName].init();
			
			if(resources[resourceName].cache) {
				instances[resourceName] = resourceInstance;
			}
		}

		return resourceInstance;
	};
	
	exports.reset = function(dependency) {
		instances[dependency] = resources[dependency]();
	};
});