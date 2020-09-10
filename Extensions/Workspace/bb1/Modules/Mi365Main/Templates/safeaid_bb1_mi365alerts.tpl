<section class="mi365-info-card">
  <span class="mi365-info-card-content">
    <h2><i class="mi365-icon-alert"></i> Alerts</h2>
  </span>
  <ul class="global-views-breadcrumb" itemprop="breadcrumb">
    <li class="global-views-breadcrumb-item"><a href="#Mi365"> Mi365 </a></li>
      <li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
			<li class="global-views-breadcrumb-item-active"> Alerts </li>
</ul>
  <div class="mi365-buttons">
    <button class="mi365-button" data-action="clear">Clear <i class="mi365-buttonicon-delete"></i></button>
  </div>
  <table class="mi365-records">
    <thead class="mi365-records-head">
      <tr class="mi365-records-head-row">
        <th></th>
        <th> Date: </th>
        <th> Message: </th>

      </tr>
    </thead>
    <tbody class="mi365-records-body">
      {{#each models}}
      <tr class="recordviews-selectable-row" data-action="go-to-record" data-id="{{id}}">
        <td class="recordviews-selectable-td-title"> <a class="recordviews-selectable-anchor" data-action="go-to-record"
            href="Mi365/alert/{{id}}"> View </a> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Date:</span> <span
            class="recordviews-selectable-value">{{created}}</span> </td>
            <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Message:</span> <span
            class="recordviews-selectable-value">{{custrecord_bb1_sca_alert_message}}</span> </td>
      </tr>
      {{/each}}
    </tbody>
  </table>

</section>