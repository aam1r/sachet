var MIN_WIDTH_FOR_DESCRIPTION = 1150;

function hideDescription() {
  $('#description').hide();
}

function updateAndShowDescription(new_description) {
  if ($(document).width() > MIN_WIDTH_FOR_DESCRIPTION)
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
  var previous_selector = "#part" + previous_id;

  if (previous_id > 0 && previous_id <= 3) {
    var previous_container = $(previous_selector);

    current_part.hide();
    previous_container.show();

    // Re-enable 'Next' button
    $("#next_btn").removeClass('disabled');

    // Disable 'Previous' button if necessary
    if (previous_id == 1)
      $("#previous_btn").addClass('disabled');

    updateDescription(previous_container, current_part);
    _gaq.push(['_trackPageview', previous_selector]);
  }
}

function nextButtonClick() {
  if ($("#next_btn").hasClass('disabled'))
    return;

  var current_part = activePart();
  var next_id = parseInt(current_part.attr('id').slice(-1)) + 1;
  var next_selector = "#part" + next_id;

  if (next_id > 0 && next_id <= 3) {
    var next_container = $(next_selector);

    current_part.hide();
    next_container.show();

    // Re-enable 'Previous' button
    $("#previous_btn").removeClass('disabled');

    // Disable 'Next' button and enable 'Download' if necessary
    if (next_id == 3) {
      $("#next_btn").addClass('disabled');
      $("#download_btn").show();
    }

    updateDescription(next_container, current_part);
    _gaq.push(['_trackPageview', next_selector]);
  }
}

function downloadButtonClick() {
  $("#download_form").submit();

  var selected = $("input:checked").map(function() { return this.id; });
  _gaq.push(['_trackEvent', 'sachet', 'walkthrough', 'download', selected]);
}

$(document).ready(function() {
  /* Previous/Next button handling */
  $("#previous_btn").addClass('disabled');
  $("#previous_btn").click(previousButtonClick);
  $("#next_btn").click(nextButtonClick);
  $("#download_btn").click(downloadButtonClick);

  /* Prettify the form */
  $("input").uniform();

  /* Description box hiding/displaying */
  if ($(document).width() < MIN_WIDTH_FOR_DESCRIPTION)
    hideDescription();

  $(".display label").hover(
    function(e) {
      var desc = $(e.target).closest('li').data('description');
      updateAndShowDescription(desc);
    },
    function() { hideDescription(); }
  );
});
