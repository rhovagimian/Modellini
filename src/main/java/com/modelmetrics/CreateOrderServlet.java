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
		List<String> parameterNames = Collections.list((Enumeration<String>)req.getParameterNames());
		for (String parameterName : parameterNames){
			System.out.println(parameterName + " = " + req.getParameter(parameterName));
		}

		List<String> attributeNames = Collections.list((Enumeration<String>)req.getAttributeNames());
		for (String attributeName : attributeNames){
			System.out.println(attributeName + " = " + req.getAttribute(attributeName));
		}
	}
}
