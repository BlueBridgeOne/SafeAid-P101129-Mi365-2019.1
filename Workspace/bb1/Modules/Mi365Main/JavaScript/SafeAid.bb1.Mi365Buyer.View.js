// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Buyer.View', [
	'SafeAid.bb1.Mi365Buyers.Model',
	'safeaid_bb1_mi365record.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore'
], function (
	Mi365BuyersModel,
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
			id: "entityid",
			label: "Name",
			type: "text",
			listonly: true
		}, {
			id: "salutation",
			label: "Mr, Mrs, Ms...",
			type: "text",
			mandatory: false
		}, {
			id: "firstname",
			label: "First Name",
			type: "text",
			mandatory: true
		}, {
			id: "lastname",
			label: "Last Name",
			type: "text",
			mandatory: true
		}, {
			id: "title",
			label: "Job Title",
			type: "text",
			mandatory: false
		}, {
			id: "email",
			label: "EMail",
			type: "text",
			mandatory: true,
			list: true
		}, {
			id: "phone",
			label: "Phone",
			type: "text",
			mandatory: false,
			list: true
		}, {
			id: "custentity_bb1_sca_overridecustomeritems",
			label: "Override Company Items",
			type: "checkbox",
			list: true
		}, {
			id: "custentity_bb1_sca_showstandarditems",
			label: "Show Standard Items",
			type: "checkbox",
			list: true
		}, {
			id: "custentity_bb1_sca_alloweditsettings",
			label: "Allow Edit Settings",
			type: "checkbox"
		}, {
			id: "custentity_bb1_sca_alloweditareas",
			label: "Allow Edit Areas",
			type: "checkbox"
		}, {
			id: "custentity_bb1_sca_alloweditbuyers",
			label: "Allow Edit Buyers",
			type: "checkbox"
		}, {
			id: "custentity_bb1_sca_alloweditwearers",
			label: "Allow Edit Wearers",
			type: "checkbox"
		}, {
			id: "custentity_bb1_sca_alloweditstock",
			label: "Allow Edit Stock",
			type: "checkbox"
		}, {
			id: "custentity_bb1_sca_allowtransferstock",
			label: "Allow Transfer Stock",
			type: "checkbox"
		}, {
			id: "custentity_bb1_sca_alloweditspendrules",
			label: "Allow Edit Spend Rules",
			type: "checkbox"
		}, {
			id: "custentity_bb1_sca_allowviewareas",
			label: "Allow View Areas",
			type: "multichoice"
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
			'change [data-action="multichoice"]': 'changeMultiChoice'
		},
		changeMultiChoice: function (e) {

			var id = e.currentTarget.getAttribute("data-id");
			var parent = jQuery(e.currentTarget).closest("[data-multichoice]");
			var parentId = parent.attr("data-multichoice");
			console.log("change Multi Choice " + id + " " + parentId);
			var selected = [];
			parent.find("[data-id]").each(function () {
				if ($(this).prop('checked')) {
					selected.push($(this).attr("data-id"));
				}
			});
			
			parent.find("#"+parentId).val(selected.join(","));
		},
		deleteRecord: function (e) {

			var self = this;
			Tools.showConfirmInModal(this.application, _('Delete Buyer').translate(), _('Please confirm you want to delete this record.').translate(), function () {

				console.log("delete Record");
				var model = new Mi365BuyersModel();
				var deleteId = self.model.get("id");

				model.fetch({
					data: {
						id: deleteId,
						task: "delete",
						t: new Date().getTime()
					}
				}).always(function () {
					console.log("deleted " + deleteId);
					Backbone.history.navigate('#Mi365/buyers', {
						trigger: true
					});
				});

			});
		},
		showSuccess: function () {
			if (this.$savingForm) {
				Tools.showSuccessInModal(this.application, _('Update Success').translate(), _('This buyer has been successfully updated!').translate());
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
			try {
				//{id:"custentity_bb1_sca_allowviewreports",label:"Allow View Reports",type:"checkbox"};
				for (var i = 0; i < this.fields.length; i++) {
					if (!this.fields[i].listonly) {
						if (this.model.get(this.fields[i].id)) {
							this.fields[i].value = this.model.get(this.fields[i].id);
						}

						if (this.fields[i].type == "multichoice") {
							console.log(this.fields[i]);
							var choiceValue = this.fields[i].value.value.split(',');

							var hchoiceValue = {};
							for (var j = 0; j < choiceValue.length; j++) {
								hchoiceValue[choiceValue[j]] = true;
							}

							for (var j = 0; j < this.fields[i].value.choice.length; j++) {

								if (hchoiceValue[this.fields[i].value.choice[j].value]) {
									this.fields[i].value.choice[j].selected = true;
								}
							}
						}

					}
				}
			} catch (err) {
				console.log(err);
			}
			var allowEdit = this.overview.get("custentity_bb1_sca_alloweditbuyers") == "T";
			if (this.overview.get("id") == this.model.get("id")) {
				allowEdit = false; // You can't edit yourself.
			}


			return {
				title: "Buyer",
				model: this.model,
				fields: this.fields || [],
				editable: allowEdit,
				showDelete: allowEdit,
				breadcrumbs: [{
					href: "Mi365/buyers",
					label: "Buyers"
				}],
				active: this.model.get("entityid")
			};
		}
	});
});