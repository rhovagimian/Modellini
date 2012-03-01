<jsp:useBean id="configuration" class="com.modelmetrics.Configuration" scope="session"/>
<jsp:setProperty name="configuration" property="*"/> 

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head >
    <title>Modellini Metrilago</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="apple-mobile-web-app-capable" content="yes" /> 
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="stylesheet" type="text/css" href="styles/zflow/zflow.css" />

    <style type="text/css">
        .portrait { width: 768px; height: 960px; }
        .landscape { width: 1024px; height: 700px; }

        body  {
	        color: white;
	        margin: 0;
	        padding: 0;
	        font-family: Helvetica;
	        height: 1024px;
        }
    
    </style>
    <script type="text/javascript" src="scripts/core/oauth.js"></script>
    <script type="text/javascript" src="scripts/jquery.min.js"></script>
    <script type="text/javascript" src="scripts/zflow/zflow.js"></script>
	<script>


pageMethodConcept = {
    callServerSideMethod: function () {
        PageMethods.setAccessToken(OAuth.decodePercent(OAuth.decodeForm(document.URL.substring(document.URL.indexOf('#') + 1, document.URL.length))[0][1]), OAuth.decodePercent(OAuth.decodeForm(document.URL.substring(document.URL.indexOf('#') + 1, document.URL.length))[1][1]), pageMethodConcept.callback);
    },
    callback: function (result) {
        var resultString = "";
        if (result) {
            //done to get rid of the access token and sensitive data in the # url fragment
            window.location = "Configure.aspx";
        }
    }
}

var accessT = OAuth.decodePercent(OAuth.decodeForm(document.URL.substring(document.URL.indexOf('#') + 1, document.URL.length))[0][1]);

if (accessT != null && accessT.length > 10) {
    pageMethodConcept.callServerSideMethod();
}
	
	    window.onorientationchange = function (event) {
	        if (window.orientation == 0) {
	            jQuery("div.centering").attr("class", "centering portrait");
	        }
	        else {
	            jQuery("div.centering").attr("class", "centering landscape");
	        }
	
	        window.setTimeout(function () { window.scrollTo(0, 0); }, 100);
	    }
	
	    var leatherOptions = ["images/leather.jpg", "images/suede.jpg", "images/crocodile.jpg", "images/lv.jpg"];
	
	    function changeLeather(v) {
	        var el = document.getElementById("interiorImage");
	        el.style.opacity = "0";
	
	        var el2 = document.getElementById("leather");
	        if (v == "Leather") {
	            el.style.webkitTransform = "translate3d(0px, 0, 200px)";
	            el.src = leatherOptions[0];
	            el2.value = leatherOptions[0];
	            el.style.opacity = "1";
	        }
	        else if (v == "Suede") {
	            el.style.webkitTransform = "translate3d(0px, 0, 200px)";
	            el.src = leatherOptions[1];
	            el2.value = leatherOptions[1];
	            el.style.opacity = "1";
	        }
	        else if (v == "Crocodile") {
	            el.style.webkitTransform = "translate3d(0px, 0, 200px)";
	            el.src = leatherOptions[2];
	            el2.value = leatherOptions[2];
	            el.style.opacity = "1";
	        }
	        else if (v == "Luxury") {
	            el.style.webkitTransform = "translate3d(0px, 0, 200px)";
	            el.src = leatherOptions[3];
	            el2.value = leatherOptions[3];
	            el.style.opacity = "1";
	        }
	        else {
	            el.style.webkitTransform = "translate3d(0px, 0, 0px)";
	            el.style.opacity = "0";
	            el2.value = "";
	        }
	    }
	
	    function selectOpt(v) {
	        v.childNodes[2].checked = !v.childNodes[2].checked;
	        var el = document.getElementById(v.className+"In");
	        if (v.childNodes[2].checked == true) {
	            v.childNodes[1].style.opacity = "1";
	            el.value = v.childNodes[3].src;
	        }
	        else {
	            v.childNodes[1].style.opacity = "0";
	            el.value = "";
	        }
	    }
	
	    function hidePage() {
	        var el = document.getElementById("form1");
	        el.style.opacity = "0";
	        el = document.getElementById("360frame");
	        el.style.opacity = "1";
	    }
	
	    function hide360() {
	        var el = document.getElementById("360frame");
	        el.style.opacity = "0";
	        el = document.getElementById("form1");
	        el.style.opacity = "1";
	    }
	</script>
</head>
<body class="zflow">
<%= request.getParameter("accessToken")%><br/>
<%= request.getParameter("accessUrl")%>
    <form action="/review" method="post">
		<div class="logo">
		    <img src="images/modellini-logo.png" />
		</div>

		<div class="topContainer"></div>

	<%--<a href="#" style="font-size: 16px;" onclick="hidePage();">View in 3D</a>--%>
		<div class="stepOneText">1. Select a color</div>
		<div class="stepTwoText">2. Select interior</div>
		<div class="stepThreeText">3. Select options</div>
		<div class="centering"><div id="tray" class="tray"></div></div>

		<div class="interiorSelect">
			<select onchange="changeLeather(this.value)">
			  <option>Please select your interior</option>
			  <option>Leather</option>
			  <option>Suede</option>
			  <option>Crocodile</option>
			  <option>Luxury</option>
			</select>
		</div>
		<div class="interiorDiv"><img id="interiorImage" /></div>

		<div id="optionsD" class="optionsDiv">
		    <div class="optionOne" onclick="selectOpt(this);">
		        <img class="optionCheck" src="images/check2.png" />
		        <img class="optionImg" src="images/gps.jpg" />
		        <input type="checkbox" style="display:none;" />
		    </div>

		    <div class="optionTwo" onclick="selectOpt(this);">
		        <img class="optionCheck" src="images/check2.png" />
		        <img class="optionImg" src="images/heated.jpg" />
		        <input type="checkbox" style="display:none;" />
		    </div>

		    <div class="optionThree" onclick="selectOpt(this);">
		        <img class="optionCheck" src="images/check2.png" />
		        <img class="optionImg" src="images/ipod.jpg" />
		        <input type="checkbox" style="display:none;" />
		    </div>
		    
		</div>

		<div class="descriptionsDiv">
		    <div class="descriptionOneTitle">
		        Navigation system
		    </div>
		    <div class="descriptionOne">
		     Gets you to your destination in shortest possible time. Includes voice feedback, Voice command system and Real Time Traffic Information.
		    </div>

		    <div class="descriptionTwoTitle">
		        Heated seats
		    </div>
		    <div class="descriptionTwo">
		        Warm yourself up during those chilly drives in the countryside.
		     </div>

		    <div class="descriptionThreeTitle">
		        iPod and USB connector
		    </div>
		    <div class="descriptionThree">
		        Listen to some classical tunes stored on your iPod or iPhone.
		     </div>
		</div>

		<div>
		    <input id="color" type="hidden" />
		    <input id="leather" type="hidden" />
		    <input id="optionOneIn" type="hidden" />
		    <input id="optionTwoIn" type="hidden" />
		    <input id="optionThreeIn" type="hidden" />
		    <input id="continueButton" type="submit" value="Continue" />
		</div>
	<%--<img class="360class" src="images/360.gif" height="30px" width="30px" style="position:absolute;top:10px;left:370px;" />--%>
		<div class="footer">
		    <%--<div>Copyright&copy; 2010 Model Metrics</div>--%>
		    <img src="images/powered_by2.png" />
		   <!-- <span onclick="hidePage();">Three sixty</span>
		   -->
		</div>
	</form>
	
</body>
</html>
