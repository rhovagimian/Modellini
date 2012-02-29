package com.modelmetrics;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class LoginServlet extends HttpServlet {

	private static final long serialVersionUID = 4069396363157702660L;

	@Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	String clientID = req.getServletContext().getInitParameter("clientID");
    	String redirectUrl = resp.encodeURL(req.getServletContext().getInitParameter("callbackURL"));
    	String sfUrl = req.getServletContext().getInitParameter("loginEndpoint") + "?response_type=token&client_id=" +
    	clientID + "&redirect_uri=" + redirectUrl + "&display=touch";
    	
    	resp.sendRedirect(sfUrl);
    }

}