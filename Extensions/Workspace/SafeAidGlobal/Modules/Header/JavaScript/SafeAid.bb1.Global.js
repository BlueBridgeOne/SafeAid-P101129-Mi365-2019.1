/*BB1 G Truslove 2017*/

define(
	'SafeAid.bb1.Global', [
		'Handlebars',
		'Item.KeyMapping','Item.Model','SafeAid.bb1.HeaderAlerts.View', 'SafeAid.bb1.HeaderLogo.View', 'Header.View', 'bb1.SafeAidGlobal.Menu', 'bb1.SafeAidGlobal.EditPO',
		'bb1.SafeAidShopping.Footer', 'Utils','Tools'
	],
	function (
		Handlebars,ItemKeyMapping, ItemModel,HeaderAlertsView, HeaderLogoView, Header, Menu,EditPO, Footer, Utils,Tools
	) {
		'use strict';

		Handlebars.registerHelper('toJSON', function (obj) {
			return JSON.stringify(obj, null, 3);
		});

		Utils.getDeviceType = function (widthToCheck) {
			var width = widthToCheck ? widthToCheck : Utils.getViewportWidth();

			if (width < 768) {
				return 'phone';
			} else if (width < 992) //1142
			{
				return 'tablet';
			} else {
				return 'desktop';
			}
		}

		Object.defineProperty && Object.defineProperty(document, 'title', {
			get: function () {

				return this._title;
			},
			set: function (val) {
				this._title = val + " | Safeaid Supplies";
				document.getElementsByTagName("title")[0].innerText = this._title;
			}
		});


		$("body", ".contact-us-form-primary-submit-button").click(function () {
			var $input = $(".contact-us-form-subject").find("input");
			$input.val($input.props("placeholder"));
		});

		//show in stock messages
		_.extend(ItemModel.prototype, {

			getStockInfo: _.wrap(ItemModel.prototype.getStockInfo, function (getStockInfo, options) {
			  var res = getStockInfo.apply(this, _.rest(arguments));
			  //res.allowView = this.overview.get("custentity_bb1_sca_allowviewbalance") == "T";
			  // console.log(this);
			  // console.log(res);
			  if (this.get("itemtype") == "Assembly") {
				res.stockMessageClass = "stock-message-assembly";
			  } else {
				res.stockMessageClass = "";
			  }
			  return res;
			})
	  
	  
		  });

		//console.log("ItemKeyMapping",ItemKeyMapping);
		ItemKeyMapping.getKeyMapping = _.wrap(ItemKeyMapping.getKeyMapping, function (getKeyMapping) {
			var res = getKeyMapping.apply(this, _.rest(arguments));
	  
			res._showOutOfStockMessage = function (item) {
	  
			  var itemType = item && item.get("itemtype");
			  if (itemType == "Assembly") {
				return false;
			  } else {
				return !item.get("isinstock");
			  }
			};
	  
			res._showInStockMessage = function (item) {
				
			  var itemType = item && item.get("itemtype");
			  if (itemType == "Assembly") {
				return true;
			  } else {
				return item.get("isinstock");
			  }
			};
	  
			res._inStockMessage = function (item) {
			  if (item && item.get("itemtype") == "Assembly") {
				  if(item.get("quantityavailable")>0){
					return _('Delivered Next Working Day').translate();
				  }else{
				return _('Manufactured to order').translate();
				  }
			  } else {
				return _('Delivered Next Working Day').translate();
			  }
			}
			res._outOfStockMessage = function (item) {

				  return _(item.get("outofstockmessage")||'Delivery Within 7-10 Working Days').translate();

			  };

			return res;
		  });
		
		//}


		return {
			mountToApp: function mountToApp(container) {

				Header.prototype.childViews.alerts = function () {
					return new HeaderAlertsView({
						application: container
					});
				}

				Header.prototype.childViews.logo = function () {
					return new HeaderLogoView({
						application: container
					});
				}

				//translation
				var environmentComponent = container.getComponent('Environment');
				var lang = ['en', 'en_US', 'en_GB'];
				var tchanges = {
					"Ship to the following zip code": "Ship to the following postcode",
					"Zip Code": "Postcode",
					"Zip Code is required": "Postcode is required",
					"Enter Address, Zip Code or City": "Enter Address, Postcode or City",
					"Card Zip Code: <span class=\"global-views-format-payment-method-zip-value\">$(0)</span>": "Card Postcode: <span class=\"global-views-format-payment-method-zip-value\">$(0)</span>",
					"State": "County",
					"State is required": "County is required",
					"State/Province/Region": "County",
					"Example: 94117": "Example: AB1 2CD",
					"Example: 555-123-1234": "Example: 0123 456 789",
				};
				for (var i = 0; i < lang.length; i++) {
					try {
						for (var j in tchanges) {
							environmentComponent.setTranslation(lang[i], [{
								key: j,
								value: tchanges[j]
							}]);
						}
					} catch (e) {
						console.log(e);
					}
				}

				


				//if (SC.ENVIRONMENT.SCTouchpoint == "checkout"||SC.ENVIRONMENT.SCTouchpoint == "shopping") {
					
					
				
				if (SC.ENVIRONMENT.SCTouchpoint == "checkout") {

					//Descriptive errors
					var WizardStep = require("Wizard.Step");
						if (WizardStep) {
							WizardStep.prototype.showError = function () {
								try {
									if (this.error) {
										console.log("Checkout Error:", this.error);
										var msg = this.error.errorMessage;
										var code = this.error.errorCode;
										if (code == "ERR_WS_UNHANDLED_ERROR") {
											if (msg && msg.indexOf("An error has occurred") > -1) {
												console.log("Error Message:", msg);
												console.log("Error Code:", code);
											} else {
												// var global_view_message = new GlobalViewsMessageView({
												// 	message: this.wizard.processErrorMessage(this.error.errorMessage),
												// 	type: 'error',
												// 	closable: true
												// });

												// this.$('[data-type="alert-placeholder-step"]').html(global_view_message.render().$el.html());

												// jQuery('body').animate({
												// 	scrollTop: jQuery('body .global-views-message-error:first').offset().top
												// }, 600);

												if (msg.indexOf("rejected") > -1 || msg.indexOf("payment") > -1 || msg.indexOf("merchant") > -1 || msg.indexOf("processing") > -1) {
													msg = "We were unable to process this payment.<br /><br /><ol><li>Check the payment and address details have been entered correctly.</li><li>Check the account has sufficient funds.</li><li>Try a different card.</li><li>Contact us for assistance.</li></ol>";
												}
												//purchase-order-number
												Tools.showErrorInModal(container, _("Unable to Continue").translate(), msg);
											}
										}
										this.error = null;
									}
								} catch (e) {
									console.log(e);
								}
							}
						}

					//Mandatory PO number
					var OrderWizardModulePaymentMethodPurchaseNumber = require("OrderWizard.Module.PaymentMethod.PurchaseNumber");
						if (OrderWizardModulePaymentMethodPurchaseNumber) {

							OrderWizardModulePaymentMethodPurchaseNumber.prototype.submit = function () {

								var purchase_order_number = this.$('[name=purchase-order-number]').val() || '';

								this.wizard.model.set('purchasenumber', purchase_order_number);
								if (purchase_order_number.length > 0) {
									this.error = false;
									this.render();
									return jQuery.Deferred().resolve();
								} else {
									this.error = true;
									this.render();
									return jQuery.Deferred().reject();
								}

							}
						}

						OrderWizardModulePaymentMethodPurchaseNumber.prototype.getContext = function () {

							//include error
							return {
								//@property {String} purchaseNumber
								purchaseNumber: this.wizard.model.get('purchasenumber'),
								error: this.error

							};
						}

					function shippingFunction(getContext, options) {
						var res = getContext.apply(this, _.rest(arguments));

						var profile = this.profileModel || this.wizard.options.profile;
						var shippingitem = profile && profile.get('shippingitem'),
							hasActive = false;

						for (var i = res.shippingMethods.length - 1; i >= 0; i--) {

							if (res.shippingMethods[i].internalid != shippingitem && res.shippingMethods[i].name.indexOf("*") > -1) {
								res.shippingMethods.splice(i, 1);
							} else {
								if (res.shippingMethods[i].isActive) {
									hasActive = true;
								}
								res.shippingMethods[i].name = res.shippingMethods[i].name.split("*").join("");
							}
						}
						if (!hasActive) { //set special, if any as default.
							for (var i = 0; i < res.shippingMethods.length; i++) {
								if (res.shippingMethods[i].internalid == shippingitem) {
									res.shippingMethods[i].isActive = true;
								}
							}
						}
						//console.log(res);
						return res;
					}
					var OrderWizardModuleShipmethod = require('OrderWizard.Module.Shipmethod');
					//waived shipping methods unless allowed for that company

					_.extend(OrderWizardModuleShipmethod.prototype, {
						getContext: _.wrap(OrderWizardModuleShipmethod.prototype.getContext, shippingFunction)
					});

					var OrderWizardModuleShipmethod = require('OrderWizard.Module.ShowShipments');
					_.extend(OrderWizardModuleShipmethod.prototype, {

						getContext: _.wrap(OrderWizardModuleShipmethod.prototype.getContext, shippingFunction)
					});

					//filter the payment methods
					var OrderWizardModulePaymentMethodSelector = require('OrderWizard.Module.PaymentMethod.Selector');

					_.extend(OrderWizardModulePaymentMethodSelector.prototype, {

						render: function () {
							if (this.wizard.hidePayment()) {
								this.$el.empty();
								this.trigger('change_label_continue');
								return;
							}

							// We do this here so we give time for information to be bootstrapped
							_.each(this.modules, function (module) {
								module.isActive = module.instance.isActive();
							});


							if (!this.selectedModule) {
								var selected_payment = this.model.get('paymentmethods').findWhere({
										primary: true
									}),
									selected_type;

								if (selected_payment) {
									selected_type = (this.isOthersModule(selected_payment.get('type'))) ? 'others' : selected_payment.get('type');
								} else if (this.wizard.options.profile.get('paymentterms')) {
									selected_type = 'invoice';
								}

								this.setModuleByType(selected_type, true);
							} else if (this.selectedModule.type === 'paypal' && !this.model.get('isPaypalComplete')) {
								this.trigger('change_label_continue', _('Continue to Paypal').translate());
							} else {
								this.trigger('change_label_continue');
							}




							if (_.getParameterByName(window.location.href, 'externalPayment') === 'FAIL' && this.showExternalPaymentErrorMessage) {
								this.showExternalPaymentErrorMessage = false;

								this.manageError(this.externalPaymentErrorMessage);
							}

							if (!this.selectedModule) {
								//BB1 Why is there no selected module here??
								return this._render();
							}
							if (this.isOthersModule(this.selectedModule.type)) {
								var other_module = _.findWhere(this.modules, ({
									type: 'others'
								}));

								other_module.isSelected = true;

								this.selectedModule = other_module;
								this._render();


								this.renderModule(other_module);

							} else {

								this._render();

								var selected_module = _.findWhere(this.modules, {
									isSelected: true
								})
								this.renderModule(selected_module)

							}


						}
					});

				}

				Menu.mountToApp(container);
				EditPO.mountToApp(container);
			}
		};
	});