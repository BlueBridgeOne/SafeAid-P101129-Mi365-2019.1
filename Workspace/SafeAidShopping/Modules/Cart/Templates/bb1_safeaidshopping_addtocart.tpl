
     <div class="addtocart-row"
        data-input="area" data-validation="control-group"><label class="addtocart-label" for="area">
          Area <small class="addtocart-input-required">*</small></label>
        <div class="addtocart-group-form-controls" data-validation="control">
          
          <select class="addtocart-input-large" id="area"
            name="area">
            {{#each areas}}
            <option value={{value}} {{#ifEquals value ../selectedArea.value}}selected{{/ifEquals}}>{{text}}</option>
            {{/each}}
          </select>
          
        </div>
      </div>
{{#if showWearers}}
           <div class="addtocart-row"
        data-input="wearer" data-validation="control-group"><label class="addtocart-label" for="wearer">
          Wearer <small class="addtocart-input-optional">(optional)</small></label>
        <div class="addtocart-group-form-controls" data-validation="control">
          
          <select class="addtocart-input-large" id="wearer"
            name="wearer">
            {{#each wearers}}
            <option value={{value}} {{#ifEquals value ../value.value}}selected{{/ifEquals}}>{{text}}</option>
            {{/each}}
          </select>
          
        </div>
      </div>
{{/if}}
    <button class="button-primary button-large" data-action="confirm" data-dismiss="modal">{{translate 'Confirm'}}</button>