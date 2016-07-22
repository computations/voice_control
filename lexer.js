lexer_t.prototype.valid_tokens = new Set(['HEY', 'ROBOT_NICK', 'DIRECTION', 'ACTION', 'DISTANCE', 'UNIT']);

function lexer_t(text, opts){
    _this = this;
    this.preprocessor = new preprocessor_t();
    _this.text = this.preprocessor.preprocess(text);
    _this.text_idx = 0;
    _this.keywords = {};
    _this.tokens = [];
    _this.add_keywords(['hey'], 'HEY');
    _this.add_keywords([opts.robot_nick || 'robot'], 'ROBOT_NICK');
    _this.add_keywords(['left', 'right', 'forward', 'backwards'], 'DIRECTION');
    _this.add_keywords(['drive', 'turn'], 'ACTION');
    _this.add_keywords(['then'], 'THEN');
    _this.add_keywords(['pi'], 'PI', function(lexeme){lexeme.text = Math.PI; return lexeme});
    _this.add_keywords(['tau'], 'TAU', function(lexeme){lexeme.text = Math.PI*2; return lexeme;});
    _this.add_keywords(['radians', 'degrees'], 'ANGLE_UNIT');
    _this.add_keywords(['over'], 'DIVIDE');

    _this.add_token([/[0-9]+(?:.[0-9]+)?/], 'NUMBER');
    _this.add_token([/(?:centi)?meters?/, /inch(?:es)?/, 'feet', 'foot'], "DISTANCE_UNIT", this.clean_distance_unit);
}

lexer_t.prototype.clean_distance_unit = function(lex){
    //remove the plural from the unit, just makes code more readable later
    //also, turn inches into inch
    if(lex.text == 'inches'){
        lex.text = 'inch';
    }
    if(lex.text == 'feet'){
        lex.text = 'foot';
    }
    if(lex.text.slice(-1) == 's'){
        lex.text = lex.text.slice(0,-1);
    }
    return lex;
}

lexer_t.prototype[Symbol.iterator] = function*(){
    while(!this.finished()){
        yield this.get_next();
    }
}

lexer_t.prototype.add_keywords = function(list, ret, callback){
    for(kw of list){
        this.keywords[kw] = {token_return:ret, callback:callback};
    }
}

lexer_t.prototype.add_token = function(list, ret, callback){
    for(var t of this.tokens){
        if(t.token_return == ret){
            for(i of list)
                t.expected_texts.push(i);
            return;
        }
    }
    this.tokens.push({expected_texts: list, token_return: ret, callback: callback});
}

lexer_t.prototype.get_text = function(){
    old_idx = this.text_idx;
    while(this.text[this.text_idx] != ' ' && this.text_idx < this.text.length) this.text_idx++;
    return this.text.slice(old_idx, this.text_idx);
}

lexer_t.prototype.get_next = function(){
    lexeme = {}
    
    lexeme.text = this.get_text();
    lexeme = this.get_token(lexeme);

    this.text_idx++;
    console.log(lexeme);
    return lexeme;
}

lexer_t.prototype.get_token = function(lexeme){
    if(lexeme.text == '') return 'NULL';
    if(lexeme.text in this.keywords){
        lexeme.token = this.keywords[lexeme.text].token_return;
        if(this.keywords[lexeme.text].callback){ lexeme = this.keywords[lexeme.text].callback(lexeme)}
        return lexeme;
    }
    for(t of this.tokens){
        for(et of t.expected_texts){
            var res = lexeme.text.match(et);
            if(res && res[0].length == res.input.length){ 
                if(t.callback) lexeme = t.callback(lexeme);
                lexeme.token = t.token_return;
                return lexeme;
            }
        }
    }
    lexeme.token = 'ID';
    return lexeme;
}

lexer_t.prototype.finished = function(){
    return (this.text_idx >= this.text.length);
}
