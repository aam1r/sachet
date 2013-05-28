// Range of steps is [STEP_MIN, STEP_MAX]
var STEP_MIN = 1;
var STEP_MAX = 3;

var DOWNLOAD_BUTTON = $("#download-btn");
var NEXT_BUTTON = $("#next-btn");
var PREVIOUS_BUTTON = $("#previous-btn");

var MC_URL = "http://aam1r.us1.list-manage1.com/subscribe/post?u=4a0df9a7824fdc70faebb3cfa&amp;id=";

function trackPageview(pageID) {
  mixpanel.track('Pageview', {'selector': pageID});
}

function activeStep() {
  // Get the current active (visible) step
  for (var i = STEP_MIN; i <= STEP_MAX; i++) {
    if ($("#step" + i).is(':visible'))
      return $("#step" + i);
  }
}

function currentStepID() {
  // Extract step # from currently active step ID
  return parseInt(activeStep().attr('id').slice(-1));
}

function nextStepID() {
  var current = currentStepID();

  if (current == STEP_MAX)
    throw new Error("Invalid step");
  else
    return current + 1;
}

function previousStepID() {
  var current = currentStepID();

  if (current == STEP_MIN)
    throw new Error("Invalid step");
  else
    return current - 1;
}

function enableButton(btn) {
  btn.removeClass('disabled').show();
}

function disableButton(btn) {
  btn.addClass('disabled').hide();
}

function activateStep(newStepID) {
  // Clear current hover text
  var isFirstStep = (currentStepID() == STEP_MIN && newStepID == STEP_MIN);
  if (!isFirstStep)
    $("#description p.step" + currentStepID()).empty();

  activeStep().hide();

  // Display new step and update the progress section
  var newStep = $("#step" + newStepID);
  newStep.show();
  updateProgress(newStep.attr('id'));
}

function updateDescription() {
  var currentID = currentStepID();

  try {
    var previousID = previousStepID();

    // Hide welcome text
    if (previousID == STEP_MIN)
      $(".description .welcome").hide();

    $(".description .part" + previousID).hide();
  } catch (e) { }

  $(".description .part" + currentID).show();
}

function isDisabled(obj) {
  return obj.hasClass('disabled');
}

function directionButtonClicked(e) {
  e.preventDefault();

  if (isDisabled($(this)))
    return false;

  var buttonID = $(this).attr('id');
  var previousButtonClicked = (buttonID == "previous-btn");
  var nextStep = 0;
  var nextButton = null;

  try {
    nextStep = previousButtonClicked ? previousStepID() : nextStepID();
  } catch(e) {
    return false;
  }

  activateStep(nextStep);

  // Enable/disable the appropriate direction button
  previousButtonClicked ? enableButton(NEXT_BUTTON) : enableButton(PREVIOUS_BUTTON);

  if (previousButtonClicked && nextStep == STEP_MIN) {
    // Disable 'Previous' button if at the first step
    disableButton(PREVIOUS_BUTTON);
  } else if (nextStep == STEP_MAX) {
    // Disable 'Next' button and enable 'Download' if at the last step
    disableButton(NEXT_BUTTON);
    enableButton(DOWNLOAD_BUTTON);
  }

  updateDescription();
  trackPageview("#step" + nextStep);

  return false;
}

function downloadButtonClicked(e) {
  e.preventDefault();

  var callSuccess = false;
  var selected = {};
  $.each($("input:checked"), function(k, v) { selected[v.id] = true; })

  // Track download event on Mixpanel
  mixpanel.track("Download", selected, function() {
    callSuccess = true;
    $("#download_form").submit();
  });

  // Submit form even if the Mixpanel event tracking failed
  setTimeout(function() {
    if (!callSuccess)
      $("#download_form").submit();
  }, 1000);

  $("#modal-subscribe-updates").reveal({ animation: 'fade' });

  return false;
}

function updateProgress(newStep) {
  var bar = $("#indicator .completed");
  var currentPercent = parseInt(bar.data('progress'));
  var newStepID = currentStepID();
  var newPercent = Math.ceil((newStepID/3) * 100);

  if (currentPercent == newPercent)
    return;

  // Set the direction of the progress (either prev step or next step)
  var direction = (newPercent > currentPercent) ? 1 : -1;
  var previousID = newStepID - direction;

  // Deactive current breadcrumb
  if (previousID != 0) {
    $("#step" + previousID + '-label')
      .removeClass('active')
      .addClass('inactive');
  }

  // Activate new breadcrumb
  $("#" + newStep + "-label")
    .removeClass('inactive')
    .addClass('active');

  // Animate progress bar
  var interval = setInterval(function() {
    currentPercent += direction;

    bar
      .css('width', currentPercent + '%')
      .data('progress', currentPercent);

    if (currentPercent == newPercent) clearInterval(interval);
  }, 15);
}

function onEditorSelection(e) {
  e.preventDefault();

  if ($(this).hasClass('coming-soon')) {
    var editorName = $(this).data('editor');
    var mcID = $(this).data('mc-id');

    $(".modal-editor-name").text(editorName);
    $("#modal-editor-coming-soon").reveal({ animation: 'fade' });
    $("#modal-editor-coming-soon form").attr("action", MC_URL + mcID);

    trackPageview(editorName);
    return;
  }

  $("#customize-editor").fadeIn();
  $("#step1").show();

  // Focus on Customization div
  var position = $("#customize-editor").offset();
  $('body').animate({ scrollTop: position.top });

  updateProgress("step1");
}

function onListHover(e) {
  var desc = $(e.target).closest('li').data('description');

  $('#description .step' + currentStepID())
    .text(desc).
    show();
}

$(document).ready(function() {
  trackPageview("editor-selection");

  // Button handling
  PREVIOUS_BUTTON.click(directionButtonClicked);
  NEXT_BUTTON.click(directionButtonClicked);
  DOWNLOAD_BUTTON.click(downloadButtonClicked);

  $("#configuration li").hover(onListHover);
  $("#content .editor").click(onEditorSelection);
});
