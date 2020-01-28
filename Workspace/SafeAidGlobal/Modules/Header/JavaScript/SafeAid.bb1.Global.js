/*BB1 G Truslove 2017*/

define(
	'SafeAid.bb1.Global', [
		'Handlebars', 'SafeAid.bb1.HeaderAlerts.View', 'Header.View', 'bb1.SafeAidGlobal.Menu',
		'bb1.SafeAidShopping.Footer'
	],
	function (
		Handlebars, HeaderAlertsView, Header, Menu, Footer
	) {
		'use strict';

		Handlebars.registerHelper('toJSON', function (obj) {
			return JSON.stringify(obj, null, 3);
		});

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



				if (SC.ENVIRONMENT.SCTouchpoint == "checkout") {

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