define(
	'SafeAid.bb1.Mi365Order.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Order.ServiceController',
			recordtype: "salesorder"


				,
			get: function get() {
				//nlapiLogExecution("debug", "SafeAid.bb1.Mi365Buyers.ServiceController.get "+request);
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

				if (task == "approve") {
					var custentity_bb1_sca_allowviewareas = nlapiLookupField('contact', contact, 'custentity_bb1_sca_allowviewareas');
					if (custentity_bb1_sca_allowviewareas == null) {
						custentity_bb1_sca_allowviewareas = "0";
					}
					var allowAreas = custentity_bb1_sca_allowviewareas.split(",")||[];
					allowAreas.push("@NONE@");
					
					var custentity_bb1_sca_allowapproveorders = nlapiLookupField('contact', contact, 'custentity_bb1_sca_allowapproveorders');
					if(custentity_bb1_sca_allowapproveorders!="T"){
						throw (new Error("You do not have permission to approve orders."));
					}
					//check allowed to approve.
					var rec = nlapiLoadRecord(this.recordtype, id);
					var items = this.getItems(rec),
						options, found;
					for (var i = 0; i < items.length; i++) {
						if (items[i].options) {
							options = items[i].options;
							for (var j = 0; j < options.length; j++) {
								if (options[j].id == "CUSTCOL_BB1_SCA_AREA"||options[j].id == "CUSTCOL_BB1_SCA_AREA2") {
									found = false;
									for (var k = 0; k < allowAreas.length; k++) {
										if (this.parseJSONValue(options[j].value) == allowAreas[k]) {
											found = true;
											break;
										}
									}
									if (!found) {
										throw (new Error("You do not have permission to approve orders for these areas."));
									}
								}
							}
						}
					}
					
					nlapiSubmitField(this.recordtype, id, "custbody_bb1_sca_webapprover", contact,false); 
					nlapiSubmitField(this.recordtype, id, "custbody_bb1_sca_approvalstatus", 3,false); 
					

				}else if(task == "reject"){
					
					var custentity_bb1_sca_allowapproveorders = nlapiLookupField('contact', contact, 'custentity_bb1_sca_allowapproveorders');
					if(custentity_bb1_sca_allowapproveorders!="T"){
						throw (new Error("You do not have permission to reject orders."));
					}
					nlapiDeleteRecord(this.recordtype, id);

				}


				// if (id) {
				// 	if (results.length > 0) {
				// 		return results[0];
				// 	} else {
				// 		throw (new Error("The order could not be found."));
				// 	}
				// } else {
				// 	return results;
				// }

				return {
					ok: true,
					task: task
				}

			},
			getItems: function (currentRecord) {
					//var fields=["internalid", "quantity", "options", "displayname", "amount", "amount_formatted", "parent"];
					var options = ["custcol_bb1_matrix_colour", "custcol_bb1_matrix_size", "custcol_bb1_transline_wearer", "custcol_bb1_transline_area", "custcol_bb1_matrix_footwear", "custcol_bb1_matrix_gloves", "custcol_bb1_matrix_ladieswear", "custcol_bb1_matrix_length", "custcol_bb1_matrix_shoewidths", "custcol_bb1_matrix_signage", "custcol_bb1_matrix_signtype"];
					var numLines = currentRecord.getLineItemCount('item');
					var items = [],
						item, value;
					for (var i = 1; i <= numLines; i++) {



						//get item details
						item = {};
						item.internalid = currentRecord.getLineItemValue('item','item',i);
						item.displayname = currentRecord.getLineItemText('item','item',i);
						
						
						item.options = [];
						for (var j = 0; j < options.length; j++) {
							value = currentRecord.getLineItemValue('item',options[j],i);
							if (value) {
								item.options.push({
									id: options[j].replace("transline", "sca").toUpperCase(),
									value: value
								});

							}
						}
						//TODO! add standard item warning.

						items.push(item);

					}
					return items;


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



				return {
					ok: true
				}
			},
			put: function put() {

			},
			delete: function () {
				// not implemented
			}
			,parseJSONValue:function(value) { //convert number or {internalid:1,label:"A"} into number.
            var res = 0;
            try {
                if(value){
                res = parseInt(value.split("|")[0]);
                }
            } catch (err) {
                res = parseInt(value) || res;
            }
            return res;
        }
		});
	}
);