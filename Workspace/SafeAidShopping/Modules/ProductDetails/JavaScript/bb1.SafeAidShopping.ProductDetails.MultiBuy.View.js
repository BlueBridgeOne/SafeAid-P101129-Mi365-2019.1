//@module bb1.SafeAidShopping.ProductDetails
define(
  'bb1.SafeAidShopping.ProductDetails.MultiBuy.View',
  [
    'bb1.SafeAidShopping.ProductDetails.MultiBuy.ColourSelector.View',
    'bb1.SafeAidShopping.AddToCart.View',
    'SafeAid.bb1.AddToCart.Model',
    'Cart.Confirmation.Helpers',
    'GlobalViews.Message.View',
    'LiveOrder.Model',
    'LiveOrder.Line.Model',
    'ErrorManagement.ResponseErrorParser',

    'bb1_safeaidshopping_productdetails_multibuy.tpl',

    'Backbone',
    'Backbone.CompositeView',
    'underscore',
    'jQuery',
    'Profile.Model'
  ],
  function (
    MultiBuyColourSelectorView,
    CartAddToCartAreaWearerSelectView,
    CartAddToCartAreaWearerModel,
    CartConfirmationHelpers,
    GlobalViewsMessageView,
    LiveOrderModel,
    LiveOrderLineModel,
    ErrorManagementResponseErrorParser,

    bb1_safeaidshopping_productdetails_multibuy_tpl,

    Backbone,
    BackboneCompositeView,
    _,
    jQuery,
    ProfileModel
  ) {
    'use strict';

    return Backbone.View.extend({

      //@propery {Function} template
      template: bb1_safeaidshopping_productdetails_multibuy_tpl,

      //@propery {Object} events
      events: {
        'change [data-action="multi-buy-update-quantity"]': 'updateMultiBuyMatrixOptions',
        'click [data-type="multi-buy-add-to-cart"]': 'addToCart',
        'click [data-type="multi-buy-show-colour-modal"]': 'showColourModal'
      },

      //@method initialize
      initialize: function (options) {
        Backbone.View.prototype.initialize.apply(this, arguments);
        this.application = options.application;
        this.modelToUpdate = options.modelToUpdate || options.model;
        this.cart = LiveOrderModel.getInstance();
      },

      childViews: {

        'MultiBuy.AddToCart': function () {
          return new CartAddToCartButtonView({
            application: this.application,
            model: this.model
          });
        }

      },

      getOptionsForMatrixChild: function (matrixChildId) {
        console.log("getOptionsForMatrixChild","?"+matrixChildId);
        var matrixChildOptions = {};
        var matrixChildren = this.model.get('item').get('_matrixChilds') || [];

        if (!matrixChildren.length)
          return matrixChildOptions;

        var matrixChild = _.find(matrixChildren.models, function (matrixChild) {
          return matrixChild.get('internalid') == matrixChildId;
        });

        _.each(this.model.get('options').where({
          isMatrixDimension: true
        }), function (matrixOption) {
          var matrixChildOptionCartId = matrixOption.get('cartOptionId');
          var matrixChildOptionItemId = matrixOption.get('itemOptionId');
          var matrixChildOptionItemLabel = matrixChild.get(matrixChildOptionItemId);
          matrixChildOptions[matrixChildOptionCartId] = (_.findWhere(matrixOption.get('values'), {
            label: matrixChildOptionItemLabel
          }) || {}).internalid || '';
        });

        return matrixChildOptions;
      },

      updateMultiBuyMatrixOptions: function (e) {
        e.preventDefault();

        var self = this,
          $quantity = this.$(e.target),
          itemId = $quantity.data('item-id'),
          matrixChildOptions = this.getOptionsForMatrixChild(itemId),
          quantity = isNaN(parseInt($quantity.val(), 10)) ? 0 : parseInt($quantity.val(), 10);

        var multiBuyMatrixOptions = this.modelToUpdate.get('multiBuyMatrixOptions') || {};

        var multiBuyMatrixOption = multiBuyMatrixOptions[itemId] = multiBuyMatrixOptions[itemId] || {};

        _.extend(multiBuyMatrixOption, {
          product: this.model,
          quantity: quantity,
          selectedOptions: matrixChildOptions
        });

        this.modelToUpdate.set('multiBuyMatrixOptions', multiBuyMatrixOptions);

      },

      //@method addToCart add all items to the cart
      addToCart: function (e) {
        e.preventDefault();

        var self = this;
        var multiBuyMatrixOptions = this.modelToUpdate.get('multiBuyMatrixOptions') || {};
        var $alertPlaceholder = this.$('[data-type=alert-placeholder]');

        $alertPlaceholder.hide().empty();

        if (!_.values(multiBuyMatrixOptions).length) {
          var message = new GlobalViewsMessageView({
            message: _('Enter a positive number for the items your want to order before clicking the Add to Cart button.').translate(),
            type: 'error',
            closable: true
          }).render().$el;

          $alertPlaceholder.show().html(message);
          return false;
        }

        this.showAreasWearersSelectModal().then(function (selectedArea, selectedWearer) {
          var lines = [];

          _.each(multiBuyMatrixOptions, function (multiBuyMatrixOption) {

            var product = multiBuyMatrixOption.product.clone();
            var lineModelOptions = _.extend({}, multiBuyMatrixOption.selectedOptions, {
              custcol_bb1_sca_area: selectedArea && selectedArea.value || '',
              custcol_bb1_sca_wearer: selectedWearer && selectedWearer.value || ''
            });

            product.set('quantity', multiBuyMatrixOption.quantity, {
              silent: true
            });

            _.each(lineModelOptions, function (selectedOptionValue, selectedOptionId) {
              self.setOption(product, selectedOptionId, selectedOptionValue);
            });
            var lineModel = LiveOrderLineModel.createFromProduct(product);
            //console.log(lineModel);
            lines.push(lineModel);
          });

          var cartPromise = self.cart.addLines(lines);

          CartConfirmationHelpers._showMiniCart(cartPromise, lines, self.application);

          var layout = self.application.getLayout();

          cartPromise.then(function () {
            self.$('[data-action="multi-buy-update-quantity"]').val('');
            self.modelToUpdate.set('multiBuyMatrixOptions', {});
          });

          cartPromise.fail(function (error) {
            var output_message = '',
              error_object = (error && error.responseJSON) || {},
              error_message = ErrorManagementResponseErrorParser(error, layout.errorMessageKeys);

            if (error_object.errorCode === 'ERR_EXT_CANCELED_OPERATION' && error_message)
              output_message = error_message;
            else
              output_message = _('Sorry, there is a problem with this Item and can not be purchased at this time. Please check back later.').translate();

            layout.showErrorInModal(output_message);
          });

          self.disableElementsOnPromise(cartPromise, e.target);
        });

        return false;
      },

      showAreasWearersSelectModal: function () {
        var promise = jQuery.Deferred();

        var profile = ProfileModel.getInstance()
        var level = profile.get("level");
        if (level == "silver") {
          setTimeout(function () {
            promise.resolve();
          }, 100);
          return promise;
        }

        var model = new CartAddToCartAreaWearerModel();
        var view = new CartAddToCartAreaWearerSelectView({
          application: this.application,
          model: model,
          success: function (area, wearer) {
            promise.resolve(area, wearer);
          }
        });

        model.fetch({
          data: {
            t: new Date().getTime()
          }
        }).then(function () {
          if (!model.get("areas").length) {
            promise.resolve();
          } else {
            view.showInModal();
          }
        });

        return promise;
      },

      setOption: function (lineModel, option_cart_id, value) {
console.log("setOption "+option_cart_id+" "+value);
        var self = this,
          selected_option = lineModel.get('options').findWhere({
            cartOptionId: option_cart_id
          }),
          selected_value = selected_option && _.findWhere(selected_option.get('values'), {
            internalid: value
          });

        if (selected_option) {
          if (selected_value) {
            selected_option.set('value', {
              internalid: selected_value.internalid,
              label: selected_value.label
            }, {
              silent: true
            });

            lineModel.set(option_cart_id, value, {
              silent: true
            });
          } else if (value !== null && value !== undefined && value !== '' && selected_option.get('type') !== 'select') {
            selected_option.set('value', {
              internalid: value,
              label: value
            }, {
              silent: true
            });

            lineModel.set(option_cart_id, value, {
              silent: true
            });
          } else {
            selected_option.unset('value', {
              silent: true
            });
            lineModel.unset(option_cart_id, {
              silent: true
            });
          }
        }

      },

      //@method showColourModal: function()
      showColourModal: function () {
        var colourSelectorView = new MultiBuyColourSelectorView({
          application: this.application,
          model: this.model
        });

        colourSelectorView.showInModal();
      },

      //@method getContext: function()
      getContext: function () {
        var model = this.model,
          item = this.model.get('item'),
          itemOptions = this.model.getVisibleOptions(),
          colourOptions = item.getOption('custcol_bb1_matrix_colour'),
          matrixSizeOptions = item.getOption('custcol_bb1_matrix_size'),
          gloveOptions = item.getOption('custcol_bb1_matrix_gloves'),
          footwearOptions = item.getOption('custcol_bb1_matrix_footwear'),
          ladiesWearOptions = item.getOption('custcol_bb1_matrix_ladieswear'),
          sizeOptions = matrixSizeOptions,
          multiBuyOptions = [];

        var lengthOptions = item.getOption('custcol_bb1_matrix_length');
        var sizeId = "custitem_bb1_matrix_size";
        if (!matrixSizeOptions && gloveOptions) {
          sizeOptions = gloveOptions;
          sizeId = "custitem_bb1_matrix_gloves";
        }
        if (!matrixSizeOptions && footwearOptions) {
          sizeOptions = footwearOptions;
          sizeId = "custitem_bb1_matrix_footwear";
        }
        if (!matrixSizeOptions && ladiesWearOptions) {
          sizeOptions = ladiesWearOptions;
          sizeId = "custitem_bb1_matrix_ladieswear";
        }
        console.log("item", item.get("storedisplayname2"));
        // console.log("itemOptions", itemOptions);
        // console.log("sizeOptions", sizeOptions);
        if (!sizeOptions) {
          sizeOptions = [{
            internalid: -1,
            label: "One Size Fits All"
          }];

        }
        var sizeOptionList;
        if (colourOptions && colourOptions.values && sizeOptions && sizeOptions.values) {
          _.each(colourOptions.get('values'), function (colourOption) {
            if (colourOption.internalid) {
              var multiBuyOption = {height:2};
              multiBuyOption.colourId = colourOption.internalid;
              multiBuyOption.colourLabel = colourOption.label;
              multiBuyOption.sizeOptions = [];
              sizeOptionList = sizeOptions.get ? sizeOptions.get('values') : sizeOptions;
              if (lengthOptions && lengthOptions.values) {
                multiBuyOption.height++;
              }
              _.each(sizeOptionList, function (sizeOption) {

                if (sizeOption.internalid) {

                  //If lengths are required, add a second loop
                  if (lengthOptions && lengthOptions.values) {
                    multiBuyOption.showLength=true;
                    
                    _.each(lengthOptions.get("values"), function (lengthOption) {
                      if (lengthOption.internalid) {
                        var childOptions = {
                          custitem_bb1_matrix_colour: colourOption.label
                        };
                        childOptions["custitem_bb1_matrix_length"] = lengthOption.label;
                          childOptions[sizeId] = sizeOption.label;
                          
                          //console.log("childOptions",childOptions);
                        var matrixChilds = model.getSelectedMatrixChilds(childOptions);
                        var matrixChild = matrixChilds.length ? matrixChilds[0] : null;
    
    if(matrixChild){
                        multiBuyOption.sizeOptions.push({
                          sizeId: sizeOption.internalid,
                          sizeLabel: sizeOption.label,
                          lengthId: lengthOption.internalid,
                          lengthLabel: lengthOption.label,
                          itemId: matrixChild && matrixChild.get('internalid') || '',
                          available: matrixChild && matrixChild.getStockInfo().stock || 0
                        });
                      }
                      }
                    });

                  } else { //Loop through and add all child items.
                    var childOptions = {
                      custitem_bb1_matrix_colour: colourOption.label
                    };
                    if (sizeOptions.get) {
                      childOptions[sizeId] = sizeOption.label;
                    }
                    var matrixChilds = model.getSelectedMatrixChilds(childOptions);
                    var matrixChild = matrixChilds.length ? matrixChilds[0] : null;

                    multiBuyOption.sizeOptions.push({
                      sizeId: sizeOption.internalid,
                      sizeLabel: sizeOption.label,
                      itemId: matrixChild && matrixChild.get('internalid') || '',
                      available: matrixChild && matrixChild.getStockInfo().stock || 0
                    });
                  }
                }
              });
              multiBuyOption.mobileRowSpan = multiBuyOption.sizeOptions.length + 1;
              
              
              //Temp Hide all stock for now.
              multiBuyOption.showStock = false;
              // for(var i=0;i<multiBuyOption.sizeOptions.length;i++){
              //   if(multiBuyOption.sizeOptions[i].available>0){
              //     multiBuyOption.showStock=true;
              //     multiBuyOption.height++;
              //     break;
              //   }
              // } 
              multiBuyOptions.push(multiBuyOption);
            }
          });

        }

        //@class bb1.SafeAidShopping.MultiBuy.View.Context
        return {
          //@property {ProductModel} model
          model: this.model,
          //@property {ItemModel} item
          item: item,
          //@property {Boolean} item
          hideActions: !!this.options.hideActions,
          //@property {Array} multiBuyOptions
          multiBuyOptions: multiBuyOptions,
          //@property {Boolean} isMultiBuy
          isMultiBuy: !!multiBuyOptions.length,
          //@property {Boolean} showSingleQuantity
          showSingleQuantity: !multiBuyOptions.length && this.options.showSingleQuantity
        };
      }

    });

  });