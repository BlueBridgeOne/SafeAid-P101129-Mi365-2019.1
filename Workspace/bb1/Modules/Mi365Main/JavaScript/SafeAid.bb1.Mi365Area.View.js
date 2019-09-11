// @module SafeAid.bb1.Mi365Main
define('SafeAid.bb1.Mi365Area.View', [
	'SafeAid.bb1.Mi365Areas.Model',
	'safeaid_bb1_mi365record.tpl',
	'Utils',
	'Backbone',
	'Tools', 'Backbone.FormView',
	'jQuery',
	'underscore'
], function (
	Mi365AreasModel,
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
			id: "name",
			label: "Name",
			type: "text",
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

			,
		events: {
			'submit form': 'saveForm',
			'click [data-action="delete"]': 'deleteRecord',
			'click [data-action="stock"]': 'showStock',
			'click [data-action="transfers"]': 'showTransfers',
			'click [data-action="wearers"]': 'showWearers'
		},
		showStock: function (e) {
			var stockId = this.model.get("id");
			Backbone.history.navigate('#Mi365/area/stock/' + stockId, {
				trigger: true
			});
		},
		showTransfers: function (e) {
			var transferId = this.model.get("id");
			Backbone.history.navigate('#Mi365/area/transfers/' + transferId, {
				trigger: true
			});
		},
		showWearers: function (e) {
			var areaId = this.model.get("id");
			Backbone.history.navigate('#Mi365/area/wearers/' + areaId, {
				trigger: true
			});
		},
		deleteRecord: function (e) {
			var self=this;
			Tools.showConfirmInModal(this.application, _('Delete Area').translate(), _('Please confirm you want to delete this record.').translate(), function () {

				console.log("delete Record");
				var model = new Mi365AreasModel();
				var deleteId = self.model.get("id");

				model.fetch({
					data: {
						id: deleteId,
						task: "delete",
						t: new Date().getTime()
					}
				}).always(function () {
					console.log("deleted " + deleteId);
					Backbone.history.navigate('#Mi365/areas', {
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
			var allowEdit=this.overview.get("custentity_bb1_sca_alloweditareas")=="T";
			
			//{id:"custentity_bb1_sca_allowviewreports",label:"Allow View Reports",type:"checkbox"};
			for (var i = 0; i < this.fields.length; i++) {
				if (!this.fields[i].listonly) {
					if (this.model.get(this.fields[i].id)) {
						this.fields[i].value = this.model.get(this.fields[i].id);
					}
				}
			}
			return {
				title: "Area",
				model: this.model,
				fields: this.fields || [],
				editable: allowEdit,
				showDelete: allowEdit,
				showStock: true,
				showTransfers: true,
				showWearers: true,
				breadcrumbs: [{
					href: "#Mi365/wearers",
					label: "Areas"
				}],
				active: this.model.get("name")
			};
		}
	});
});