define(
	'SafeAid.bb1.Mi365Transfers.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Transfers.ServiceController',
			recordtype: "customrecord_bb1_sca_companystocktrans",
			fields: [{
				id: "created",
				label: "Date",
				type: "text",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_costocktrans_item",
				label: "Item",
				type: "record",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_costocktrans_area",
				label: "From Area",
				type: "record",
				mandatory: true,
				list: true,
				url: "Mi365/area/",
				icon:"area"
			}, {
				id: "custrecord_bb1_sca_costocktrans_wearer",
				label: "To Wearer",
				type: "record",
				mandatory: true,
				list: true,
				url: "Mi365/wearer/",
				icon:"wearer"
			}, {
				id: "custrecord_bb1_sca_costocktrans_quantity",
				label: "Quantity",
				type: "text",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_costocktrans_confirme",
				label: "Confirmed",
				type: "checkbox",
				list: true
			}, {
				id: "custrecord_bb1_sca_costocktrans_confname",
				label: "Confirmed By",
				type: "text"
			}, {
				id: "custrecord_bb1_sca_costocktrans_confdate",
				label: "Confirmed Date",
				type: "text"
			}, {
				id: "custrecord_bb1_sca_costocktrans_sign",
				label: "Signature",
				type: "signature"
			}],

			// The values in this object are the validation needed for the current service.

			options: {
				common: {}
			}

			,
			get: function get() {
					nlapiLogExecution("debug", "SafeAid.bb1.Mi365Transfers.ServiceController.get " + request);
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
					var wearer = request.getParameter("wearer");
					var area = request.getParameter("area");


					var custentity_bb1_sca_allowviewareas = nlapiLookupField('contact', contact, 'custentity_bb1_sca_allowviewareas');
				if(custentity_bb1_sca_allowviewareas==null){
					custentity_bb1_sca_allowviewareas="0";
				}
				var allowAreas = custentity_bb1_sca_allowviewareas.split(",");	

					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getFieldValues()));
					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getCustomFields()));



					var filter = [
						["isinactive", "is", "F"]
					];

					if (wearer) {
						filter.unshift("AND");
						filter.unshift(["custrecord_bb1_sca_costocktrans_wearer", "anyof", wearer]);
					} else if (area) {

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
						filter.unshift(["custrecord_bb1_sca_costocktrans_area", "anyof", area]);
					}else{
						filter.unshift("AND");
						filter.unshift(["custrecord_bb1_sca_costocktrans_area", "anyof", allowAreas]);
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
					nlapiLogExecution("debug", "find", JSON.stringify(find));
					nlapiLogExecution("debug", "filter", JSON.stringify(filter));
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
				nlapiLogExecution("debug", "data", JSON.stringify(this.data));


				var id = request.getParameter("id");


				var rec = nlapiLoadRecord(this.recordtype, this.data.id);

				
				//Update fields
				for (var j = 0; j < this.fields.length; j++) {
					if (this.data[this.fields[j].id] && !this.fields[j].listonly) {
						if (this.fields[j].type == "record") {
							rec.setFieldValue(this.fields[j].id, this.data[this.fields[j].id].value||this.data[this.fields[j].id]);
						} else {
							rec.setFieldValue(this.fields[j].id, this.data[this.fields[j].id]);
						}
					}
				}
				//Check if somebody signed.
				for (var j = 0; j < this.fields.length; j++) {
					if (this.fields[j].id == "custrecord_bb1_sca_costocktrans_sign" && this.data[this.fields[j].id]) {
						rec.setFieldValue("custrecord_bb1_sca_costocktrans_confirme", "T");
						rec.setFieldValue("custrecord_bb1_sca_costocktrans_confdate", new Date());
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