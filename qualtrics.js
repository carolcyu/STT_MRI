Qualtrics.SurveyEngine.addOnload(function()
{
	   setTimeout(function() {
            document.getElementById('jspsych-container').focus();
        }, 500);
/*Place your JavaScript here to run when the page loads*/
// Retrieve Qualtrics object and save in qthis
var qthis = this;

// Hide buttons
qthis.hideNextButton();

var task_github = "https://carolcyu.github.io/STT_MRI/"; // https://<your-github-username>.github.io/<your-experiment-name>

// requiredResources must include all the JS files that .html uses.
var requiredResources = [
	task_github + "jspsych/jspsych.js",
	task_github + "jspsych/plugin-image-keyboard-response.js",
		task_github + "jspsych/plugin-html-button-response.js", 
	task_github + "jspsych/plugin-html-keyboard-response.js", 
	task_github + "jspsych/plugin-categorize-html.js",
	task_github + "jspsych/my_experiment_style_MRI.css",
	//task_github + "main.js",
		"https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js",
    "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",
];

function loadScript(idx) {
    console.log("Loading ", requiredResources[idx]);
    jQuery.getScript(requiredResources[idx], function () {
        if ((idx + 1) < requiredResources.length) {
            loadScript(idx + 1);
        } else {
            initExp();
        }
    });
}



if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
    loadScript(0);
}

// jQuery is loaded in Qualtrics by default
jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
jQuery("<div id = 'display_stage'></div>").appendTo('body');


function initExp(){
    /* start the experiment*/
    var jsPsych = initJsPsych({
		  display_element: 'jspsych-container',
		
        /* Change 1: Using `display_element` */
	    display_element: 'display_stage',
        on_finish: function() {
            //jsPsych.data.displayData(); // comment out if you do not want to display results at the end of task
            /* Saving task data to qualtrics */
			var STT = jsPsych.data.get().json();
			console.log(STT)
			STT.toString()
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

    return '<p>Your average response time was ${rt}ms.</p><p>Press any key to complete the task. We appreciate your time!</p>';

  }
};
timeline.push(debrief_block);
    /* start the experiment */
    jsPsych.run(timeline);
    }
//end
});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

});
