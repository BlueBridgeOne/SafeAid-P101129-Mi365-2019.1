define(
	'SafeAid.bb1.Mi365Reports.ServiceController', [
		'ServiceController'
	],
	function (
		ServiceController
	) {
		'use strict';

		return ServiceController.extend({

			name: 'SafeAid.bb1.Mi365Reports.ServiceController',

			options: {
				common: {}
			}

			,
			get: function get() {
				nlapiLogExecution("debug", "SafeAid.bb1.Mi365Reports.ServiceController.get " + request);
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

			var to =request.getParameter("to")|| this.formatDate(new Date());
			var fromd = new Date();
			fromd.setMonth(fromd.getMonth() - 1);
			var from = request.getParameter("from")||this.formatDate(fromd);

			var todate=this.parseDate(to);
			var fromdate=this.parseDate(from);

				var filters = [
					["type", "anyof", "SalesOrd"],

					"AND",
					["name", "anyof", customer], 
					"AND", 
					["trandate","onorbefore",this.nsformatDate(todate)], 
					"AND", 
					["trandate","onorafter",this.nsformatDate(fromdate)]
				];

				var columns = [
					new nlobjSearchColumn("ordertype"),
					new nlobjSearchColumn("trandate").setSort(false),

					new nlobjSearchColumn("tranid")



				];

				var name = "Unknown"
				switch (id) {
					case "spend-per-area":
						name = "Spend per Area";
						columns.push(new nlobjSearchColumn("amount"));
						columns.push(new nlobjSearchColumn("itemid", "item"));
						columns.push(new nlobjSearchColumn("quantity"));

						columns.push(new nlobjSearchColumn("internalid", "custcol_bb1_transline_area"));
						columns.push(new nlobjSearchColumn("name", "custcol_bb1_transline_area"));

						filters.push("AND");
						filters.push(["mainline", "is", "F"]);
						filters.push("AND");
						filters.push(["custcol_bb1_transline_area","noneof","@NONE@"]);
						break;
					case "spend-per-wearer":
						name = "Spend per Wearer";
						columns.push(new nlobjSearchColumn("amount"));
						columns.push(new nlobjSearchColumn("itemid", "item"));
						columns.push(new nlobjSearchColumn("quantity"));

						columns.push(new nlobjSearchColumn("internalid", "custcol_bb1_transline_wearer"));
						columns.push(new nlobjSearchColumn("name", "custcol_bb1_transline_wearer"));

						filters.push("AND");
						filters.push(["mainline", "is", "F"]);
						filters.push("AND");
						filters.push(["custcol_bb1_transline_wearer","noneof","@NONE@"]);
						break;
					case "spend-per-buyer":
						name = "Spend per Buyer";

						columns.push(new nlobjSearchColumn("total"));
						columns.push(new nlobjSearchColumn("custbody_bb1_buyer"));

						filters.push("AND");
						filters.push(["mainline", "is", "T"]);
						filters.push("AND");
						filters.push(["custbody_bb1_buyer","noneof","@NONE@"]);

						break;
				}




				var salesorderSearch = nlapiSearchRecord("salesorder", null,
					filters,
					columns
				);
				var lines = [],
					line, result;
				if (salesorderSearch) {
					for (var i = 0; i < salesorderSearch.length; i++) {
						result = salesorderSearch[i];

						line = {
							id: result.getId(),
							trandate: result.getValue("trandate"),
							tranid: result.getValue("tranid"),
							custbody_bb1_buyer: {
								value: result.getValue("custbody_bb1_buyer"),
								text: result.getText("custbody_bb1_buyer")
							},
							amount: result.getValue("amount"),
							quantity: result.getValue("quantity"),
							total: result.getValue("total"),
							item: result.getValue("itemid", "item"),
							custcol_bb1_transline_area: {
								value: result.getValue("internalid", "custcol_bb1_transline_area"),
								text: result.getValue("name", "custcol_bb1_transline_area")
							},
							custcol_bb1_transline_wearer: {
								value: result.getValue("internalid", "custcol_bb1_transline_wearer"),
								text: result.getValue("name", "custcol_bb1_transline_wearer")
							}
						};
						lines.push(line);
					}
				}



				return {
					id: id,
					name: name,
					lines: lines,
					to:to,
					from:from
				};

			}
			,nsformatDate:function(d){
				var month = '' + (d.getMonth() + 1),
					day = '' + d.getDate(),
					year = d.getFullYear();
	
				if (month.length < 2) {
					month = '0' + month;
				}
				if (day.length < 2) {
					day = '0' + day;
				}
	
				return [day,month,year].join('/');
			}

			,formatDate: function (d) {
				var month = '' + (d.getMonth() + 1),
					day = '' + d.getDate(),
					year = d.getFullYear();
	
				if (month.length < 2) {
					month = '0' + month;
				}
				if (day.length < 2) {
					day = '0' + day;
				}
	
				return [year, month, day].join('-');
			},
			parseDate:function(d){
				var parts = d.split("-");
return new Date(parseInt(parts[0], 10),
                  parseInt(parts[1], 10) - 1,
                  parseInt(parts[2], 10));
			}
		});
	}
);