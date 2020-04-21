/**
 * Project : P101128
 * 
 * Description : Mi365 orders need to jump through loads of approval rules.
 * Save the results of these rules as JSON data as the calculation takes a few seconds.
 * Display the results as a message in the UI and in My account orders.
 * There is also a status field. Requires Approval/Approved
 * Note: These same calculations are carried out in another script/service for the website cart.
 * 
 * 
 * Also, sync the area and wearer columns/options.
 * 
 * Also, display approval messages using the JSON data.
 * 
 * Also update buyer, wearer, area, rule budgets and quantities.
 * 
 * Also, update area and wearer stock on fulfillment.
 * 
 * Also, checks for standard item permissions.
 * 
 * @Author : Gordon Truslove
 * @Date   : 10/3/2019, 10:43:44 AM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/runtime', 'N/ui/serverWidget', 'N/format', 'N/config', 'N/url', 'N/email'],

    function (record, search, runtime, serverWidget, format, config, url, email) {

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

            if (scriptContext.type == scriptContext.UserEventType.DELETE) return;
            if (runtime.executionContext != "WEBSTORE") {
                var currentRecord = scriptContext.newRecord;

                //Display approval info.
                var custbody_bb1_sca_approvalstatus = currentRecord.getValue({
                    fieldId: 'custbody_bb1_sca_approvalstatus'
                });
                // var custbody_bb1_sca_approvalstatus_text = currentRecord.getText({
                //     fieldId: 'custbody_bb1_sca_approvalstatus'
                // });
                var custbody_bb1_sca_approvalstatus_text = "";
                if (custbody_bb1_sca_approvalstatus == "2") {
                    custbody_bb1_sca_approvalstatus_text = "Approval Required";
                } else if (custbody_bb1_sca_approvalstatus == "3") {
                    custbody_bb1_sca_approvalstatus_text = "Approved";
                }

                var custbody_bb1_sca_approvaldata = currentRecord.getValue({
                    fieldId: 'custbody_bb1_sca_approvaldata'
                });



                if (custbody_bb1_sca_approvalstatus == "2" || custbody_bb1_sca_approvalstatus == "3") {

                    var message = "";
                    var data = {
                        success: true,
                        warnings: []
                    };
                    try {
                        data = JSON.parse(custbody_bb1_sca_approvaldata);
                    } catch (err) {}

                    var warning, warnings = data.warnings || [],
                        values;
                    var durations = {
                        "1": "month",
                        "2": "quarter",
                        "3": "year"
                    };
                    //console.log(warnings);

                    for (var i = 0; i < warnings.length; i++) {
                        warning = warnings[i];
                        values = warning.values;
                        message += (i + 1) + ". ";
                        switch (warning.message) {
                            case "WARNING_BUYER_BUDGET":
                                message += "This order exceeds the buyers budget of £" + values.budget + " for this " + durations[values.duration] + ". ";
                                break;
                            case "WARNING_AREA_BUDGET":
                                message += "This order exceeds " + values.area.text + "'s budget of £" + values.budget + " for this " + durations[values.duration] + ". ";
                                break;
                            case "WARNING_WEARER_BUDGET":
                                message += "This order exceeds " + values.wearer.text + "'s budget of £" + values.budget + " for this " + durations[values.duration] + ". ";
                                break;
                            case "WARNING_RULE_AREA_MAX":
                                message += "Only " + values.max + " " + values.item.text + "'s can be purchased for " + values.area.text + "'s during this " + durations[values.duration] + ". ";
                                break;
                            case "WARNING_RULE_WEARER_MAX":
                                message += "Only " + values.max + " " + values.item.text + "'s can be purchased for " + values.wearer.text + " during this " + durations[values.duration] + ". ";
                                break;
                            case "WARNING_STANDARD_ITEM":
                                message += "Standard item " + values.item.text + " requires approval. ";
                                break;
                            default:
                                message += warning.message + " ";
                                break;
                        }
                    }


                    var messageScript = scriptContext.form.addField({
                        id: 'custpage_messagescript',
                        type: serverWidget.FieldType.INLINEHTML,
                        label: 'Text'
                    });
                    var body = "<script>";
                    body += "require(['N/ui/message' ],function(message) {";

                    body += "var myMsg = message.create({";
                    if (!data.success) {
                        body += "title : \"Mi365: Approval Error\",";
                        body += "message : \"" + JSON.stringify(data.error).split("\"").join("'") + "\",";
                        body += "type : message.Type.ERROR";
                    } else if (custbody_bb1_sca_approvalstatus == "2") {
                        body += "title : \"Mi365: " + custbody_bb1_sca_approvalstatus_text + "\",";
                        body += "message : \"" + message + "\",";
                        body += "type : message.Type.WARNING";
                    } else if (custbody_bb1_sca_approvalstatus == "3") {

                        body += "title : \"Mi365: " + custbody_bb1_sca_approvalstatus_text + "\",";
                        body += "message : \"" + message + "\",";
                        body += "type : message.Type.CONFIRMATION";
                    }


                    body += "});";
                    body += "myMsg.show();";

                    body += "});";
                    body += "</script>"
                    messageScript.defaultValue = body;
                }

                if (custbody_bb1_sca_approvalstatus == "2") {
                    //Display approve button
                    scriptContext.form.clientScriptModulePath = "./bb1_sca_so_approve_cl.js";

                    scriptContext.form.addButton({
                        id: 'custpage_approvebutton',
                        label: 'Mi365 Approve',
                        functionName: 'bb1_approve_so'
                    });
                }

                //hide blank approvers

                var custbody_bb1_sca_approver = currentRecord.getValue({
                    fieldId: 'custbody_bb1_sca_approver'
                });
                if (!custbody_bb1_sca_approver) {
                    var field = scriptContext.form.getField({
                        id: 'custbody_bb1_sca_approver'
                    });
                    field.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN
                    });
                }
                var custbody_bb1_sca_webapprover = currentRecord.getValue({
                    fieldId: 'custbody_bb1_sca_webapprover'
                });
                if (!custbody_bb1_sca_webapprover) {
                    var field = scriptContext.form.getField({
                        id: 'custbody_bb1_sca_webapprover'
                    });
                    field.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN
                    });
                }
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

            if (scriptContext.type == scriptContext.UserEventType.DELETE) return;
            //sync area and wearer
            var currentRecord = scriptContext.newRecord;
            var numLines = currentRecord.getLineCount({
                sublistId: 'item'
            });
            //Note: setting any options wipes all the others (what a joke), so save and replace every time!
            //Given up on that, it now only copies changes from options to the line for web orders.

            for (var i = 0; i < numLines; i++) {

                var custcol_bb1_sca_wearer = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_bb1_sca_wearer',
                    line: i
                });
                var custcol_bb1_sca_area = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_bb1_sca_area',
                    line: i
                });

                var custcol_bb1_sca_wearer2 = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_bb1_sca_wearer2',
                    line: i
                });
                var custcol_bb1_sca_area2 = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_bb1_sca_area2',
                    line: i
                });
                if (custcol_bb1_sca_wearer2) {
                    custcol_bb1_sca_wearer = parseJSONValue(custcol_bb1_sca_wearer2);
                }
                if (custcol_bb1_sca_area2) {
                        custcol_bb1_sca_area = parseJSONValue(custcol_bb1_sca_area2);
                }

                var custcol_bb1_transline_area = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_bb1_transline_area',
                    line: i
                });
                var custcol_bb1_transline_wearer = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_bb1_transline_wearer',
                    line: i
                });



                if (custcol_bb1_sca_wearer != custcol_bb1_transline_wearer) {
                    if (runtime.executionContext == "WEBSTORE") {
                        currentRecord.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_bb1_transline_wearer',
                            line: i,
                            value: custcol_bb1_sca_wearer
                        });
                    }
                }
                if (custcol_bb1_sca_area != custcol_bb1_transline_area) {
                    if (runtime.executionContext == "WEBSTORE") {
                        currentRecord.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_bb1_transline_area',
                            line: i,
                            value: custcol_bb1_sca_area
                        });
                    }
                }
            }

            var contact;
            if (runtime.executionContext == "WEBSTORE") {
                contact = runtime.getCurrentUser().contact;
            } else {
                contact = currentRecord.getValue({
                    fieldId: 'custbody_bb1_buyer'
                });
            }

            log.debug("contact " + runtime.executionContext, JSON.stringify(contact));

            var buyer = getBuyer(contact);

            //force approval for web orders

            if (runtime.executionContext == "WEBSTORE") {
                if (scriptContext.type == scriptContext.UserEventType.CREATE) {

                    currentRecord.setValue({
                        fieldId: 'custbody_bb1_weborderflag',
                        value: true,
                        ignoreFieldChange: true
                    });
                    currentRecord.setValue({
                        fieldId: 'custbody_bb1_onholdsalesorders',
                        value: true,
                        ignoreFieldChange: true
                    });


                    log.debug("Approval Required", (buyer.custentity_bb1_sca_buyer && buyer.custentity_bb1_sca_requiresapproval.value));
                    if (buyer.custentity_bb1_sca_buyer && buyer.custentity_bb1_sca_requiresapproval.value == "3") {
                        currentRecord.setValue({
                            fieldId: 'custbody_bb1_sca_approvalstatus',
                            value: 2,
                            ignoreFieldChange: true
                        });
                    }

                    currentRecord.setValue({
                        fieldId: 'custbody_bb1_buyer',
                        value: contact,
                        ignoreFieldChange: true
                    });
                }
            }

            //get all the data needed formi365 update, have to move this here in order to get the fulfillment change.
            var items = getItems(currentRecord, scriptContext.oldRecord || currentRecord);
            var options;
            var areas = [],
                wearers = [],
                hareas = {},
                hwearers = {},value; //record a list of distict areas and wearers.
            for (var i = 0; i < items.length; i++) {
                if (items[i].options) {
                    options = items[i].options;
                    
                    for (var j = 0; j < options.length; j++) {
                        if (options[j].id == "CUSTCOL_BB1_SCA_AREA"||options[j].id == "CUSTCOL_BB1_SCA_AREA2") {
                            value=parseJSONValue(options[j].value);
                            if (!hareas[value]) {
                                hareas[value] = true;
                                areas.push(value);
                            }
                        } else if (options[j].id == "CUSTCOL_BB1_SCA_WEARER"||options[j].id == "CUSTCOL_BB1_SCA_WEARER2") {
                            value=parseJSONValue(options[j].value);
                            if (!hwearers[value]) {
                                hwearers[value] = true;
                                wearers.push(value);
                            }
                        }
                    }
                }
            }

            var summary = {};
            summary.total = currentRecord.getValue({
                fieldId: 'total'
            });
            var areaDetails = getAreas(areas);
            var wearerDetails = getWearers(wearers);
            var ruleDetails = getRules(areas);


            updateMi365(scriptContext, contact, buyer, summary, items, areaDetails, wearerDetails, ruleDetails);

        }

        /**
         * Function definition to be triggered after record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type
         * @Since 2015.2
         */
        function afterSubmit(scriptContext) {

            if (scriptContext.type == scriptContext.UserEventType.DELETE) return;
            log.debug("afterSubmit " + runtime.executionContext, scriptContext.newRecord.id+" remaining="+runtime.getCurrentScript().getRemainingUsage());
            try {

                //Approval Rules
                var currentRecord = scriptContext.newRecord;
                var contact = currentRecord.getValue({
                    fieldId: 'custbody_bb1_buyer'
                });
                log.debug("contact " + runtime.executionContext, JSON.stringify(contact));

                //Do all these calculations after submit, becuase they take a while.

                var buyer = getBuyer(contact);
                var requiresapproval = buyer && buyer.custentity_bb1_sca_buyer && buyer.custentity_bb1_sca_requiresapproval.value;
                var warnings = [],
                    hwarnings = {};
                var items = getItems(currentRecord, scriptContext.oldRecord || currentRecord);
                //log.debug("items",JSON.stringify(items)+" remaining="+runtime.getCurrentScript().getRemainingUsage());
                var options, wearerChecks = [],
                    areaChecks = []; //Get a list of the checks that are needed.
                var areas = [],
                    wearers = [],
                    hareas = {},
                    hwearers = {},value; //record a list of distict areas and wearers.
                for (var i = 0; i < items.length; i++) {



                    if (items[i].options) {
                        options = items[i].options;
                        for (var j = 0; j < options.length; j++) {
                            
                            if (options[j].id == "CUSTCOL_BB1_SCA_AREA"||options[j].id == "CUSTCOL_BB1_SCA_AREA2") {
                                value=parseJSONValue(options[j].value);
                                areaChecks.push({
                                    item: {
                                        value: items[i].internalid,
                                        text: items[i].displayname
                                    },
                                    quantity: items[i].quantity,
                                    amount: items[i].amount,
                                    amount_formatted: items[i].amount_formatted,
                                    area: {
                                        value: value
                                    }
                                });
                                if (!hareas[value]) {
                                    hareas[value] = true;
                                    areas.push(value);
                                }
                            } else if (options[j].id == "CUSTCOL_BB1_SCA_WEARER"||options[j].id == "CUSTCOL_BB1_SCA_WEARER2") {
                                value=parseJSONValue(options[j].value);
                                //throw(new Error(JSON.stringify(wearerDetails)+" "+JSON.stringify(options[j])));
                                wearerChecks.push({
                                    item: {
                                        value: items[i].internalid,
                                        text: items[i].displayname
                                    },
                                    quantity: items[i].quantity,
                                    amount: items[i].amount,
                                    amount_formatted: items[i].amount_formatted,
                                    wearer: {
                                        value: value
                                    }
                                });
                                if (!hwearers[value]) {
                                    hwearers[value] = true;
                                    wearers.push(value);
                                }
                            }
                        }
                    }
                }

                var summary = {};
                summary.total = currentRecord.getValue({
                    fieldId: 'total'
                });
                //Note: somewhere down the line there will need to be a currency conversion done on all the values, to get back to GBP.

                var currency = currentRecord.getValue({
                    fieldId: 'currency'
                });

                var testing = false; //Force lots of warnings
                //Go through all the rules and check them.
                //Buyer Budget!

                if (buyer) {

                    if (testing || (isTrue(buyer.custentity_bb1_sca_usebudget) && buyer.custentity_bb1_sca_currentspend + summary.total > buyer.custentity_bb1_sca_budget)) {
                        warnings.push({
                            message: "WARNING_BUYER_BUDGET",
                            values: {
                                budget: buyer.custentity_bb1_sca_budget,
                                duration: buyer.custentity_bb1_sca_duration
                            }
                        });
                    }
                }
                //Area Budget!
                var check, area;
                var areaDetails = getAreas(areas);
                var wearerDetails = getWearers(wearers);
                var ruleDetails = getRules(areas);
                //log.debug("ruleDetails",JSON.stringify(ruleDetails)+" remaining="+runtime.getCurrentScript().getRemainingUsage());
                //log.debug("wearerDetails",JSON.stringify(wearerDetails)+" remaining="+runtime.getCurrentScript().getRemainingUsage());
                //log.debug("areaDetails",JSON.stringify(areaDetails)+" remaining="+runtime.getCurrentScript().getRemainingUsage());
                for (var i = 0; i < areaChecks.length; i++) {
                    check = areaChecks[i];
                    area = areaDetails[check.area.value];
                    check.area.text = area.name; //Fix missing value
                    if (testing || (isTrue(area.custrecord_bb1_sca_area_usebudget) && area.custrecord_bb1_sca_area_currentspend + summary.total > area.custrecord_bb1_sca_area_budget)) {
                        if (checkDuplicateWarning(hwarnings, "WARNING_AREA_BUDGET," + check.area.value)) {
                            warnings.push({
                                message: "WARNING_AREA_BUDGET",
                                values: {
                                    area: check.area,
                                    budget: area.custrecord_bb1_sca_area_currentspend,
                                    duration: area.custrecord_bb1_sca_area_duration
                                }
                            });
                        }
                    }
                }
                for (var i = 0; i < wearerChecks.length; i++) {
                    check = wearerChecks[i];
                    wearer = wearerDetails[check.wearer.value];
                    check.wearer.text = wearer.name; //Fix missing value
                    if (testing || (isTrue(wearer.custrecord_bb1_sca_wearer_usebudget) && wearer.custrecord_bb1_sca_wearer_currentspend + summary.total > wearer.custrecord_bb1_sca_wearer_budget)) {
                        if (checkDuplicateWarning(hwarnings, "WARNING_WEARER_BUDGET," + check.wearer.value)) {
                            warnings.push({
                                message: "WARNING_WEARER_BUDGET",
                                values: {
                                    wearer: check.wearer,
                                    budget: wearer.custrecord_bb1_sca_wearer_currentspend,
                                    duration: wearer.custrecord_bb1_sca_wearer_duration
                                }
                            });
                        }
                    }
                }
                var item, rule;
                for (var i = 0; i < items.length; i++) {
                    item = items[i];
                    area = null;
                    wearer = null;
                    //log.debug("item",JSON.stringify(item)+" remaining="+runtime.getCurrentScript().getRemainingUsage());
                   
                    if (requiresapproval == "4") {
                        if (isTrue(item.custitem_bb1_sca_standarditem)) {
                            //Check not in library
                            var myLibrary, entity = contact,
                                inLibrary = false;
                            if (isTrue(buyer.custentity_bb1_sca_overridecustomeritems)) {
                                myLibrary = item.custitem_bb1_sca_buyers;
                            } else {
                                myLibrary = item.custitem_bb1_sca_customers;
                                entity = buyer.company[0].value;
                            }
                            // log.debug("Check standard item","checking..... "+JSON.stringify(entity));
                            // log.debug("My library",JSON.stringify(myLibrary));
                            if (myLibrary) {
                                for (var j = 0; j < myLibrary.length; j++) {
                                    if (myLibrary[j].value == entity.toString()) {
                                        //Item exists in my library, no warning needed
                                        //log.debug("My library", JSON.stringify(myLibrary[i].value) + " " + JSON.stringify(entity));
                                        inLibrary = true;
                                    }

                                }
                            }

                            if (!inLibrary && checkDuplicateWarning(hwarnings, "WARNING_STANDARD_ITEM," + item.intenalid)) {
                                warnings.push({
                                    message: "WARNING_STANDARD_ITEM",
                                    values: {
                                        item: {
                                            value: item.intenalid,
                                            text: item.displayname
                                        }
                                    }
                                });
                            }
                        }
                    }


                    if (item.options) {
                        for (var k = 0; k < item.options.length; k++) {
                            if (item.options[k].id == "CUSTCOL_BB1_SCA_AREA"||item.options[k].id == "CUSTCOL_BB1_SCA_AREA2") {
                                area = parseJSONValue(item.options[k].value);
                            }
                            if (item.options[k].id == "CUSTCOL_BB1_SCA_WEARER"||item.options[k].id == "CUSTCOL_BB1_SCA_WEARER2") {
                                wearer = parseJSONValue(item.options[k].value);
                            }
                        }
                    }
                    if (area) {
                        for (var j = 0; j < ruleDetails.length; j++) {
                            rule = ruleDetails[j];
                            if (rule.custrecord_bb1_sca_rule_area.value == area && (rule.custrecord_bb1_sca_rule_item == item.internalid || rule.custrecord_bb1_sca_rule_item == item.parentid)) {
                                if (rule.custrecord_bb1_sca_rule_wearer && rule.custrecord_bb1_sca_rule_wearer.value != "") {
                                    if (rule.custrecord_bb1_sca_rule_wearer.value == wearer) {
                                        if (testing || rule.custrecord_bb1_sca_rule_purchased + item.quantity > rule.custrecord_bb1_sca_rule_quantity) {
                                            if (checkDuplicateWarning(hwarnings, "WARNING_RULE_WEARER_MAX," + item.intenalid + "," + rule.custrecord_bb1_sca_rule_wearer.value)) {
                                                warnings.push({
                                                    message: "WARNING_RULE_WEARER_MAX",
                                                    values: {
                                                        item: {
                                                            value: item.intenalid,
                                                            text: item.displayname
                                                        },
                                                        wearer: rule.custrecord_bb1_sca_rule_wearer,
                                                        max: rule.custrecord_bb1_sca_rule_quantity,
                                                        duration: rule.custrecord_bb1_sca_rule_duration
                                                    }
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    if (testing || rule.custrecord_bb1_sca_rule_purchased + item.quantity > rule.custrecord_bb1_sca_rule_quantity) {
                                        if (checkDuplicateWarning(hwarnings, "WARNING_RULE_AREA_MAX," + item.intenalid + "," + rule.custrecord_bb1_sca_rule_area.value)) {
                                            warnings.push({
                                                message: "WARNING_RULE_AREA_MAX",
                                                values: {
                                                    item: {
                                                        value: item.intenalid,
                                                        text: item.displayname
                                                    },
                                                    area: rule.custrecord_bb1_sca_rule_area,
                                                    max: rule.custrecord_bb1_sca_rule_quantity,
                                                    duration: rule.custrecord_bb1_sca_rule_duration
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                //log.debug("warnings",JSON.stringify(warnings));
                var result = {
                    success: true,
                    warnings: warnings,
                    item: items

                };

                // ,
                //     items: items,
                //     ruleDetails: ruleDetails,
                //     areas:areas,
                //     areaChecks:areaChecks,
                //     wearerChecks:wearerChecks,
                //     areaDetails:areaDetails

                log.debug("Warnings! " + runtime.executionContext, JSON.stringify(warnings));

                //throw (new Error(JSON.stringify(result, null, 4)));
                submitField(currentRecord.type, currentRecord.id, "custbody_bb1_sca_approvaldata", JSON.stringify(result), false);



                if ((warnings.length > 0 && requiresapproval != "1") || requiresapproval == "3") {


                    //set warnings flag!
                    if (requiresapproval == "2" || requiresapproval == "3" || requiresapproval == "4") {

                        var custbody_bb1_sca_approvalstatus = currentRecord.getValue({
                            fieldId: 'custbody_bb1_sca_approvalstatus'
                        }).toString();
                        log.debug("Alerts Required?", "custbody_bb1_sca_approvalstatus=" + custbody_bb1_sca_approvalstatus);
                        if (!custbody_bb1_sca_approvalstatus != "2" && custbody_bb1_sca_approvalstatus != "3") {
                            submitField(currentRecord.type, currentRecord.id, "custbody_bb1_sca_approvalstatus", 2, false);
                        }
                    }

                    sendAlerts(scriptContext, areas, currentRecord.type, currentRecord.id);
                }

            } catch (err) {
                log.error("afterSubmit", err);
                var result = {
                    success: false,
                    error: err

                };
                submitField(currentRecord.type, currentRecord.id, "custbody_bb1_sca_approvaldata", JSON.stringify(result), false);
            }

        }

        function parseJSONValue(value) { //convert number or {internalid:1,label:"A"} into number.
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
        //send alerts to applicable buyers that this order needs to be approved.
        function sendAlerts(scriptContext, areas, transactiontype, transactionid) {
            if (scriptContext.type == scriptContext.UserEventType.CREATE) {

                var customer = runtime.getCurrentUser().id;

                var filter = [
                    ["custentity_bb1_sca_buyer", "is", "T"],
                    "AND",
                    ["custentity_bb1_sca_allowapproveorders", "is", "T"],
                    "AND",
                    ["company", "is", customer]
                ];
                if (areas && areas.length > 0) {
                    filter.push("AND");
                    filter.push(["custentity_bb1_sca_allowviewareas", "anyof", areas]);
                }
                var contactSearchObj = search.create({
                    type: "contact",
                    filters: filter,
                    columns: [
                        search.createColumn({
                            name: "entityid"
                        })
                    ]
                });
                var subject = "An order requires approval.";
                contactSearchObj.run().each(function (result) {

                    var newAlert = record.create({
                        type: "customrecord_bb1_sca_alert",
                        isDynamic: true
                    });
                    newAlert.setValue({
                        fieldId: 'custrecord_bb1_sca_alert_message',
                        value: subject,
                        ignoreFieldChange: true
                    });
                    newAlert.setValue({
                        fieldId: 'custrecord_bb1_sca_alert_transaction',
                        value: scriptContext.newRecord.id,
                        ignoreFieldChange: true
                    });
                    newAlert.setValue({
                        fieldId: 'custrecord_bb1_sca_alert_buyer',
                        value: result.id,
                        ignoreFieldChange: true
                    });
                    newAlert.save();

                    var params = [];

                    var sourl = "https://checkout.eu2.netsuite.com/c.5474721/s/my_account.ssp?n=2&fragment=purchases#purchases/view/" + transactiontype + "/" + transactionid
                    //  url.resolveRecord({
                    //     recordType: transactiontype,
                    //     recordId: transactionid,
                    //     isEditMode: false
                    // });

                    params.push({
                        name: transactiontype,
                        value: "View in My Account",
                        href: sourl
                    });

                    var from = 8661; //sales
                    emailAlert(from, result.id, "title", subject, null, params);

                    return true;
                });

            }
        }
        //At this point, on create SO, add all the totals and items to the Mi365 record
        //We could add on approval or invoice, but just do it here, it's easier and it doesn't stop anything going through, it's just for information.
        function updateMi365(scriptContext, contact, buyer, summary, items, areaDetails, wearerDetails, ruleDetails) {

            //summary.total   
            //buyer=buyer
            //log.debug("Add to Mi365", "summary.total " + summary.total);
            //log.debug("Add to Mi365", "buyer " + JSON.stringify(buyer));
            //log.debug("Add to Mi365", "items " + JSON.stringify(items));
            if (contact > 0 && scriptContext.type == scriptContext.UserEventType.CREATE) {
                submitField("contact", contact, "custentity_bb1_sca_currentspend", buyer.custentity_bb1_sca_currentspend + summary.total, false);
            }

            if (items) {
                var options, area, wearer,value;
                for (var i = 0; i < items.length; i++) {
                    options = items[i].options;
                    area = null;
                    wearer = null;
                    //items[i].oldquantityfulfilled=0;
                    for (var j = 0; j < options.length; j++) {
                        //update area budgets and rules

                        if (options[j].id == "CUSTCOL_BB1_SCA_AREA"||options[j].id == "CUSTCOL_BB1_SCA_AREA2") {
value=parseJSONValue(options[j].value);
                            area = areaDetails[value];
                            //log.debug("Mi365 Area", options[j].value+"- items " + JSON.stringify(items[i])+" ..... "+JSON.stringify(area));
                            if (area && scriptContext.type == scriptContext.UserEventType.CREATE) {
                                submitField("customrecord_bb1_sca_area", value, "custrecord_bb1_sca_area_currentspend", area.custrecord_bb1_sca_area_currentspend + (items[i].quantity * items[i].amount), false);

                                //log.debug("Mi365 Area", "area " + (area.custrecord_bb1_sca_area_currentspend + (items[i].quantity*items[i].amount)));
                                for (var k = 0; k < ruleDetails.length; k++) {
                                    if (ruleDetails[k].custrecord_bb1_sca_rule_wearer && ruleDetails[k].custrecord_bb1_sca_rule_wearer.value && ruleDetails[k].custrecord_bb1_sca_rule_wearer.value.length > 0) {
                                        if (ruleDetails[k].custrecord_bb1_sca_rule_item == items[i].internalid) {
                                            //log.debug("Mi365 Item", ruleDetails[k].custrecord_bb1_sca_rule_item + "==" + items[i].internalid);
                                            //log.debug("Mi365 Rule", ruleDetails[k].custrecord_bb1_sca_rule_area.value + "==" + parseInt(options[j].value));
                                            if (ruleDetails[k].custrecord_bb1_sca_rule_area && ruleDetails[k].custrecord_bb1_sca_rule_area.value == parseInt(options[j].value)) {
                                                //log.debug("Mi365 Item", "AREA RULE! " + JSON.stringify(ruleDetails[k]));
                                                submitField("customrecord_bb1_sca_rule", ruleDetails[k].internalid, "custrecord_bb1_sca_rule_purchased", ruleDetails[k].custrecord_bb1_sca_rule_purchased + items[i].quantity * items[i].amount, false);
                                            }
                                        }
                                    }
                                }
                            }
                            //update wearer budgets and rules
                        } else if (options[j].id == "CUSTCOL_BB1_SCA_WEARER"||options[j].id == "CUSTCOL_BB1_SCA_WEARER2") {
                            value=parseJSONValue(options[j].value);
                            wearer = wearerDetails[value];
                            //log.debug("Mi365 Wearer", options[j].value+"- items " + JSON.stringify(items[i])+" ..... "+JSON.stringify(wearer));
                            if (wearer && scriptContext.type == scriptContext.UserEventType.CREATE) {
                                submitField("customrecord_bb1_sca_wearer", value, "custrecord_bb1_sca_wearer_currentspend", wearer.custrecord_bb1_sca_wearer_currentspend + (items[i].quantity * items[i].amount), false);

                                //log.debug("Mi365 Wearer", "wearer " + (wearer.custrecord_bb1_sca_wearer_currentspend + (items[i].quantity*items[i].amount)));
                                for (var k = 0; k < ruleDetails.length; k++) {
                                    if (ruleDetails[k].custrecord_bb1_sca_rule_item == items[i].internalid) {
                                        //log.debug("Mi365 Item", ruleDetails[k].custrecord_bb1_sca_rule_item + "==" + items[i].internalid);
                                        //log.debug("Mi365 Rule", ruleDetails[k].custrecord_bb1_sca_rule_wearer.value + "==" + parseInt(options[j].value));
                                        if (ruleDetails[k].custrecord_bb1_sca_rule_wearer && ruleDetails[k].custrecord_bb1_sca_rule_wearer.value == parseInt(options[j].value)) {
                                            //log.debug("Mi365 Item", "WEARER RULE! " + JSON.stringify(ruleDetails[k]));
                                            submitField("customrecord_bb1_sca_rule", ruleDetails[k].internalid, "custrecord_bb1_sca_rule_purchased", ruleDetails[k].custrecord_bb1_sca_rule_purchased + items[i].quantity * items[i].amount, false);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    //Update stock on fulfill
                    //items[i].oldquantityfulfilled=0;
                    if (items[i].quantityfulfilled > items[i].oldquantityfulfilled) {

                        log.debug("updateMi365", items[i].quantityfulfilled + " " + items[i].oldquantityfulfilled + " " + JSON.stringify(wearer) + " " + JSON.stringify(area));

                        var difference = items[i].quantityfulfilled - items[i].oldquantityfulfilled;

                        //Move some stock!
                        if (wearer) {
                            //check if stock exists.
                            var customrecord_bb1_sca_companystockSearchObj = search.create({
                                type: "customrecord_bb1_sca_companystock",
                                filters: [
                                    ["custrecord_bb1_sca_companystock_item", "anyof", items[i].internalid],
                                    "AND",
                                    ["custrecord_bb1_sca_companystock_wearer", "anyof", wearer.internalid],
                                    "AND",
                                    ["custrecord_bb1_sca_companystock_location", "anyof", "2"]
                                ],
                                columns: [
                                    search.createColumn({
                                        name: "custrecord_bb1_sca_companystock_quantity"
                                    })
                                ]
                            });
                            var found = false;
                            customrecord_bb1_sca_companystockSearchObj.run().each(function (result) {
                                found = true;

                                submitField("customrecord_bb1_sca_companystock", result.id, "custrecord_bb1_sca_companystock_quantity", parseInt(result.getValue("custrecord_bb1_sca_companystock_quantity")) + difference, false);
                                return false;
                            });
                            if (!found) {
                                var stockRecord = record.create({
                                    type: "customrecord_bb1_sca_companystock",
                                    isDynamic: true
                                });
                                stockRecord.setValue({
                                    fieldId: 'custrecord_bb1_sca_companystock_item',
                                    value: items[i].internalid,
                                    ignoreFieldChange: true
                                });
                                stockRecord.setValue({
                                    fieldId: 'custrecord_bb1_sca_companystock_wearer',
                                    value: wearer.internalid,
                                    ignoreFieldChange: true
                                });
                                stockRecord.setValue({
                                    fieldId: 'custrecord_bb1_sca_companystock_location',
                                    value: 2,
                                    ignoreFieldChange: true
                                });
                                stockRecord.setValue({
                                    fieldId: 'custrecord_bb1_sca_companystock_quantity',
                                    value: difference,
                                    ignoreFieldChange: true
                                });
                                stockRecord.save();
                            }

                        } else if (area) {
                            //check if stock exists.
                            var customrecord_bb1_sca_companystockSearchObj = search.create({
                                type: "customrecord_bb1_sca_companystock",
                                filters: [
                                    ["custrecord_bb1_sca_companystock_item", "anyof", items[i].internalid],
                                    "AND",
                                    ["custrecord_bb1_sca_companystock_area", "anyof", area.internalid],
                                    "AND",
                                    ["custrecord_bb1_sca_companystock_location", "anyof", "1"]
                                ],
                                columns: [
                                    search.createColumn({
                                        name: "custrecord_bb1_sca_companystock_quantity"
                                    })
                                ]
                            });
                            var found = false;
                            customrecord_bb1_sca_companystockSearchObj.run().each(function (result) {
                                found = true;
                                submitField("customrecord_bb1_sca_companystock", result.id, "custrecord_bb1_sca_companystock_quantity", parseInt(result.getValue("custrecord_bb1_sca_companystock_quantity")) + difference, false);
                                return false;
                            });

                            if (!found) {
                                var stockRecord = record.create({
                                    type: "customrecord_bb1_sca_companystock",
                                    isDynamic: true
                                });
                                stockRecord.setValue({
                                    fieldId: 'custrecord_bb1_sca_companystock_item',
                                    value: items[i].internalid,
                                    ignoreFieldChange: true
                                });
                                stockRecord.setValue({
                                    fieldId: 'custrecord_bb1_sca_companystock_area',
                                    value: area.internalid,
                                    ignoreFieldChange: true
                                });
                                stockRecord.setValue({
                                    fieldId: 'custrecord_bb1_sca_companystock_location',
                                    value: 1,
                                    ignoreFieldChange: true
                                });
                                stockRecord.setValue({
                                    fieldId: 'custrecord_bb1_sca_companystock_quantity',
                                    value: difference,
                                    ignoreFieldChange: true
                                });
                                stockRecord.save();
                            }

                        }
                    }
                }

            }

        }

        function checkDuplicateWarning(hwarnings, warningid) {
            if (hwarnings[warningid]) {
                return false;
            } else {
                hwarnings[warningid] = true;
                return true;
            }
        }

        function isTrue(value) {
            return value == "T" || value === true;
        }

        function getWearers(wearers) {
            if (wearers.length == 0) {
                return {};
            }
            var filter = [
                ["internalid", "anyof", wearers],
                "AND",
                ["isinactive", "is", "F"]

            ];
            var find = [];
            find.push(search.createColumn("name"));
            find.push(search.createColumn("custrecord_bb1_sca_wearer_usebudget"));
            find.push(search.createColumn("custrecord_bb1_sca_wearer_budget"));
            find.push(search.createColumn("custrecord_bb1_sca_wearer_duration"));
            find.push(search.createColumn("custrecord_bb1_sca_wearer_currentspend"));
            find.push(search.createColumn("custrecord_bb1_sca_wearer_startdate"));

            var wearerSearch = search.create({
                type: "customrecord_bb1_sca_wearer",
                filters: filter,
                columns: find
            });
            var results = {},
                wearer;
            if (wearerSearch) {
                wearerSearch.run().each(function (result) {

                    wearer = {
                        internalid: result.id,
                        name: result.getValue("name"),
                        custrecord_bb1_sca_wearer_usebudget: result.getValue("custrecord_bb1_sca_wearer_usebudget"),
                        custrecord_bb1_sca_wearer_budget: result.getValue("custrecord_bb1_sca_wearer_budget"),
                        custrecord_bb1_sca_wearer_duration: result.getValue("custrecord_bb1_sca_wearer_duration"),
                        custrecord_bb1_sca_wearer_currentspend: result.getValue("custrecord_bb1_sca_wearer_currentspend"),
                        custrecord_bb1_sca_wearer_startdate: result.getValue("custrecord_bb1_sca_wearer_startdate")
                    };
                    results[result.id.toString()] = wearer;

                    var custrecord_bb1_sca_wearer_startdate = wearer.custrecord_bb1_sca_wearer_startdate;
                    wearer.custrecord_bb1_sca_wearer_budget = parseFloat(wearer.custrecord_bb1_sca_wearer_budget) || 0;
                    if (custrecord_bb1_sca_wearer_startdate == "") {
                        wearer.custrecord_bb1_sca_wearer_startdate = getStartDate(new Date(), wearer.custrecord_bb1_sca_wearer_duration);
                        wearer.custrecord_bb1_sca_wearer_currentspend = 0;
                        submitField("customrecord_bb1_sca_wearer", result.id, "custrecord_bb1_sca_wearer_startdate", wearer.custrecord_bb1_sca_wearer_startdate, false);
                        submitField("customrecord_bb1_sca_wearer", result.id, "custrecord_bb1_sca_wearer_currentspend", wearer.custrecord_bb1_sca_wearer_currentspend, false);
                    } else {
                        wearer.custrecord_bb1_sca_wearer_startdate = parseDate(wearer.custrecord_bb1_sca_wearer_startdate);
                        wearer.custrecord_bb1_sca_wearer_currentspend = parseFloat(wearer.custrecord_bb1_sca_wearer_currentspend);
                    }
                    var today = new Date();
                    var enddate = getEndDate(wearer.custrecord_bb1_sca_wearer_startdate, wearer.custrecord_bb1_sca_wearer_duration);

                    if (today > enddate) { //Start new duration
                        wearer.custrecord_bb1_sca_wearer_startdate = getStartDate(new Date(), wearer.custrecord_bb1_sca_wearer_duration);
                        wearer.custrecord_bb1_sca_wearer_currentspend = 0;
                        submitField("customrecord_bb1_sca_wearer", result.id, "custrecord_bb1_sca_wearer_startdate", wearer.custrecord_bb1_sca_wearer_startdate, false);
                        submitField("customrecord_bb1_sca_wearer", result.id, "custrecord_bb1_sca_wearer_currentspend", wearer.custrecord_bb1_sca_wearer_currentspend, false);
                    }
                    return true;
                });
            }
            return results;
        }

        function getAreas(areas) {
            if (areas.length == 0) {
                return {};
            }
            var filter = [
                ["internalid", "anyof", areas],
                "AND",
                ["isinactive", "is", "F"]

            ];
            var find = [];
            find.push(search.createColumn("name"));
            find.push(search.createColumn("custrecord_bb1_sca_area_usebudget"));
            find.push(search.createColumn("custrecord_bb1_sca_area_budget"));
            find.push(search.createColumn("custrecord_bb1_sca_area_duration"));
            find.push(search.createColumn("custrecord_bb1_sca_area_currentspend"));
            find.push(search.createColumn("custrecord_bb1_sca_area_startdate"));

            var areaSearch = search.create({
                type: "customrecord_bb1_sca_area",
                filters: filter,
                columns: find
            });
            var results = {},
                area;
            if (areaSearch) {
                areaSearch.run().each(function (result) {
                    area = {
                        internalid: result.id,
                        name: result.getValue("name"),
                        custrecord_bb1_sca_area_usebudget: result.getValue("custrecord_bb1_sca_area_usebudget"),
                        custrecord_bb1_sca_area_budget: result.getValue("custrecord_bb1_sca_area_budget"),
                        custrecord_bb1_sca_area_duration: result.getValue("custrecord_bb1_sca_area_duration"),
                        custrecord_bb1_sca_area_currentspend: result.getValue("custrecord_bb1_sca_area_currentspend"),
                        custrecord_bb1_sca_area_startdate: result.getValue("custrecord_bb1_sca_area_startdate")
                    };

                    results[result.id.toString()] = area;

                    var custrecord_bb1_sca_area_startdate = area.custrecord_bb1_sca_area_startdate;
                    area.custrecord_bb1_sca_area_budget = parseFloat(area.custrecord_bb1_sca_area_budget) || 0;
                    if (custrecord_bb1_sca_area_startdate == "") {
                        area.custrecord_bb1_sca_area_startdate = getStartDate(new Date(), area.custrecord_bb1_sca_area_duration);
                        area.custrecord_bb1_sca_area_currentspend = 0;
                        submitField("customrecord_bb1_sca_area", result.id, "custrecord_bb1_sca_area_startdate", area.custrecord_bb1_sca_area_startdate, false);
                        submitField("customrecord_bb1_sca_area", result.id, "custrecord_bb1_sca_area_currentspend", area.custrecord_bb1_sca_area_currentspend, false);
                    } else {
                        area.custrecord_bb1_sca_area_startdate = parseDate(area.custrecord_bb1_sca_area_startdate);
                        area.custrecord_bb1_sca_area_currentspend = parseFloat(area.custrecord_bb1_sca_area_currentspend);
                    }
                    var enddate = getEndDate(area.custrecord_bb1_sca_area_startdate, area.custrecord_bb1_sca_area_duration);
                    var today = new Date();
                    if (today >= enddate) { //Start new duration
                        area.custrecord_bb1_sca_area_startdate = getStartDate(new Date(), area.custrecord_bb1_sca_area_duration);
                        area.custrecord_bb1_sca_area_currentspend = 0;
                        submitField("customrecord_bb1_sca_area", result.id, "custrecord_bb1_sca_area_startdate", area.custrecord_bb1_sca_area_startdate, false);
                        submitField("customrecord_bb1_sca_area", result.id, "custrecord_bb1_sca_area_currentspend", area.custrecord_bb1_sca_area_currentspend, false);
                    }
                    return true;
                });
            }
            return results;
        }

        function getStartDate(date, duration) {
            switch (duration) {
                case "2": //quarter
                    return new Date(date.getFullYear(), 1 + (4 * Math.floor((date.getMonth() - 1) / 4)), 1);
                    break;
                case "3": //year
                    return new Date(date.getFullYear(), 1, 1);
                    break;
            }
            return new Date(date.getFullYear(), date.getMonth(), 1); //month
        }

        function getEndDate(date, duration) {
            switch (duration) {
                case "2": //quarter
                    return date.setMonth(date.getMonth() + 3);
                    break;
                case "3": //year
                    return date.setMonth(date.getMonth() + 12);
                    break;
            }
            return date.setMonth(date.getMonth() + 1);
        }

        function getBuyer(contact) {
            if (contact) {
                try {
                    contact = parseInt(contact);
                } catch (err) {
                    contact = 0;
                }
            }
            if (!(contact > 0)) {
                return;
            }

            var buyer = search.lookupFields({
                type: search.Type.CONTACT,
                id: contact,
                columns: ['custentity_bb1_sca_buyer', 'custentity_bb1_sca_usebudget', 'custentity_bb1_sca_budget', 'custentity_bb1_sca_duration', 'custentity_bb1_sca_currentspend', 'custentity_bb1_sca_startdate', 'custentity_bb1_sca_requiresapproval', 'custentity_bb1_sca_overridecustomeritems', 'company']
            });
            if (buyer) {
                //log.debug("Buyer Search res", JSON.stringify(buyer));
                //Update Buyer dates.
                if (buyer.custentity_bb1_sca_requiresapproval && buyer.custentity_bb1_sca_requiresapproval.length > 0) {
                    buyer.custentity_bb1_sca_requiresapproval = buyer.custentity_bb1_sca_requiresapproval[0];
                }
                buyer.custentity_bb1_sca_duration = buyer.custentity_bb1_sca_duration[0].value;
                var custentity_bb1_sca_startdate = buyer.custentity_bb1_sca_startdate;
                buyer.custentity_bb1_sca_budget = parseFloat(buyer.custentity_bb1_sca_budget) || 0;
                if (custentity_bb1_sca_startdate == "") {
                    buyer.custentity_bb1_sca_startdate = getStartDate(new Date(), buyer.custentity_bb1_sca_duration.duration);
                    buyer.custentity_bb1_sca_currentspend = 0;
                    submitField("contact", contact, "custentity_bb1_sca_startdate", buyer.custentity_bb1_sca_startdate, false);
                    submitField("contact", contact, "custentity_bb1_sca_currentspend", buyer.custentity_bb1_sca_currentspend, false);
                } else {
                    buyer.custentity_bb1_sca_startdate = parseDate(buyer.custentity_bb1_sca_startdate);
                    buyer.custentity_bb1_sca_currentspend = parseFloat(buyer.custentity_bb1_sca_currentspend);
                }
                var enddate = getEndDate(buyer.custentity_bb1_sca_startdate, buyer.custentity_bb1_sca_duration),
                    today = new Date();

                if (today > enddate) { //Start new duration
                    buyer.custentity_bb1_sca_startdate = getStartDate(new Date(), buyer.custentity_bb1_sca_duration.duration);
                    buyer.custentity_bb1_sca_currentspend = 0;
                    submitField("contact", contact, "custentity_bb1_sca_startdate", buyer.custentity_bb1_sca_startdate, false);
                    submitField("contact", contact, "custentity_bb1_sca_currentspend", buyer.custentity_bb1_sca_currentspend, false);
                }
            } else {
                log.debug("Get Buyer " + runtime.executionContext, "Unable to get buyer " + contact + ".");
            }
            log.debug("Buyer", JSON.stringify(buyer));
            return buyer;
        }

        function getRules(areas) {
            if (areas.length == 0) {
                return [];
            }
            var customrecord_bb1_sca_ruleSearch = search.create({
                type: "customrecord_bb1_sca_rule",
                filters: [
                    ["custrecord_bb1_sca_rule_area", "anyof", areas],
                    "AND",
                    ["isinactive", "is", "F"]
                ],
                columns: [
                    search.createColumn("custrecord_bb1_sca_rule_item"),
                    search.createColumn("custrecord_bb1_sca_rule_area"),
                    search.createColumn("custrecord_bb1_sca_rule_wearer"),
                    search.createColumn("custrecord_bb1_sca_rule_quantity"),
                    search.createColumn("custrecord_bb1_sca_rule_duration"),
                    search.createColumn("custrecord_bb1_sca_rule_startdate"),
                    search.createColumn("custrecord_bb1_sca_rule_purchased")
                ]
            });
            var results = [];
            if (customrecord_bb1_sca_ruleSearch) {
                var rule;
                customrecord_bb1_sca_ruleSearch.run().each(function (result) {

                    rule = {
                        internalid: result.id,
                        custrecord_bb1_sca_rule_item: result.getValue("custrecord_bb1_sca_rule_item"),
                        custrecord_bb1_sca_rule_area: {
                            value: result.getValue("custrecord_bb1_sca_rule_area"),
                            text: result.getText("custrecord_bb1_sca_rule_area")
                        },
                        custrecord_bb1_sca_rule_wearer: {
                            value: result.getValue("custrecord_bb1_sca_rule_wearer"),
                            text: result.getText("custrecord_bb1_sca_rule_wearer")
                        },
                        custrecord_bb1_sca_rule_quantity: result.getValue("custrecord_bb1_sca_rule_quantity"),
                        custrecord_bb1_sca_rule_duration: result.getValue("custrecord_bb1_sca_rule_duration"),
                        custrecord_bb1_sca_rule_startdate: result.getValue("custrecord_bb1_sca_rule_startdate"),
                        custrecord_bb1_sca_rule_purchased: result.getValue("custrecord_bb1_sca_rule_purchased"),
                    };
                    rule.custrecord_bb1_sca_rule_quantity = parseInt(rule.custrecord_bb1_sca_rule_quantity);
                    var custrecord_bb1_sca_rule_startdate = rule.custrecord_bb1_sca_rule_startdate;
                    if (custrecord_bb1_sca_rule_startdate == "") {
                        rule.custrecord_bb1_sca_rule_startdate = new Date();
                        rule.custrecord_bb1_sca_rule_purchased = 0;
                        submitField("customrecord_bb1_sca_rule", result.id, "custrecord_bb1_sca_rule_startdate", rule.custrecord_bb1_sca_rule_startdate, false);
                        submitField("customrecord_bb1_sca_rule", result.id, "custrecord_bb1_sca_rule_purchased", rule.custrecord_bb1_sca_rule_purchased, false);
                    } else {
                        rule.custrecord_bb1_sca_rule_startdate = parseDate(rule.custrecord_bb1_sca_rule_startdate);
                        rule.custrecord_bb1_sca_rule_purchased = parseInt(rule.custrecord_bb1_sca_rule_purchased);
                    }
                    var enddate = new Date(),
                        today = new Date();
                    switch (rule.custrecord_bb1_sca_rule_duration) {
                        case "1": //month
                            enddate = rule.custrecord_bb1_sca_rule_startdate.setMonth(rule.custrecord_bb1_sca_rule_startdate.getMonth() + 1);
                            break;
                        case "2": //quarter
                            enddate = rule.custrecord_bb1_sca_rule_startdate.setMonth(rule.custrecord_bb1_sca_rule_startdate.getMonth() + 3);
                            break;
                        case "3": //year
                            enddate = rule.custrecord_bb1_sca_rule_startdate.setMonth(rule.custrecord_bb1_sca_rule_startdate.getMonth() + 12);
                            break;
                    }
                    if (today > enddate) { //Start new duration
                        rule.custrecord_bb1_sca_rule_startdate = new Date();
                        rule.custrecord_bb1_sca_rule_purchased = 0;
                        submitField("customrecord_bb1_sca_rule", result.id, "custrecord_bb1_sca_rule_startdate", rule.custrecord_bb1_sca_rule_startdate, false);
                        submitField("customrecord_bb1_sca_rule", result.id, "custrecord_bb1_sca_rule_purchased", rule.custrecord_bb1_sca_rule_purchased, false);
                    }

                    results.push(rule);
                    return true;
                });
            }
            return results;

        }

        function submitField(type, id, name, value) { //Simpler SS1 to SS2 conversion.
            var values = {};
            values[name] = value;
            record.submitFields({
                type: type,
                id: id,
                values: values,
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }
            });
        }

        function getItems(currentRecord, oldRecord) {
            //var fields=["internalid", "quantity", "options", "displayname", "amount", "amount_formatted", "parent"];
            var options = ["custcol_bb1_matrix_colour", "custcol_bb1_matrix_size", "custcol_bb1_transline_wearer", "custcol_bb1_transline_area", "custcol_bb1_matrix_footwear", "custcol_bb1_matrix_gloves", "custcol_bb1_matrix_ladieswear", "custcol_bb1_matrix_length", "custcol_bb1_matrix_shoewidths", "custcol_bb1_matrix_signage", "custcol_bb1_matrix_signtype"];
            var numLines = currentRecord.getLineCount({
                sublistId: 'item'
            });
            var items = [],
                item, type, lookup;
            for (var i = 0; i < numLines; i++) {



                //get item details
                item = {};
                item.internalid = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: i
                });
                try {
                    item.displayname = currentRecord.getSublistText({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });
                } catch (err) {
                    item.displayname = "Product #" + item.internalid;
                }
                item.quantity = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    line: i
                });
                item.quantityfulfilled = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantityfulfilled',
                    line: i
                });
                item.oldquantityfulfilled = item.quantityfulfilled;
                try {
                    //get old quantity fulfilled for comparison
                    item.oldquantityfulfilled = oldRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantityfulfilled',
                        line: i
                    });
                } catch (err) {}

                item.amount = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount',
                    line: i
                });
                item.amount_formatted = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount_formatted',
                    line: i
                });
                item.matrixtype = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'matrixtype',
                    line: i
                });
                item.options = [];
                for (var j = 0; j < options.length; j++) {
                    value = currentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: options[j],
                        line: i
                    });
                    if (value) {

                        item.options.push({
                            id: options[j].replace("transline", "sca").toUpperCase(),
                            value: value
                        });

                    }
                }

                type = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'itemtype',
                    line: i
                });
                if (type == "InvtPart") {
                    type = record.Type.INVENTORY_ITEM;
                } else {
                    type = record.Type.ASSEMBLY_ITEM;
                }
                lookup = search.lookupFields({
                    type: type,
                    id: item.internalid,
                    columns: ['parent', 'custitem_bb1_sca_standarditem', 'custitem_bb1_sca_customers', 'custitem_bb1_sca_buyers']
                });
                if (item.matrixtype == "CHILD") {

                    item.parent = lookup.parent;
                    if (item.parent && item.parent.parent && item.parent.parent.length > 0) {
                        item.parent = item.parent.parent[0].value;
                    }
                }

                item.custitem_bb1_sca_standarditem = lookup.custitem_bb1_sca_standarditem;
                item.custitem_bb1_sca_customers = lookup.custitem_bb1_sca_customers;
                item.custitem_bb1_sca_buyers = lookup.custitem_bb1_sca_buyers;

                items.push(item);

            }
            return items;


        }

        function parseDate(date) {
            return format.parse({
                value: date,
                type: format.Type.DATE
            });
        }


        /* BB1 G Truslove Oct 2017 - reusable functions */

        function emailAlert(from, to, title, subject, message, params, reply, attachments) { //BB1 G truslove - email an internal alert
            log.debug("Email alert", "to " + to);
            var body = "";
            var companyinformation = config.load({
                type: config.Type.COMPANY_INFORMATION
            });
            var fromemail = companyinformation.getValue({
                fieldId: 'email'
            });
            if (fromemail && fromemail.length > 0) {
                var companyname = companyinformation.getValue({
                    fieldId: 'companyname'
                });

                body = "<html><body>";
                body += "<div style=\"margin:0 15px\" >";
                body += "<img src=\"https://www.safeaidsupplies.com/s/extensions/SuiteCommerce/SafeAid_Base_Theme/19.1.0/img/Logo.png\" alt=\"Safeaid\" />";


                if (subject) {
                    body += "<h3 style=\"color:#333;\">" + subject + "</h3>";
                }
                if (message) {
                    body += "<p style=\"color:#333;\">" + message.split("\n").join("<br />") + "</p>";
                }
                if (reply) {
                    body += "<p><a href=\"" + reply + "\" style=\"text-decoration:none;color:#028ccf;\">Reply in NetSuite</a></p>";
                }
                body += "</div>";
                if (params && params.length > 0) {
                    body += "<hr style=\"margin:30x 0px;background-color:#EEE;height:1px;border:0;\" />";
                    body += "<div style=\"margin:0 15px\" ><table><tr>";
                    for (var i = 0; i < params.length; i++) {
                        if (i > 0 && i % 2 == 0) {
                            body += "</tr><tr>";
                        }
                        if (params[i].value) {
                            if (params[i].href) {
                                body += "<td style=\"color:#333;padding-right:30px;\"><span style=\"color:#888;\">" + params[i].name + ":</span> <a href=\"" + params[i].href + "\" style=\"text-decoration:none;color:#028ccf;\">" + params[i].value + "</a></td>";
                            } else {
                                body += "<td style=\"color:#333;padding-right:30px;\"><span style=\"color:#888;\">" + params[i].name + ":</span> " + params[i].value + "</td>";
                            }
                        }
                    }
                    body += "</tr></table></div>";
                }
                body += "<hr style=\"margin:30x 0px;background-color:#EEE;height:1px;border:0;\" />";
                body += "<div style=\"margin:0 15px\" >";
                //body += "<p style=\"color:#888;\">© " + companyname + " " + (new Date()).getFullYear() + "</p>";
                body += "<p style=\"color:#CCC;\">Do not reply directly to this message.</p>";
                body += "</div>";
                body += "</body></html>";

                email.send({
                    author: from,
                    recipients: to,
                    subject: 'Website Notification | ' + title,
                    body: body,
                    attachments: attachments
                });
            }
        }



        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        };

    });