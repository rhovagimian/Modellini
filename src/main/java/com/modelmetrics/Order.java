package com.modelmetrics;

public class Order {
	
	private final static int MSRP = 360400;
	private final static int Option1Price = 3299;
	private final static int Option2Price = 4000;
	private final static int Option3Price = 400;
	
	private String _vehicleImage;
	private String _leatherType;
	private String _optionOne;
	private String _optionTwo;
	private String _optionThree;
	
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
	}
}
