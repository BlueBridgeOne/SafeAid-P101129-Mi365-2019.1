// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365ConfirmTransfer.View', [
	'SafeAid.bb1.Mi365Transfers.Model',
	'safeaid_bb1_mi365record.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore'
], function (
	Mi365TransfersModel,
	safeaid_bb1_mi365record_tpl,
	Utils,
	Backbone,
	Tools,
	BackboneFormView,
	jQuery,
	_
) {
	'use strict';


	return Backbone.View.extend({

		template: safeaid_bb1_mi365record_tpl,
		fields: [{
			id: "custrecord_bb1_sca_costocktrans_area",
			label: "From Area",
			type: "record",
			mandatory: true,
			list: true,
			url: "Mi365/area/",
			icon:"area"
		}, {
			id: "custrecord_bb1_sca_costocktrans_wearer",
			label: "To Wearer",
			type: "record",
			mandatory: true,
			list: true,
			url: "Mi365/wearer/",
			icon:"wearer"
		}, {
			id: "custrecord_bb1_sca_costocktrans_quantity",
			label: "Quantity",
			type: "inlinetext",
			mandatory: true,
			list: true
		},  {
			id: "custrecord_bb1_sca_costocktrans_confname",
			label: "Confirmed By",
			type: "text",
			mandatory: true
		},  {
			id: "custrecord_bb1_sca_costocktrans_sign",
			label: "Signature",
			type: "signature",
			mandatory: true
		}],
		initialize: function (options) {
this.overview=options.overview;

				var bind = {};
				for (var i = 0; i < this.fields.length; i++) {
					if (!this.fields[i].listonly) {
						bind['[name=\"' + this.fields[i].id + '\"]'] = this.fields[i].id;
					}
				}
				this.bindings = bind;
				this.model.on('save', _.bind(this.showSuccess, this));
				this.model.on('error', _.bind(this.showError, this));
				BackboneFormView.add(this);
				this.application = options.application;
			}
,getCanvasPos:function(e) { //get the position of the mouse on the canvas
	var c=this.canvas;
	var rect = c.getBoundingClientRect();
	var ratioX=c.width/(rect.right-rect.left);
	var ratioY=c.height/(rect.bottom-rect.top);
	var offsetX = rect.left;
	var offsetY = rect.top;
	return {
		x: parseInt((e.clientX - offsetX)*ratioX),
		y: parseInt((e.clientY - offsetY)*ratioY)
	};
}
			,
		events: {
			'submit form': 'saveForm',
			'mousedown #mySignCanvas': 'mouseDown',
			'mousemove #mySignCanvas': 'mouseMove',
			'mouseup #mySignCanvas': 'mouseUp',
			'mouseout #mySignCanvas': 'mouseUp'
		},
		mouseDown: function (e) {
			e.preventDefault();
			e.stopPropagation();
			
			var pos = this.getCanvasPos(e);
            this.points.push({
                s: true,
                x: pos.x,
                y: pos.y,
                w:2
            });
            this.pressed = true;
			this.lastTime = new Date();
			
		},
		mouseUp: function (e) {
			e.preventDefault();
			e.stopPropagation();
			
			var pos = this.getCanvasPos(e);
            this.pressed = false;
            this.sign.value=JSON.stringify(this.points);
			
		},
		mouseMove: function (e) {
			e.preventDefault();
			e.stopPropagation();
			
			var pos = this.getCanvasPos(e);

            if (this.pressed) {
                var newTime = new Date();
                var timeDiff = newTime.getTime() - this.lastTime.getTime();
                timeDiff=timeDiff*timeDiff*timeDiff; //spread out the values
                var lastPoint=this.points[this.points.length-1];
                if(pos.x==lastPoint.x&&pos.y==lastPoint.y){
                    return;
                }
                var dist=((lastPoint.x-pos.x)*(lastPoint.x-pos.x))+((lastPoint.y-pos.y)*(lastPoint.y-pos.y));
                var width = Math.max(.5, Math.min(5, (timeDiff / dist)/7));
                
                this.lastTime = newTime;
                
                if(lastPoint.w>width+2){
                    width=lastPoint.w-1;
                }else if(lastPoint.w<width-2){
                    width=lastPoint.w+1;
                }else if(lastPoint.w>width+1){
                    width=lastPoint.w-.5;
                }else if(lastPoint.w<width-1){
                    width=lastPoint.w+.5;
				}
				width=Math.round(width*10)/10;
                
                this.points.push({
                    x: pos.x,
                    y: pos.y,
                    w: width
                });
                this.ctx.beginPath();
                this.ctx.lineCap = "round";
                this.ctx.lineWidth = width;
                var c=120-(20*width);
                this.ctx.strokeStyle = "rgb("+c+","+c+","+c+")";
                
                this.ctx.moveTo(lastPoint.x, lastPoint.y);
                this.ctx.lineTo(pos.x, pos.y);
                this.ctx.stroke();
            }
			
		},
		showSuccess: function () {
			if (this.$savingForm) {
				
				var confirmId = this.model.get("id");
				Backbone.history.navigate('Mi365/transfer/' + confirmId, {
					trigger: true
				});
			}
		},
		showError: function (err) {
			if (this.$savingForm) {
				Tools.showErrorInModal(this.application, _('Confirmation Failed!').translate(), _(err).translate());
			}
		},
		render: function () {
			// try{
			this._render();
			this.canvas = this.$el.find("#mySignCanvas")[0];
			this.sign = this.$el.find("#custrecord_bb1_sca_costocktrans_sign")[0];
			
			this.ctx = this.canvas.getContext("2d");
			this.lastTime = new Date();
			this.points = [];
			this.pressed = false;
			// }catch(err){
			// 	console.log(err);
			// }

		},

		getContext: function getContext() {
			var allowTransferStock=this.overview.get("custentity_bb1_sca_allowtransferstock")=="T";
			var confirmed = false,
				newFields = [];
			//{id:"custentity_bb1_sca_allowviewreports",label:"Allow View Reports",type:"checkbox"};
			for (var i = 0; i < this.fields.length; i++) {
				if (!this.fields[i].listonly) {
					if (this.fields[i].id == "custrecord_bb1_sca_costocktrans_confname") {
						
						this.model.set("custrecord_bb1_sca_costocktrans_confname",this.model.get("custrecord_bb1_sca_costocktrans_wearer").text);
					}

					if (this.model.get(this.fields[i].id)) {
						this.fields[i].value = this.model.get(this.fields[i].id);
					}

					 
					// if (confirmed || (this.fields[i].id != "custrecord_bb1_sca_costocktrans_confname" && this.fields[i].id != "custrecord_bb1_sca_costocktrans_confdate")) {
						newFields.push(this.fields[i]);
					//}
				}
			}
			return {
				icon:"transfer",
				title: "Confirm Transfer",
				model: this.model,
				fields: newFields || [],
				editable: allowTransferStock,
				showDelete: false,
				breadcrumbs: [{
					href: "Mi365/transfer/" + this.model.get("id"),
					label: "Transfer"
				}],
				active: this.model.get("custrecord_bb1_sca_costocktrans_item").text,
				confirmText:"Confirm"
			};
		}
	});
});