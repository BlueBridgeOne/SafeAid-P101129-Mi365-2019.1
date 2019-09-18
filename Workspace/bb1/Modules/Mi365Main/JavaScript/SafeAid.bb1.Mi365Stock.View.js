// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Stock.View', [
	'SafeAid.bb1.Mi365Stocks.Model',
	'safeaid_bb1_mi365record.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore'
], function (
	Mi365StocksModel,
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
			id: "custrecord_bb1_sca_companystock_item",
			label: "Item",
			type: "record",
			mandatory: true,
			list: true
		}, {
			id: "custrecord_bb1_sca_companystock_location",
			label: "Location",
			type: "record",
			mandatory: true,
			list: true
		}, {
			id: "custrecord_bb1_sca_companystock_area",
			label: "Area",
			type: "record",
			list: true,
			mandatory: true,
			url: "Mi365/area/"
		}, {
			id: "custrecord_bb1_sca_companystock_wearer",
			label: "Wearer",
			type: "record",
			list: true,
			mandatory: true,
			url: "Mi365/wearer/"
		}, {
			id: "custrecord_bb1_sca_companystock_quantity",
			label: "Quantity",
			type: "inlinetext",
			mandatory: true,
			list: true
		}, {
			id: "custrecord_bb1_sca_companystock_minquant",
			label: "Re-Order Minimum",
			type: "text"
		}, {
			id: "custrecord_bb1_sca_companystock_maxquant",
			label: "Re-Order Maximum",
			type: "text"
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

			,
		events: {
			'submit form': 'saveForm',
			'click [data-action="start-transfer"]': 'startTransfer'
		},
		startTransfer: function (e) {
			console.log("start Transfer");

			var stockId = this.model.get("id");

			console.log("stock " + stockId);
				Backbone.history.navigate('Mi365/area/transfers/new/'+stockId, {
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
		childViews: {}
		//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
		,
		getContext: function getContext() {
			
			var allowEdit=this.overview.get("custentity_bb1_sca_alloweditstock")=="T";
			var allowTransferStock=this.overview.get("custentity_bb1_sca_allowtransferstock")=="T";
			
			//{id:"custentity_bb1_sca_allowviewreports",label:"Allow View Reports",type:"checkbox"};
			var newFields = [],
				location, breadcrumbs = [],title="Stock";

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
							title = this.fields[i].value.text+" Stock";
							newFields.push(this.fields[i]);
							breadcrumbs= [{
								href: "Mi365/area/"+this.fields[i].value.value,
								label: this.fields[i].value.text
							},{
								href: "Mi365/area/stock/"+this.fields[i].value.value,
								label: "Stock"
							}];
						} else if (this.fields[i].id == "custrecord_bb1_sca_companystock_minquant" || this.fields[i].id == "custrecord_bb1_sca_companystock_maxquant" || this.fields[i].id == "custrecord_bb1_sca_companystock_quantity")
							newFields.push(this.fields[i]);
					} else if (location == "Wearer") {
						if (this.fields[i].id == "custrecord_bb1_sca_companystock_wearer") {
							title = this.fields[i].value.text+" Stock";
							newFields.push(this.fields[i]);
							breadcrumbs= [{
								href: "Mi365/wearer/"+this.fields[i].value.value,
								label: this.fields[i].value.text
							},{
								href: "Mi365/wearer/stock/"+this.fields[i].value.value,
								label: "Stock"
							}];
							
						} else if (this.fields[i].id == "custrecord_bb1_sca_companystock_quantity") {
							newFields.push(this.fields[i]);
						}
					} else {
						newFields.push(this.fields[i]);
					}
				}
			}
			var allowTransfers=false;
			if(location=="Area"&&parseInt(this.model.get("custrecord_bb1_sca_companystock_quantity"))>0){
				allowTransfers=true;
			}
			
			return {
				title: title,
				model: this.model,
				fields: newFields || [],
				editable: allowEdit,
				breadcrumbs: breadcrumbs,
				showStartTransfer:allowTransfers&&allowEdit&&allowTransferStock,
				active: this.model.get("custrecord_bb1_sca_companystock_item").text
			};
		}
	});
});