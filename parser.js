function parser_t(text, robot_name){
    this.lexer = new lexer_t(text);
    this.lexeme = this.lexer.get_next();
    this.robot_name = robot_name || "robot";
}

parser_t.prototype._accept = function(expected_token){
    if(this.lexeme.token == expected_token){
        this.lexeme = lexer.get_next();
        return true;
    }
    return false;
}

parser_t.prototype._expect = function(expected_token){
    if(this._accept(expected_token)) return true;
    throw "Unexpected token";
    return false;
}

parser_t.prototype._accept_text = function(expected_text, expected_token){
    if(this.lexeme.token == expected_token && this.lexeme.text == expected_text){
        this.lexeme = lexer.get_next();
        return true;
    }
    return false;
}

parser_t.prototype._expect_text = function(expected_text, expected_token){
    if(this._accept_text(expected_text, expected_token)) return true;
    throw "Unexpected token";
    return false;
}

//returns the "compiled" js from english
parser_t.prototype.parse = function(){
    var program = {text: "", execute: false};
    if(this._parse_salutation())
        program.execute = true;
    while(!this.lexer.finished()){
        program += this._parse_command();
    }
}

parser_t.prototype.command = function(){
    this.alert();
    this.action();
}

parser_t.prototype.action = function(){
    if(this._accept("DRIVE")){
        this.drive_action();
    }
    else if(this._accept("TURN")){
        this.turn_action();
    }
}

parser_t.prototype.alert = function(){
    this._expect("HEY");
    this._expect_text(this.robot_name, "ID");
}

parser_t.prototype.drive_action = function(){
    this._expect("DRIVE");

    if(this._accept("DIRECTION")){
        //could be a direction only, or a distance as well       
    }
}

parser_t.prototype.turn_action = function(){
}
