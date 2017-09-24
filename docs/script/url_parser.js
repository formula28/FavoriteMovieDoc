/* url parser クラス ST */
// 等式判定用判定項目bit
const COMP_PROTOCOL = 1;
const COMP_HOST     = 2;
const COMP_PORT     = 4;
const COMP_USER     = 8;
const COMP_PASS     = 16;
const COMP_DIR      = 32;
const COMP_FILE     = 64
const COMP_QUERY    = 128;
const COMP_HASH     = 256;

function UrlParser(url){
//プロパティ
    // 解析済みURL(連想配列)
    this.parsedUrl;
    
    if(url != null && url != undefined && url != ""){
        this.parseUrl(url);
    } else {
        this.parsedUrl = new Object();
    }
}

//メソッド

// URL解析
// func:[protcol://][user]:[pass]@[host]:[port][/dir]/[file]?[query]#[hash]の形式にURLを分解
// ret:URL解析成否(true/false)
UrlParser.prototype.parseUrl = function(url){
    var regExpUrl = url.match(/^(.+:\/{2,3})(.+?:)?(.+?@)?([0-9a-zA-Z\.\-:]+):?([0-9]+)?(?:(\/.*?)?(?:\/?([^\/]+\.[^\/]+?)?))?(\?.+?)?(#.+?)?$/);
    this.parsedUrl = new Object();
    
    if (regExpUrl == null || regExpUrl == undefined) {
        console.debug("The argument(url) is unexpected string for url.");
        return false;
    }
    
    //url
    if (regExpUrl[0] != null && regExpUrl[0] != undefined) {
        this.parsedUrl['url'] = regExpUrl[0];
    } else {
        this.parsedUrl['url'] = "";
    }
    //protocol
    if (regExpUrl[1] != null && regExpUrl[1] != undefined) {
        this.parsedUrl['protocol'] = regExpUrl[1];
    } else {
        this.parsedUrl['protocol'] = "";
    }
    //user
    if (regExpUrl[2] != null && regExpUrl[2] != undefined) {
        this.parsedUrl['user'] = regExpUrl[2].substring(0,regExpUrl[2].length-1);
    } else {
        this.parsedUrl['user'] = "";
    }
    //pass
    if (regExpUrl[3] != null && regExpUrl[3] != undefined) {
        this.parsedUrl['pass'] = regExpUrl[3].substring(0,regExpUrl[3].length-1);
    } else {
        this.parsedUrl['pass'] = "";
    }
    //host
    if (regExpUrl[4] != null && regExpUrl[4] != undefined) {
        this.parsedUrl['host'] = regExpUrl[4];
    } else {
        this.parsedUrl['host'] = "";
    }
    //port
    if (regExpUrl[5] != null && regExpUrl[5] != undefined) {
        this.parsedUrl['port'] = regExpUrl[5];
    } else {
        this.parsedUrl['port'] = "";
    }
    //dir
    if (regExpUrl[6] != null && regExpUrl[6] != undefined) {
        this.parsedUrl['dir'] = regExpUrl[6];
    } else {
        this.parsedUrl['dir'] = "";
    }
    //file
    if (regExpUrl[7] != null && regExpUrl[7] != undefined) {
        this.parsedUrl['file'] = regExpUrl[7];
    } else {
        this.parsedUrl['file'] = "";
    }
    //query
    if (regExpUrl[8] != null && regExpUrl[8] != undefined) {
        this.parsedUrl['query'] = regExpUrl[8].substring(1,regExpUrl[8].length);
    } else {
        this.parsedUrl['query'] = "";
    }
    //hash
    if (regExpUrl[9] != null && regExpUrl[9] != undefined) {
        this.parsedUrl['hash'] = regExpUrl[9].substring(1,regExpUrl[9].length);
    } else {
        this.parsedUrl['hash'] = "";
    }
    
    //dirlist
    this.parsedUrl['dirlist'] = this.parsedUrl['dir'].substring(1,this.parsedUrl['dir'].length).split("/");
    
    //querylist
    var temp = this.parsedUrl['query'].split("&");
    this.parsedUrl['querylist'] = new Object();
    
    for(var i=0;i<temp.length;i++){
        var r = temp[i].match(/^([^\=]+)\=?(.*)$/);
        if (r != null && r != undefined) {
            if (r[0] != null && r[0] != undefined && r[0] != "") {
                this.parsedUrl['querylist'][r[1]] = r[2];
            }
        }
    }
    
    console.debug(this.parsedUrl);
    
    return true;
}

// 等式
// arg:解析済みURLオブジェクト
// ret:true/false (urlが完全に等しいかどうか)
UrlParser.prototype.equal = function(aParsedUrl){
    return this.parsedUrl['url'] == aParsedUrl.parsedUrl['url'];
}

// 部分等式
// arg:解析済みURLオブジェクト,部分等式判定に用いるURL要素表現bit
// ret:true/false (urlが部分的に等しいかどうか)
UrlParser.prototype.subEqual = function(aParsedUrl,aComponentBit){
    //console.log(aParsedUrl,aComponentBit);
    if(this.parsedUrl['url'] == null || this.parsedUrl['url'] == undefined || this.parsedUrl['url'] == ""
        || aParsedUrl.parsedUrl['url'] == null || aParsedUrl.parsedUrl['url'] == undefined || aParsedUrl.parsedUrl['url'] == "")
    {
        return false;
    }
    
    if((aComponentBit & COMP_PROTOCOL) != 0
        && this.parsedUrl['protocol'] != aParsedUrl.parsedUrl['protocol'])
    {
        return false;
    }
    
    if((aComponentBit & COMP_HOST) != 0
        && this.parsedUrl['host'] != aParsedUrl.parsedUrl['host'])
    {
        return false;
    }
    
    if((aComponentBit & COMP_PORT) != 0
        && this.parsedUrl['port'] != aParsedUrl.parsedUrl['port'])
    {
        return false;
    }
    
    if((aComponentBit & COMP_USER) != 0
        && this.parsedUrl['user'] != aParsedUrl.parsedUrl['user'])
    {
        return false;
    }
    
    if((aComponentBit & COMP_PASS) != 0
        && this.parsedUrl['pass'] != aParsedUrl.parsedUrl['pass'])
    {
        return false;
    }
    
    if((aComponentBit & COMP_DIR) != 0
        && this.parsedUrl['dir'] != aParsedUrl.parsedUrl['dir'])
    {
        return false;
    }
    
    if((aComponentBit & COMP_FILE) != 0
        && this.parsedUrl['file'] != aParsedUrl.parsedUrl['file'])
    {
        return false;
    }
    
    if((aComponentBit & COMP_QUERY) != 0
        && this.parsedUrl['query'] != aParsedUrl.parsedUrl['query'])
    {
        return false;
    }
    
    if((aComponentBit & COMP_HASH) != 0
        && this.parsedUrl['hash'] != aParsedUrl.parsedUrl['hash'])
    {
        return false;
    }
    
    return true;
}

// 解析済みURLの連結
// ret:url
UrlParser.prototype.buildUrl = function(){
    if (this.parsedUrl == null || this.parsedUrl == undefined) {
        return "";
    } else {
        var pu = this.parsedUrl;
        var ret = pu['protocol'];
        if (pu['user'] != null && pu['user'] != undefined && pu['user'] != "") {
            ret += pu['user']+":";
        }
        if (pu['pass'] != null && pu['pass'] != undefined && pu['pass'] != "") {
            ret += pu['pass']+"@";
        }
        ret += pu['host'];
        if (pu['port'] != null && pu['port'] != undefined && pu['port'] != "") {
            ret += pu['port'];
        }
        if (pu['dir'] != null && pu['dir'] != undefined && pu['dir'] != "") {
            ret += pu['dir'];
        }
        if (pu['file'] != null && pu['file'] != undefined && pu['file'] != "") {
            if (pu['dir'] == "/") {
                ret += pu['file'];
            } else {
                ret += "/"+pu['file'];
            }
        }
        if (pu['query'] != null && pu['query'] != undefined && pu['query'] != "") {
            ret += "?"+pu['query'];
        }
        if (pu['hash'] != null && pu['hash'] != undefined && pu['hash'] != "") {
            ret += "#"+pu['hash'];
        }
        
        return ret;
    }
}

UrlParser.prototype.setProtocol = function(protocol){
    this.parsedUrl['protocol'] = protocol;
    this.parsedUrl['url'] = this.buildUrl();
}

UrlParser.prototype.setUser = function(user){
    this.parsedUrl['user'] = user;
    this.parsedUrl['url'] = this.buildUrl();
}

UrlParser.prototype.setPass = function(pass){
    this.parsedUrl['pass'] = pass;
    this.parsedUrl['url'] = this.buildUrl();
}

UrlParser.prototype.setHost = function(host){
    this.parsedUrl['host'] = host;
    this.parsedUrl['url'] = this.buildUrl();
}

UrlParser.prototype.setPort = function(port){
    this.parsedUrl['port'] = port;
    this.parsedUrl['url'] = this.buildUrl();
}

UrlParser.prototype.setDir = function(dir){
    if (dir != "" && dir.substring(0,1) != "/") {
        dir = "/"+dir;
    }
    this.parsedUrl['dir'] = dir;
    this.parsedUrl['url'] = this.buildUrl();
}

UrlParser.prototype.setFile = function(file){
    this.parsedUrl['file'] = file;
    this.parsedUrl['url'] = this.buildUrl();
}

UrlParser.prototype.setQuery = function(query){
    this.parsedUrl['query'] = query;
    this.parsedUrl['url'] = this.buildUrl();
}

UrlParser.prototype.addQuery = function(key,value){
    if (this.parsedUrl['query'] == "") {
        this.parsedUrl['query'] = key+"="+value;
    } else if (key in this.parsedUrl['querylist']){
        this.parsedUrl['querylist'][key] = value;
        var temp = "";
        for(var k in this.parsedUrl['querylist']){
            temp += k+"="+this.parsedUrl['querylist'][k]+"&";
        }
        this.parsedUrl['query'] = temp.substring(0,temp.length-1);
    } else {
        this.parsedUrl['query'] += "&"+key+"="+value;
    }
    this.parsedUrl['url'] = this.buildUrl();
}

UrlParser.prototype.setHash = function(hash){
    this.parsedUrl['hash'] = hash;
    this.parsedUrl['url'] = this.buildUrl();
}
/* url parser クラス ED */