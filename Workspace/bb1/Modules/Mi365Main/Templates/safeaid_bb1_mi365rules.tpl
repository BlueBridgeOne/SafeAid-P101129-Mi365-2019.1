<section class="mi365-info-card">
  <span class="mi365-info-card-content">
    <h2><i class="mi365-icon-rule"></i> {{title}}</h2>
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
    {{#if showNew}}
    <button class="mi365-button" data-action="new">New <i class="mi365-icon-new"></i></button>
    {{/if}}
  </div>
  <table class="mi365-records">
    <thead class="mi365-records-head">
      <tr class="mi365-records-head-row">
        <th></th>
        <th> Item: </th>
        <th> Area: </th>

        <th> Wearer: </th>

        <th> Quantity: </th>
        <th> Duration: </th>
      </tr>
    </thead>
    <tbody class="mi365-records-body">
      {{#each models}}
      <tr class="recordviews-selectable-row" data-action="go-to-record" data-id="{{id}}">
        <td class="recordviews-selectable-td-title"> <a class="recordviews-selectable-anchor" data-action="go-to-record"
            href="Mi365/rule/{{id}}"> Edit </a> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Item:</span> <span
            class="recordviews-selectable-value">{{custrecord_bb1_sca_rule_item.text}}</span> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Area:</span> <span
            class="recordviews-selectable-value"><a
              href="#Mi365/area/{{custrecord_bb1_sca_rule_area.value}}"><i class="mi365-icon-area"></i> {{custrecord_bb1_sca_rule_area.text}}</a></span>
        </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Wearer:</span> <span
            class="recordviews-selectable-value">{{#if custrecord_bb1_sca_rule_wearer.value}}<a
              href="#Mi365/wearer/{{custrecord_bb1_sca_rule_wearer.value}}"><i class="mi365-icon-wearer"></i> {{custrecord_bb1_sca_rule_wearer.text}}</a>{{else}}All{{/if}}</span>
        </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Quantity:</span> <span
            class="recordviews-selectable-value">{{custrecord_bb1_sca_rule_quantity}}</span> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Duration:</span> <span
            class="recordviews-selectable-value">{{custrecord_bb1_sca_rule_duration.text}}</span> </td>
      </tr>
      {{/each}}
    </tbody>
  </table>

</section>