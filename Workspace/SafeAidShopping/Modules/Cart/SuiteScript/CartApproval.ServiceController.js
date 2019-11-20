define(
 'SafeAid.bb1.CartApproval.ServiceController', [
  'ServiceController'
 ],
 function (
  ServiceController
 ) {
  'use strict';

  return ServiceController.extend({

   name: 'SafeAid.bb1.CartApproval.ServiceController',
   get: function get() {
    nlapiLogExecution("debug", "SafeAid.bb1.CartApproval.ServiceController.get " + request);

    var order = nlapiGetWebContainer().getShoppingSession().getOrder();
    var session = nlapiGetWebContainer().getShoppingSession();
    var context = nlapiGetContext();
    var contact = context.getContact();

    var buyer = this.getBuyer(contact);
    var warnings = [];
    var items = order.getItems(["internalid", "quantity", "options", "displayname", "amount", "amount_formatted", "parent"])||[];
    var options, wearerChecks = [],
     areaChecks = []; //Get a list of the checks that are needed.
    var areas = [],
     wearers = [],
     hareas = {},
     hwearers = {}; //record a list of distict areas and wearers.
    for (var i = 0; i < items.length; i++) {
     if (items[i].options) {
      options = items[i].options;
      for (var j = 0; j < options.length; j++) {
       if (options[j].id == "CUSTCOL_BB1_SCA_AREA") {
        areaChecks.push({
         item: {
          value: items[i].internalid,
          text: items[i].displayname
         },
         quantity: items[i].quantity,
         amount: items[i].amount,
         amount_formatted: items[i].amount_formatted,
         area: {
          value: options[j].value,
          text: options[j].displayvalue
         }
        });
        if (!hareas[options[j].value]) {
         hareas[options[j].value] = true;
         areas.push(options[j].value);
        }
       } else if (options[j].id == "CUSTCOL_BB1_SCA_WEARER") {
        wearerChecks.push({
         item: {
          value: items[i].internalid,
          text: items[i].displayname
         },
         quantity: items[i].quantity,
         amount: items[i].amount,
         amount_formatted: items[i].amount_formatted,
         wearer: {
          value: options[j].value,
          text: options[j].displayvalue
         }
        });
        if (!hwearers[options[j].value]) {
         hwearers[options[j].value] = true;
         wearers.push(options[j].value);
        }
       }
      }
     }
    }

    if (!buyer && (areaChecks.length > 0 || wearerChecks.length > 0)) {
     throw (new Error("Please sign-in to checkout using Mi365."));
    }
    if (!(contact > 0)) {
     return result;
    }

    var summary = order.getOrderSummary(["total"]);
    //Note: somewhere down the line there will need to be a currency conversion done on all the values, to get back to GBP.
    var currency = session.getShopperCurrency();

    var testing = false; //Force lots of warnings
    //Go through all the rules and check them.
    //Buyer Budget!
    var hwarnings={};
    if (testing || buyer.custentity_bb1_sca_currentspend + summary.total > buyer.custentity_bb1_sca_budget) {
     if(this.checkDuplicateWarning(hwarnings,"WARNING_BUYER_BUDGET")){
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
    var areaDetails = this.getAreas(areas);
    var wearerDetails = this.getWearers(wearers);
    var ruleDetails = this.getRules(areas);
    
    for (var i = 0; i < areaChecks.length; i++) {
     check = areaChecks[i];
     area = areaDetails[check.area.value];
     if (testing || area.custrecord_bb1_sca_area_currentspend + summary.total > area.custrecord_bb1_sca_area_budget) {
      if(this.checkDuplicateWarning(hwarnings,"WARNING_AREA_BUDGET,"+check.area.value)){
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
    //
    for (var i = 0; i < wearerChecks.length; i++) {
     check = wearerChecks[i];
     wearer = wearerDetails[check.wearer.value];
     if (wearer) {
      if (testing || wearer.custrecord_bb1_sca_wearer_currentspend + summary.total > wearer.custrecord_bb1_sca_wearer_budget) {
       if(this.checkDuplicateWarning(hwarnings,"WARNING_WEARER_BUDGET,"+check.wearer.value)){
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
     // else{
     //  throw(new Error("Wearer not found! "+i+" "+JSON.stringify(check)+" check.wearer.value "+check.wearer.value+" "+JSON.stringify(wearerDetails)+" "+JSON.stringify(wearerChecks)));
     // }
    }
    var item, rule;
    for (var i = 0; i < items.length; i++) {
     item = items[i];
     area = null;
     wearer = null;
     if (item.options) {
      for (var k = 0; k < item.options.length; k++) {
       if (item.options[k].id == "CUSTCOL_BB1_SCA_AREA") {
        area = item.options[k].value;
       }
       if (item.options[k].id == "CUSTCOL_BB1_SCA_WEARER") {
        wearer = item.options[k].value;
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
           if(this.checkDuplicateWarning(hwarnings,"WARNING_RULE_WEARER_MAX,"+item.intenalid+","+rule.custrecord_bb1_sca_rule_wearer.value)){
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
          if(this.checkDuplicateWarning(hwarnings,"WARNING_RULE_AREA_MAX,"+item.intenalid+","+rule.custrecord_bb1_sca_rule_area.value)){
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


    var result = {
     success: true,
     warnings: warnings
    };


    // summary: summary,
    // 
    // currency: currency,
    // buyer: buyer,
    // areaChecks: areaChecks,
    // wearerChecks: wearerChecks,
    // areas: areas,
    // wearers: wearers,
    // areaDetails: areaDetails,
    // wearerDetails: wearerDetails,
    // ruleDetails: ruleDetails


    var customer = context.getUser();

    return result;
   },
   checkDuplicateWarning:function(hwarnings,warningid){
    if(hwarnings[warningid]){
     return false;
    }else{
     hwarnings[warningid]=true;
     return true;
    }
   }
   ,
   getWearers: function (wearers) {
    if (wearers.length == 0) {
     return {};
    }
    var filter = [
     ["internalid", "anyof", wearers],
     "AND",
     ["isinactive", "is", "F"]

    ];
    var find = [];

    find.push(new nlobjSearchColumn("custrecord_bb1_sca_wearer_budget"));
    find.push(new nlobjSearchColumn("custrecord_bb1_sca_wearer_duration"));
    find.push(new nlobjSearchColumn("custrecord_bb1_sca_wearer_currentspend"));
    find.push(new nlobjSearchColumn("custrecord_bb1_sca_wearer_startdate"));

    var wearerSearch = nlapiSearchRecord("customrecord_bb1_sca_wearer", null,
     filter,
     find
    );
    var result, results = {},
     wearer;
    if (wearerSearch) {
     for (var i = 0; i < wearerSearch.length; i++) {
      result = wearerSearch[i];
      wearer = {
       custrecord_bb1_sca_wearer_budget: result.getValue("custrecord_bb1_sca_wearer_budget"),
       custrecord_bb1_sca_wearer_duration: result.getValue("custrecord_bb1_sca_wearer_duration"),
       custrecord_bb1_sca_wearer_currentspend: result.getValue("custrecord_bb1_sca_wearer_currentspend"),
       custrecord_bb1_sca_wearer_startdate: result.getValue("custrecord_bb1_sca_wearer_startdate")
      };
      results[result.getId().toString()] = wearer;

      var custrecord_bb1_sca_wearer_startdate = wearer.custrecord_bb1_sca_wearer_startdate;
      wearer.custrecord_bb1_sca_wearer_budget = parseFloat(wearer.custrecord_bb1_sca_wearer_budget) || 0;
      if (custrecord_bb1_sca_wearer_startdate == "") {
       wearer.custrecord_bb1_sca_wearer_startdate = this.getStartDate(new Date(), wearer.custrecord_bb1_sca_wearer_duration);
       wearer.custrecord_bb1_sca_wearer_currentspend = 0;
       nlapiSubmitField("customrecord_bb1_sca_wearer", result.getId(), "custrecord_bb1_sca_wearer_startdate", wearer.custrecord_bb1_sca_wearer_startdate, false);
       nlapiSubmitField("customrecord_bb1_sca_wearer", result.getId(), "custrecord_bb1_sca_wearer_currentspend", wearer.custrecord_bb1_sca_wearer_currentspend, false);
      } else {
       wearer.custrecord_bb1_sca_wearer_startdate = new Date(wearer.custrecord_bb1_sca_wearer_startdate);
       wearer.custrecord_bb1_sca_wearer_currentspend = parseFloat(wearer.custrecord_bb1_sca_wearer_currentspend);
      }
      var today = new Date();
      var enddate = this.getEndDate(wearer.custrecord_bb1_sca_wearer_startdate, wearer.custrecord_bb1_sca_wearer_duration);

      if (today > enddate) { //Start new duration
       wearer.custrecord_bb1_sca_wearer_startdate = this.getStartDate(new Date(), wearer.custrecord_bb1_sca_wearer_duration);
       wearer.custrecord_bb1_sca_wearer_currentspend = 0;
       nlapiSubmitField("customrecord_bb1_sca_wearer", result.getId(), "custrecord_bb1_sca_wearer_startdate", wearer.custrecord_bb1_sca_wearer_startdate, false);
       nlapiSubmitField("customrecord_bb1_sca_wearer", result.getId(), "custrecord_bb1_sca_wearer_currentspend", wearer.custrecord_bb1_sca_wearer_currentspend, false);
      }

     }
    }
    return results;
   },
   getAreas: function (areas) {
    if (areas.length == 0) {
     return {};
    }
    var filter = [
     ["internalid", "anyof", areas],
     "AND",
     ["isinactive", "is", "F"]

    ];
    var find = [];

    find.push(new nlobjSearchColumn("custrecord_bb1_sca_area_budget"));
    find.push(new nlobjSearchColumn("custrecord_bb1_sca_area_duration"));
    find.push(new nlobjSearchColumn("custrecord_bb1_sca_area_currentspend"));
    find.push(new nlobjSearchColumn("custrecord_bb1_sca_area_startdate"));

    var areaSearch = nlapiSearchRecord("customrecord_bb1_sca_area", null,
     filter,
     find
    );
    var result, results = {},
     area;
    if (areaSearch) {
     for (var i = 0; i < areaSearch.length; i++) {
      result = areaSearch[i];
      area = {
       custrecord_bb1_sca_area_budget: result.getValue("custrecord_bb1_sca_area_budget"),
       custrecord_bb1_sca_area_duration: result.getValue("custrecord_bb1_sca_area_duration"),
       custrecord_bb1_sca_area_currentspend: result.getValue("custrecord_bb1_sca_area_currentspend"),
       custrecord_bb1_sca_area_startdate: result.getValue("custrecord_bb1_sca_area_startdate")
      };
      results[result.getId().toString()] = area;

      var custrecord_bb1_sca_area_startdate = area.custrecord_bb1_sca_area_startdate;
      area.custrecord_bb1_sca_area_budget = parseFloat(area.custrecord_bb1_sca_area_budget) || 0;
      if (custrecord_bb1_sca_area_startdate == "") {
       area.custrecord_bb1_sca_area_startdate = this.getStartDate(new Date(), area.custrecord_bb1_sca_area_duration);
       area.custrecord_bb1_sca_area_currentspend = 0;
       nlapiSubmitField("customrecord_bb1_sca_area", result.getId(), "custrecord_bb1_sca_area_startdate", area.custrecord_bb1_sca_area_startdate, false);
       nlapiSubmitField("customrecord_bb1_sca_area", result.getId(), "custrecord_bb1_sca_area_currentspend", area.custrecord_bb1_sca_area_currentspend, false);
      } else {
       area.custrecord_bb1_sca_area_startdate = new Date(area.custrecord_bb1_sca_area_startdate);
       area.custrecord_bb1_sca_area_currentspend = parseFloat(area.custrecord_bb1_sca_area_currentspend);
      }
      var enddate = this.getEndDate(area.custrecord_bb1_sca_area_startdate, area.custrecord_bb1_sca_area_duration);
      var today = new Date();
      if (today >= enddate) { //Start new duration
       area.custrecord_bb1_sca_area_startdate = this.getStartDate(new Date(), area.custrecord_bb1_sca_area_duration);
       area.custrecord_bb1_sca_area_currentspend = 0;
       nlapiSubmitField("customrecord_bb1_sca_area", result.getId(), "custrecord_bb1_sca_area_startdate", area.custrecord_bb1_sca_area_startdate, false);
       nlapiSubmitField("customrecord_bb1_sca_area", result.getId(), "custrecord_bb1_sca_area_currentspend", area.custrecord_bb1_sca_area_currentspend, false);
      }

     }
    }
    return results;
   },
   getStartDate: function (date, duration) {
    switch (duration) {
     case "2": //quarter
      return new Date(date.getFullYear(), 1 + (4 * Math.floor((date.getMonth() - 1) / 4)), 1);
      break;
     case "3": //year
      return new Date(date.getFullYear(), 1, 1);
      break;
    }
    return new Date(date.getFullYear(), date.getMonth(), 1); //month
   },
   getEndDate: function (date, duration) {
    switch (duration) {
     case "2": //quarter
      return date.setMonth(date.getMonth() + 3);
      break;
     case "3": //year
      return date.setMonth(date.getMonth() + 12);
      break;
    }
    return date.setMonth(date.getMonth() + 1);
   },
   getBuyer: function (contact) {
    if (!(contact > 0)) {
     return;
    }
    var buyer = nlapiLookupField('contact', contact, ['custentity_bb1_sca_budget', 'custentity_bb1_sca_duration', 'custentity_bb1_sca_currentspend', 'custentity_bb1_sca_startdate']);
    if (buyer) {
     //Update Buyer dates.
     var custentity_bb1_sca_startdate = buyer.custentity_bb1_sca_startdate;
     buyer.custentity_bb1_sca_budget = parseFloat(buyer.custentity_bb1_sca_budget) || 0;
     if (custentity_bb1_sca_startdate == "") {
      buyer.custentity_bb1_sca_startdate = this.getStartDate(new Date(), buyer.custentity_bb1_sca_duration.duration);
      buyer.custentity_bb1_sca_currentspend = 0;
      nlapiSubmitField("contact", contact, "custentity_bb1_sca_startdate", buyer.custentity_bb1_sca_startdate, false);
      nlapiSubmitField("contact", contact, "custentity_bb1_sca_currentspend", buyer.custentity_bb1_sca_currentspend, false);
     } else {
      buyer.custentity_bb1_sca_startdate = new Date(buyer.custentity_bb1_sca_startdate);
      buyer.custentity_bb1_sca_currentspend = parseFloat(buyer.custentity_bb1_sca_currentspend);
     }
     var enddate = this.getEndDate(buyer.custentity_bb1_sca_startdate, buyer.custentity_bb1_sca_duration),
      today = new Date();

     if (today > enddate) { //Start new duration
      buyer.custentity_bb1_sca_startdate = this.getStartDate(new Date(), buyer.custentity_bb1_sca_duration.duration);
      buyer.custentity_bb1_sca_currentspend = 0;
      nlapiSubmitField("contact", contact, "custentity_bb1_sca_startdate", buyer.custentity_bb1_sca_startdate, false);
      nlapiSubmitField("contact", contact, "custentity_bb1_sca_currentspend", buyer.custentity_bb1_sca_currentspend, false);
     }
    }
    return buyer;
   },
   getRules: function (areas) {
    if (areas.length == 0) {
     return [];
    }
    var customrecord_bb1_sca_ruleSearch = nlapiSearchRecord("customrecord_bb1_sca_rule", null,
     [
      ["custrecord_bb1_sca_rule_area", "anyof", areas],
      "AND",
      ["isinactive", "is", "F"]
     ],
     [
      new nlobjSearchColumn("custrecord_bb1_sca_rule_item"),
      new nlobjSearchColumn("custrecord_bb1_sca_rule_area"),
      new nlobjSearchColumn("custrecord_bb1_sca_rule_wearer"),
      new nlobjSearchColumn("custrecord_bb1_sca_rule_quantity"),
      new nlobjSearchColumn("custrecord_bb1_sca_rule_duration"),
      new nlobjSearchColumn("custrecord_bb1_sca_rule_startdate"),
      new nlobjSearchColumn("custrecord_bb1_sca_rule_purchased")
     ]
    );
    var results = [];
    if (customrecord_bb1_sca_ruleSearch) {
     var result,
      rule;
     for (var i = 0; i < customrecord_bb1_sca_ruleSearch.length; i++) {
      result = customrecord_bb1_sca_ruleSearch[i];
      rule = {
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
       nlapiSubmitField("customrecord_bb1_sca_rule", result.getId(), "custrecord_bb1_sca_rule_startdate", rule.custrecord_bb1_sca_rule_startdate, false);
       nlapiSubmitField("customrecord_bb1_sca_rule", result.getId(), "custrecord_bb1_sca_rule_purchased", rule.custrecord_bb1_sca_rule_purchased, false);
      } else {
       rule.custrecord_bb1_sca_rule_startdate = new Date(rule.custrecord_bb1_sca_rule_startdate);
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
       nlapiSubmitField("customrecord_bb1_sca_rule", result.getId(), "custrecord_bb1_sca_rule_startdate", rule.custrecord_bb1_sca_rule_startdate, false);
       nlapiSubmitField("customrecord_bb1_sca_rule", result.getId(), "custrecord_bb1_sca_rule_purchased", rule.custrecord_bb1_sca_rule_purchased, false);
      }

      results.push(rule);
     }
    }
    return results;

   }



  });
 }
);