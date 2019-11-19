// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365StartTransfer.View', [
	'SafeAid.bb1.Mi365Stocks.Model',
	'safeaid_bb1_mi365record.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore',
	'Mi365Overview'
], function (
	Mi365StocksModel,
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
		fields: [{
			id: "custrecord_bb1_sca_companystock_item",
			label: "Item",
			type: "record",
			mandatory: true,
			list: true
		}, {
			id: "custrecord_bb1_sca_companystock_area",
			label: "From Area",
			type: "record",
			list: true,
			mandatory: true,
			url: "Mi365/area/",
			icon:"area"
		}, {
			id: "custrecord_bb1_sca_companystock_wearer",
			label: "To Wearer",
			type: "choice",
			list: true,
			mandatory: true,
			url: "Mi365/wearer/",
			icon:"wearer"
		}, {
			id: "custrecord_bb1_sca_companystock_quantity",
			label: "Quantity",
			type: "text",
			mandatory: true,
			list: true
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
			'submit form': 'saveForm'
		},
		showSuccess: function (res) {
			if (this.$savingForm) {
				//Redirect here!
				//Bit of a hack, I returned the new transfer record, which gets mixed with the old stock record. But at least the data is available to use.
				Backbone.history.navigate('Mi365/transfer/' + res.get("id"), {
					trigger: true
				});

			}
		},
		showError: function (err) {
			if (this.$savingForm) {
				Tools.showErrorInModal(this.application, _('Transfer Failed!').translate(), _(err).translate());
			}
		},
		childViews: {}
		//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
		,
		getContext: function getContext() {
			var allowTransferStock=this.overview.get("custentity_bb1_sca_allowtransferstock")=="T";

			//{id:"custentity_bb1_sca_allowviewreports",label:"Allow View Reports",type:"checkbox"};
			var newFields = [],
				location, breadcrumbs = [];

			for (var i = 0; i < this.fields.length; i++) {
				if (!this.fields[i].listonly) {
					if (this.model.get(this.fields[i].id)) {
						this.fields[i].value = this.model.get(this.fields[i].id);
					}
					//Only show certain fields depening on area or wearer.
					if (this.fields[i].id == "custrecord_bb1_sca_companystock_location") {
						location = this.fields[i].value.text;
					} else if (location == "Area") {
						if (this.fields[i].id == "custrecord_bb1_sca_companystock_area") {
							newFields.push(this.fields[i]);
							breadcrumbs = [{
								href: "Mi365/area/" + this.fields[i].value.value,
								label: this.fields[i].value.text
							}, {
								href: "Mi365/area/stock/" + this.fields[i].value.value,
								label: "Stock"
							}];
						} else if (this.fields[i].id == "task" || this.fields[i].id == "custrecord_bb1_sca_companystock_minquant" || this.fields[i].id == "custrecord_bb1_sca_companystock_maxquant" || this.fields[i].id == "custrecord_bb1_sca_companystock_quantity")
							newFields.push(this.fields[i]);
					} else if (location == "Wearer") {
						if (this.fields[i].id == "custrecord_bb1_sca_companystock_wearer") {
							newFields.push(this.fields[i]);
							breadcrumbs = [{
								href: "Mi365/wearer/" + this.fields[i].value.value,
								label: this.fields[i].value.text
							}, {
								href: "Mi365/wearer/stock/" + this.fields[i].value.value,
								label: "Stock"
							}];
						} else if (this.fields[i].id == "task" || this.fields[i].id == "custrecord_bb1_sca_companystock_quantity") {
							newFields.push(this.fields[i]);
						}
					} else {
						newFields.push(this.fields[i]);
					}
				}
			}
			this.model.set("custrecord_bb1_sca_companystock_quantity", 1);
			return {
				icon:"transfer",
				title: "Transfer Stock to Wearer",
				model: this.model,
				fields: newFields || [],
				editable: allowTransferStock,
				breadcrumbs: breadcrumbs,
				active: this.model.get("custrecord_bb1_sca_companystock_item").text,
				confirmText: "Transfer",
				task: "starttransfer"
			};
		}
	});
});