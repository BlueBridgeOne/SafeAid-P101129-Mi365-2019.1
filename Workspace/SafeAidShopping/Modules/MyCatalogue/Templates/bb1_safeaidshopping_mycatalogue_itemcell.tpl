<div class="mycatalogue-list-item {{#if isMatrix}}col-xs-12{{else}}col-xs-12 col-sm-6{{/if}}" itemprop="itemListElement"  data-item-id="{{itemId}}" itemscope itemtype="https://schema.org/Product" data-track-productlist-list="{{track_productlist_list}}" data-track-productlist-category="{{track_productlist_category}}" data-track-productlist-position="{{track_productlist_position}}" data-sku="{{sku}}">
 <div class="mycatalogue-list-item-left{{#unless isMatrix}}-2{{/unless}}">
  <div class="mycatalogue-list-item-image-wrapper">
   {{#if itemIsNavigable}}
    <a class="mycatalogue-list-item-anchor" href='{{url}}'>
     <img class="mycatalogue-list-item-image" src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}" itemprop="image">
    </a>
   {{else}}
    <img class="mycatalogue-list-item-image" src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}" itemprop="image">
   {{/if}}
   {{#if isEnvironmentBrowser}}
    <div class="mycatalogue-list-item-quick-view-wrapper">
     <a href="{{url}}" class="mycatalogue-list-item-quick-view-link" data-toggle="show-in-modal">
      <i class="mycatalogue-list-item-quick-view-icon"></i>
      {{translate 'Quick View'}}
     </a>
    </div>
   {{/if}}
  </div>
 </div>
 <div class="mycatalogue-list-item-middle{{#unless isMatrix}}-2{{/unless}}">
  <meta itemprop="url" content="{{url}}">
  <h2 class="mycatalogue-list-item-title">
   {{#if itemIsNavigable}}
    <a class="mycatalogue-list-item-name" href='{{url}}'>
     <span itemprop="name">
      {{name}}
     </span>
    </a>
   {{else}}
    <span itemprop="name">
     {{name}}
    </span>
   {{/if}}
  </h2>
<div class="product-line-sku-label">{{itemid}}</div>
  <div class="mycatalogue-list-item-pricea">
   <div data-view="ItemViews.Price"></div>
  </div>

  {{#if showRating}}
  <div class="mycatalogue-list-item-rating" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating"  data-view="GlobalViews.StarRating">
  </div>
  {{/if}}

  <div data-view="ItemDetails.Options"></div>

  <div data-view="Cart.QuickAddToCart"></div>

  <div class="mycatalogue-list-item-stock">
   <div data-view="ItemViews.Stock" class="mycatalogue-list-item-stock-message"></div>
  </div>

  <div data-view="StockDescription"></div>
 </div>
 <div class="mycatalogue-list-item-right{{#unless isMatrix}}-2{{/unless}}">
  <div data-view="MultiBuy.MatrixOptions"></div>
 </div>
</div>




{{!----
Use the following context variables when customizing this template: 
 
 itemId (Number)
 name (String)
 url (String)
 sku (String)
 isEnvironmentBrowser (Boolean)
 thumbnail (Object)
 thumbnail.url (String)
 thumbnail.altimagetext (String)
 itemIsNavigable (Boolean)
 showRating (Boolean)
 rating (Number)

----}}
