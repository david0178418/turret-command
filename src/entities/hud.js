define(function(require) {
	"use strict";
	//TODO Need better place to organize since not really an entity.  Maybe "interface" folder?
	var _ = require('lodash'),
		Phaser = require('phaser');

	function Hud(game, hero, meteorController) {
		this.game = game;
		this.hero = hero;
		this.meteorController = meteorController;
		this.currentScore = meteorController.killCount;
		this.currentHealth = hero.health;
		this.currentPower = hero.power;
		
		this.scoreMsg = game.add.text(20, 20, 'Score: '+meteorController.killCount, {
			font: '30px Arial',
			fill: '#ff0044',
			align: 'left'
		});
		
		this.healthMsg = game.add.text(20, 60, 'Health: '+hero.health, {
			font: '30px Arial',
			fill: '#ff0044',
			align: 'left'
		});
		this.powerMsg = game.add.text(20, 100, 'Power: '+hero.power, {
			font: '30px Arial',
			fill: '#ff0044',
			align: 'left'
		});
		
		this.scoreMsg.fixedToCamera = true;
		this.healthMsg.fixedToCamera = true;
		this.powerMsg.fixedToCamera = true;
		
		window.hud = this;	//debug
	}

	Hud.prototype = {
		update: function() {
			var hero = this.hero;
			
			if(this.currentScore !== this.meteorController.killCount) {
				this.scoreMsg.text = 'Score: '+this.meteorController.killCount;
				this.currentScore = this.meteorController.killCount;
			}
			
			if(this.currentHealth !== hero.health) {
				this.healthMsg.text = 'Health: '+hero.health;
				this.currentHealth = hero.health;
			}
			
			if(this.currentPower !== hero.power) {
				this.powerMsg.text = 'Power: '+hero.power;
				this.currentPower = hero.power;
			}
		}
	};
	
	Hud.preload = function(game) {
		
	};

	return Hud;
});