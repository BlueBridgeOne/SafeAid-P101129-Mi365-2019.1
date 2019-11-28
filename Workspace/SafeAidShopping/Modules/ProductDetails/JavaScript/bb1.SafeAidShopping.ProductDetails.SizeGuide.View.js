//@module bb1.SafeAidShopping.ProductDetails
define(
 'bb1.SafeAidShopping.ProductDetails.SizeGuide.View',
 [
  'bb1_safeaidshopping_productdetails_sizeguide.tpl',
  
  'Backbone',
  'jQuery',
  'underscore'
 ],
 function (
  bb1_safeaidshopping_productdetails_sizeguide_tpl,
  
  Backbone,
  jQuery,
  _
 )
 {
  'use strict';
  
  return Backbone.View.extend({
   
   //@propery {Function} template
   template: bb1_safeaidshopping_productdetails_sizeguide_tpl,
   
   //@propery {String} title
   title: 'Size Guide',
   
   //@propery {String} page_header
   page_header: 'Size Guide',
   
   //@propery {Object} events
   events: {
    'click [data-type="close-modal"]': 'closeModal'
   },
   
   //@method initialize
   initialize: function (options)
   {
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.application = options.application;
    this.page_header = (options.sizeGuideType ? options.sizeGuideType + ' ' : '') + 'Size Guide';
   },
   
   //@method getContext
   getContext: function()
   {
    //@class bb1.SafeAidShopping.SizeGuide.View.Context
    return {
     //@property {Array} sizeGuideType
     sizeGuideType: this.options.sizeGuideType || ''
    };
   }

  });
  
});