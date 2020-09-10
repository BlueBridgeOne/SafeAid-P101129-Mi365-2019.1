define(
	'SafeAid.bb1.Mi365Areas.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Areas.ServiceController',
			recordtype: "customrecord_bb1_sca_area",
			fields: [{
				id: "name",
				label: "Name",
				type: "text",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_area_usebudget",
				label: "Use Budget",
				type: "checkbox",
				permission: "budget"
			}, {
				id: "custrecord_bb1_sca_area_budget",
				label: "Budget",
				type: "text",
				mandatory: true,
				permission: "budget"
			}, {
				id: "custrecord_bb1_sca_area_duration",
				label: "Duration",
				type: "choice",
				mandatory: true,
				permission: "budget"
			}, {
				id: "custrecord_bb1_sca_area_currentspend",
				label: "Current Spend",
				type: "inlinetext",
				mandatory: true,
				permission: "budget"
			}, {
				id: "custrecord_bb1_sca_area_startdate",
				label: "Current Start Date",
				type: "inlinetext",
				mandatory: true,
				permission: "budget"
			}],

			// The values in this object are the validation needed for the current service.

			options: {
				common: {}
			}

			,
			get: function get() {
					nlapiLogExecution("debug", "SafeAid.bb1.Mi365Areas.ServiceController.get " + request);
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
					if (task == "new") {

						var rec = nlapiCreateRecord(this.recordtype);

						rec.setFieldValue("custrecord_bb1_sca_area_company", customer);
						rec.setFieldValue("name", "Area #" + Math.floor(Math.random() * 1000000));
						id = nlapiSubmitRecord(rec, true, true);

						rec = nlapiLoadRecord(this.recordtype, id);
						rec.setFieldValue("name", "Area #" + id);
						nlapiSubmitRecord(rec, true, true);


					} else if (task == "delete") {

						var rec = nlapiLoadRecord(this.recordtype, id);
						rec.setFieldValue("isinactive", "T");
						nlapiSubmitRecord(rec, true, true);


					}


					var custentity_bb1_sca_allowviewareas = nlapiLookupField('contact', contact, 'custentity_bb1_sca_allowviewareas');
					if (custentity_bb1_sca_allowviewareas == null) {
						custentity_bb1_sca_allowviewareas = "0";
					}
					var allowAreas = custentity_bb1_sca_allowviewareas.split(",") || [];
					if (task == "new") {
						try{
						allowAreas.push(id);
						nlapiSubmitField('contact', contact, 'custentity_bb1_sca_allowviewareas', allowAreas, false);
						}catch(err){
							nlapiLogExecution("debug","error",err.toString());
						}
					}
					allowAreas.push("@NONE@");
					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getFieldValues()));
					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getCustomFields()));



					var filter = [
						["internalidnumber", "greaterthan", 0],
						"AND",
						["custrecord_bb1_sca_area_company", "anyof", customer],
						"AND",
						["isinactive", "is", "F"]

					];
					var find = [];
					var internalid = new nlobjSearchColumn('internalid').setSort(false); //
					find.push(internalid);
					for (var j = 0; j < this.fields.length; j++) {
						if (this.fields[j].list || this.fields[j].listonly || id) {
							find.push(new nlobjSearchColumn(this.fields[j].id));
						}
					}

					if (id) {
						var found = false;
						for (var i = 0; i < allowAreas.length; i++) {
							if (allowAreas[i] == id) {
								found = true;
								break;
							}
						}
						if (!found) {
							throw (new Error("You do not have permission to view this area."));

						}
						filter.unshift("AND");
						filter.unshift(["internalid", "is", id]);
					} else {
						filter.unshift("AND");
						filter.unshift(["internalid", "anyof", allowAreas]);
					}
					var contactSearch = nlapiSearchRecord(this.recordtype, null,
						filter,
						find
					);
					var result, results = [],
						data;
					if (contactSearch) {
						do {
							var lastid;

							for (var i = 0; i < contactSearch.length; i++) {
								result = contactSearch[i];
								data = {
									id: result.getId()
								};

								for (var j = 0; j < this.fields.length; j++) {
									if (this.fields[j].list || this.fields[j].listonly || id) {
										find.push(new nlobjSearchColumn(this.fields[j].id));
										if (this.fields[j].type == "record" || this.fields[j].type == "choice") {
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

									data.custrecord_bb1_sca_area_duration.choice = [{
										value: "1",
										text: "Per Month"
									}, {
										value: "2",
										text: "Per Quarter"
									}, {
										value: "3",
										text: "Per Year"
									}];
								}

								results.push(data);
								lastid = result.getValue("internalid");
							}
							if (contactSearch.length < 1000) {
								break;
							}
							filter[0] = ["internalidnumber", "greaterthan", lastid];
							contactSearch = nlapiSearchRecord(this.recordtype, null,
								filter,
								find
							);
						} while (true);
					}
					if (id) {
						if (results.length > 0) {
							return results[0];
						} else {
							throw (new Error("The area could not be found or is not allowed to be viewed."));
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
				if (!(contact > 0)) {
					throw (new Error("Please sign-in to view this information."));
				}
				var customer = context.getUser();
				nlapiLogExecution("debug", "context", "id=" + id + " " + context.getUser() + " " + context.getCompany() + " " + context.getEmail() + " " + context.getName() + " " + context.getContact());


				var id = request.getParameter("id");


				var rec = nlapiLoadRecord(this.recordtype, this.data.id);
				var value;
				for (var j = 0; j < this.fields.length; j++) {
					value = this.data[this.fields[j].id];
					if (value && !this.fields[j].listonly) {
						try {
							if (this.fields[j].type == "checkbox") {
								rec.setFieldValue(this.fields[j].id, value ? value : false);
							} else if (value && value.value) {
								rec.setFieldValue(this.fields[j].id, value.value);
							} else {
								rec.setFieldValue(this.fields[j].id, value);
							}
						} catch (e) {
							nlapiLogExecution("debug", "update area", "unable to set " + this.fields[j].id + " to " + value + ". " + e);
						}
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