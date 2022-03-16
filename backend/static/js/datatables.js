// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable({
    "searching": false,
    "paging": true,
    "info": false,
    "bFilter": false,
    "bInfo": false,
    // "pageLength": 3,
    "lengthMenu": [ 4 ],
    "order": [[1, "desc"]]

  });

  $(".dataTables_length").hide();
  $("tfoot").hide();
  
});

