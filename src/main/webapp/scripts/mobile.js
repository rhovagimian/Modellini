
	  var xOffset = 50  + (window.pageXOffset||document.documentElement.scrollLeft);
	  var yOffset = 585 + (window.pageYOffset||document.documentElement.scrollTop);
	  
	  var iLastX = -1;
	  var iLastY = -1;
		
	  
	  var searchContext = '';
	  var searchKeyword = '';
	  var oCanvas = {}; 
	  var oCtx = {};
	  var salesRecord = {
	  	account : '',
	  	product : '',
	  	quantity : 1,
	  	delivery_date : new Date(),
	  	signature : ''
	  };
	  var results;// = new Spry.Data.DataSet();
      var products;// = new Spry.Data.DataSet();
	  
      function search(keyword) {
      	if(searchContext == 'accounts') { searchAccounts(keyword); }
      	if(searchContext == 'products') { searchProducts(keyword); }
      }

      var xmlhttp = false;

function GetCustomerInfo() {
}

function ProcessRequest() 
{
}
      function searchAccounts(keyword) {
		 
          	$('searchResults').style.display = 'block';
          	
      }
      
      function searchDB(tx,data) {
      	var newresults = new Array();
      	if(data.rows.length > 0) {
      			data = JSON.parse(data.rows.item(0)['json']);
      			data = JSON.parse(data);
      			for(var x = 0; x < data.length; x++) {
      			if(data[x].Name.toLowerCase().indexOf(searchKeyword.toLowerCase()) >= 0) {
      					newresults.push(data[x]);
      				}
      			}
      		}
      	results.setDataFromArray(newresults);
      	$('searchResults').style.display = 'block';
          		
      }
      
      function searchProducts(keyword) {

      }
      
      function saveRecord() {
      	
      	saveJSON('salesRecord',JSON.stringify(salesRecord));
      	
      	
      }

      function sendRecord() {


      	if(window.location.search.length < 1 && !loggedIn) {
      		alert("Connect to Salesforce to upload record.");
      		return;
      	}
      	
      	clearRecord();
      }
      
      function clearRecord() {
      	
      	$('quantity').value = 1;
      	cal1.selectedDate = false;
      	cal1.populate();
      	salesRecord = {
	  		account : '',
	  		product : '',
	  		quantity : 1,
	  		delivery_date : '',
	  		signature : ''
	  	};
      	saveJSON('salesRecord',JSON.stringify(salesRecord));
      	oCtx.closePath();
      	oCtx.clearRect(0,0,oCanvas.width,oCanvas.height);
      	oCanvas.width = oCanvas.width;
 		oCtx.beginPath();
      		
      }
      
      function loadLastRecord(tx,data) {
      	if(data.rows.length > 0) {
      			data = JSON.parse(data.rows.item(0)['json']);
      			salesRecord = data;
      			$('quantity').value = salesRecord.quantity;
      			var d = new Date();
      			salesRecord.delivery_date = d.setISO8601(salesRecord.delivery_date);
      			cal1.selectedDate = salesRecord.delivery_date;
      			
      			if(salesRecord.account && salesRecord.account.Name) {
      				$('storeBtn').innerHTML = salesRecord.account.Name;
      				}
      				
      			cal1.populate();
      		}
      }
      
      function loadAccounts() {
      	  loadJSON('accounts',handleAccounts)
      }
      
      function handleAccounts(tx,data) {
      		if(data.rows.length > 0) {
      			data = JSON.parse(data.rows.item(0)['json']);
      			data = JSON.parse(data);
      			accountsData.setDataFromArray(data);
      		}
      }
      
      function chooseSelection(id) {
      	for(var i = 0; i < results.data.length; i++) {
      			if(id == results.data[i].Id) {
      			
      			$('searchForm').style.display = 'none';
          		
          		if(searchContext == 'accounts') { 
          			$('storeBtn').innerHTML = results.data[i].Name;
      				salesRecord.account = results.data[i]; 
          			}
          		if(searchContext == 'products') { 
          			$('productBtn').innerHTML = results.data[i].Name;
      				salesRecord.product = results.data[i]; 
          			}
          	
      			}
      		}
      	saveRecord();
      }
      
      function setDelivery(val) {
      	salesRecord.delivery_date = val;
      	saveRecord();
      }

      window.onload = function () {
          touchJSON('accounts');
          touchJSON('products');
          touchJSON('salesRecord');

          var bMouseIsDown = false;

          oCanvas = document.getElementById("thecanvas");
          oCtx = oCanvas.getContext("2d");

          oCtx.strokeStyle = "#333366";
          oCtx.lineCap = "round";
          oCtx.lineJoin = "round";
          oCtx.miterLimit = 5;

          oCtx.strokeWidth = "1px";
          oCtx.beginPath();

          oCanvas.onmousedown = function (e) {
              bMouseIsDown = true;
              iLastX = e.clientX - findPosX($('thecanvas'));
              iLastY = e.clientY - findPosY($('thecanvas'));
              oCtx.moveTo(iLastX, iLastY);
          }

          oCanvas.onmouseup = function (e) {
              bMouseIsDown = false;
              iLastX = -1;
              iLastY = -1;
              salesRecord.signature = oCanvas.toDataURL().substring(String('data:image/png;base64,').length, oCanvas.toDataURL().length);
          }

          oCanvas.onmousemove = function (e) {
              if (bMouseIsDown) {
                  var iX = e.clientX - findPosX($('thecanvas'));
                  var iY = e.clientY - findPosY($('thecanvas'));
                  oCtx.moveTo(iLastX, iLastY);
                  oCtx.lineTo(iX, iY);
                  oCtx.stroke();
                  iLastX = iX;
                  iLastY = iY;
              }
          }

          oCanvas.ontouchstart = function (e) {
              e.preventDefault(); //stop normal scrolling
              bMouseIsDown = true;
              iLastX = e.targetTouches[0].clientX - findPosX($('thecanvas'));
              iLastY = e.targetTouches[0].clientY - findPosY($('thecanvas'));
          }
          oCanvas.ontouchmove = function (e) {
              e.preventDefault(); //stop normal scrolling
              iX = e.targetTouches[0].clientX - findPosX($('thecanvas'));
              iY = e.targetTouches[0].clientY - findPosY($('thecanvas'));
              oCtx.moveTo(iLastX, iLastY);
              oCtx.lineTo(iX, iY);
              oCtx.stroke();
              iLastX = iX;
              iLastY = iY;
              //	$('coords').innerHTML = iX+','+iY;
          }
          oCanvas.ontouchend = oCanvas.onmouseup;

          window.addEventListener("touchstart", oCanvas, false);
          window.addEventListener("touchmove", oCanvas, false);
          window.addEventListener("touchend", oCanvas, false);

          //loadJSON('salesRecord', loadLastRecord);

      }      
   /*   window.onload = loadAccounts; */
 
 
function findPosX(obj)
  {
    var curleft = 0;
    if(obj.offsetParent)
        while(1) 
        {
          curleft += obj.offsetLeft;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.x)
        curleft += obj.x;
    
 //   alert(obj.scrollLeft);
 //   curLeft -= obj.scrollLeft;
    return curleft;
  }

  function findPosY(obj)
  {
    var curtop = 0;
    if(obj.offsetParent)
        while(1)
        {
          curtop += obj.offsetTop;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.y)
        curtop += obj.y;
    
    curtop -= obj.scrollTop;
    return curtop;
  } 