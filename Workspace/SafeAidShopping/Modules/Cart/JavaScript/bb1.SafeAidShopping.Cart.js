define(
	'bb1.SafeAidShopping.Cart', [
		'bb1.Cart.AddToCart.Button.View', 'ProductDetails.Base.View','Handlebars'
	],
	function (
		AddToCartButtonView, ProductDetailsBase,Handlebars
	) {
		'use strict';

		Handlebars.registerHelper('toJSON', function(obj) {
			return JSON.stringify(obj, null, 3);
		});

		return {

			mountToApp: function mountToApp(container) {
				
				var pdp = container.getComponent('PDP');
				if (pdp) {
					var view_id = 'ProductDetails.Full.View';
var latestItemModel,latestApplication;
//Bit of a hack, get the item model and then pass it to the button.
					_.extend(ProductDetailsBase.prototype, {

						initialize: _.wrap(ProductDetailsBase.prototype.initialize, function (initialize, options) {
							initialize.apply(this, _.rest(arguments));
							latestItemModel=this.model;
							latestApplication=this.application;
						})
					});
//new button, pass the item model.
					pdp.addChildViews(
						view_id, {
							'MainActionView': function () {
								
								var button = new AddToCartButtonView({
									application: latestApplication,
									model:latestItemModel
								});

								return button;
							}
						}
					);
				}
			

			}
		};
	});