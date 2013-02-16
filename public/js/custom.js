function hideDescription() {
  $('#description').hide();
}

function updateAndShowDescription(new_description) {
  $('#description').text(new_description).show();
}

function activePart() {
  for (var i = 1; i <= 3; i++) {
    if ($("#part" + i).is(':visible'))
      return $("#part" + i);
  }
}

function previousButtonClick() {
  if ($("#previous_btn").hasClass('disabled'))
    return;

  var current_part = activePart();
  var previous_part = parseInt(current_part.attr('id').slice(-1)) - 1;

  if (previous_part > 0 && previous_part <= 3) {
    current_part.hide();
    $("#part" + previous_part).show();

    // Re-enable 'Next' button
    $("#next_btn").removeClass('disabled');

    // Disable 'Previous' button if necessary
    if (previous_part == 1)
      $("#previous_btn").addClass('disabled');
  }
}

function nextButtonClick() {
  if ($("#next_btn").hasClass('disabled'))
    return;

  var current_part = activePart();
  var next_part = parseInt(current_part.attr('id').slice(-1)) + 1;

  if (next_part > 0 && next_part <= 3) {
    current_part.hide();
    $("#part" + next_part).show();

    // Re-enable 'Previous' button
    $("#previous_btn").removeClass('disabled');

    // Disable 'Next' button if necessary
    if (next_part == 3)
      $("#next_btn").addClass('disabled');
  }
}

$(document).ready(function() {
  /* Previous/Next button handling */
  $("#previous_btn").addClass('disabled');
  $("#previous_btn").on('click', previousButtonClick);
  $("#next_btn").on('click', nextButtonClick);

  /* Prettify the form */
  //$("input").uniform();
  $(".display label").hover(
    function(e) {
      var desc = $(e.target).parent().data('description');
      updateAndShowDescription(desc);
    },
    function() { hideDescription(); }
  );
});
