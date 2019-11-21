//@module bb1.SafeAidShopping.ProductDetails
define(
 'bb1.SafeAidShopping.ProductDetails',
 [
  'bb1.SafeAidShopping.ProductDetails.MultiBuy.View',
  'ProductDetails.Full.View',
  'ProductDetails.Base.View',
  'ProductDetails.Options.Selector.View',
  'ProductViews.Option.View',
  'bb1.Cart.AddToCart.Button.View',
  'Cart.Confirmation.Helpers',
  'LiveOrder.Line.Model',
  'Product.Model',
  'ErrorManagement.ResponseErrorParser',
  
  'Backbone.CollectionView',
  'underscore'
 ],
 function (
  ProductDetailsMultiBuyView,
  ProductDetailsFullView,
  ProductDetailsBaseView,
  ProductDetailsOptionsSelectorView,
  ProductViewsOptionView,
  CartAddToCartButtonView,
  CartConfirmationHelpers,
  LiveOrderLineModel,
  ProductModel,
  ErrorManagementResponseErrorParser,
  
  BackboneCollectionView,
  _
 )
 {
  'use strict';
  
  function itemIsMultiBuyMatrix(itemModel) {
  
   if (itemModel instanceof ProductModel) {
    
    var requiredMatrixOptionsForMultiBuy = ['custcol_bb1_matrix_colour', 'custcol_bb1_matrix_size'];
    
    var availableMatrixOptions = _.map(itemModel.get('options').where({isMatrixDimension: true}), function (matrixOption)
    {
     return matrixOption.get('cartOptionId');
    });
    
    if (requiredMatrixOptionsForMultiBuy.length != availableMatrixOptions.length)
     return false;
    
    for (i in requiredMatrixOptionsForMultiBuy) {
     if (availableMatrixOptions.indexOf(requiredMatrixOptionsForMultiBuy[i]) == -1)
      return false;
    }
    
    return true;

   }
   
   return false;
  
  }
   
  ProductDetailsFullView.prototype.childViews['Product.Options'] = _.wrap(ProductDetailsFullView.prototype.childViews['Product.Options'], function (originalProductOptionsView)
  {
   if (!itemIsMultiBuyMatrix(this.model))
    return originalProductOptionsView.apply(this, _.rest(arguments));
  });
  
  ProductDetailsFullView.prototype.childViews['Quantity'] = _.wrap(ProductDetailsFullView.prototype.childViews['Quantity'], function (originalQuantityView)
  {
   if (!itemIsMultiBuyMatrix(this.model))
    return originalQuantityView.apply(this, _.rest(arguments));
  });
  
  return {
   
   mountToApp: function(container) {
    
    var productDetailComponent = container.getComponent('PDP');
    
    productDetailComponent.addChildViews(productDetailComponent.PDP_FULL_VIEW,
    {
     'MultiBuy.MatrixOptions': function ()
     {
      var currentView = productDetailComponent.viewToBeRendered || container.getLayout().getCurrentView();
      
      if (itemIsMultiBuyMatrix(currentView.model))
       return new ProductDetailsMultiBuyView({
        application: container,
        model: currentView.model
       });
     },
     
     'MainActionView': function ()
     {
      var currentView = productDetailComponent.viewToBeRendered || container.getLayout().getCurrentView();
      
      if (!itemIsMultiBuyMatrix(currentView.model)) {
       return new CartAddToCartButtonView({
        application: container,
        model: currentView.model
       });
      }
     }
    });
   }
   
  };
 
});