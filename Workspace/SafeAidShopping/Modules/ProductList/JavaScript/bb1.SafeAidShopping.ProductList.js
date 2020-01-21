//@module bb1.SafeAidShopping.ProductList
define(
 'bb1.SafeAidShopping.ProductList',
 [
  'Facets.Browse.CategoryHeading.View',
  'Facets.ItemCell.View',
  'bb1_safeaidshopping_productlist_category_heading.tpl',
  
  'underscore'
 ],
 function (
  FacetsBrowseCategoryHeadingView,
  FacetsItemCellView,
  bb1_safeaidshopping_productlist_category_heading_tpl,
  
  _
 )
 {
  'use strict';
  
  _.extend(FacetsBrowseCategoryHeadingView.prototype, {
  
   template: bb1_safeaidshopping_productlist_category_heading_tpl
   
  });
 
  FacetsBrowseCategoryHeadingView.prototype.getContext = _.wrap(FacetsBrowseCategoryHeadingView.prototype.getContext, function (originalGetContext)
  {
   var results = originalGetContext.apply(this, _.rest(arguments));
   
   _.extend(results, {
    hasBanner: true,
    banner: results.banner || 'img/safeaid-product-list-banner-desktop.jpg'
   });
   
   return results;
  });

  FacetsItemCellView.prototype.getContext = _.wrap(FacetsItemCellView.prototype.getContext, function (originalGetContext)
  {
   var results = originalGetContext.apply(this, _.rest(arguments));

    var matrixchilditems_detail=this.model.get("matrixchilditems_detail");
    results.isMatrix=matrixchilditems_detail&&matrixchilditems_detail.length>1;
      
   return results;
  });
  
});