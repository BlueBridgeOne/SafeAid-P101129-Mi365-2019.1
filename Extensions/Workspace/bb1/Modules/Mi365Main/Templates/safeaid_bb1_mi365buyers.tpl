<section class="mi365-info-card">
  <span class="mi365-info-card-content">
    <h2><i class="mi365-icon-buyer"></i> Buyers</h2>
  </span>
  <ul class="global-views-breadcrumb" itemprop="breadcrumb">
    <li class="global-views-breadcrumb-item"><a href="#Mi365"> Mi365 </a></li>
      <li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
			<li class="global-views-breadcrumb-item-active"> Buyers </li>
</ul>
  <div class="mi365-buttons">
    {{#if showNew}}
    <button class="mi365-button" data-action="new">New <i class="mi365-buttonicon-new"></i></button>
    {{/if}}
  </div>
  <table class="mi365-records">
    <thead class="mi365-records-head">
      <tr class="mi365-records-head-row">
        <th></th>
        <th> Name: </th>
        <th> EMail: </th>
        <th> Phone: </th>

      </tr>
    </thead>
    <tbody class="mi365-records-body">
      {{#each models}}
      <tr class="recordviews-selectable-row" data-action="go-to-record" data-id="{{id}}">
        <td class="recordviews-selectable-td-title"> <a class="recordviews-selectable-anchor" data-action="go-to-record"
            href="Mi365/buyer/{{id}}"> Edit </a> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Name:</span> <span
            class="recordviews-selectable-value">{{entityid}}</span> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">EMail:</span> <span
            class="recordviews-selectable-value">{{email}}</span>
        </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Phone:</span> <span
            class="recordviews-selectable-value">{{phone}}</span>
        </td>
      </tr>
      {{/each}}
    </tbody>
  </table>

</section>