/*BB1 G Truslove 2017*/

define(
	'SafeAid.bb1.Global', [
		'Handlebars', 'SafeAid.bb1.HeaderAlerts.View', 'Header.View', 'bb1.SafeAidGlobal.Menu'
	],
	function (
		Handlebars, HeaderAlertsView, Header, Menu
	) {
		'use strict';

		Handlebars.registerHelper('toJSON', function (obj) {
			return JSON.stringify(obj, null, 3);
		});

		Object.defineProperty&&Object.defineProperty(document, 'title', {
			get: function() {
				
				return this._title;
			},
			set: function(val) {
				this._title = val+" | Safeaid Supplies";
				document.getElementsByTagName("title")[0].innerText=this._title;
			}
		});
		


		$("body",".contact-us-form-primary-submit-button").click(function(){
			var $input=$(".contact-us-form-subject").find("input");
			$input.val($input.props("placeholder"));
		});

		return {
			mountToApp: function mountToApp(container) {

				Header.prototype.childViews.alerts = function () {
					return new HeaderAlertsView({
						application: container
					});
				}

				Menu.mountToApp(container);
			}
		};
	});