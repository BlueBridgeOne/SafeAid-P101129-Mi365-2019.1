{{#each tree}}
<h3>{{label}}</h3>
{{#if hasModels}}
<div data-view="Cart.Lines" data-list="{{models}}"></div>
<br />
{{/if}}
{{#each wearers}}
<div class="cart-wearer-title">
    <a class="cart-wearer-title-toggle collapsed" data-toggle="collapse" data-target="#cart-wearer-{{internalid}}" aria-expanded="true" aria-controls="cart-wearer-{{internalid}}">
					
    <h4>{{label}} <small class="cart-wearer-title-details-count">{{products}}
            Products, {{items}} Items</small>
            		<i class="cart-summary-expander-toggle-icon-promocode"></i></h4>
				</a>
</div>
<div id="cart-wearer-{{internalid}}" class="cart-wearer-body collapse">
    <div data-view="Cart.Lines" data-list="{{models}}"></div>
</div>
<br />
{{/each}}
{{/each}}