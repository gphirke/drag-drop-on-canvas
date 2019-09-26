(function(){
	document.getElementById("generateCanvas").
		addEventListener("click", generateCanvas);

	document.getElementById("insertToCanvas").
			addEventListener("click", generateObjectsInCanvas);

}());

var data = null;
var canvas0 = null;
var canvas1 = null;
var canvas2 = null;
var canvas3 = null;

var onObjectMoving = function(p, evt) {
      var viewport = p.target.canvas.calcViewportBoundaries(); 
      console.log(p.target.canvas.lowerCanvasEl.id);
      console.log(p.e.clientX)
      if (p.target.canvas === canvas0) {
          
        	if(p.e.clientX > 330 && p.e.clientX < 660){
        		transferObject(canvas0, canvas1, p.target);
        	}
      }
      if (p.target.canvas === canvas1) {
          
          if (p.e.clientX > 630) {
            transferObject(canvas1, canvas2, p.target);
            return;
        	}
       
         if(p.e.clientX < 370){
          	transferObject(canvas1, canvas0, p.target);
          	return;
         }

      }

      if(p.target.canvas == canvas2) {
      	
         if (p.e.clientX > 360 && p.e.clientX < 690) {
              transferObject(canvas2, canvas1, p.target);
              return;
         } 
         if (p.e.clientX > 960 && p.e.clientX < 1300) {
              transferObject(canvas2, canvas3, p.target);
              return;
         }
         
      }

      if(p.target.canvas == canvas3) {
      	if (p.e.clientX > 660 && p.e.clientX < 1020) {
              transferObject(canvas3, canvas2, p.target);
              return;
         }
         
      }
  };

var transferObject = function(fromCanvas, toCanvas, pendingImage) {
				if(!fromCanvas){
					return;
				}
        fromCanvas.remove(pendingImage);

        var pendingTransform = fromCanvas._currentTransform;
        fromCanvas._currentTransform = null;

        var removeListener = fabric.util.removeListener;
        var addListener = fabric.util.addListener;
				
				removeListener(fabric.document, 'mouseup', fromCanvas._onMouseUp);
				removeListener(fabric.document, 'mousemove', fromCanvas._onMouseMove);
        
        addListener(fabric.document, 'mouseup', toCanvas._onMouseUp);
        addListener(fabric.document, 'mousemove', toCanvas._onMouseMove);

        setTimeout(function() {

            pendingImage.canvas = toCanvas;
            pendingImage.migrated = true;
            toCanvas.add(pendingImage);

            toCanvas._currentTransform = pendingTransform;    

            toCanvas.setActiveObject(pendingImage);
        }, 400);
    };

function generateCanvas(event) {
	this.disabled = true;
	let canvasBlock = document.getElementById("canvasBlock");
 	
 	let numofCanvas = getRandomIntInclusive(2, 4);

 	let selectedCanvas = document.getElementById('selectedCanvas');
 
	for (let i = 0; i < numofCanvas; i++) {
		let canvas = document.createElement("canvas");
		canvas.id = "canvas"+i;
		canvasBlock.append(canvas);

		selectedCanvas.options[selectedCanvas.options.length] = new Option('canvas '+i, 'canvas'+i);

		window["canvas"+i] = new fabric.Canvas("canvas"+i);
		window["canvas"+i].on("object:moving", onObjectMoving);
	}
}


//genertaes fabrric objects on selected canvas
function generateObjects(){
  var arr = [0, 1, getRandomIntInclusive(0, this.data.length - 1), this.data.length-2, this.data.length - 1];
  var config = {
  	crossOrigin: 'Access-Control-Allow-Origin'
  };
   var selectedCanvasId =  getSelectedCanvas();
   var canvas = this[selectedCanvasId];
	//document.getElementById(selectedCanvasId).fabric = canvas;
  for (var i = 0; i < arr.length; i++) {
  	if(this.data[arr[i]].albumId >= 100){
  		var url = new fabric.Text(this.data[i].url, { 
  			left: 20, 
  			top: 40, 
  			fontSize: 12,
  			lockScalingX: true, 
				lockScalingY: true  
  		});
  		canvas.add(url);
  	} else if(this.data[arr[i]].id % 2 == 0){
			var title = new fabric.Text(this.data[i].title, { 
				left: 40, 
				top: 20, 
				fontSize: 12, 
				lockScalingX: true, 
				lockScalingY: true 
			});
			canvas.add(title);

  	} else if(this.data[arr[i]].id % 2 !== 0){
  		new fabric.Image.fromURL(this.data[i].thumbnailUrl, function(img){
  				img.originX = "center";
				  img.originY = "center";
					img._setWidthHeight({width: 50, height: 50});
					img.left = 50 + getRandomIntInclusive(20, 30);
					img.top = 50 + getRandomIntInclusive(30, 40);
					img.lockScalingX = true;
					img.lockScalingY = true;
					canvas.add(img);
					img.canvas = canvas;
  		});
  	}
  	
  };

 }

function generateObjectsInCanvas(){
	if(!window.data){
    fetch('https://jsonplaceholder.typicode.com/photos')
		.then(response => response.json())
		.then(data => {
				window.data = data;
				generateObjects();
		})
		.catch(error => console.error(error));
	}else{
		generateObjects();
	}
}

function getSelectedCanvas(){
	let selectedCanvasId = document.getElementById("selectedCanvas").value;
	if(!selectedCanvasId){
		alert("Please select canvas");
	}
	return selectedCanvasId;
}

//Both max and min are inclusive.
//return random integer between min and max. 
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

/*window.addEventListener('mouseup',  function(evt) {
    if(evt.target.localName === 'canvas') {
        if(evt.target.previousSibling.id == "canvas2") {
            //activeObject.top = this.canvas2.wrapperEl.offsetTop + activeObject.top;
            //activeObject.left = this.canvas2.wrapperEl.offsetLeft + activeObject.left;
            // this.canvas2.add(activeObject);
           // transferObject(fromCanvas, canvas2, targetObject)
        }
        if(evt.target.previousSibling.id == "canvas3") {
            //activeObject.top = this.canvas2.wrapperEl.offsetTop + activeObject.top;
            //activeObject.left = this.canvas2.wrapperEl.offsetLeft + activeObject.left;
            // this.canvas2.add(activeObject);
            //transferObject(fromCanvas, canvas3, targetObject)
        }
    } 
    //targetObject = null;
    //fromCanvas = null;    
});   */
