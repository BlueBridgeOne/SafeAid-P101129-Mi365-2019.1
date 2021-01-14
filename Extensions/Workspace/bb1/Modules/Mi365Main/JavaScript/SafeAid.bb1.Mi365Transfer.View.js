// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Transfer.View', [
	'SafeAid.bb1.Mi365Transfers.Model',
	'safeaid_bb1_mi365record.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore',
	'Mi365Overview'
], function (
	Mi365TransfersModel,
	safeaid_bb1_mi365record_tpl,
	Utils,
	Backbone,
	Tools,
	BackboneFormView,
	jQuery,
	_,
	Mi365Overview
) {
	'use strict';


	return Backbone.View.extend({

		template: safeaid_bb1_mi365record_tpl,
		title:"Mi365 Transfer",
		fields: [{
			id: "created",
			label: "Date",
			type: "text",
			mandatory: true,
			list: true
		}, {

			id: "custrecord_bb1_sca_costocktrans_item",
			label: "Item",
			type: "record",
			mandatory: true,
			list: true,
			item:true
		}, {
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
			type: "text",
			mandatory: true,
			list: true
		}, {
			id: "custrecord_bb1_sca_costocktrans_confirme",
			label: "Confirmed",
			type: "checkbox",
			list: true
		}, {
			id: "custrecord_bb1_sca_costocktrans_confname",
			label: "Confirmed By",
			type: "text"
		}, {
			id: "custrecord_bb1_sca_costocktrans_confdate",
			label: "Confirmed Date",
			type: "text"
		}, {
			id: "custrecord_bb1_sca_costocktrans_sign",
			label: "Signature",
			type: "signature"
		}],
		initialize: function (options) {
			this.overview=Mi365Overview.get();
			var self=this;Mi365Overview.done(function(model){self.overview=model;self.render();});

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

			,
		events: {
			'submit form': 'saveForm',
			'click [data-action="confirm"]': 'confirmRecord'
		},
		confirmRecord: function (e) {
			console.log("confirm Record");
			var confirmId = this.model.get("id");


			console.log("confirm " + confirmId);
			Backbone.history.navigate('Mi365/transfer/confirm/' + confirmId, {
				trigger: true
			});

		},
		showSuccess: function () {
			if (this.$savingForm) {
				Tools.showSuccessInModal(this.application, _('Update Success').translate(), _('This wearer has been successfully updated!').translate());
			}
		},
		showError: function (err) {
			if (this.$savingForm) {
				Tools.showErrorInModal(this.application, _('Update Failed!').translate(), _(err).translate());
			}
		},
		render: function () {
			
try{
			this._render();
			var confirmed = false,
				signature;
			for (var i = 0; i < this.fields.length; i++) {

				if (this.fields[i].id == "custrecord_bb1_sca_costocktrans_confirme") {
					confirmed = this.fields[i].value == "T";
				} else if (this.fields[i].id == "custrecord_bb1_sca_costocktrans_sign") {
					signature = this.fields[i].value;
				}
			}
			if (confirmed) {
				var canvas = this.$el.find("#mySignCanvas")[0];
				var ctx = canvas.getContext("2d");
				var point, lastPoint, c;
				//console.log("render signature " + signature);
				if (signature && signature.length > 0) {
					signature = JSON.parse(signature);
					for (var i = 0; i < signature.length; i++) {
						point = signature[i];
						if (!point.s) {
							lastPoint = signature[i - 1];
							ctx.beginPath();
							ctx.lineCap = "round";
							ctx.lineWidth = point.w;
							c = 120 - (20 * point.w);
							ctx.strokeStyle = "rgb(" + c + "," + c + "," + c + ")";

							ctx.moveTo(lastPoint.x, lastPoint.y);
							ctx.lineTo(point.x, point.y);
							ctx.stroke();
						}
					}
				}
			}
		}catch(err){
			console.log(err);
		}
		},
		getContext: function getContext() {
			var allowPlatinum=this.overview.get("level")=="platinum";
			var allowEdit=this.overview.get("custentity_bb1_sca_allowtransferstock")=="T"&&allowPlatinum;
			
			var confirmed = false,
				newFields = [];
			//{id:"custentity_bb1_sca_allowviewreports",label:"Allow View Reports",type:"checkbox"};
			for (var i = 0; i < this.fields.length; i++) {
				if (!this.fields[i].listonly) {
					if (this.model.get(this.fields[i].id)) {
						this.fields[i].value = this.model.get(this.fields[i].id);
					}
					if (this.fields[i].id == "custrecord_bb1_sca_costocktrans_confirme") {
						confirmed = this.fields[i].value == "T";
					}
					if (confirmed || (this.fields[i].id != "custrecord_bb1_sca_costocktrans_confname" && this.fields[i].id != "custrecord_bb1_sca_costocktrans_confdate" && this.fields[i].id != "custrecord_bb1_sca_costocktrans_sign")) {
						newFields.push(this.fields[i]);
					}
				}
			}
			return {
				icon:"transfer",
				title: "Transfer",
				model: this.model,
				fields: newFields || [],
				editable: false,
				showDelete: false,
				showConfirm: (!confirmed)&&allowEdit,
				breadcrumbs: [{
					href: "Mi365/wearer/" + this.model.get("custrecord_bb1_sca_costocktrans_wearer").value,
					label: "Wearer"
				}],
				active: this.model.get("custrecord_bb1_sca_costocktrans_item").text
			};
		}
	});
});