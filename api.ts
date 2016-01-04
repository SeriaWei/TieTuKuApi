class tieTuKu {
	accessKey: string;
	secretKey: string;
	openKey: string;
	methd="POST";
	host="http://api.tietuku.com/v2/api/";
	albumUrl="http://api.tietuku.com/v1/Album";
	returnType="json";
	constructor(accessKey: string, secretKey: string, openKey: string) {
		this.accessKey = accessKey;
		this.secretKey = secretKey;
		this.openKey = openKey;
	}
	processRequest(formData:FormData, url:string, callback: Function){		
        var xhr = new XMLHttpRequest();
        xhr.open(this.methd, url);
        xhr.onload = function(data) {
            if (data.target.status === 200) {
				callback.call(data, JSON.parse(data.target.response));
            } else {
				callback.call(data, JSON.parse(data.target.response));
            }
        }
        xhr.send(formData);
	}
	getToken(obj) {
		var encodedParam = new Base64().encode(JSON.stringify(obj));
		var encodedSign = new Base64().encode(CryptoJS.HmacSHA1(encodedParam, this.secretKey).toString());
		return this.accessKey + ":" + encodedSign + ":" + encodedParam;
	}
	///上传
	upload(file: HTMLElement,aid, callback: Function) {
		var formData = new FormData();
        formData.append("Token", this.getToken({ deadline: Date.now() + 60, "aid": aid }));
        formData.append("file", file.files[0]);
		this.processRequest(formData,"http://up.tietuku.com/",callback);
	}
	///全部图片列表
	getNewpic(p:number,callBack:Function){
		var formData=new FormData();
		formData.append("key",this.openKey);
		formData.append("returntype",this.returnType);
		formData.append("p",p);
		formData.append("cid",1);
		this.processRequest(formData,this.host+"getnewpic",callBack);
	}
	createAlbum(name:string,callBack:Function){
		var formData=new FormData();
		formData.append("Token", this.getToken({ deadline: Date.now() + 60, action: "create",albumname:name }));	
		this.processRequest(formData,this.albumUrl,callBack);
	}
	editAlbum(aid:number,name:string,callBack:Function){
		var formData=new FormData();
		formData.append("Token", this.getToken({ deadline: Date.now() + 60, action: "editalbum",aid:aid,albumname:encodeURI(name) }));	
		this.processRequest(formData,this.albumUrl,callBack);
	}
	deleteAlbum(aid:number,callBack:Function){
		var formData=new FormData();
		formData.append("Token", this.getToken({ deadline: Date.now() + 60, action: "delalbum",aid:aid}));	
		this.processRequest(formData,this.albumUrl,callBack);
	}
	///获取相册
	getAlbum(p:number,callBack:Function){
		var formData=new FormData();
		formData.append("key",this.openKey);
		formData.append("returntype",this.returnType);
		formData.append("p",p);
		this.processRequest(formData,this.host+"getalbum",callBack);
	}
	///获取相册内图片
	getPicList(p:number,aid:number,callBack:Function){
		var formData=new FormData();
		formData.append("key",this.openKey);
		formData.append("returntype",this.returnType);
		formData.append("p",p);
		formData.append("aid",aid);
		this.processRequest(formData,this.host+"getpiclist",callBack);
	}
	
}