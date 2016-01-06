var DbContext = {
	DataBase: null,
	getOpenSetting: function (onSuccess) {
		DbContext.DataBase
			.transaction(["forToken"], "readwrite")
			.objectStore("forToken")
			.get("1").onsuccess = function (e) {
				if (e.target.result) {
					if (onSuccess) {
						onSuccess.call(this, e.target.result);
					}
				}
				else {
					var setting = {
						id: "1",
						AccessKey: "",
						SecretKey: "",
						OpenKey: ""
					};
					DbContext.DataBase
						.transaction(["forToken"], "readwrite")
						.objectStore("forToken")
						.add(setting).onsuccess = function (e) {
							if (onSuccess) {
								onSuccess.call(this, setting);
							}
						}
				}
			};
	},
	updateOpenSetting: function (setting, onSuccess) {
		DbContext.DataBase
			.transaction(["forToken"], "readwrite")
			.objectStore("forToken")
			.put(setting).onsuccess = function (e) {
				if (onSuccess) {
					onSuccess.call(this, e.target.result);
				}
			};
	}
}

var dbRequest = window.indexedDB.open("keys", 1);

dbRequest.onsuccess = function (e) {
	DbContext.DataBase = e.target.result;
}
dbRequest.onupgradeneeded = function (e) {
	var thisDB = e.target.result;
	if (!thisDB.objectStoreNames.contains("forToken")) {
		thisDB.createObjectStore("forToken", {  
			// primary key  
			keyPath: "id",  
			// auto increment  
			autoIncrement: false
		});
	}
}