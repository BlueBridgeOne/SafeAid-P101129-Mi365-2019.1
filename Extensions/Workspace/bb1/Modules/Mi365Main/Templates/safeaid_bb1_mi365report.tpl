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

<div class="list-header-view-datepicker-from">
							<label class="list-header-view-from" for="from">{{rangeFilterLabel}}</label>

							<div class="list-header-view-datepicker-container-input">
								<input class="list-header-view-accordion-body-input" id="from" name="from" type="date" autocomplete="off" data-format="yyyy-mm-dd" value="{{selectedRangeFrom}}" data-action="range-filter" data-todayhighlight="true"/>

								<i class="list-header-view-accordion-body-calendar-icon"></i>
								<a class="list-header-view-accordion-body-clear" data-action="clear-value">
									<i class="list-header-view-accordion-body-clear-icon"></i>
								</a>
							</div>
						</div>

						<div class="list-header-view-datepicker-to">
							<label class="list-header-view-to" for="to">{{translate 'to'}}</label>

							<div class="list-header-view-datepicker-container-input">
								<input class="list-header-view-accordion-body-input" id="to" name="to" type="date" autocomplete="off" data-format="yyyy-mm-dd" value="{{selectedRangeTo}}" data-action="range-filter" data-todayhighlight="true"/>

								<i class="list-header-view-accordion-body-calendar-icon"></i>
								<a class="list-header-view-accordion-body-clear" data-action="clear-value">
									<i class="list-header-view-accordion-body-clear-icon"></i>
								</a>
							</div>
						</div>
{{#if showFilters}}
            <label class="list-header-view-filters">
							<select name="filter" class="list-header-view-accordion-body-select" data-action="filter">
								{{#each filters}}
									<option value="{{value}}"  {{#if selected}} selected {{/if}}>{{text}}</option>
								{{/each}}
							</select>
						</label>
{{/if}}

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
      {{#if show}}
      <tr class="recordviews-selectable-row" >
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Order#:</span> <span
            class="recordviews-selectable-value">{{tranid}}</span> </td>
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Date:</span> <span
            class="recordviews-selectable-value">{{trandate}}</span> </td>
            {{#if ../showBuyers}}
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Buyer:</span> <span
            class="recordviews-selectable-value"><a href="Mi365/buyer/{{custbody_bb1_buyer.value}}"><i class="mi365-buttonicon-buyer"></i> {{custbody_bb1_buyer.text}}</a></span> </td>
            {{/if}}
            {{#if ../showAreas}}
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Area:</span> <span
            class="recordviews-selectable-value"><a href="Mi365/area/{{custcol_bb1_transline_area.value}}"><i class="mi365-buttonicon-area"></i> {{custcol_bb1_transline_area.text}}</a></span> </td>
            {{/if}}
            {{#if ../showWearers}}
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Wearer:</span> <span
            class="recordviews-selectable-value"><a href="Mi365/wearer/{{custcol_bb1_transline_wearer.value}}"><i class="mi365-buttonicon-wearer"></i> {{custcol_bb1_transline_wearer.text}}</a></span> </td>
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
      {{/if}}
      {{/each}}
    </tbody>
  </table>
  <div class="mi365-report-total">Total &pound;{{total}}</div>

</section>