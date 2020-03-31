// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Wearer.View', [
	'SafeAid.bb1.Mi365Wearers.Model',
	'safeaid_bb1_mi365record.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore',
	'Mi365Overview'
], function (
	Mi365WearersModel,
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
		title: "Mi365 Wearer",
		fields: [{
			id: "name",
			label: "Name",
			type: "text",
			mandatory: true,
			list: true
		}, {
			id: "custrecord_bb1_sca_wearer_jobtitle",
			label: "Job Title",
			type: "text",
			mandatory: false
		}, {
			id: "custrecord_bb1_sca_wearer_email",
			label: "EMail",
			type: "text",
			mandatory: false,
			list: true
		}, {
			id: "custrecord_bb1_sca_wearer_phone",
			label: "Main Phone",
			type: "text",
			mandatory: false,
			list: true
		}, {
			id: "custrecord_bb1_sca_wearer_area",
			label: "Area",
			type: "choice",
			mandatory: true,
			list: true,
			url: "Mi365/area/",
			icon: "area"
		}, {
			id: "title",
			label: "Wearer Budget",
			type: "title",
			permission: "budget"
		}, {
			id: "custrecord_bb1_sca_wearer_usebudget",
			label: "Use Budget",
			type: "checkbox",
			permission: "budget"
		}, {
			id: "custrecord_bb1_sca_wearer_budget",
			label: "Budget",
			type: "text",
			mandatory: true,
			permission: "budget"
		}, {
			id: "custrecord_bb1_sca_wearer_duration",
			label: "Duration",
			type: "choice",
			mandatory: true,
			permission: "budget"
		}, {
			id: "custrecord_bb1_sca_wearer_currentspend",
			label: "Current Spend",
			type: "inlinetext",
			mandatory: true,
			permission: "budget"
		}, {
			id: "custrecord_bb1_sca_wearer_startdate",
			label: "Current Start Date",
			type: "inlinetext",
			mandatory: true,
			permission: "budget"
		}],
		initialize: function (options) {
				this.overview = Mi365Overview.get();
				var self = this;
				Mi365Overview.done(function (model) {
					self.overview = model;
					self.render();
				});

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
			'click [data-action="stock"]': 'showStock',
			'click [data-action="rules"]': 'showRules',
			'click [data-action="transfers"]': 'showTransfers'
		},
		showRules: function (e) {
			var wearerId = this.model.get("id");
			Backbone.history.navigate('Mi365/wearer/rule/' + wearerId, {
				trigger: true
			});
		},
		showStock: function (e) {
			var stockId = this.model.get("id");
			Backbone.history.navigate('Mi365/wearer/stock/' + stockId, {
				trigger: true
			});
		},
		showTransfers: function (e) {
			var transferId = this.model.get("id");
			Backbone.history.navigate('Mi365/wearer/transfers/' + transferId, {
				trigger: true
			});
		},
		deleteRecord: function (e) {

			var self = this;
			Tools.showConfirmInModal(this.application, _('Delete Wearer').translate(), _('Please confirm you want to delete this record.').translate(), function () {


			console.log("delete Record");
			var model = new Mi365WearersModel();
			var deleteId = this.model.get("id");

			model.fetch({
				data: {
					id: deleteId,
					task: "delete",
					t: new Date().getTime()
				}
			}).always(function () {
				console.log("deleted " + deleteId);
				Backbone.history.navigate('Mi365/wearers', {
					trigger: true
				});
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
			var allowPlatinum = this.overview.get("level") == "platinum";
			var allowEdit = this.overview.get("custentity_bb1_sca_alloweditwearers") == "T";
			var allowEditBudgets = this.overview.get("custentity_bb1_sca_alloweditbudgets") == "T" && allowPlatinum;
			var allowEditRules = this.overview.get("custentity_bb1_sca_alloweditrules") == "T";
			var newFields = [];

			for (var i = 0; i < this.fields.length; i++) {
				if (!this.fields[i].listonly) {
					if (allowEditBudgets || this.fields[i].permission != "budget") {
						if (this.model.get(this.fields[i].id)) {
							this.fields[i].value = this.model.get(this.fields[i].id);
						}
						if (this.fields[i].type == "choice") {
							var choiceValue = this.fields[i].value;
							for (var j = 0; j < choiceValue.choice.length; j++) {
								if (choiceValue.choice[j].value == choiceValue.value) {
									choiceValue.choice.unshift(choiceValue.choice.splice(j, 1)[0]);
									break;
								}
							}
							this.fields[i].value = choiceValue;
						}
						newFields.push(this.fields[i]);
					}
				}
			}


			return {
				icon: "wearer",
				title: "Wearer",
				model: this.model,
				fields: newFields,
				editable: allowEdit,
				showDelete: allowEdit,
				showStock: allowPlatinum,
				showRules: allowEditRules && allowPlatinum,
				showTransfers: allowPlatinum,
				breadcrumbs: [{
					href: "Mi365/wearers",
					label: "Wearers"
				}],
				active: this.model.get("name")
			};
		}
	});
});