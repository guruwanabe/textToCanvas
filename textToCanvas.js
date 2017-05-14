/**
		 * Created by Bogdan on 5/13/2017.
		 */
		function RenderCanvasText($element, $options){
			this.options     = $options;
			this.$element    = $($element); //jQuery object

			//Add width callback
			if(this.options.width){
				typeof this.options.width == 'function' ?
								this.options.width = this.options.width.call(this, this.$element[0]) :
								this.options.width;
			}
			//Add height callback
			if(this.options.height){
				typeof this.options.height == 'function' ?
								this.options.height = this.options.height.call(this, this.$element[0]) :
								this.options.height
			}

			this.draw(this.$element, this.options.width, this.options.height);
		}

		RenderCanvasText.DEFAULTS = {
			 handler: false // bool || function
			,fontStyle:'lighter 12px Arial,Helvetica,Geneva,sans-serif' // string
			,fillStyle:'#000000' // string
			,width: 150 // number || function
			,height: 10 // number || function
			,message: '' // string
		};

		RenderCanvasText.prototype = {
			draw: function($element, $width, $height) {
				//draw markup
				var canvas = this.createCanvas($width, $height); // create and add canvas
				var ctx = canvas.ctx;

				if (typeof canvas != "undefined" && canvas != null) {
					ctx.setTransform(1,0,0,1,0,0); // set default
					ctx.globalAlpha = 1;
					ctx.fillStyle = "White";
					ctx.fillRect(0,0,canvas.width,canvas.height);
					ctx.fillStyle = this.options.fillStyle;
					ctx.font = this.options.fontStyle;
					this.subPixelText(ctx,
									this.options.text,
									this.options.textParams.x,
									this.options.textParams.y,
									25
					);
					//Set a random id on each canvas we create
					canvas.setAttribute('id', this.getUID('textToCanvas'));

					//Add listener callback and cursor hand
					if(this.options.handler){
						canvas.setAttribute('style', 'cursor:pointer');
						typeof this.options.handler == 'function' ?
										this.options.handler.call(this, canvas, this.$element[0]) :
										// Enforce function value with a warning in console
										console.warn('this.options.handler must be a function')
					}

					if(this.options.message){
						typeof this.options.message == 'string' ?
										canvas.innerHTML = this.options.message :
										// Enforce string value with a warning in console
										console.warn('this.options.message must be a string');
					}

					//Insert the canvas into DOM
					this.insertIntoDom($element, canvas, this.getContainer());
				}
				return this;
			},
			createCanvas: function($width, $height){
				var canvas = document.createElement("canvas");
						canvas.width  = $width;
						canvas.height = $height;
						canvas.ctx    = canvas.getContext("2d");

				return canvas;
			},
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
			getContainer: function(){
				return this.options.container ? (typeof this.options.container == 'function' ?
								this.options.container.call(this, this.$element[0]) :
								this.options.container) :
								this.$element;
			},
			getUID: function(prefix) {
				do prefix += ~~(Math.random() * 1000000);
				while (document.getElementById(prefix));
				return prefix
			},
			getWidth: function(ctx, text){
				var width;
				return width = ctx.measureText(text).width + 12; // add some extra pixels
			},
			subPixelText: function(ctx, text, x, y, fontHeight){
				//http://stackoverflow.com/questions/40066166/canvas-text-rendering-blurry
				var width = ctx.measureText(text).width + 12; // add some extra pixels
				var hOffset = Math.floor(fontHeight * 0.7);
				var canvas = this.createCanvas(width * 3, fontHeight);

				canvas.ctx.font = ctx.font;
				canvas.ctx.fillStyle = ctx.fillStyle;
				canvas.ctx.fontAlign = "left";
				// turn of smoothing
				canvas.ctx.imageSmoothingEnabled = false;
				canvas.ctx.mozImageSmoothingEnabled = false;
				// copy existing pixels to new canvas
				canvas.ctx.drawImage(ctx.canvas,x -2, y - hOffset, width, fontHeight, 0, 0, width, fontHeight);
				canvas.ctx.fillText(text,0,hOffset);    // draw thw text 3 time the width
				// convert to sub pixel
				canvas.ctx.putImageData(canvas.ctx.getImageData(0, 0, width*3, fontHeight),0,0);
				ctx.drawImage(canvas, 0, 0, width-1, fontHeight, x, y-hOffset, width-1, fontHeight);
				// done
			}
		};

		+function ($) {
			"use strict";

			// renderCanvasText Plugin
			// =======================
			function Plugin($option) {
				return this.each(function () {
					var self    = $(this);
					var data    = self.data("renderCanvasText");
					var options = $.extend({}, RenderCanvasText.DEFAULTS, self.data(), typeof $option == "object" && $option);

					if (!data) {
						self.data("renderCanvasText", (data = new RenderCanvasText(this, options)));
					}
					if (typeof $option == "string"){
						data[options]($option);
					}
				});
			}

			var old = $.fn.renderCanvasText;

			$.fn.renderCanvasText             = Plugin;
			$.fn.renderCanvasText.Constructor = RenderCanvasText;


			// renderCanvasText No Conflict
			// ============================
			$.fn.renderCanvasText.noConflict = function () {
				$.fn.renderCanvasText = old;
				return this;
			};

		}(jQuery);
