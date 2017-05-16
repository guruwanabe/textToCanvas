/**
 * @author Bogdan Stanciu
 * @since 3/13/2017
 *
 * Helper Method to draw text on canvas elements
 *
 * @param $element {object}
 * @param $options {object || string}
 * @return function
 */

function TextToCanvas($element, $options){
	this.options     = $options;
	this.$element    = $($element); //jQuery

	//Render a error message if text options is not defined or empty
	if(typeof this.options.text == 'undefined' || this.options.text == ''){
		this.options.text = 'Error: text option is required';
		this.options.fillStyle = 'red';
		// Enforce text value with a warning in console
		console.error('text option is required')
	}

	//Add width callback
	//It will default to computed dimensions if omitted
	this.options.width ? (typeof this.options.width == 'function' ?
			this.options.width = this.options.width.call(this, this.$element[0]) :
			this.options.width) :
			this.options.width = this.computeDimensions().width;

	//Add height callback
	//It will default to computed dimensions if omitted
	this.options.height ? (typeof this.options.height == 'function' ?
			this.options.height = this.options.height.call(this, this.$element[0]) :
			this.options.height) :
			this.options.height = this.computeDimensions().height;

	//Draw the canvas
	this.draw(this.$element, this.options.width, this.options.height);
}

/**
 * TextToCanvas defaults
 *
 * @return object
 */

TextToCanvas.DEFAULTS = {
	 handler: false // bool || function
	,fontStyle: 'lighter 12px Arial,Helvetica,Geneva,sans-serif' // string
	,fillStyle: '#000000' // string
	,background: 'white' // string
	,message: '' // string
	,textParams: { // object
		x: 0, // number
		y: 12 // number
	}
};


/**
 * TextToCanvas prototype
 *
 * @return object
 */

TextToCanvas.prototype = {

	/**
	 * Draws the canvas
	 *
	 * @param $element {object}
	 * @param $width {number}
	 * @param $height {number}
	 * @return object
	 */
	draw: function($element, $width, $height) {
		//draw markup
		var canvas = this.createCanvas($width, $height); // create and add canvas
		var ctx = canvas.ctx;

		if (typeof canvas != "undefined" && canvas != null) {
			ctx.setTransform(1,0,0,1,0,0); // set default
			ctx.globalAlpha = 1;
			ctx.fillStyle = this.options.background;
			ctx.fillRect(0,0,canvas.width,canvas.height);
			ctx.fillStyle = this.options.fillStyle;
			ctx.font = this.options.fontStyle;
			ctx.fontAlign = "left";
			// turn of smoothing
			ctx.imageSmoothingEnabled = false;
			ctx.mozImageSmoothingEnabled = false;

			//Draw the text
                	ctx.fillText(this.options.text, this.options.textParams.x, this.options.textParams.y);
			//Set a random id on each canvas we create
			canvas.setAttribute('id', this.getUID('textToCanvas'));
			canvas.style.verticalAlign = 'top';
			//Add listener callback and cursor hand
			if(this.options.handler){
				canvas.style.cursor = 'pointer';
				typeof this.options.handler == 'function' ?
					this.options.handler.call(this, canvas, this.$element[0]) :
					// Enforce function value with a warning in console
					console.warn('handler must be a function')
			}
			//Add a message inside the canvas tags
			if(this.options.message){
				typeof this.options.message == 'string' ?
						canvas.innerHTML = this.options.message :
						canvas.innerHTML = this.options.message.toString()
			}

			//Insert the canvas into DOM
			this.insertIntoDom($element, canvas, this.getContainer());
		}
		return this;
	},

	/**
	 * Creates the canvas
	 *
	 * @param $width {number}
	 * @param $height {number}
	 * @return object
	 */
	createCanvas: function($width, $height){
		var canvas    = document.createElement("canvas");
		canvas.width  = $width;
		canvas.height = $height;
		canvas.ctx    = canvas.getContext("2d");

		return canvas;
	},

	/**
	 * Creates the canvas
	 *
	 * @param $element {object}
	 * @param $canvas {object}
	 * @param $container {object}
	 * @return object
	 */
	insertIntoDom: function($element, $canvas, $container) {
		if($container instanceof jQuery){
			$container = $element.parents().find($container);
			$container.append($canvas);
		}else{
			$container = document.getElementById($container);
			$container.appendChild($canvas);
		}
		return $canvas;
	},

	/**
	 * Gets the container
	 *
	 * @return object
	 */
	getContainer: function(){
		return this.options.container ? (typeof this.options.container == 'function' ?
				this.options.container.call(this, this.$element[0]) :
				this.options.container) :
				this.$element;
	},

	/**
	 * Creates and returns a random prefixed id
	 *
	 * @param $prefix {string}
	 * @return string
	 */
	getUID: function($prefix) {
		do $prefix += ~~(Math.random() * 1000000);
		while (document.getElementById($prefix));
		return $prefix
	},

	/**
	 * Computes canvas dimensions
	 *
	 * @return object
	 */
	computeDimensions: function(){
		var test = document.createElement("div");
		test.id = this.getUID('testStringLength');
		document.body.appendChild(test);
		test.setAttribute('style', 'position: absolute; float: left; white-space: nowrap; visibility: hidden;font:'+this.options.fontStyle);
		test.innerHTML = this.options.text;
		test = document.getElementById(test.id);

		var dimensions = {
			width:  (test.clientWidth + 1),
			height: (test.clientHeight + 1)
		};

		test.remove();
		return dimensions;
	}
};

+function ($) {
	"use strict";
	/**
	 * Plugin
	 *
	 * @param $option {object || string}
	 * @return function
	 *
	 * =======================
	 */
	function Plugin($option) {
		return this.each(function () {
			var self    = $(this);
			var data    = self.data("textToCanvas");
			var options = $.extend({}, TextToCanvas.DEFAULTS, self.data(), typeof $option == "object" && $option);

			if (!data) {
				self.data("textToCanvas", (data = new TextToCanvas(this, options)));
			}
			if (typeof $option == "string"){
				data[options]($option);
			}
		});
	}

	var old = $.fn.textToCanvas;

	$.fn.textToCanvas             = Plugin;
	$.fn.textToCanvas.Constructor = TextToCanvas;

	/**
	 * textToCanvas No Conflict
	 *
	 * @return object
	 *
	 * =======================
	 */
	$.fn.textToCanvas.noConflict = function () {
		$.fn.textToCanvas = old;
		return this;
	};

}(jQuery);
