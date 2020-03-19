{{#if isMultiBuy}}
<div class="product-details-multibuy-container">
 <div class="product-details-multibuy-quantities">
<!--new version -->

{{#each multiBuyOptions}}
<div class="product-details-multibuy-flex">
<span data-multibuy-colour="{{colourId}}" class="product-details-multibuy-color2 swatch-{{makeSafe colourLabel}}">
  {{colourLabel}}
</span>
<span class="product-details-multibuy-cell">
  <span class="product-details-multibuy-cell-size">Size:</span>
  
    {{#if showLength}}
    <span class="product-details-multibuy-cell-length">Length:</span>
    {{/if}}
    <span class="product-details-multibuy-cell-quantity-title">Quantity:</span>
</span>
{{#each sizeOptions}}
<span class="product-details-multibuy-cell">
  <span class="product-details-multibuy-cell-size">{{sizeLabel}}</span>
   {{#if ../showLength}}
    <span class="product-details-multibuy-cell-length">{{lengthLabel}}</span>
    {{/if}}
    <span class="product-details-multibuy-cell-quantity"><input type="number" class="product-details-multibuy-quantity-input" data-action="multi-buy-update-quantity" data-item-id="{{itemId}}" min="0" placeholder="0"></span>
</span>
 {{/each}}
</div>
{{/each}}


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
