function parser_t(text, robot_name){
    this.robot_name = robot_name || "robot";
    this.lexer = new lexer_t(text, {robot_nick: robot_name});
    //console.log(this.lexer.tokens);
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
    while(!this.lexer.finished()){
        this.command();
        if(!this.lexer.finished()){
            this._expect("THEN");
        }
    }
}

parser_t.prototype.salutation = function(){
    this._expect("HEY");
    this._expect("ROBOT_NICK");
    //get rid of that stupid human politness
    //who cares if its gramatical
    while(
        this._accept_text("can", "ID")  ||
        this._accept_text("could", "ID")|| 
        this._accept_text("will", "ID")|| 
        this._accept_text("you", "ID")  ||
        this._accept_text("please", "ID")){}
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
    throw "Did not find expected token: {" + this.lexeme.text + "}";
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
    drive_params.distance = this.parse_distance();

    this.make_drive_command(drive_params);
}

parser_t.prototype.make_drive_command = function(drive_params){
    if(drive_params.distance){
        this.program.text += drive_params.direction + "(" + drive_params.distance + ");\n";
    }
    else{
        if(drive_params.direction != 'forward')
            this.program.text += drive_params.direction + "(90);\n";
        this.program.text += "drive(10,10);\n";
    }
}

parser_t.prototype.turn_specs = function(){
    var lexeme_text;
    var turn_params = {};
    if(lexeme_text = this._accept("DIRECTION")){
        turn_params.direction = lexeme_text;
    }
    turn_params.angle = this.parse_angle();
    this.make_turn_command(turn_params);
}

parser_t.prototype.make_turn_command = function(turn_params){
    if(turn_params.direction){
        this.program.text += turn_params.direction + "(";
        if(turn_params.angle){
            this.program.text += turn_params.angle + ");\n";
        }
        else{
            this.program.text += "90);\n";
        }
    }
    else if(turn_params.angle){
        this.program.text += "right("+turn_params.angle+")";
    }
}

parser_t.prototype.parse_expression = function(){
    return this.parse_term();
}
parser_t.prototype.parse_number = function(){
    var num = this._accept("NUMBER") ;
    while(tmp = this._accept("NUMBER")){
        num*=10;
        num+=tmp;
    }
    var pi_part = this._accept("PI") || this._accept("TAU") || 0;
    if(pi_part && num) num *= pi_part;
    else if(pi_part) num = pi_part;
    return num;
}

parser_t.prototype.parse_factor = function(){
    var num = this.parse_number();
    while(true){
        if(this._accept("DIVIDE")){
            num /= this.parse_number();
        }
        else if(this._accept("MULTIPLY")){
            num *= this.parse_number();
        }
        else{
            return num;
        }
    }
}

parser_t.prototype.parse_term = function(){
    var num = this.parse_factor();
    while(true){
        if(this._accept("ADD")){
            num += this.parse_factor();
        }
        else if(this._accept("SUBTRACT")){
            num -= this.parse_factor();
        }
        else{
            return num;
        }
    }
}

parser_t.prototype.parse_distance = function(){
    if(num = this.parse_expression()){
        var dist_unit = this._accept("DISTANCE_UNIT");
        if(dist_unit == 'meter'){
            num*=100;
        }
        else if(dist_unit == 'inch'){
            num*=2.54;
        }
        else if(dist_unit == 'foot'){
            num*=2.54*12.0;
        }
        console.log(num, dist_unit);
        return num;
    }
    else 
        return;
}

parser_t.prototype.parse_angle = function(){
    if(num = this.parse_expression()){
        var angle_unit = this._accept("ANGLE_UNIT");
        if(angle_unit == 'radians'){
            num = (num*180)/(Math.PI);
        }
    }
    return num;
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
