<h5>This order has {{length}} warnings and will require additional approval.</h5>
<br />
{{#each warnings}}
<p><i class="cart-warning-icon"></i> {{text}}</p>
{{/each}}
<br />
<button class="cart-cancel-button" data-action="cancel" data-dismiss="modal">
			{{translate 'Change Order'}}
	</button>
<a class="cart-continue-button" data-action="confirm" href="#" data-touchpoint="checkout" data-hashtag="#">{{translate 'Proceed to Checkout'}}</a>