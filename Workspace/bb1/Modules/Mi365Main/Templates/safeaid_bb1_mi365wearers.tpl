<section class="mi365-info-card">
  <span class="mi365-info-card-content">
    <h2>Wearers</h2>
  </span>
  <ul class="global-views-breadcrumb" itemprop="breadcrumb">
    <li class="global-views-breadcrumb-item"><a href="#Mi365"> Mi365 </a></li>
      <li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
			<li class="global-views-breadcrumb-item-active"> Wearers </li>
</ul>
  <div class="mi365-buttons">
    <button class="mi365-button" data-action="new">New</button>
  </div>
  <table class="mi365-records">
    <thead class="mi365-records-head">
      <tr class="mi365-records-head-row">
        <th></th>
        <th> Name: </th>
        <th> EMail: </th>
        <th> Phone: </th>
        <th> Area: </th>

      </tr>
    </thead>
    <tbody class="mi365-records-body">
      {{#each models}}
      <tr class="recordviews-selectable-row" data-action="go-to-record" data-id="{{id}}">
        <td class="recordviews-selectable-td-title"> <a class="recordviews-selectable-anchor" data-action="go-to-record"
            href="Mi365/wearer/{{id}}"> Edit </a> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Name:</span> <span
            class="recordviews-selectable-value">{{name}}</span> </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">EMail:</span> <span
            class="recordviews-selectable-value">{{custrecord_bb1_sca_wearer_email}}</span>
        </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Phone:</span> <span
            class="recordviews-selectable-value">{{custrecord_bb1_sca_wearer_phone}}</span>
        </td>
        <td class="recordviews-selectable-td"> <span class="recordviews-selectable-label">Area:</span> <span
            class="recordviews-selectable-value"><a href="Mi365/area/{{custrecord_bb1_sca_wearer_area.value}}">{{custrecord_bb1_sca_wearer_area.text}}</a></span>
        </td>
      </tr>
      {{/each}}
    </tbody>
  </table>

</section>