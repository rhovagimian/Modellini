package com.modelmetrics;

public class Order {
	
	public final static int MSRP = 360400;
	public final static int Option1Price = 3299;
	public final static int Option2Price = 4000;
	public final static int Option3Price = 400;
	
	private String _vehicleImage;
	private String _leatherType;
	private String _optionOne;
	private String _optionTwo;
	private String _optionThree;
	private int _totalPrice = -1;
	private String _options = null;
	private String _interior = null;
	
	public Order() {
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
	
	public void reset() {
		_vehicleImage = null;
		_leatherType = null;
		_optionOne = null;
		_optionTwo = null;
		_optionThree = null;
		_totalPrice = -1;
		_options = null;
		_interior = null;
	}
	
	public int getTotal() {
		if (_totalPrice < 0) {
			_totalPrice = Order.MSRP;
			String[] options = {_optionOne, _optionTwo, _optionThree};
			int[] price = {Option1Price, Option2Price, Option3Price};
			for(int i=0; i < options.length; i++) {
				if(options[i] != null && options[i].length() > 0) {
					_totalPrice += price[i];
				}
			}
		}
		return _totalPrice;
	}
	
	public String getOptions() {
		if (_options == null) {
			String[] options = {_optionOne, _optionTwo, _optionThree};
			String[] optionNames = {"Navigation system", "Heated seats", "iPod connector"};
			_options = "";
			for(int i=0; i < options.length; i++) {
				if(options[i] != null && options[i].length() > 0) {
					_options += optionNames[i] + ";";
				}
			}
			if(_options.length() > 1) {
				_options = _options.substring(0, _options.length() - 1);
			}
		}
		return _options;
	}
	
	public String getInterior() {
		if (_leatherType == null) {
			_interior = "";
		}
		if (_leatherType.contains("leather")) {
            _interior = "Leather";
        } else if (_leatherType.contains("suede")) {
        	_interior = "Suede";
        } else if (_leatherType.contains("crocodile")) {
        	_interior = "Crocodile";
        } else if (_leatherType.contains("lv")) {
        	_interior = "Luxury";
        }
		
		return _interior;
	}
}
