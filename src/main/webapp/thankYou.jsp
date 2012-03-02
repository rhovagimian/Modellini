
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="apple-mobile-web-app-capable" content="yes" /> 
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <title>Thank you</title>
    <link rel="stylesheet" type="text/css" href="styles/styles.css" />
    <style type="text/css">

    body
    {
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0.0, #fbf0db), color-stop(0.5, #fde9c2), color-stop(1.0, #ffdb96));
        height: 1024px;
        color: black;
        margin: 0;
        padding: 0;
        font-family: Helvetica;
    }
    
    .thankYouText
    {
        text-align: center;
        font-size: 25px;
        font-weight: bold;
        position: absolute;
        top: 40%;
        width: 100%;
    }
    
    .thankYouText span
    {
    }
    
    .portrait { width: 768px; height: 960px; }
    .landscape { width: 1024px; height: 700px; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <div id="backgroundImgDiv" class="backgroundImgDiv">
            <img id="bgImg" class="backgroundImg" src="images/mask.png" />
        </div>
        <div id="logoDiv" class="logo">
            <img src="images/modellini-logo.png" />
        </div>
        <div id="bottomDiv" class="bottomDiv">
            <div id="descriptionDiv" class="descriptionDiv">
                <div class="thankYouText">
    <span>
        Thank you for your business.
    </span>
    <br />
    <span>
        You will be contacted within 48 hours.
    </span>
    <br /><br />
    <span>
        You can now return this iPad to the sales representative.
    </span>
    </div>
            </div>
        </div>
        
    </div>
    

    <div id="footer" class="footer">
    <%--<div>Copyright&copy; 2010 Model Metrics</div>--%>
    <img src="images/powered_by2.png" />
</div>
    </form>
    <script type="text/javascript">

        setTimeout("setOpacity()", 1200);

        function setOpacity() {
            var el = document.getElementById("backgroundImgDiv");
            el.style.opacity = "1";

            el = document.getElementById("logoDiv");
            el.style.opacity = "1";

            el = document.getElementById("bottomDiv");
            el.style.opacity = "1";

            el = document.getElementById("footer");
            el.style.opacity = "1";
        }


        
    </script>
</body>
</html>
