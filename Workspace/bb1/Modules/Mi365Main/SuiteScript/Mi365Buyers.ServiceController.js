define(
	'SafeAid.bb1.Mi365Buyers.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Buyers.ServiceController',
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
				id: "custentity_bb1_sca_alloweditspendrules",
				label: "Allow Edit Spend Rules",
				type: "checkbox"
			}],

			// The values in this object are the validation needed for the current service.

			options: {
				common: {}
			}

			,
			get: function get() {
					//nlapiLogExecution("debug", "SafeAid.bb1.Mi365Buyers.ServiceController.get "+request);
					var shoppingSession = nlapiGetWebContainer().getShoppingSession();
					var customer = shoppingSession.getCustomer();
					var context = nlapiGetContext();
					var contact = context.getContact();
					var customer = context.getUser();
					nlapiLogExecution("debug", "context", "id=" + id + " " + context.getUser() + " " + context.getCompany() + " " + context.getEmail() + " " + context.getName() + " " + context.getContact());
					
					var task = request.getParameter("task");
					var id = request.getParameter("id");
					if(task=="new"){
						if (contact > 0) {
							var rec=nlapiCreateRecord(this.recordtype);
							
							rec.setFieldValue("company",customer);
							rec.setFieldValue("custentity_bb1_sca_buyer","T");
							rec.setFieldValue("firstname","Buyer");
							rec.setFieldValue("lastname","#"+Math.floor(Math.random()*1000000));
							id=nlapiSubmitRecord(rec, true, true);
							
							rec=nlapiLoadRecord(this.recordtype, id);
							rec.setFieldValue("lastname","#"+id);
							nlapiSubmitRecord(rec, true, true);
							
						}
					}else if(task=="delete"){
						if (contact > 0) {
							var rec = nlapiLoadRecord(this.recordtype, id);
							rec.setFieldValue("custentity_bb1_sca_buyer","F");
							nlapiSubmitRecord(rec, true, true);
						
						}
					}

					
					

					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getFieldValues()));
					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getCustomFields()));
					
					if (contact > 0) {

						var filter = [
							["custentity_bb1_sca_buyer", "is", "T"],
							"AND",
							["company", "anyof", customer],
							"AND",
							["isinactive", "is", "F"]
						];
						var find = [];
						for (var j = 0; j < this.fields.length; j++) {
							if (this.fields[j].list || this.fields[j].listonly || id) {
								find.push(new nlobjSearchColumn(this.fields[j].id));
							}
						}

						if (id) {
							filter.unshift("AND");
							filter.unshift(["internalid", "is", id]);
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
								id: result.getId()
							};

							for (var j = 0; j < this.fields.length; j++) {
								if (this.fields[j].list || this.fields[j].listonly || id) {
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
							}

							results.push(data);
						}
					}
						if (id) {
							if (results.length > 0) {
								return results[0];
							} else {
								throw (new Error("The buyer could not found."));
							}
						} else {
							return results;
						}
					} else {
						throw (new Error("Not logged in."));
					}
				}

				,
			post: function post() {
				var shoppingSession = nlapiGetWebContainer().getShoppingSession();
					var customer = shoppingSession.getCustomer();
					var context = nlapiGetContext();
					var contact = context.getContact();
					var customer = context.getUser();
					nlapiLogExecution("debug", "context", "id=" + id + " " + context.getUser() + " " + context.getCompany() + " " + context.getEmail() + " " + context.getName() + " " + context.getContact());
					

				var id = request.getParameter("id");
				
				if (contact > 0) {
					var rec = nlapiLoadRecord(this.recordtype, this.data.id);

					for (var j = 0; j < this.fields.length; j++) {
						if (this.data[this.fields[j].id] && !this.fields[j].listonly) {
							rec.setFieldValue(this.fields[j].id, this.data[this.fields[j].id]);
						}
					}
					nlapiSubmitRecord(rec, true, true);
				}
				return {
					ok: true
				}
			},
			put: function put() {

			},
			delete: function () {
				// not implemented
			}
		});
	}
);