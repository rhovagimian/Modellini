// SpryCalendar.js - version 1.0 (Based on Spry Pre-Release 1.6)
//
// Copyright (c) 2007. Ronald Ferguson.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Ronald Ferguson or Adobe Systems Incorporated nor the names
//     of its contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry;
if (!Spry) Spry = {};
if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.Calendar = function(element, opts)
{
	var defaultDate = new Date();
	
	this.element = this.getElement(element);
	this.month = defaultDate.getMonth();
	this.year = defaultDate.getFullYear();
	this.day = 1;
	this.calendarMonths = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
	this.enableKeyboardNavigation = true;
	this.hasFocus = null;
	this.numDays = null;
	this.headerRowId = null;
	this.selectedDate = null;
	this.selectedElement = null;
	this.focusedCell = null;
	this.callbackFunction = null;
	
	// Navigation key codes
	this.previousDayKeyCode = Spry.Widget.Calendar.KEY_LEFT;
	this.nextDayKeyCode = Spry.Widget.Calendar.KEY_RIGHT;
	this.spaceKeyCode = Spry.Widget.Calendar.KEY_SPACE;
	
	// CSS
	this.calendarClass = "Calendar";
	this.foreignDayClass = "CalendarForeignDay";
	this.monthHeaderClass = "CalendarMonthHeader";
	this.navOverClass = "CalendarNavOver";
	this.dayHeaderClass = "CalendarDayHeader";
	this.dayClass = "CalendarDayCell";
	this.dayOverClass = "CalendarDayCellOver";
	this.todayClass = "CalendarTodayCell";
	this.selectedClass = "CalendarSelectedCell";
	this.focusedClass = "CalendarFocused";
	this.focusedCellClass = "CalendarFocusedDay";
	
	this.setOptions(this, opts, true);
	
	this.init();
}

Spry.Widget.Calendar.KEY_LEFT = 37;
Spry.Widget.Calendar.KEY_RIGHT = 39;
Spry.Widget.Calendar.KEY_SPACE = 32;

Spry.Widget.Calendar.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
};

Spry.Widget.Calendar.prototype.addClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Widget.Calendar.prototype.removeClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

Spry.Widget.Calendar.prototype.hasClassName = function(ele, className)
{
	if (!ele || !className || !ele.className || ele.className.search(new RegExp("\\b" + className + "\\b")) == -1)
		return false;
	return true;
};

Spry.Widget.Calendar.prototype.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;
	for (var optionName in optionsObj)
	{
		if(optionName == "hasFocus" || optionName == "numDays" || optionName == "selectedElement" || optionName == "element" || optionName == "focusedCell")
			continue;
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Spry.Widget.Calendar.prototype.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler);
	}
	catch (err) {}
};

Spry.Widget.Calendar.prototype.removeEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.removeEventListener)
			element.removeEventListener(eventType, handler, capture);
		else if (element.detachEvent)
			element.detachEvent("on" + eventType, handler);
	}
	catch (err) {}
};

Spry.Widget.Calendar.prototype.attachBehaviors = function()
{
	this.addClassName(this.element, this.calendarClass)
	var navigators = this.getNavigators();
	var cells = this.getDayCells();
	// Add the event listeners for the monthly navigation.
	for(var i = 0; i < navigators.length; i++)
	{
		this.addNavigationListener(navigators[i]);
	}
	// Add the event listeners for the day cells.
	for(var i = 0; i < cells.length; i++)
	{
		this.addDateListener(cells[i]);
	}
	if (this.enableKeyboardNavigation) {
		var self = this;
		this.addEventListener(this.element, "focus", function(e) { return self.onFocus(e); }, false);
		this.addEventListener(this.element, "blur", function(e) { return self.onBlur(e); }, false);
		this.addEventListener(this.element, "keydown", function(e) { return self.onKeyDown(e); }, false);
	}
	
};

Spry.Widget.Calendar.prototype.focus = function()
{
	if (this.element && this.element.focus)
		this.element.focus();
};

Spry.Widget.Calendar.prototype.blur = function()
{
	if (this.element && this.element.blur)
		this.element.blur();
};

Spry.Widget.Calendar.prototype.onFocus = function(e)
{
	this.hasFocus = true;
	this.focus();
	this.addClassName(this.element, this.focusedClass);
	return false;
};

Spry.Widget.Calendar.prototype.onBlur = function(e)
{
	this.hasFocus = false;
	this.blur();
	this.removeClassName(this.element, this.focusedClass);
	return false;
};

Spry.Widget.Calendar.prototype.init = function()
{
	this.setCalendarDate(this.year, this.month);
	if(this.callbackFunction && typeof(this.callbackFunction) != 'function')
		this.callbackFunction = null;
	this.attachBehaviors();	
}

Spry.Widget.Calendar.prototype.getDayCells = function()
{
	var tds = this.element.getElementsByTagName("td");
	var cells = new Array();
	for(var i = 0; i < tds.length; i++)
	{
		if (!this.hasClassName(tds[i], this.dayClass)) continue;
		cells.push(tds[i]);
	}
	return cells;
}

Spry.Widget.Calendar.prototype.setCalendarDate = function(yr, mo, day)
{	
	var tmpDate = new Date();
	
	if(yr == undefined)
		yr = tmpDate.getFullYear();
	if(mo == undefined || mo < 0 || mo > 11)
		mo = tmpDate.getMonth();
	
		
	tmpDate.setDate(1);
	tmpDate.setUTCMonth(mo);
	tmpDate.setUTCFullYear(yr);
	
	this.numDays = tmpDate.getDaysInMonth();
	this.month = tmpDate.getUTCMonth();
	this.year = tmpDate.getUTCFullYear();
	if(day) { this.day = day; }
	this.populate();
	tmpDate = null;
	this.removeClassName(this.getFocusedElement(), this.focusedCellClass);
	this.focusedCell = null;
}

Spry.Widget.Calendar.prototype.populate = function()
{
	// Set the month/year text in the title row
	var titleRow = this.getHeaderRow();
	var titleCell = titleRow[1].innerHTML = (this.calendarMonths[this.month] + " " + this.year);
	
	// Get the cells used to hold the dates
	var cells = this.getDayCells();
	var filled = 0;
	var tmpDate = new Date(this.year,this.month,this.day);
	var today = new Date();
	
	// If the first day of the month does not fall on Sunday, we need to add the foreign day class to the first cells.
	if(tmpDate.getUTCDay() != 0)
	{
		for(var i = 0; i < tmpDate.getUTCDay(); i++)
		{
			var ele = this.getElement(cells[i].id);
			this.addClassName(ele, this.foreignDayClass);
			// Remove all class names (except the default).
			this.removeClassName(ele, this.todayClass);
			this.removeClassName(ele, this.selectedClass);
			this.removeClassName(ele, this.focusedCellClass);
			ele.innerHTML = '&nbsp;';
			filled++;
		}
	}
	// Set the date text for each cell in the month.
	for(var i = 0; i < this.numDays; i++)
	{
		var idx = i+1;
		var el = cells[filled];
		if(el.parentNode.style.display == 'none') el.parentNode.style.display = '';
		el.innerHTML = idx;
		// Remove the foreign day class if it exists for the cell.
		this.removeClassName(el, this.foreignDayClass);
		
		// Highlight today's date
		if(today.getFullYear() == tmpDate.getUTCFullYear() && today.getMonth() == tmpDate.getUTCMonth() && today.getDate() == idx) {
			this.addClassName(el, this.todayClass);
		} else {
			this.removeClassName(el, this.todayClass);
		}
		if(this.selectedDate && (this.selectedDate.getUTCFullYear() == tmpDate.getUTCFullYear() && this.selectedDate.getUTCMonth() == tmpDate.getUTCMonth() && idx == this.selectedDate.getUTCDate())){
			this.addClassName(el, this.selectedClass);
			// Since it's possible to pre-populate the selected date, we may not have a selected element so we'll need to
			// set it so the class can be cleared if need be.
			if(!this.selectedElement)
				this.selectedElement = el;
		} else {
			this.removeClassName(el, this.selectedClass);
		}
		tmpDate.setUTCDate(idx);
		filled++;
	}
	var lastDayCell = (filled-1);
	
	// Reset our tmpDate to the last day of the currently loaded month/year.
	tmpDate.setUTCMonth(this.month);
	tmpDate.setUTCDate(this.numDays);
	tmpDate.setUTCFullYear(this.year);
	
	// Do we need to add foreign day class to any remaining cells?
	while(filled < cells.length){
		var ele = this.getElement(cells[filled].id);
		this.addClassName(ele, this.foreignDayClass);
		// Remove all class names (except the default).
		this.removeClassName(ele, this.todayClass);
		this.removeClassName(ele, this.selectedClass);
		this.removeClassName(ele, this.focusedCellClass);
		ele.innerHTML = '&nbsp;';
		filled++;
	}
	
	// Get the tr tag of the last table cell tag that we filled.
	var e = cells[lastDayCell].parentNode.nextSibling.nextSibling;
	
	// Do we need to hide the last table row(s)? We want to do this only if no day cells are being used.
	// Use DOM functions to get the last table row tag.
	var tRows = this.element.getElementsByTagName("tr");
	idx = null;
	for(var i = 0; i < tRows.length; i++)
	{
		if(!e || e && e.id != tRows[i].id && idx == null) continue;
		tRows[i].style.display = 'none';
		idx = i;
	}
}

Spry.Widget.Calendar.prototype.getNavigators = function()
{
	// Set the month/year text in the title row
	var titleRow = this.getHeaderRow();
	var navigators = new Array();
	for(var i = 0; i < titleRow.length; i++)
	{
		// The navigators should be the first and last cells of the header row, so skip the one with the month/year text.
		if(i == 1) continue;
		navigators.push(titleRow[i]);
	}
	return navigators;
}

Spry.Widget.Calendar.prototype.addDateListener = function(ele)
{
	var self = this;
	this.addEventListener(ele, 'mouseover', function(e) { return self.onDateMouseOver(e, ele); }, false);
	this.addEventListener(ele, 'mouseout', function(e) { return self.onDateMouseOut(e, ele); }, false);
	this.addEventListener(ele, 'click', function(e) { return self.onDateClick(e, ele); }, false);
}

Spry.Widget.Calendar.prototype.onDateMouseOver = function(evt, ele)
{
	if(this.hasClassName(ele, this.foreignDayClass))
		return true;
	this.addClassName(ele, this.dayOverClass);
	return false;
}

Spry.Widget.Calendar.prototype.onDateMouseOut = function(evt, ele)
{
	if(this.hasClassName(ele, this.foreignDayClass))
		return true;
	this.removeClassName(ele, this.dayOverClass);
	return false;
}

Spry.Widget.Calendar.prototype.onDateClick = function(evt, ele)
{	
	if (evt.preventDefault) evt.preventDefault();
	else evt.returnValue = false;
	if (evt.stopPropagation) evt.stopPropagation();
	else evt.cancelBubble = true;
	
	if(this.hasClassName(ele, this.foreignDayClass))
		return true;
	var tmpDate = new Date(this.year, this.month, parseInt(ele.innerHTML));
	// If this date is already selected, do nothing.
	if(this.selectedDate && (this.selectedDate.valueOf() == tmpDate.valueOf()))
		return true;
	this.removeClassName(this.focusedCell, this.focusedCellClass);
	this.removeClassName(this.selectedElement, this.selectedClass);
	
	this.focusedCell = ele;
	
	this.addClassName(ele, this.focusedCellClass);
	this.addClassName(ele, this.selectedClass);
	
	this.setSelectedDate(tmpDate);
	this.selectedElement = ele;
	
	if(this.callbackFunction){
		this.callbackFunction(this.selectedDate);
	}
	
	return false;
}

Spry.Widget.Calendar.prototype.addNavigationListener = function(ele)
{
	var self = this;
	this.addEventListener(ele, "mouseover", function(e) { return self.onNavMouseOver(e, ele); }, false);
	this.addEventListener(ele, "mouseout", function(e) { return self.onNavMouseOut(e, ele); }, false);
	this.addEventListener(ele, "click", function(e) { return self.onNavClick(e, ele); }, false);
	if (this.enablekeyboardnavigation) {
		
	}
}

Spry.Widget.Calendar.prototype.onNavMouseOver = function(evt, ele)
{
	this.addClassName(ele, this.navOverClass);
	return false;
}

Spry.Widget.Calendar.prototype.onNavMouseOut = function(evt, ele)
{
	this.removeClassName(ele, this.navOverClass);
	return false;
}

Spry.Widget.Calendar.prototype.onNavClick = function(evt, ele)
{
	if (evt.preventDefault) evt.preventDefault();
	else evt.returnValue = false;
	if (evt.stopPropagation) evt.stopPropagation();
	else evt.cancelBubble = true;
	
	var navigators = this.getNavigators();
	var tmpDate = new Date(this.year, this.month, 1);
	for(var i = 0; i < navigators.length; i++)
	{
		if(ele == navigators[i]){
			switch(i)
			{
				case 1:
					tmpDate.setUTCMonth((this.month+1));
					break;
				default:
					tmpDate.setUTCMonth((this.month-1));
					break;
			}
			break;
		}
	}
	
	this.removeClassName(this.focusedCell, this.focusedCellClass);
	this.setCalendarDate(tmpDate.getUTCFullYear(), tmpDate.getUTCMonth());
	
	return false;
}

Spry.Widget.Calendar.prototype.onKeyDown = function(e)
{
	if(!this.hasFocus || !this.enableKeyboardNavigation)
		return true;
		
	var key = e.keyCode;
	var cells = this.getDayCells();
	
	if(key == this.previousDayKeyCode){
		var keyString = "Previous day";
		if (!this.focusedCell) {
			for(var i = 0; i < cells.length; i++)
			{
				if(this.hasClassName(cells[i], this.foreignDayClass)) {
					continue;
				}
				this.focusedCell = cells[i];
				break;
			}
		} else {
			this.removeClassName(this.focusedCell, this.focusedCellClass);
			if(parseInt(this.focusedCell.innerHTML) == 1) {
				var mo = this.month == 0 ? 11 : (this.month-1);
				var yr = mo == 11 ? (this.year-1) : this.year;
				this.setCalendarDate(yr, mo);
				for(var i = (cells.length-1); i > 0; i--)
				{
					if(cells[i].innerHTML != this.numDays.toString()){
						continue;
					}
					this.focusedCell = cells[i];
					break;
				}
			} else if(parseInt(this.focusedCell.innerHTML) == this.numDays) {
				for(var i = (cells.length-1); i > 0; i-- ) {
					if(this.hasClassName(cells[i], this.foreignDayClass)){
						continue;
					}
					if(this.focusedCell == cells[i]){
						this.focusedCell = cells[(i-1)];
						break;
					}
				}
			}else{
				for(var i = (cells.length-1); i > 0; i--)
				{
					if (this.hasClassName(cells[i], this.foreignDayClass)) {
						continue;
					}
					if (this.focusedCell == cells[i]) {
						this.focusedCell = cells[(i-1)];
						break;
					}
				}
			}
			
		
		}
	}else if(key == this.nextDayKeyCode){
		var keyString = "Next day";
		if (!this.focusedCell) {
			for(var i = 0; i < cells.length; i++)
			{
				if(this.hasClassName(cells[i], this.foreignDayClass)) {
					continue;
				}
				this.focusedCell = cells[i];
				break;
			}
		} else {
			this.removeClassName(this.focusedCell, this.focusedCellClass);
			for(var i = 0; i < cells.length; i++)
			{
				if (cells[(i-1)] == this.focusedCell) {
					if(parseInt(this.focusedCell.innerHTML) == this.numDays) {
						var mo = this.month == 11 ? 0 : (this.month+1);
						var yr = mo == 0 ? (this.year+1) : this.year;
						this.setCalendarDate(yr, mo);
						i = 0;
						while(this.hasClassName(cells[i], this.foreignDayClass))
						{
							i++;
						}
						this.focusedCell = cells[i];
						break;
					}
					this.focusedCell = cells[i];
					break;
				}
			}
		}
	}else if(key == this.spaceKeyCode){
		if(this.focusedCell) {
			var tmpDate = new Date(this.year, this.month, parseInt(this.focusedCell.innerHTML));
			if(this.selectedElement){
				this.clearSelection();
			}
			var ele = this.getElement(this.focusedCell);
			this.addClassName(ele, this.selectedClass);
			this.setSelectedDate(tmpDate);
			this.selectedElement = ele;
			if(this.callbackFunction){
				this.callbackFunction(this.selectedDate);
			}
			return false;
		} else {
			return true;
		}
	}else{
		return true;
	}
	this.addClassName(this.focusedCell, this.focusedCellClass);
	return false;
}

Spry.Widget.Calendar.prototype.clearSelection = function()
{
	this.removeClassName(this.selectedElement, this.selectedClass);
	this.selectedDate = null;
	this.selectedElement = null;
	
}

Spry.Widget.Calendar.prototype.setSelectedDate = function(val)
{
	if(this.selectedDate && this.selectedDate == val)
		return;
		
	if(typeof(val) == 'string'){
		this.selectedDate = new Date(val);
	} else {
		this.selectedDate = val;
	}
}

Spry.Widget.Calendar.prototype.getSelectedDate = function()
{
	return this.selectedDate;
}

Spry.Widget.Calendar.prototype.getSelectedElement = function()
{
	return this.selectedElement;
}

Spry.Widget.Calendar.prototype.getFocusedElement = function()
{
	return this.focusedCell;
}

Spry.Widget.Calendar.prototype.getHeaderRow = function()
{
	if(!this.headerRowId){
		var headerRow = this.element.getElementsByTagName("tr")[0].getElementsByTagName("td");
	} else {
		var headerRow = document.getElementById(this.headerRowId).getElementsByTagName("td");
	}
	return headerRow;
}

// Helper function to count the number of days in a given month since Javascript doesn't have
// this functionality natively.
Date.prototype.getDaysInMonth = function()
{
	var curMonth = this.getUTCMonth();
	var tmpDate = new Date(this.getUTCFullYear(), this.getUTCMonth(), 1);
	var count = 0;
	do
	{
		tmpDate.setUTCDate((tmpDate.getUTCDate()+1));
		count++;
	}while(tmpDate.getUTCMonth() == curMonth); 
	return count--;
}


Date.prototype.setISO8601 = function(dString){
var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;
if (dString.toString().match(new RegExp(regexp))) {
var d = dString.match(new RegExp(regexp));
var offset = 0;
this.setUTCDate(1);
this.setUTCFullYear(parseInt(d[1],10));
this.setUTCMonth(parseInt(d[3],10) - 1);
this.setUTCDate(parseInt(d[5],10));
this.setUTCHours(parseInt(d[7],10));
this.setUTCMinutes(parseInt(d[9],10));
this.setUTCSeconds(parseInt(d[11],10));
if (d[12])
this.setUTCMilliseconds(parseFloat(d[12]) * 1000);
else
this.setUTCMilliseconds(0);
if (d[13] != 'Z') {
offset = (d[15] * 60) + parseInt(d[17],10);
offset *= ((d[14] == '-') ? -1 : 1);
this.setTime(this.getTime() - offset * 60 * 1000);
}
}
else {
this.setTime(Date.parse(dString));
}
return this;
};
