define(
	'SafeAid.bb1.Mi365Overview.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Overview.ServiceController',
			recordtype: "contact",
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
			},{
				id: "custentity_bb1_sca_alloweditstock",
				label: "Allow Edit Stock",
				type: "checkbox"
			},{
				id: "custentity_bb1_sca_allowtransferstock",
				label: "Allow Transfer Stock",
				type: "checkbox"
			},  {
				id: "custentity_bb1_sca_alloweditbudgets",
				label: "Allow Edit Budgets",
				type: "checkbox"
			}, {
				id: "custentity_bb1_sca_budget",
				label: "Budget",
				type: "text",
				mandatory: true
			}, {
				id: "custentity_bb1_sca_duration",
				label: "Duration",
				type: "choice",
				mandatory: true
			}, {
				id: "custentity_bb1_sca_currentspend",
				label: "Current Spend",
				type: "inlinetext"
			}, {
				id: "custentity_bb1_sca_startdate",
				label: "Current Start Date",
				type: "inlinetext"
			}],

			// The values in this object are the validation needed for the current service.

			options: {
				common: {}
			}

			,
			get: function get() {
					//nlapiLogExecution("debug", "SafeAid.bb1.Mi365Buyers.ServiceController.get "+request);
					var shoppingSession = nlapiGetWebContainer().getShoppingSession();
					
					var context = nlapiGetContext();
					var contact = context.getContact();
					if(!(contact>0)){
						throw(new Error("Please sign-in to view this information."));
					}
					var customer = context.getUser();
					nlapiLogExecution("debug", "context", context.getUser() + " " + context.getCompany() + " " + context.getEmail() + " " + context.getName() + " " + context.getContact());
					

						var filter = [
							["custentity_bb1_sca_buyer", "is", "T"],
							"AND",
							["company", "anyof", customer],
							"AND",
							["isinactive", "is", "F"],
							"AND",
							["internalid", "is", contact]
						];
						var find = [];
						for (var j = 0; j < this.fields.length; j++) {
							
								find.push(new nlobjSearchColumn(this.fields[j].id));
							
						}
						
						var contactSearch = nlapiSearchRecord(this.recordtype, null,
							filter,
							find
						);
						var result, results = [],
							data;
							if(contactSearch){
						for (var i = 0; i < contactSearch.length; i++) {
							result = contactSearch[i];
							data = {
								id: result.getId(),
								level:"silver"
							};

							for (var j = 0; j < this.fields.length; j++) {
								
									find.push(new nlobjSearchColumn(this.fields[j].id));
									if (this.fields[j].type == "record") {
										data[this.fields[j].id] = {
											value: result.getValue(this.fields[j].id),
											text: result.getText(this.fields[j].id)
										};
									} else {
										data[this.fields[j].id] = result.getValue(this.fields[j].id);
									}
								
							}

							results.push(data);
						}
					}
						
							if (results.length > 0) {
								return results[0];
							} else {
								return {
									id: contact,
									level:"bronze"
								};
							}
						
					
				}

		});
	}
);