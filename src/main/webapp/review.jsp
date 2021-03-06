<jsp:useBean id="configuration" class="com.modelmetrics.Configuration" scope="session" />
<jsp:useBean id="order" class="com.modelmetrics.Order" scope="request" />
<%@ page import="java.util.*" %>
<%@ page import="java.text.*" %>
<%
	List<String> requestParameterNames = Collections.list((Enumeration<String>)request.getParameterNames());
	
	for (String parameterName : requestParameterNames){
		String value = request.getParameter(parameterName);
		if(parameterName.equalsIgnoreCase("color")){
			order.setVehicleImage(value);
		} else if(parameterName.equalsIgnoreCase("optionOneIn")){
			order.setOptionOne(value);
		} else if(parameterName.equalsIgnoreCase("optionTwoIn")){
			order.setOptionTwo(value);
		} else if(parameterName.equalsIgnoreCase("optionThreeIn")){
			order.setOptionThree(value);
		} else if(parameterName.equalsIgnoreCase("leather")){
			order.setLeatherType(value);
		}
	}
	NumberFormat formatter = NumberFormat.getCurrencyInstance();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="apple-mobile-web-app-capable" content="yes" /> 
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <title>Order Review</title>

    <script type="text/javascript">
		<% if (configuration.getAccessToken() == null) { %>
			window.location.replace = "index.jsp";
		<% } %>
        var appName = 'REST Application';
        var loggedIn = false;
    </script>

    <style type="text/css">

	    body  {
	        background: -webkit-gradient(linear, left top, left bottom, color-stop(0.0, #fbf0db), color-stop(0.5, #fde9c2), color-stop(1.0, #ffdb96));
	        height: 1024px;
	        color: black;
	        margin: 0;
	        padding: 0;
	        font-family: Helvetica;
	    }
	    
	    .portrait { width: 768px; height: 960px; }
	    .landscape { width: 1024px; height: 700px; }
        .style1 {
            width: 127px;
            height: 68px;
        }
        .style2 {
            height: 68px;
        }
    </style>
	<link href="styles/mobile.css" type="text/css" rel="stylesheet" />
    
  	<script language="JavaScript" type="text/javascript" src="scripts/jquery-1.4.1.min.js"></script>
  	<script language="JavaScript" type="text/javascript" src="scripts/core/database.js"></script> 
  	<script language="JavaScript" type="text/javascript" src="scripts/core/datasource.js"></script> 
 	<script language="JavaScript" type="text/javascript" src="scripts/core/oauth.js"></script>
   	<script language="JavaScript" type="text/javascript" src="scripts/core/prototype.js"></script> 
  	<script language="JavaScript" type="text/javascript" src="scripts/mobile.js"></script>

</head>
<body>

    <form id="form1" >
    <div class="tableDiv">
        <%--<asp:Label ID="Label1" runat="server" Text=""></asp:Label>--%>
        <div class="topText">
            <span>Please review your vehicle:</span>
        </div>
        <br />
        
        <table style="width:100%;">
            <tr>
	            <td style="text-align: center;font-weight:bold;font-size:18px;">Color:</td>
            	<td colspan="2" style="text-align: center;font-weight:bold;font-size:18px;">Options:</td>
            </tr>
            
            <tr>
                <td rowspan="3" style="width:356px;">
                	<% if(order.getVehicleImage() != null && order.getVehicleImage().length() > 0) { %>
                		<img id="carImage" height="255" width="400" src="<%= order.getVehicleImage() %>" />
                	<% } %>
                </td>
                <td  style="width:127px;height:75px;">
                	<% if(order.getOptionOne() != null && order.getOptionOne().length() > 0) { %>
                		<img id="optionOneImage" height="50" width="127" src="<%= order.getOptionOne() %>" />
                	<% } %>
                </td>
                <td>
                	<% if(order.getOptionOne() != null && order.getOptionOne().length() > 0) { %>
	                	<div id="navigationPanel">
	                		<span class="labelHeader">Navigation System</span><br/>
	                		<span>$3,299</span>
	                	</div>
                	<% } %>
                </td>
            </tr>
            <tr>
                <td  style="width:127px;height:75px;">
                	<% if(order.getOptionTwo() != null && order.getOptionTwo().length() > 0) { %>
                		<img id="optionTwoImage" height="50" width="127" src="<%= order.getOptionTwo() %>" />
                	<% } %>
                </td>
                <td>
                	<% if(order.getOptionTwo() != null && order.getOptionTwo().length() > 0) { %>
	                	<div id="seatsPanel">
	                		<span class="labelHeader">Heated seats</span><br/>
	                		<span>$4,000</span>
	                	</div>
	                <% } %>
                </td>
            </tr>
            <tr>
                <td  style="width:127px;height:75px;">
                	<% if(order.getOptionThree() != null && order.getOptionThree().length() > 0) { %>
                		<img id="optionThreeImage" height="50" width="127" src="<%= order.getOptionThree() %>" />
                	<% } %>
                </td>
                <td>
                	<% if(order.getOptionThree() != null && order.getOptionThree().length() > 0) { %>
	                	<div id="usbPanel">
	                		<span class="labelHeader">iPod and USB connector</span><br/>
	                		<span>$400</span>
	                	</div>
	                <% } %>
                </td>
            </tr>
        </table>

        <div class="interiorClass">
            <div class="interiorTitle">
                <span>Interior:</span>
            </div>
            <div>
              	<% if(order.getLeatherType() != null && order.getLeatherType().length() > 0) { %>
             		<img id="leatherImage" height="106" width="166" src="<%= order.getLeatherType() %>" />
              	<% } %>
            </div>
        </div>

        <div>
            <br />
            <br />
            <br />
        </div>
        <table class="pricingClass">
            <tr>
                <td><span class="labelHeader2">MSRP:</span></td>
                <td><span id="msrpLabel"><%= formatter.format(com.modelmetrics.Order.MSRP) %></span></td>
            </tr>
            <% if(order.getOptionOne() != null && order.getOptionOne().length() > 0) { %>
            <tr>
                <td><span class="labelHeader2">Navigation system:</span></td>
                <td><span id="optionOnePrice"><%= formatter.format(com.modelmetrics.Order.Option1Price) %></span></td>
            </tr>
            <% } if(order.getOptionTwo() != null && order.getOptionTwo().length() > 0) { %>
            <tr>
                <td><span class="labelHeader2">Heated seats:</span></td>
                <td><span id="optionTwoPrice"><%= formatter.format(com.modelmetrics.Order.Option2Price) %></span></td>
            </tr>
            <% } if(order.getOptionThree() != null && order.getOptionThree().length() > 0) { %>
	            <tr>
	                <td><span class="labelHeader2">iPod and USB connector:</span></td>
	                <td><span id="optionThreePrice"><%= formatter.format(com.modelmetrics.Order.Option3Price) %></span></td>
	            </tr>
            <% } %>
            <tr style="border-top-style:solid;border-top-width:2px;border-top-color:Black;">
                <td><span class="labelHeader2">Total:</span></td>
                <td><span id="totalPriceLabel"><%= formatter.format(order.getTotal()) %></span></td>
            </tr>
        </table>
    </div>
    </form>
    <button id="saveBtn" onclick="createOrder();return false;" >Submit</button>
    <span class="signOverlay">Sign Here</span>
    <div class="authorizeText">
        <span>
            I authorize Modellini, Inc. to submit an order in my name for the vehicle I selected.
        </span>
    </div>

       <canvas id="thecanvas" width="685" height="200"></canvas>

       <script>
			function createOrder() {
				jQuery("#saveBtn").attr("disabled", "true");
				jQuery("#saveBtn").addClass("disabled");
				jQuery.post("createOrder", 
                	{ signature : salesRecord.signature, totalPrice: <%= order.getTotal() %>, 
            	   	  interior : <%= "\""+order.getInterior() + "\"" %>, 
            	   	  vehImg: <%= "\"" + order.getVehicleImage() + "\"" %>,
            	   	  options: <%= "\""+ order.getOptions() + "\"" %> }, 
            		function(data) {
            			jQuery("#saveBtn").removeAttr("disabled");
              			jQuery("#saveBtn").removeClass("disabled");
                  		if(data.indexOf("Exception") >= 0) {
							alert("An error occurred while processing your request, please try again.");
                        } else {
							window.location = "thankYou.jsp";
                        }
                  	}
               );
        	   return false;
			}
       </script>
       <div class="footer">
    <%--<div>Copyright&copy; 2010 Model Metrics</div>--%>
    <img src="images/powered_by2.png" />
   <!-- <span onclick="hidePage();">Three sixty</span>
   -->
</div>
</body>
</html>
