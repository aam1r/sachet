function updateAndShowDescription(new_description) {
  $('#description p').text(new_description).show();
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
    $("#next_btn").show();

    // Disable 'Previous' button if necessary
    if (previous_id == 1) {
      $("#previous_btn").addClass('disabled'); 
      $("#previous_btn").hide();
    }

    updateDescription(previous_container, current_part);
    mixpanel.track('Pageview', {'selector': previous_selector});
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
    $("#previous_btn").show();


    // Disable 'Next' button and enable 'Download' if necessary
    if (next_id == 3) {
      $("#next_btn").addClass('disabled');
      $("#next_btn").hide();
      $("#download_btn").show();
    }

    updateDescription(next_container, current_part);
    mixpanel.track('Pageview', {'selector': next_selector});
  }
}

function downloadButtonClick() {
  var call_success = false;
  var selected = {};
  $.each($("input:checked"), function(k, v) { selected[v.id] = true; })

  mixpanel.track("Download", selected, function() {
    call_success = true;
    $("#download_form").submit();
  });

  // Submit form even if the Mixpanel event tracking failed
  setTimeout(function() {
    if (!call_success)
      $("#download_form").submit();
  }, 1000);
}

$(document).ready(function() {
  mixpanel.track('Pageview', {'selector': '#part1'});

  /* Previous/Next button handling */
  $("#previous_btn").addClass('disabled');
  $("#previous_btn").hide();
  $("#previous_btn").click(previousButtonClick);
  $("#next_btn").click(nextButtonClick);
  $("#download_btn").click(downloadButtonClick);

  /* Prettify the form */
  $("input").uniform();

  $(".display label").hover(
    function(e) {
      var desc = $(e.target).closest('li').data('description');
      updateAndShowDescription(desc);
    }
  );
});
