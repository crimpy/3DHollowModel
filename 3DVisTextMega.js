var nodes={}, lowerLim=0.1, tarr=[];
var minMaxArr  = {}, voxelCount=0;
var minMaxData = {};
var dataObj, tarrCount=0, renderObj;
var DDD = [];
var tarrLocal, color = 0, colors = [ 0x0033CC, 0x0099CC, 0x339999, 0x33CC66, 0x00CC33, 0x00CC00, 0x00FF33, 0x00FF66, 0x33FF66, 0x66FF66, 0x99FF00, 0x99FF66, 0xCCFF00, 0xFFFF00, 0xFFCC00, 0xCCCC00, 0xFF9900, 0xCC6600, 0xFF3300, 0xDDEEDD, 0xFF0000, 0xF7F5F5 ];

function makeArray(d1, d2) {
    var arr = [];
    for(i = 0; i < d2; i++) {
        arr.push(new Array(d1));
    }
    return arr;
}

function selectedMax(columns, pos) {
    var max;
    columns.forEach(function(element) {
        var tmpmax = element[pos];
        max = (tmpmax > max || max === undefined) ? tmpmax : max;
    });
    return max;
}

function selectedMin(columns, pos) {
    var min;
    columns.forEach(function(element) {
        var tmpmin = element[pos];
        min = (tmpmin < min || min === undefined) ? tmpmin : min;
    });
    return min;
}

function getSolidDimensions(array){
	var len = array.length-1;
	var count0=0, count1=0, count2=0;

	for (i=0; i<len; i++)
	{
		if(array[i][1]==minMaxArr.yMin)
		{
			count0++;
		}
		if(array[i][0]==minMaxArr.xMin)
		{
			count1++;
		}
		if(array[i][2]==minMaxArr.zMin)
		{
			count2++;
		}
	}
	nodes.y = len / count0;
	nodes.x = len / count1;
	nodes.z = len / count2;
}

function localArray(arr)
	{
	var xVal = yVal = 0;
	var zVal = 1;
	tarrCount = tarr.length;
	dataObj = [];

	for (var i = 0; i < tarrCount; i++) {

//makes the matrix values for each voxel
		if(i % nodes.x !=  0){
					xVal ++;
				}
				if(i % nodes.x === 0){
					xVal = 1;
					yVal ++;
					if(yVal > nodes.y){
						yVal = 1;
						zVal ++;
					}
				}
//strip off any voxels above the cutoff value first
		if((tarr[i][3]>=lowerLim)){

			var	edge = (function(){
			if(xVal===1 ||xVal===nodes.x) 
				{return true;}
			else if(yVal===1 ||yVal===nodes.y)
				{return true;}
			else {return false;}
			});
	
    	dataObj.push({
       	 	y: Number(minMaxArr.yMax) - Number(arr[i][1]),
			x: Number(minMaxArr.xMax) - Number(arr[i][0]),
			z: Number(tarr[i][2]),
			g: Number(tarr[i][3]),
			xNode: xVal, //x location in matrix
			yNode: yVal, //y location in matrix
			zNode: zVal, //z location in matrix
			num: i +1, //voxelId number in matrix- add 1 because i starts at 0
			edge: edge() //which voxel in the matrix 
    		});
    		voxelCount++;
    	}

	}	
	tarr=[];  //clean up 
	//renderObj = Object.create(dataObj);  //clone the object for processing later
	getDataStats(dataObj);
}

function build3DObj(){
	
	fac = 1;  //could be used to control the z dimension but I think this is controlled elsewhere
	for (var j =0; j<voxelCount; j++){

				if( (dataObj[j].g >= lowerLim)) {	
					dataObj[j].x = (( dataObj[j].xNode  * 5 ) - 150);
					dataObj[j].y = (( dataObj[j].yNode  * 5 ) - 150 );
					dataObj[j].z = (( dataObj[j].zNode  * 5 ) - 200);
					dataObj[j].g = Number(dataObj[j].g) * fac;
				}
				else{
					var garbage = 0;}
		}
	}	

function getDataStats(object)
{	
	minMaxData.xMax = Math.max.apply(Math,object.map(function(o){return o.x;}))
	minMaxData.yMax = Math.max.apply(Math,object.map(function(o){return o.y;}))
	minMaxData.zMax = Math.max.apply(Math,object.map(function(o){return o.z;}))

	minMaxData.xMin = Math.min.apply(Math,object.map(function(o){return o.x;}))
	minMaxData.yMin = Math.min.apply(Math,object.map(function(o){return o.y;}))
	minMaxData.zMin = Math.min.apply(Math,object.map(function(o){return o.z;}))
}

function checkAround()
{
	renderObj = [];

	document.body.innerHTML = "<h1>Please Wait- Building Hollow 3D Model<h1>" ;
	var surrounded =0;
	var removeArr=[];  //array of indexes to remove
		for(var i=0; i<voxelCount; i++)
		{
			x = dataObj[i].xNode;  //extract the x,y,z values from the voxel
			y = dataObj[i].yNode;
			z = dataObj[i].zNode;
			vNode = dataObj[i].num;//the voxel number in the entire matrix
			var layerVoxes = (nodes.x * nodes.y);

		if(dataObj[i].edge===true)
		{
			renderObj.push(dataObj[i]);
			filtered="undefined";
		}
		else{

			//var computedNode = (nodes.x*nodes.y*z) - ((nodes.y-y) * (nodes.x)) -  (nodes.x-x) -1;
			var north = vNode + nodes.x ;
			var south = vNode - nodes.x ;
			var east  = vNode + 1;
			var west  = vNode - 1;
			var above = vNode + layerVoxes;
			var below = vNode - layerVoxes;

			var filtered = dataObj.filter(function(obj){
				return obj.num == north || obj.num == south || obj.num == east || obj.num == west || obj.num == above || obj.num == below;
			});

			switch(filtered.length)
			{
				case 0:
					renderObj.push(dataObj[i]);
					break;
				case 1:
					renderObj.push(dataObj[i]);
					break;
				case 2:
					renderObj.push(dataObj[i]);
					break;
				case 3:
					renderObj.push(dataObj[i]);	
					break;
				case 4: 
					renderObj.push(dataObj[i]);
					break;
				case 5:
					renderObj.push(dataObj[i]);
					break;
				case 6:
					break;
				case 9:  //undefined
					break;	
			}
		}
		console.log("voxel: " + dataObj[i].num + " touches: " + filtered.length);
//		if(above <= 0 || below <= 0 || north <= 0 || south<= 0 || east<= 0 || west<= 0)
//		{
//			renderObj.push(dataObj[i]);
//			surrounded++;
//			console.log(surrounded);
			//filtered="undefined";
//		}
		
		////make an array of the voxels that exist around the voexel in question
		
//		else if (filtered.length <= 5){renderObj.push(dataObj[i]);}//filtered="undefined";}

//		else if(filtered.length === 6)
//			{	
//				removeArr.push(i);
					
//			}
		}
		//remove the items after the search because removing during changes the indexes. 
		//this function removes them in reverse order which helps
	//for (var i = removeArr.length -1; i >= 0; i--){
	//   		renderObj.splice(removeArr[i],1);
   	//	}	

	document.body.innerHTML ="";	
	console.log("renderObj Len: " + renderObj.length);

}




function makeHeap(){
	
	count=0;
	len = renderObj.length;
	
	for (j=0;j<len;j++)
	{
		Rcol = renderObj[count].g ;			
			if((Rcol<500)&&(Rcol>=400))
				{Ncolor=20;
				alpha=1;
				}
			else if((Rcol<400)&&(Rcol>=300))
				{Ncolor=19;
				alpha=1;
				}
			else if((Rcol<300)&&(Rcol>=200))
				{Ncolor=2;
				alpha=1;
				}		
			else if((Rcol<200)&&(Rcol>=100))
				{Ncolor=3;
				alpha=1;
				}	
			else if((Rcol<100)&&(Rcol>=90))
				{Ncolor=4;
				alpha=1;
				}
			else if((Rcol<90)&&(Rcol>=80))
				{Ncolor=5;
				alpha=.3;
				}
			else if((Rcol<80)&&(Rcol>=60))
				{Ncolor=6;
				alpha=1;
				}
			else if((Rcol<60)&&(Rcol>=30))
				{Ncolor=7;
				alpha=1;
				}	
			else if((Rcol<30)&&(Rcol>=20))
				{Ncolor=8;
				alpha=1;
				}	
			else if((Rcol<20)&&(Rcol>=10))
				{Ncolor=9;
				alpha=1;
				}	
			else if((Rcol<10)&&(Rcol>=9))
				{Ncolor=10;
				alpha=1;
				}
			else if((Rcol<9)&&(Rcol>=8))
				{Ncolor=11;
				alpha=1;
				}	
			else if((Rcol<8)&&(Rcol>=7))
				{Ncolor=12;
				alpha=1;
				}	
			else if((Rcol<7)&&(Rcol>=4))
				{Ncolor=13;
				alpha=1;
				}	
			else if((Rcol<4)&&(Rcol>=3))
				{Ncolor=14;
				alpha=1;
				}	
			else if((Rcol<3)&&(Rcol>=2))
				{Ncolor=15;
				alpha=1;
				}	
			else if((Rcol<2)&&(Rcol>=1.5))
				{Ncolor=16;
				alpha=1;
				}	
			else if((Rcol<1.5)&&(Rcol>=1))
				{Ncolor=17;
				alpha=1;
				}	
			else if((Rcol<1)&&(Rcol>=.5))
				{Ncolor=18;
				alpha=1;
				}	
			else if((Rcol<.5)&&(Rcol>=0.01))
				{Ncolor=19;
				alpha=1;
				}	
			else if((Rcol<=0))
				{Ncolor=21;
				alpha=1;
				}
			else if((Rcol===-1e-7))
				{Ncolor=null;
				}				
			else
				{Ncolor=21;
				alpha=.1;		
			}
			
			//color=Ncolor;

		//voxel = new THREE.Points(geometry, new THREE.PointsMaterial( { color: colors[Ncolor], size: 1 } ) );
		//geometry = new THREE.Points( dim, dim, dim );	
 //new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
		voxel = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: colors[Ncolor] } ) );
							voxel.position.x = Math.floor( renderObj[count].x  ) ;
							voxel.position.y = Math.floor( renderObj[count].z  ) ;
							voxel.position.z = Math.floor( renderObj[count].y  ) ;
							voxel.scale.x    = 1;
							voxel.scale.y    = 1;
							voxel.scale.z    = 1;
							//voxel.overdraw = true;
							scene.add( voxel );
	
	count++;	
	}
console.log("Number of Voxels in Model: "+dataObj.length);	
console.log("Voxels Rendered: "+count);
}	