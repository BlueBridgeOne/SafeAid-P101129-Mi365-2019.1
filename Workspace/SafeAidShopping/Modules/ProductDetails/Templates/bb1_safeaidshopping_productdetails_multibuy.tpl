{{#if isMultiBuy}}
<div class="product-details-multibuy-container">
 <div class="product-details-multibuy-quantities">
<!--new version -->

{{#each multiBuyOptions}}
<div class="product-details-multibuy-flex">
<span class="product-details-multibuy-color2 swatch-{{makeSafe colourLabel}}">
  {{colourLabel}}
</span>
<span class="product-details-multibuy-cell">
  <span class="product-details-multibuy-cell-size">Size</span>
  
    {{#if showLength}}
    <span class="product-details-multibuy-cell-length">Length</span>
    {{/if}}
</span>
{{#each sizeOptions}}
<span class="product-details-multibuy-cell">
  <span class="product-details-multibuy-cell-size">{{sizeLabel}}</span>
</span>
 {{/each}}
</div>
{{/each}}

   <!--old version -->
  <table class="product-details-multibuy-quantity-table-desktop">
  {{#each multiBuyOptions}}
   <tr data-multibuy-colour="{{colourId}}">
    <td rowspan="{{height}}" class="product-details-multibuy-color swatch-{{makeSafe colourLabel}}">{{colourLabel}}</td>
    <th>Size</th>
    {{#each sizeOptions}}
     <th>{{sizeLabel}}</th>
    {{/each}}
   </tr>
   {{#if showLength}}
   <tr>
   <th>Length</th>
   {{#each sizeOptions}}
    <th>{{lengthLabel}}</th>
   {{/each}}
   </tr>
   {{/if}}
   {{#if showStock}}
   <tr>
   <td>Stock</td>
   {{#each sizeOptions}}
    <td>{{available}}</td>
   {{/each}}
   </tr>
   {{/if}}
   <tr>
   <td class="product-details-multibuy-quantity-td">Quantity</td>
   {{#each sizeOptions}}
    <td class="product-details-multibuy-quantity-td"><input type="number" class="product-details-multibuy-quantity-input" data-action="multi-buy-update-quantity" data-item-id="{{itemId}}" min="0" placeholder="0"></td>
   {{/each}}
   </tr>
   <tr class="product-details-multibuy-spacer"><td>&nbsp;</td></tr class="product-details-multibuy-spacer">
  {{/each}}
  </table>
  
  <table class="product-details-multibuy-quantity-table-mobile">
  {{#each multiBuyOptions}}
   <tr data-multibuy-colour="{{colourId}}">
    <td rowspan="{{mobileRowSpan}}" class="product-details-multibuy-color swatch-{{makeSafe colourLabel}}">{{colourLabel}}</td>
    <th>Size</th>
    {{#if showStock}}
    <th>Stock</th>
    {{/if}}
    <th>Quantity</th>
   </tr>
   {{#each sizeOptions}}
   <tr>
    <td>{{sizeLabel}}</td>
    {{#if ../showStock}}
    <td>{{#with (lookup ../sizeOptions @index)~}}{{available}}{{/with}}</td>
    {{/if}}
    <td class="product-details-multibuy-quantity-td"><input type="number" class="product-details-multibuy-quantity-input" data-action="multi-buy-update-quantity" data-item-id="{{itemId}}" min="0" placeholder="0"></td>
   </tr>
   {{/each}}
    <tr class="product-details-multibuy-spacer"><td>&nbsp;</td></tr class="product-details-multibuy-spacer">
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
  <input type="number" class="product-details-multibuy-single-quantity-input" data-action="multi-buy-update-quantity" data-item-id="{{model.item.internalid}}" min="0" placeholder="0">
 </div>
</div>
{{/if}}

{{!----
Use the following context variables when customizing this template: 
 
 model (Object)

----}}
