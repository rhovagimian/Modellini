/*
    Copyright (C) 2008, 2009 Charles Ying. All Rights Reserved.
    
    This distribution is released under the BSD license.

    http://css-vfx.googlecode.com/
    
    See the README for documentation and license.
*/

(function () {  // Module pattern

var global = this;

/*
    Utilities (avoid jQuery dependencies)
*/

function utils_extend(obj, dict)
{
    for (var key in dict)
    {
        obj[key] = dict[key];
    }
}

function utils_setsize(elem, w, h)
{
    elem.style.width = w.toString() + "px";
    elem.style.height = h.toString() + "px";
}

function utils_setxy(elem, x, y)
{
    elem.style.left = Math.round(x).toString() + "px";
    elem.style.top = Math.round(y).toString() + "px";
}

/*
    TrayController is a horizontal touch event controller that tracks cumulative offsets and passes events to a delegate. 
*/

TrayController = function ()
{
    return this;
}

TrayController.prototype.init = function (elem)
{
    this.currentX = 0;
    this.elem = elem;
}

TrayController.prototype.touchstart = function (event)
{
    this.startX = event.touches[0].pageX - this.currentX;
    this.touchMoved = false;

    window.addEventListener("touchmove", this, true);
    window.addEventListener("touchend", this, true);

    this.elem.style.webkitTransitionDuration = "0s";
}

TrayController.prototype.touchmove = function (e)
{
    this.touchMoved = true;
    this.lastX = this.currentX;
    this.lastMoveTime = new Date();
    this.currentX = event.touches[0].pageX - this.startX;
    this.delegate.update(this.currentX);
}

TrayController.prototype.touchend = function (e)
{
    window.removeEventListener("touchmove", this, true);
    window.removeEventListener("touchend", this, true);

    this.elem.style.webkitTransitionDuration = "0.4s";

    if (this.touchMoved)
    {
        /* Approximate some inertia -- the transition function takes care of the decay over 0.4s for us, but we need to amplify the last movement */
        var delta = this.currentX - this.lastX;
        var dt = (new Date()) - this.lastMoveTime + 1;
        /* dx * 400 / dt */

        this.currentX = this.currentX + delta * 200 / dt;
        this.delegate.updateTouchEnd(this);
    }
    else
    {
        this.delegate.clicked(this.currentX);
    }
}

TrayController.prototype.handleEvent = function (event)
{
    this[event.type](event);
    event.preventDefault();
}

/*
    These variables define how the zflow presentation is made.
*/

//const CSIZE = 150;
const CSIZE = 300;
const CGAP = CSIZE / 2;

//const FLOW_ANGLE = 70;
const FLOW_ANGLE = 0;
const FLOW_THRESHOLD = CGAP / 2;
//const FLOW_ZFOCUS = CSIZE;
const FLOW_ZFOCUS = 100;
const FLOW_XGAP = CSIZE / 3;

const T_NEG_ANGLE = "rotateY(" + (- FLOW_ANGLE) + "deg)";
const T_ANGLE = "rotateY(" + FLOW_ANGLE + "deg)";
const T_ZFOCUS = "translate3d(0, 0, " + FLOW_ZFOCUS + "px)";

FlowDelegate = function ()
{
    this.cells = new Array();
    this.transforms = new Array();
}

FlowDelegate.prototype.init = function (elem)
{
    this.elem = elem;
}

FlowDelegate.prototype.updateTouchEnd = function (controller)
{
    this.lastFocus = undefined;

    // Snap to nearest position
    var i = this.getFocusedCell(controller.currentX);

    controller.currentX = - i * CGAP;
    this.update(controller.currentX);
}

FlowDelegate.prototype.clicked = function (currentX)
{
    var i = - Math.round(currentX / CGAP);
    var cell = this.cells[i];

    var transform = this.transformForCell(cell, i, currentX);
    //////cell.childNodes[3].style.webkitTransform = "translate3d(0px, 0, 0px)";


    var c = cell.childNodes[2].checked;

        for (var i in this.cells)
        {
           this.cells[i].childNodes[2].checked = false;
           this.cells[i].childNodes[3].style.opacity = "0";
        }

        cell.childNodes[2].checked = c;

   ///// if ((this.lastFocus == undefined) || this.lastFocus != i)
   ///// {
        ///////transform += " translate3d(0, 0, 100px) rotateY(180deg)";
        //alert(transform);
        this.lastFocus = i;
        //cell.childNodes[1].style.webkitTransform = "translate3d(0, 100px, 0) rotateY(180deg)";
        cell.childNodes[1].style.opacity = "1";

        

        cell.childNodes[2].checked = !cell.childNodes[2].checked;
        //////cell.childNodes[3].style.webkitTransform = "translate3d(330px, 0, 0px) rotateY(180deg)";
        //alert(this.lastFocus);
  /////  }
  //////  else
  //////  {
  /////      cell.childNodes[1].style.opacity = "0";
  /////      this.lastFocus = undefined;
  //////  }

    if (cell.childNodes[2].checked == true) {
        var el = document.getElementById("color");
        el.value = cell.childNodes[0].src;
        cell.childNodes[3].style.opacity = "1";
    }
    else {
        cell.childNodes[3].style.opacity = "0";
        var el = document.getElementById("color");
        el.value = "";
    }

    //alert(cell.childNodes[2].checked);

    this.setTransformForCell(cell, i, transform);

    
    
    //alert('image touched');
}

FlowDelegate.prototype.getFocusedCell = function (currentX)
{
    // Snap to nearest position
    var i = - Math.round(currentX / CGAP);

    // Clamp to cells array boundary
    return Math.min(Math.max(i, 0), this.cells.length - 1);
}

FlowDelegate.prototype.transformForCell = function (cell, i, offset)
{
    /* 
        This function needs to be fast, so we avoid function calls, divides, Math.round,
        and precalculate any invariants we can.
    */
    var x = (i * CGAP);
    var ix = x + offset;

    if ((ix < FLOW_THRESHOLD) && (ix >= -FLOW_THRESHOLD))
    {
        // yangle = 0, zpos = FLOW_ZFOCUS
        cell.childNodes[0].style.opacity = "1";

        if (cell.childNodes[2].checked == true) {
            cell.childNodes[3].style.opacity = "1";
        }
        else {
            cell.childNodes[3].style.opacity = "0";
        }

        return T_ZFOCUS + " translate3d(" + x + "px, 0, 0)";
    }
    else if (ix > 0)
    {
        // yangle = -FLOW_ANGLE, x + FLOW_XGAP
        cell.childNodes[0].style.opacity = "0.2";

        if (cell.childNodes[2].checked == true) {
            cell.childNodes[3].style.opacity = "0.2";
        }
        else {
            cell.childNodes[3].style.opacity = "0";
        }

        return "translate3d(" + (x + FLOW_XGAP) + "px, 0, 0) " + T_NEG_ANGLE;
    }
    else
    {
        // yangle = FLOW_ANGLE, x - FLOW_XGAP
        cell.childNodes[0].style.opacity = "0.2";

        if (cell.childNodes[2].checked == true) {
            cell.childNodes[3].style.opacity = "0.2";
        }
        else {
            cell.childNodes[3].style.opacity = "0";
        }


        return "translate3d(" + (x - FLOW_XGAP) + "px, 0, 0) " + T_ANGLE;
    }
}

FlowDelegate.prototype.setTransformForCell = function (cell, i, transform)
{
    if (this.transforms[i] != transform)
    {
        cell.style.webkitTransform = transform;
        this.transforms[i] = transform;
    }
}

FlowDelegate.prototype.update = function (currentX)
{
    this.elem.style.webkitTransform = "translate3d(" + (currentX) + "px, 0, 0)";

    /*
        It would be nice if we only updated dirty cells... for now, we use a cache
    */
    for (var i in this.cells)
    {
        var cell = this.cells[i];
        cell.childNodes[1].style.opacity = "0";
        this.setTransformForCell(cell, i, this.transformForCell(cell, i, currentX));
        i += 1;
    }
}

global.zflow = function (images, selector)
{
    var controller = new TrayController();
    var delegate = new FlowDelegate();
    var tray = document.querySelector(selector);

    controller.init(tray);
    delegate.init(tray);

    controller.delegate = delegate;

    var imagesLeft = images.length;
    
    var cellCSS = {
        //top: Math.round(-CSIZE * 0.65) + "px",
        //top: Math.round(-CSIZE * 0.8 ) + "px",
        top: "-500px",
        left: Math.round(-CSIZE / 2) + "px",
        width: CSIZE + "px",
        //height: Math.round(CSIZE * 1.5) + "px",
        opacity: 0,
    }

    images.forEach(function (url, i)
    {
        var cell = document.createElement("div");
        var imagePrice = document.createElement("div");
        var checkDiv = document.createElement("div");
        var checkImg = document.createElement("img");
        var image = document.createElement("img");
        //var imagePrice = document.createElement("img");
        var subcell = document.createElement("label");
        var canvas = document.createElement("canvas");
        var checkbox = document.createElement("input");

        cell.className = "cell";
        cell.appendChild(image);
        imagePrice.appendChild(subcell);
        checkDiv.appendChild(checkImg);
        cell.appendChild(imagePrice);
        cell.appendChild(checkbox);
        cell.appendChild(checkDiv);
        //cell.appendChild(canvas);

        image.src = url;
        checkImg.src = "images/check2.png";
        checkDiv.style.opacity = "0";

        
        //imagePrice.src = "yellow_price.png";
        //imagePrice.innerHTML = "$345,000";
        imagePrice.style.webkitTransform = "translate(50px, 100px) ";
        imagePrice.style.fontSize = "45px";
        imagePrice.style.webkitTextStroke = "1px white";
        imagePrice.style.color = "black";
        imagePrice.style.fontWeight = "bold";
        imagePrice.style.fontFamily = "Marker Felt";
        imagePrice.style.opacity = "0";
        
        checkbox.type = "checkbox";
        checkbox.style.display = "none";
        checkbox.checked = false;


        image.addEventListener("load", function ()
        {
            imagesLeft -= 1;

            var iwidth = image.width;
            var iheight = image.height;
            
            var ratio = Math.min(CSIZE / iheight, CSIZE / iwidth);4
            
            iwidth *= ratio;
            iheight *= ratio;

            utils_setsize(image, iwidth, iheight);

            utils_extend(cell.style, cellCSS);

            utils_setxy(image, (CSIZE - iwidth) / 2, CSIZE - iheight);
            utils_setxy(canvas, (CSIZE - iwidth) / 2, CSIZE);

            //reflect(image, iwidth, iheight, canvas);

            delegate.setTransformForCell(cell, delegate.cells.length, delegate.transformForCell(cell, delegate.cells.length, controller.currentX));
            delegate.cells.push(cell);

            // Start at 0 opacity
            tray.appendChild(cell);

            // Set to 1 to fade element in.
            cell.style.opacity = 1.0;

            if (imagesLeft == 0)
            {
                window.setTimeout( function() { window.scrollTo(0, 0); }, 100 );
            }
        });
    });

    tray.addEventListener('touchstart', controller, false);

	/* Limited keyboard support for now */
	window.addEventListener('keydown', function (e)
	{
		if (e.keyCode == 37)
		{
			/* Left Arrow */
			controller.currentX += CGAP;
			delegate.updateTouchEnd(controller);
		}
		else if (e.keyCode == 39)
		{
			/* Right Arrow */
			controller.currentX -= CGAP;
			delegate.updateTouchEnd(controller);
		}
	});
}

function reflect(image, iwidth, iheight, canvas)
{
/*
    canvas.width = iwidth;
    canvas.height = iheight / 2;

    var ctx = canvas.getContext("2d");

    ctx.save();

    ctx.translate(0, iheight - 1);
    ctx.scale(1, -1);
    ctx.drawImage(image, 0, 0, iwidth, iheight);

    ctx.restore();

    ctx.globalCompositeOperation = "destination-out";

    var gradient = ctx.createLinearGradient(0, 0, 0, iheight / 2);
    gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, iwidth, iheight / 2);
    */
}

})();
