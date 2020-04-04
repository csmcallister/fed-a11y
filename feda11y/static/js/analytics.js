const $table = $('#table')

$('#table').bootstrapTable({
  formatLoadingMessage: function formatLoadingMessage() {
    return '<b style="color: #275DAD">Loading</b>';
  },
  exportTypes: ['json', 'csv'],
});


function detailFormatter(index, row, element) {
  let html = [];
  let modals = [];
  let pageUrl;
  let pageId;

  let emailBody = `To whom it may concern,

I would like to report <nIssues> accessibility issue(s) for <urlplaceholder>.

Based on automated accessibility scans conducted by FedA11y.com, this Federal website violates the following accessibility standards:

`;
  let issueNumber = 1
  let errorTypes = []
  domainForEmail = ''
  subdomainForEmail = ''
  $.each(row, function (key, value) {
    
    if (key==='errors') {
      let issues = value.issues;
      emailBody = emailBody.replace("<urlplaceholder>", value.pageUrl)
      pageUrl = (pageUrl) ? `<a href="${pageUrl}" target="_blank">${pageUrl}</a>` : `<a href="${value.pageUrl}" target="_blank">${value.pageUrl}</a>`;
      pageId = (pageId) ? pageId : pageUrl.split("://")[1].split(".")[0];
      
      issues.forEach( (issue, i) => {
        let context = (issue.context) ? issue.context : "No context details";
        let errorType = issue.code
        errorTypes.push(errorType)
        //let errorType = issue.code.split(".")[issue.code.split(".").length -1].replace(/([A-Z])/g, ' $1').trim();
        //large modal is only 100 characters wide, so insert a newline every 98 characters to avoid overflow
        //might need to adjust for mobile
        let htmlFormattedContext = process(context).replace(/(.{98})/g,"\n")
        let dataTarget = `contextModal${pageId}${i}`
        let formattedContext = `<xmp id"${dataTarget}Details"=>${htmlFormattedContext}</xmp>`;
        let message = issue.message
        issueNumber += 1
        modals.push(
          `
          <!-- Modal -->
          <div id="${dataTarget}" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="${dataTarget}Label" aria-hidden="true" aria-describedby="${dataTarget}Info ${dataTarget}Details">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="${dataTarget}Label">HTML Context</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p id="${dataTarget}Info">A snippet of HTML for the context of the error:</p>
                  ${formattedContext}                  
                </div>
              </div>
            </div>
          </div>
          `
        )

        html.push(
          `
          <tr>
            <td>${errorType}</td>
            <td>${message}</td>
            <td>
              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#${dataTarget}">
                View HTML Context
              </button>
            </td>
           </tr>
          `
        )
      })
    } else {
      if (key === 'Domain') {
        domainForEmail += value;
      } else if (key === 'Subdomain') {
        subdomainForEmail += value;
      }
    }
  });
  
  emailBody = emailBody.replace("<nIssues>", issueNumber - 1)
  let emailIssues = errorTypes.filter( (v, i, s) => {return s.indexOf(v) === i}).join("\n")
  emailBody += `${emailIssues}\n`
  emailBody += "\nThese codes reference sections in paragraph 1194.22 of the Section 508 Standards for Electronic and Information Technology.\n"
  let emailUrl = (subdomainForEmail) ? subdomainForEmail.match(/href="([^"]*)/)[1] : domainForEmail.match(/href="([^"]*)/)[1];
  emailBody += `\nYou can find more details on the underlying scan results by visiting FedA11y at https://www.feda11y.com${emailUrl}.`
  
  emailBody = encodeURIComponent(emailBody)
  
  modals.forEach( (modal) => {
    // place modals in a top-level position to avoid interference.
    document.body.insertAdjacentHTML('afterbegin', modal);
  });


  let detailTableParagraph = (issueNumber - 1) ? `<p>Accessibility issue(s) for ${pageUrl} <i class="fa fa-external-link"></i></p>` : `<p>No accessibility issues for ${pageUrl}</p>`
  let emailButton = (issueNumber - 1) ? `<div class="col-sm text-right">
  <a href="mailto:section.508@gsa.gov?subject=Reprting%20DotGov%20Accessibility%20Issues&body=${emailBody}" target="_blank" class="btn btn-primary btn-email btn-md"> <i class="fa fa-envelope" aria-hidden="true"></i> Report Issues to Section508.gov <span class='sr-only'>Send an email in a new browser tab to</span></a>
</div>` : ``

  let issuesTable = (issueNumber -1 ) ? `<div class="row">
  <div class="col-12">
    <div class="table-responsive">
      <table class="table" aria-label="Sub-table of accessibility issues.">
        <thead class="thead-custom"">
          <tr>
            <th>&nbsp;&nbsp;Error Type</th>
            <th>&nbsp;&nbsp;Error Message</th>
            <th>&nbsp;&nbsp;Context</th>
          </tr>
        </thead>
        <tbody>
          ${html.join('')}
        <tbody>
      </table>
    </div>
  </div>
</div>` : ``
  
  let detailTable = `
    <div id="issues-container" class="container">
      <div class="row">
        <div class="col-sm text-left">
          ${detailTableParagraph}
        </div>
        ${emailButton}
      </div>
    </div>

    ${issuesTable}
  `
  return detailTable
}
  
function responseHandler(res) {
  parsedResponse = []
  $.each(res, function (i, row) {
    let scanDate = row['scanDate']
    let domain = row['domain']
    let subdomain = row['subdomain']
    subdomain = (subdomain === 'NA') ? '' : subdomain
    let url = row['routeableUrl']
    let tld = url.split('.').pop()
    let shortUrl = (subdomain) ? `${domain}.${subdomain}.${tld}` : `${domain}.${tld}`
    let urlHtml = `<a href="${url}" target="_blank">${shortUrl} <i class="fa fa-external-link"></i></a>`
    let errors = JSON.parse(row['issues'])
    let agency = row['agency']
    let org = row['organization']
    let agencyVal = `<a href="/analytics?agency=${agency}" aria-label="${agency}. Click to filter table to just this agency.">${agency} <i class="fa fa-filter"></i></a>`
    let orgVal = `<a href="/analytics?org=${org}&agency=${agency}" aria-label="${org}. Click to filter table to just this organization.">${org} <i class="fa fa-filter"></i></a>`
    let domainVal = `<a href="/analytics?domain=${domain}&org=${org}&agency=${agency}" aria-label="${domain}. Click to filter table to just this domain.">${domain} <i class="fa fa-filter"></i></a>`
    let subdomainVal = (subdomain) ? `<a href="/analytics?subdomain=${subdomain}&domain=${domain}&org=${org}&agency=${agency}" aria-label="${subdomain} Click to filter table to just this subdomain.">${subdomain} <i class="fa fa-filter"></i></a>` : ''
    parsedResponse.push({
      Organization: orgVal,
      Agency: agencyVal,
      Domain: domainVal,
      Subdomain: subdomainVal,
      URL: urlHtml,
      numberOfErrors: parseInt(row['numberOfErrors']),
      errors: errors
    }) 
  })
  return parsedResponse
}

function process(str) {
  var div = document.createElement('div');
  div.innerHTML = str.trim();

  return format(div, 0).innerHTML;
}

function format(node, level) {
  var indentBefore = new Array(level++ + 1).join('  '),
    indentAfter = new Array(level - 1).join('  '),
    textNode;

  for (var i = 0; i < node.children.length; i++) {
    textNode = document.createTextNode('\n' + indentBefore);
    node.insertBefore(textNode, node.children[i]);

    format(node.children[i], level);

    if (node.lastElementChild == node.children[i]) {
      textNode = document.createTextNode('\n' + indentAfter);
      node.appendChild(textNode);
    }
  }

  return node;
}

var searchBar = document.getElementsByClassName("search-input")[0]
searchBar.setAttribute('aria-labelledby', 'table')
searchBar.setAttribute('aria-describedby', "Full text search bar of table")

const interval = window.setInterval(setSpanAttr, 200);

function setSpanAttr() {
  // Need this to provide link content to the icons that expand and contract rows in the data table
  $('a.detail-icon').each( function() {
    if (! $(this).find("span").length) {
      let icon = $(this).find("i")[0]
      let iconClass = icon.getAttribute('class')
      if (iconClass === 'fa fa-minus') {
        $(this).prepend('<span class="sr-only">Contract the row and hide the accessibility issues of the website.</span>');
      } else {
        $(this).prepend('<span class="sr-only">Expand the row to show the accessibility issues of the website.</span>');
      }
    } else {
      }
  });
};

const downloadJSON = '/data?agency=&ext=json&org=&domain=&subdomain=';
const downloadCSV = '/data?agency=&ext=csv&org=&domain=&subdomain=';

$table.on('load-success.bs.table', function (res) {
  // describe anchor tags on table after it has had a chance to load
  $('a.detail-icon').each( () => {
    $this = $(this);
    $this.prepend('<span class="sr-only">Expand the row to enumerate the accessibility issues of the website.</span>');
  })
});

$( document ).ready( () => {

  //add aria-label to toolbar
  $('.fixed-table-toolbar').attr('aria-label', 'Data table toolbar with full text search field and export button.')
  
  //remove this useless element that bootstrap-table inserts
  $('div.fixed-table-header').remove()
  
  //add sr-only column name to the first column
  $('th.detail').prepend("<span class='sr-only'>Expand Row</span>")
  
  //add custom data export button
  $('.fixed-table-toolbar').append( 
    `<div class="columns columns-right btn-group float-right">
      <div class="export btn-group">
        <button class="btn btn-secondary dropdown-toggle" aria-label="Export" data-toggle="dropdown" type="button" title="Export data" onclick="document.getElementById('export-dropdown').classList.add('show')">
          <i class="fa fa-download"></i>
          <span class="caret"></span>
        </button>
      </div>
      
      <div id="export-dropdown" class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; transform: translate3d(-107px, 38px, 0px); top: 0px; left: 0px; will-change: transform;">
        <a class="dropdown-item" data-type="json">JSON</a>
        <a class="dropdown-item" data-type="csv">CSV</a>
      </div>
    </div>`
  );

  $('a.dropdown-item').each( function() {
    $(this).click( (event) => {
        $(this).parent('div').removeClass('show');
        event.stopPropagation();
      })
    if ( $(this).text === 'JSON' ) {
      $(this).attr('href', downloadJSON);
    } else {
      $(this).attr('href', downloadCSV);
    }
  });
  
  $(document).click( (event) => {
    $('#export-dropdown').removeClass('show')
    event.stopPropagation();
  });

});
