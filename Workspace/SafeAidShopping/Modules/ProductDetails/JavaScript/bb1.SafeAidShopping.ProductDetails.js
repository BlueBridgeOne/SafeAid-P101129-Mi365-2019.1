//@module bb1.SafeAidShopping.ProductDetails
define(
 'bb1.SafeAidShopping.ProductDetails',
 [
  'bb1.SafeAidShopping.ProductDetails.MultiBuy.View',
  'bb1.SafeAidShopping.ProductDetails.SizeGuide.View',
  'ProductDetails.Full.View',
  'ProductDetails.Base.View',
  'ProductDetails.Options.Selector.View',
  'ProductViews.Option.View',
  'bb1.Cart.AddToCart.Button.View',
  'Facets.Browse.CategoryHeading.View',
  'Cart.Confirmation.Helpers',
  'LiveOrder.Line.Model',
  'Product.Model',
  'Profile.Model',
  'ErrorManagement.ResponseErrorParser',
  'SC.Configuration',
  
  'bb1_safeaidshopping_productdetails.tpl',
  
  'Backbone.CollectionView',
  'Backbone',
  'underscore',
  'Handlebars'
 ],
 function (
  ProductDetailsMultiBuyView,
  ProductDetailsSizeGuideView,
  ProductDetailsFullView,
  ProductDetailsBaseView,
  ProductDetailsOptionsSelectorView,
  ProductViewsOptionView,
  CartAddToCartButtonView,
  FacetsBrowseCategoryHeadingView,
  CartConfirmationHelpers,
  LiveOrderLineModel,
  ProductModel,
  ProfileModel,
  ErrorManagementResponseErrorParser,
  Configuration,
  
  bb1_safeaidshopping_productdetails_tpl,
  
  BackboneCollectionView,
  Backbone,
  _,
  Handlebars
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
  
  _.extend(ProductDetailsFullView.prototype.baseEvents, {
   'click [data-action="show-size-guide"]': 'showSizeGuide'
  });
  
  _.extend(ProductDetailsFullView.prototype, {
   
   template: bb1_safeaidshopping_productdetails_tpl,
   
   showSizeGuide: function (e) {
    e.preventDefault();
    
    var sizeGuideView = new ProductDetailsSizeGuideView({
     application: this.application,
     sizeGuideType: this.model.get('item').get('custitem_bb1_sca_sizeguide')
    });

    sizeGuideView.showInModal(); 
   },
   
   getContext: _.wrap(ProductDetailsFullView.prototype.getContext, function(originalGetContext) {
    var results = originalGetContext.apply(this, _.rest(arguments));
    
    var ppeSymbolLabels = (this.model.get('item').get('custitem_bb1_sca_ppesymbols') || '').split(/\s*,\s*/);
    var ppeSymbolsConfig = Configuration.get('ppeSymbols.images', []);
    
    
    var ppeSymbols = ppeSymbolLabels.length && _.filter(ppeSymbolsConfig, function(ppeSymbol) {
      
     return ppeSymbolLabels.indexOf(ppeSymbol.text) != -1;
    });
    
    _.extend(results, {
     ppeSymbols: ppeSymbols 
    });
    
    return results;
   }),
   
   showContent: _.wrap(ProductDetailsFullView.prototype.showContent, function(originalShowContent) {
    
    var profile = ProfileModel.getInstance(),
        contactIsBuyer = profile.get('contactIsBuyer'),
        item = this.model.get('item'),
        isStandardItem = item.get('custitem_bb1_sca_standarditem') == 'true'||item.get('custitem_bb1_sca_standarditem')==true;
    

    if (contactIsBuyer) {
      
     var customerShowStandardItems = profile.get('customerShowStandardItems'),
         contactOverrideCustomerItems = profile.get('contactOverrideCustomerItems'),
         contactShowStandardItems = profile.get('contactShowStandardItems');
     
     if (contactOverrideCustomerItems && !contactShowStandardItems) {
      var contactFacetUrlValue = profile.get('contactName');
      var itemFacetUrlValue = (item.get('custitem_bb1_sca_buyers') || '').split(',');
      
      if (itemFacetUrlValue.indexOf(contactFacetUrlValue) == -1)
       return this.application.getLayout().notFound();
     }
     else if (!customerShowStandardItems) {
      var customerFacetUrlValue = profile.get('companyname');
      var itemFacetUrlValue = (item.get('custitem_bb1_sca_customers') || '').split(',');
      
      if (itemFacetUrlValue.indexOf(customerFacetUrlValue) == -1)
       return this.application.getLayout().notFound();
     }
     else {
      if (!isStandardItem) {
       return this.application.getLayout().notFound();
      }
     }
    
    }
    else {
     if (!isStandardItem) {
      return this.application.getLayout().notFound();
     }
    }
     
    var results = originalShowContent.apply(this, _.rest(arguments));
    
    return results;
   })
   
  });
  
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
  
  ProductDetailsFullView.prototype.childViews['Product.CategoryHeading'] = function ()
  {
   var commercecategory = this.model && this.model.get('item').get('commercecategory');
   var category = commercecategory && commercecategory.categories && commercecategory.categories[0];
   
   if (category) {
    return new FacetsBrowseCategoryHeadingView({
     model: new Backbone.Model(category),
     showDescription: false
    });
   }
  };
  
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

    Handlebars.registerHelper('makeSafe', function (obj) {
      obj= (obj||"").split(' ').join('-');
      obj= (obj||"").split('/').join('-');
      return obj;
		});
   }
   
  };
 
});