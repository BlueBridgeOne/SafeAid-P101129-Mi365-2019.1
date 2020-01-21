//@module bb1.SafeAidShopping.MyCatalogue
define(
 'bb1.SafeAidShopping.MyCatalogue.ItemCell.View',
 [ 
  'Facets.ItemCell.View',
  'bb1.SafeAidShopping.ProductDetails.MultiBuy.View',
  'Product.Model',

  'bb1_safeaidshopping_mycatalogue_itemcell.tpl',

  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  FacetsItemCellView,
  ProductDetailsMultiBuyView,
  ProductModel,

  bb1_safeaidshopping_mycatalogue_itemcell_tpl,

  Backbone,
  _,
  Utils
 )
{
 'use strict';

 //@class bb1.SafeAidShopping.MyCatalogue.ItemCell.View @extends Facets.ItemCell.View
 return FacetsItemCellView.extend({
  
  //@propery {Function} template
  template: bb1_safeaidshopping_mycatalogue_itemcell_tpl,
  
  //@method initialize
  initialize: function (options)
  {
   FacetsItemCellView.prototype.initialize.apply(this, arguments);
   this.application = options.application;
   this.model = options.model;
  },

  // @property {Object} childViews
  childViews: _.extend(FacetsItemCellView.prototype.childViews, {
 
   'MultiBuy.MatrixOptions': function ()
   {
    var product = new ProductModel({
     item: this.model
    });
   console.log(product);
   console.log(product);
    return new ProductDetailsMultiBuyView({
     application: this.application,
     model: product,
     modelToUpdate: this.options.parentModel,
     hideActions: true,
     showSingleQuantity: true
    });
   }
   
  })
  
 });

});
