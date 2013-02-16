function hideDescription() {
  $('#description').hide();
}

function updateAndShowDescription(new_description) {
  $('#description').text(new_description).show();
}

$(document).ready(function() {
  $(":checkbox").uniform();
  $(".display label").hover(
    function(e) {
      var desc = $(e.target).parent().data('description');
      updateAndShowDescription(desc);
    },
    function() { hideDescription(); }
  );
});
