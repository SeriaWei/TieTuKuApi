var dbRequest = window.indexedDB.open("keys", 1);

dbRequest.onsuccess = function (e) {
	var dataBase = e.target.result;

	var transaction = dataBase.transaction(["forToken"], "readwrite");
	var store = transaction.objectStore("forToken");;
	// store.add({
	// 	id: "1",
	// 	AccessKey: "8785e5649fcb34a820f4166de62887851a303404",
	// 	SecretKey: "f6da983de97064ae36a467aa6bf0dce071a0cfd9",
	// 	OpenKey: "cGyemsdmaGmdzMaSlGTFmmJmzGZjmZiYnGloa2ppb21plpmVlWViacOblGiSYpU="
	// });
			
	store.get("1").onsuccess = function (e) {
		debugger
		var token = e.target.result;
	};
	//store.put();
}
dbRequest.onupgradeneeded = function (e) {
	debugger
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