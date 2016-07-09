var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.continous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var daig = document.querySelector('.output');


recognition.onresult = function(event){
    var speech_transcript = event.results[0][0].transcript;
    console.log(speech_transcript);
    var parser = new parser_t(speech_transcript, "robot");
    parser.parse();
}

recognition.onspeechend = function(){
    recognition.stop();
    console.log("stopping recognition");
}

recognition.onnomatch = function(){
    console.log("there was no match");
}

recognition.onerror = function(event){
    console.log(event);
}
