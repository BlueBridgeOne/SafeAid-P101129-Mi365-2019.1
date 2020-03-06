define(
    'bb1.SafeAidShopping.Cart', [
        'bb1.Cart.AddToCart.Button.View', 'ProductDetails.Base.View', 'Handlebars', 'Cart.Detailed.View', 'Backbone', 'bb1.Cart.List.View', 'Cart.Summary.View', 'Tools', 'Header.MiniCart.View', 'Header.View', 'Facets.FacetedNavigationItem.View','Item.Model'
    ],
    function (
        AddToCartButtonView, ProductDetailsBase, Handlebars, CartDetailedView, Backbone, bb1CartListView, CartSummaryView, Tools, HeaderMiniCart, Header, FacetsFacetedNavigationItemView,ItemModel
    ) {
        'use strict';

        Handlebars.registerHelper('toJSON', function (obj) {
            return JSON.stringify(obj, null, 3);
        });

        return {

            mountToApp: function mountToApp(container) {
                
                //console.log("Mount SafeAid Shopping Extension");

                //Various ways to link into existing views and templates...

                //add new child view for the cart lines:
                var latestApplication;
                CartDetailedView.prototype.childViews.LinesExtension = function () {
                    // console.log("CartDetailedView");
                    var lines = _.filter(this.model.get('lines').models || [], function (line) {
                        return line.get('free_gift') !== true;
                    });
                    //First create a new collection with all the lines sorted by area and then wearer.
                    var newLines = [],
                        options, cartOptionId, area, wearer;
                    for (var i = 0; i < lines.length; i++) {
                        options = lines[i].get("options");
                        //console.log(options);
                        area = {};
                        wearer = {};
                        for (var j = 0; j < options.models.length; j++) {
                            //console.log(options.models);
                            cartOptionId = options.models[j].get("cartOptionId");
                            //console.log(cartOptionId);
                            if (cartOptionId == "custcol_bb1_sca_area") {
                                area = options.models[j].get("value")
                            } else if (cartOptionId == "custcol_bb1_sca_wearer") {
                                wearer = options.models[j].get("value")
                            }
                        }
                        lines[i].area = area; //Shortcut values for sorting.
                        lines[i].wearer = wearer;
                        //console.log((area && area.label) + " " + (wearer && wearer.label));
                        newLines.push(lines[i]);
                    }
                    newLines.sort(function (a, b) {
                        return (a.area.label || "").localeCompare(b.area.label || "");
                    });
                    newLines.sort(function (a, b) {
                        return (a.area.label || "") == (b.area.label || "") && (a.wearer.label || "").localeCompare(b.wearer.label || "");
                    });
                    //BackboneCollection
                    //console.log(newLines);
                    // Custom Cart List
                    return new bb1CartListView({
                        application: this.application,
                        collection: new Backbone.Collection(newLines)
                    });

                }

                //Link to the approval modal on "Proceed to Checkout" button.
                if (!CartSummaryView.prototype.events) {
                    CartSummaryView.prototype.events = {};
                }
                CartSummaryView.prototype.events['click [data-action="approve"]'] = 'approveCheckout'
                CartSummaryView.prototype.approveCheckout = function (e) {
                    Tools.approveCart(this.options.application);
                }
                //Another hack to get the current application

                _.extend(Header.prototype, {

                    initialize: _.wrap(Header.prototype.initialize, function (initialize, options) {
                        initialize.apply(this, _.rest(arguments));
                        latestApplication = options.application;
                    })
                });

                //fix item model:

                ItemModel.prototype.parse= function parse (response)
                {
                    //SC.Tools.fixResponse(response);
                    // if we are performing a direct API call the item is response.items[0]
                    // but if you are using the Item.Collection to fetch this guys
                    // The item is the response
                    var single_item = response.items && response.items[0];
    
                    if (single_item)
                    {
                        single_item.facets = response.facets;
                    }
                    return single_item ? this.sanitize(single_item) : this.sanitize(response);
                }
                    
                //Same again, approval for mini cart.
                if (!HeaderMiniCart.prototype.events) {
                    HeaderMiniCart.prototype.events = {};
                }
                HeaderMiniCart.prototype.events['click [data-action="approve"]'] = 'approveCheckout'
                HeaderMiniCart.prototype.approveCheckout = function (e) {

                    if($(".shopping-layout-header").css("margin-bottom")=="20px"){
                    Tools.approveCart(this.options.application || latestApplication);
                    }
                }
                HeaderMiniCart.prototype.events['click [data-action="approve-dropdown"]'] = 'approveDropdownCheckout'
                HeaderMiniCart.prototype.approveDropdownCheckout = function (e) {

                    
                    Tools.approveCart(this.options.application || latestApplication);
                    
                }

//fix the slider decimal places:

FacetsFacetedNavigationItemView.prototype.updateRangeValues= function (e, slider)
{
    var parser = this.options.translator.getFacetConfig(this.facetId).parser
    ,	start = _.isFunction(parser) ? parser(parseFloat(slider.values.low).toFixed(2), true) : slider.values.low
    ,	end = _.isFunction(parser) ? parser(parseFloat(slider.values.high).toFixed(2), false) : slider.values.high;

    this.$el
        .find('span[data-range-indicator="start"]').html(start).end()
        .find('span[data-range-indicator="end"]').html(end);
}


                //override the add to cart button.

                var pdp = container.getComponent('PDP');
                if (pdp) {
                    var view_id = 'ProductDetails.Full.View';
                    var latestItemModel;
                    //Bit of a hack, get the item model and then pass it to the button.
                    _.extend(ProductDetailsBase.prototype, {

                        initialize: _.wrap(ProductDetailsBase.prototype.initialize, function (initialize, options) {
                            initialize.apply(this, _.rest(arguments));
                            latestItemModel = this.model;
                            latestApplication = this.application;
                        })
                    });
                    //new button, pass the item model.
                    pdp.addChildViews(
                        view_id, {
                            'MainActionView': function () {

                                var button = new AddToCartButtonView({
                                    application: latestApplication,
                                    model: latestItemModel
                                });

                                return button;
                            }
                        }
                    );
                }


            }
        };
    });