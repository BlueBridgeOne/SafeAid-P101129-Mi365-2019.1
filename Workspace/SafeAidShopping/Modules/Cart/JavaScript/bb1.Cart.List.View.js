/*
 © 2019 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define(
 'bb1.Cart.List.View', ['bb1_cart_list.tpl',
  'Backbone', 'underscore', 'Utils', 'Cart.Lines.View', 'Cart.Item.Summary.View', 'Cart.Item.Actions.View'
 ],
 function (
  bb1_cart_list_tpl, Backbone, _, Utils, CartLinesView, CartItemSummaryView, CartItemActionsView
 ) {
  'use strict';

  //@class Cart.AddToCart.Button.View @extend Backbone.View
  return Backbone.View.extend({

   //@property {Function} template
   template: bb1_cart_list_tpl

    ,
   initialize: function (options) {

    //this.model = options.model;
    this.application = options.application;

    this.collection = options.collection;

   },

   render: function () {

    //For the life of me I can't figure out how to do this nesting in handlebars. So I've overridden the render function and done it manually. Works a treat :)
    this.$el.html(this.template(this.getContext()));
    var self = this;
    this.$el.find("[data-view]").each(function (e) {

     var $this = $(this);
     var list = $this.attr("data-list");

     list = (list && list.split(',')) || [];
     var newChild, childModel, newLines = [];
     for (var i = 0; i < list.length; i++) {
      childModel = self.collection.models[parseInt(list[i])];
      newLines.push(childModel);
     }
     for (var i = 0; i < newLines.length; i++) {
      newChild = new CartLinesView({
       navigable: true,
       application: self.application,
       SummaryView: CartItemSummaryView,
       ActionsView: CartItemActionsView,
       showAlert: false,
       model: newLines[i]
      });

      $this.append(newChild.render().el);

     }

    });
    return this;
   },
   getContext: function getContext() {
    //sort the records into an area/wearer tree structure.
    var tree = [],
     currentArea, currentWearer, area, wearer, treeArea, treeWearer,treeModel;
    for (var i = 0; i < this.collection.length; i++) {
     //console.log(this.collection.models[i]);
     treeModel=this.collection.models[i];
     area = treeModel.area;
     wearer = treeModel.wearer;
     if (!currentArea || currentArea.label != area.label) {
      currentArea = area;
      currentWearer = null;
      treeWearer = null;
      treeArea = {
       internalid: area.internalid,
       label: area.label,
       wearers: [],
       models: []
      };
      tree.push(treeArea);
     }
     if (!currentWearer || currentWearer.label != wearer.label) {
      if (!wearer.label) {
       currentWearer = null;
       treeWearer = null;
      } else {
       currentWearer = wearer;
       treeWearer = {
        internalid: wearer.internalid,
        label: wearer.label,
        models: [],
        products:0,
        items:0
       };
       treeArea.wearers.push(treeWearer);
      }
     }
     if (treeWearer) {
      treeWearer.models.push(i);
      treeWearer.hasModels = true;
      treeWearer.products++;
      treeWearer.items+=treeModel.get("quantity");
     } else {
      treeArea.models.push(i);
      treeArea.hasModels = true;
     }
    }
    
    return {
     tree: tree
    };

   }
  });
 });

//@class Cart.AddToCart.Button.View.Initialize.Options
//@property {Product.Model} model This view is only capable of adding new PRODUCTs into the cart.
//If you need to add something else please convert it into a Product.Model.
//