/*BB1 G Truslove 2017*/

define(
	'SafeAid.bb1.Global', [
		'Handlebars', 'SafeAid.bb1.HeaderAlerts.View','SafeAid.bb1.HeaderLogo.View', 'Header.View', 'bb1.SafeAidGlobal.Menu',
		'bb1.SafeAidShopping.Footer','Utils'
	],
	function (
		Handlebars, HeaderAlertsView,HeaderLogoView, Header, Menu, Footer,Utils
	) {
		'use strict';

		Handlebars.registerHelper('toJSON', function (obj) {
			return JSON.stringify(obj, null, 3);
		});

		Utils.getDeviceType=function (widthToCheck)
	{
		var width = widthToCheck ? widthToCheck : Utils.getViewportWidth();

		if (width < 768)
		{
			return 'phone';
		}
		else if (width < 992) //1142
		{
			return 'tablet';
		}
		else
		{
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



				if (SC.ENVIRONMENT.SCTouchpoint == "checkout") {

					var OrderWizardModuleShipmethod=require('OrderWizard.Module.Shipmethod');
//waived shipping methods unless allowed for that company

_.extend(OrderWizardModuleShipmethod.prototype, {

	getContext: _.wrap(OrderWizardModuleShipmethod.prototype.getContext, function (getContext, options) {
		var res = getContext.apply(this, _.rest(arguments));
		var shippingitem=this.profileModel.get('shippingitem'),hasActive=false;
		for(var i=0;i<res.shippingMethods.length;i++){
			res.shippingMethods[i].name=res.shippingMethods[i].name.split("*").join("");
			if(res.shippingMethods[i].internalid!=shippingitem&&res.shippingMethods[i].name.indexOf("*")>-1){
				res.shippingMethods.splice(i,1);
			}else if(res.shippingMethods[i].isActive){
				hasActive=true;
			}
		}
		if(!hasActive){ //set special, if any as default.
			for(var i=0;i<res.shippingMethods.length;i++){
				if(res.shippingMethods[i].internalid==shippingitem){
					res.shippingMethods[i].isActive=true;
				}
			}
		}
		//console.log(res);
		return res;
	})
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
			}
		};
	});