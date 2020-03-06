/**
 * Project : P101129
 * 
 * Description : Creating a assembly matrix item test.
 * 
 * @Author : Gordon Truslove
 * @Date   : 7/11/2019, 4:34:21 PM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/runtime', 'N/record', 'N/search'],

	function (serverWidget, runtime, record, search) {

		/**
		 * Definition of the Suitelet script trigger point.
		 *
		 * @param {Object} context
		 * @param {ServerRequest} context.request - Encapsulation of the incoming request
		 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
		 * @Since 2015.2
		 */
		function onRequest(context) {

			var request = context.request;
			if (request.method === 'GET') {

				createBoM(17);

				var name = request.parameters.custparam_name;

				var form = serverWidget.createForm({
					title: 'My Form'
				});
				var namefield = form.addField({
					id: 'custpage_group_name',
					type: serverWidget.FieldType.TEXT,
					label: 'Name'
				});
				namefield.isMandatory = true;
				if (name) {
					namefield.defaultValue = name;
				}

				form.addSubmitButton({
					label: 'Submit'
				});
				context.response.writePage(form);


			} else {
				// POST

				// Get the values entered on the form
				var response = context.response;
				var request = context.request;
				var name = request.parameters.custpage_group_name;

				// Redirect back to this Suitelet
				var script = runtime.getCurrentScript();
				var params = [];
				params['custparam_name'] = name;
				response.sendRedirect({
					type: 'SUITELET',
					identifier: script.id,
					id: script.deploymentId,
					parameters: params
				});

			}
		}

		function createBoM(baseItemId) {

			var delimiter = /\u0005/;
			var baseItem = record.load({
				type: record.Type.INVENTORY_ITEM,
				id: baseItemId,
				isDynamic: true
			});

			var baseItemItemId = baseItem.getValue({
				fieldId: 'itemid'
			});
			var baseItemTemplate = baseItem.getValue({
				fieldId: 'matrixitemnametemplate'
			});
			var baseItemMatrixType = baseItem.getValue({
				fieldId: 'matrixtype'
			});
			var baseItemOptions = baseItem.getValue({
				fieldId: 'itemoptions'
			});
			var baseItemColours = baseItem.getValue({
				fieldId: 'custitem_bb1_colour'
			});
			//baseItemOptions=["CUSTCOL_BB1_COLOUR"];

			//Get Children:
			var children = [];

			var itemSearchObj = search.create({
				type: "item",
				filters: [
					["parent", "anyof", baseItemId]
				],
				columns: [
					search.createColumn({
						name: "itemid",
						sort: search.Sort.ASC,
						label: "Name"
					}),
					search.createColumn({
						name: "displayname",
						label: "Display Name"
					}),
					search.createColumn({
						name: "salesdescription",
						label: "Description"
					}),
					search.createColumn({
						name: "type",
						label: "Type"
					}),
					search.createColumn({
						name: "baseprice",
						label: "Base Price"
					}),
					search.createColumn({
						name: "custitem_bb1_colour",
						label: "Colour"
					})
				]
			});
			//var searchResultCount = itemSearchObj.runPaged().count;
			//log.debug("itemSearchObj result count",searchResultCount);
			itemSearchObj.run().each(function (result) {
				// .run().each has a limit of 4,000 results
				children.push(result);
				return true;
			});


			//Create new BoM
			var newItemId = "Custom " + baseItemItemId + " (" + new Date().getMilliseconds() + ")";
			var newItem = record.create({
				type: record.Type.ASSEMBLY_ITEM,
				isDynamic: true
			});

			newItem.setValue({
				fieldId: 'itemid',
				value: newItemId,
				ignoreFieldChange: true
			});

			newItem.setValue({
				fieldId: 'cogsaccount',
				value: 116,
				ignoreFieldChange: true
			});
			newItem.setValue({
				fieldId: 'assetaccount',
				value: 115,
				ignoreFieldChange: true
			});
			newItem.setValue({
				fieldId: 'matrixtype',
				value: baseItemMatrixType,
				ignoreFieldChange: true
			});
			newItem.setValue({
				fieldId: 'matrixitemnametemplate',
				value: baseItemTemplate,
				ignoreFieldChange: true
			});

			newItem.setValue({
				fieldId: 'itemoptions',
				value: baseItemOptions,
				ignoreFieldChange: true
			});


			log.debug("item", "values set!");

			if (children.length > 0 && baseItemMatrixType == "PARENT") {
				log.debug("children.length", children.length);
				newItem.selectNewLine({
					sublistId: 'member'
				});

				newItem.setCurrentSublistValue({
					sublistId: 'member',
					fieldId: 'item',
					value: children[0].id,
					ignoreFieldChange: true
				});
				newItem.setCurrentSublistValue({
					sublistId: 'member',
					fieldId: 'quantity',
					value: 1,
					ignoreFieldChange: true
				});
				newItem.commitLine({
					sublistId: 'member'
				});


			}
			log.debug("save item", "save");
			var parentId = newItem.save({
				enableSourcing: true,
				ignoreMandatoryFields: true
			});

			newItem = record.load({
				type: record.Type.ASSEMBLY_ITEM,
				id: parentId,
				isDynamic: true
			});
			var newColours = [];
			for (var i = 0; i < baseItemColours.length; i++) {
				newColours.push(parseInt(baseItemColours[i]))
			}
			newItem.setValue({
				fieldId: 'custitem_bb1_colour',
				value: newColours,
				ignoreFieldChange: true
			});
			newItem.save({
				enableSourcing: true,
				ignoreMandatoryFields: true
			});
			log.debug("save item", "with colours " + JSON.stringify(newColours));
			//Generate all the children.

			if (children.length > 0 && baseItemMatrixType == "PARENT") {
				var newChild, childItemId, dot, baseChildColours;
				for (var i = 0; i < children.length; i++) {

					childItemId = children[i].getValue({
						name: 'itemid'
					});
					dot = childItemId.indexOf(".");
					childItemId = childItemId.substring(dot); //Find extra stuff on child name.


					newChild = record.create({
						type: record.Type.ASSEMBLY_ITEM,
						isDynamic: true
					});


					newChild.setValue({
						fieldId: 'itemid',
						value: newItemId + childItemId,
						ignoreFieldChange: true
					});

					newChild.setValue({
						fieldId: 'cogsaccount',
						value: 116,
						ignoreFieldChange: true
					});
					newChild.setValue({
						fieldId: 'assetaccount',
						value: 115,
						ignoreFieldChange: true
					});
					newChild.setValue({
						fieldId: 'matrixtype',
						value: "CHILD",
						ignoreFieldChange: true
					});
					newChild.setValue({
						fieldId: 'matrixitemnametemplate',
						value: baseItemTemplate,
						ignoreFieldChange: true
					});
					newChild.setValue({
						fieldId: 'itemoptions',
						value: baseItemOptions,
						ignoreFieldChange: true
					});

					baseChildColours = children[i].getValue({
	name: 'custitem_bb1_colour'
});

					newChild.setValue({
						fieldId: 'matrixoptioncustitem_bb1_colour',
						value: parseInt(baseChildColours),
						ignoreFieldChange: true
					});
					newChild.setValue({
						fieldId: 'parent',
						value: parentId,
						ignoreFieldChange: true
					});

					newChild.selectNewLine({
						sublistId: 'member'
					});

					newChild.setCurrentSublistValue({
						sublistId: 'member',
						fieldId: 'item',
						value: children[i].id,
						ignoreFieldChange: true
					});
					newChild.setCurrentSublistValue({
						sublistId: 'member',
						fieldId: 'quantity',
						value: 1,
						ignoreFieldChange: true
					});
					newChild.commitLine({
						sublistId: 'member'
					});
					log.debug("save child", "child " + i);
					var childId=newChild.save({
						enableSourcing: true,
						ignoreMandatoryFields: true
					});

//set child colour!
// baseChildColours = children[i].getValue({
// 	name: 'custitem_bb1_colour'
// });
// newChild= record.load({
// 	type:record.Type.ASSEMBLY_ITEM,
// 	id:childId,
// 	isDynamic: true
// 	 });
// 	 newChild.setValue({
// 	fieldId: 'custitem_bb1_colour',
// 	value: parseInt(baseChildColours),
// 	ignoreFieldChange: true
// });
// newChild.save({
// 	enableSourcing: true,
// 	ignoreMandatoryFields: true
// });

					break;
				}
			}


			// 		var parent = nlapiCreateRecord('noninventoryitem');
			// parent.setFieldValue('matrixtype', 'PARENT');
			// parent.setFieldValue('itemid', 'zzz ttt');
			// parent.setFieldValue('subsidiary', 2);// internalid for subs.
			// parent.setFieldValue('taxschedule', 4);// internalid for N/A in my account
			// parent.setFieldValues('itemoptions', ['CUSTCOL_LLL_EVENTLOCATION_OPT']);//option to be shown at PDP
			// parent.setFieldValue('custitem_event_location', 11);// particular option id (see in your list)
			// var parentid = nlapiSubmitRecord(parent);

			// var child = nlapiCreateRecord('noninventoryitem');
			// child.setFieldValue('matrixtype', 'CHILD');
			// child.setFieldValue('parent', parentid);
			// child.setFieldValue('itemid', 'zzz ttt child');
			// child.setFieldValue('taxschedule', 4);// internalid for N/A in my account
			// child.setFieldValues('itemoptions', ['CUSTCOL_LLL_EVENTLOCATION_OPT']);// same as in parent record
			// child.setFieldValue('matrixoptioncustitem_event_location', 11);// same as in parent record
			// var childid = nlapiSubmitRecord(child );
		}

		return {
			onRequest: onRequest
		};

	})