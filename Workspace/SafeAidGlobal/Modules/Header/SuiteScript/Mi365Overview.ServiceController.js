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
			}, {
				id: "custentity_bb1_sca_alloweditstock",
				label: "Allow Edit Stock",
				type: "checkbox"
			}, {
				id: "custentity_bb1_sca_allowtransferstock",
				label: "Allow Transfer Stock",
				type: "checkbox"
			}, {
				id: "custentity_bb1_sca_alloweditbudgets",
				label: "Allow Edit Budgets",
				type: "checkbox"
			}, {
				id: "custentity_bb1_sca_alloweditrules",
				label: "Allow Edit Rules",
				type: "checkbox"
			}, {
				id: "custentity_bb1_sca_allowapproveorders",
				label: "Allow Approve Orders",
				type: "checkbox"
			}, {
				id: "custentity_bb1_sca_requiresapproval",
				label: "Requires Approval",
				type: "choice"
			}, {
				id: "custentity_bb1_sca_allowviewbalance",
				label: "Allow View Balance",
				type: "checkbox"
			}, {
				id: "custentity_bb1_sca_usebudget",
				label: "Use Budget",
				type: "checkbox"
			}, {
				id: "custentity_bb1_sca_usebudget",
				label: "Use Budget",
				type: "checbox"
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
				var muteerrors = request.getParameter("muteerrors");
				var custentity_bb1_sca_membership = 1;
				if (!(contact > 0)) {
					if (muteerrors) {

						return {
							id: contact,
							level: "bronze",
							custentity_bb1_sca_membership: custentity_bb1_sca_membership,
							alerts: 0
						};

					} else {
						throw (new Error("Please sign-in to view this information."));
					}
				}
				var customer = context.getUser();
				nlapiLogExecution("debug", "context", context.getUser() + " " + context.getCompany() + " " + context.getEmail() + " " + context.getName() + " " + context.getContact());

				var custom;
				if (customer) {

					try {


						custom = nlapiGetWebContainer().getShoppingSession().getCustomer().getCustomFieldValues();


						custentity_bb1_sca_membership = nlapiLookupField('customer', customer, 'custentity_bb1_sca_membership');
					} catch (err) {
						try {
							custentity_bb1_sca_membership = nlapiLookupField('lead', customer, 'custentity_bb1_sca_membership');
						} catch (err2) {

						}
					}
				}
				var membership_level = "bronze";
				switch (custentity_bb1_sca_membership.toString()) {
					case "2":
						membership_level = "silver";
						break;
					case "3":
						membership_level = "gold";
						break;
					case "4":
						membership_level = "platinum";
						break;
				}
				
				nlapiLogExecution("debug", "membership", customer + " " + custentity_bb1_sca_membership);

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
				if (contactSearch) {
					for (var i = 0; i < contactSearch.length; i++) {
						result = contactSearch[i];
						data = {
							id: result.getId(),
							level: membership_level,
							custentity_bb1_sca_membership: custentity_bb1_sca_membership

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
						break;
					}
				}

				if (results.length > 0) {
					var res = results[0];



					var filter = [
						["custrecord_bb1_sca_alert_buyer", "anyof", contact],
						"AND",
						["isinactive", "is", "F"]
					];
					var find = [new nlobjSearchColumn("created")];

					var contactSearch = nlapiSearchRecord("customrecord_bb1_sca_alert", null,
						filter,
						find
					);
					var result, results = [],
						data;
					res.alerts = contactSearch ? contactSearch.length : 0;

					return res;
				} else {
					return {
						id: contact,
						level: membership_level,
						custentity_bb1_sca_membership: custentity_bb1_sca_membership,
						alerts: 0
					};
				}


			}

		});
	}
);