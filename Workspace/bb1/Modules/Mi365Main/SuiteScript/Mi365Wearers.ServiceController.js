define(
	'SafeAid.bb1.Mi365Wearers.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Wearers.ServiceController',
			recordtype: "customrecord_bb1_sca_wearer",
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
				type: "record",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_wearer_usebudget",
				label: "Use Budget",
				type: "checkbox",
				permission:"budget"
			},{
				id: "custrecord_bb1_sca_wearer_budget",
				label: "Budget",
				type: "text",
				mandatory:true,
				permission:"budget"
			}, {
				id: "custrecord_bb1_sca_wearer_duration",
				label: "Duration",
				type: "choice",
				mandatory:true,
				permission:"budget"
			}, {
				id: "custrecord_bb1_sca_wearer_currentspend",
				label: "Current Spend",
				type: "inlinetext",
				mandatory:true,
				permission:"budget"
			}, {
				id: "custrecord_bb1_sca_wearer_startdate",
				label: "Current Start Date",
				type: "inlinetext",
				mandatory:true,
				permission:"budget"
			}],

			// The values in this object are the validation needed for the current service.

			options: {
				common: {}
			}

			,
			get: function get() {
					nlapiLogExecution("debug", "SafeAid.bb1.Mi365Wearers.ServiceController.get " + request);
					var shoppingSession = nlapiGetWebContainer().getShoppingSession();

					var context = nlapiGetContext();
					var contact = context.getContact();
					if (!(contact > 0)) {
						throw (new Error("Please sign-in to view this information."));
					}
					var customer = context.getUser();
					nlapiLogExecution("debug", "context", "id=" + id + " " + context.getUser() + " " + context.getCompany() + " " + context.getEmail() + " " + context.getName() + " " + context.getContact());

					var task = request.getParameter("task");
					var id = request.getParameter("id");
					var area = request.getParameter("area");
					if (task == "new") {

						var rec = nlapiCreateRecord(this.recordtype);

						rec.setFieldValue("custrecord_bb1_sca_wearer_customer", customer);
						rec.setFieldValue("name", "Wearer #" + Math.floor(Math.random() * 1000000));
						id = nlapiSubmitRecord(rec, true, true);

						rec = nlapiLoadRecord(this.recordtype, id);
						rec.setFieldValue("name", "Wearer #" + id);
						nlapiSubmitRecord(rec, true, true);


					} else if (task == "delete") {

						var rec = nlapiLoadRecord(this.recordtype, id);
						rec.setFieldValue("isinactive", "T");
						nlapiSubmitRecord(rec, true, true);


					}
					var custentity_bb1_sca_allowviewareas = nlapiLookupField('contact', contact, 'custentity_bb1_sca_allowviewareas');
				if(custentity_bb1_sca_allowviewareas==null){
					custentity_bb1_sca_allowviewareas="0";
				}
				var allowAreas = custentity_bb1_sca_allowviewareas.split(",")||[];	
				allowAreas.push("@NONE@");



					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getFieldValues()));
					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getCustomFields()));

					if (customer > 0) {

						var filter = [
							["custrecord_bb1_sca_wearer_customer", "anyof", customer],
							"AND",
							["isinactive", "is", "F"]
						];

						if (area) {

							var found = false;
							for (var i = 0; i < allowAreas.length; i++) {
								if (allowAreas[i] == area) {
									found = true;
									break;
								}
							}
							if (!found) {
								throw (new Error("You do not have permission to view this area."));
							}

							filter.unshift("AND");
							filter.unshift(["custrecord_bb1_sca_wearer_area", "anyof", area]);
						}else{
							filter.unshift("AND");
							filter.unshift(["custrecord_bb1_sca_wearer_area", "anyof", allowAreas]);
							
						}

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
						// nlapiLogExecution("debug", "filter ", JSON.stringify(filter));
						// nlapiLogExecution("debug", "find ", JSON.stringify(find));
						// nlapiLogExecution("debug", "this.recordtype ", this.recordtype);

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
										if (this.fields[j].type == "record"||this.fields[j].type == "choice") {
											data[this.fields[j].id] = {
												value: result.getValue(this.fields[j].id),
												text: result.getText(this.fields[j].id)
											};
										} else {
											data[this.fields[j].id] = result.getValue(this.fields[j].id);
										}
									}
								}

								if (id) { //add choices

									data.custrecord_bb1_sca_wearer_duration.choice = [{
										value: "1",
										text: "Per Month"
									}, {
										value: "2",
										text: "Per Quarter"
									}, {
										value: "3",
										text: "Per Year"
									}];

									data.custrecord_bb1_sca_wearer_area.choice = [];

									filter = [
										["isinactive", "is", "F"],
										"AND",
										["custrecord_bb1_sca_area_company", "is", customer]

									];

									find = [];
									find.push(new nlobjSearchColumn("name"));



									var areaSearch = nlapiSearchRecord("customrecord_bb1_sca_area", null,
										filter,
										find
									);
									var wresult;
									if (areaSearch) {

										for (var j = 0; j < areaSearch.length; j++) {
											wresult = areaSearch[j];
											data.custrecord_bb1_sca_wearer_area.choice.push({
												value: wresult.getId(),
												text: wresult.getValue("name")
											});
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
								throw (new Error("The wearer could not be found or is not allowed to be viewed."));
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

				var context = nlapiGetContext();
				var contact = context.getContact();
				if (!(contact > 0)) {
					throw (new Error("Please sign-in to view this information."));
				}
				var customer = context.getUser();
				nlapiLogExecution("debug", "context", "id=" + id + " " + context.getUser() + " " + context.getCompany() + " " + context.getEmail() + " " + context.getName() + " " + context.getContact());


				var id = request.getParameter("id");

				if (customer > 0) {
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