class tieTuKu {
	accessKey: string;
	secretKey: string;
	openKey: string;
	methd = "POST";
	host = "http://api.tietuku.com/v2/api/";
	albumUrl = "http://api.tietuku.com/v1/Album";
	picListUrl = "http://api.tietuku.com/v1/List";
	picUrl = "http://api.tietuku.com/v1/Pic";
	returnType = "json";
	onprogress=function(){};
	constructor(accessKey: string, secretKey: string, openKey: string) {
		this.accessKey = accessKey;
		this.secretKey = secretKey;
		this.openKey = openKey;
	}
	processRequest(formData: FormData, url: string, callback: Function) {
        var xhr = new XMLHttpRequest();
        xhr.open(this.methd, url);
        xhr.onload = function(data) {
            if (data.target.status === 200) {
				callback.call(data, JSON.parse(data.target.response));
            } else {
				callback.call(data, JSON.parse(data.target.response));
            }
        }
		xhr.onerror = function(data) {
			console.log(data.target.response);
			callback.call(data, data.target.response);
		}
		xhr.upload.onprogress = function(e) {
			var persecnt = e.loaded / e.total * 100;
			if(onprogress){
				onprogress.call(e,persecnt);
			}
		}
        xhr.send(formData);
	}
	getToken(obj) {
		obj.deadline = Date.now() + 60;
		var encodedParam = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(obj)));

		var encodedSign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.HmacSHA1(encodedParam, this.secretKey).toString()));

		return this.accessKey + ":" + encodedSign + ":" + encodedParam;
	}
	///全部图片列表
	getNewPic(p: number, callBack: Function) {
		var formData = new FormData();
		formData.append("Token", this.getToken({ action: "getnewpic", cid: 1, page_no: p }));
		this.processRequest(formData, this.picListUrl, callBack);
	}
	createAlbum(name: string, callBack: Function) {
		var formData = new FormData();
		formData.append("Token", this.getToken({ action: "create", albumname: name }));
		this.processRequest(formData, this.albumUrl, callBack);
	}
	deleteAlbum(aid: number, callBack: Function) {
		var formData = new FormData();
		formData.append("Token", this.getToken({ action: "delalbum", aid: aid }));
		this.processRequest(formData, this.albumUrl, callBack);
	}
	updateAlbum(aid: number, name: string, callBack: Function) {
		var formData = new FormData();
		formData.append("Token", this.getToken({ action: "editalbum", aid: aid, albumname: name }));
		this.processRequest(formData, this.albumUrl, callBack);
	}
	///获取相册
	getAlbum(p: number, callBack: Function) {
		var formData = new FormData();
		formData.append("Token", this.getToken({ action: "get", page_no: p }));
		this.processRequest(formData, this.albumUrl, callBack);
	}
	///获取相册内图片
	getAlbumPic(p: number, aid: number, callBack: Function) {
		var formData = new FormData();
		formData.append("Token", this.getToken({ action: "album", aid: aid, page_no: p }));
		this.processRequest(formData, this.picListUrl, callBack);
	}
	
	///上传
	upload(file: HTMLElement, aid, callback: Function) {
		var formData = new FormData();
        formData.append("Token", this.getToken({ deadline: Date.now() + 60, "aid": aid }));
        formData.append("file", file.files[0]);
		this.processRequest(formData, "http://up.tietuku.com/", callback);
	}
	deletePic(pid: number, callBack: Function) {
		var formData = new FormData();
		formData.append("Token", this.getToken({ action: "delpic", pid: pid }));
		this.processRequest(formData, this.picUrl, callBack);
	}
	updatePic(pid: number, name: string, callBack: Function) {
		var formData = new FormData();
		formData.append("Token", this.getToken({ action: "updatepicname", pid: pid, pname: name }));
		this.processRequest(formData, this.picUrl, callBack);
	}
	getPicInfo(pid, callBack: Function) {
		var formData = new FormData();
		formData.append("Token", this.getToken({ action: "getonepic", id: pid }));
		this.processRequest(formData, this.picUrl, callBack);
	}
}