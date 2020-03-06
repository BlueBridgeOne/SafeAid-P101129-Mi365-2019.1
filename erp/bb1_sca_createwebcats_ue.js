/**
 * Project : P101129
 * 
 * Description : When an item is saved, used the web category to generate the commerce categories.
 * 
 * @Author : Gordon Truslove
 * @Date   : 10/9/2019, 9:26:44 AM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],

    function (record, search) {

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type
         * @Since 2015.2
         */
        function afterSubmit(scriptContext) {

            if (scriptContext.type == scriptContext.UserEventType.DELETE) return;

            var currentRecord = scriptContext.newRecord;
            var isonline = currentRecord.getValue({
                fieldId: 'isonline'
            });
            if (isonline) {
                log.debug("Update Web Categories", currentRecord.id);
                //Need to do a lookup for this value, or it failes on create.
                var fieldLookUp = search.lookupFields({
                    type: currentRecord.type,
                    id: currentRecord.id,
                    columns: ['custitem_bb1_sca_webcategory', 'parent', 'custitem_bb1_sca_customers','custitem_bb1_sca_standarditem']
                });
                //log.debug("fieldLookUp", JSON.stringify(fieldLookUp));
                var custitem_bb1_sca_webcategory = fieldLookUp.custitem_bb1_sca_webcategory.length > 0 && fieldLookUp.custitem_bb1_sca_webcategory[0].text;
                var custitem_bb1_sca_customers = fieldLookUp.custitem_bb1_sca_customers;
                var custitem_bb1_sca_standarditem=fieldLookUp.custitem_bb1_sca_standarditem;
                var parent = fieldLookUp.parent;
                if (parent && parent.length == 0) {
                    parent = null;
                }
                if (custitem_bb1_sca_customers && custitem_bb1_sca_customers.length == 0) {
                    custitem_bb1_sca_customers = null;
                }
                if (custitem_bb1_sca_webcategory && !parent) {

                    var index = custitem_bb1_sca_webcategory.indexOf(" / "); //Find the first slash only, this will be the parent category.

                    if (index > -1) {
                        var parentCat = custitem_bb1_sca_webcategory.substring(0, index);
                        var childCat = custitem_bb1_sca_webcategory.substring(index + 3);
                        log.debug("Create Categories", parentCat + " -> " + childCat);

                        var CatRecord = getCategoryRecord("SafeAid Catalogue", parentCat, childCat);
                        //log.debug("custitem_bb1_sca_standarditem", custitem_bb1_sca_standarditem);
                        var itemLine = findItemInCat(CatRecord, currentRecord.id);
                        if (custitem_bb1_sca_standarditem) {
                            if (itemLine == -1) {
                                addItemToCat(CatRecord, currentRecord.id, true);
                                try {
                                    catRecord.save();
                                } catch (err) {
                                    log.debug("Save Cat", "ERROR! Unable to save category. " + parentCat + " \ " + childCat);
                                    retrySave(CatRecord);
                                }
                            }
                            
                        } else {
                            if (itemLine > -1) {
                                removeItemFromCat(CatRecord, itemLine);
                                try {
                                    catRecord.save();
                                } catch (err) {
                                    log.debug("Save Cat", "ERROR! Unable to save category. " + parentCat + " \ " + childCat);
                                    retrySave(CatRecord);
                                }
                            }
                        }
                    }
                }
            }
        }

        function getCategoryRecord(Collection, ParentCat, ChildCat) { //Create a parent and child category.

            var TopCat = "PPE"; //Add another top level category.
            switch (ParentCat) {
                case "Footwear":
                    TopCat = "Footwear";
                    break;
                case "High Visibility":
                    TopCat = "Clothing";
                    break;
                case "Workwear":
                    TopCat = "Clothing";
                    break;
                case "Weatherwear":
                    TopCat = "Clothing";
                    break;
                case "Corporatewear":
                    TopCat = "Clothing";
                    break;
                case "Arc Flash":
                    TopCat = "Clothing";
                    break;
                case "Fire Retardent":
                    TopCat = "Clothing";
                    break;
                case "Skincare":
                    TopCat = "Workplace Safety";
                    break;
                case "Janitorial":
                    TopCat = "Workplace Safety";
                    break;
                case "Site Safety":
                    TopCat = "Workplace Safety";
                    break;
                case "First Aid":
                    TopCat = "Workplace Safety";
                    break;
                case "Signage":
                    TopCat = "Workplace Safety";
                    break;
            }

            var catalogid;
            var filters = [];
            var cols = [];
            //Look for chapter
            filters.push(['name', 'is', Collection]);

            cols.push(search.createColumn({
                name: 'name'
            }));
            var searchResults = search.create({
                type: "commercecatalog",
                columns: cols,
                filters: filters
            });
            var chapterid;

            searchResults.run().each(function (result) {
                catalogid = result.id;
                return false;
            });

            if (!catalogid) { //Create chapter cat
                log.debug("Catalog", "Create Catalog " + Collection);
                var catalogRec = record.create({
                    type: "commercecatalog",
                    isDynamic: true
                });
                catalogRec.setValue({
                    fieldId: 'name',
                    value: Collection,
                    ignoreFieldChange: true
                });
                catalogRec.setValue({
                    fieldId: 'site',
                    value: 2,
                    ignoreFieldChange: true
                });

                catalogid = catalogRec.save();

            }

            //Create Extra Top Cat

            filters = [];
            cols = [];
            //Look for topcat
            filters.push(['isinactive', 'is', 'F']);
            filters.push('AND');
            filters.push(['name', 'is', TopCat]);
            filters.push('AND');
            filters.push(['primaryparent', 'is', '@NONE@']);
            filters.push('AND');
            filters.push(['catalog', 'is', catalogid]);


            cols.push(search.createColumn({
                name: 'name'
            }));
            var searchResults = search.create({
                type: "commercecategory",
                columns: cols,
                filters: filters
            });
            var topcatid;

            searchResults.run().each(function (result) {
                topcatid = result.id;
                return false;
            });

            if (!topcatid) { //Create topcat cat
                log.debug("topcat", "Create Category " + TopCat);
                var topcatRec = record.create({
                    type: "commercecategory",
                    isDynamic: true
                });
                topcatRec.setValue({
                    fieldId: 'name',
                    value: TopCat,
                    ignoreFieldChange: true
                });
                topcatRec.setValue({
                    fieldId: 'pagetitle',
                    value: TopCat,
                    ignoreFieldChange: true
                });
                topcatRec.setValue({
                    fieldId: 'catalog',
                    value: catalogid,
                    ignoreFieldChange: true
                });
                topcatRec.setValue({
                    fieldId: 'urlfragment',
                    value: getUrlFragment(TopCat),
                    ignoreFieldChange: true
                });
                topcatid = topcatRec.save();

            }



            //Create categories (Chapter > Category > Item)
            filters = [];
            cols = [];
            //Look for chapter
            filters.push(['isinactive', 'is', 'F']);
            filters.push('AND');
            filters.push(['name', 'is', ParentCat]);
            filters.push('AND');
            filters.push(['primaryparent', 'is', topcatid]);
            filters.push('AND');
            filters.push(['catalog', 'is', catalogid]);


            cols.push(search.createColumn({
                name: 'name'
            }));
            var searchResults = search.create({
                type: "commercecategory",
                columns: cols,
                filters: filters
            });
            var chapterid;

            searchResults.run().each(function (result) {
                chapterid = result.id;
                return false;
            });

            if (!chapterid) { //Create chapter cat
                log.debug("Chapter", "Create Category " + ParentCat);
                var chapterRec = record.create({
                    type: "commercecategory",
                    isDynamic: true
                });
                chapterRec.setValue({
                    fieldId: 'name',
                    value: ParentCat,
                    ignoreFieldChange: true
                });
                chapterRec.setValue({
                    fieldId: 'pagetitle',
                    value: TopCat + " | " + ParentCat,
                    ignoreFieldChange: true
                });
                chapterRec.setValue({
                    fieldId: 'catalog',
                    value: catalogid,
                    ignoreFieldChange: true
                });
                chapterRec.setValue({
                    fieldId: 'urlfragment',
                    value: getUrlFragment(ParentCat),
                    ignoreFieldChange: true
                });
                chapterRec.setValue({
                    fieldId: 'primaryparent',
                    value: topcatid,
                    ignoreFieldChange: true
                });
                chapterid = chapterRec.save();

            }

            if (ChildCat) {
                //Look for category in chapter

                filters = [];
                cols = [];
                //Look for chapter
                filters.push(['isinactive', 'is', 'F']);
                filters.push('AND');
                filters.push(['name', 'is', ChildCat]);
                filters.push('AND');
                filters.push(['primaryparent', 'is', chapterid]);

                cols.push(search.createColumn({
                    name: 'name'
                }));
                searchResults = search.create({
                    type: "commercecategory",
                    columns: cols,
                    filters: filters
                });
                var categoryid;

                searchResults.run().each(function (result) {
                    categoryid = result.id;
                    return false;
                });

                if (!categoryid) { //Create category cat
                    log.debug("Category", "Create Category " + ChildCat);
                    var categoryRec = record.create({
                        type: "commercecategory",
                        isDynamic: true
                    });
                    categoryRec.setValue({
                        fieldId: 'name',
                        value: ChildCat,
                        ignoreFieldChange: true
                    });
                    categoryRec.setValue({
                        fieldId: 'pagetitle',
                        value: TopCat + " | " + ParentCat + " | " + ChildCat,
                        ignoreFieldChange: true
                    });
                    categoryRec.setValue({
                        fieldId: 'catalog',
                        value: 1,
                        ignoreFieldChange: true
                    });

                    categoryRec.setValue({
                        fieldId: 'primaryparent',
                        value: chapterid,
                        ignoreFieldChange: true
                    });

                    categoryRec.setValue({
                        fieldId: 'urlfragment',
                        value: getUrlFragment(ChildCat),
                        ignoreFieldChange: true
                    });
                    categoryid = categoryRec.save();
                }
                //Check for item
                //
                var catRecord = record.load({
                    type: "commercecategory",
                    id: categoryid,
                    isDynamic: true
                });
                //log.debug("Found Category", ParentCat + " | " + ChildCat);
                return catRecord;
            } else {
                var catRecord = record.load({
                    type: "commercecategory",
                    id: chapterid,
                    isDynamic: true
                });
                //log.debug("Found Category", ParentCat + " | " + ChildCat);
                return catRecord;
            }
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

        function removeItemFromCat(catRecord, line) { //Remove an item from a category
            log.debug("Item", "Remove Line " + line);

            catRecord.removeLine({
                sublistId: 'items',
                line: line,
                ignoreRecalc: true
            });
        }

        function retrySave(rec) { //Try saving again, could be a conflict

            var a = 0;
            for (var i = 0; i < 100000; i++) {
                a += 1;
            }
            try {
                rec.save();
                log.debug("Save Cat", "Worked second time.... for some reason.");
            } catch (err) {
                log.debug("Save Cat", "ERROR! Failed to save for second time.");
            }
        }

        function addItemToCat(catRecord, id, primary) { //Add an item to a category
            log.debug("Item", "Add Item " + id);
            var lineNum = catRecord.selectNewLine({
                sublistId: 'items'
            });
            catRecord.setCurrentSublistValue({
                sublistId: 'items',
                fieldId: 'item',
                value: id,
                ignoreFieldChange: true
            });
            if (primary) {
                catRecord.setCurrentSublistValue({
                    sublistId: 'items',
                    fieldId: 'primarycategory',
                    value: true,
                    ignoreFieldChange: true
                });
            }
            catRecord.commitLine({
                sublistId: 'items'
            });
        }

        function findItemInCat(catRecord, id) { //Find the line number of an item in a category.
            var numLines = catRecord.getLineCount({
                sublistId: 'items'
            });

            var lineItem;
            for (var i = 0; i < numLines; i++) {
                lineItem = catRecord.getSublistValue({
                    sublistId: 'items',
                    fieldId: 'item',
                    line: i
                });
                if (lineItem == id) {
                    return i;
                }
            }
            return -1;
        }



        return {
            afterSubmit: afterSubmit
        };

    });