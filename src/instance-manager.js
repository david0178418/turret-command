
//Really, "Service Locatore"...but whatever...  Using the
//anti-pattern just to get this thing up.
//TODO Organize more neatly so dependecies are known by the interface
define(function(require, exports) {
	"use strict";

	//TODO remove debug global
	var instanceManager = window.instanceManager = exports;

	var resources = {
		game: {
			init: function() {
				var CONFIG = require('config'),
					Phaser = require('phaser');

				//TODO remove debug global
				window.game = new Phaser.Game(CONFIG.screen.width, CONFIG.screen.height, Phaser.AUTO, 'phaser');

				setTimeout(function() {
					window.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
					window.game.scale.pageAlignHorizontally = false;
					window.game.scale.refresh();
				}, 0);
				return window.game;
			},
		},

		group: {
			cache: false,
			init: function() {
				return instanceManager.get('game').add.group();
			}
		},

		hero: {
			init: function() {
				var CONFIG = require('config');
				var CONSTANTS = require('constants');
				var Hero = require('entities/hero');

				//TODO remove debug global
				return window.hero = new Hero({x: CONFIG.stage.width/2, y: CONSTANTS.GROUND_SURFACE_HEIGHT});
			}
		},


		//TODO less ghetto way of collecting all targetables
		// since entities can only exist in one group at a time
		playerTargets: {
			init: function() {
				return {
					_lists: [
						instanceManager.get('turrets'),
						instanceManager.get('buildings'),
					],
					forEachAlive: function(callback, context) {
						for(var x = 0; x < this._lists.length; x++) {
							this._lists[x].forEachAlive(callback, context);
						}
					},
				};
			},
		},

		//TODO less ghetto way of collecting all targetables
		// since entities can only exist in one group at a time
		enemyTargets: {
			init: function() {
				return {
					_lists: [
						instanceManager.get('meteors'),
						instanceManager.get('ships'),
					],
					forEachAlive: function(callback, context) {
						//TODO less ghetto way of collecting all targetables
						// since entities can only exist in one group at a time
						for(var x = 0; x < this._lists.length; x++) {
							this._lists[x].forEachAlive(callback, context);
						}
					}
				};
			}
		},

		turrets: {
			init: function() {
				return instanceManager.get('group');
			},
		},

		buildings: {
			init: function() {
				return instanceManager.get('group');
			},
		},

		meteors: {
			init: function() {
				return instanceManager.get('group');
			},
		},

		ships: {
			init: function() {
				return instanceManager.get('group');
			},
		},

		beams: {
			init: function() {
				return instanceManager.get('group');
			},
		},

		shipController: {
			init: function() {
				var Ships = require('controllers/ships');
				return new Ships();
			}
		},

		meteorController: {
			init: function() {
				var Meteors = require('controllers/meteors');
				return new Meteors();
			},
		},

		resourceFragments: {
			init: function() {
				var ResourceFragments = require('controllers/resource-fragments');

				return new ResourceFragments();
			},
		},

		hud: {
			init: function() {
				var Hud = require('entities/hud');
				return new Hud();
			},
		},

		meteorTrail: {
			cache: false,
			init: function() {
				var game = instanceManager.get('game');

				return null;
			}
		}
	},

	instances = {};

	exports.get = function(resourceName) {
		var resourceInstance = instances[resourceName];

		if(!resourceInstance) {
			resourceInstance = resources[resourceName].init();

			if(resources[resourceName].cache || resources[resourceName].cache === undefined) {
				instances[resourceName] = resourceInstance;
			}
		}

		return resourceInstance;
	};

	exports.reset = function(dependency) {
		if(resources[dependency]) {
			instances[dependency] = resources[dependency].init();
		}
	};
});
