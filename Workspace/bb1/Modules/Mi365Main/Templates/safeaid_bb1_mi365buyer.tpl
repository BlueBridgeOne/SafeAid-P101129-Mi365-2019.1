<section class="mi365-info-card">
  <span class="mi365-info-card-content">
    <h2>Buyer</h2>
  </span>
  <ul class="global-views-breadcrumb" itemprop="breadcrumb">
    <li class="global-views-breadcrumb-item"><a href="#Mi365"> Mi365 </a></li>
    <li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
    <li class="global-views-breadcrumb-item"><a href="#Mi365/buyers"> Buyers </a></li>
    <li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
    <li class="global-views-breadcrumb-item-active"> {{model.entityid}}</li>
  </ul>
  <div class="mi365-buttons">
    <button class="button-secondary button-medium" data-action="delete">Delete</button>
  </div>
  <div data-type="alert-placeholder"></div>
  <form class="mi365_info">
    <fieldset>
      {{#each fields}}
      {{#if listonly}}
      {{else}}
      {{#ifEquals type "text"}}
      <div class="mi365-information-row" data-input="{{id}}" data-validation="control-group"><label
          class="mi365-information-label" for="{{id}}"> {{label}} {{#if mandatory}}<small
            class="mi365-information-input-required">*</small> {{else}} <small
            class="mi365-information-input-optional">(optional)</small> </label> {{/if}}</label>
        <div class="mi365-information-group-form-controls" data-validation="control"><input type="text"
            class="mi365-information-input-large" id="{{id}}" name="{{id}}" value="{{value}}"></div>
      </div>
      {{/ifEquals}}

      {{#ifEquals type "checkbox"}}
      <div class="mi365-information-row"><label class="mi365-fields-group-input-checkbox">
          <input type="checkbox" id="{{id}}" {{#ifEquals value 'T'}}checked{{/ifEquals}} value="T"
            data-unchecked-value="F" name="{{id}}">
          {{label}}
        </label>
      </div>
      {{/ifEquals}}
      {{/if}}
      {{/each}}
    </fieldset>
    <div class="mi365-information-form-actions"><button type="submit"
        class="mi365-information-button-update">Update</button></div>
  </form>


</section>