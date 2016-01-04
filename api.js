var tieTuKu = (function () {
    function tieTuKu(accessKey, secretKey, openKey) {
        this.methd = "POST";
        this.host = "http://api.tietuku.com/v2/api/";
        this.albumUrl = "http://api.tietuku.com/v1/Album";
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
    tieTuKu.prototype.upload = function (file, aid, callback) {
        var formData = new FormData();
        formData.append("Token", this.getToken({ deadline: Date.now() + 60, "aid": aid }));
        formData.append("file", file.files[0]);
        this.processRequest(formData, "http://up.tietuku.com/", callback);
    };
    ///全部图片列表
    tieTuKu.prototype.getNewpic = function (p, callBack) {
        var formData = new FormData();
        formData.append("key", this.openKey);
        formData.append("returntype", this.returnType);
        formData.append("p", p);
        formData.append("cid", 1);
        this.processRequest(formData, this.host + "getnewpic", callBack);
    };
    tieTuKu.prototype.createAlbum = function (name, callBack) {
        var formData = new FormData();
        formData.append("Token", this.getToken({ deadline: Date.now() + 60, action: "create", albumname: name }));
        this.processRequest(formData, this.albumUrl, callBack);
    };
    tieTuKu.prototype.editAlbum = function (aid, name, callBack) {
        var formData = new FormData();
        formData.append("Token", this.getToken({ deadline: Date.now() + 60, action: "editalbum", aid: aid, albumname: encodeURI(name) }));
        this.processRequest(formData, this.albumUrl, callBack);
    };
    tieTuKu.prototype.deleteAlbum = function (aid, callBack) {
        var formData = new FormData();
        formData.append("Token", this.getToken({ deadline: Date.now() + 60, action: "delalbum", aid: aid }));
        this.processRequest(formData, this.albumUrl, callBack);
    };
    ///获取相册
    tieTuKu.prototype.getAlbum = function (p, callBack) {
        var formData = new FormData();
        formData.append("key", this.openKey);
        formData.append("returntype", this.returnType);
        formData.append("p", p);
        this.processRequest(formData, this.host + "getalbum", callBack);
    };
    ///获取相册内图片
    tieTuKu.prototype.getPicList = function (p, aid, callBack) {
        var formData = new FormData();
        formData.append("key", this.openKey);
        formData.append("returntype", this.returnType);
        formData.append("p", p);
        formData.append("aid", aid);
        this.processRequest(formData, this.host + "getpiclist", callBack);
    };
    return tieTuKu;
})();
