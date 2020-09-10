<section class="mi365-info-card">
  <span class="mi365-info-card-content">
    <h2><i class="mi365-icon-report"></i> Reports</h2>
  </span>
  <ul class="global-views-breadcrumb" itemprop="breadcrumb">
    <li class="global-views-breadcrumb-item"><a href="#Mi365"> Mi365 </a></li>
      <li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
			<li class="global-views-breadcrumb-item-active"> Reports </li>
</ul>

  <table class="mi365-records">
    <thead class="mi365-records-head">
      <tr class="mi365-records-head-row">
        <th></th>
        <th> Name: </th>

      </tr>
    </thead>
    <tbody class="mi365-records-body">
      {{#each reports}}
      <tr class="recordviews-selectable-row" data-action="go-to-report" data-id="{{id}}">
        <td class="recordviews-selectable-td-title"> <a class="recordviews-selectable-anchor" data-action="go-to-report"
            href="Mi365/report/{{id}}"> View </a> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Name:</span> <span
            class="recordviews-selectable-value">{{name}}</span> </td>
      </tr>
      {{/each}}
    </tbody>
  </table>

</section>