function engparser_t(text){
    _this=this;
    _this.text = text.toLowerCase();
    _this.text_idx = 0;
    _this.robot_nickname = 'wendy';

    _this.tokens =[];
    _this.add_token(['hey'], 'HEY');
    _this.add_token(['left'], 'DIRECTION');
    _this.add_token(['right'], 'DIRECTION');
}
