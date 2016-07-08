function parser_t(text, robot_name){
    this.lexer = new lexer_t(text);
    this.lexeme = this.lexer.get_next();
    this.robot_name = robot_name || "robot";
}

parser_t.prototype._next(){
    this.lexeme = lexer.get_next();
}

parser_t.prototype._accept = function(expected_token){
    if(this.lexeme.token == expected_token){
        var ret = this.lexeme.text;
        this._next();
        return ret;
    }
    return '';
}

parser_t.prototype._expect = function(expected_token){
    var tmp = this._accept(expected_token);
    if(tmp) return tmp;
    throw "Unexpected token";
}

parser_t.prototype._accept_text = function(expected_text, expected_token){
    if(this.lexeme.token == expected_token && this.lexeme.text == expected_text){
        this._next();
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

parser_t.prototype.drive_specs = function(){
    var lexeme_text;
    var drive_params = {};
    if(lexeme_text = this._accept("DIRECTION")){
        drive_params.direction = lexeme_text;
    }
    if(lexeme_text = this._accept("DISTANCE")){
        drive_specs.distance = lexeme_text;
        if(!drive_params.direction)
            drive_params.direction = this._expect("DIRECTION")
    }
}

parser_t.prototype.turn_specs = function(){
    var lexeme_text;
    var turn_params;
    if(lexeme_text = this._accept("ANGLE")){
        turn_params.angle = lexeme_text;
    }
    if(lexeme_text = this._accept("TURN_DIRECTION")){
        turn_params.direction = lexeme_text;
        if(!turn_params.angle && lexeme_text = this._accept("ANGLE")){
            turn_params.angle = lexeme_text;
        }
    }
    if(!turn_params && lexeme_text._accept("DIRECTION")){

    }
}

parser_t.prototype.direction_parse = function(direction_text){
    return direction_text;
}

parser_t.prototype.distance_convert = function(distance_text){
    //right now, its a dummy function
    //eventually, it has to convert to whatever the front end uses
    return distance_text;
}

parser_t.prototype.angle_convert = function(angle_text){
    //dummy function, needs to convert eventually
    return angle_text;
}
