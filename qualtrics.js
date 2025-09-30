Qualtrics.SurveyEngine.addOnload(function()
{
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons and question content
    qthis.hideNextButton();
    
    // Hide the question text and make the container full screen
    jQuery('.QuestionText, .QuestionBody').hide();
    jQuery('.QuestionOuter').css({
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100vh',
        'z-index': '9999',
        'background': 'black',
        'margin': '0',
        'padding': '0'
    });
    
    // Create display elements
    var displayDiv = document.createElement('div');
    displayDiv.id = 'display_stage';
    displayDiv.style.cssText = 'width: 100%; height: 100vh; padding: 80px 20px 20px 20px; position: relative; z-index: 1000; display: flex; flex-direction: column; justify-content: center; align-items: center;';
    displayDiv.innerHTML = '<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>';
    
    // Insert at the top of the question area
    jQuery('.QuestionOuter').prepend(displayDiv);
    
    // Define task_github globally
    window.task_github = "https://carolcyu.github.io/STT_MRI/";
    
    // Load the experiment
    if (typeof jQuery !== 'undefined') {
        loadExperiment();
    }
    
    function loadExperiment() {
        // Update display
        jQuery('#display_stage').html('<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>');
        
        // Load CSS first with error handling
        jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/jspsych.css'>").appendTo('head');
        jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/my_experiment_style_MRI.css'>").appendTo('head');
        
        // Add inline CSS as backup
        jQuery("<style>").text(`
            #display_stage {
                background-color: black !important;
                height: 100vh !important;
                padding: 50px 20px 20px 20px !important;
                width: 100% !important;
                position: relative !important;
                z-index: 1000 !important;
                overflow: hidden;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                box-sizing: border-box !important;
            }
            #display_stage img {
                max-width: 65% !important;
                max-height: 50vh !important;
                height: auto !important;
                display: block !important;
                margin: 10px auto !important;
                object-fit: contain !important;
            }
            .jspsych-content {
                background-color: black !important;
                padding: 20px !important;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                width: 100% !important;
                height: 100vh !important;
                overflow: hidden;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                box-sizing: border-box !important;
            }
            .jspsych-display-element {
                background-color: black !important;
                width: 100% !important;
                height: 100vh !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
            }
            .jspsych-stimulus {
                max-width: 100% !important;
                max-height: 60vh !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: flex-start !important;
                align-items: center !important;
            }
            .QuestionOuter {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100vh !important;
                z-index: 9999 !important;
                background: black !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            body {
                overflow: hidden !important;
            }
        `).appendTo('head');
        
        // Scripts to load
        var scripts = [
            window.task_github + "jspsych/jspsych.js",
            window.task_github + "jspsych/plugin-image-keyboard-response.js",
            window.task_github + "jspsych/plugin-html-button-response.js", 
            window.task_github + "jspsych/plugin-html-keyboard-response.js", 
            window.task_github + "jspsych/plugin-categorize-html.js"
        ];
        
        loadScripts(0);
        
        function loadScripts(index) {
            if (index >= scripts.length) {
                // All scripts loaded, start experiment
                setTimeout(initExp, 500);
                return;
            }
            
            jQuery.getScript(scripts[index])
                .done(function() {
                    loadScripts(index + 1);
                })
                .fail(function() {
                    jQuery('#display_stage').html('<p style="color: red;">Failed to load experiment scripts. Please refresh the page.</p>');
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
            displayStage.style.position = 'relative';
            displayStage.style.zIndex = '1000';
            
            // Make it capture all events
            displayStage.addEventListener('click', function() {
                this.focus();
            });
            
            // Add keyboard event capture
            displayStage.addEventListener('keydown', function(event) {
                console.log('Display stage keydown:', event.key);
                // Don't prevent default - let jsPsych handle it
            });
            
            // Force focus after a short delay
            setTimeout(function() {
                displayStage.focus();
                // Also try focusing the document body
                document.body.focus();
            }, 100);
        }
        
        jQuery('#display_stage').html('<h3>Experiment Starting...</h3><p>Focusing display for keyboard input...</p>');
        
        // Add focus management
        var focusInterval = setInterval(function() {
            var displayStage = document.getElementById('display_stage');
            if (displayStage) {
                displayStage.focus();
            }
        }, 1000);
        
        // Store reference to jsPsych for later use
        window.currentJsPsych = null;
        
        /* start the experiment*/
        var jsPsych = initJsPsych({
		/* Use the Qualtrics-mounted stage as the display element */
	    display_element: 'display_stage',
        on_trial_start: function() {
            // Ensure focus on each trial
            var displayStage = document.getElementById('display_stage');
            if (displayStage) {
                displayStage.focus();
            }
        },
        on_trial_finish: function() {
            // Ensure focus after each trial
            var displayStage = document.getElementById('display_stage');
            if (displayStage) {
                displayStage.focus();
            }
        },
        on_finish: function() {
            // Clear the focus interval
            if (typeof focusInterval !== 'undefined') {
                clearInterval(focusInterval);
            }
            
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
      
      // Store jsPsych reference globally
      window.currentJsPsych = jsPsych;
      
	      var timeline = [];

    /* define welcome message trial */
    var welcome = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: " <p>Welcome to the Image Rating Task! </p> <p>Press any button for instructions. </p>",
      choices: "ALL_KEYS",
      response_ends_trial: true
    };
    timeline.push(welcome);

    /* define instructions trial */
    var instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<p>In this task, an image will appear on the screen.</p><p>Using the response pad, please rate <strong>HOW PLEASANT an image is</strong>, as quickly as you can. If the image is...</p> <p><strong>Very unpleasant</strong>, press the button 1</p><p><strong>Unpleasant</strong>, press the button 2</p><p><strong>Pleasant</strong>, press the button 3</p> <p><strong>Very pleasant</strong>, press the button 4.</p> <p> <img src='" + window.task_github + "img/response_key.png' alt='Key'></div></p><p>Press any button to continue.</p>",
      choices: "ALL_KEYS",
      response_ends_trial: true,
      post_trial_gap: 1000
    };
    timeline.push(instructions);
/* practice trials x4*/
var practice1 = {
  type: jsPsychCategorizeHtml,
  stimulus: "<img src='" + window.task_github + "img/practice1.jpg' alt='practice1'>",
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
  stimulus: "<img src='" + window.task_github + "img/practice2.jpg' alt='practice2'>",
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
  stimulus: "<img src='" + window.task_github + "img/practice3.jpg' alt='practice3'>",
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
  stimulus: "<img src='" + window.task_github + "img/practice4.jpg' alt='practice4'>",
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
    task: 'mri_start'},
    on_finish: function(data){
    data.response;
 }
};
timeline.push(MRIstart);

    /* define test trial stimuli array */
    var test_stimulus = [
        {stimulus: window.task_github + 'socialthreat/NS_NT1.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_NT2.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_NT3.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_NT4.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_NT5.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_NT6.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_NT7.jpg'},

        {stimulus: window.task_github + 'socialthreat/NS_T1.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_T2.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_T3.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_T4.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_T5.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_T6.jpg'},
        {stimulus: window.task_github + 'socialthreat/NS_T7.jpg'},

        {stimulus: window.task_github + 'socialthreat/S_NT1.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_NT2_.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_NT3_.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_NT4_.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_NT5_.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_NT6_.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_NT7_.jpg'},
        
        {stimulus: window.task_github + 'socialthreat/S_T1.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_T2.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_T3_.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_T4_.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_T5_.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_T6_.jpg'},
        {stimulus: window.task_github + 'socialthreat/S_T7_.jpg'},
  ];
    var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: 500,
  data: {
    task: 'fixation'
  }
};
var test = {
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: "NO_KEYS",
  trial_duration: 750,
  stimulus_height: 650,
  maintain_aspect_ration: true,
  response_ends_trial: false,
 };
var response = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p>How pleasant or unpleasant is this image? </p>",
  choices: ['1', '2', '3', '4'],
  trial_duration: 1500,
  response_ends_trial: false,
  data: {
    task: 'response'
  },
  on_finish: function(data){
    data.response;
  }
};
    var test_procedure = {
      timeline: [fixation,test,response],
      timeline_variables: test_stimulus,
      repetitions: 1,
      randomize_order: false,
      post_trial_gap: 250,
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
    
    // Add single, clean keyboard handler
    setTimeout(function() {
        // Remove any existing keyboard listeners
        document.removeEventListener('keydown', arguments.callee);
        
        // Add keyboard handler
        document.addEventListener('keydown', function(event) {
            if (window.currentJsPsych) {
                var keyPressed = event.key;
                var currentTrial = window.currentJsPsych.getCurrentTrial();
                
                // Check if this is the MRI start trial that should only accept "5"
                if (currentTrial && currentTrial.data && currentTrial.data.task === 'mri_start') {
                    if (keyPressed !== '5') {
                        return; // Ignore other keys
                    }
                }
                // Check if this is a practice trial that requires specific correct answers
                else if (currentTrial && currentTrial.key_answer) {
                    if (keyPressed !== currentTrial.key_answer) {
                        return; // Ignore incorrect keys
                    }
                }
                // Check if this is a response trial that should only accept 1-4
                else if (currentTrial && currentTrial.data && currentTrial.data.task === 'response') {
                    if (!['1', '2', '3', '4'].includes(keyPressed)) {
                        return; // Ignore other keys
                    }
                    // For response trials, just record the response but don't advance
                    return;
                }
                
                // Try to advance trial
                try {
                    window.currentJsPsych.finishTrial({
                        response: keyPressed
                    });
                } catch (e) {
                    // Fallback: trigger events on display stage
                    var displayStage = document.getElementById('display_stage');
                    if (displayStage) {
                        var clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true
                        });
                        displayStage.dispatchEvent(clickEvent);
                        
                        var keyEvent = new KeyboardEvent('keydown', {
                            key: keyPressed,
                            code: event.code,
                            bubbles: true,
                            cancelable: true
                        });
                        displayStage.dispatchEvent(keyEvent);
                    }
                }
            }
        });
    }, 2000);
    
    } catch (error) {
        if (document.getElementById('display_stage')) {
            document.getElementById('display_stage').innerHTML = '<p style="color: red;">Error initializing experiment. Please refresh the page.</p>';
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
