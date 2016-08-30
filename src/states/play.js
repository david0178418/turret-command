define(function(require) {
	"use strict";
	var CONFIG = require('config');
	var CONSTANTS = require('constants');
	var Phaser = require('phaser');
	var States = require('states');
	var Meteors = require('controllers/meteors');
	var Hero = require('entities/hero');
	var Building = require('entities/building');
	var Beam = require('entities/beam');
	var ResourceFragment = require('entities/resource-fragment');
	var Turret = require('entities/turret');
	var Ship = require('entities/ship');
	var Hud = require('entities/hud');
	var instanceManager = require('instance-manager');
	var resourceFragments;
	var game = instanceManager.get('game');

	States.Play = 'play';
	game.state.add(States.Play, {
		preload: function(game) {
			loadBlocks(game);

			Hero.preload(game);
			Building.preload(game);
			Meteors.preload(game);
			Hud.preload(game);
			Beam.preload(game);
			Turret.preload(game);
			ResourceFragment.preload(game);
			Ship.preload(game);
		},
		create: function(game) {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
			this.renderBackground();

			instanceManager.reset('meteorController');
			instanceManager.reset('shipController');
			instanceManager.reset('buildings')
			instanceManager.reset('turrets');
			instanceManager.reset('resourceFragments');
			instanceManager.reset('meteors');
			instanceManager.reset('enemyTargets');
			instanceManager.reset('hero');
			instanceManager.reset('hud');
			instanceManager.reset('ships');
			instanceManager.reset('beams');

			Building.create({
				x: 100,
				y: CONSTANTS.GROUND_SURFACE_HEIGHT
			});

			Building.create({
				x: game.world.width / 2,
				y: CONSTANTS.GROUND_SURFACE_HEIGHT
			});

			Building.create({
				x: game.world.width - 100,
				y: CONSTANTS.GROUND_SURFACE_HEIGHT
			});

			this.gameOver = false;
			this.meteorController = instanceManager.get('meteorController');
			this.shipController = instanceManager.get('shipController');
			this.buildings = instanceManager.get('buildings')
			this.turrets = instanceManager.get('turrets');
			this.resourceFragments = instanceManager.get('resourceFragments');
			this.meteors = instanceManager.get('meteors');
			this.enemyTargets = instanceManager.get('enemyTargets');
			this.hero = instanceManager.get('hero');
			this.hud = instanceManager.get('hud');
			game.stage.backgroundColor = '#101010';

			game.camera.follow(this.hero);
		},
		update: function(game) {
			if(!this.buildings.length && !this.gameOver) {
				this.endGame();
			} else {
				//TODO Unify all this crazy
				game.physics.arcade.overlap(this.hero, this.meteors, this.collideHeroMeteor, null, this);
				game.physics.arcade.overlap(this.turrets, this.meteors, this.collideTurretMeteor, null, this);
				game.physics.arcade.overlap(this.meteors, this.buildings, this.collideMeteorBuilding, null, this);
				game.physics.arcade.overlap(this.hero, this.resourceFragments.resourceFragments, this.collideHeroResource, null, this);

				this.meteorController.update(game);
				this.shipController.update(game);
				this.hud.update(game);
			}
		},
		paused: function() {
		},
		collideTurretMeteor: function(turret, meteor) {
			turret.damage(1);
			meteor.explode();
		},
		collideHeroMeteor: function(hero, meteor) {
			var meteorTouching;

			hero.damage(1);
			hero.stun();
			meteor.explode();
		},
		collideMeteorBuilding: function(meteor, building) {
			meteor.explode();
			building.damage(1);
		},
		collideHeroResource: function(hero, resource) {
			hero.addPower(resource.value);
			resource.kill();
		},
		renderBackground: function() {
			game.add.sprite(0, CONFIG.stage.height - 11, 'ground');
		},
		endGame: function() {
			this.gameOver = true;

			this.startRenderEnd();
		},
		startRenderEnd: function() {
			var gameOverSign = new Phaser.Sprite(game, CONFIG.stage.width/2, CONFIG.stage.height* 1/4, 'game-over');
			var replayButton = new Phaser.Button(game, CONFIG.stage.width/2, CONFIG.stage.height * 3/4, 'replay', function() {
				game.state.start('play');
			});
			var widthRange = 2360 - CONFIG.stage.width;
			var y = CONFIG.stage.height - 31;

			gameOverSign.anchor.set(0.5, 0.5);
			replayButton.anchor.set(0.5, 0.5);
			replayButton.onInputOver.add(function() {
				replayButton.scale.set(1.2, 1.2);
			});
			replayButton.onInputOut.add(function() {
				replayButton.scale.set(1, 1);
			});

			function renderLine() {
				game.add.sprite(-(Math.random() * widthRange), y, 'game-over-bricks');

				if(y > 0) {
					y -= 20;
					setTimeout(renderLine, 50);
				} else {
					game.add.existing(gameOverSign);
					game.add.existing(replayButton);
				}
			}

			renderLine();
		}
	});

	function loadBlocks(game) {
		game.load.image('brick-1-black', 'assets/images/blocks/brick-1-black.png');
		game.load.image('brick-1-blue', 'assets/images/blocks/brick-1-blue.png');
		game.load.image('brick-1-gray', 'assets/images/blocks/brick-1-gray.png');
		game.load.image('brick-1-green', 'assets/images/blocks/brick-1-green.png');
		game.load.image('brick-1-red', 'assets/images/blocks/brick-1-red.png');
		game.load.image('brick-1-white', 'assets/images/blocks/brick-1-white.png');
		game.load.image('brick-1-yellow', 'assets/images/blocks/brick-1-yellow.png');

		game.load.image('brick-2-black', 'assets/images/blocks/brick-2-black.png');
		game.load.image('brick-2-blue', 'assets/images/blocks/brick-2-blue.png');
		game.load.image('brick-2-gray', 'assets/images/blocks/brick-2-gray.png');
		game.load.image('brick-2-green', 'assets/images/blocks/brick-2-green.png');
		game.load.image('brick-2-red', 'assets/images/blocks/brick-2-red.png');
		game.load.image('brick-2-white', 'assets/images/blocks/brick-2-white.png');
		game.load.image('brick-2-yellow', 'assets/images/blocks/brick-2-yellow.png');

		game.load.image('brick-3-black', 'assets/images/blocks/brick-3-black.png');
		game.load.image('brick-3-blue', 'assets/images/blocks/brick-3-blue.png');
		game.load.image('brick-3-gray', 'assets/images/blocks/brick-3-gray.png');
		game.load.image('brick-3-green', 'assets/images/blocks/brick-3-green.png');
		game.load.image('brick-3-red', 'assets/images/blocks/brick-3-red.png');
		game.load.image('brick-3-white', 'assets/images/blocks/brick-3-white.png');
		game.load.image('brick-3-yellow', 'assets/images/blocks/brick-3-yellow.png');

		game.load.image('brick-4-black', 'assets/images/blocks/brick-4-black.png');
		game.load.image('brick-4-blue', 'assets/images/blocks/brick-4-blue.png');
		game.load.image('brick-4-gray', 'assets/images/blocks/brick-4-gray.png');
		game.load.image('brick-4-green', 'assets/images/blocks/brick-4-green.png');
		game.load.image('brick-4-red', 'assets/images/blocks/brick-4-red.png');
		game.load.image('brick-4-white', 'assets/images/blocks/brick-4-white.png');
		game.load.image('brick-4-yellow', 'assets/images/blocks/brick-4-yellow.png');

		game.load.image('cone-black', 'assets/images/blocks/cone-black.png');
		game.load.image('cone-blue', 'assets/images/blocks/cone-blue.png');
		game.load.image('cone-gray', 'assets/images/blocks/cone-gray.png');
		game.load.image('cone-green', 'assets/images/blocks/cone-green.png');
		game.load.image('cone-red', 'assets/images/blocks/cone-red.png');
		game.load.image('cone-white', 'assets/images/blocks/cone-white.png');
		game.load.image('cone-yellow', 'assets/images/blocks/cone-yellow.png');

		game.load.image('cone-trans-black', 'assets/images/blocks/cone-trans-black.png');
		game.load.image('cone-trans-blue', 'assets/images/blocks/cone-trans-blue.png');
		game.load.image('cone-trans-gray', 'assets/images/blocks/cone-trans-gray.png');
		game.load.image('cone-trans-green', 'assets/images/blocks/cone-trans-green.png');
		game.load.image('cone-trans-red', 'assets/images/blocks/cone-trans-red.png');
		game.load.image('cone-trans-white', 'assets/images/blocks/cone-trans-white.png');
		game.load.image('cone-trans-yellow', 'assets/images/blocks/cone-trans-yellow.png');

		game.load.image('plate-round-black', 'assets/images/blocks/plate-round-black.png');
		game.load.image('plate-round-blue', 'assets/images/blocks/plate-round-blue.png');
		game.load.image('plate-round-gray', 'assets/images/blocks/plate-round-gray.png');
		game.load.image('plate-round-green', 'assets/images/blocks/plate-round-green.png');
		game.load.image('plate-round-red', 'assets/images/blocks/plate-round-red.png');
		game.load.image('plate-round-white', 'assets/images/blocks/plate-round-white.png');
		game.load.image('plate-round-yellow', 'assets/images/blocks/plate-round-yellow.png');

		game.load.image('plate-round-trans-black', 'assets/images/blocks/plate-round-trans-black.png');
		game.load.image('plate-round-trans-blue', 'assets/images/blocks/plate-round-trans-blue.png');
		game.load.image('plate-round-trans-gray', 'assets/images/blocks/plate-round-trans-gray.png');
		game.load.image('plate-round-trans-green', 'assets/images/blocks/plate-round-trans-green.png');
		game.load.image('plate-round-trans-red', 'assets/images/blocks/plate-round-trans-red.png');
		game.load.image('plate-round-trans-white', 'assets/images/blocks/plate-round-trans-white.png');
		game.load.image('plate-round-trans-yellow', 'assets/images/blocks/plate-round-trans-yellow.png');

		game.load.image('round-black', 'assets/images/blocks/round-black.png');
		game.load.image('round-blue', 'assets/images/blocks/round-blue.png');
		game.load.image('round-gray', 'assets/images/blocks/round-gray.png');
		game.load.image('round-green', 'assets/images/blocks/round-green.png');
		game.load.image('round-red', 'assets/images/blocks/round-red.png');
		game.load.image('round-white', 'assets/images/blocks/round-white.png');
		game.load.image('round-yellow', 'assets/images/blocks/round-yellow.png');

		game.load.image('round-trans-black', 'assets/images/blocks/round-trans-black.png');
		game.load.image('round-trans-blue', 'assets/images/blocks/round-trans-blue.png');
		game.load.image('round-trans-gray', 'assets/images/blocks/round-trans-gray.png');
		game.load.image('round-trans-green', 'assets/images/blocks/round-trans-green.png');
		game.load.image('round-trans-red', 'assets/images/blocks/round-trans-red.png');
		game.load.image('round-trans-white', 'assets/images/blocks/round-trans-white.png');
		game.load.image('round-trans-yellow', 'assets/images/blocks/round-trans-yellow.png');

		game.load.image('ground', 'assets/images/ground.png');
		game.load.image('game-over', 'assets/images/game-over.png');
		game.load.image('game-over-bricks', 'assets/images/game-over-bricks.png');
		game.load.image('replay', 'assets/images/replay.png');
	}
});
