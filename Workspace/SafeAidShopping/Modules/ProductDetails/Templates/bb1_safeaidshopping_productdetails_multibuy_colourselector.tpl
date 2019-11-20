<div class="product-details-multibuy-colour-selector-container">
 <div class="product-details-multibuy-colour-selector">
  {{#each colourOptions}}
   {{#if internalid}}
   <div class="product-details-multibuy-colour-tile" data-action="show-colour" data-multibuy-colour="{{internalid}}">{{label}}</div>
   {{/if}}
  {{/each}}
 </div>
</div>

{{!----
Use the following context variables when customizing this template: 
 
 model (Object)

----}}
