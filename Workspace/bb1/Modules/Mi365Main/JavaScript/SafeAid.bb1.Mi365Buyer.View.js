// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Buyer.View', [
	'safeaid_bb1_mi365buyer.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore'
], function (
	safeaid_bb1_mi365buyer_tpl,
	Utils,
	Backbone,
	Tools,
	BackboneFormView,
	jQuery,
	_
) {
	'use strict';


	return Backbone.View.extend({

		template: safeaid_bb1_mi365buyer_tpl,
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
			id: "custentity_bb1_sca_alloweditspendrules",
			label: "Allow Edit Spend Rules",
			type: "checkbox"
		}],
		initialize: function (options) {

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
		showSuccess: function () {
			if (this.$savingForm) {
				Tools.showSuccessInModal(this.application,_('Update Success').translate(),_('This buyer has been successfully updated!').translate());
			}
		},
		showError: function (err) {
			if (this.$savingForm) {
				Tools.showErrorInModal(this.application,_('Update Failed!').translate(),_(err).translate());
			}
		},
		childViews: {}
		//@method getContext @return SafeAid.bb1.Mi365Main.View.Context
		,
		getContext: function getContext() {

			//{id:"custentity_bb1_sca_allowviewreports",label:"Allow View Reports",type:"checkbox"};
			for (var i = 0; i < this.fields.length; i++) {
				if (!this.fields[i].listonly) {
					if (this.model.get(this.fields[i].id)) {
						this.fields[i].value = this.model.get(this.fields[i].id);
					}
				}
			}
			return {
				model: this.model,
				fields: this.fields || []
			};
		}
	});
});