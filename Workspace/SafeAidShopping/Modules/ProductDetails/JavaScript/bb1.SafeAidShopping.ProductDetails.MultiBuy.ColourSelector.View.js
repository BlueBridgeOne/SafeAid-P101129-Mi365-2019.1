//@module bb1.SafeAidShopping.ProductDetails
define(
 'bb1.SafeAidShopping.ProductDetails.MultiBuy.ColourSelector.View',
 [
  'bb1_safeaidshopping_productdetails_multibuy_colourselector.tpl',
  
  'Backbone',
  'Backbone.CompositeView',
  'jQuery',
  'underscore'
 ],
 function (
  bb1_safeaidshopping_productdetails_multibuy_colourselector_tpl,
  
  Backbone,
  BackboneCompositeView,
  jQuery,
  _
 )
 {
  'use strict';
  
  return Backbone.View.extend({
   
   //@propery {Function} template
   template: bb1_safeaidshopping_productdetails_multibuy_colourselector_tpl,
   
   //@propery {String} pageTitle
   title: 'Colour Selector',
   
   //@propery {String} page_header
   page_header: 'Colour Selector',
   
   //@propery {Object} events
   events: {
    'click [data-action="show-colour"]': 'showColour',
    'click [data-type="close-modal"]': 'closeModal'
   },
   
   //@method initialize
   initialize: function (options)
   {
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.application = options.application;
    this.model = options.model;
   },
   
   //@method showColour
   showColour: function (e)
   {
    var self = this;
    var colourId = self.$(e.target).data('multibuy-colour');
    
    this.application.getLayout().closeModal().done(function() {
     jQuery('html,body').animate({
      scrollTop: jQuery('[data-multibuy-colour="' + colourId + '"]').offset().top
     }, 'fast');
    });
   },
   
   //@method getContext
   getContext: function()
   {
    var model = this.model,
        item = this.model.get('item'),
        colourOptions = item.getOption('custcol_bb1_matrix_colour');
    
    //@class bb1.SafeAidShopping.MultiBuy.View.Context
    return {
     //@property {ProductModel} model
     model: this.model,
     //@property {ItemModel} model
     item: item,
     //@property {Array} colourOptions
     colourOptions: colourOptions.get('values')
    };
   }

  });
  
});