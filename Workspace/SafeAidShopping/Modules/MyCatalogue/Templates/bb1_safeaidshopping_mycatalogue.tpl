<section class="mycatalogue-container">
 <div data-cms-area="item_list_banner" data-cms-area-filters="page_type"></div>

 <div class="mycatalogue-list">
  <header class="mycatalogue-list-header">
   <h2>{{pageHeader}}</h2>
  </header>

  <div data-view="ListHeader"></div>

  {{#if showItems}}
   <div class="mycatalogue-list-items-container">
    <div class="mycatalogue-list-items">
     
      <div class="row" data-view="Catalogue.Items">
      </div>
     
    </div>
    <div class="mycatalogue-list-item-actions">
     <div class="product-details-multibuy-button-container">
      <button type="submit" data-type="multi-buy-add-to-cart" class="product-details-multibuy-addtocart-button">
       {{translate 'Add to Cart'}}
      </button>
      <!--<button type="submit" data-type="multi-buy-show-colour-modal" class="product-details-multibuy-gotocolour-button">
       {{translate 'Go to Colour'}}
      </button>-->
      <div data-type="alert-placeholder"></div>
     </div>
    </div>
   </div>
  {{/if}}
  {{#if itemsNotFound}}
   <div class="mycatalogue-list-empty-section">
    <h5>{{translate 'You have no items setup in your catalogue.'}}</h5>
    <p><a class="mycatalogue-list-empty-button" href="#" data-touchpoint="home">{{translate 'Shop Now'}}</a></p>
   </div>
  {{/if}}

  {{#if isLoading}}
   <p class="mycatalogue-list-empty">{{translate 'Loading...'}}</p>
  {{/if}}

  {{#if showPagination}}
   <div class="mycatalogue-list-paginator">
    <div data-view="GlobalViews.Pagination"></div>
    {{#if showCurrentPage}}
     <div data-view="GlobalViews.ShowCurrentPage"></div>
    {{/if}}
   </div>
  {{/if}}
 </div>


</div>


{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}
