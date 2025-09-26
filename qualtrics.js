// Simple test - just show a message
console.log("=== QUALTRICS SCRIPT LOADED ===");
alert("Qualtrics script is running!");

Qualtrics.SurveyEngine.addOnload(function()
{
    console.log("=== QUALTRICS ONLOAD STARTED ===");
    
    // Simple test message
    document.body.innerHTML += '<div id="test-message" style="background: yellow; padding: 20px; margin: 20px; border: 2px solid red;"><h2>SCRIPT IS WORKING!</h2><p>If you see this, the script loaded successfully.</p></div>';
    
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;
    console.log("Qualtrics object retrieved");

    // Hide buttons
    qthis.hideNextButton();
    console.log("Next button hidden");

    // Create display elements
    var displayDiv = document.createElement('div');
    displayDiv.id = 'display_stage';
    displayDiv.style.cssText = 'width: 100%; height: 400px; border: 2px solid blue; padding: 20px; margin: 20px;';
    displayDiv.innerHTML = '<h3>Display Stage Created</h3><p>Ready to load experiment...</p>';
    document.body.appendChild(displayDiv);
    
    console.log("Display stage created");
    
    // Test jQuery
    if (typeof jQuery !== 'undefined') {
        jQuery('#display_stage').append('<p style="color: green;">jQuery is working!</p>');
        
        // Now load the experiment
        loadExperiment();
    } else {
        document.getElementById('display_stage').innerHTML += '<p style="color: red;">jQuery is NOT available</p>';
    }
    
    function loadExperiment() {
        var task_github = "https://carolcyu.github.io/STT_MRI/";
        
        // Update display
        jQuery('#display_stage').html('<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>');
        
        // Load CSS first
        jQuery("<link rel='stylesheet' href='" + task_github + "jspsych/jspsych.css'>").appendTo('head');
        jQuery("<link rel='stylesheet' href='" + task_github + "jspsych/my_experiment_style_MRI.css'>").appendTo('head');
        
        // Scripts to load
        var scripts = [
            task_github + "jspsych/jspsych.js",
            task_github + "jspsych/plugin-image-keyboard-response.js",
            task_github + "jspsych/plugin-html-button-response.js", 
            task_github + "jspsych/plugin-html-keyboard-response.js", 
            task_github + "jspsych/plugin-categorize-html.js"
        ];
        
        loadScripts(0);
        
        function loadScripts(index) {
            if (index >= scripts.length) {
                // All scripts loaded, start experiment
                jQuery('#display_stage').html('<h3>Starting Experiment...</h3>');
                setTimeout(initExp, 500);
                return;
            }
            
            jQuery.getScript(scripts[index])
                .done(function() {
                    jQuery('#display_stage').append('<p>✓ Loaded: ' + scripts[index].split('/').pop() + '</p>');
                    loadScripts(index + 1);
                })
                .fail(function() {
                    jQuery('#display_stage').html('<p style="color: red;">Failed to load: ' + scripts[index] + '</p>');
                });
        }
    }


function initExp(){
    try {
        // Check if jsPsych is available
        if (typeof initJsPsych === 'undefined') {
            jQuery('#display_stage').html('<p style="color: red;">Error: jsPsych library not loaded</p>');
            return;
        }
        
        // Ensure display stage is focused for keyboard input
        var displayStage = document.getElementById('display_stage');
        if (displayStage) {
            displayStage.focus();
            displayStage.setAttribute('tabindex', '0');
            displayStage.style.outline = 'none';
            
            // Add click handler to refocus when clicked
            displayStage.addEventListener('click', function() {
                this.focus();
            });
            
            // Force focus after a short delay
            setTimeout(function() {
                displayStage.focus();
                // Also try focusing the document body
                document.body.focus();
            }, 100);
        }
        
        jQuery('#display_stage').html('<h3>Experiment Starting...</h3><p>Focusing display for keyboard input...</p>');
        
        // Add global keyboard listener as backup
        document.addEventListener('keydown', function(event) {
            // Forward key events to the display stage if it's focused
            var displayStage = document.getElementById('display_stage');
            if (displayStage && document.activeElement !== displayStage) {
                displayStage.focus();
            }
        });
        
        /* start the experiment*/
        var jsPsych = initJsPsych({
		/* Use the Qualtrics-mounted stage as the display element */
	    display_element: 'display_stage',
        on_finish: function() {
            /* Saving task data to qualtrics */
			var STT = jsPsych.data.get().json();
			// save to qualtrics embedded data
			Qualtrics.SurveyEngine.setEmbeddedData("STT", STT);
			
            // clear the stage
            jQuery('#display_stage').remove();
            jQuery('#display_stage_background').remove();

            // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
            qthis.clickNextButton();
        }
      }); 
	      var timeline = [];

    /* define welcome message trial */
    var welcome = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: " <p>Welcome to the Image Rating Task! </p> <p>Press any button for instructions. </p>"
    };
    timeline.push(welcome);

    /* define instructions trial */
    var instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<p>In this task, an image will appear on the screen.</p><p>Using the response pad, please rate <strong>HOW PLEASANT an image is</strong>, as quickly as you can. If the image is...</p> <p><strong>Very unpleasant</strong>, press the button 1</p><p><strong>Unpleasant</strong>, press the button 2</p><p><strong>Pleasant</strong>, press the button 3</p> <p><strong>Very pleasant</strong>, press the button 4.</p> <p> <img src='img/response_key.png'alt='Key'></div></p><p>Press any button to continue.</p>",
      post_trial_gap: 1000
    };
    timeline.push(instructions);
/* practice trials x4*/
var practice1 = {
  type: jsPsychCategorizeHtml,
  stimulus: "<img src='img/practice1.jpg' alt='practice1'>",
  choices: ['1', '2', '3', '4'],
  key_answer: '1',
  text_answer: '1 button for Very Unpleasant',
  correct_text: "<p class='prompt'>Correct, this is the %ANS%.</p>",
  incorrect_text: "<p class='prompt'>Please try again, select the 1 button for Very Unpleasant. </p>",
 prompt: "<p>Press '-2' for very unpleasant, '-1' for unpleasant, '+1' for pleasant, or '+2' for very pleasant. </p>",
force_correct_button_press: true, 
prompt: "<p>Let's practice! </p> <p><strong>Please rate this image as Very Unpleasant.</strong></p>",
data: {
    task: 'response'},
    on_finish: function(data){
    data.response;
 }
};
timeline.push(practice1);

var practice2 = {
  type: jsPsychCategorizeHtml,
  stimulus: "<img src='img/practice2.jpg'alt='practice2'>",
  choices: ['1', '2', '3', '4'],
  key_answer: '3',
  text_answer: '3 button for Pleasant',
  correct_text: "<p class='prompt'>Correct, this is the %ANS%.</p>",
  incorrect_text: "<p class='prompt'>Please try again, select the 3 button for Pleasant. </p>",
  prompt: "<p><strong>Please rate this image as Pleasant.</strong></p>",
force_correct_button_press: true, 
data: {
    task: 'response'},
    on_finish: function(data){
    data.response;
 }
};
timeline.push(practice2);

var practice3 = {
  type: jsPsychCategorizeHtml,
  stimulus: "<img src='img/practice3.jpg' alt='practice3'>",
  choices: ['1', '2', '3', '4'],
  key_answer: '4',
  text_answer: '4 button for Very Pleasant',
  correct_text: "<p class='prompt'>Correct, this is the %ANS%.</p>",
  incorrect_text: "<p class='prompt'>Please try again, select the 4 button for Very Pleasant. </p>",
  prompt: "<p>Let's practice again! </p> <p><strong>Please rate this image as Very Pleasant.</strong></p>",
force_correct_button_press: true, 
data: {
    task: 'response'},
    on_finish: function(data){
    data.response;
 }
};
timeline.push(practice3);

var practice4 = {
  type: jsPsychCategorizeHtml,
  stimulus: "<img src='img/practice4.jpg' alt='practice4'>",
  choices: ['1', '2', '3', '4'],
  key_answer: '2',
  text_answer: '2 button for unpleasant',
  correct_text: "<p class='prompt'>Correct, this is the %ANS%.</p>",
  incorrect_text: "<p class='prompt'>Please try again, select the 2 button for Unpleasant. </p>",
  prompt: "<p><strong>Please rate this image as Unpleasant.</strong></p>",
force_correct_button_press: true, 
data: {
    task: 'response'},
    on_finish: function(data){
    data.response;
 }
};
timeline.push(practice4);

/*questions for the examiner*/
var questions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<p>If you have questions or concerns, please signal to the examiner. </p> <p>If not, press any button to continue. </p>"
    };
    timeline.push(questions);

/*define trial awaiting for the scanner keyboard button #5 */
var MRIstart ={
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p> Please wait while the scanner starts up. This will take 10 seconds. </strong></p>",
  choices: ['5'],
 prompt: "<p> A cross (+) will appear when the task starts. </p>",
 data: {
    task: 'response'},
    on_finish: function(data){
    data.response;
 }
};
timeline.push(MRIstart);

    /* define test trial stimuli array */
    var test_stimulus = [
        {stimulus: 'socialthreat/NS_NT1.jpg'},
        {stimulus: 'socialthreat/NS_NT2.jpg'},
        {stimulus:'socialthreat/NS_NT3.jpg'},
        {stimulus: 'socialthreat/NS_NT4.jpg'},
        {stimulus: 'socialthreat/NS_NT5.jpg'},
        {stimulus: 'socialthreat/NS_NT6.jpg'},
        {stimulus: 'socialthreat/NS_NT7.jpg'},

        {stimulus: 'socialthreat/NS_T1.jpg'},
        {stimulus: 'socialthreat/NS_T2.jpg'},
        {stimulus:'socialthreat/NS_T3.jpg'},
        {stimulus: 'socialthreat/NS_T4.jpg'},
        {stimulus: 'socialthreat/NS_T5.jpg'},
        {stimulus: 'socialthreat/NS_T6.jpg'},
        {stimulus: 'socialthreat/NS_T7.jpg'},

        {stimulus: 'socialthreat/S_NT1.jpg'},
        {stimulus: 'socialthreat/S_NT2_.jpg'},
        {stimulus:'socialthreat/S_NT3_.jpg'},
        {stimulus: 'socialthreat/S_NT4_.jpg'},
        {stimulus: 'socialthreat/S_NT5_.jpg'},
        {stimulus: 'socialthreat/S_NT6_.jpg'},
        {stimulus: 'socialthreat/S_NT7_.jpg'},
        
        {stimulus: 'socialthreat/S_T1.jpg'},
        {stimulus: 'socialthreat/S_T2.jpg'},
        {stimulus:'socialthreat/S_T3_.jpg'},
        {stimulus: 'socialthreat/S_T4_.jpg'},
        {stimulus: 'socialthreat/S_T5_.jpg'},
        {stimulus: 'socialthreat/S_T6_.jpg'},
        {stimulus: 'socialthreat/S_T7_.jpg'},
  ];
    var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: 'fixation'
  }
};
var test = {
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: "NO_KEYS",
  trial_duration: 2000,
  stimulus_height: 650,
  maintain_aspect_ration: true,
 };
var response = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p>How would you rate this image? </p>",
  choices: ['1', '2', '3', '4'],
  trial_duration: 3000,
  response_ends_trial: false,
 data: {
    task: 'response'},
    on_finish: function(data){
    data.response;
 }
};
    var test_procedure = {
      timeline: [fixation,test,response],
      timeline_variables: test_stimulus,
      repetitions: 1,
      randomize_order: false,
      post_trial_gap: 500,
    };
    timeline.push(test_procedure);
    
var debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {

    var trials = jsPsych.data.get().filter({task: 'response'});
    var rt = Math.round(trials.select('rt').mean());

    return '<p>Your average response time was ' + rt + 'ms.</p>' +
      '<p>Press any key to complete the task. We appreciate your time!</p>';

  }
};
timeline.push(debrief_block);
    /* start the experiment */
    jsPsych.run(timeline);
    
    // Ensure focus after experiment starts
    setTimeout(function() {
        var displayStage = document.getElementById('display_stage');
        if (displayStage) {
            displayStage.focus();
        }
    }, 1000);
    
    } catch (error) {
        console.error("Error in initExp:", error);
        if (document.getElementById('display_stage')) {
            document.getElementById('display_stage').innerHTML += '<p style="color: red;">Error: ' + error.message + '</p>';
        }
    }
}

// Close the addOnload function
});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

});
