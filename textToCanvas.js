/**
		 * Created by Bogdan on 5/13/2017.
		 */
		function RenderCanvasText($element, $options){
			this.options     = $options;
			this.$element    = $($element); //jQuery object
			this.$canvas     = null;

			this.init();
		}

		RenderCanvasText.DEFAULTS = {
			 listener: false
			,fontStyle:'lighter 12px Arial,Helvetica,Geneva,sans-serif'
			,fillStyle:'#000000'
			,width: 120
			,height: 19
		};

		RenderCanvasText.prototype = {
			init: function(){
				if (this.$canvas){
					return this;
				}
				return this.draw(this.$element, this.options.width, this.options.height);;
			},
			draw: function($element, $width, $height) {
				//draw markup
				var $this = this;
				var canvas = this.createCanvas($width, $height); // create and add canvas
				var ctx = canvas.ctx;

				if (typeof canvas != "undefined" && $element != null) {
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

					//Add listener callback
					typeof this.options.listener == 'function' ?
								 this.options.listener.call(this, canvas, this.$element[0]) :
								 this.options.listener;

					//Insert the canvas into DOM
					this.insertIntoDom($element, canvas, this.getContainer());

					//We have created the layout if we got here, epic!, populate the object.
					this.$canvas = document.getElementById(canvas.id);
				}
				return this.$canvas;
		},
			createCanvas: function($width, $height){
				var canvas = document.createElement("canvas");
				canvas.width  = $width;
				canvas.height = $height;
				canvas.ctx    = canvas.getContext("2d");
				return canvas;
			},
			//http://stackoverflow.com/questions/40066166/canvas-text-rendering-blurry
			subPixelText: function(ctx, text, x, y, fontHeight){
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
			},
			getContainer: function(){
				return this.options.container ? this.options.container : this.$element;
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
			getUID: function (prefix) {
				do prefix += ~~(Math.random() * 1000000);
				while (document.getElementById(prefix));
				return prefix
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
