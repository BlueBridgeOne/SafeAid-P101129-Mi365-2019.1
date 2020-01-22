// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Alert.View', [
	'SafeAid.bb1.Mi365Alerts.Model',
	'safeaid_bb1_mi365record.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore'
], function (
	Mi365AlertsModel,
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

		template: safeaid_bb1_mi365record_tpl
		,title:"Mi365 Alert"
		,fields: [{
			id: "created",
			label: "Date",
			type: "text",
			listonly: true
		},{
			id: "custrecord_bb1_sca_alert_message",
			label: "Message",
			type: "text",
			list: true
		},
		{
			id: "custrecord_bb1_sca_alert_transaction",
			label: "Transaction",
			type: "record",
			list: false
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
			'submit form': 'saveForm',
			'click [data-action="delete"]': 'deleteRecord'
		},
		deleteRecord: function (e) {
			console.log("delete Record");
			var model = new Mi365AlertsModel();
var deleteId=this.model.get("id");

			model.fetch({
				data: {
					id: deleteId,
					task: "delete",
					t: new Date().getTime()
				}
			}).always(function () {
				console.log("deleted " + deleteId);
				Backbone.history.navigate('Mi365/alerts', {
					trigger: true
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
			
			//{id:"custentity_bb1_sca_allowviewreports",label:"Allow View Reports",type:"checkbox"};
			for (var i = 0; i < this.fields.length; i++) {
				if (!this.fields[i].listonly) {
					if (this.model.get(this.fields[i].id)) {
						this.fields[i].value = this.model.get(this.fields[i].id);
					}
				}
			}
			return {
				icon:"alert",
				title:"Alert",
				model: this.model,
				fields: this.fields || [],
				editable:false,
				breadcrumbs:[{href:"Mi365/alerts",label:"Alerts"}],
				active:this.model.get("created")
			};
		}
	});
});