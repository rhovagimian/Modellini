var filesDB = false;
var systemDB = false;
var currentResults = false;
var currentID = false;
/*! Initialize the filesDB global variable. */
function initDB()
{
 if(window.openDatabase) {
		var shortName = appName + '_json_files';
        var version = '1.0';
        var displayName = 'JSON Offline Storage';
        var maxSize = 65536; // in bytes
        filesDB = openDatabase(shortName, version, displayName, maxSize);
 		systemDB = openDatabase('SYSTEM_SETTINGS', version, displayName, maxSize);
		createTables();
		}
}

function changeDataContext(context) {
	var shortName = context + '_json_files';
    var version = '1.0';
    var displayName = 'JSON Offline Storage';
    var maxSize = 65536; // in bytes
    filesDB = openDatabase(shortName, version, displayName, maxSize);	
}

function dropAllTables() {
	var dbCount = 0;
	loadSystemJSON('apps',function(tx,data) {	    
			if(data.rows.length > 0  && data.rows.item(0)['json'].length > 0 ) {
			data = JSON.parse(data.rows.item(0)['json']);
			var appsArray = JSON.parse(data.items);
			dbCount += appsArray.length;
			var dbs = new Array();
			for(var i = 0; i < appsArray.length; i++) {
				dbs.push(openDatabase(appsArray[i].appName + '_json_files', '1.0', 'JSON Offline Storage', 65536))
			}	
			
			for(var i = 0; i < dbs.length; i++) {
				dbs[i].transaction(
				        function (transaction) {
				        	transaction.executeSql('DROP TABLE files;',[],checkDBCount(dbCount--));
				        }
				    );
			}
			
			systemDB.transaction(
		        function (transaction) {
		        transaction.executeSql('DROP TABLE files;',[],checkDBCount(dbCount--));
		        }
		    );
			
		}
		
		 
				
	}
	);
	
}

function checkDBCount(count) {
	if(count == 0 ) { 
	
	var answer = confirm("Log In New User?")
	if (answer){
		top.window.location = "../index.html";
	}
	
	}
}


/*! This creates the database tables. */
function createTables()
{
 
    if( location.hash.indexOf('DropTables') >= 0 ) {
		    dropAllTables();
		    return;
		}
     
	filesDB.transaction(
    function (transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS files(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, LastModified TIMESTAMP NOT NULL, name TEXT NOT NULL, json BLOB NOT NULL DEFAULT "");', [], nullDataHandler, killTransaction);
    	}
	);
 	
 	systemDB.transaction(
    function (transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS files(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, LastModified TIMESTAMP NOT NULL, name TEXT NOT NULL, json BLOB NOT NULL DEFAULT "");', [], nullDataHandler, killTransaction);
    	}
	);
}
 
function saveJSON(name,json) {
	if(!filesDB) { return false; }
    filesDB.transaction(function (tx) {
		tx.executeSql("SELECT id from files where name = ?",[name], function(tx,result) {
			if(result.rows.length > 0) {
				updateJSON(result.rows.item(0)['id'],json);
			} else {
				insertJSON(name,json);
			}
		}
		)
	}
	);
} 

function touchJSON(name) {
	if(!filesDB) { return false; }
	filesDB.transaction(function (tx) {
		tx.executeSql("SELECT id from files where name = ?",[name], function(tx,result) {
			if(result.rows.length == 0) { insertJSON(name,''); }
		}
		)
	}
	);
}
 
function insertJSON(name,json)
{ 
    if(!filesDB) { return false; }
    filesDB.transaction(function (tx) 
        {
            tx.executeSql("INSERT INTO files (name,LastModified,json) VALUES (?, ?, ?)", [name,new Date().getTime(),json]);
        }); 
} 

function updateJSON(id,json)
{ 
    if(filesDB) {
    filesDB.transaction(function (tx) 
        {
            tx.executeSql("UPDATE files SET json = ?, LastModified = ? where id = ?", [json,new Date().getTime(),id]);
        }); 
    }
}

/* appendJSON assumes results have a field "Id" */
function appendJSON(id,data) {
	data = JSON.parse(data);
	data = JSON.parse(data);
	
	currentResults = data;
	loadJSON(id,appendResults);
}

function appendResults(tx,data) {
	var id;
	if(data.rows.length > 0) {
		id = data.rows.item(0)['name'];
		if(data.rows.item(0)['json'] != '') {
			data = JSON.parse(data.rows.item(0)['json']);
			data = JSON.parse(data);
			
			for(var x = 0; x < currentResults.length; x++) {
				var bFound = false;
				for (var y = 0; y < data.length; y++) {
					if(data[y].Id == currentResults[x].Id) {
					   data[y] = currentResults[x];  //update with latest from online source
					   bFound = true;
					}
				}
				if(!bFound) { 
					data.push(currentResults[x]); 
					} //not found in stored results, so add
			}
		  data = JSON.stringify(data);
		} else {
		  data = JSON.stringify(currentResults);	
		}
		
		saveJSON(id,data);
	} 
}
 
 
/*! Mark a file as "deleted". */
function deleteJSON(id)
{
    filesDB.transaction(function (tx) 
        {
            tx.executeSql("DELETE FROM files where id = ?", [id]);
        });
 
}

function loadJSON(name, callback) {
	if(filesDB) {
	filesDB.transaction(function (tx) {
			tx.executeSql("SELECT id, name, json, LastModified from files where name = ?",[name], callback)
		}
	); 
	} else {callback(null,false);}
} 


function saveSystemJSON(name,json) {
	systemDB.transaction(function (tx) {
		tx.executeSql("SELECT id from files where name = ?",[name], function(tx,result) {
			if(result.rows.length > 0) {
				updateSystemJSON(result.rows.item(0)['id'],json);
			} else {
				insertSystemJSON(name,json);
			}
		}
		)
	}
	);
}

function touchSystemJSON(name) {
	if(!systemDB) { return false; }
	systemDB.transaction(function (tx) {
		tx.executeSql("SELECT id from files where name = ?",[name], function(tx,result) {
			if(result.rows.length == 0) { insertSystemJSON(name,''); }
		}
		)
	}
	);
}

function insertSystemJSON(name,json)
{ 
    systemDB.transaction(function (tx) 
        {
            tx.executeSql("INSERT INTO files (name,LastModified,json) VALUES (?, ?, ?)", [name,new Date().getTime(),json]);
        }); 
} 

function updateSystemJSON(id,json)
{ 
    if(systemDB) {
    systemDB.transaction(function (tx) 
        {
            tx.executeSql("UPDATE files SET json = ?, LastModified = ? where id = ?", [json,new Date().getTime(),id]);
        }); 
    }
}
 
 
/*! Mark a file as "deleted". */
function deleteSystemJSON(id)
{
    systemDB.transaction(function (tx) 
        {
            tx.executeSql("DELETE FROM files where id = ?", [id]);
        });
 
}

function loadSystemJSON(name, callback) {
	if(systemDB) {
	systemDB.transaction(function (tx) {
			tx.executeSql("SELECT id, name, json, LastModified from files where name = ?",[name], callback)
		}
	); 
	} else {callback(null,false);}
}
	


 
/*! When passed as the error handler, this silently causes a transaction to fail. */
function killTransaction(transaction, error)
{
    return true; // fatal transaction error
}
 
/*! When passed as the error handler, this causes a transaction to fail with a warning message. */
function errorHandler(transaction, error)
{
    // error.message is a human-readable string.
    // error.code is a numeric error code
    alert('Oops.  Error was '+error.message+' (Code '+error.code+')');
 
    // Handle errors here
    var we_think_this_error_is_fatal = true;
    if (we_think_this_error_is_fatal) return true;
    return false;
}
 
/*! This is used as a data handler for a request that should return no data. */
function nullDataHandler(transaction, results)
{
}
 
/*! This returns a string if you have not yet saved changes.  This is used by the onbeforeunload
    handler to warn you if you are about to leave the page with unsaved changes. */
function saveChangesDialog(event)
{
    
    // alert('close dialog');
 
    if (contents == origcontents) {
    return NULL;
    }
 
    return "You have unsaved changes."; //   CMP "+contents+" TO "+origcontents;
}
 
/*! This sets up an onbeforeunload handler to avoid accidentally navigating away from the
    page without saving changes. */
function setupEventListeners()
{
    window.onbeforeunload = function () {
    return saveChangesDialog();
    };
}

initDB();