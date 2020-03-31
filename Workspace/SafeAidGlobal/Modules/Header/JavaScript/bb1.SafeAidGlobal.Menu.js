//@module bb1.SafeAidGlobal.Menu
define(
    'bb1.SafeAidGlobal.Menu',
    [
        'Profile.Model',
        'SC.Configuration',
        'underscore',
        'Utils'
    ],
    function (
        ProfileModel,
        Configuration,
        _,
        Utils
    ) {
        'use strict';

        return {

            mountToApp: function (container) {

                var layout = container.getComponent('Layout'),
                    profile = ProfileModel.getInstance();
                    
                var level = profile.get('level');
                if ((level == "silver" || level == "gold" || level == "platinum")) {

                    var customerShowStandardItems = profile.get('customerShowStandardItems'),
                        contactOverrideCustomerItems = profile.get('contactOverrideCustomerItems'),
                        contactShowStandardItems = profile.get('contactShowStandardItems');
                    //     console.log(profile);
                    // console.log(customerShowStandardItems+" "+contactOverrideCustomerItems+" "+contactShowStandardItems);
                    if (!customerShowStandardItems || (contactOverrideCustomerItems && !contactShowStandardItems)) {
                        var allowedMenuItems = ['Home', 'Information'];

                        Configuration.navigationData = _.filter(Configuration.navigationData, function (menuItem) {
                            return allowedMenuItems.indexOf(menuItem.text) != -1;
                        });
                    }

                    Configuration.navigationData.push({
                        id: '',
                        parentId: '',
                        text: 'My Catalogue',
                        href: '/',
                        dataHashtag: '#/my-catalogue',
                        dataTouchpoint: 'home',
                        'data-hashtag': '#/my-catalogue',
                        'data-touchpoint': 'home',
                        class: 'header-menu-level1-anchor header-menu-mycatalogue-anchor',
                        classnames: 'header-menu-mycatalogue-anchor',
                        level: '1',
                        placeholder: ''
                    });

                }
                //Add website colours.
                if ((level == "gold" || level == "platinum")) {
                    var colour = profile.get('custentity_bb1_sca_websitecolour');
                    console.log("colour " + colour);
                    if (colour && colour.toUpperCase() != "#F18830") {
                        var sheet = document.createElement('style');
                        var body = "";
                        body += ".button-primary, .cms-content h6 a, .item-cell-quick-view-link, .button-proceed-to-checkout, .address-details-select-address, .address-edit-form-button-submit, .creditcard-edit-form-button-submit, .paymentinstrument-creditcard-edit-form-button-submit, .reorder-items-actions-add-to-cart, .cart-add-to-cart-button-button, .cart-confirmation-modal-view-cart-button, .cart-quickaddtocart-button, .button-proceed-checkout, .cart-summary-button-proceed-checkout, .cart-proceed-to-checkout, .cart-detailed-proceed-to-checkout, .button-saveforlater-addtocart, .creditcard-use-this-card-button, .error-management-expired-link-login-button, .error-management-expired-link-register-button, .error-management-generic-logout-close-button, .error-management-logged-out-close-button, .global-views-confirmation-confirm-button, .login-register-forgot-password-submit, .login-register-login-submit, .login-register-register-form-submit, .login-register-reset-password-submit, .order-wizard-address-module-save-button, .order-wizard-msr-addresses-module-save-button, .order-wizard-register-guest-module-create-account-button, .order-wizard-cart-summary-button-place-order, .paymentinstrument-creditcard-use-this-card-button, .order-wizard-msr-package-creation-button-create, .order-wizard-submitbutton-module-button, .requestquote-wizard-module-header-title-button, .requestquote-wizard-step-actions .requestquote-wizard-step-button-container .requestquote-wizard-step-button-continue, .wizard-step-button-continue, .order-wizard-step-button-continue, .header-mini-cart .header-mini-cart-button-checkout, .store-locator-details-get-directions-button, .store-locator-results-button-find, .store-locator-search-button-find,.button-primary, .cms-content h6 a, .item-cell-quick-view-link, .button-proceed-to-checkout, .address-details-select-address, .address-edit-form-button-submit, .creditcard-edit-form-button-submit, .paymentinstrument-creditcard-edit-form-button-submit, .case-detail-reply-button, .case-new-button-submit, .cart-add-to-cart-button-button, .cart-confirmation-modal-view-cart-button, .cart-quickaddtocart-button, .button-proceed-checkout, .cart-summary-button-proceed-checkout, .cart-proceed-to-checkout, .cart-detailed-proceed-to-checkout, .button-saveforlater-addtocart, .product-list-details-later-macro-button-addtocart, .creditcard-use-this-card-button, .error-management-expired-link-login-button, .error-management-expired-link-register-button, .error-management-generic-logout-close-button, .error-management-logged-out-close-button, .global-views-confirmation-confirm-button, .order-history-cancel-modal-cancel-button, .paymentinstrument-creditcard-use-this-card-button, .profile-change-email-form-actions-change, .profile-emailpreferences-submit, .profile-information-button-update, .profile-update-password-form-actions-update, .quote-details-button-review-and-order, .quote-review-summary-button-place-order, .requestquote-wizard-module-header-title-button, .requestquote-wizard-step-actions .requestquote-wizard-step-button-container .requestquote-wizard-step-button-continue, .reorder-items-actions-add-to-cart, .return-authorization-cancel-modal-cancel-button, .return-authorization-form-submit-button, .header-mini-cart .header-mini-cart-button-checkout, .store-locator-details-get-directions-button, .store-locator-results-button-find, .store-locator-search-button-find, .print-statement-form-actions-print, .payment-wizard-edit-amount-layout-form--action-button, .payment-wizard-summary-module-button-continue, .order-wizard-address-module-save-button, .quote-to-salesorder-wizard-detail-address-details-select-address, .order-wizard-cart-summary-button-place-order, .order-wizard-submitbutton-module-button, .balance-continue-button, .wizard-step-button-continue, .quote-review-step-button-continue, .quote-review-submitbutton-module-button, .payment-wizard-step-button-continue, .quote-to-salesorder-wizard-detail-submitbutton-module-button, .quote-to-salesorder-wizard-step-button-continue, .invoice-details-button-make-a-payment, .invoice-open-list-button-payment, .product-list-added-to-cart-button-viewcart, .product-list-bulk-actions-button-addtocart, .product-list-bulk-actions-button-expander, .product-list-deletion-button-delete-button, .product-list-list-details-add-to-cart, .product-list-new-form-submit, .product-list-edit-item-button-edit, .mi365-information-button-update,.button-primary, .cms-content h6 a, .item-cell-quick-view-link, .facets-item-cell-grid-quick-view-link, .facets-item-cell-list-quick-view-link, .facets-item-cell-table-quick-view-link, .mycatalogue-list-item-quick-view-link, .button-proceed-to-checkout, .cart-add-to-cart-button-button, .cart-confirmation-modal-view-cart-button, .cart-quickaddtocart-button, .button-proceed-checkout, .cart-summary-button-proceed-checkout, .cart-proceed-to-checkout, .cart-detailed-proceed-to-checkout, .button-saveforlater-addtocart, .product-list-details-later-macro-button-addtocart, .error-management-expired-link-login-button, .error-management-expired-link-register-button, .error-management-generic-logout-close-button, .error-management-logged-out-close-button, .facets-item-cell-table-add-to-cart-button, .header-mini-cart .header-mini-cart-button-checkout, .home-slide-caption .home-slide-caption-button, .product-list-deletion-button-delete-button, .product-reviews-form-actions-button-submit, .product-reviews-form-preview-actions-button-submit, .store-locator-details-get-directions-button, .store-locator-results-button-find, .store-locator-search-button-find, .pickup-in-store-store-selector-list-row-select-for-pickup, .product-details-multibuy-addtocart-button, .product-details-multibuy-gotocolour-button, .cart-continue-button,.price-range-slider-bar, .facets-faceted-navigation-item-range-slider-bar{background-color:" + colour + ";}";
                        body += ".recordviews-value,.button-link, .address-details-action, .cart-lines-free-item-actions, .creditcard-action, .paymentinstrument-creditcard-action, .overview-shipping-card-button-edit, .overview-payment-card-button-edit, .overview-profile-card-button-edit,.order-history-packages-address-data-link,.order-history-packages-accordion-head-toggle .order-history-packages-accordion-head-toggle-status,.recordviews-actionable-status,.recordviews-selectable-anchor,.input-required, .address-edit-fields-required, .address-edit-fields-group-label-required, .address-edit-fields-input-required, .case-new-form-required, .creditcard-edit-form-required, .creditcard-edit-form-label-required, .creditcard-edit-form-securitycode-group-label-required, .paymentinstrument-creditcard-edit-form-securitycode-group-label-required, .creditcard-required, .global-views-countriesDropdown-input-required, .global-views-states-input-required, .product-details-options-selector-reference, .product-views-option-checkbox-label-required, .product-views-option-color-label-required, .product-views-option-currency-label-required, .product-views-option-date-label-required, .product-views-option-datetimetz-label-required, .product-views-option-dropdown-label-required, .product-views-option-email-label-required, .product-views-option-facets-color-label-required, .product-views-option-facets-tile-label-required, .product-views-option-float-label-required, .product-views-option-integer-label-required, .product-views-option-password-label-required, .product-views-option-percent-label-required, .product-views-option-phone-label-required, .product-views-option-radio-input-required, .product-views-option-text-label-required, .product-views-option-textarea-label-required, .product-views-option-tile-label-required, .product-views-option-timeofday-label-required, .product-views-option-url-label-required, .paymentinstrument-creditcard-edit-form-required, .paymentinstrument-creditcard-edit-form-label-required, .paymentinstrument-creditcard-required, .profile-change-email-form-group-label-required, .profile-information-form-group-label-required, .profile-information-input-required, .profile-information-input-required-reference, .profile-update-password-form-group-label-required, .return-authorization-form-item-actions-required, .print-statement-form-label-required, .product-list-new-form-required, .mi365-information-input-required,.header-main-nav a.header-mini-cart-menu-cart-link i,.header-main-nav a.header-mini-cart-menu-cart-link,a,.middle-price, .cart-confirmation-modal-price, .cart-detailed-title-details-count, .cart-wearer-title-details-count, .cart-lines-free-price .transaction-line-views-price-lead, .cart-lines-price .transaction-line-views-price-lead, .header-mini-cart-item-cell-product-price, .product-views-price-lead, .transaction-line-views-cell-actionable-expanded-price .transaction-line-views-price-lead, .transaction-line-views-cell-actionable-price .transaction-line-views-price-lead, .product-list-details-later-macro-price .transaction-line-views-price-lead, .transaction-line-views-cell-navigable-actionable-item-amount-value, .transaction-line-views-cell-navigable-item-amount-value, .transaction-line-views-cell-selectable-actionable-price .item-view-lead-price, .transaction-line-views-price-lead,footer h1, footer .large-title, footer .large-title-navigable, footer .large-title-viewonly, footer h2, footer .cms-content th, .cms-content footer th, footer .facets-empty-title, footer .product-details-full-content-header-title, footer .product-details-quickview-item-name, footer h3, footer .facets-category-cell-title, footer h4, footer .footer-content-nav-list > li.footer-content-nav-list-heading, footer h5, footer h6,footer a,.cms-content h1, .cms-content .large-title, .cms-content .large-title-navigable, .cms-content .large-title-viewonly, .cms-content h2, .cms-content th, .cms-content .facets-empty-title, .cms-content .product-details-full-content-header-title, .cms-content .product-details-quickview-item-name,.cms-content div > ol > li:before,.cms-content div > ol > li > ol > li:before,.cms-content div > ol > li > ol > li > ol > li:before,.product-details-full-main .product-views-price-lead{color:" + colour + ";}";
                        body += ".header-menu-level3-anchor:hover,.header-menu-myaccount-signout-link:hover,.header-menu-myaccount-signout-link:hover>i,.header-menu-myaccount-anchor-level3:hover,.header-profile-welcome-link:hover>strong,.header-profile-welcome-link:hover>i,.header-profile-welcome-link:hover,.menu-tree-node-item-anchor:hover,.footer-content-nav-list > li a:hover{color:" + colour + "!important;}";

                        sheet.innerHTML = body;
                        document.body.appendChild(sheet);
                    }
                }
            }

        };

    });