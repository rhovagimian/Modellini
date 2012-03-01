package com.modelmetrics;

import java.io.IOException;
import java.util.Enumeration;
import java.util.Collections;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CreateOrderServlet extends HttpServlet {

	private static final long serialVersionUID = -7130469657428131968L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		List<String> attributeNames = Collections.list((Enumeration<String>)req.getSession().getAttributeNames());
		for (String attributeName : attributeNames){
			System.out.println(attributeName + " = " + req.getSession().getAttribute(attributeName));
		}
		
		List<String> parameterNames = Collections.list((Enumeration<String>)req.getParameterNames());
		for (String parameterName : parameterNames){
			System.out.println(parameterName + " = " + req.getParameter(parameterName));
		}

		/*if (!String.IsNullOrEmpty(ConnectionSettings.AccessToken) && ConnectionSettings.AccessToken.Length > 10)
        {
            WebRequest request = createRequest(ConfigurationSettings.AppSettings["endpoint"] + "sobjects/Sales_Record__c", "POST");

            string JSONText = " {  \"Interior__c\" : \"" + interiorSelected + "\", \"Total_Price__c\" : " + Decimal.Parse(price) + ", \"ImageLink__c\" : \"" + imageLink +"\", \"Options__c\" : \"" + opts + "\" } ";
            //string JSONText = " {  \"Interior__c\" : \"" + interiorSelected + "\", \"Total_Price__c\" : \"" + Decimal.Parse(price) + "\", \"Options__c\" : \"" + opts + "\" } ";

            //string JSONText = " {  \"Interior__c\" : \"" + interiorSelected + "\" } ";
            



            WebResponse response = attachData(request, JSONText).GetResponse();

            resp = readResponse(response);
            //resp = JSONText;
        }
		string resp = "";

        if (!String.IsNullOrEmpty(ConnectionSettings.AccessToken) && ConnectionSettings.AccessToken.Length > 10)
        {
            WebRequest request = createRequest(ConfigurationSettings.AppSettings["endpoint"] + "sobjects/Attachment", "POST");//WebRequest.Create("https://prerelna1.pre.salesforce.com/services/data/v20.0/sobjects/Attachment");

            string JSONText = " {  \"Body\" : \"" + sigBlob + "\", \"ParentId\" : \"" + orderID + "\", \"Name\" : \"Signature.png\", \"ContentType\" : \"image/png\" } ";

            WebResponse response = attachData(request, JSONText).GetResponse();

            resp = readResponse(response);
        }

        return resp;*/
	}
}
