/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define(
	'bb1.Cart.AddToCart.Button.View', [
		'LiveOrder.Model', 'LiveOrder.Line.Model', 'Cart.Confirmation.Helpers'

		, 'bb1_cart_add_to_cart_button.tpl'

		, 'Backbone', 'underscore', 'Utils', 'bb1.SafeAidShopping.AddToCart.View', 'SafeAid.bb1.AddToCart.Model'
	],
	function (
		LiveOrderModel, LiveOrderLineModel, CartConfirmationHelpers

		, bb1_cart_add_to_cart_button_tpl

		, Backbone, _, Utils, AddToCartView, AddToCartModel
	) {
		'use strict';

		//@class Cart.AddToCart.Button.View @extend Backbone.View
		return Backbone.View.extend({

			//@property {Function} template
			template: bb1_cart_add_to_cart_button_tpl

				,
			events: {
				'mouseup [data-type="add-to-cart"]': 'addToCart',
				'click [data-type="add-to-cart"]': 'addToCart'
			}

			//@method initialize
			//@param {ProductDeatils.AddToCart.ViewCart.AddToCart.Button.View.Initialize.Options} options
			//@return {Void}
			,
			initialize: function initialize(options) {

					this.model = options.model;
					this.application = options.application;
					Backbone.View.prototype.initialize.apply(this, arguments);

					this.cart = LiveOrderModel.getInstance();

					this.model.on('change', this.render, this);

					$("body").on('hidden.bs.modal', this.modalClosed);

				}

				//@method destroy Override default method to detach from change event of the current model
				//@return {Void}
				,
			destroy: function destroy() {
				Backbone.View.prototype.destroy.apply(this, arguments);

				this.model.off('change', this.render, this);

				$("body").off('hidden.bs.modal', modalClosed);
			},
			modalClosed: function () {
					window.showingModal = false;
					console.log("closed!");
				}

				//@method getAddToCartValidators Returns the extra validation to add a product into the cart
				//@return {BackboneValidationObject}
				,
			getAddToCartValidators: function getAddToCartValidators() {
					var self = this;

					return {
						quantity: {
							fn: function () {
								var line_on_cart = self.cart.findLine(self.model),
									quantity = self.model.get('quantity'),
									minimum_quantity = self.model.getItem().get('_minimumQuantity') || 1,
									maximum_quantity = self.model.getItem().get('_maximumQuantity');

								if (!_.isNumber(quantity) || _.isNaN(quantity) || quantity < 1) {
									return _.translate('Invalid quantity value');
								} else if (!line_on_cart && line_on_cart + quantity < minimum_quantity) {
									return _.translate('Please add $(0) or more of this item', minimum_quantity);
								} else if (!!maximum_quantity) {
									maximum_quantity = (!line_on_cart) ? maximum_quantity : maximum_quantity - line_on_cart.quantity;

									if (quantity > maximum_quantity) {
										return _.translate('Please add $(0) or less of this item', maximum_quantity);
									}
								}
							}
						}
					};
				}

				//@method submitHandler Public method that fulfill the require interface of the Main action View of the PDP
				//@param {jQuery.Event} e
				//@return {Boolean}
				,
			submitHandler: function submitHandler(e) {

				return this.addToCart(e);
			},

			showChoiceInModal: function (success) {
					var self = this;
					if (!window.showingModal) { //Stop annoying double popup
						console.log("showChoiceInModal");
						window.showingModal = true;
						//Load the areas and wearers
						var model = new AddToCartModel();

						var view = new AddToCartView({
							application: self.application,
							success: success,
							model: model
						});
						model.fetch({
							data: {
								t: new Date().getTime()
							}
						}).done(function () {
							//show choice modal
							view.showInModal();
						});

					}
				}
				// @method addToCart Updates the Cart to include the current model
				// also takes care of updating the cart if the current model is already in the cart
				// @param {jQuery.Event} e
				// @return {Boolean}
				,
			addToCart: function addToCart(e) {

					try {

						e.preventDefault();
						var self = this,
							cart_promise;
						if (!this.model.areAttributesValid(['options', 'quantity'], self.getAddToCartValidators())) {
							return;
						}
						//if the choice modal is a success, then add the items to the cart, using the selected area and wearer.
						var success = function (area, wearer) {
							//add the values from the modal to the model. try saying that 3 times fast!
							
							var options = self.model.get("options");
							var cartOptionId;
							for (var i = 0; i < options.models.length; i++) {
								cartOptionId = options.models[i].get("cartOptionId");
								if (cartOptionId == "custcol_bb1_sca_area") {
									if (area) {
										options.models[i].set("value", {
											internalid: area.value,
											label: area.text
										});
									} else {
										options.models[i].set("value", null);
									}
								}else if (cartOptionId == "custcol_bb1_sca_wearer") {
									if (wearer) {
										options.models[i].set("value", {
											internalid: wearer.value,
											label: wearer.text
										});
									} else {
										options.models[i].set("value", null);
									}
								}
							}
							if (area) {
								self.model.set("custcol_bb1_sca_area", area.value);
							} else {
								self.model.set("custcol_bb1_sca_area", null);
							}
							if (wearer) {
								self.model.set("custcol_bb1_sca_wearer", wearer.value);
							} else {
								self.model.set("custcol_bb1_sca_wearer", null);
							}
						
console.log(self.model);

							window.showingModal = false;
							if (!self.model.isNew() && self.model.get('source') === 'cart') {
								cart_promise = self.cart.updateProduct(self.model);
								cart_promise.done(function () {
									self.options.application.getLayout().closeModal();
								});
							} else {
								var line = LiveOrderLineModel.createFromProduct(self.model);
								// console.log("add new line!");

								// console.log(line);

								cart_promise = self.cart.addLine(line);
								CartConfirmationHelpers.showCartConfirmation(cart_promise, line, self.options.application);
							}

							cart_promise.fail(function (jqXhr) {
								var error_details = null;
								try {
									var response = JSON.parse(jqXhr.responseText);
									error_details = response.errorDetails;
								} finally {
									if (error_details && error_details.status === 'LINE_ROLLBACK') {
										self.model.set('internalid', error_details.newLineId);
									}
								}

							});

							self.disableElementsOnPromise(cart_promise, e.target);
						};
						this.showChoiceInModal(success);
					} catch (err) {
						console.log(err);
					}
					return false;
				}

				//@method getContext
				//@return {Cart.AddToCart.Button.View.Context}
				,
			getContext: function getContext() {
				//@class Cart.AddToCart.Button.View.Context
				return {
					//@property {Boolean} isCurrentItemPurchasable Indicate if the current item is valid to be purchase or not
					isCurrentItemPurchasable: this.model.getItem().get('_isPurchasable')
						//@property {Boolean} isUpdate
						,
					isUpdate: !this.model.isNew() && this.model.get('source') === 'cart'
				};
				//@class Cart.AddToCart.Button.View
			}
		});
	});

//@class Cart.AddToCart.Button.View.Initialize.Options
//@property {Product.Model} model This view is only capable of adding new PRODUCTs into the cart.
//If you need to add something else please convert it into a Product.Model.
//