define(
	'SafeAid.bb1.Mi365Alerts.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Alerts.ServiceController',
			recordtype: "customrecord_bb1_sca_alert",
			fields: [{
					id: "created",
					label: "Date",
					type: "text",
					listonly: true
				}, {
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
				}
			],

			// The values in this object are the validation needed for the current service.

			options: {
				common: {}
			}

			,
			get: function get() {
					nlapiLogExecution("debug", "SafeAid.bb1.Mi365Alerts.ServiceController.get " + request);
					var shoppingSession = nlapiGetWebContainer().getShoppingSession();
					
					var context = nlapiGetContext();
					var contact = context.getContact();
					if(!(contact>0)){
						throw(new Error("Please sign-in to view this information."));
					}
					var customer = context.getUser();
					nlapiLogExecution("debug", "context", "id=" + id + " " + context.getUser() + " " + context.getCompany() + " " + context.getEmail() + " " + context.getName() + " " + context.getContact());

					var task = request.getParameter("task");
					var id = request.getParameter("id");
					if (task == "delete") {
						
							var rec = nlapiLoadRecord(this.recordtype, id);
							rec.setFieldValue("isinactive", "T");
							nlapiSubmitRecord(rec, true, true);

					} else if (task == "clear") {
						

								var filter = [
									["custrecord_bb1_sca_alert_buyer", "anyof", contact],
									"AND",
									["isinactive", "is", "F"]
								];
								var find = [new nlobjSearchColumn("internalid")];
								var contactSearch = nlapiSearchRecord(this.recordtype, null,
									filter,
									find
								);
								if(contactSearch){
									var result;
									for (var i = 0; i < contactSearch.length; i++) {
										result = contactSearch[i];
										nlapiSubmitField(this.recordtype, result.getId(), "isinactive", "T",false); 
									}
								}
							
						
					}




					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getFieldValues()));
					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getCustomFields()));

					

						var filter = [
							["custrecord_bb1_sca_alert_buyer", "anyof", contact],
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
						if (contactSearch) {
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
								throw (new Error("The alert could not found."));
							}
						} else {
							return results;
						}
					
				}

				,
			post: function post() {
				var shoppingSession = nlapiGetWebContainer().getShoppingSession();
				
				var context = nlapiGetContext();
				var contact = context.getContact();
				if(!(contact>0)){
					throw(new Error("Please sign-in to view this information."));
				}
				var customer = context.getUser();
				nlapiLogExecution("debug", "context", "id=" + id + " " + context.getUser() + " " + context.getCompany() + " " + context.getEmail() + " " + context.getName() + " " + context.getContact());


				var id = request.getParameter("id");

				
					var rec = nlapiLoadRecord(this.recordtype, this.data.id);

					for (var j = 0; j < this.fields.length; j++) {
						if (this.data[this.fields[j].id] && !this.fields[j].listonly) {
							rec.setFieldValue(this.fields[j].id, this.data[this.fields[j].id]);
						}
					}
					nlapiSubmitRecord(rec, true, true);
				
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