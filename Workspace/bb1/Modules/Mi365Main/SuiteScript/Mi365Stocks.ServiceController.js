define(
	'SafeAid.bb1.Mi365Stocks.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Stocks.ServiceController',
			recordtype: "customrecord_bb1_sca_companystock",
			fields: [{
				id: "custrecord_bb1_sca_companystock_item",
				label: "Item",
				type: "record",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_companystock_location",
				label: "Location",
				type: "record",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_companystock_area",
				label: "Area",
				type: "record",
				list: true
			}, {
				id: "custrecord_bb1_sca_companystock_wearer",
				label: "Wearer",
				type: "record",
				list: true
			}, {
				id: "custrecord_bb1_sca_companystock_quantity",
				label: "Quantity",
				type: "text",
				mandatory: true,
				list: true
			}, {
				id: "custrecord_bb1_sca_companystock_minquant",
				label: "Re-Order Minimum",
				type: "text"
			}, {
				id: "custrecord_bb1_sca_companystock_maxquant",
				label: "Re-Order Maximum",
				type: "text"
			}],

			// The values in this object are the validation needed for the current service.

			options: {
				common: {}
			}

			,
			get: function get() {
					nlapiLogExecution("debug", "SafeAid.bb1.Mi365Stocks.ServiceController.get " + request);
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
					var includeWearers = "T" == request.getParameter("includeWearers");

					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getFieldValues()));
					//nlapiLogExecution("debug", "field values",JSON.stringify(customer.getCustomFields()));



					var filter = [
						["isinactive", "is", "F"]
					];

					if (wearer) {
						filter.unshift("AND");
						filter.unshift(["custrecord_bb1_sca_companystock_wearer", "anyof", wearer]);
					} else if (area) {
						filter.unshift("AND");
						filter.unshift(["custrecord_bb1_sca_companystock_area", "anyof", area]);
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

							if (includeWearers) { //Add all the wearers as a choice for starting a transfer.

								data.custrecord_bb1_sca_companystock_wearer.choice = [];
								if (data.custrecord_bb1_sca_companystock_area.value) {
									filter = [
										["isinactive", "is", "F"],
										"AND",
										["custrecord_bb1_sca_wearer_area", "is", data.custrecord_bb1_sca_companystock_area.value]

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
											data.custrecord_bb1_sca_companystock_wearer.choice.push({
												value: wresult.getId(),
												text: wresult.getValue("name")
											});
										}
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
							throw (new Error("The stock could not found."));
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

				nlapiLogExecution("debug", "data start transfer", JSON.stringify(this.data));

				var id = request.getParameter("id");

				if (this.data.task == "starttransfer") {
					//decrease existing stock

					var rec = nlapiLoadRecord(this.recordtype, this.data.id);
					var currentquantity = parseInt(rec.getFieldValue("custrecord_bb1_sca_companystock_quantity"));
					var newquantity = currentquantity - parseInt(this.data.custrecord_bb1_sca_companystock_quantity);
					if (!(newquantity >= 0)) {
						throw (new Error("Unable to transfer stock. There is not enough available."));
					}
					rec.setFieldValue("custrecord_bb1_sca_companystock_quantity", newquantity);
					nlapiSubmitRecord(rec, true, true);

					//search for existing stock record first

					var customrecord_bb1_sca_companystockSearch = nlapiSearchRecord("customrecord_bb1_sca_companystock", null,
						[
							["custrecord_bb1_sca_companystock_item", "anyof", this.data.custrecord_bb1_sca_companystock_item.value], 
							"AND", 
							["custrecord_bb1_sca_companystock_wearer","anyof",this.data.custrecord_bb1_sca_companystock_wearer], 
							"AND", 
							["custrecord_bb1_sca_companystock_location","anyof","2"]
						],
						[

							new nlobjSearchColumn("custrecord_bb1_sca_companystock_item"),
							new nlobjSearchColumn("custrecord_bb1_sca_companystock_quantity")
						]
					);


					var foundStock;
					if(customrecord_bb1_sca_companystockSearch){
					for(var j=0;j<customrecord_bb1_sca_companystockSearch.length;j++){
						//found exististing stock so update that quantity
						result=customrecord_bb1_sca_companystockSearch[j];
						foundStock = result.getId();
						//nlapiLogExecution("debug", "transfer", "foundstock "+foundStock);
						var rec = nlapiLoadRecord(this.recordtype, foundStock);
						rec.setFieldValue("custrecord_bb1_sca_companystock_quantity", parseInt(result.getValue("custrecord_bb1_sca_companystock_quantity")) + parseInt(this.data.custrecord_bb1_sca_companystock_quantity));
						nlapiSubmitRecord(rec, true, true);
						break;
					};
				}

					if (!foundStock) {
						//create new stock for this wearer
						
						var rec = nlapiCreateRecord(this.recordtype);
						rec.setFieldValue("custrecord_bb1_sca_companystock_item", this.data.custrecord_bb1_sca_companystock_item.value);
						rec.setFieldValue("custrecord_bb1_sca_companystock_location", 2);
						rec.setFieldValue("custrecord_bb1_sca_companystock_wearer", this.data.custrecord_bb1_sca_companystock_wearer);
						rec.setFieldValue("custrecord_bb1_sca_companystock_quantity", this.data.custrecord_bb1_sca_companystock_quantity);
						var newStock=nlapiSubmitRecord(rec, true, true);
						//nlapiLogExecution("debug", "transfer", "create stock "+newStock);
					}

					//create a new transfer at this point!
					var rec = nlapiCreateRecord("customrecord_bb1_sca_companystocktrans");

					rec.setFieldValue("custrecord_bb1_sca_costocktrans_item", this.data.custrecord_bb1_sca_companystock_item.value);
					rec.setFieldValue("custrecord_bb1_sca_costocktrans_company", customer);
					rec.setFieldValue("custrecord_bb1_sca_costocktrans_wearer", this.data.custrecord_bb1_sca_companystock_wearer);
					rec.setFieldValue("custrecord_bb1_sca_costocktrans_area", this.data.custrecord_bb1_sca_companystock_area.value);
					rec.setFieldValue("custrecord_bb1_sca_costocktrans_quantity", this.data.custrecord_bb1_sca_companystock_quantity);
					//					rec.setFieldValue("name", "Transfer #" + Math.floor(Math.random() * 1000000));
					var newId = nlapiSubmitRecord(rec, true, true);




					return {
						id: newId,
						custrecord_bb1_sca_costocktrans_item: this.data.custrecord_bb1_sca_companystock_item.value,
						custrecord_bb1_sca_costocktrans_company: customer,
						custrecord_bb1_sca_costocktrans_wearer: this.data.custrecord_bb1_sca_companystock_wearer,
						custrecord_bb1_sca_costocktrans_area: this.data.custrecord_bb1_sca_companystock_area.value,
						custrecord_bb1_sca_costocktrans_quantity: this.data.custrecord_bb1_sca_companystock_quantity
					};


				} else {
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