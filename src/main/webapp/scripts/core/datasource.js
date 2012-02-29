var AUTO_CACHE = true;
var IS_ONLINE = true;
var DataSources = new Array();

//DataWatcher provides a global object to track the current state of data
function DataWatcher() {
	this.loading = false;
	this.dataQueue = new Array();
}
	
DataWatcher.prototype.waitingForData = function() {
	if(this.dataQueue.length > 0) {
		return true;
	}
	
	return false;
}

DataWatcher.prototype.addToQueue = function(source) {
	dataWatcher.dataQueue.push(source);
	return this.dataQueue.length - 1; 
}

DataWatcher.prototype.removeFromQueue = function(source) {}

DataWatcher.prototype.removeFromQueueBySource = function(source) {
	var newQueue = new Array();
	for(var i = 0; i < this.dataQueue.length; i++) {
		if(this.dataQueue[i].id != source.id) { 
			newQueue.push(this.dataQueue[i]); 
			} //else { alert(source.id); }
	}
	this.dataQueue = newQueue;
	if(source && source.dataTree) { source.dataTree.handleData(''); } 
}

DataWatcher.prototype.removeFromQueueByIndex = function(index) {
	var newQueue = new Array();
	for(var i = 0; i < this.dataQueue.length; i++) {
		if(i != index) { 
			newQueue.push(this.dataQueue[i]); 
			}
	}
	this.dataQueue = newQueue;
//	if(source && source.dataTree) { source.dataTree.handleData(''); }
}

dataWatcher = new DataWatcher();
	
	
//ExternalDataSource defines a single URL connected to specific functions for 
//handling offline and online types of data	
function ExternalDataSource(id,url,preData,processData,processCache,systemFile,intervalAmount,nocache) {
	this.id = id;
	this.url = url;
	this.source = document.createElement('script');	
	this.source.id = this.id+'_script';
	document.getElementsByTagName('HEAD')[0].appendChild(this.source);
	
	this.systemFile = systemFile;
	this.intervalAmount = intervalAmount; 
	if(!this.intervalAmount) { this.intervalAmount = 2000000; } //three minute default: 200000 thirty minute: 2000000
	this.queueNumber = 0;
	this.preData = preData;
	this.processData = processData;
	this.processCache = processCache;
	this.dataTree = false;
	this.timeout = false;
	this.loadFail = false;
	DataSources[this.id] = this;
	
	if(window.openDatabase && window.filesDB && !nocache) {
		if(this.systemFile) { touchSystemJSON(this.id); }
		else { touchJSON(this.id); }
		}
}

ExternalDataSource.prototype.send = function() {
	document.getElementsByTagName('HEAD')[0].removeChild(this.source);
	this.source = document.createElement('script');	
	this.source.id = this.id+'_script';
	document.getElementsByTagName('HEAD')[0].appendChild(this.source);
	if(this.url.indexOf('?') < 0) {
		this.source.src = this.url+"?t="+this.id+Math.random();//+"&qid="+this.id;
		} else {
		this.source.src = this.url+"&t="+this.id+Math.random();//+"&qid="+this.id;
		}
	
	this.timeout = window.setTimeout('resetLoad("'+this.id+'")',2000);
	
}

function resetLoad(sourceName) {
	 DataSources[sourceName].loadFail = true;
	 DataSources[sourceName].load();
}	

ExternalDataSource.prototype.load = function() {
	this.preData();
	if(IS_ONLINE && this.url && !this.loadFail) {
	  if(!this.systemFile) {
	  
	  	if(!window.filesDB || location.hash.indexOf('&') > 0) { this.send(); return; }
	  	loadJSON(this.id, function(tx,result) {
	  		if(result.rows.length == 0) {return;}
	  		if( (result.rows.length > 0 && result.rows.item(0)['name'] && result.rows.item(0)['name'].length > 0 && result.rows.item(0)['json'].length == 0) || 
				( (result.rows.length > 0 && result.rows.item(0)['name'])
				   &&  (new Date().getTime() - result.rows.item(0)['LastModified']) > DataSources[result.rows.item(0)['name']].intervalAmount) ) {
					DataSources[result.rows.item(0)['name']].send();
				} else {
					if(result.rows.length > 0 && window.openDatabase && result.rows.item(0)['name']) {DataSources[result.rows.item(0)['name']].processCache(tx,result); DataSources[result.rows.item(0)['name']].checkDataTree();}
				}
			});
		} else {
		
		if(!window.systemDB || location.hash.indexOf('&') > 0) { this.send(); return; }
	  
		loadSystemJSON(this.id, function(tx,result) {
			if(result.rows.length == 0) {return;}
	  		if( (result.rows.length > 0 && result.rows.item(0)['name'].length > 0 && result.rows.item(0)['json'].length == 0) || 
				( (new Date().getTime() - result.rows.item(0)['LastModified']) > DataSources[result.rows.item(0)['name']].intervalAmount) ) {
					DataSources[result.rows.item(0)['name']].send();
				} else {
					if(window.openDatabase) {DataSources[result.rows.item(0)['name']].processCache(tx,result); DataSources[result.rows.item(0)['name']].checkDataTree();}
				}
			});
		}
	
	} else {
		
	if(window.openDatabase && window.filesDB) {	
		if(!this.systemFile) {
			if(window.openDatabase && window.filesDB) {loadJSON(this.id,this.processCache); this.checkDataTree(); }
			} else {
			if(window.openDatabase && window.systemDB ) {loadSystemJSON(this.id,this.processCache); this.checkDataTree(); }
			}
		} else {
		
			this.processCache(null,null);
		
		}
	}
}

ExternalDataSource.prototype.handleData = function(jsonData) {
//	alert(jsonData.status);
	if(this.timeout) {
		window.clearTimeout(this.timeout);
		this.timeout = false;
	}
	
	if( location.hash.indexOf('&') < 0 ) { //probably obsolete
		if(!this.systemFile) {
			if(window.openDatabase && window.filesDB) {saveJSON(this.id,JSON.stringify(jsonData));}
			} else {
			if(window.openDatabase && window.systemDB) {saveSystemJSON(this.id,JSON.stringify(jsonData));}
		}
	}
	
	this.processData(this.id,jsonData);
	this.checkDataTree();
	
	
}

ExternalDataSource.prototype.checkDataTree = function() {
	if(this.dataTree && this.dataTree.async) {
		dataWatcher.removeFromQueueBySource(this);
	}
	
	if(this.dataTree && !this.dataTree.async) {
	//	this.dataTree.handleData('');
	}
	
	if(!dataWatcher.waitingForData() && this.dataTree && this.dataTree.async) {
		this.dataTree.stopLoading();
	}
	
}

ExternalDataSource.prototype.handleDataBase = function(tx,data) {
	this.processCache(data);
	if(this.dataTree && this.dataTree.async) {
		dataWatcher.removeFromQueueBySource(this);
	} else if(this.dataTree && !this.dataTree.async) {
		this.dataTree.handleData('');
	}
}

ExternalDataSource.prototype.setURL = function(newURL) {
	this.url = newURL;
}

ExternalDataSource.prototype.setInterval = function(interval) {
	setInterval(this.load,interval);
}

ExternalDataSource.prototype.remove = function() {
	document.getElementsByTagName('HEAD')[0].removeChild(this.source);
	}

//ExternalDataTree handles multiple data sources 
function ExternalDataTree(id, dataSources, startLoading, stopLoading, async) {
	this.id = id;
	this.dataSources = dataSources;
	this.startLoading = startLoading;
	this.stopLoading = stopLoading;
	this.async = async;
	this.currentQueue = 0;
	
	for(var i = 0; i < this.dataSources.length; i++) {
		this.dataSources[i].dataTree = this;
	}		
}

ExternalDataTree.prototype.loadSources = function() {
	this.currentQueue = 0;
	dataWatcher.dataQueue = new Array();
	for(var i = 0; i < this.dataSources.length; i++) {
		this.dataSources[i].queueNumber = dataWatcher.addToQueue(this.dataSources[i]);
	}
	
	this.startLoading();
	if(!this.async) {dataWatcher.dataQueue[0].load();}
	else {
		for(var i = 0; i < this.dataSources.length; i++) {
			this.dataSources[i].load();
		}	
	}
}

ExternalDataTree.prototype.handleData = function(jsonData) {
	if(IS_ONLINE && dataWatcher.waitingForData() && jsonData != '' && jsonData != null ) {
		dataWatcher.dataQueue[0].handleData(jsonData);
		}
		
	dataWatcher.removeFromQueueByIndex(0);
	
	if(dataWatcher.waitingForData()) {
		dataWatcher.dataQueue[0].load();
	} else {
		this.stopLoading();
	}
}

//DataSet is a wrapper for ExternalDataSource and Spry Data (both required libs)

var JSONDataSets = new Array();

function JSONDataSet(name,url,dataleaf,isSystem,interval) {
	this.name = name;
	this.url = url;
	this.dataleaf = dataleaf;
	this.isSystem = isSystem;
	this.interval = interval;
	
	this.dataSource = new ExternalDataSource(name,url,this.loading,this.loadOnlineData,this.loadOfflineData,isSystem,interval);
	this.dataSource.parent = this;
	this.dataSet = new Spry.Data.DataSet(null,true);
	
	this.data = new Array();
	JSONDataSets.push(this);
}

JSONDataSet.prototype.handleData = function(jsonData) { this.dataSource.handleData(jsonData); }

JSONDataSet.prototype.loading = function() {}

JSONDataSet.prototype.loadOnlineData = function(name,newData) {
	this.parent.data[name] = newData.items;
	if(!this.dataTree) {
		if(window.dataLoaded) { dataLoaded(); }
	}
}

JSONDataSet.prototype.loadOfflineData = function(tx,newData) {
	if(newData.rows.length > 0 && newData.rows.item(0)['json'].length > 0) {
		name = newData.rows.item(0)['name'];
		newData = JSON.parse(newData.rows.item(0)['json']);
		for(var i = 0; i < JSONDataSets.length; i++) {
			if(JSONDataSets[i].name == name) {
				JSONDataSets[i].data[name] = JSON.parse(newData.items);
				}
			}
	} else {
	//	this.data.push(new Array());
	}
//	alert(1);
//	dataWatcher.removeFromQueueBySource(dataWatcher.dataQueue[0]);	
	
	if(this.dataSource && !this.dataSource.dataTree) {
		if(window.dataLoaded) { dataLoaded(); }
	}
	
	if(window.dataLoaded && !dataWatcher.waitingForData()) { dataLoaded(); }
}


function DataTree(name,sources,async) {
	this.name = name;
	this.sources = sources;
	this.async = async;
	
	this.datasources = new Array();
	for(var i = 0; i < this.sources.length; i++) {
		this.datasources.push(sources[i].dataSource);
	}
	
	this.dataTree = new ExternalDataTree(name,this.datasources,this.preLoad,this.postLoad,async);
	this.dataTree.parent = this;
	this.dataSet = new Spry.Data.DataSet(null,true);
	this.data = new Array();
	
	for(var i = 0; i < this.sources.length; i++) {
		this.sources[i].data = this.data;
	}
	
	this.load = function() { this.dataTree.loadSources(); }
}

DataTree.prototype.preLoad = function() {
	
}

DataTree.prototype.postLoad = function() {
	if(window.dataLoaded && !dataWatcher.waitingForData()) { dataLoaded(); }
}




