function lexer_t(text){
    this.text = text.toLowerCase();
    this.text_idx = 0;
    this.tokens = [];
    this.add_token(['hey'], 'HEY');
    this.add_token(['left'], 'DIRECTION');
    this.add_token(['right'], 'DIRECTION');
}

lexer_t.prototype.add_token = function(list, ret){
    for(t of this.tokens){
        if(t.token_return == ret){
            for(i of list)
                t.expected_texts.push(i);
            return;
        }
    }
    this.tokens.push({expected_texts: list, token_return: ret});
}

lexer_t.prototype.get_next = function(){
    var lexeme = {}
    old_idx = this.text_idx;
    while(this.text[this.text_idx] != ' ' && this.text_idx < this.text.length) this.text_idx++;
    lexeme.text = this.text.slice(old_idx, this.text_idx);
    lexeme.token = this.get_token(lexeme.text);

    this.text_idx++;
    return lexeme;
}

lexer_t.prototype.get_token = function(text){
    for(t of this.tokens){
        for(et of t.expected_texts){
            if(et == text) return t.token_return;
        }
    }
    if(text == '') return 'NULL';
    return 'ID';
}

lexer_t.prototype.finished = function(){
    return (this.text_idx >= this.text.length);
}
