function parser_t(text, robot_name){
    this.robot_name = robot_name || "robot";
    this.lexer = new lexer_t(text, {robot_nick: robot_name});
    console.log(this.lexer.tokens);
    this.lexeme = this.lexer.get_next();
    this.program = {};
    this.program.execute = false;
    this.program.text = '';
}

parser_t.prototype._next = function(){
    this.lexeme = this.lexer.get_next();
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
    throw "Expected token not found: {expected token: " + expected_token + "," + " current token:" + this.lexeme.token + " }"
        + " current text: " + this.lexeme.text;
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
    throw "Unexpected token: {" + expected_text + "," + expected_token + "}";
    return false;
}

//returns the "compiled" js from english
parser_t.prototype.parse = function(){
    if(this.salutation())
        this.program.execute = true;
    //while(!this.lexer.finished()){
        this.command();
    //}
}

parser_t.prototype.salutation = function(){
    this._expect("HEY");
    this._expect("ROBOT_NICK");
    return true;
}

parser_t.prototype.command = function(){
    this.action();
}

parser_t.prototype.action = function(){
    if(this._accept_text("drive", "ACTION")){
        this.drive_specs();
        return
    }
    else if(this._accept_text("turn", "ACTION")){
        this.turn_specs();
        return
    }
    throw "Did not find expected token";
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
        drive_params.distance = this.distance_convert(lexeme_text);
        if(!drive_params.direction)
            drive_params.direction = this._expect("DIRECTION")
    }

    this.make_drive_command(drive_params);
}

parser_t.prototype.make_drive_command = function(drive_params){
    if(drive_params.distance){
        this.program.text += drive_params.direction + "(" + drive_params + ");\n";
    }
    else{
        if(drive_params.direction != 'forward')
            this.program.text += drive_params.direction + "(90)\n";
        this.program.text += "drive(10,10)";
    }
}

parser_t.prototype.turn_specs = function(){
    var lexeme_text;
    var turn_params = {};
    if(lexeme_text = this._accept("ANGLE")){
        turn_params.angle = lexeme_text;
    }
    if(lexeme_text = this._accept("TURN_DIRECTION")){
        turn_params.direction = lexeme_text;
        if(!turn_params.angle && (lexeme_text = this._accept("ANGLE"))){
            turn_params.angle = lexeme_text;
        }
    }
    if((!turn_params.angle && !turn_params.direction) 
            && (lexeme_text = this._accept("DIRECTION"))){
        turn_params.direction = lexeme_text;
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
