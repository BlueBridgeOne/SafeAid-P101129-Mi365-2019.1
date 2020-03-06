/**
 * Project: P101129
 *
 * Update blanks fields on an item, that are needed for the web. e.g. store display name, search text, meta tags,title etc.
 * 
 * Date			Author			Purpose		
 * 7 Nov 2019	Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/runtime'],

	function (record, search, runtime) {

		/**
		 * Function definition to be triggered before record is loaded.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.newRecord - New record
		 * @param {string} scriptContext.type - Trigger type
		 * @param {Form} scriptContext.form - Current form
		 * @Since 2015.2
		 */
		function beforeLoad(scriptContext) {
			fixMatrix(scriptContext);
		}

		function fixMatrix(scriptContext) {
			if (scriptContext.type == scriptContext.UserEventType.DELETE) {

				return;
			}
			try {

				var R = scriptContext.newRecord;
				log.debug("Update Item Fields", "ID=" + R.id + ". " + R.type);

				var isonline = R.getValue({
					fieldId: 'isonline'
				});

				var matrix = R.getValue({
					fieldId: 'haschildren'
				});
				matrix = true;

				var matrixchild = false;

				var parent = R.getValue({
					fieldId: 'parent'
				});
				if (parent) {
					var fieldLookUp = search.lookupFields({
						type: R.type,
						id: parent,
						columns: ['matrix', 'isonline']
					});
					//log.debug("Testing", "Is Parent Matrix? " + fieldLookUp.matrix);
					if (fieldLookUp.matrix) {
						matrixchild = true;
					}
				}

				if (isonline) {


					if (matrixchild) {
						return;
					}
					var user = runtime.getCurrentUser();

					log.debug("Testing", "Update Item " + R.id + " user=" + user.name + " " + user.id + " matrix=" + matrix + " child=" + matrixchild);


					if (matrix) {


						//Keep this handy bit of code.
						var itemoptions = R.getValue({
							fieldId: 'itemoptions'
						});

						var matrixitemnametemplate = R.getValue({
							fieldId: 'matrixitemnametemplate'
						});
						if (!itemoptions || itemoptions.length == 0 || !matrixitemnametemplate || matrixitemnametemplate.length == 0) {
							itemoptions = [];
							log.debug("itemoptions", "Calculate item options");
							var value;
							var facets = ["custitem_bb1_matrix_colour", "custitem_bb1_matrix_size", "custitem_bb1_matrix_footwear", "custitem_bb1_matrix_gloves", "custitem_bb1_matrix_ladieswear", "custitem_bb1_matrix_length", "custitem_bb1_matrix_shoewidths", "custitem_bb1_matrix_signage", "custitem_bb1_matrix_signtype"];
							var template = "{itemid}";
							for (var i = 0; i < facets.length; i++) {
								value = R.getValue({
									fieldId: facets[i]
								});
								if (value && value.length > 0) {
									log.debug(facets[i], value);
									var io = facets[i].replace("custitem", "custcol").toUpperCase();
									itemoptions.push(io);
									template += ".{" + facets[i] + "}";
								}
							}
							if (itemoptions.length > 0) {
								log.debug("itemoptions", JSON.stringify(itemoptions));
								R.setValue({
									fieldId: 'itemoptions',
									value: itemoptions,
									ignoreFieldChange: true
								});
							}
							// if(template=="{itemid}"){
							// 	template="{itemid}.{custitem_bb1_matrix_size}.{custitem_bb1_matrix_colour}";
							// }

							if (matrixitemnametemplate != template) {
								try {
									log.debug("matrixitemnametemplate", template);
									R.setValue({
										fieldId: 'matrixitemnametemplate',
										value: template,
										ignoreFieldChange: true
									});
								} catch (err) {
									log.debug("set matrixitemnametemplate", err);
								}
								// if (scriptContext.form) {
								// 	record.submitFields({
								// 		type: R.type,
								// 		id: R.id,
								// 		values: {
								// 			matrixitemnametemplate: template
								// 		},
								// 		options: {
								// 			enableSourcing: false,
								// 			ignoreMandatoryFields: true
								// 		}
								// 	});
								// }

							}
						}
					}

					var custitem_bb1_sca_standarditem = R.getValue({
						fieldId: 'custitem_bb1_sca_standarditem'
					});
					var custitem_bb1_sca_customers = R.getValue({
						fieldId: 'custitem_bb1_sca_customers'
					});
					var custitem_bb1_sca_buyers = R.getValue({
						fieldId: 'custitem_bb1_sca_buyers'
					});
					var sType = "inventoryitem";
					if (R.type == "assemblyitem") {
						sType = "assemblyitem";
					}
					
					var test=[["isonline", "is", "F"],
					"OR",
					["custitem_bb1_sca_standarditem", "is", !custitem_bb1_sca_standarditem]]
					// ,
					// "OR",
					// ["custitem_bb1_sca_customers", "notallof", custitem_bb1_sca_customers],
					// "OR",
					// ["custitem_bb1_sca_buyers", "notallof", custitem_bb1_sca_buyers]];
					
					//log.debug("Update Item Fields", JSON.stringify(test));
					var inventoryitemSearchObj = search.create({
						type: sType,
						filters: [

							["parent", "anyof", R.id],
							"AND",
							test
						],
						columns: [
							search.createColumn({
								name: "itemid",
								label: "Name"
							}),
							search.createColumn({
								name: "type",
								label: "Type"
							})
						]
					});
					inventoryitemSearchObj.run().each(function (result) {
						//log.debug("custitem_bb1_sca_standarditem",result.id);
						record.submitFields({
							type: R.type,
							id: result.id,
							values: {
								isonline: true,
								custitem_bb1_sca_standarditem: custitem_bb1_sca_standarditem,
								custitem_bb1_sca_customers: custitem_bb1_sca_customers,
								custitem_bb1_sca_buyers: custitem_bb1_sca_buyers
							},
							options: {
								enableSourcing: false,
								ignoreMandatoryFields: true
							}
						});

						return true;
					});
				}
				
			} catch (err) {
				log.error("Unable to fix matrix item", err);
			}
		}

		/**
		 * Function definition to be triggered before record is loaded.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.newRecord - New record
		 * @param {Record} scriptContext.oldRecord - Old record
		 * @param {string} scriptContext.type - Trigger type
		 * @Since 2015.2
		 */
		function beforeSubmit(scriptContext) {

			if (scriptContext.type == scriptContext.UserEventType.DELETE) {

				return;
			}
			try {
				var R = scriptContext.newRecord;

				var custitem_bb1_sca_buyers = R.getValue({
					fieldId: 'custitem_bb1_sca_buyers'
				});

				var custitem_bb1_sca_customers = R.getValue({
					fieldId: 'custitem_bb1_sca_customers'
				});
				//var custitem_bb1_sca_standarditem = (!custitem_bb1_sca_buyers || custitem_bb1_sca_buyers.length == 0) && (!custitem_bb1_sca_customers || custitem_bb1_sca_customers.length == 0);
				//log.debug("Standard Item", custitem_bb1_sca_standarditem);
				// R.setValue({
				// 	fieldId: 'custitem_bb1_sca_standarditem',
				// 	value: custitem_bb1_sca_standarditem
				// });

				fixMatrix(scriptContext);



				log.debug("Update Item Fields", "ID=" + R.id + ".");


				var storedisplayname = R.getValue({
					fieldId: 'storedisplayname'
				});
				var displayname = R.getValue({
					fieldId: 'displayname'
				});
				var description = R.getValue({
					fieldId: 'description'
				});
				displayname = displayname || description;
				var pagetitle = R.getValue({
					fieldId: 'pagetitle'
				});
				var itemid = R.getValue({
					fieldId: 'itemid'
				});
				var storedescription = R.getValue({
					fieldId: 'storedescription'
				});
				var urlcomponent = R.getValue({
					fieldId: 'urlcomponent'
				});
				var searchkeywords = R.getValue({
					fieldId: 'searchkeywords'
				});
				searchkeywords = searchkeywords || "";

				if (!storedisplayname && displayname) {
					R.setValue({
						fieldId: 'storedisplayname',
						value: displayname
					});
				}

				if (!pagetitle && displayname) {
					R.setValue({
						fieldId: 'pagetitle',
						value: displayname + " | SAFEAID"
					});
				}
				if (!storedescription && displayname) {
					R.setValue({
						fieldId: 'storedescription',
						value: itemid + ", " + displayname
					});
				}
				var newurlcomponent = getUrlFragment(displayname);
				if (newurlcomponent != urlcomponent) {
					R.setValue({
						fieldId: 'urlcomponent',
						value: newurlcomponent
					});
				}
				if (searchkeywords.indexOf(itemid) == -1) {
					R.setValue({
						fieldId: 'searchkeywords',
						value: searchkeywords.length > 0 ? searchkeywords + " " + itemid : itemid
					});
				}
				//custitem_bb1_sca_buyers
				//custitem_bb1_sca_customers
				//custitem_bb1_sca_standarditem




			} catch (err) {
				log.error("Unable to update items", err);
			}
			//Find all relevant download files in the web site downloads folder. Files must start with the item id.
			//custscript_bb1_sca_downloadsfolder

		}

		function getUrlFragment(name) {

			var body = "",
				charCode, char, lastDash;
			name = name.toLowerCase();
			for (var i = 0; i < name.length; i++) {
				charCode = name.charCodeAt(i);
				char = name.charAt(i);
				if (char == "-" || char == " ") {
					if (!lastDash) {
						body += "-";
					}
					lastDash = true;
				} else if ((charCode >= 97 && charCode <= 122) || char == "_" || (charCode >= 48 && charCode <= 57)) {
					body += char;
					lastDash = false;
				}
			}
			return body;

		}

		return {
			beforeSubmit: beforeSubmit,
			beforeLoad: beforeLoad
		};

	});