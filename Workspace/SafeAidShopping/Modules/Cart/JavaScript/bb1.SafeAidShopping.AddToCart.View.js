// @module bb1.SafeAidShopping.Cart
//This is a popup area and wearer chooser.

define('bb1.SafeAidShopping.AddToCart.View', [
	'bb1_safeaidshopping_addtocart.tpl', 'Utils', 'Backbone', 'jQuery', 'underscore'
], function (
	bb1_safeaidshopping_addtocart_tpl, Utils, Backbone, jQuery, _
) {
	'use strict';


	return Backbone.View.extend({

		template: bb1_safeaidshopping_addtocart_tpl

			,
		initialize: function (options) {
			this.success = options.success;
			this.model = options.model;


		},
		title: "Add to Cart",
		events: {

			'click [data-action="confirm"]': 'confirmModal',
			'change #in-modal-area': 'changeArea',
			'change #area': 'changeArea',
			'change #in-modal-wearer': 'changeWearer',
			'change #wearer': 'changeWearer'
		},
		changeArea: function (e) {
			var areas = this.model.get("areas") || [];
			for (var i = 0; i < areas.length; i++) {
				if (e.currentTarget.value == areas[i].value) {
					this.selectedArea = areas[i];
				}
			}

			this.selectedWearer = null;
			this.render();
		},
		changeWearer: function (e) {
			var wearers = this.model.get("wearers") || [];
			for (var i = 0; i < wearers.length; i++) {
				if (e.currentTarget.value == wearers[i].value) {
					this.selectedWearer = wearers[i];
				}
			}
		},
		confirmModal: function () {
				console.log("success");

				var selectedArea = this.selectedArea;

				var areas = this.model.get("areas") || [];
				if (!selectedArea && areas.length > 0) {
					selectedArea = areas[0];
				}

				this.success(selectedArea, this.selectedWearer);
			}
			//@method getContext @return bb1.SafeAidShopping.Cart.View.Context
			,
		getContext: function getContext() {
			var selectedArea = this.selectedArea;

			var areas = this.model.get("areas") || [];
			if (!selectedArea && areas.length > 0) {
				selectedArea = areas[0];
			}

			var newWearers = [],
				wearers = this.model.get("wearers") || [];
			newWearers.push({});
			for (var i = 0; i < wearers.length; i++) {
				if (wearers[i].area == selectedArea.value) {
					newWearers.push(wearers[i])
				}
			}
			return {
				selectedArea: selectedArea,
				areas: this.model.get("areas"),
				wearers: newWearers,
				showWearers: newWearers.length > 1
			};

		}
	});
});