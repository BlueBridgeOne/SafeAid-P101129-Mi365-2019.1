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
  ) {
    'use strict';

    if (!String.prototype.trim) {
      (function () {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function () {
          return this.replace(rtrim, '');
        };
      })();
    }


    function itemIsMultiBuyMatrix(itemModel) {

      if (itemModel instanceof ProductModel) {

        var requiredMatrixOptionsForMultiBuy = ['custcol_bb1_matrix_colour', 'custcol_bb1_matrix_size', 'custcol_bb1_matrix_gloves', 'custcol_bb1_matrix_footwear', 'custcol_bb1_matrix_ladieswear'];

        var availableMatrixOptions = _.map(itemModel.get('options').where({
          isMatrixDimension: true
        }), function (matrixOption) {

          return matrixOption.get('cartOptionId');
        });

        // if (requiredMatrixOptionsForMultiBuy.length != availableMatrixOptions.length)
        //  return false;

        var found = 0,
          foundColour;

        for (i in availableMatrixOptions) {
          if (requiredMatrixOptionsForMultiBuy.indexOf(availableMatrixOptions[i]) > -1) {
            found++;
            if (availableMatrixOptions[i] == 'custcol_bb1_matrix_colour') {
              foundColour = true;
            }
          }
        }

        if (found < 2 || !foundColour) {
          return false;
        }

        return true;

      }

      return false;

    }
    ProductDetailsBaseView.prototype.updateURL = function updateURL() //stop the unneeded redirects!
    {
      var url = this.model.generateURL();

      var cust = url.indexOf("&custcol");
      if (cust > -1) {
        url = url.substring(0, cust);
      }
      cust = url.indexOf("&color");
      if (cust > -1) {
        url = url.substring(0, cust);
      }
      cust = url.indexOf("?quantity");
      if (cust > -1) {
        url = url.substring(0, cust);
      }
      Backbone.history.navigate(url, {
        replace: true
      });
    }
    _.extend(ProductDetailsFullView.prototype, {

      template: bb1_safeaidshopping_productdetails_tpl,

      getContext: _.wrap(ProductDetailsFullView.prototype.getContext, function (originalGetContext) {

        var results = originalGetContext.apply(this, _.rest(arguments));

        var ppeSymbolLabels = (this.model.get('item').get('custitem_bb1_sca_ppesymbols') || '').split(/\s*,\s*/);
        var ppeSymbolsConfig = Configuration.get('ppeSymbols.images', []);

        var ppeSymbols = ppeSymbolLabels.length && _.filter(ppeSymbolsConfig, function (ppeSymbol) {
          return ppeSymbolLabels.indexOf(ppeSymbol.text) != -1;
        });

        _.extend(results, {
          ppeSymbols: ppeSymbols
        });

        return results;
      }),

      showContent: _.wrap(ProductDetailsFullView.prototype.showContent, function (originalShowContent) {

        var profile = ProfileModel.getInstance(),
          contactIsBuyer = profile.get('contactIsBuyer'),
          item = this.model.get('item'),
          isStandardItem = item.get('custitem_bb1_sca_standarditem') == 'true' || item.get('custitem_bb1_sca_standarditem') == true;
        // console.log("contactIsBuyer",contactIsBuyer);

        var is_logged_in = profile.get('isLoggedIn') === 'T' && parseInt(profile.get('internalid')) > 0;
        
        console.log("profile",profile);
        //if (contactIsBuyer) {

        if (is_logged_in) {

          var customerShowStandardItems = profile.get('customerShowStandardItems'),
            contactOverrideCustomerItems = profile.get('contactOverrideCustomerItems'),
            contactShowStandardItems = profile.get('contactShowStandardItems');

          var hasBuyer = false,
            hasCustomer = false;

          var contactFacetUrlValue = profile.get('contactName');
          var itemFacetUrlValue = (item.get('custitem_bb1_sca_buyers') || '').split(',');
          

          if (contactFacetUrlValue && contactIsBuyer) {
            for (var i = 0; i < itemFacetUrlValue.length; i++) {
              if (itemFacetUrlValue[i].trim() == contactFacetUrlValue.trim()) {
                hasBuyer = true;
                break;
              }
            }
          }


          var customerFacetUrlValue = profile.get('companyname');
          var itemFacetUrlValue = (item.get('custitem_bb1_sca_customers') || '').split(',');

          if (customerFacetUrlValue) {
            for (var i = 0; i < itemFacetUrlValue.length; i++) {
              if (itemFacetUrlValue[i].trim() == customerFacetUrlValue.trim()) {
                hasCustomer = true;
                break;
              }
            }
          }

          if (((contactOverrideCustomerItems && hasBuyer) || (!contactOverrideCustomerItems && hasCustomer))) {
            //always show for designated items.
          } else if (isStandardItem && contactOverrideCustomerItems && contactShowStandardItems) {
            //show standard items for contact
          } else if (isStandardItem && !contactOverrideCustomerItems && customerShowStandardItems) {
            //show standard items for customer
          } else {
            return this.application.getLayout().notFound();
          }
        } else {
          if (!isStandardItem) {
            return this.application.getLayout().notFound();
          }
        }

        // } else {
        //   if (!isStandardItem) {
        //     return this.application.getLayout().notFound();
        //   }
        // }

        var results = originalShowContent.apply(this, _.rest(arguments));

        return results;
      })

    });

    ProductDetailsFullView.prototype.childViews['Product.Options'] = _.wrap(ProductDetailsFullView.prototype.childViews['Product.Options'], function (originalProductOptionsView) {
      if (!itemIsMultiBuyMatrix(this.model))
        return originalProductOptionsView.apply(this, _.rest(arguments));
    });

    ProductDetailsFullView.prototype.childViews['Quantity'] = _.wrap(ProductDetailsFullView.prototype.childViews['Quantity'], function (originalQuantityView) {
      if (!itemIsMultiBuyMatrix(this.model))
        return originalQuantityView.apply(this, _.rest(arguments));
    });

    ProductDetailsFullView.prototype.childViews['Product.CategoryHeading'] = function () {
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

      mountToApp: function (container) {

        var productDetailComponent = container.getComponent('PDP');

        productDetailComponent.addChildViews(productDetailComponent.PDP_FULL_VIEW, {
          'MultiBuy.MatrixOptions': function () {
            var currentView = productDetailComponent.viewToBeRendered || container.getLayout().getCurrentView();

            if (itemIsMultiBuyMatrix(currentView.model))
              return new ProductDetailsMultiBuyView({
                application: container,
                model: currentView.model
              });
          },

          'MainActionView': function () {
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
          obj = (obj || "").split(' ').join('-');
          obj = (obj || "").split('/').join('-');
          return obj;
        });
      }

    };

  }
);