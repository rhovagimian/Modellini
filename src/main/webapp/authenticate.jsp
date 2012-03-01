<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head >
    <title>Authenticating...</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <script type="text/javascript" src="scripts/jquery.min.js"></script>
    <script type="text/javascript" src="scripts/core/oauth.js"></script>
</head>
<body>
	<form name="authenticate" action="configure.jsp" method="post">
		<input type="text" id="accessToken" style="display: none;" />
		<input type="text" id="accessUrl" style="display: none;" />
		<input type="submit" style="display: none;" />
	</form>
	<script>
		var decodedForm = OAuth.decodeForm(document.URL.substring(document.URL.indexOf('#') + 1, document.URL.length));
		var accessToken = OAuth.decodePercent(decodedForm[0][1]);
		var accessUrl = OAuth.decodePercent(decodedForm[1][1]);
		
		if (accessToken != null && accessToken.length > 10) {
			$("#accessToken").val(accessToken);
			$("#accessUrl").val(accessUrl);
			document.authenticate.submit();
		} else {
			window.location.replace("index.jsp");
		}
	</script>
</body>
</html>
