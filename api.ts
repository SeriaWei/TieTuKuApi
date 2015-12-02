class tieTuKu {
	accessKey: string;
	secretKey: string;
	openKey: string;
	methd="POST";
	host="http://api.tietuku.com/v2/api/";
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
	///获取相册
	getalbum(p:number,callBack:Function){
		var formData=new FormData();
		formData.append("key",this.openKey);
		formData.append("returntype",this.returnType);
		formData.append("p",p);
		this.processRequest(formData,this.host+"getalbum",callBack);
	}
	///全部图片列表
	getnewpic(p:number,callBack:Function){
		var formData=new FormData();
		formData.append("key",this.openKey);
		formData.append("returntype",this.returnType);
		formData.append("p",p);
		formData.append("cid",1);
		this.processRequest(formData,this.host+"getnewpic",callBack);
	}
	///获取相册内图片
	getpiclist(p:number,aid:number,callBack:Function){
		var formData=new FormData();
		formData.append("key",this.openKey);
		formData.append("returntype",this.returnType);
		formData.append("p",p);
		formData.append("aid",aid);
		this.processRequest(formData,this.host+"getpiclist",callBack);
	}
}