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
  <table class="mi365-records">
    <thead class="mi365-records-head">
      <tr class="mi365-records-head-row">
        <th></th>
        <th> Date: </th>
        <th> From Area: </th>
        <th> To Wearer: </th>
        <th> Quantity: </th>
        <th> Confirmed: </th>

      </tr>
    </thead>
    <tbody class="mi365-records-body">
      {{#each models}}
      <tr class="recordviews-selectable-row" data-action="go-to-record" data-id="{{id}}">
        <td class="recordviews-selectable-td-title"> <a class="recordviews-selectable-anchor" data-action="go-to-record"
            href="Mi365/transfer/{{id}}"> View </a> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Date:</span> <span
            class="recordviews-selectable-value">{{created}}</span> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">From Area:</span> <span
            class="recordviews-selectable-value"><a href="#Mi365/area/{{custrecord_bb1_sca_costocktrans_area.value}}">{{custrecord_bb1_sca_costocktrans_area.text}}</a></span> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">To Wearer:</span> <span
            class="recordviews-selectable-value"><a href="#Mi365/wearer/{{custrecord_bb1_sca_costocktrans_wearer.value}}">{{custrecord_bb1_sca_costocktrans_wearer.text}}</a></span> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Quantity:</span> <span
            class="recordviews-selectable-value">{{custrecord_bb1_sca_costocktrans_quantity}}</span> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Confirmed:</span> <span
            class="recordviews-selectable-value">{{#ifEquals custrecord_bb1_sca_costocktrans_confirme 'T'}}
          <span class="mi365-icon"><i class="mi365-icon-true" /></span>
          {{else}}
          <span class="mi365-icon"><i class="mi365-icon-false" /></span>
          {{/ifEquals}}</span> </td>
      </tr>
      {{/each}}
    </tbody>
  </table>

</section>