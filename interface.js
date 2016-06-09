var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.continous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var daig = document.querySelector('.output');

document.body.onclick = function(){
    console.log("starting recognition");
    recognition.start();
}

recognition.onresult = function(event){
    console.log(event.results);
    var speech_transcript = event.results[0][0].transcript;
    var lexer = new lexer_t(speech_transcript);
    while(!lexer.finished()){
        console.log(lexer.get_lexeme());
    }
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
