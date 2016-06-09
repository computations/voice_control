function parser_t(text){
    this.lexer = new lexer_t(text);
}

//returns the "compiled" js from english
parser_t.prototype.parse(){
    
}

var p = new parser_t("hello world");
