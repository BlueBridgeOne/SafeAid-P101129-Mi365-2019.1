<section class="mi365-info-card">
  <span class="mi365-info-card-content">
    <h2><i class="mi365-icon-report"></i> {{name}}</h2>
  </span>
  <ul class="global-views-breadcrumb" itemprop="breadcrumb">
    <li class="global-views-breadcrumb-item"><a href="#Mi365"> Mi365 </a></li>
      <li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
      <li class="global-views-breadcrumb-item"><a href="#Mi365/reports"> Reports </a></li>
      <li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
			<li class="global-views-breadcrumb-item-active"> {{name}}</li>
</ul>

  <table class="mi365-records">
    <thead class="mi365-records-head">
      <tr class="mi365-records-head-row">
        <th> Order#: </th>
<th> Date: </th>
{{#if showBuyers}}
<th> Buyer: </th>
{{/if}}
{{#if showAreas}}
<th> Area: </th>
{{/if}}
{{#if showWearers}}
<th> Wearer: </th>
{{/if}}
{{#if showItems}}
<th> Item: </th>
<th> Quantity: </th>
<th> Amount: </th>
{{else}}
<th> Total: </th>
{{/if}}
      </tr>
    </thead>
    <tbody class="mi365-records-body">
      {{#each lines}}
      <tr class="recordviews-selectable-row" >
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Order#:</span> <span
            class="recordviews-selectable-value">{{tranid}}</span> </td>
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Date:</span> <span
            class="recordviews-selectable-value">{{trandate}}</span> </td>
            {{#if ../showBuyers}}
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Buyer:</span> <span
            class="recordviews-selectable-value"><a href="Mi365/buyer/{{custbody_bb1_buyer.value}}"><i class="mi365-icon-buyer"></i> {{custbody_bb1_buyer.text}}</a></span> </td>
            {{/if}}
            {{#if ../showAreas}}
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Area:</span> <span
            class="recordviews-selectable-value"><a href="Mi365/area/{{custcol_bb1_transline_area.value}}"><i class="mi365-icon-area"></i> {{custcol_bb1_transline_area.text}}</a></span> </td>
            {{/if}}
            {{#if ../showWearers}}
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Wearer:</span> <span
            class="recordviews-selectable-value"><a href="Mi365/wearer/{{custcol_bb1_transline_wearer.value}}"><i class="mi365-icon-wearer"></i> {{custcol_bb1_transline_wearer.text}}</a></span> </td>
            {{/if}}
            {{#if ../showItems}}
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Item:</span> <span
            class="recordviews-selectable-value">{{item}}</span> </td>
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Quantity:</span> <span
            class="recordviews-selectable-value">{{quantity}}</span> </td>
             <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Amount:</span> <span
            class="recordviews-selectable-value">&pound;{{amount}}</span> </td>
            {{else}}
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Total:</span> <span
            class="recordviews-selectable-value">&pound;{{total}}</span> </td>
            {{/if}}
      </tr>
      {{/each}}
    </tbody>
  </table>
  <div class="mi365-report-total">Total &pound;{{total}}</div>

</section>