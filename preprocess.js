var reduce= function(state_machine){
    //console.log(state_machine);
    if(typeof(state_machine) == 'number') return state_machine;
    if(Object.keys(state_machine).length == 1)
        for(key in state_machine)
            return state_machine[key];
    var substate = {};
    //console.log(state_machine);
    for(key in state_machine){
        if(key){
            if(!substate[key[0]]) substate[key[0]] = {};
            substate[key[0]][key.slice(1)] = state_machine[key];
        }
        else{
            substate[key] = state_machine[key];
            
        }
    }
    for(key in substate){
        substate[key] = reduce(substate[key]);
    }
    return substate;
};

var make_lexer = function(states){
    return function(word){
        var state_machine = reduce(states);
        for(var index = 0;index< word.length; index++){
            if(state_machine[word[index]] === undefined) break;
            state_machine = state_machine[word[index]];
            if(typeof(state_machine) == 'number') return state_machine;
        }
        return state_machine[''];
    }
};

function number_parser_t(){
    this.NUMBERS = {
        'zero'     :   0,
        'one'      :   1,
        'two'      :   2,
        'three'    :   3,
        'four'     :   4,
        'five'     :   5,
        'six'      :   6,
        'seven'    :   7,
        'eight'    :   8,
        'nine'     :   9,
        'ten'      :  10,
        'eleven'   :  11,
        'twelve'   :  12,
        'thirteen' :  13,
        'fourteen' :  14,
        'fifteen'  :  15,
        'sixteen'  :  16,
        'seventeen':  17,
        'eighteen' :  18,
        'nineteen' :  19,
        'twenty'   :  20,
        'thirty'   :  30,
        'fourty'   :  40,
        'fifty'    :  50,
        'sixty'    :  60,
        'seventy'  :  70,
        'eighty'   :  80,
        'ninty'    :  90,
        'hundred'  : 100,
        'thousand' : 1e3,
        'million'  : 1e6,
        'billion'  : 1e9,
        'trillion' :1e12
    };
    this.lexer = make_lexer(this.NUMBERS);
}

number_parser_t.prototype.parse = function(words){
    var stack = [];
    var stack_depth=0;
    var last_res = 0;

    for(var w of words){
        var res = this.lexer(w);
        if(res>=100){
            var tmp = 0;
            for(stack_depth;stack_depth>0;stack_depth--){
                tmp += stack.pop();
            }
            if(tmp==0) tmp=1;
            tmp *= res;
            stack.push(tmp);
            stack_depth = 1;
        }
        else{
            stack.push(res);
            if(last_res < 1000)
                stack_depth+=1;
        }
        last_res = res;
    }

    var total = 0;
    while(stack.length!=0){
        total += stack.pop();
    }

    return total;
}

//constant time lookup of a word
number_parser_t.prototype.is_number = function(word){
    return word in this.NUMBERS
}

function preprocessor_t(){
    this.number_parser = new number_parser_t();
}

preprocessor_t.prototype.preprocess = function(text){
    this.text = text.toLowerCase();
    this.text = this.text.replace('-',' ');
    this.text = this.text.split(' ');
    for(var i=0;i<this.text.length;++i){
        if(this.number_parser.is_number(this.text[i])){
            var j;
            for(j=i;j<this.text.length &&this.number_parser.is_number(this.text[j]); ++j){}
            this.text.splice(i, j-i,this.number_parser.parse(this.text.slice(i,j)));
        }
    }
    console.log(this.text);
    return this.text.join(' ');
}

var pp = new preprocessor_t();

