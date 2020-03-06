/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 * 
 * BB1 G Truslove - Mar 2017 - Map Reduce Script which loads then saves every item. Thus, triggering any item scripts.
 */
define(['N/record', 'N/search', 'N/runtime'],
	/**
	 * @param {record} record
	 * @param {search} search
	 */
	function (record, search, runtime) {

		// var type = record.Type.ASSEMBLY_ITEM;
		var type = record.Type.INVENTORY_ITEM;
		var minfield = "itemid"; //Specify at least one field for the search.

		// var type = record.Type.CUSTOMER;
		// var minfield = "terms"; //Specify at least one field for the search.

		// var type = "commercecategory";
		// var minfield = "name";

		/**
		 * Marks the beginning of the Map/Reduce process and generates input data.
		 *
		 * @typedef {Object} ObjectRef
		 * @property {number} id - Internal ID of the record instance
		 * @property {string} type - Record type id
		 *
		 * @return {Array|Object|Search|RecordRef} inputSummary
		 * @since 2015.1
		 */
		function getInputData() {

			//var user = runtime.getCurrentUser()

			// if (user.getPreference("LANGUAGE") != "en_GB") {

			// 	log.debug("**** ERROR ****", "LANGUAGE=" + user.getPreference("LANGUAGE"));
			// 	return null;
			// } else {
			// 	log.debug("**** OK ****", "LANGUAGE=" + user.getPreference("LANGUAGE"));
			// }

			log.debug("Input Data", "Get all " + type + ".");
			var filters = [
				['isinactive', search.Operator.IS, 'F']
			];
			if (type == record.Type.INVENTORY_ITEM || type == record.Type.ASSEMBLY_ITEM) {
				filters.push('AND');
				filters.push(['matrixchild', search.Operator.IS, 'F']);
				filters.push('AND');
				filters.push(['isonline', search.Operator.IS, 'T']);

			}
			var newSearch = search.create({
				type: type,
				filters: filters,
				columns: [minfield],
				title: 'All "+type+" Search'
			});
			//, 'AND', [ 'isonline', search.Operator.IS, "T" ]

			return newSearch;
		}

		/**
		 * Executes when the map entry point is triggered and applies to each key/value pair.
		 *
		 * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
		 * @since 2015.1
		 */
		function map(context) {

			if (!abort()) {
				var searchResult = JSON.parse(context.value);
				var itemId = searchResult.id;
				var minvalue = searchResult.values[minfield];

				//applyLocationDiscountToInvoice(itemId);
				log.audit("MAP", itemId + "=" + minvalue);

				try {
					var objRecord = record.load({
						type: type,
						id: itemId
					});
					//				objRecord.setValue({
					//					fieldId : 'custrecord_bb1_website_se',
					//					value : [ 1 ],
					//					ignoreFieldChange : true
					//				});

					if (type == "commercecategory") {

						var numLines = objRecord.getLineCount({
							sublistId: 'items'
						});
						var item, primarycategory;
						for (var i = 0; i < numLines; i++) {


							item = objRecord.getSublistValue({
								sublistId: 'items',
								fieldId: 'item',
								line: i
							});
							primarycategory = objRecord.getSublistValue({
								sublistId: 'items',
								fieldId: 'primarycategory',
								line: i
							});
							if (!primarycategory) {
								log.debug("cat", item + " " + primarycategory);
								objRecord.setSublistValue({
									sublistId: 'items',
									fieldId: 'primarycategory',
									line: i,
									value: true
								});
							}
						}



					}


					objRecord.save();
				} catch (error1) {
					log.error("MAP SAVE", error1);
				}

				//context.write(itemId, upccode);
			}
		}

		/**
		 * Executes when the reduce entry point is triggered and applies to each group.
		 *
		 * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
		 * @since 2015.1
		 */
		function reduce(context) {
			//log.debug("REDUCE", context.key + " " + context.values.join(","));
		}

		/**
		 * Executes when the summarize entry point is triggered and applies to the result set.
		 *
		 * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
		 * @since 2015.1
		 */
		function summarize(summary) {
			var seconds = summary.seconds;
			var usage = summary.usage;
			var yields = summary.yields;

			log.debug("Map/Reduce", "Complete seconds=" + seconds + " usage=" + usage + " yields=" + yields);
		}
		var isAbort = false;

		function abort() { //Abort the script if this parameter is checked.
			if (isAbort) {
				return isAbort;
			}
			var abort = runtime.getCurrentScript().getParameter({
				name: 'custscript_bb1_abort'
			});
			var newAbort = (abort == "T" || abort == true);
			if (!isAbort && newAbort) {
				log.error("Map/Reduce", "**** ABORT!! - Note: Script will continue, but map/reduce will be skipped. ****");
				isAbort = newAbort;
			}
			return newAbort;
		}

		return {
			getInputData: getInputData,
			map: map,
			reduce: reduce,
			summarize: summarize
		};

	});