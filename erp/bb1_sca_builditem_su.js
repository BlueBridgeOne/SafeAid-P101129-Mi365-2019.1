/**
 * Project : P101129
 * 
 * Description : Build an item and assemblies when passed a master item id.
 * 
 * @Author : Gordon Truslove
 * @Date   : 7/19/2019, 3:30:25 PM
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
            var item = request.parameters.item;
            try {




                if (item) {

                    var masterItem = record.load({
                        type: record.Type.OTHER_CHARGE_ITEM,
                        id: item,
                        isDynamic: true
                    });
                    var masterItemItemId = masterItem.getValue({
                        fieldId: 'itemid'
                    });

                    var newItemItemId = masterItemItemId;
                    if (newItemItemId && newItemItemId.length > 2 && newItemItemId.substring(newItemItemId.length - 2) == ".M") {
                        newItemItemId = newItemItemId.substring(0, newItemItemId.length - 2) + ".P";
                    } else {
                        newItemItemId = newItemItemId + ".P";
                    }

                    var form = serverWidget.createForm({
                        title: 'Build Item ' + newItemItemId
                    });


                    var itemfield = form.addField({
                        id: 'custpage_item',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Master Item'
                    });
                    itemfield.defaultValue = item;
                    itemfield.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.INLINE
                    });



                    var itemNamefield = form.addField({
                        id: 'custpage_itemid',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Master Item Name/Number'
                    });
                    itemNamefield.defaultValue = masterItemItemId;
                    itemNamefield.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.INLINE
                    });


                    var newItemNamefield = form.addField({
                        id: 'custpage_newitemid',
                        type: serverWidget.FieldType.TEXT,
                        label: 'New Item Name/Number'
                    });
                    newItemNamefield.defaultValue = newItemItemId;
                    newItemNamefield.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.INLINE
                    });

                    var custitem_bb1_sca_baseitem = masterItem.getValue({
                        fieldId: 'custitem_bb1_sca_baseitem'
                    });

                    if (custitem_bb1_sca_baseitem) {
                        var baseItem = record.load({
                            type: record.Type.INVENTORY_ITEM,
                            id: custitem_bb1_sca_baseitem,
                            isDynamic: true
                        });
                        var baseItemItemId = baseItem.getValue({
                            fieldId: 'itemid'
                        });


                        var newBaseItemNamefield = form.addField({
                            id: 'custpage_baseitemid',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Base Item Name/Number'
                        });
                        newBaseItemNamefield.defaultValue = baseItemItemId;
                        newBaseItemNamefield.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.INLINE
                        });


                        var newItemId = createItem(form, newItemItemId, masterItem, baseItem);



                    }
                    context.response.writePage(form);
                } else {
                    //item not found
                    throw (new Error("A master item must be specified."));
                }

            } catch (err) {
                var errform = serverWidget.createForm({
                    title: 'Build Item Failed : ' + (item || "")
                });
                var statusfield = errform.addField({
                    id: 'custpage_status',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Status'
                });
                // statusfield.updateDisplayType({
                //     displayType: serverWidget.FieldDisplayType.INLINE
                // });
                if (err.message) {
                    if (err.message == "Script Execution Usage Limit Exceeded") {
                        statusfield.defaultValue = "<h3>" + err.message + "</h3><p>This item took too long to build. Run build again to finish the remaining child items.</p>";
                    } else {
                        statusfield.defaultValue = "<h3>" + err.message + "</h3><p>" + (err.stack || "") + "</p>";
                    }
                } else {
                    statusfield.defaultValue = err.toString();
                }

                //if(err.stack)
                context.response.writePage(errform);
            }


        }

        function createItem(form, newItemItemId, masterItem, baseItem) {

            //Create new item.
            var newItem, instructions = "";
            var existimgItemId = findExistingItem(newItemItemId);
            log.debug("Find item", "Found id=" + existimgItemId);
            var baseChildren = getItemChildren(baseItem.id, "item");
            log.debug("Find children", "Found " + baseChildren.length);
            var custitem_bb1_sca_basecolours = masterItem.getValue({
                fieldId: 'custitem_bb1_sca_basecolours'
            });
            //remove unneeded colours.
            log.debug("Restrict colours", "custitem_bb1_sca_basecolours " + JSON.stringify(custitem_bb1_sca_basecolours));
            var foundColour = false;
            for (var i = baseChildren.length - 1; i >= 0; i--) {
                foundColour = false;
                for (var j = 0; j < custitem_bb1_sca_basecolours.length; j++) {
                    if (custitem_bb1_sca_basecolours[j] == baseChildren[i].getValue("custitem_bb1_matrix_colour")) {
                        //log.debug("compare colour", custitem_bb1_sca_basecolours[j] + " = " + baseChildren[i].getValue("custitem_bb1_matrix_colour"));

                        foundColour = true;
                        break;
                    }
                }
                if (!foundColour) {
                    baseChildren.splice(i, 1);
                }
            }
            log.debug("Restricted baseChildren", "baseChildren " + baseChildren.length);

            var baseItemMatrixType = baseItem.getValue({
                fieldId: 'matrixtype'
            });

            //base colours
            var baseItemColours = baseItem.getValue({
                fieldId: 'custitem_bb1_matrix_colour'
            });

            var newColours = [];
            for (var i = 0; i < baseItemColours.length; i++) {
                newColours.push(parseInt(baseItemColours[i]))
            }

            for (var i = newColours.length - 1; i >= 0; i--) {
                foundColour = false;
                for (var j = 0; j < custitem_bb1_sca_basecolours.length; j++) {
                    if (custitem_bb1_sca_basecolours[j] == newColours[i]) {
                        foundColour = true;
                        break;
                    }
                }
                if (!foundColour) {
                    newColours.splice(i, 1);
                }
            }
            log.debug("Restricted colours", "from " + baseItemColours.length + " to " + newColours.length);

            //base options
            var baseItemSizes = baseItem.getValue({
                fieldId: 'custitem_bb1_matrix_size'
            });
            var baseItemGloves = baseItem.getValue({
                fieldId: 'custitem_bb1_matrix_gloves'
            });
            var baseItemFootwear = baseItem.getValue({
                fieldId: 'custitem_bb1_matrix_footwear'
            });
            var baseItemLadieswear = baseItem.getValue({
                fieldId: 'custitem_bb1_matrix_ladieswear'
            });
            var baseItemLength = baseItem.getValue({
                fieldId: 'custitem_bb1_matrix_length'
            });

            var parentId;

            var statusfield = form.addField({
                id: 'custpage_status',
                type: serverWidget.FieldType.TEXT,
                label: 'Status'
            });
            statusfield.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE
            });


            if (existimgItemId) {
                statusfield.defaultValue = "Existing Item " + existimgItemId + " Rebuilt";
                log.debug("CREATE", "Item " + existimgItemId + " already exists for " + newItemItemId + ".");
                newItem = record.load({
                    type: record.Type.ASSEMBLY_ITEM,
                    id: existimgItemId,
                    isDynamic: true
                });
                //log.debug("CREATE", "baseChildren.length " + baseChildren.length + " baseItemMatrixType " + baseItemMatrixType + ".");
                if (baseChildren.length > 0 && baseItemMatrixType == "PARENT") {
                    //log.debug("baseChildren.length", baseChildren.length);
                    instruction = setComponents(newItem, masterItem, baseChildren[0]);
                    newItem.setValue({
                        fieldId: 'custitem_bb1_sca_instructions',
                        value: instructions,
                        ignoreFieldChange: true
                    });
                } else if (baseItemMatrixType != "PARENT") {
                    instruction = setComponents(newItem, masterItem, baseItem);
                    newItem.setValue({
                        fieldId: 'custitem_bb1_sca_instructions',
                        value: instructions,
                        ignoreFieldChange: true
                    });
                } else {
                    throw (new Error("Please select at least one valid colour before building this item."));
                }
                newItem.setValue({
                    fieldId: 'custitem_bb1_matrix_colour',
                    value: newColours,
                    ignoreFieldChange: true
                });
                newItem.setValue({
                    fieldId: 'custitem_bb1_matrix_size',
                    value: baseItemSizes,
                    ignoreFieldChange: true
                });
                newItem.setValue({
                    fieldId: 'custitem_bb1_matrix_gloves',
                    value: baseItemGloves,
                    ignoreFieldChange: true
                });
                newItem.setValue({
                    fieldId: 'custitem_bb1_matrix_footwear',
                    value: baseItemFootwear,
                    ignoreFieldChange: true
                });
                newItem.setValue({
                    fieldId: 'custitem_bb1_matrix_ladieswear',
                    value: baseItemLadieswear,
                    ignoreFieldChange: true
                });
                newItem.setValue({
                    fieldId: 'custitem_bb1_matrix_length',
                    value: baseItemLength,
                    ignoreFieldChange: true
                });

                newItem.setValue({
                    fieldId: 'custitem_bb1_sca_lastbuild',
                    value: new Date(),
                    ignoreFieldChange: true
                });


                //Set a few basic values from the master.
                var value, copyValues = ["upccode", "department", "class", "salesdescription", "incomeaccount", "salestaxcode", "isonline", "custitem_bb1_sca_customers", "subsidiary"];
                for (var i = 0; i < copyValues.length; i++) {
                    value = masterItem.getValue({
                        fieldId: copyValues[i]
                    });
                    newItem.setValue({
                        fieldId: copyValues[i],
                        value: value,
                        ignoreFieldChange: true
                    });
                }
                newItem.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                parentId = existimgItemId;
            } else {
                statusfield.defaultValue = "New Item Created";
                log.debug("CREATE", "Create new child " + newItemItemId + ".");
                newItem = record.create({
                    type: record.Type.ASSEMBLY_ITEM,
                    isDynamic: true
                });
                newItem.setValue({
                    fieldId: 'custitem_bb1_sca_lastbuild',
                    value: new Date(),
                    ignoreFieldChange: true
                });
                //Set a few basic values from the master.
                var value, copyValues = ["upccode", "department", "class", "salesdescription", "incomeaccount", "salestaxcode", "isonline", "custitem_bb1_sca_customers", "subsidiary","displayname"];
                for (var i = 0; i < copyValues.length; i++) {
                    value = masterItem.getValue({
                        fieldId: copyValues[i]
                    });
                    newItem.setValue({
                        fieldId: copyValues[i],
                        value: value,
                        ignoreFieldChange: true
                    });
                }

                //copy some values from the base

                var baseItemTemplate = baseItem.getValue({
                    fieldId: 'matrixitemnametemplate'
                });

                var baseItemOptions = baseItem.getValue({
                    fieldId: 'itemoptions'
                });
                var baseItemCogs = baseItem.getValue({
                    fieldId: 'cogsaccount'
                });
                var baseItemAssets = baseItem.getValue({
                    fieldId: 'assetaccount'
                });

                var newItem = record.create({
                    type: record.Type.ASSEMBLY_ITEM,
                    isDynamic: true
                });

                newItem.setValue({
                    fieldId: 'itemid',
                    value: newItemItemId,
                    ignoreFieldChange: true
                });

                newItem.setValue({
                    fieldId: 'cogsaccount',
                    value: baseItemCogs || 116,
                    ignoreFieldChange: true
                });
                newItem.setValue({
                    fieldId: 'assetaccount',
                    value: baseItemAssets || 115,
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


                //log.debug("item", "values set!");

                if (baseChildren.length > 0 && baseItemMatrixType == "PARENT") {
                    log.debug("baseChildren.length", baseChildren.length);
                    instructions = setComponents(newItem, masterItem, baseChildren[0]);
                    newItem.setValue({
                        fieldId: 'custitem_bb1_sca_instructions',
                        value: instructions,
                        ignoreFieldChange: true
                    });
                } else if (baseItemMatrixType != "PARENT") {
                    instruction = setComponents(newItem, masterItem, baseItem);
                    newItem.setValue({
                        fieldId: 'custitem_bb1_sca_instructions',
                        value: instructions,
                        ignoreFieldChange: true
                    });
                } else {
                    throw (new Error("Please select at least one valid colour before building this item."));
                }
                log.debug("save item", "save");
                parentId = newItem.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });




                newItem = record.load({
                    type: record.Type.ASSEMBLY_ITEM,
                    id: parentId,
                    isDynamic: true
                });

                newItem.setValue({
                    fieldId: 'custitem_bb1_matrix_colour',
                    value: newColours,
                    ignoreFieldChange: true
                });
                newItem.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

                //return parentId

            }
            //view button
            form.addButton({
                id: 'custpage_view',
                label: 'View Item',
                functionName: 'bb1_viewitem'
            });
            form.addButton({
                id: 'custpage_viewmaster',
                label: 'View Master Item',
                functionName: 'bb1_viewmasteritem'
            });

            var scriptField = form.addField({
                id: 'custpage_title',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Title'
            });
            //var html="<div class=\"uir-page-title\"><div class=\"page-title-menu noprint\"><div class=\"uir-record-icon\"><img src=\"/uirefresh/img/recordicon/item.svg\" alt=\"\"></div><div class=\"uir-page-title-firstline\" style=\"display:inline-block;\"><h2 class=\"uir-record-type\" >Master Item</h2></div></div>";
            var html = ""; //
            html += "<script>";
            html += "function bb1_viewitem(){";
            html += "document.location='/app/common/item/item.nl?id=" + parentId + "';";
            html += "}";
            html += "function bb1_viewmasteritem(){";
            html += "document.location='/app/common/item/item.nl?id=" + masterItem.id + "';";
            html += "}";
            html += "</script>";
            scriptField.defaultValue = html;

            //Add children.

            var sublist = form.addSublist({
                id: 'custpage_children',
                type: serverWidget.SublistType.STATICLIST,
                label: 'Children'
            });
            sublist.addField({
                id: 'custpage_children_itemid',
                type: serverWidget.FieldType.TEXT,
                label: 'Name/Number'
            });
            sublist.addField({
                id: 'custpage_children_childid',
                type: serverWidget.FieldType.TEXT,
                label: 'Base Child Name/Number'
            });
            sublist.addField({
                id: 'custpage_children_colour',
                type: serverWidget.FieldType.TEXT,
                label: 'Colour'
            });
            sublist.addField({
                id: 'custpage_children_inactive',
                type: serverWidget.FieldType.TEXT,
                label: 'Inactive'
            });
            sublist.addField({
                id: 'custpage_children_accessories',
                type: serverWidget.FieldType.TEXT,
                label: 'Accessories'
            });
            sublist.addField({
                id: 'custpage_children_status',
                type: serverWidget.FieldType.TEXT,
                label: 'Status'
            });


            var newChildren = getItemChildren(parentId, record.Type.ASSEMBLY_ITEM); //Get all the existing children, a diff will be attempted.
            log.debug("Existing children", "found " + newChildren.length);
            var hChildren = {},
                childid; //Children hash table
            for (var i = 0; i < newChildren.length; i++) {
                childid = newChildren[i].getValue("itemid");
                childid = getOptionId(childid);
                hChildren[childid] = newChildren[i];
            }
            //log.debug("Existing Children", JSON.stringify(hChildren));
            //log.debug("baseChildren","length "+baseChildren.length);
            var childItemId, newChild, dot, newChildId, row = {},
                instructions = "",
                count = 0,
                optionId;
            for (var i = 0; i < baseChildren.length; i++) {

                childItemId = baseChildren[i].getValue("itemid");
                optionId = getOptionId(childItemId)
                newChildId = newItemItemId + optionId; //The child id will be this.

                //log.debug("Create Child", "child " + newChildId);

                sublist.setSublistValue({
                    id: 'custpage_children_itemid',
                    line: count,
                    value: newChildId
                });
                sublist.setSublistValue({
                    id: 'custpage_children_childid',
                    line: count,
                    value: baseChildren[i].getValue("itemid")
                });

                sublist.setSublistValue({
                    id: 'custpage_children_inactive',
                    line: count,
                    value: "No"
                });


                if (hChildren[optionId]) { //child already exists
                    log.debug("Create Child", "child exists " + optionId);
                    sublist.setSublistValue({
                        id: 'custpage_children_status',
                        line: count,
                        value: "Existing Child " + hChildren[optionId].id
                    });
                    baseChildColours = baseChildren[i].getValue({
                        name: 'custitem_bb1_matrix_colour'
                    });
                    sublist.setSublistValue({
                        id: 'custpage_children_colour',
                        line: count,
                        value: baseChildren[i].getText({
                            name: 'custitem_bb1_matrix_colour'
                        })
                    });

                    // newChild = record.load({
                    //     type: record.Type.ASSEMBLY_ITEM,
                    //     id: hChildren[optionId].id,
                    //     isDynamic: true
                    // });

                    instructions = hChildren[optionId].getValue("custitem_bb1_sca_instructions");
                    
                    sublist.setSublistValue({
                        id: 'custpage_children_accessories',
                        line: count,
                        value: instructions || "None"
                    });

                    
                } else {
                    log.debug("Create Child", "child is new " + optionId);
                    sublist.setSublistValue({
                        id: 'custpage_children_status',
                        line: count,
                        value: "New Child Created"
                    });
                    newChild = record.create({
                        type: record.Type.ASSEMBLY_ITEM,
                        isDynamic: true
                    });

                    newChild.setValue({
                        fieldId: 'itemid',
                        value: newChildId,
                        ignoreFieldChange: true
                    });
                    newChild.setValue({
                        fieldId: 'parent',
                        value: parentId,
                        ignoreFieldChange: true
                    });

                    newChild.setValue({
                        fieldId: 'isinactive',
                        value: false,
                        ignoreFieldChange: true
                    });

                    newChild.setValue({
                        fieldId: 'cogsaccount',
                        value: baseItemCogs || 116,
                        ignoreFieldChange: true
                    });
                    newChild.setValue({
                        fieldId: 'assetaccount',
                        value: baseItemAssets || 115,
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
                    log.debug("baseItemOptions", JSON.stringify(baseItemOptions));
                    baseChildColours = baseChildren[i].getValue({
                        name: 'custitem_bb1_matrix_colour'
                    });
                    sublist.setSublistValue({
                        id: 'custpage_children_colour',
                        line: count,
                        value: baseChildren[i].getText({
                            name: 'custitem_bb1_matrix_colour'
                        })
                    });

                    newChild.setValue({
                        fieldId: 'matrixoptioncustitem_bb1_matrix_colour',
                        value: parseInt(baseChildColours),
                        ignoreFieldChange: true
                    });


                    newChild.setValue({
                        fieldId: 'matrixoptioncustitem_bb1_matrix_size',
                        value: baseChildren[i].getValue("custitem_bb1_matrix_size"),
                        ignoreFieldChange: true
                    });
                    newChild.setValue({
                        fieldId: 'matrixoptioncustitem_bb1_matrix_gloves',
                        value: baseChildren[i].getValue("custitem_bb1_matrix_gloves"),
                        ignoreFieldChange: true
                    });
                    newChild.setValue({
                        fieldId: 'matrixoptioncustitem_bb1_matrix_footwear',
                        value: baseChildren[i].getValue("custitem_bb1_matrix_footwear"),
                        ignoreFieldChange: true
                    });
                    newChild.setValue({
                        fieldId: 'matrixoptioncustitem_bb1_matrix_ladieswear',
                        value: baseChildren[i].getValue("custitem_bb1_matrix_ladieswear"),
                        ignoreFieldChange: true
                    });
                    newChild.setValue({
                        fieldId: 'matrixoptioncustitem_bb1_matrix_length',
                        value: baseChildren[i].getValue("custitem_bb1_matrix_length"),
                        ignoreFieldChange: true
                    });
                    instructions = setComponents(newChild, masterItem, baseChildren[i]);
                    newChild.setValue({
                        fieldId: 'custitem_bb1_sca_instructions',
                        value: instructions,
                        ignoreFieldChange: true
                    });
                    sublist.setSublistValue({
                        id: 'custpage_children_accessories',
                        line: count,
                        value: instructions || "None"
                    });

                    //log.debug("save child", "child " + i);
                    newChild.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                }


                hChildren[optionId] = null; //Diff, see what's left at the end and inactivate those.
                count++;
            }
            //
            //Inactivate old children
            var dChild;
            for (dChild in hChildren) {
                if (dChild && hChildren[dChild]) {
                    log.debug("Delete Child", hChildren[dChild]);
                    sublist.setSublistValue({
                        id: 'custpage_children_itemid',
                        line: count,
                        value: dChild
                    });
                    sublist.setSublistValue({
                        id: 'custpage_children_colour',
                        line: count,
                        value: hChildren[dChild].getText("custitem_bb1_matrix_colour")
                    });

                    sublist.setSublistValue({
                        id: 'custpage_children_inactive',
                        line: count,
                        value: "Yes"
                    });

                    sublist.setSublistValue({
                        id: 'custpage_children_status',
                        line: count,
                        value: "Child " + hChildren[dChild].id + " no longer in use."
                    });

                    record.submitFields({
                        type: record.Type.ASSEMBLY_ITEM,
                        id: hChildren[dChild].id,
                        values: {
                            isinactive: true
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                    count++;
                }

            }

            return newItem;
        }
        var customrecord_bb1_sca_acc_accessorySearchObj;

        function setComponents(newItem, masterItem, baseChild) { //sets the components on an item or child.

            var found = false;
            var instructions = "";
            //first wipe whatever is in the list. Easier than a diff.
            var numLines = newItem.getLineCount({
                sublistId: 'member'
            });
            for (var i = numLines - 1; i >= 0; i--) {
                newItem.removeLine({
                    sublistId: 'member',
                    line: i,
                    ignoreRecalc: true
                });
            }
            if (baseChild) {
                //Add the up to date components.
                newItem.selectNewLine({
                    sublistId: 'member'
                });

                newItem.setCurrentSublistValue({
                    sublistId: 'member',
                    fieldId: 'item',
                    value: baseChild.id,
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
                found = true;
            }

            //Add master item accessories
            if (!customrecord_bb1_sca_acc_accessorySearchObj) {
                customrecord_bb1_sca_acc_accessorySearchObj = search.create({
                    type: "customrecord_bb1_sca_acc_accessory",
                    filters: [
                        ["custrecord_bb1_sca_acc_masteritem", "anyof", masterItem.id]
                    ],
                    columns: [
                        search.createColumn({
                            name: "scriptid"
                        }),
                        search.createColumn({
                            name: "custrecord_bb1_sca_acc_item"
                        }),
                        search.createColumn({
                            name: "custrecord_bb1_sca_acc_position"
                        })
                    ]
                });
            }
            customrecord_bb1_sca_acc_accessorySearchObj.run().each(function (result) {


                instructions += result.getText("custrecord_bb1_sca_acc_item") + " on " + result.getValue("custrecord_bb1_sca_acc_position") + "\r\n";
                newItem.selectNewLine({
                    sublistId: 'member'
                });

                newItem.setCurrentSublistValue({
                    sublistId: 'member',
                    fieldId: 'item',
                    value: result.getValue("custrecord_bb1_sca_acc_item"),
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
                found = true;
                return true;
            });

            if (!found) {
                throw (new Error("Unable to create an assembly item without any components."));
            }

            return instructions;
        }

        function getItemChildren(ItemId, type) { //gets all the children from an item.
            //Get Children:
            log.debug("getItemChildren", "id=" + ItemId + " " + type);
            var children = [];

            var itemSearchObj = search.create({
                type: type,
                filters: [
                    ["parent", "anyof", ItemId]
                ],
                columns: [
                    search.createColumn({
                        name: "itemid"
                    }),
                    search.createColumn({
                        name: "displayname"
                    }),
                    search.createColumn({
                        name: "salesdescription"
                    }),
                    search.createColumn({
                        name: "type"
                    }),
                    search.createColumn({
                        name: "baseprice"
                    }),
                    search.createColumn({
                        name: "custitem_bb1_matrix_colour"
                    }),
                    search.createColumn({
                        name: "custitem_bb1_matrix_size"
                    }),
                    search.createColumn({
                        name: "custitem_bb1_matrix_gloves"
                    }),
                    search.createColumn({
                        name: "custitem_bb1_matrix_footwear"
                    }),
                    search.createColumn({
                        name: "custitem_bb1_matrix_ladieswear"
                    }),
                    search.createColumn({
                        name: "custitem_bb1_matrix_length"
                    }),
                    search.createColumn({
                        name: "isinactive"
                    }),
                    search.createColumn({
                        name: "custitem_bb1_sca_instructions"
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

            return children;
        }

        function findExistingItem(itemid) {
            var inventoryitemSearchObj = search.create({
                type: record.Type.ASSEMBLY_ITEM,
                filters: [
                    ["itemid", "is", itemid]
                ],
                columns: [
                    search.createColumn({
                        name: "itemid"
                    })
                ]
            });
            var res;
            inventoryitemSearchObj.run().each(function (result) {
                res = result.id;
                return false;
            });
            return res;
        }

        function getOptionId(childItemId) {

            var colon = childItemId.lastIndexOf(" : ");
            var subChildItemId = childItemId.substring(colon + 3);
            colon = childItemId.indexOf(" : ");
            var parentItemId = childItemId.substring(0, colon);

            while (subChildItemId.substring(0, parentItemId.length) != parentItemId) {
                parentItemId = parentItemId.substring(0, parentItemId.length - 1);
            }
            //log.debug("getOptionId",childItemId+"="+subChildItemId.substring(parentItemId.length));
            return subChildItemId.substring(parentItemId.length); //The child id will be this.
        }


        return {
            onRequest: onRequest
        };

    })