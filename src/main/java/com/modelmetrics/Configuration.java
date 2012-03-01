package com.modelmetrics;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.json.simple.parser.JSONParser;

public class Configuration {

	private String _accessToken;
	private String _accessUrl;
	private String _orgId;
	
	private String _vehicleImage;
	private String _leatherType;
	private String _optionOne;
	private String _optionTwo;
	private String _optionThree;
	private ArrayList<String> _images;
	
	
	public Configuration() {
		reset();
	}
	
	public String getVehicleImage() {
		return _vehicleImage;
	}
	
	public void setVehicleImage(String vehicleImage) {
		_vehicleImage = vehicleImage;
	}
	
	public String getLeatherType() {
		return _leatherType;
	}
	
	public void setLeatherType(String leatherType) {
		_leatherType = leatherType;
	}
	
	public String getOptionOne() {
		return _optionOne;
	}
	
	public void setOptionOne(String optionOne) {
		_optionOne = optionOne;
	}
	
	public String getOptionTwo() {
		return _optionTwo;
	}
	
	public void setOptionTwo(String optionTwo) {
		_optionTwo = optionTwo;
	}
	
	public String getOptionThree() {
		return _optionThree;
	}
	
	public void setOptionThree(String optionThree) {
		_optionThree = optionThree;
	}
	
	public ArrayList<String> getImages() {
		if(_images.isEmpty() && _accessToken != null && _accessUrl != null) {
			
		}
		return _images;
	}

	public void setAccessToken(String value, String url) {
		_accessToken = value;
		_accessUrl = url;
	}
	
	public String getOrgId() {
		return _orgId;
	}
	
	public void setOrgId(String endpoint) {
		try {
	        String queryString = "select Id from Organization limit 1";
	        String jsonResponse = getUrlResponse(endpoint + "query/?q=" + java.net.URLEncoder.encode(queryString, "ISO-8859-1"));
	        //_orgId = jsonResponse;
	        Map<Object, Object> json = (Map<Object, Object>)new JSONParser().parse(jsonResponse);
	        System.out.println(json);
	        if(json.containsKey("totalSize")) {
	        	Long size = (Long)json.get("totalSize");
	        	System.out.println(size);
	        	if(size != null && size > 0) {
	        		ArrayList<Object> records = (ArrayList<Object>)json.get("records");
	        		System.out.println(records);
	        		Map<Object, Object> record = (Map<Object, Object>)records.get(0);
	        		System.out.println(record);
	        		_orgId = record.get("Id").toString();
	        	}
	        }
		} catch(Exception ex) {
			_orgId = ex.getMessage();
		}
	}
	
	public void reset() {
		_images = new ArrayList<String>();
		_accessToken = null;
		_accessUrl = null;
		_orgId = null;
		_vehicleImage = null;
		_leatherType = null;
		_optionOne = null;
		_optionTwo = null;
		_optionThree = null;
	}
	
	private String getUrlResponse(String url) throws Exception {
		return getUrlResponse(url, "GET");
	}
	
	private String getUrlResponse(String url, String method) throws Exception {
        HttpURLConnection connection = (HttpURLConnection)new URL(url).openConnection();
        connection.setRequestMethod(method);
        connection.addRequestProperty("Authorization","OAuth " + _accessToken);
        connection.addRequestProperty("X-PrettyPrint", "1");
        connection.connect();
        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String inputLine;
        String data = "";
        while ((inputLine = in.readLine()) != null) {
        	data += inputLine;
        }

        in.close();
        connection.disconnect();
        return data;
	}
}