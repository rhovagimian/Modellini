<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html manifest="cache.manifest" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Modellini System Access</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="apple-mobile-web-app-capable" content="yes" /> 
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="stylesheet" type="text/css" href="styles/styles.css" />
    <link rel="apple-touch-icon" href="apple-touch-icon.png" />
    <style type="text/css">
	    body {
	        background: -webkit-gradient(linear, left top, left bottom, color-stop(0.0, #fbf0db), color-stop(0.5, #fde9c2), color-stop(1.0, #ffdb96));
	        height: 1024px;
	        color: white;
	        margin: 0;
	        padding: 0;
	        font-family: Helvetica;
	    }
	    
	    .portrait { width: 768px; height: 960px; }
	    .landscape { width: 1024px; height: 700px; }
    </style>
</head>
<body>
    <form method="post" action="login">
	    <div>
	        <div id="backgroundImgDiv" class="backgroundImgDiv">
	            <img id="bgImg" class="backgroundImg" src="images/mask.png" />
	        </div>
	        <div id="logoDiv" class="logo">
	            <img src="images/modellini-logo.png" />
	        </div>
	        <div id="bottomDiv" class="bottomDiv">
	            <div id="descriptionDiv" class="descriptionDiv">
	                <span>Press the button below to continue.</span>
	            </div>
	            <input type="submit" class="loginButton" id="loginButton" value="Log In" />
	        </div>
	    </div>
    </form>
    <div id="footer" class="footer">
    <%--<div>Copyright&copy; 2010 Model Metrics</div> />--%>
    <img src="images/powered_by2.png" />
</div>
    <script type="text/javascript">

        setTimeout("setOpacity()", 1200);

        function setOpacity() {
        	var elements = ["backgroundImgDiv", "logoDiv", "bottomDiv", "footer"];
        	for (var i=0; i < elements.length; i++) {
        		var element = document.getElementById(elements[i]);
        		element.style.opacity = "1";
        	}
        }

        function redirect() {
            window.location = "../vehicle_selection.htm";
        }
    </script>
</body>
</html>
