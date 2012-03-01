package com.modelmetrics;

import java.util.ArrayList;

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
		_images = new ArrayList<String>();
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
        //_orgId = getOrgId();
	}
	
	public void setOrgId(String endpoint) {
		
        /*if (_accessToken != null && _accessToken.length() > 10)
        {
        	String queryString = "select Id from Organization limit 1";
            String queryStringEncoded = HttpUtility.UrlEncode(queryString);

            WebRequest request = createRequest(ConfigurationSettings.AppSettings["endpoint"] + "query/?q=" + queryStringEncoded, "GET"); //WebRequest.Create("https://prerelna1.pre.salesforce.com/services/data/v20.0/query/?q=" + queryStringEncoded);

            WebResponse response = request.GetResponse();

            resp = readResponse(response);
        }

        if (resp != "")
        {
            Hashtable oooo = (Hashtable)App_Code.JSON.JsonDecode(resp);
            if (oooo["totalSize"] != null)
            {
                double t = (double)oooo["totalSize"];
                if (t > 0)
                {
                    ArrayList al = (ArrayList)oooo["records"];

                    HttpContext.Current.Session["orgID"] = ((Hashtable)(al[0]))["Id"];
                }
            }
        }
		return "";*/
		_orgId = "";
	}
}