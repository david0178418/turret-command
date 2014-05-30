define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		instanceManager = require('instance-manager');

	function DragSelection(props) {
		var game = instanceManager.get('game');
		Phaser.Graphics.call(this, game, 0, 0);
		
		this.endPoint = new Phaser.Point();
		this.mouse = game.input.mousePointer;
		this.alpha = 0.25;
		this.visible = false;
		this.startSelection = false;
		game.add.existing(this);
	}
	
	DragSelection.prototype = Object.create(Phaser.Graphics.prototype);
	_.extend(DragSelection.prototype, {
		constructor: DragSelection,
		update: function() {
			if(this.mouse.isDown) {
				if(!this.startSelection) {
					this.startSelection = true;
					this.visible = true;
					this.position.set(this.mouse.x - 10, this.mouse.y - 10);
					
					console.log(this.position.x, this.position.y);
				}
				this.clear();
				this.lineStyle(3, 0xFFFF0B);
				this.beginFill(0xFFFF0B);
				this.drawRect(0, 0, this.mouse.x - this.position.x, this.mouse.y - this.position.y);
				this.endFill();
			} else {
				this.startSelection = false;
				this.visible = false;
			}
		}
	});
	
	window.DragSelection = DragSelection;
	return DragSelection;
});