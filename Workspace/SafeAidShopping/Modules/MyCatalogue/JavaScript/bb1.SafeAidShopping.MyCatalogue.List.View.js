//@module bb1.SafeAidShopping.MyCatalogue
define(
  'bb1.SafeAidShopping.MyCatalogue.List.View',
  [
    'bb1.SafeAidShopping.MyCatalogue.ItemCell.View',
    'bb1.SafeAidShopping.ProductDetails.MultiBuy.ColourSelector.View',
    'bb1.Cart.AddToCart.Button.View',
    'bb1.SafeAidShopping.AddToCart.View',
    'SafeAid.bb1.AddToCart.Model',
    'ListHeader.View',
    'SC.Configuration',
    'GlobalViews.Pagination.View',
    'GlobalViews.ShowingCurrent.View',
    'GlobalViews.Message.View',
    'bb1.SafeAidShopping.MyCatalogue.Collection',
    'LiveOrder.Line.Model',
    'Cart.Confirmation.Helpers',
    'Tracker',
    'LiveOrder.Model',
    'Backbone.CollectionView',
    'ErrorManagement',
    'ErrorManagement.ResponseErrorParser',

    'bb1_safeaidshopping_mycatalogue.tpl',
    'bb1_safeaidshopping_mycatalogue_itemcell.tpl',

    'Backbone',
    'underscore',
    'jQuery',
    'Utils'
  ],
  function (
    MyCatalogueItemCellView,
    MultiBuyColourSelectorView,
    CartAddToCartButtonView,
    CartAddToCartAreaWearerSelectView,
    CartAddToCartAreaWearerModel,
    ListHeaderView,
    Configuration,
    GlobalViewsPaginationView,
    GlobalViewsShowingCurrentView,
    GlobalViewsMessageView,
    MyCatalogueCollection,
    LiveOrderLineModel,
    CartConfirmationHelpers,
    Tracker,
    LiveOrderModel,
    BackboneCollectionView,
    ErrorManagement,
    ErrorManagementResponseErrorParser,

    bb1_safeaidshopping_mycatalogue_tpl,
    bb1_safeaidshopping_mycatalogue_itemcell_tpl,

    Backbone,
    _,
    jQuery,
    Utils
  ) {
    'use strict';

    //@class bb1.SafeAidShopping.MyCatalogue.List.View @extends Backbone.View
    return Backbone.View.extend({

      //@propery {Function} template
      template: bb1_safeaidshopping_mycatalogue_tpl,

      //@propery {String} className
      className: 'MyCatalogueListView',

      //@propery {String} title
      title: _('My Catalogue').translate(),

      //@propery {String} page_header
      page_header: _('My Catalogue').translate(),

      //@propery {Object} attributes
      attributes: {
        'id': 'MyCatalogue',
        'class': 'MyCatalogueListView'
      },

      //@propery {Object} events
      events: {
        'click [data-type="multi-buy-add-to-cart"]': 'addToCart',
        'click [data-type="multi-buy-show-colour-modal"]': 'showColourModal'
      },

      //@method initialize
      initialize: function (options) {
        this.application = options.application;
        this.collection = new MyCatalogueCollection();
        this.model = new Backbone.Model();
        this.options.showCurrentPage = true;

        this.listenCollection();

        this.listHeader = new ListHeaderView({
          view: this,
          application: options.application,
          collection: this.collection,
          sorts: this.sortOptions,
          hidePagination: true
        });

        this.collection.on('reset', this.render, this);

        this.cart = LiveOrderModel.getInstance();
      },

      //@method listenCollection
      listenCollection: function () {
        this.setLoading(true);

        this.collection.on({
          request: jQuery.proxy(this, 'setLoading', true),
          reset: jQuery.proxy(this, 'setLoading', false)
        });
      },

      //@method setLoading
      setLoading: function (value) {
        this.isLoading = value;
      },

      //@method getBreadcrumbPages
      getBreadcrumbPages: function () {
        var crumbtrail = [{
          text: this.title,
          href: '/my-catalogue'
        }];

        return crumbtrail;
      },

      //@method {Array} sortOptions
      sortOptions: [{
          value: 'category',
          name: _('By Category').translate(),
          selected: true
        },
        {
          value: 'price',
          name: _('By Price').translate()
        },
        {
          value: 'name',
          name: _('By Name').translate()
        }
      ],

      //@method {Array} filterOptions
      filterOptions: null,

      //@property {Object} childViews
      childViews: {

        'ListHeader': function () {
          return this.listHeader;
        },

        'GlobalViews.Pagination': function () {
          return new GlobalViewsPaginationView(_.extend({
            totalPages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
          }, Configuration.defaultPaginationSettings));
        },

        'GlobalViews.ShowCurrentPage': function () {
          return new GlobalViewsShowingCurrentView({
            items_per_page: this.collection.recordsPerPage,
            total_items: this.collection.totalRecordsFound,
            total_pages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
          });
        },

        'Catalogue.Items': function () {

          

          var view = new BackboneCollectionView({
            childView: MyCatalogueItemCellView,
            childViewOptions: {
              application: this.application,
              parentModel: this.model
            },
            viewsPerRow: 1,
            collection: this.collection
          });

          this.collection.on('reset', function () {
            view.render();
          });

          return view;
        }

      },

      //@method addToCart add to cart an item, the quantity is written by the user on the input and the options are the same that the ordered item in the previous order
      addToCart: function (e) {
        e.preventDefault();

        var multiBuyMatrixOptions = this.model.get('multiBuyMatrixOptions') || {};
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

        var self = this;

        this.showAreasWearersSelectModal().then(function (selectedArea, selectedWearer) {
          var lines = [];

          _.each(multiBuyMatrixOptions, function (multiBuyMatrixOption) {
            var lineModel = LiveOrderLineModel.createFromProduct(multiBuyMatrixOption.product);
            var lineModelOptions = _.extend({}, multiBuyMatrixOption.selectedOptions, {
              custcol_bb1_sca_area: selectedArea && selectedArea.value || '',
              custcol_bb1_sca_wearer: selectedWearer && selectedWearer.value || ''
            });

            lineModel.set('quantity', multiBuyMatrixOption.quantity, {
              silent: true
            });

            _.each(lineModelOptions, function (selectedOptionValue, selectedOptionId) {
              self.setOption(lineModel, selectedOptionId, selectedOptionValue);
            });

            lines.push(lineModel);
          });

          var cartPromise = self.cart.addLines(lines);

          CartConfirmationHelpers._showMiniCart(cartPromise, lines, self.application);

          var layout = self.application.getLayout();

          cartPromise.then(function () {
            self.$('[data-action="multi-buy-update-quantity"]').val('');
            self.model.set('multiBuyMatrixOptions', {});
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
        //@class bb1.SafeAidShopping.MyCatalogue.List.View.Context
        
        return {
          //@propery {Boolean} isLoading
          isLoading: this.isLoading,
          //@propery {Boolean} showItems
          showItems: !!this.collection.totalRecordsFound,
          //@propery {Boolean} itemsNotFound
          itemsNotFound: !this.collection.totalRecordsFound && !this.isLoading,
          //@propery {String} pageHeader
          pageHeader: this.page_header,
          //@property {Boolean} showPagination
          showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
          //@property {Boolean} showCurrentPage
          showCurrentPage: this.options.showCurrentPage
        };
      }

    });

  });