{{!----
Description : Alerts in the header
Author : Gordon Truslove
Date : 11/18/2019, 4:47:34 PM
----}}
{{#if show}}
<a class="header-mini-cart-menu-cart-link {{#if hasAlerts}}header-alert-enabled{{else}}header-alert{{/if}}" title="Alerts"  href="#" data-touchpoint="customercenter" data-hashtag="#/Mi365/alerts">
	<i class="header-menu-alert-icon"></i>
	<span class="header-mini-cart-menu-cart-legend">
				{{alerts}}
	</span>
</a>
{{/if}}