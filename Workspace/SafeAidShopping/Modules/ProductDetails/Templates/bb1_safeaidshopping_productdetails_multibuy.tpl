{{#if isMultiBuy}}
<div class="product-details-multibuy-container">
 <div class="product-details-multibuy-quantities">
  <table class="product-details-multibuy-quantity-table-desktop">
  {{#each multiBuyOptions}}
   <tr data-multibuy-colour="{{colourId}}">
    <td rowspan="3" class="product-details-multibuy-color swatch-{{colourLabel}}">{{colourLabel}}</td>
    <th>Size</th>
    {{#each sizeOptions}}
     <th>{{sizeLabel}}</th>
    {{/each}}
   </tr>
   <tr>
   <td>Stock</td>
   {{#each sizeOptions}}
    <td>{{available}}</td>
   {{/each}}
   </tr>
   <tr>
   <td>Quantity</td>
   {{#each sizeOptions}}
    <td class="product-details-multibuy-quantity-td"><input type="number" class="product-details-multibuy-quantity-input" data-action="multi-buy-update-quantity" data-item-id="{{itemId}}" min="0" placeholder="0"></td>
   {{/each}}
   </tr>
  {{/each}}
  </table>
  
  <table class="product-details-multibuy-quantity-table-mobile">
  {{#each multiBuyOptions}}
   <tr data-multibuy-colour="{{colourId}}">
    <td rowspan="{{mobileRowSpan}}" class="product-details-multibuy-color swatch-{{colourLabel}}">{{colourLabel}}</td>
    <th>Size</th>
    <th>Stock</th>
    <th>Quantity</th>
   </tr>
   {{#each sizeOptions}}
   <tr>
    <td>{{sizeLabel}}</td>
    <td>{{#with (lookup ../sizeOptions @index)~}}{{available}}{{/with}}</td>
    <td class="product-details-multibuy-quantity-td"><input type="number" class="product-details-multibuy-quantity-input" data-action="multi-buy-update-quantity" data-item-id="{{itemId}}" min="0" placeholder="0"></td>
   </tr>
   {{/each}}
  {{/each}}
  </table>
 </div>

 {{#unless hideActions}}
 <div class="product-details-multibuy-actions">
  
  <div class="product-details-multibuy-button-container">
   <button type="submit" data-type="multi-buy-add-to-cart" class="product-details-multibuy-addtocart-button">
    Add to Cart
   </button>
   
   <button type="submit" data-type="multi-buy-show-colour-modal" class="product-details-multibuy-gotocolour-button">
    Go to Colour
   </button>
   
   <div data-type="alert-placeholder"></div>
   
  </div>
  
 </div>
 {{/unless}}
</div>
{{/if}}
{{#if showSingleQuantity}}
<div class="product-details-multibuy-single-quantity" data-validation="control-group">
 <label for="quantity" class="product-details-multibuy-single-quantity-title">
  {{translate 'Quantity'}}
 </label>
 <div data-validation="control">
  <input type="number" class="product-details-multibuy-single-quantity-input" data-action="multi-buy-update-quantity" data-item-id="{{itemId}}" min="0" placeholder="0">
 </div>
</div>
{{/if}}

{{!----
Use the following context variables when customizing this template: 
 
 model (Object)

----}}
