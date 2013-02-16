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

function updateDescription(current_part, previous_part) {
  var current_id = parseInt(current_part.attr('id').slice(-1));
  var previous_id = parseInt(previous_part.attr('id').slice(-1));

  // Hide welcome text
  if (previous_id == 1)
    $(".description .welcome").hide();

  $(".description .part" + previous_id).hide();
  $(".description .part" + current_id).show();
}

function previousButtonClick() {
  if ($("#previous_btn").hasClass('disabled'))
    return;

  var current_part = activePart();
  var previous_id = parseInt(current_part.attr('id').slice(-1)) - 1;

  if (previous_id > 0 && previous_id <= 3) {
    current_part.hide();
    $("#part" + previous_id).show();

    // Re-enable 'Next' button
    $("#next_btn").removeClass('disabled');

    // Disable 'Previous' button if necessary
    if (previous_id == 1)
      $("#previous_btn").addClass('disabled');

    var previous_part = $("#part" + previous_id);
    updateDescription(previous_part, current_part);
  }
}

function nextButtonClick() {
  if ($("#next_btn").hasClass('disabled'))
    return;

  var current_part = activePart();
  var next_id = parseInt(current_part.attr('id').slice(-1)) + 1;

  if (next_id > 0 && next_id <= 3) {
    current_part.hide();
    $("#part" + next_id).show();

    // Re-enable 'Previous' button
    $("#previous_btn").removeClass('disabled');

    // Disable 'Next' button and enable 'Download' if necessary
    if (next_id == 3) {
      $("#next_btn").addClass('disabled');
      $("#download_btn").show();
    }

    var next_part = $("#part" + next_id);
    updateDescription(next_part, current_part);
  }
}

function downloadButtonClick() {
  $("#download_form").submit();
}

$(document).ready(function() {
  /* Previous/Next button handling */
  $("#previous_btn").addClass('disabled');
  $("#previous_btn").click(previousButtonClick);
  $("#next_btn").click(nextButtonClick);
  $("#download_btn").click(downloadButtonClick);

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
