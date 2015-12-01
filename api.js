var tieTuKu = (function () {
    function tieTuKu(accessKey, secretKey, openKey) {
        this.methd = "POST";
        this.host = "http://api.tietuku.com/v2/api/";
        this.returnType = "json";
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.openKey = openKey;
    }
    tieTuKu.prototype.processRequest = function (formData, url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(this.methd, url);
        xhr.onload = function (data) {
            if (data.target.status === 200) {
                callback.call(data, JSON.parse(data.target.response));
            }
            else {
                callback.call(data, JSON.parse(data.target.response));
            }
        };
        xhr.send(formData);
    };
    tieTuKu.prototype.getToken = function (obj) {
        var encodedParam = new Base64().encode(JSON.stringify(obj));
        var encodedSign = new Base64().encode(CryptoJS.HmacSHA1(encodedParam, this.secretKey).toString());
        return this.accessKey + ":" + encodedSign + ":" + encodedParam;
    };
    ///上传
    tieTuKu.prototype.upload = function (file, callback) {
        var formData = new FormData();
        formData.append("Token", this.getToken({ deadline: Date.now() + 60, "aid": "1134173" }));
        formData.append("file", file);
        this.processRequest(formData, "http://up.tietuku.com/", callback);
    };
    ///获取相册
    tieTuKu.prototype.getalbum = function (p, callBack) {
        var formData = new FormData();
        formData.append("key", this.openKey);
        formData.append("returntype", this.returnType);
        formData.append("p", p);
        this.processRequest(formData, this.host + "getalbum", callBack);
    };
    ///全部图片列表
    tieTuKu.prototype.getnewpic = function (p, callBack) {
        var formData = new FormData();
        formData.append("key", this.openKey);
        formData.append("returntype", this.returnType);
        formData.append("p", p);
        formData.append("cid", 1);
        this.processRequest(formData, this.host + "getnewpic", callBack);
    };
    ///获取相册内图片
    tieTuKu.prototype.getpiclist = function (p, aid, callBack) {
        var formData = new FormData();
        formData.append("key", this.openKey);
        formData.append("returntype", this.returnType);
        formData.append("p", p);
        formData.append("aid", aid);
        this.processRequest(formData, this.host + "getpiclist", callBack);
    };
    return tieTuKu;
})();
var tuKu = new tieTuKu("2d11a084b8ef3a977ae58ecb7f2a05b8dfaec57c", "da39a3ee5e6b4b0d3255bfef95601890afd80709", "apmXlsNhamnGnsiWlJGdmWeXy2dqyMWWbplolGJnmXCcm8fKxWZpmMOblGiSYpU==");
document.getElementById("selectFile").onchange = function () {
    tuKu.upload(this.files[0], function (data) {
    });
};