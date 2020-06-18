define(
	'SafeAid.bb1.Mi365Rules.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Rules.ServiceController',
			recordtype: "customrecord_bb1_sca_rule",
			fields: [{
				id: "custrecord_bb1_sca_rule_item",
				label: "Item",
				type: "record",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_rule_area",
				label: "Area",
				type: "record",
				list: true,
				mandatory: true,
				url: "Mi365/area/",
				icon: "area"
			}, {
				id: "custrecord_bb1_sca_rule_wearer",
				label: "Wearer",
				type: "record",
				list: true,
				mandatory: true,
				url: "Mi365/wearer/",
				icon: "wearer"
			}, {
				id: "custrecord_bb1_sca_rule_quantity",
				label: "Quantity",
				type: "text",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_rule_duration",
				label: "Duration",
				type: "choice",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_rule_purchased",
				label: "Current Purchased",
				type: "inlinetext"
			}, {
				id: "custrecord_bb1_sca_rule_startdate",
				label: "Current Start Date",
				type: "inlinetext"
			}],

			// The values in this object are the validation needed for the current service.

			options: {
				common: {}
			}

			,
			get: function get() {
					nlapiLogExecution("debug", "SafeAid.bb1.Mi365Rules.ServiceController.get " + request);
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
					if (custentity_bb1_sca_allowviewareas == null) {
						custentity_bb1_sca_allowviewareas = "0";
					}
					var allowAreas = custentity_bb1_sca_allowviewareas.split(",")||[];
					allowAreas.push("@NONE@");
					
					if (task == "new") {

						var rec = nlapiCreateRecord(this.recordtype);
						if (wearer) {
							rec.setFieldValue("custrecord_bb1_sca_rule_wearer", wearer);

							var wearer_area = nlapiLookupField('customrecord_bb1_sca_wearer', wearer, 'custrecord_bb1_sca_wearer_area');
							if(wearer_area){
								rec.setFieldValue("custrecord_bb1_sca_rule_area", wearer_area);
								}
						} else if (area) {
							rec.setFieldValue("custrecord_bb1_sca_rule_area", area);
						}

						id = nlapiSubmitRecord(rec, true, true);



					} else if (task == "delete") {

						var rec = nlapiLoadRecord(this.recordtype, id);
						rec.setFieldValue("isinactive", "T");
						nlapiSubmitRecord(rec, true, true);


					}

					var filter = [
						["isinactive", "is", "F"]
					];

					if (wearer) {
						filter.unshift("AND");
						filter.unshift(["custrecord_bb1_sca_rule_wearer", "anyof", wearer]);
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
						filter.unshift(["custrecord_bb1_sca_rule_area", "anyof", area]);

					} else {
						filter.unshift("AND");
						filter.unshift(["custrecord_bb1_sca_rule_area", "anyof", allowAreas]);

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
									//find.push(new nlobjSearchColumn(this.fields[j].id));
									if (this.fields[j].type == "record" || this.fields[j].type == "choice") {
										if (result.getText(this.fields[j].id) && result.getText(this.fields[j].id).length > 0) {
											data[this.fields[j].id] = {
												value: result.getValue(this.fields[j].id),
												text: result.getText(this.fields[j].id)
											};
										}
									} else {
										data[this.fields[j].id] = result.getValue(this.fields[j].id);
									}
								}
							}
							if (id) { //add choices

								data.custrecord_bb1_sca_rule_duration.choice = [{
									value: "1",
									text: "Per Month"
								}, {
									value: "2",
									text: "Per Quarter"
								}, {
									value: "3",
									text: "Per Year"
								}];
								if (!data.custrecord_bb1_sca_rule_wearer) {
									data.custrecord_bb1_sca_rule_wearer = {};
								}
								data.custrecord_bb1_sca_rule_wearer.choice = [{
									text: ""
								}];
								if (data.custrecord_bb1_sca_rule_area&&data.custrecord_bb1_sca_rule_area.value) {
									filter = [
										["isinactive", "is", "F"],
										"AND",
										["custrecord_bb1_sca_wearer_area", "is", data.custrecord_bb1_sca_rule_area.value]

									];

									find = [];
									find.push(new nlobjSearchColumn("name"));

									var wearerSearch = nlapiSearchRecord("customrecord_bb1_sca_wearer", null,
										filter,
										find
									);
									var wresult;
									if (wearerSearch) {

										for (var j = 0; j < wearerSearch.length; j++) {
											wresult = wearerSearch[j];
											data.custrecord_bb1_sca_rule_wearer.choice.push({
												value: wresult.getId(),
												text: wresult.getValue("name")
											});
										}
									}
								}
								if (!data.custrecord_bb1_sca_rule_item) {
									data.custrecord_bb1_sca_rule_item = {};
								}
								data.custrecord_bb1_sca_rule_item.choice = [{
									text: ""
								}];
								filter = [
									["internalidnumber", "greaterthan", 0],
									"AND",
									["isinactive", "is", "F"],
									"AND",
									["type", "anyof", "Assembly", "InvtPart", "Kit"],
									"AND",
									["isonline", "is", "T"],
									"AND",
									["matrixchild", "is", "F"],
									"AND",
									[
										["custitem_bb1_sca_standarditem", "is", "T"],
										"OR",
										["custitem_bb1_sca_customers", "anyof", customer],
										"OR",
										["custitem_bb1_sca_buyers", "anyof", contact]
									]
								];

								find = [];
								find.push(new nlobjSearchColumn("itemid"));
								find[0].setSort();
								

								var itemSearch = nlapiSearchRecord("item", null,
									filter,
									find
								);
								var iresult;
								if (itemSearch) {


									do {
										var lastid;
										for (var j = 0; j < itemSearch.length; j++) {
											iresult = itemSearch[j];
											data.custrecord_bb1_sca_rule_item.choice.push({
												value: iresult.getId(),
												text: iresult.getValue("itemid")
											});
											lastid = iresult.getId();
										}
										if (itemSearch.length < 1000) {
											break;
										}
										
										filter[0] = ["internalidnumber", "greaterthan", lastid];
										itemSearch = nlapiSearchRecord("item", null,
											filter,
											find
										);
									} while (true);
								}


							}



							results.push(data);
						}
					}
					if (id) {
						if (results.length > 0) {
							return results[0];
						} else {
							throw (new Error("The rule could not be found or is not allowed to be viewed."));
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

				//nlapiLogExecution("debug", "data start transfer", JSON.stringify(this.data));

				var id = request.getParameter("id");

				var rec = nlapiLoadRecord(this.recordtype, this.data.id);
				var value;
				for (var j = 0; j < this.fields.length; j++) {
					value = this.data[this.fields[j].id];
					if (value && !this.fields[j].listonly) {
						try {
							if (value.value) {
								rec.setFieldValue(this.fields[j].id, value.value);
							} else {
								rec.setFieldValue(this.fields[j].id, value);
							}
						} catch (e) {
							nlapiLogExecution("debug", "update rule", "unable to set " + this.fields[j].id + " to " + value + ". " + e);
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