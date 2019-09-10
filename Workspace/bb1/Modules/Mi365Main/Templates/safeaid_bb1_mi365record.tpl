<section class="mi365-info-card">
  <span class="mi365-info-card-content">
    <h2>{{title}}</h2>
  </span>
  <ul class="global-views-breadcrumb" itemprop="breadcrumb">
    <li class="global-views-breadcrumb-item"><a href="#Mi365"> Mi365 </a></li>
    <li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
    {{#each breadcrumbs}}
    <li class="global-views-breadcrumb-item"><a href="{{href}}"> {{label}} </a></li>
    <li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
    {{/each}}
    <li class="global-views-breadcrumb-item-active"> {{active}}</li>
  </ul>

  <div class="mi365-buttons">
    {{#if showWearers}}
    <button class="mi365-button" data-action="wearers">Wearers</button>
    {{/if}}
    {{#if showStock}}
    <button class="mi365-button" data-action="stock">Stock</button>
    {{/if}}
    {{#if showTransfers}}
    <button class="mi365-button" data-action="transfers">Transfers</button>
    {{/if}}
    {{#if showConfirm}}
    <button class="mi365-button" data-action="confirm">Confirm</button>
    {{/if}}
    {{#if showDelete}}
    <button class="mi365-button" data-action="delete">Delete</button>
    {{/if}}
    {{#if showStartTransfer}}
    <button class="mi365-button" data-action="start-transfer">Transfer to Wearer</button>
    {{/if}}
  </div>

  <div data-type="alert-placeholder"></div>
  <form class="mi365_info">
    <fieldset>
      {{#each fields}}
      {{#if listonly}}
      {{else}}
      {{#ifEquals type "text"}}
      <div class="mi365-information-row {{#unless ../editable}}mi365-information-input-readonly{{/unless}}"
        data-input="{{id}}" data-validation="control-group"><label class="mi365-information-label" for="{{id}}">
          {{label}} {{#if ../editable}}{{#if mandatory}}<small class="mi365-information-input-required">*</small>
          {{else}} <small class="mi365-information-input-optional">(optional)</small>{{/if}}{{/if}}</label>
        <div class="mi365-information-group-form-controls" data-validation="control">
          <input type="text" {{#unless ../editable}}readonly{{/unless}} class="mi365-information-input-large"
            id="{{id}}" name="{{id}}" value="{{value}}"></div>
      </div>
      {{/ifEquals}}
      {{#ifEquals type "readonlytext"}}
      <div class="mi365-information-row" data-input="{{id}}" data-validation="control-group"><label
          class="mi365-information-label" for="{{id}}">
          {{label}}</label>
        <div class="mi365-information-group-form-controls" data-validation="control">
          <input type="text" readonly class="mi365-information-input-large" value="{{value}}"></div>
      </div>
      {{/ifEquals}}

      {{#ifEquals type "record"}}
      <div class="mi365-information-row {{#unless ../editable}}mi365-information-input-readonly{{/unless}}"
        data-input="{{id}}" data-validation="control-group"><label class="mi365-information-label" for="{{id}}">
          {{label}} {{#if ../editable}}{{#if mandatory}}<small class="mi365-information-input-required">*</small>
          {{else}} <small class="mi365-information-input-optional">(optional)</small>{{/if}}{{/if}}</label>
        <div class="mi365-information-group-form-controls" data-validation="control">
          {{#if url}}<a href="{{url}}{{value.value}}">{{/if}}{{value.text}}{{#if url}}</a>{{/if}}
        </div>
      </div>
      {{/ifEquals}}

      {{#ifEquals type "checkbox"}}
      <div class="mi365-information-row"><label class="mi365-fields-group-input-checkbox">
          {{#if ../editable}}
          <input type="checkbox" id="{{id}}" {{#ifEquals value 'T'}}checked{{/ifEquals}} value="T"
            data-unchecked-value="F" name="{{id}}">
          {{else}}
          {{#ifEquals value 'T'}}
          <span class="mi365-icon"><i class="mi365-icon-true" /></span>
          {{else}}
          <span class="mi365-icon"><i class="mi365-icon-false" /></span>
          {{/ifEquals}}
          {{/if}}
          {{label}}
        </label>
      </div>
      {{/ifEquals}}

      {{#ifEquals type "choice"}}
      <div class="mi365-information-row {{#unless ../editable}}mi365-information-input-readonly{{/unless}}"
        data-input="{{id}}" data-validation="control-group"><label class="mi365-information-label" for="{{id}}">
          {{label}} {{#if ../editable}}{{#if mandatory}}<small class="mi365-information-input-required">*</small>
          {{else}} <small class="mi365-information-input-optional">(optional)</small>{{/if}}{{/if}}</label>
        <div class="mi365-information-group-form-controls" data-validation="control">
         
          <select {{#unless ../editable}}readonly{{/unless}} class="mi365-information-input-large"
            id="{{id}}" name="{{id}}">
            {{#each value.choice}}
            <option value={{value}} {{#ifEquals value ../value.value}}selected{{/ifEquals}}>{{text}}</option>
            {{/each}}
            </select></div>
      </div>
      {{/ifEquals}}

      {{#ifEquals type "signature"}}
      <div class="mi365-information-row {{#unless ../editable}}mi365-information-input-readonly{{/unless}}"
        data-input="{{id}}" data-validation="control-group"><label class="mi365-information-label" for="{{id}}">
          {{label}} {{#if ../editable}}{{#if mandatory}}<small class="mi365-information-input-required">*</small>
          {{else}} <small class="mi365-information-input-optional">(optional)</small>{{/if}}{{/if}}</label>
        <div class="mi365-information-group-form-controls" data-validation="control">
           {{#if ../editable}}
          <canvas id="mySignCanvas" width="600" height="300" style="width:100%;border:1px solid #CCC;">
          </canvas>
          <input id="{{id}}" name="{{id}}" value="{{value}}" type="hidden" />
          {{else}}
          <canvas id="mySignCanvas" class="readonly-sign" width="600" height="300" style="width:100%;border:1px solid #CCC;">
          </canvas>
          {{/if}}
        </div>
        {{/ifEquals}}

        {{/if}}
        {{/each}}
    </fieldset>
          {{#if task}}
      <input type="hidden" id="task" name="task" value="{{task}}">
      {{/if}}
    {{#if editable}}
    <div class="mi365-information-form-actions"><button type="submit"
        class="mi365-information-button-update">{{#if confirmText}}{{confirmText}}{{else}}Update{{/if}}</button></div>
    {{/if}}
  </form>


</section>