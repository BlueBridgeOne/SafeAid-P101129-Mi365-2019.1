/*
 © 2019 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define(
 'bb1.Cart.Approval.View', ['bb1_cart_approval.tpl',
  'Backbone', 'underscore', 'Utils'
 ],
 function (
  bb1_cart_approval_tpl, Backbone, _, Utils
 ) {
  'use strict';

  //@class Cart.AddToCart.Button.View @extend Backbone.View
  return Backbone.View.extend({

   //@property {Function} template
   template: bb1_cart_approval_tpl,
   title: "Approval Required",
   initialize: function (options) {

    this.application = options.application;

   },

   getContext: function getContext() {
    
    var warning, warnings = this.model.get("warnings"),values;
    var durations={"1":"month","2":"quarter","3":"year"};
    //console.log(warnings);
    for (var i = 0; i < warnings.length; i++) {
     warning = warnings[i];
     values=warning.values;
     switch (warning.message) {
      case "WARNING_BUYER_BUDGET":
        warning.text="The order exceeds your budget of £"+values.budget+" for this "+durations[values.duration]+".";
       break;
      case "WARNING_AREA_BUDGET":
        warning.text="The order exceeds "+values.area.text+"'s budget of £"+values.budget+" for this "+durations[values.duration]+".";
       break;
       case "WARNING_WEARER_BUDGET":
        warning.text="The order exceeds "+values.wearer.text+"'s budget of £"+values.budget+" for this "+durations[values.duration]+".";
       break;
      case "WARNING_RULE_AREA_MAX":
        warning.text="Only "+values.max+" "+values.item.text+"'s can be purchased for "+values.area.text+"'s during this "+durations[values.duration]+".";
       break;
      case "WARNING_RULE_WEARER_MAX":
        warning.text="Only "+values.max+" "+values.item.text+"'s can be purchased for "+values.wearer.text+" during this "+durations[values.duration]+".";
       break;
       case "WARNING_STANDARD_ITEM":
                                warning.text = "Standard item " + values.item.text + " requires approval. ";
                                break;
     }
    }
    
    return {
     warnings: warnings,
     length:warnings.length
    };
   

   }
  });
 });

//@class Cart.AddToCart.Button.View.Initialize.Options
//@property {Product.Model} model This view is only capable of adding new PRODUCTs into the cart.
//If you need to add something else please convert it into a Product.Model.
//