// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Rule.View', [
	'SafeAid.bb1.Mi365Rules.Model',
	'safeaid_bb1_mi365record.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore'
], function (
	Mi365RulesModel,
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
			id: "custrecord_bb1_sca_rule_item",
			label: "Item",
			type: "choice",
			mandatory: true,
			list: true
		}, {
			id: "custrecord_bb1_sca_rule_area",
			label: "Area",
			type: "record",
			list: true,
			mandatory: true,
			url: "Mi365/area/"
		}, {
			id: "custrecord_bb1_sca_rule_wearer",
			label: "Wearer",
			type: "choice",
			list: true,
			mandatory: true,
			url: "Mi365/wearer/"
		}, {
			id: "custrecord_bb1_sca_rule_quantity",
			label: "Quantity",
			type: "text",
			mandatory: true,
			list: true
		}, {
			id: "custrecord_bb1_sca_rule_duration",
			label: "Duration",
			type: "choice",
			mandatory: true,
			list: true
		}, {
			id: "custrecord_bb1_sca_rule_purchased",
			label: "Current Purchased",
			type: "inlinetext"
		}, {
			id: "custrecord_bb1_sca_rule_startdate",
			label: "Current Start Date",
			type: "inlinetext"
		}],
		initialize: function (options) {
				this.overview = options.overview;

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
			'click [data-action="delete"]': 'deleteRecord',
			'click [data-action="start-transfer"]': 'startTransfer'
		},
		deleteRecord: function (e) {
			var self = this;
			Tools.showConfirmInModal(this.application, _('Delete Rule').translate(), _('Please confirm you want to delete this record.').translate(), function () {

				console.log("delete Record");
				var model = new Mi365RulesModel();
				var deleteId = self.model.get("id");
				var area = self.model.get("custrecord_bb1_sca_rule_area").value;
				var wearer = self.model.get("custrecord_bb1_sca_rule_wearer").value;
					

				model.fetch({
					data: {
						id: deleteId,
						task: "delete",
						t: new Date().getTime()
					}
				}).always(function () {
					console.log("deleted " + deleteId);

					if (wearer) {
						Backbone.history.navigate('Mi365/wearer/rules/'+wearer, {
							trigger: true
						});
					} else {
						Backbone.history.navigate('Mi365/area/rules/'+area, {
							trigger: true
						});
					}
				});


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

			var allowEdit = this.overview.get("custentity_bb1_sca_alloweditrules") == "T";

			//{id:"custentity_bb1_sca_allowviewreports",label:"Allow View Reports",type:"checkbox"};
			var newFields = [],
				location = "Area",
				breadcrumbs = [],
				title = "Rule";

			if (this.model.get("custrecord_bb1_sca_rule_wearer")) {
				location = "Wearer";
			}
			for (var i = 0; i < this.fields.length; i++) {
				if (!this.fields[i].listonly) {

					if (this.model.get(this.fields[i].id)) {
						this.fields[i].value = this.model.get(this.fields[i].id);
					}
					//Only show certain fields depening on area or wearer.
					if (location == "Area") {
						if (this.fields[i].id == "custrecord_bb1_sca_rule_area") {
							title = this.fields[i].value.text + " Rule";
							breadcrumbs = [{
								href: "Mi365/area/" + this.fields[i].value.value,
								label: this.fields[i].value.text
							}, {
								href: "Mi365/area/rule/" + this.fields[i].value.value,
								label: "Rule"
							}];
						}
					} else if (location == "Wearer") {
						if (this.fields[i].id == "custrecord_bb1_sca_rule_wearer") {
							title = this.fields[i].value.text + " Rule";
							breadcrumbs = [{
								href: "Mi365/wearer/" + this.fields[i].value.value,
								label: this.fields[i].value.text
							}, {
								href: "Mi365/wearer/rule/" + this.fields[i].value.value,
								label: "Rule"
							}];

						}
					}
					newFields.push(this.fields[i]);
				}
			}
			return {
				title: title,
				model: this.model,
				fields: newFields || [],
				editable: allowEdit,
				showDelete: allowEdit,
				breadcrumbs: breadcrumbs,
				active: this.model.get("custrecord_bb1_sca_rule_item")&&this.model.get("custrecord_bb1_sca_rule_item").text
			};
		

		}
	});
});