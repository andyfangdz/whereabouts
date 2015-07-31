/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(1);
	var TWEEN = __webpack_require__(2);
	var d3 = __webpack_require__(3);
	
	var _sort = __webpack_require__(4);
	
	var students = __webpack_require__(11);
	
	var camera, renderer, controls;
	
	var count = students.length;
	var width = window.innerWidth, height = window.innerHeight;
	
	
	(function(){
	
	  if ("performance" in window == false) {
	      window.performance = {};
	  }
	  
	  Date.now = (Date.now || function () {  // thanks IE8
	      return new Date().getTime();
	  });
	
	  if ("now" in window.performance == false){
	    
	    var nowOffset = Date.now();
	    
	    if (performance.timing && performance.timing.navigationStart){
	      nowOffset = performance.timing.navigationStart
	    }
	
	    window.performance.now = function now(){
	      return Date.now() - nowOffset;
	    }
	  }
	
	})();
	
	//animate();
	
	function gQuery(key, value) {
	    console.log(key, value);
	}
	
	function init() {
	
	    scene = new THREE.Scene()
	    
	
	    camera = new THREE.PerspectiveCamera(40, width / height , 1, 10000);
	    camera.position.z = 3000;
	    camera.setLens(30);
	    
	    _sort(students, "name");
	    var entry = d3.select("#container")
	    .selectAll("div")
	        .data(students)
	    .enter().append("div")
	        .attr("class", "element")
	        .style("background-color", function() {
	            return 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';
	        });
	    entry.append("div")
	        .attr("class", "symbol")
	        .text(function(d) {
	            return d.name;
	        });
	    entry.append("div")
	        .attr("class", "details")
	        .text(function(d) {
	            return d.college;
	        });
	    entry.append("div")
	        .attr("class", "leftnumber")
	        .text(function(d) {
	            return d.province;
	        });
	    entry.append("div")
	        .attr("class", "number")
	        .text(function(d) {
	            return d.city;
	        });
	    entry.each(setData);
	    entry.each(objectify);
	
	    function setData(d, i) {
	        var vector, phi, theta;
	
	        var random = new THREE.Object3D();
	        random.position.x = Math.random() * 4000 - 2000;
	        random.position.y = Math.random() * 4000 - 2000;
	        random.position.z = Math.random() * 4000 - 2000;
	        d['random'] = random;
	
	        var sphere = new THREE.Object3D();
	        vector = new THREE.Vector3();
	        phi = Math.acos(-1 + ( 2 * i ) / (count - 1));
	        theta = Math.sqrt((count - 1) * Math.PI) * phi;
	        sphere.position.x = 800 * Math.cos(theta) * Math.sin(phi);
	        sphere.position.y = 800 * Math.sin(theta) * Math.sin(phi);
	        sphere.position.z = 800 * Math.cos(phi);
	        vector.copy(sphere.position).multiplyScalar(2);
	        sphere.lookAt(vector);
	        d['sphere'] = sphere;
	
	        var helix = new THREE.Object3D();
	        vector = new THREE.Vector3();
	        phi = (i + 12) * 0.250 + Math.PI;
	        helix.position.x = 800 * Math.sin(phi);
	        helix.position.y = - (i * 8) + 250;
	        helix.position.z = 800 * Math.cos(phi);
	        vector.x = helix.position.x * 2;
	        vector.y = helix.position.y;
	        vector.z = helix.position.z * 2;
	        helix.lookAt(vector);
	        d['helix'] = helix;
	
	        var grid = new THREE.Object3D();
	        grid.position.x = (( i % 5 ) * 400) - 800;
	        grid.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
	        grid.position.z = - ((Math.floor( i / 25 )) * 1000 - 1000);
	        d['grid'] = grid;
	    }
	
	    function objectify(d) {
	        var object = new THREE.CSS3DObject(this);
	        object.position.set(d.random.position.x, d.random.position.y, d.random.position.z)
	        console.log(object.position);
	        scene.add(object);
	    }
	    renderer = new THREE.CSS3DRenderer();
	    renderer.setSize(width, height);
	    renderer.domElement.style.position = 'absolute';
	    document.getElementById('container').appendChild(renderer.domElement);
	
	    controls = new THREE.TrackballControls(camera, renderer.domElement);
	    controls.rotateSpeed = 0.5;
	    controls.minDistance = 100;
	    controls.maxDistance = 6000;
	    controls.addEventListener('change', render);
	}
	function render() {
	    renderer.render(scene, camera);
	}
	
	function transform(layout) {
	    var duration = 2000;
	
	    TWEEN.removeAll();
	
	    scene.children.forEach(function (object){
	      var newPos = object.element.__data__[layout].position;
	      var coords = new TWEEN.Tween(object.position)
	      .to({x: newPos.x, y: newPos.y, z: newPos.z}, Math.random() * duration + duration)
	      .easing(TWEEN.Easing.Exponential.InOut)
	      .start();
	
	      var newRot = object.element.__data__[layout].rotation;
	      var rotate = new TWEEN.Tween(object.rotation)
	      .to({x: newRot.x, y: newRot.y, z: newRot.z}, Math.random() * duration + duration)
	      .easing(TWEEN.Easing.Exponential.InOut)
	      .start();
	    });
	
	    var update = new TWEEN.Tween(this)
	        .to({}, 2 * duration)
	        .onUpdate(render)
	        .start();
	}
	function animate() {
	    requestAnimationFrame(animate);
	    TWEEN.update();
	    controls.update();
	}
	init();
	
	transform('helix');
	
	window.transform = transform;
	window.gQuery = gQuery;
	render();
	animate();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var self=self||{},THREE={REVISION:"71"};"object"==typeof module&&(module.exports=THREE),void 0===Math.sign&&(Math.sign=function(e){return 0>e?-1:e>0?1:+e}),THREE.log=function(){console.log.apply(console,arguments)},THREE.warn=function(){console.warn.apply(console,arguments)},THREE.error=function(){console.error.apply(console,arguments)},THREE.MOUSE={LEFT:0,MIDDLE:1,RIGHT:2},THREE.CullFaceNone=0,THREE.CullFaceBack=1,THREE.CullFaceFront=2,THREE.CullFaceFrontBack=3,THREE.FrontFaceDirectionCW=0,THREE.FrontFaceDirectionCCW=1,THREE.BasicShadowMap=0,THREE.PCFShadowMap=1,THREE.PCFSoftShadowMap=2,THREE.FrontSide=0,THREE.BackSide=1,THREE.DoubleSide=2,THREE.NoShading=0,THREE.FlatShading=1,THREE.SmoothShading=2,THREE.NoColors=0,THREE.FaceColors=1,THREE.VertexColors=2,THREE.NoBlending=0,THREE.NormalBlending=1,THREE.AdditiveBlending=2,THREE.SubtractiveBlending=3,THREE.MultiplyBlending=4,THREE.CustomBlending=5,THREE.AddEquation=100,THREE.SubtractEquation=101,THREE.ReverseSubtractEquation=102,THREE.MinEquation=103,THREE.MaxEquation=104,THREE.ZeroFactor=200,THREE.OneFactor=201,THREE.SrcColorFactor=202,THREE.OneMinusSrcColorFactor=203,THREE.SrcAlphaFactor=204,THREE.OneMinusSrcAlphaFactor=205,THREE.DstAlphaFactor=206,THREE.OneMinusDstAlphaFactor=207,THREE.DstColorFactor=208,THREE.OneMinusDstColorFactor=209,THREE.SrcAlphaSaturateFactor=210,THREE.MultiplyOperation=0,THREE.MixOperation=1,THREE.AddOperation=2,THREE.UVMapping=300,THREE.CubeReflectionMapping=301,THREE.CubeRefractionMapping=302,THREE.EquirectangularReflectionMapping=303,THREE.EquirectangularRefractionMapping=304,THREE.SphericalReflectionMapping=305,THREE.RepeatWrapping=1e3,THREE.ClampToEdgeWrapping=1001,THREE.MirroredRepeatWrapping=1002,THREE.NearestFilter=1003,THREE.NearestMipMapNearestFilter=1004,THREE.NearestMipMapLinearFilter=1005,THREE.LinearFilter=1006,THREE.LinearMipMapNearestFilter=1007,THREE.LinearMipMapLinearFilter=1008,THREE.UnsignedByteType=1009,THREE.ByteType=1010,THREE.ShortType=1011,THREE.UnsignedShortType=1012,THREE.IntType=1013,THREE.UnsignedIntType=1014,THREE.FloatType=1015,THREE.HalfFloatType=1025,THREE.UnsignedShort4444Type=1016,THREE.UnsignedShort5551Type=1017,THREE.UnsignedShort565Type=1018,THREE.AlphaFormat=1019,THREE.RGBFormat=1020,THREE.RGBAFormat=1021,THREE.LuminanceFormat=1022,THREE.LuminanceAlphaFormat=1023,THREE.RGBEFormat=THREE.RGBAFormat,THREE.RGB_S3TC_DXT1_Format=2001,THREE.RGBA_S3TC_DXT1_Format=2002,THREE.RGBA_S3TC_DXT3_Format=2003,THREE.RGBA_S3TC_DXT5_Format=2004,THREE.RGB_PVRTC_4BPPV1_Format=2100,THREE.RGB_PVRTC_2BPPV1_Format=2101,THREE.RGBA_PVRTC_4BPPV1_Format=2102,THREE.RGBA_PVRTC_2BPPV1_Format=2103,THREE.Projector=function(){THREE.error("THREE.Projector has been moved to /examples/js/renderers/Projector.js."),this.projectVector=function(e,t){THREE.warn("THREE.Projector: .projectVector() is now vector.project()."),e.project(t)},this.unprojectVector=function(e,t){THREE.warn("THREE.Projector: .unprojectVector() is now vector.unproject()."),e.unproject(t)},this.pickingRay=function(e,t){THREE.error("THREE.Projector: .pickingRay() is now raycaster.setFromCamera().")}},THREE.CanvasRenderer=function(){THREE.error("THREE.CanvasRenderer has been moved to /examples/js/renderers/CanvasRenderer.js"),this.domElement=document.createElement("canvas"),this.clear=function(){},this.render=function(){},this.setClearColor=function(){},this.setSize=function(){}},THREE.Color=function(e){return 3===arguments.length?this.setRGB(arguments[0],arguments[1],arguments[2]):this.set(e)},THREE.Color.prototype={constructor:THREE.Color,r:1,g:1,b:1,set:function(e){return e instanceof THREE.Color?this.copy(e):"number"==typeof e?this.setHex(e):"string"==typeof e&&this.setStyle(e),this},setHex:function(e){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,this},setRGB:function(e,t,r){return this.r=e,this.g=t,this.b=r,this},setHSL:function(e,t,r){if(0===t)this.r=this.g=this.b=r;else{var i=function(e,t,r){return 0>r&&(r+=1),r>1&&(r-=1),1/6>r?e+6*(t-e)*r:.5>r?t:2/3>r?e+6*(t-e)*(2/3-r):e};t=.5>=r?r*(1+t):r+t-r*t,r=2*r-t,this.r=i(r,t,e+1/3),this.g=i(r,t,e),this.b=i(r,t,e-1/3)}return this},setStyle:function(e){return/^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test(e)?(e=/^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec(e),this.r=Math.min(255,parseInt(e[1],10))/255,this.g=Math.min(255,parseInt(e[2],10))/255,this.b=Math.min(255,parseInt(e[3],10))/255,this):/^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test(e)?(e=/^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec(e),this.r=Math.min(100,parseInt(e[1],10))/100,this.g=Math.min(100,parseInt(e[2],10))/100,this.b=Math.min(100,parseInt(e[3],10))/100,this):/^\#([0-9a-f]{6})$/i.test(e)?(e=/^\#([0-9a-f]{6})$/i.exec(e),this.setHex(parseInt(e[1],16)),this):/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(e)?(e=/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(e),this.setHex(parseInt(e[1]+e[1]+e[2]+e[2]+e[3]+e[3],16)),this):/^(\w+)$/i.test(e)?(this.setHex(THREE.ColorKeywords[e]),this):void 0},copy:function(e){return this.r=e.r,this.g=e.g,this.b=e.b,this},copyGammaToLinear:function(e,t){return void 0===t&&(t=2),this.r=Math.pow(e.r,t),this.g=Math.pow(e.g,t),this.b=Math.pow(e.b,t),this},copyLinearToGamma:function(e,t){void 0===t&&(t=2);var r=t>0?1/t:1;return this.r=Math.pow(e.r,r),this.g=Math.pow(e.g,r),this.b=Math.pow(e.b,r),this},convertGammaToLinear:function(){var e=this.r,t=this.g,r=this.b;return this.r=e*e,this.g=t*t,this.b=r*r,this},convertLinearToGamma:function(){return this.r=Math.sqrt(this.r),this.g=Math.sqrt(this.g),this.b=Math.sqrt(this.b),this},getHex:function(){return 255*this.r<<16^255*this.g<<8^255*this.b<<0},getHexString:function(){return("000000"+this.getHex().toString(16)).slice(-6)},getHSL:function(e){e=e||{h:0,s:0,l:0};var t,r=this.r,i=this.g,n=this.b,o=Math.max(r,i,n),a=Math.min(r,i,n),s=(a+o)/2;if(a===o)a=t=0;else{var h=o-a,a=.5>=s?h/(o+a):h/(2-o-a);switch(o){case r:t=(i-n)/h+(n>i?6:0);break;case i:t=(n-r)/h+2;break;case n:t=(r-i)/h+4}t/=6}return e.h=t,e.s=a,e.l=s,e},getStyle:function(){return"rgb("+(255*this.r|0)+","+(255*this.g|0)+","+(255*this.b|0)+")"},offsetHSL:function(e,t,r){var i=this.getHSL();return i.h+=e,i.s+=t,i.l+=r,this.setHSL(i.h,i.s,i.l),this},add:function(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this},addColors:function(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this},addScalar:function(e){return this.r+=e,this.g+=e,this.b+=e,this},multiply:function(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this},multiplyScalar:function(e){return this.r*=e,this.g*=e,this.b*=e,this},lerp:function(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this},equals:function(e){return e.r===this.r&&e.g===this.g&&e.b===this.b},fromArray:function(e){return this.r=e[0],this.g=e[1],this.b=e[2],this},toArray:function(e,t){return void 0===e&&(e=[]),void 0===t&&(t=0),e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e},clone:function(){return(new THREE.Color).setRGB(this.r,this.g,this.b)}},THREE.ColorKeywords={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},THREE.Quaternion=function(e,t,r,i){this._x=e||0,this._y=t||0,this._z=r||0,this._w=void 0!==i?i:1},THREE.Quaternion.prototype={constructor:THREE.Quaternion,_x:0,_y:0,_z:0,_w:0,get x(){return this._x},set x(e){this._x=e,this.onChangeCallback()},get y(){return this._y},set y(e){this._y=e,this.onChangeCallback()},get z(){return this._z},set z(e){this._z=e,this.onChangeCallback()},get w(){return this._w},set w(e){this._w=e,this.onChangeCallback()},set:function(e,t,r,i){return this._x=e,this._y=t,this._z=r,this._w=i,this.onChangeCallback(),this},copy:function(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this.onChangeCallback(),this},setFromEuler:function(e,t){if(!1==e instanceof THREE.Euler)throw Error("THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.");var r=Math.cos(e._x/2),i=Math.cos(e._y/2),n=Math.cos(e._z/2),o=Math.sin(e._x/2),a=Math.sin(e._y/2),s=Math.sin(e._z/2);return"XYZ"===e.order?(this._x=o*i*n+r*a*s,this._y=r*a*n-o*i*s,this._z=r*i*s+o*a*n,this._w=r*i*n-o*a*s):"YXZ"===e.order?(this._x=o*i*n+r*a*s,this._y=r*a*n-o*i*s,this._z=r*i*s-o*a*n,this._w=r*i*n+o*a*s):"ZXY"===e.order?(this._x=o*i*n-r*a*s,this._y=r*a*n+o*i*s,this._z=r*i*s+o*a*n,this._w=r*i*n-o*a*s):"ZYX"===e.order?(this._x=o*i*n-r*a*s,this._y=r*a*n+o*i*s,this._z=r*i*s-o*a*n,this._w=r*i*n+o*a*s):"YZX"===e.order?(this._x=o*i*n+r*a*s,this._y=r*a*n+o*i*s,this._z=r*i*s-o*a*n,this._w=r*i*n-o*a*s):"XZY"===e.order&&(this._x=o*i*n-r*a*s,this._y=r*a*n-o*i*s,this._z=r*i*s+o*a*n,this._w=r*i*n+o*a*s),!1!==t&&this.onChangeCallback(),this},setFromAxisAngle:function(e,t){var r=t/2,i=Math.sin(r);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(r),this.onChangeCallback(),this},setFromRotationMatrix:function(e){var t=e.elements,r=t[0];e=t[4];var i=t[8],n=t[1],o=t[5],a=t[9],s=t[2],h=t[6],t=t[10],c=r+o+t;return c>0?(r=.5/Math.sqrt(c+1),this._w=.25/r,this._x=(h-a)*r,this._y=(i-s)*r,this._z=(n-e)*r):r>o&&r>t?(r=2*Math.sqrt(1+r-o-t),this._w=(h-a)/r,this._x=.25*r,this._y=(e+n)/r,this._z=(i+s)/r):o>t?(r=2*Math.sqrt(1+o-r-t),this._w=(i-s)/r,this._x=(e+n)/r,this._y=.25*r,this._z=(a+h)/r):(r=2*Math.sqrt(1+t-r-o),this._w=(n-e)/r,this._x=(i+s)/r,this._y=(a+h)/r,this._z=.25*r),this.onChangeCallback(),this},setFromUnitVectors:function(){var e,t;return function(r,i){return void 0===e&&(e=new THREE.Vector3),t=r.dot(i)+1,1e-6>t?(t=0,Math.abs(r.x)>Math.abs(r.z)?e.set(-r.y,r.x,0):e.set(0,-r.z,r.y)):e.crossVectors(r,i),this._x=e.x,this._y=e.y,this._z=e.z,this._w=t,this.normalize(),this}}(),inverse:function(){return this.conjugate().normalize(),this},conjugate:function(){return this._x*=-1,this._y*=-1,this._z*=-1,this.onChangeCallback(),this},dot:function(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w},lengthSq:function(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w},length:function(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)},normalize:function(){var e=this.length();return 0===e?(this._z=this._y=this._x=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this.onChangeCallback(),this},multiply:function(e,t){return void 0!==t?(THREE.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."),this.multiplyQuaternions(e,t)):this.multiplyQuaternions(this,e)},multiplyQuaternions:function(e,t){var r=e._x,i=e._y,n=e._z,o=e._w,a=t._x,s=t._y,h=t._z,c=t._w;return this._x=r*c+o*a+i*h-n*s,this._y=i*c+o*s+n*a-r*h,this._z=n*c+o*h+r*s-i*a,this._w=o*c-r*a-i*s-n*h,this.onChangeCallback(),this},multiplyVector3:function(e){return THREE.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead."),e.applyQuaternion(this)},slerp:function(e,t){if(0===t)return this;if(1===t)return this.copy(e);var r=this._x,i=this._y,n=this._z,o=this._w,a=o*e._w+r*e._x+i*e._y+n*e._z;if(0>a?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=r,this._y=i,this._z=n,this;var s=Math.acos(a),h=Math.sqrt(1-a*a);return.001>Math.abs(h)?(this._w=.5*(o+this._w),this._x=.5*(r+this._x),this._y=.5*(i+this._y),this._z=.5*(n+this._z),this):(a=Math.sin((1-t)*s)/h,s=Math.sin(t*s)/h,this._w=o*a+this._w*s,this._x=r*a+this._x*s,this._y=i*a+this._y*s,this._z=n*a+this._z*s,this.onChangeCallback(),this)},equals:function(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w},fromArray:function(e,t){return void 0===t&&(t=0),this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this.onChangeCallback(),this},toArray:function(e,t){return void 0===e&&(e=[]),void 0===t&&(t=0),e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e},onChange:function(e){return this.onChangeCallback=e,this},onChangeCallback:function(){},clone:function(){return new THREE.Quaternion(this._x,this._y,this._z,this._w)}},THREE.Quaternion.slerp=function(e,t,r,i){return r.copy(e).slerp(t,i)},THREE.Vector2=function(e,t){this.x=e||0,this.y=t||0},THREE.Vector2.prototype={constructor:THREE.Vector2,set:function(e,t){return this.x=e,this.y=t,this},setX:function(e){return this.x=e,this},setY:function(e){return this.y=e,this},setComponent:function(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error("index is out of range: "+e)}},getComponent:function(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error("index is out of range: "+e)}},copy:function(e){return this.x=e.x,this.y=e.y,this},add:function(e,t){return void 0!==t?(THREE.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this)},addScalar:function(e){return this.x+=e,this.y+=e,this},addVectors:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this},sub:function(e,t){return void 0!==t?(THREE.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this)},subScalar:function(e){return this.x-=e,this.y-=e,this},subVectors:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this},multiply:function(e){return this.x*=e.x,this.y*=e.y,this},multiplyScalar:function(e){return this.x*=e,this.y*=e,this},divide:function(e){return this.x/=e.x,this.y/=e.y,this},divideScalar:function(e){return 0!==e?(e=1/e,this.x*=e,this.y*=e):this.y=this.x=0,this},min:function(e){return this.x>e.x&&(this.x=e.x),this.y>e.y&&(this.y=e.y),this},max:function(e){return this.x<e.x&&(this.x=e.x),this.y<e.y&&(this.y=e.y),this},clamp:function(e,t){return this.x<e.x?this.x=e.x:this.x>t.x&&(this.x=t.x),this.y<e.y?this.y=e.y:this.y>t.y&&(this.y=t.y),this},clampScalar:function(){var e,t;return function(r,i){return void 0===e&&(e=new THREE.Vector2,t=new THREE.Vector2),e.set(r,r),t.set(i,i),this.clamp(e,t)}}(),floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},ceil:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this},round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},roundToZero:function(){return this.x=0>this.x?Math.ceil(this.x):Math.floor(this.x),this.y=0>this.y?Math.ceil(this.y):Math.floor(this.y),this},negate:function(){return this.x=-this.x,this.y=-this.y,this},dot:function(e){return this.x*e.x+this.y*e.y},lengthSq:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},normalize:function(){return this.divideScalar(this.length())},distanceTo:function(e){return Math.sqrt(this.distanceToSquared(e))},distanceToSquared:function(e){var t=this.x-e.x;return e=this.y-e.y,t*t+e*e},setLength:function(e){var t=this.length();return 0!==t&&e!==t&&this.multiplyScalar(e/t),this},lerp:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this},lerpVectors:function(e,t,r){return this.subVectors(t,e).multiplyScalar(r).add(e),this},equals:function(e){return e.x===this.x&&e.y===this.y},fromArray:function(e,t){return void 0===t&&(t=0),this.x=e[t],this.y=e[t+1],this},toArray:function(e,t){return void 0===e&&(e=[]),void 0===t&&(t=0),e[t]=this.x,e[t+1]=this.y,e},fromAttribute:function(e,t,r){return void 0===r&&(r=0),t=t*e.itemSize+r,this.x=e.array[t],this.y=e.array[t+1],this},clone:function(){return new THREE.Vector2(this.x,this.y)}},THREE.Vector3=function(e,t,r){this.x=e||0,this.y=t||0,this.z=r||0},THREE.Vector3.prototype={constructor:THREE.Vector3,set:function(e,t,r){return this.x=e,this.y=t,this.z=r,this},setX:function(e){return this.x=e,this},setY:function(e){return this.y=e,this},setZ:function(e){return this.z=e,this},setComponent:function(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error("index is out of range: "+e)}},getComponent:function(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error("index is out of range: "+e)}},copy:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this},add:function(e,t){return void 0!==t?(THREE.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this)},addScalar:function(e){return this.x+=e,this.y+=e,this.z+=e,this},addVectors:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this},sub:function(e,t){return void 0!==t?(THREE.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this)},subScalar:function(e){return this.x-=e,this.y-=e,this.z-=e,this},subVectors:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this},multiply:function(e,t){return void 0!==t?(THREE.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."),this.multiplyVectors(e,t)):(this.x*=e.x,this.y*=e.y,this.z*=e.z,this)},multiplyScalar:function(e){return this.x*=e,this.y*=e,this.z*=e,this},multiplyVectors:function(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this},applyEuler:function(){var e;return function(t){return!1==t instanceof THREE.Euler&&THREE.error("THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order."),void 0===e&&(e=new THREE.Quaternion),this.applyQuaternion(e.setFromEuler(t)),this}}(),applyAxisAngle:function(){var e;return function(t,r){return void 0===e&&(e=new THREE.Quaternion),this.applyQuaternion(e.setFromAxisAngle(t,r)),this}}(),applyMatrix3:function(e){var t=this.x,r=this.y,i=this.z;return e=e.elements,this.x=e[0]*t+e[3]*r+e[6]*i,this.y=e[1]*t+e[4]*r+e[7]*i,this.z=e[2]*t+e[5]*r+e[8]*i,this},applyMatrix4:function(e){var t=this.x,r=this.y,i=this.z;return e=e.elements,this.x=e[0]*t+e[4]*r+e[8]*i+e[12],this.y=e[1]*t+e[5]*r+e[9]*i+e[13],this.z=e[2]*t+e[6]*r+e[10]*i+e[14],this},applyProjection:function(e){var t=this.x,r=this.y,i=this.z;e=e.elements;var n=1/(e[3]*t+e[7]*r+e[11]*i+e[15]);return this.x=(e[0]*t+e[4]*r+e[8]*i+e[12])*n,this.y=(e[1]*t+e[5]*r+e[9]*i+e[13])*n,this.z=(e[2]*t+e[6]*r+e[10]*i+e[14])*n,this},applyQuaternion:function(e){var t=this.x,r=this.y,i=this.z,n=e.x,o=e.y,a=e.z;e=e.w;var s=e*t+o*i-a*r,h=e*r+a*t-n*i,c=e*i+n*r-o*t,t=-n*t-o*r-a*i;return this.x=s*e+t*-n+h*-a-c*-o,this.y=h*e+t*-o+c*-n-s*-a,this.z=c*e+t*-a+s*-o-h*-n,this},project:function(){var e;return function(t){return void 0===e&&(e=new THREE.Matrix4),e.multiplyMatrices(t.projectionMatrix,e.getInverse(t.matrixWorld)),this.applyProjection(e)}}(),unproject:function(){var e;return function(t){return void 0===e&&(e=new THREE.Matrix4),e.multiplyMatrices(t.matrixWorld,e.getInverse(t.projectionMatrix)),this.applyProjection(e)}}(),transformDirection:function(e){var t=this.x,r=this.y,i=this.z;return e=e.elements,this.x=e[0]*t+e[4]*r+e[8]*i,this.y=e[1]*t+e[5]*r+e[9]*i,this.z=e[2]*t+e[6]*r+e[10]*i,this.normalize(),this},divide:function(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this},divideScalar:function(e){return 0!==e?(e=1/e,this.x*=e,this.y*=e,this.z*=e):this.z=this.y=this.x=0,this},min:function(e){return this.x>e.x&&(this.x=e.x),this.y>e.y&&(this.y=e.y),this.z>e.z&&(this.z=e.z),this},max:function(e){return this.x<e.x&&(this.x=e.x),this.y<e.y&&(this.y=e.y),this.z<e.z&&(this.z=e.z),this},clamp:function(e,t){return this.x<e.x?this.x=e.x:this.x>t.x&&(this.x=t.x),this.y<e.y?this.y=e.y:this.y>t.y&&(this.y=t.y),this.z<e.z?this.z=e.z:this.z>t.z&&(this.z=t.z),this},clampScalar:function(){var e,t;return function(r,i){return void 0===e&&(e=new THREE.Vector3,t=new THREE.Vector3),e.set(r,r,r),t.set(i,i,i),this.clamp(e,t)}}(),floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this},ceil:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this},round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this},roundToZero:function(){return this.x=0>this.x?Math.ceil(this.x):Math.floor(this.x),this.y=0>this.y?Math.ceil(this.y):Math.floor(this.y),this.z=0>this.z?Math.ceil(this.z):Math.floor(this.z),this},negate:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this},dot:function(e){return this.x*e.x+this.y*e.y+this.z*e.z},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)},normalize:function(){return this.divideScalar(this.length())},setLength:function(e){var t=this.length();return 0!==t&&e!==t&&this.multiplyScalar(e/t),this},lerp:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this},lerpVectors:function(e,t,r){return this.subVectors(t,e).multiplyScalar(r).add(e),this},cross:function(e,t){if(void 0!==t)return THREE.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."),this.crossVectors(e,t);var r=this.x,i=this.y,n=this.z;return this.x=i*e.z-n*e.y,this.y=n*e.x-r*e.z,this.z=r*e.y-i*e.x,this},crossVectors:function(e,t){var r=e.x,i=e.y,n=e.z,o=t.x,a=t.y,s=t.z;return this.x=i*s-n*a,this.y=n*o-r*s,this.z=r*a-i*o,this},projectOnVector:function(){var e,t;return function(r){return void 0===e&&(e=new THREE.Vector3),e.copy(r).normalize(),t=this.dot(e),this.copy(e).multiplyScalar(t)}}(),projectOnPlane:function(){var e;return function(t){return void 0===e&&(e=new THREE.Vector3),e.copy(this).projectOnVector(t),this.sub(e)}}(),reflect:function(){var e;return function(t){return void 0===e&&(e=new THREE.Vector3),this.sub(e.copy(t).multiplyScalar(2*this.dot(t)))}}(),angleTo:function(e){return e=this.dot(e)/(this.length()*e.length()),Math.acos(THREE.Math.clamp(e,-1,1))},distanceTo:function(e){return Math.sqrt(this.distanceToSquared(e))},distanceToSquared:function(e){var t=this.x-e.x,r=this.y-e.y;return e=this.z-e.z,t*t+r*r+e*e},setEulerFromRotationMatrix:function(e,t){THREE.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.")},setEulerFromQuaternion:function(e,t){THREE.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.")},getPositionFromMatrix:function(e){return THREE.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition()."),this.setFromMatrixPosition(e)},getScaleFromMatrix:function(e){return THREE.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale()."),this.setFromMatrixScale(e)},getColumnFromMatrix:function(e,t){return THREE.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn()."),this.setFromMatrixColumn(e,t)},setFromMatrixPosition:function(e){return this.x=e.elements[12],this.y=e.elements[13],this.z=e.elements[14],this},setFromMatrixScale:function(e){var t=this.set(e.elements[0],e.elements[1],e.elements[2]).length(),r=this.set(e.elements[4],e.elements[5],e.elements[6]).length();return e=this.set(e.elements[8],e.elements[9],e.elements[10]).length(),this.x=t,this.y=r,this.z=e,this},setFromMatrixColumn:function(e,t){var r=4*e,i=t.elements;return this.x=i[r],this.y=i[r+1],this.z=i[r+2],this},equals:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z},fromArray:function(e,t){return void 0===t&&(t=0),this.x=e[t],this.y=e[t+1],this.z=e[t+2],this},toArray:function(e,t){return void 0===e&&(e=[]),void 0===t&&(t=0),e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e},fromAttribute:function(e,t,r){return void 0===r&&(r=0),t=t*e.itemSize+r,this.x=e.array[t],this.y=e.array[t+1],this.z=e.array[t+2],this},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)}},THREE.Vector4=function(e,t,r,i){this.x=e||0,this.y=t||0,this.z=r||0,this.w=void 0!==i?i:1},THREE.Vector4.prototype={constructor:THREE.Vector4,set:function(e,t,r,i){return this.x=e,this.y=t,this.z=r,this.w=i,this},setX:function(e){return this.x=e,this},setY:function(e){return this.y=e,this},setZ:function(e){return this.z=e,this},setW:function(e){return this.w=e,this},setComponent:function(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error("index is out of range: "+e)}},getComponent:function(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error("index is out of range: "+e)}},copy:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=void 0!==e.w?e.w:1,this},add:function(e,t){return void 0!==t?(THREE.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this)},addScalar:function(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this},addVectors:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this},sub:function(e,t){return void 0!==t?(THREE.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this)},subScalar:function(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this},subVectors:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this},multiplyScalar:function(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this},applyMatrix4:function(e){var t=this.x,r=this.y,i=this.z,n=this.w;return e=e.elements,this.x=e[0]*t+e[4]*r+e[8]*i+e[12]*n,this.y=e[1]*t+e[5]*r+e[9]*i+e[13]*n,this.z=e[2]*t+e[6]*r+e[10]*i+e[14]*n,this.w=e[3]*t+e[7]*r+e[11]*i+e[15]*n,this},divideScalar:function(e){return 0!==e?(e=1/e,this.x*=e,this.y*=e,this.z*=e,this.w*=e):(this.z=this.y=this.x=0,this.w=1),this},setAxisAngleFromQuaternion:function(e){this.w=2*Math.acos(e.w);var t=Math.sqrt(1-e.w*e.w);return 1e-4>t?(this.x=1,this.z=this.y=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this},setAxisAngleFromRotationMatrix:function(e){var t,r,i;e=e.elements;var n=e[0];i=e[4];var o=e[8],a=e[1],s=e[5],h=e[9];r=e[2],t=e[6];var c=e[10];return.01>Math.abs(i-a)&&.01>Math.abs(o-r)&&.01>Math.abs(h-t)?.1>Math.abs(i+a)&&.1>Math.abs(o+r)&&.1>Math.abs(h+t)&&.1>Math.abs(n+s+c-3)?(this.set(1,0,0,0),this):(e=Math.PI,n=(n+1)/2,s=(s+1)/2,c=(c+1)/2,i=(i+a)/4,o=(o+r)/4,h=(h+t)/4,n>s&&n>c?.01>n?(t=0,i=r=.707106781):(t=Math.sqrt(n),r=i/t,i=o/t):s>c?.01>s?(t=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),t=i/r,i=h/r):.01>c?(r=t=.707106781,i=0):(i=Math.sqrt(c),t=o/i,r=h/i),this.set(t,r,i,e),this):(e=Math.sqrt((t-h)*(t-h)+(o-r)*(o-r)+(a-i)*(a-i)),.001>Math.abs(e)&&(e=1),this.x=(t-h)/e,this.y=(o-r)/e,this.z=(a-i)/e,this.w=Math.acos((n+s+c-1)/2),this)},min:function(e){return this.x>e.x&&(this.x=e.x),this.y>e.y&&(this.y=e.y),this.z>e.z&&(this.z=e.z),this.w>e.w&&(this.w=e.w),this},max:function(e){return this.x<e.x&&(this.x=e.x),this.y<e.y&&(this.y=e.y),this.z<e.z&&(this.z=e.z),this.w<e.w&&(this.w=e.w),this},clamp:function(e,t){return this.x<e.x?this.x=e.x:this.x>t.x&&(this.x=t.x),this.y<e.y?this.y=e.y:this.y>t.y&&(this.y=t.y),this.z<e.z?this.z=e.z:this.z>t.z&&(this.z=t.z),this.w<e.w?this.w=e.w:this.w>t.w&&(this.w=t.w),this},clampScalar:function(){var e,t;return function(r,i){return void 0===e&&(e=new THREE.Vector4,t=new THREE.Vector4),e.set(r,r,r,r),t.set(i,i,i,i),this.clamp(e,t)}}(),floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this},ceil:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this},round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this},roundToZero:function(){return this.x=0>this.x?Math.ceil(this.x):Math.floor(this.x),this.y=0>this.y?Math.ceil(this.y):Math.floor(this.y),this.z=0>this.z?Math.ceil(this.z):Math.floor(this.z),this.w=0>this.w?Math.ceil(this.w):Math.floor(this.w),this},negate:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this},dot:function(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)},normalize:function(){return this.divideScalar(this.length())},setLength:function(e){var t=this.length();return 0!==t&&e!==t&&this.multiplyScalar(e/t),this},lerp:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this},lerpVectors:function(e,t,r){return this.subVectors(t,e).multiplyScalar(r).add(e),this},equals:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w},fromArray:function(e,t){return void 0===t&&(t=0),this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this},toArray:function(e,t){return void 0===e&&(e=[]),void 0===t&&(t=0),e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e},fromAttribute:function(e,t,r){return void 0===r&&(r=0),t=t*e.itemSize+r,this.x=e.array[t],this.y=e.array[t+1],this.z=e.array[t+2],this.w=e.array[t+3],this},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)}},THREE.Euler=function(e,t,r,i){this._x=e||0,this._y=t||0,this._z=r||0,this._order=i||THREE.Euler.DefaultOrder},
	THREE.Euler.RotationOrders="XYZ YZX ZXY XZY YXZ ZYX".split(" "),THREE.Euler.DefaultOrder="XYZ",THREE.Euler.prototype={constructor:THREE.Euler,_x:0,_y:0,_z:0,_order:THREE.Euler.DefaultOrder,get x(){return this._x},set x(e){this._x=e,this.onChangeCallback()},get y(){return this._y},set y(e){this._y=e,this.onChangeCallback()},get z(){return this._z},set z(e){this._z=e,this.onChangeCallback()},get order(){return this._order},set order(e){this._order=e,this.onChangeCallback()},set:function(e,t,r,i){return this._x=e,this._y=t,this._z=r,this._order=i||this._order,this.onChangeCallback(),this},copy:function(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this.onChangeCallback(),this},setFromRotationMatrix:function(e,t,r){var i=THREE.Math.clamp,n=e.elements;e=n[0];var o=n[4],a=n[8],s=n[1],h=n[5],c=n[9],l=n[2],u=n[6],n=n[10];return t=t||this._order,"XYZ"===t?(this._y=Math.asin(i(a,-1,1)),.99999>Math.abs(a)?(this._x=Math.atan2(-c,n),this._z=Math.atan2(-o,e)):(this._x=Math.atan2(u,h),this._z=0)):"YXZ"===t?(this._x=Math.asin(-i(c,-1,1)),.99999>Math.abs(c)?(this._y=Math.atan2(a,n),this._z=Math.atan2(s,h)):(this._y=Math.atan2(-l,e),this._z=0)):"ZXY"===t?(this._x=Math.asin(i(u,-1,1)),.99999>Math.abs(u)?(this._y=Math.atan2(-l,n),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(s,e))):"ZYX"===t?(this._y=Math.asin(-i(l,-1,1)),.99999>Math.abs(l)?(this._x=Math.atan2(u,n),this._z=Math.atan2(s,e)):(this._x=0,this._z=Math.atan2(-o,h))):"YZX"===t?(this._z=Math.asin(i(s,-1,1)),.99999>Math.abs(s)?(this._x=Math.atan2(-c,h),this._y=Math.atan2(-l,e)):(this._x=0,this._y=Math.atan2(a,n))):"XZY"===t?(this._z=Math.asin(-i(o,-1,1)),.99999>Math.abs(o)?(this._x=Math.atan2(u,h),this._y=Math.atan2(a,e)):(this._x=Math.atan2(-c,n),this._y=0)):THREE.warn("THREE.Euler: .setFromRotationMatrix() given unsupported order: "+t),this._order=t,!1!==r&&this.onChangeCallback(),this},setFromQuaternion:function(){var e;return function(t,r,i){return void 0===e&&(e=new THREE.Matrix4),e.makeRotationFromQuaternion(t),this.setFromRotationMatrix(e,r,i),this}}(),setFromVector3:function(e,t){return this.set(e.x,e.y,e.z,t||this._order)},reorder:function(){var e=new THREE.Quaternion;return function(t){e.setFromEuler(this),this.setFromQuaternion(e,t)}}(),equals:function(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order},fromArray:function(e){return this._x=e[0],this._y=e[1],this._z=e[2],void 0!==e[3]&&(this._order=e[3]),this.onChangeCallback(),this},toArray:function(e,t){return void 0===e&&(e=[]),void 0===t&&(t=0),e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e},toVector3:function(e){return e?e.set(this._x,this._y,this._z):new THREE.Vector3(this._x,this._y,this._z)},onChange:function(e){return this.onChangeCallback=e,this},onChangeCallback:function(){},clone:function(){return new THREE.Euler(this._x,this._y,this._z,this._order)}},THREE.Line3=function(e,t){this.start=void 0!==e?e:new THREE.Vector3,this.end=void 0!==t?t:new THREE.Vector3},THREE.Line3.prototype={constructor:THREE.Line3,set:function(e,t){return this.start.copy(e),this.end.copy(t),this},copy:function(e){return this.start.copy(e.start),this.end.copy(e.end),this},center:function(e){return(e||new THREE.Vector3).addVectors(this.start,this.end).multiplyScalar(.5)},delta:function(e){return(e||new THREE.Vector3).subVectors(this.end,this.start)},distanceSq:function(){return this.start.distanceToSquared(this.end)},distance:function(){return this.start.distanceTo(this.end)},at:function(e,t){var r=t||new THREE.Vector3;return this.delta(r).multiplyScalar(e).add(this.start)},closestPointToPointParameter:function(){var e=new THREE.Vector3,t=new THREE.Vector3;return function(r,i){e.subVectors(r,this.start),t.subVectors(this.end,this.start);var n=t.dot(t),n=t.dot(e)/n;return i&&(n=THREE.Math.clamp(n,0,1)),n}}(),closestPointToPoint:function(e,t,r){return e=this.closestPointToPointParameter(e,t),r=r||new THREE.Vector3,this.delta(r).multiplyScalar(e).add(this.start)},applyMatrix4:function(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this},equals:function(e){return e.start.equals(this.start)&&e.end.equals(this.end)},clone:function(){return(new THREE.Line3).copy(this)}},THREE.Box2=function(e,t){this.min=void 0!==e?e:new THREE.Vector2(1/0,1/0),this.max=void 0!==t?t:new THREE.Vector2(-(1/0),-(1/0))},THREE.Box2.prototype={constructor:THREE.Box2,set:function(e,t){return this.min.copy(e),this.max.copy(t),this},setFromPoints:function(e){this.makeEmpty();for(var t=0,r=e.length;r>t;t++)this.expandByPoint(e[t]);return this},setFromCenterAndSize:function(){var e=new THREE.Vector2;return function(t,r){var i=e.copy(r).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}}(),copy:function(e){return this.min.copy(e.min),this.max.copy(e.max),this},makeEmpty:function(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-(1/0),this},empty:function(){return this.max.x<this.min.x||this.max.y<this.min.y},center:function(e){return(e||new THREE.Vector2).addVectors(this.min,this.max).multiplyScalar(.5)},size:function(e){return(e||new THREE.Vector2).subVectors(this.max,this.min)},expandByPoint:function(e){return this.min.min(e),this.max.max(e),this},expandByVector:function(e){return this.min.sub(e),this.max.add(e),this},expandByScalar:function(e){return this.min.addScalar(-e),this.max.addScalar(e),this},containsPoint:function(e){return e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y?!1:!0},containsBox:function(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y?!0:!1},getParameter:function(e,t){return(t||new THREE.Vector2).set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))},isIntersectionBox:function(e){return e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y?!1:!0},clampPoint:function(e,t){return(t||new THREE.Vector2).copy(e).clamp(this.min,this.max)},distanceToPoint:function(){var e=new THREE.Vector2;return function(t){return e.copy(t).clamp(this.min,this.max).sub(t).length()}}(),intersect:function(e){return this.min.max(e.min),this.max.min(e.max),this},union:function(e){return this.min.min(e.min),this.max.max(e.max),this},translate:function(e){return this.min.add(e),this.max.add(e),this},equals:function(e){return e.min.equals(this.min)&&e.max.equals(this.max)},clone:function(){return(new THREE.Box2).copy(this)}},THREE.Box3=function(e,t){this.min=void 0!==e?e:new THREE.Vector3(1/0,1/0,1/0),this.max=void 0!==t?t:new THREE.Vector3(-(1/0),-(1/0),-(1/0))},THREE.Box3.prototype={constructor:THREE.Box3,set:function(e,t){return this.min.copy(e),this.max.copy(t),this},setFromPoints:function(e){this.makeEmpty();for(var t=0,r=e.length;r>t;t++)this.expandByPoint(e[t]);return this},setFromCenterAndSize:function(){var e=new THREE.Vector3;return function(t,r){var i=e.copy(r).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}}(),setFromObject:function(){var e=new THREE.Vector3;return function(t){var r=this;return t.updateMatrixWorld(!0),this.makeEmpty(),t.traverse(function(t){var i=t.geometry;if(void 0!==i)if(i instanceof THREE.Geometry)for(var n=i.vertices,i=0,o=n.length;o>i;i++)e.copy(n[i]),e.applyMatrix4(t.matrixWorld),r.expandByPoint(e);else if(i instanceof THREE.BufferGeometry&&void 0!==i.attributes.position)for(n=i.attributes.position.array,i=0,o=n.length;o>i;i+=3)e.set(n[i],n[i+1],n[i+2]),e.applyMatrix4(t.matrixWorld),r.expandByPoint(e)}),this}}(),copy:function(e){return this.min.copy(e.min),this.max.copy(e.max),this},makeEmpty:function(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-(1/0),this},empty:function(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z},center:function(e){return(e||new THREE.Vector3).addVectors(this.min,this.max).multiplyScalar(.5)},size:function(e){return(e||new THREE.Vector3).subVectors(this.max,this.min)},expandByPoint:function(e){return this.min.min(e),this.max.max(e),this},expandByVector:function(e){return this.min.sub(e),this.max.add(e),this},expandByScalar:function(e){return this.min.addScalar(-e),this.max.addScalar(e),this},containsPoint:function(e){return e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z?!1:!0},containsBox:function(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z?!0:!1},getParameter:function(e,t){return(t||new THREE.Vector3).set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))},isIntersectionBox:function(e){return e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z?!1:!0},clampPoint:function(e,t){return(t||new THREE.Vector3).copy(e).clamp(this.min,this.max)},distanceToPoint:function(){var e=new THREE.Vector3;return function(t){return e.copy(t).clamp(this.min,this.max).sub(t).length()}}(),getBoundingSphere:function(){var e=new THREE.Vector3;return function(t){return t=t||new THREE.Sphere,t.center=this.center(),t.radius=.5*this.size(e).length(),t}}(),intersect:function(e){return this.min.max(e.min),this.max.min(e.max),this},union:function(e){return this.min.min(e.min),this.max.max(e.max),this},applyMatrix4:function(){var e=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];return function(t){return e[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),e[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),e[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),e[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),e[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),e[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),e[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),e[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.makeEmpty(),this.setFromPoints(e),this}}(),translate:function(e){return this.min.add(e),this.max.add(e),this},equals:function(e){return e.min.equals(this.min)&&e.max.equals(this.max)},clone:function(){return(new THREE.Box3).copy(this)}},THREE.Matrix3=function(){this.elements=new Float32Array([1,0,0,0,1,0,0,0,1]),0<arguments.length&&THREE.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.")},THREE.Matrix3.prototype={constructor:THREE.Matrix3,set:function(e,t,r,i,n,o,a,s,h){var c=this.elements;return c[0]=e,c[3]=t,c[6]=r,c[1]=i,c[4]=n,c[7]=o,c[2]=a,c[5]=s,c[8]=h,this},identity:function(){return this.set(1,0,0,0,1,0,0,0,1),this},copy:function(e){return e=e.elements,this.set(e[0],e[3],e[6],e[1],e[4],e[7],e[2],e[5],e[8]),this},multiplyVector3:function(e){return THREE.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."),e.applyMatrix3(this)},multiplyVector3Array:function(e){return THREE.warn("THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead."),this.applyToVector3Array(e)},applyToVector3Array:function(){var e=new THREE.Vector3;return function(t,r,i){void 0===r&&(r=0),void 0===i&&(i=t.length);for(var n=0;i>n;n+=3,r+=3)e.x=t[r],e.y=t[r+1],e.z=t[r+2],e.applyMatrix3(this),t[r]=e.x,t[r+1]=e.y,t[r+2]=e.z;return t}}(),multiplyScalar:function(e){var t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this},determinant:function(){var e=this.elements,t=e[0],r=e[1],i=e[2],n=e[3],o=e[4],a=e[5],s=e[6],h=e[7],e=e[8];return t*o*e-t*a*h-r*n*e+r*a*s+i*n*h-i*o*s},getInverse:function(e,t){var r=e.elements,i=this.elements;if(i[0]=r[10]*r[5]-r[6]*r[9],i[1]=-r[10]*r[1]+r[2]*r[9],i[2]=r[6]*r[1]-r[2]*r[5],i[3]=-r[10]*r[4]+r[6]*r[8],i[4]=r[10]*r[0]-r[2]*r[8],i[5]=-r[6]*r[0]+r[2]*r[4],i[6]=r[9]*r[4]-r[5]*r[8],i[7]=-r[9]*r[0]+r[1]*r[8],i[8]=r[5]*r[0]-r[1]*r[4],r=r[0]*i[0]+r[1]*i[3]+r[2]*i[6],0===r){if(t)throw Error("Matrix3.getInverse(): can't invert matrix, determinant is 0");return THREE.warn("Matrix3.getInverse(): can't invert matrix, determinant is 0"),this.identity(),this}return this.multiplyScalar(1/r),this},transpose:function(){var e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this},flattenToArrayOffset:function(e,t){var r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e},getNormalMatrix:function(e){return this.getInverse(e).transpose(),this},transposeIntoArray:function(e){var t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this},fromArray:function(e){return this.elements.set(e),this},toArray:function(){var e=this.elements;return[e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8]]},clone:function(){return(new THREE.Matrix3).fromArray(this.elements)}},THREE.Matrix4=function(){this.elements=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),0<arguments.length&&THREE.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.")},THREE.Matrix4.prototype={constructor:THREE.Matrix4,set:function(e,t,r,i,n,o,a,s,h,c,l,u,E,p,d,f){var m=this.elements;return m[0]=e,m[4]=t,m[8]=r,m[12]=i,m[1]=n,m[5]=o,m[9]=a,m[13]=s,m[2]=h,m[6]=c,m[10]=l,m[14]=u,m[3]=E,m[7]=p,m[11]=d,m[15]=f,this},identity:function(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this},copy:function(e){return this.elements.set(e.elements),this},extractPosition:function(e){return THREE.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."),this.copyPosition(e)},copyPosition:function(e){var t=this.elements;return e=e.elements,t[12]=e[12],t[13]=e[13],t[14]=e[14],this},extractBasis:function(e,t,r){var i=this.elements;return e.set(i[0],i[1],i[2]),t.set(i[4],i[5],i[6]),r.set(i[8],i[9],i[10]),this},makeBasis:function(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this},extractRotation:function(){var e=new THREE.Vector3;return function(t){var r=this.elements;t=t.elements;var i=1/e.set(t[0],t[1],t[2]).length(),n=1/e.set(t[4],t[5],t[6]).length(),o=1/e.set(t[8],t[9],t[10]).length();return r[0]=t[0]*i,r[1]=t[1]*i,r[2]=t[2]*i,r[4]=t[4]*n,r[5]=t[5]*n,r[6]=t[6]*n,r[8]=t[8]*o,r[9]=t[9]*o,r[10]=t[10]*o,this}}(),makeRotationFromEuler:function(e){!1==e instanceof THREE.Euler&&THREE.error("THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");var t=this.elements,r=e.x,i=e.y,n=e.z,o=Math.cos(r),r=Math.sin(r),a=Math.cos(i),i=Math.sin(i),s=Math.cos(n),n=Math.sin(n);if("XYZ"===e.order){e=o*s;var h=o*n,c=r*s,l=r*n;t[0]=a*s,t[4]=-a*n,t[8]=i,t[1]=h+c*i,t[5]=e-l*i,t[9]=-r*a,t[2]=l-e*i,t[6]=c+h*i,t[10]=o*a}else"YXZ"===e.order?(e=a*s,h=a*n,c=i*s,l=i*n,t[0]=e+l*r,t[4]=c*r-h,t[8]=o*i,t[1]=o*n,t[5]=o*s,t[9]=-r,t[2]=h*r-c,t[6]=l+e*r,t[10]=o*a):"ZXY"===e.order?(e=a*s,h=a*n,c=i*s,l=i*n,t[0]=e-l*r,t[4]=-o*n,t[8]=c+h*r,t[1]=h+c*r,t[5]=o*s,t[9]=l-e*r,t[2]=-o*i,t[6]=r,t[10]=o*a):"ZYX"===e.order?(e=o*s,h=o*n,c=r*s,l=r*n,t[0]=a*s,t[4]=c*i-h,t[8]=e*i+l,t[1]=a*n,t[5]=l*i+e,t[9]=h*i-c,t[2]=-i,t[6]=r*a,t[10]=o*a):"YZX"===e.order?(e=o*a,h=o*i,c=r*a,l=r*i,t[0]=a*s,t[4]=l-e*n,t[8]=c*n+h,t[1]=n,t[5]=o*s,t[9]=-r*s,t[2]=-i*s,t[6]=h*n+c,t[10]=e-l*n):"XZY"===e.order&&(e=o*a,h=o*i,c=r*a,l=r*i,t[0]=a*s,t[4]=-n,t[8]=i*s,t[1]=e*n+l,t[5]=o*s,t[9]=h*n-c,t[2]=c*n-h,t[6]=r*s,t[10]=l*n+e);return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this},setRotationFromQuaternion:function(e){return THREE.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion()."),this.makeRotationFromQuaternion(e)},makeRotationFromQuaternion:function(e){var t=this.elements,r=e.x,i=e.y,n=e.z,o=e.w,a=r+r,s=i+i,h=n+n;e=r*a;var c=r*s,r=r*h,l=i*s,i=i*h,n=n*h,a=o*a,s=o*s,o=o*h;return t[0]=1-(l+n),t[4]=c-o,t[8]=r+s,t[1]=c+o,t[5]=1-(e+n),t[9]=i-a,t[2]=r-s,t[6]=i+a,t[10]=1-(e+l),t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this},lookAt:function(){var e=new THREE.Vector3,t=new THREE.Vector3,r=new THREE.Vector3;return function(i,n,o){var a=this.elements;return r.subVectors(i,n).normalize(),0===r.length()&&(r.z=1),e.crossVectors(o,r).normalize(),0===e.length()&&(r.x+=1e-4,e.crossVectors(o,r).normalize()),t.crossVectors(r,e),a[0]=e.x,a[4]=t.x,a[8]=r.x,a[1]=e.y,a[5]=t.y,a[9]=r.y,a[2]=e.z,a[6]=t.z,a[10]=r.z,this}}(),multiply:function(e,t){return void 0!==t?(THREE.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."),this.multiplyMatrices(e,t)):this.multiplyMatrices(this,e)},multiplyMatrices:function(e,t){var r=e.elements,i=t.elements,n=this.elements,o=r[0],a=r[4],s=r[8],h=r[12],c=r[1],l=r[5],u=r[9],E=r[13],p=r[2],d=r[6],f=r[10],m=r[14],T=r[3],g=r[7],R=r[11],r=r[15],y=i[0],v=i[4],H=i[8],x=i[12],b=i[1],w=i[5],_=i[9],M=i[13],S=i[2],A=i[6],C=i[10],L=i[14],P=i[3],F=i[7],D=i[11],i=i[15];return n[0]=o*y+a*b+s*S+h*P,n[4]=o*v+a*w+s*A+h*F,n[8]=o*H+a*_+s*C+h*D,n[12]=o*x+a*M+s*L+h*i,n[1]=c*y+l*b+u*S+E*P,n[5]=c*v+l*w+u*A+E*F,n[9]=c*H+l*_+u*C+E*D,n[13]=c*x+l*M+u*L+E*i,n[2]=p*y+d*b+f*S+m*P,n[6]=p*v+d*w+f*A+m*F,n[10]=p*H+d*_+f*C+m*D,n[14]=p*x+d*M+f*L+m*i,n[3]=T*y+g*b+R*S+r*P,n[7]=T*v+g*w+R*A+r*F,n[11]=T*H+g*_+R*C+r*D,n[15]=T*x+g*M+R*L+r*i,this},multiplyToArray:function(e,t,r){var i=this.elements;return this.multiplyMatrices(e,t),r[0]=i[0],r[1]=i[1],r[2]=i[2],r[3]=i[3],r[4]=i[4],r[5]=i[5],r[6]=i[6],r[7]=i[7],r[8]=i[8],r[9]=i[9],r[10]=i[10],r[11]=i[11],r[12]=i[12],r[13]=i[13],r[14]=i[14],r[15]=i[15],this},multiplyScalar:function(e){var t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this},multiplyVector3:function(e){return THREE.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead."),e.applyProjection(this)},multiplyVector4:function(e){return THREE.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead."),e.applyMatrix4(this)},multiplyVector3Array:function(e){return THREE.warn("THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead."),this.applyToVector3Array(e)},applyToVector3Array:function(){var e=new THREE.Vector3;return function(t,r,i){void 0===r&&(r=0),void 0===i&&(i=t.length);for(var n=0;i>n;n+=3,r+=3)e.x=t[r],e.y=t[r+1],e.z=t[r+2],e.applyMatrix4(this),t[r]=e.x,t[r+1]=e.y,t[r+2]=e.z;return t}}(),rotateAxis:function(e){THREE.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead."),e.transformDirection(this)},crossVector:function(e){return THREE.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead."),e.applyMatrix4(this)},determinant:function(){var e=this.elements,t=e[0],r=e[4],i=e[8],n=e[12],o=e[1],a=e[5],s=e[9],h=e[13],c=e[2],l=e[6],u=e[10],E=e[14];return e[3]*(+n*s*l-i*h*l-n*a*u+r*h*u+i*a*E-r*s*E)+e[7]*(+t*s*E-t*h*u+n*o*u-i*o*E+i*h*c-n*s*c)+e[11]*(+t*h*l-t*a*E-n*o*l+r*o*E+n*a*c-r*h*c)+e[15]*(-i*a*c-t*s*l+t*a*u+i*o*l-r*o*u+r*s*c)},transpose:function(){var e,t=this.elements;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this},flattenToArrayOffset:function(e,t){var r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e},getPosition:function(){var e=new THREE.Vector3;return function(){THREE.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.");var t=this.elements;return e.set(t[12],t[13],t[14])}}(),setPosition:function(e){var t=this.elements;return t[12]=e.x,t[13]=e.y,t[14]=e.z,this},getInverse:function(e,t){var r=this.elements,i=e.elements,n=i[0],o=i[4],a=i[8],s=i[12],h=i[1],c=i[5],l=i[9],u=i[13],E=i[2],p=i[6],d=i[10],f=i[14],m=i[3],T=i[7],g=i[11],i=i[15];if(r[0]=l*f*T-u*d*T+u*p*g-c*f*g-l*p*i+c*d*i,r[4]=s*d*T-a*f*T-s*p*g+o*f*g+a*p*i-o*d*i,r[8]=a*u*T-s*l*T+s*c*g-o*u*g-a*c*i+o*l*i,r[12]=s*l*p-a*u*p-s*c*d+o*u*d+a*c*f-o*l*f,r[1]=u*d*m-l*f*m-u*E*g+h*f*g+l*E*i-h*d*i,r[5]=a*f*m-s*d*m+s*E*g-n*f*g-a*E*i+n*d*i,r[9]=s*l*m-a*u*m-s*h*g+n*u*g+a*h*i-n*l*i,r[13]=a*u*E-s*l*E+s*h*d-n*u*d-a*h*f+n*l*f,r[2]=c*f*m-u*p*m+u*E*T-h*f*T-c*E*i+h*p*i,r[6]=s*p*m-o*f*m-s*E*T+n*f*T+o*E*i-n*p*i,r[10]=o*u*m-s*c*m+s*h*T-n*u*T-o*h*i+n*c*i,r[14]=s*c*E-o*u*E-s*h*p+n*u*p+o*h*f-n*c*f,r[3]=l*p*m-c*d*m-l*E*T+h*d*T+c*E*g-h*p*g,r[7]=o*d*m-a*p*m+a*E*T-n*d*T-o*E*g+n*p*g,r[11]=a*c*m-o*l*m-a*h*T+n*l*T+o*h*g-n*c*g,r[15]=o*l*E-a*c*E+a*h*p-n*l*p-o*h*d+n*c*d,r=n*r[0]+h*r[4]+E*r[8]+m*r[12],0==r){if(t)throw Error("THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0");return THREE.warn("THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0"),this.identity(),this}return this.multiplyScalar(1/r),this},translate:function(e){THREE.error("THREE.Matrix4: .translate() has been removed.")},rotateX:function(e){THREE.error("THREE.Matrix4: .rotateX() has been removed.")},rotateY:function(e){THREE.error("THREE.Matrix4: .rotateY() has been removed.")},rotateZ:function(e){THREE.error("THREE.Matrix4: .rotateZ() has been removed.")},rotateByAxis:function(e,t){THREE.error("THREE.Matrix4: .rotateByAxis() has been removed.")},scale:function(e){var t=this.elements,r=e.x,i=e.y;return e=e.z,t[0]*=r,t[4]*=i,t[8]*=e,t[1]*=r,t[5]*=i,t[9]*=e,t[2]*=r,t[6]*=i,t[10]*=e,t[3]*=r,t[7]*=i,t[11]*=e,this},getMaxScaleOnAxis:function(){var e=this.elements;return Math.sqrt(Math.max(e[0]*e[0]+e[1]*e[1]+e[2]*e[2],Math.max(e[4]*e[4]+e[5]*e[5]+e[6]*e[6],e[8]*e[8]+e[9]*e[9]+e[10]*e[10])))},makeTranslation:function(e,t,r){return this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this},makeRotationX:function(e){var t=Math.cos(e);return e=Math.sin(e),this.set(1,0,0,0,0,t,-e,0,0,e,t,0,0,0,0,1),this},makeRotationY:function(e){var t=Math.cos(e);return e=Math.sin(e),this.set(t,0,e,0,0,1,0,0,-e,0,t,0,0,0,0,1),this},makeRotationZ:function(e){var t=Math.cos(e);return e=Math.sin(e),this.set(t,-e,0,0,e,t,0,0,0,0,1,0,0,0,0,1),this},makeRotationAxis:function(e,t){var r=Math.cos(t),i=Math.sin(t),n=1-r,o=e.x,a=e.y,s=e.z,h=n*o,c=n*a;return this.set(h*o+r,h*a-i*s,h*s+i*a,0,h*a+i*s,c*a+r,c*s-i*o,0,h*s-i*a,c*s+i*o,n*s*s+r,0,0,0,0,1),this},makeScale:function(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this},compose:function(e,t,r){return this.makeRotationFromQuaternion(t),this.scale(r),this.setPosition(e),this},decompose:function(){var e=new THREE.Vector3,t=new THREE.Matrix4;return function(r,i,n){var o=this.elements,a=e.set(o[0],o[1],o[2]).length(),s=e.set(o[4],o[5],o[6]).length(),h=e.set(o[8],o[9],o[10]).length();0>this.determinant()&&(a=-a),r.x=o[12],r.y=o[13],r.z=o[14],t.elements.set(this.elements),r=1/a;var o=1/s,c=1/h;return t.elements[0]*=r,t.elements[1]*=r,t.elements[2]*=r,t.elements[4]*=o,t.elements[5]*=o,t.elements[6]*=o,t.elements[8]*=c,t.elements[9]*=c,t.elements[10]*=c,i.setFromRotationMatrix(t),n.x=a,n.y=s,n.z=h,this}}(),makeFrustum:function(e,t,r,i,n,o){var a=this.elements;return a[0]=2*n/(t-e),a[4]=0,a[8]=(t+e)/(t-e),a[12]=0,a[1]=0,a[5]=2*n/(i-r),a[9]=(i+r)/(i-r),a[13]=0,a[2]=0,a[6]=0,a[10]=-(o+n)/(o-n),a[14]=-2*o*n/(o-n),a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this},makePerspective:function(e,t,r,i){e=r*Math.tan(THREE.Math.degToRad(.5*e));var n=-e;return this.makeFrustum(n*t,e*t,n,e,r,i)},makeOrthographic:function(e,t,r,i,n,o){var a=this.elements,s=t-e,h=r-i,c=o-n;return a[0]=2/s,a[4]=0,a[8]=0,a[12]=-((t+e)/s),a[1]=0,a[5]=2/h,a[9]=0,a[13]=-((r+i)/h),a[2]=0,a[6]=0,a[10]=-2/c,a[14]=-((o+n)/c),a[3]=0,a[7]=0,a[11]=0,a[15]=1,this},fromArray:function(e){return this.elements.set(e),this},toArray:function(){var e=this.elements;return[e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8],e[9],e[10],e[11],e[12],e[13],e[14],e[15]]},clone:function(){return(new THREE.Matrix4).fromArray(this.elements)}},THREE.Ray=function(e,t){this.origin=void 0!==e?e:new THREE.Vector3,this.direction=void 0!==t?t:new THREE.Vector3},THREE.Ray.prototype={constructor:THREE.Ray,set:function(e,t){return this.origin.copy(e),this.direction.copy(t),this},copy:function(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this},at:function(e,t){return(t||new THREE.Vector3).copy(this.direction).multiplyScalar(e).add(this.origin)},recast:function(){var e=new THREE.Vector3;return function(t){return this.origin.copy(this.at(t,e)),this}}(),closestPointToPoint:function(e,t){var r=t||new THREE.Vector3;r.subVectors(e,this.origin);var i=r.dot(this.direction);return 0>i?r.copy(this.origin):r.copy(this.direction).multiplyScalar(i).add(this.origin)},distanceToPoint:function(){var e=new THREE.Vector3;return function(t){var r=e.subVectors(t,this.origin).dot(this.direction);return 0>r?this.origin.distanceTo(t):(e.copy(this.direction).multiplyScalar(r).add(this.origin),e.distanceTo(t))}}(),distanceSqToSegment:function(){var e=new THREE.Vector3,t=new THREE.Vector3,r=new THREE.Vector3;return function(i,n,o,a){e.copy(i).add(n).multiplyScalar(.5),t.copy(n).sub(i).normalize(),r.copy(this.origin).sub(e);var s,h=.5*i.distanceTo(n),c=-this.direction.dot(t),l=r.dot(this.direction),u=-r.dot(t),E=r.lengthSq(),p=Math.abs(1-c*c);return p>0?(i=c*u-l,n=c*l-u,s=h*p,i>=0?n>=-s?s>=n?(h=1/p,i*=h,n*=h,c=i*(i+c*n+2*l)+n*(c*i+n+2*u)+E):(n=h,i=Math.max(0,-(c*n+l)),c=-i*i+n*(n+2*u)+E):(n=-h,i=Math.max(0,-(c*n+l)),c=-i*i+n*(n+2*u)+E):-s>=n?(i=Math.max(0,-(-c*h+l)),n=i>0?-h:Math.min(Math.max(-h,-u),h),c=-i*i+n*(n+2*u)+E):s>=n?(i=0,n=Math.min(Math.max(-h,-u),h),c=n*(n+2*u)+E):(i=Math.max(0,-(c*h+l)),n=i>0?h:Math.min(Math.max(-h,-u),h),c=-i*i+n*(n+2*u)+E)):(n=c>0?-h:h,i=Math.max(0,-(c*n+l)),c=-i*i+n*(n+2*u)+E),o&&o.copy(this.direction).multiplyScalar(i).add(this.origin),a&&a.copy(t).multiplyScalar(n).add(e),c}}(),isIntersectionSphere:function(e){return this.distanceToPoint(e.center)<=e.radius},intersectSphere:function(){var e=new THREE.Vector3;return function(t,r){e.subVectors(t.center,this.origin);var i=e.dot(this.direction),n=e.dot(e)-i*i,o=t.radius*t.radius;return n>o?null:(o=Math.sqrt(o-n),n=i-o,i+=o,0>n&&0>i?null:0>n?this.at(i,r):this.at(n,r))}}(),isIntersectionPlane:function(e){var t=e.distanceToPoint(this.origin);return 0===t||0>e.normal.dot(this.direction)*t?!0:!1},distanceToPlane:function(e){var t=e.normal.dot(this.direction);return 0==t?0==e.distanceToPoint(this.origin)?0:null:(e=-(this.origin.dot(e.normal)+e.constant)/t,e>=0?e:null)},intersectPlane:function(e,t){var r=this.distanceToPlane(e);return null===r?null:this.at(r,t)},isIntersectionBox:function(){var e=new THREE.Vector3;return function(t){return null!==this.intersectBox(t,e)}}(),intersectBox:function(e,t){var r,i,n,o,a;i=1/this.direction.x,o=1/this.direction.y,a=1/this.direction.z;var s=this.origin;return i>=0?(r=(e.min.x-s.x)*i,i*=e.max.x-s.x):(r=(e.max.x-s.x)*i,i*=e.min.x-s.x),o>=0?(n=(e.min.y-s.y)*o,o*=e.max.y-s.y):(n=(e.max.y-s.y)*o,o*=e.min.y-s.y),r>o||n>i?null:((n>r||r!==r)&&(r=n),(i>o||i!==i)&&(i=o),a>=0?(n=(e.min.z-s.z)*a,a*=e.max.z-s.z):(n=(e.max.z-s.z)*a,a*=e.min.z-s.z),r>a||n>i?null:((n>r||r!==r)&&(r=n),(i>a||i!==i)&&(i=a),0>i?null:this.at(r>=0?r:i,t)))},intersectTriangle:function(){var e=new THREE.Vector3,t=new THREE.Vector3,r=new THREE.Vector3,i=new THREE.Vector3;return function(n,o,a,s,h){if(t.subVectors(o,n),r.subVectors(a,n),i.crossVectors(t,r),o=this.direction.dot(i),o>0){if(s)return null;s=1}else{if(!(0>o))return null;s=-1,o=-o}return e.subVectors(this.origin,n),n=s*this.direction.dot(r.crossVectors(e,r)),0>n?null:(a=s*this.direction.dot(t.cross(e)),0>a||n+a>o?null:(n=-s*e.dot(i),0>n?null:this.at(n/o,h)))}}(),applyMatrix4:function(e){return this.direction.add(this.origin).applyMatrix4(e),this.origin.applyMatrix4(e),this.direction.sub(this.origin),this.direction.normalize(),this},equals:function(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)},clone:function(){return(new THREE.Ray).copy(this)}},THREE.Sphere=function(e,t){this.center=void 0!==e?e:new THREE.Vector3,this.radius=void 0!==t?t:0},THREE.Sphere.prototype={constructor:THREE.Sphere,set:function(e,t){return this.center.copy(e),this.radius=t,this},setFromPoints:function(){var e=new THREE.Box3;return function(t,r){var i=this.center;void 0!==r?i.copy(r):e.setFromPoints(t).center(i);for(var n=0,o=0,a=t.length;a>o;o++)n=Math.max(n,i.distanceToSquared(t[o]));return this.radius=Math.sqrt(n),this}}(),copy:function(e){return this.center.copy(e.center),this.radius=e.radius,this},empty:function(){return 0>=this.radius},containsPoint:function(e){return e.distanceToSquared(this.center)<=this.radius*this.radius},distanceToPoint:function(e){return e.distanceTo(this.center)-this.radius},intersectsSphere:function(e){var t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t},clampPoint:function(e,t){var r=this.center.distanceToSquared(e),i=t||new THREE.Vector3;return i.copy(e),r>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i},getBoundingBox:function(e){return e=e||new THREE.Box3,e.set(this.center,this.center),e.expandByScalar(this.radius),e},applyMatrix4:function(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this},translate:function(e){return this.center.add(e),this},equals:function(e){return e.center.equals(this.center)&&e.radius===this.radius},clone:function(){return(new THREE.Sphere).copy(this)}},THREE.Frustum=function(e,t,r,i,n,o){this.planes=[void 0!==e?e:new THREE.Plane,void 0!==t?t:new THREE.Plane,void 0!==r?r:new THREE.Plane,void 0!==i?i:new THREE.Plane,void 0!==n?n:new THREE.Plane,void 0!==o?o:new THREE.Plane]},THREE.Frustum.prototype={constructor:THREE.Frustum,set:function(e,t,r,i,n,o){var a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(r),a[3].copy(i),a[4].copy(n),a[5].copy(o),this},copy:function(e){for(var t=this.planes,r=0;6>r;r++)t[r].copy(e.planes[r]);return this},setFromMatrix:function(e){var t=this.planes,r=e.elements;e=r[0];var i=r[1],n=r[2],o=r[3],a=r[4],s=r[5],h=r[6],c=r[7],l=r[8],u=r[9],E=r[10],p=r[11],d=r[12],f=r[13],m=r[14],r=r[15];return t[0].setComponents(o-e,c-a,p-l,r-d).normalize(),t[1].setComponents(o+e,c+a,p+l,r+d).normalize(),t[2].setComponents(o+i,c+s,p+u,r+f).normalize(),t[3].setComponents(o-i,c-s,p-u,r-f).normalize(),t[4].setComponents(o-n,c-h,p-E,r-m).normalize(),t[5].setComponents(o+n,c+h,p+E,r+m).normalize(),this},intersectsObject:function(){var e=new THREE.Sphere;return function(t){var r=t.geometry;return null===r.boundingSphere&&r.computeBoundingSphere(),e.copy(r.boundingSphere),e.applyMatrix4(t.matrixWorld),this.intersectsSphere(e)}}(),intersectsSphere:function(e){var t=this.planes,r=e.center;e=-e.radius;for(var i=0;6>i;i++)if(t[i].distanceToPoint(r)<e)return!1;return!0},intersectsBox:function(){var e=new THREE.Vector3,t=new THREE.Vector3;return function(r){for(var i=this.planes,n=0;6>n;n++){var o=i[n];e.x=0<o.normal.x?r.min.x:r.max.x,t.x=0<o.normal.x?r.max.x:r.min.x,e.y=0<o.normal.y?r.min.y:r.max.y,t.y=0<o.normal.y?r.max.y:r.min.y,e.z=0<o.normal.z?r.min.z:r.max.z,t.z=0<o.normal.z?r.max.z:r.min.z;var a=o.distanceToPoint(e),o=o.distanceToPoint(t);if(0>a&&0>o)return!1}return!0}}(),containsPoint:function(e){for(var t=this.planes,r=0;6>r;r++)if(0>t[r].distanceToPoint(e))return!1;return!0},clone:function(){return(new THREE.Frustum).copy(this)}},THREE.Plane=function(e,t){this.normal=void 0!==e?e:new THREE.Vector3(1,0,0),this.constant=void 0!==t?t:0},THREE.Plane.prototype={constructor:THREE.Plane,set:function(e,t){return this.normal.copy(e),this.constant=t,this},setComponents:function(e,t,r,i){return this.normal.set(e,t,r),this.constant=i,this},setFromNormalAndCoplanarPoint:function(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this},setFromCoplanarPoints:function(){
	var e=new THREE.Vector3,t=new THREE.Vector3;return function(r,i,n){return i=e.subVectors(n,i).cross(t.subVectors(r,i)).normalize(),this.setFromNormalAndCoplanarPoint(i,r),this}}(),copy:function(e){return this.normal.copy(e.normal),this.constant=e.constant,this},normalize:function(){var e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this},negate:function(){return this.constant*=-1,this.normal.negate(),this},distanceToPoint:function(e){return this.normal.dot(e)+this.constant},distanceToSphere:function(e){return this.distanceToPoint(e.center)-e.radius},projectPoint:function(e,t){return this.orthoPoint(e,t).sub(e).negate()},orthoPoint:function(e,t){var r=this.distanceToPoint(e);return(t||new THREE.Vector3).copy(this.normal).multiplyScalar(r)},isIntersectionLine:function(e){var t=this.distanceToPoint(e.start);return e=this.distanceToPoint(e.end),0>t&&e>0||0>e&&t>0},intersectLine:function(){var e=new THREE.Vector3;return function(t,r){var i=r||new THREE.Vector3,n=t.delta(e),o=this.normal.dot(n);return 0!=o?(o=-(t.start.dot(this.normal)+this.constant)/o,0>o||o>1?void 0:i.copy(n).multiplyScalar(o).add(t.start)):0==this.distanceToPoint(t.start)?i.copy(t.start):void 0}}(),coplanarPoint:function(e){return(e||new THREE.Vector3).copy(this.normal).multiplyScalar(-this.constant)},applyMatrix4:function(){var e=new THREE.Vector3,t=new THREE.Vector3,r=new THREE.Matrix3;return function(i,n){var o=n||r.getNormalMatrix(i),o=e.copy(this.normal).applyMatrix3(o),a=this.coplanarPoint(t);return a.applyMatrix4(i),this.setFromNormalAndCoplanarPoint(o,a),this}}(),translate:function(e){return this.constant-=e.dot(this.normal),this},equals:function(e){return e.normal.equals(this.normal)&&e.constant==this.constant},clone:function(){return(new THREE.Plane).copy(this)}},THREE.Math={generateUUID:function(){var e,t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),r=Array(36),i=0;return function(){for(var n=0;36>n;n++)8==n||13==n||18==n||23==n?r[n]="-":14==n?r[n]="4":(2>=i&&(i=33554432+16777216*Math.random()|0),e=15&i,i>>=4,r[n]=t[19==n?3&e|8:e]);return r.join("")}}(),clamp:function(e,t,r){return t>e?t:e>r?r:e},clampBottom:function(e,t){return t>e?t:e},mapLinear:function(e,t,r,i,n){return i+(e-t)*(n-i)/(r-t)},smoothstep:function(e,t,r){return t>=e?0:e>=r?1:(e=(e-t)/(r-t),e*e*(3-2*e))},smootherstep:function(e,t,r){return t>=e?0:e>=r?1:(e=(e-t)/(r-t),e*e*e*(e*(6*e-15)+10))},random16:function(){return(65280*Math.random()+255*Math.random())/65535},randInt:function(e,t){return Math.floor(this.randFloat(e,t))},randFloat:function(e,t){return e+Math.random()*(t-e)},randFloatSpread:function(e){return e*(.5-Math.random())},degToRad:function(){var e=Math.PI/180;return function(t){return t*e}}(),radToDeg:function(){var e=180/Math.PI;return function(t){return t*e}}(),isPowerOfTwo:function(e){return 0===(e&e-1)&&0!==e},nextPowerOfTwo:function(e){return e--,e|=e>>1,e|=e>>2,e|=e>>4,e|=e>>8,e|=e>>16,e++,e}},THREE.Spline=function(e){function t(e,t,r,i,n,o,a){return e=.5*(r-e),i=.5*(i-t),(2*(t-r)+e+i)*a+(-3*(t-r)-2*e-i)*o+e*n+t}this.points=e;var r,i,n,o,a,s,h,c,l,u=[],E={x:0,y:0,z:0};this.initFromArray=function(e){this.points=[];for(var t=0;t<e.length;t++)this.points[t]={x:e[t][0],y:e[t][1],z:e[t][2]}},this.getPoint=function(e){return r=(this.points.length-1)*e,i=Math.floor(r),n=r-i,u[0]=0===i?i:i-1,u[1]=i,u[2]=i>this.points.length-2?this.points.length-1:i+1,u[3]=i>this.points.length-3?this.points.length-1:i+2,s=this.points[u[0]],h=this.points[u[1]],c=this.points[u[2]],l=this.points[u[3]],o=n*n,a=n*o,E.x=t(s.x,h.x,c.x,l.x,n,o,a),E.y=t(s.y,h.y,c.y,l.y,n,o,a),E.z=t(s.z,h.z,c.z,l.z,n,o,a),E},this.getControlPointsArray=function(){var e,t,r=this.points.length,i=[];for(e=0;r>e;e++)t=this.points[e],i[e]=[t.x,t.y,t.z];return i},this.getLength=function(e){var t,r,i,n=t=t=0,o=new THREE.Vector3,a=new THREE.Vector3,s=[],h=0;for(s[0]=0,e||(e=100),r=this.points.length*e,o.copy(this.points[0]),e=1;r>e;e++)t=e/r,i=this.getPoint(t),a.copy(i),h+=a.distanceTo(o),o.copy(i),t*=this.points.length-1,t=Math.floor(t),t!=n&&(s[t]=h,n=t);return s[s.length]=h,{chunks:s,total:h}},this.reparametrizeByArcLength=function(e){var t,r,i,n,o,a,s=[],h=new THREE.Vector3,c=this.getLength();for(s.push(h.copy(this.points[0]).clone()),t=1;t<this.points.length;t++){for(r=c.chunks[t]-c.chunks[t-1],a=Math.ceil(e*r/c.total),n=(t-1)/(this.points.length-1),o=t/(this.points.length-1),r=1;a-1>r;r++)i=n+1/a*r*(o-n),i=this.getPoint(i),s.push(h.copy(i).clone());s.push(h.copy(this.points[t]).clone())}this.points=s}},THREE.Triangle=function(e,t,r){this.a=void 0!==e?e:new THREE.Vector3,this.b=void 0!==t?t:new THREE.Vector3,this.c=void 0!==r?r:new THREE.Vector3},THREE.Triangle.normal=function(){var e=new THREE.Vector3;return function(t,r,i,n){return n=n||new THREE.Vector3,n.subVectors(i,r),e.subVectors(t,r),n.cross(e),t=n.lengthSq(),t>0?n.multiplyScalar(1/Math.sqrt(t)):n.set(0,0,0)}}(),THREE.Triangle.barycoordFromPoint=function(){var e=new THREE.Vector3,t=new THREE.Vector3,r=new THREE.Vector3;return function(i,n,o,a,s){e.subVectors(a,n),t.subVectors(o,n),r.subVectors(i,n),i=e.dot(e),n=e.dot(t),o=e.dot(r);var h=t.dot(t);a=t.dot(r);var c=i*h-n*n;return s=s||new THREE.Vector3,0==c?s.set(-2,-1,-1):(c=1/c,h=(h*o-n*a)*c,i=(i*a-n*o)*c,s.set(1-h-i,i,h))}}(),THREE.Triangle.containsPoint=function(){var e=new THREE.Vector3;return function(t,r,i,n){return t=THREE.Triangle.barycoordFromPoint(t,r,i,n,e),0<=t.x&&0<=t.y&&1>=t.x+t.y}}(),THREE.Triangle.prototype={constructor:THREE.Triangle,set:function(e,t,r){return this.a.copy(e),this.b.copy(t),this.c.copy(r),this},setFromPointsAndIndices:function(e,t,r,i){return this.a.copy(e[t]),this.b.copy(e[r]),this.c.copy(e[i]),this},copy:function(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this},area:function(){var e=new THREE.Vector3,t=new THREE.Vector3;return function(){return e.subVectors(this.c,this.b),t.subVectors(this.a,this.b),.5*e.cross(t).length()}}(),midpoint:function(e){return(e||new THREE.Vector3).addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)},normal:function(e){return THREE.Triangle.normal(this.a,this.b,this.c,e)},plane:function(e){return(e||new THREE.Plane).setFromCoplanarPoints(this.a,this.b,this.c)},barycoordFromPoint:function(e,t){return THREE.Triangle.barycoordFromPoint(e,this.a,this.b,this.c,t)},containsPoint:function(e){return THREE.Triangle.containsPoint(e,this.a,this.b,this.c)},equals:function(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)},clone:function(){return(new THREE.Triangle).copy(this)}},THREE.Clock=function(e){this.autoStart=void 0!==e?e:!0,this.elapsedTime=this.oldTime=this.startTime=0,this.running=!1},THREE.Clock.prototype={constructor:THREE.Clock,start:function(){this.oldTime=this.startTime=void 0!==self.performance&&void 0!==self.performance.now?self.performance.now():Date.now(),this.running=!0},stop:function(){this.getElapsedTime(),this.running=!1},getElapsedTime:function(){return this.getDelta(),this.elapsedTime},getDelta:function(){var e=0;if(this.autoStart&&!this.running&&this.start(),this.running){var t=void 0!==self.performance&&void 0!==self.performance.now?self.performance.now():Date.now(),e=.001*(t-this.oldTime);this.oldTime=t,this.elapsedTime+=e}return e}},THREE.EventDispatcher=function(){},THREE.EventDispatcher.prototype={constructor:THREE.EventDispatcher,apply:function(e){e.addEventListener=THREE.EventDispatcher.prototype.addEventListener,e.hasEventListener=THREE.EventDispatcher.prototype.hasEventListener,e.removeEventListener=THREE.EventDispatcher.prototype.removeEventListener,e.dispatchEvent=THREE.EventDispatcher.prototype.dispatchEvent},addEventListener:function(e,t){void 0===this._listeners&&(this._listeners={});var r=this._listeners;void 0===r[e]&&(r[e]=[]),-1===r[e].indexOf(t)&&r[e].push(t)},hasEventListener:function(e,t){if(void 0===this._listeners)return!1;var r=this._listeners;return void 0!==r[e]&&-1!==r[e].indexOf(t)?!0:!1},removeEventListener:function(e,t){if(void 0!==this._listeners){var r=this._listeners[e];if(void 0!==r){var i=r.indexOf(t);-1!==i&&r.splice(i,1)}}},dispatchEvent:function(e){if(void 0!==this._listeners){var t=this._listeners[e.type];if(void 0!==t){e.target=this;for(var r=[],i=t.length,n=0;i>n;n++)r[n]=t[n];for(n=0;i>n;n++)r[n].call(this,e)}}}},function(e){e.Raycaster=function(t,r,i,n){this.ray=new e.Ray(t,r),this.near=i||0,this.far=n||1/0,this.params={Sprite:{},Mesh:{},PointCloud:{threshold:1},LOD:{},Line:{}}};var t=function(e,t){return e.distance-t.distance},r=function(e,t,i,n){if(e.raycast(t,i),!0===n){e=e.children,n=0;for(var o=e.length;o>n;n++)r(e[n],t,i,!0)}};e.Raycaster.prototype={constructor:e.Raycaster,precision:1e-4,linePrecision:1,set:function(e,t){this.ray.set(e,t)},setFromCamera:function(t,r){r instanceof e.PerspectiveCamera?(this.ray.origin.copy(r.position),this.ray.direction.set(t.x,t.y,.5).unproject(r).sub(r.position).normalize()):r instanceof e.OrthographicCamera?(this.ray.origin.set(t.x,t.y,-1).unproject(r),this.ray.direction.set(0,0,-1).transformDirection(r.matrixWorld)):e.error("THREE.Raycaster: Unsupported camera type.")},intersectObject:function(e,i){var n=[];return r(e,this,n,i),n.sort(t),n},intersectObjects:function(i,n){var o=[];if(!1==i instanceof Array)return e.warn("THREE.Raycaster.intersectObjects: objects is not an Array."),o;for(var a=0,s=i.length;s>a;a++)r(i[a],this,o,n);return o.sort(t),o}}}(THREE),THREE.Object3D=function(){Object.defineProperty(this,"id",{value:THREE.Object3DIdCount++}),this.uuid=THREE.Math.generateUUID(),this.name="",this.type="Object3D",this.parent=void 0,this.children=[],this.up=THREE.Object3D.DefaultUp.clone();var e=new THREE.Vector3,t=new THREE.Euler,r=new THREE.Quaternion,i=new THREE.Vector3(1,1,1);t.onChange(function(){r.setFromEuler(t,!1)}),r.onChange(function(){t.setFromQuaternion(r,void 0,!1)}),Object.defineProperties(this,{position:{enumerable:!0,value:e},rotation:{enumerable:!0,value:t},quaternion:{enumerable:!0,value:r},scale:{enumerable:!0,value:i}}),this.rotationAutoUpdate=!0,this.matrix=new THREE.Matrix4,this.matrixWorld=new THREE.Matrix4,this.matrixAutoUpdate=!0,this.matrixWorldNeedsUpdate=!1,this.visible=!0,this.receiveShadow=this.castShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.userData={}},THREE.Object3D.DefaultUp=new THREE.Vector3(0,1,0),THREE.Object3D.prototype={constructor:THREE.Object3D,get eulerOrder(){return THREE.warn("THREE.Object3D: .eulerOrder has been moved to .rotation.order."),this.rotation.order},set eulerOrder(e){THREE.warn("THREE.Object3D: .eulerOrder has been moved to .rotation.order."),this.rotation.order=e},get useQuaternion(){THREE.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")},set useQuaternion(e){THREE.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")},applyMatrix:function(e){this.matrix.multiplyMatrices(e,this.matrix),this.matrix.decompose(this.position,this.quaternion,this.scale)},setRotationFromAxisAngle:function(e,t){this.quaternion.setFromAxisAngle(e,t)},setRotationFromEuler:function(e){this.quaternion.setFromEuler(e,!0)},setRotationFromMatrix:function(e){this.quaternion.setFromRotationMatrix(e)},setRotationFromQuaternion:function(e){this.quaternion.copy(e)},rotateOnAxis:function(){var e=new THREE.Quaternion;return function(t,r){return e.setFromAxisAngle(t,r),this.quaternion.multiply(e),this}}(),rotateX:function(){var e=new THREE.Vector3(1,0,0);return function(t){return this.rotateOnAxis(e,t)}}(),rotateY:function(){var e=new THREE.Vector3(0,1,0);return function(t){return this.rotateOnAxis(e,t)}}(),rotateZ:function(){var e=new THREE.Vector3(0,0,1);return function(t){return this.rotateOnAxis(e,t)}}(),translateOnAxis:function(){var e=new THREE.Vector3;return function(t,r){return e.copy(t).applyQuaternion(this.quaternion),this.position.add(e.multiplyScalar(r)),this}}(),translate:function(e,t){return THREE.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead."),this.translateOnAxis(t,e)},translateX:function(){var e=new THREE.Vector3(1,0,0);return function(t){return this.translateOnAxis(e,t)}}(),translateY:function(){var e=new THREE.Vector3(0,1,0);return function(t){return this.translateOnAxis(e,t)}}(),translateZ:function(){var e=new THREE.Vector3(0,0,1);return function(t){return this.translateOnAxis(e,t)}}(),localToWorld:function(e){return e.applyMatrix4(this.matrixWorld)},worldToLocal:function(){var e=new THREE.Matrix4;return function(t){return t.applyMatrix4(e.getInverse(this.matrixWorld))}}(),lookAt:function(){var e=new THREE.Matrix4;return function(t){e.lookAt(t,this.position,this.up),this.quaternion.setFromRotationMatrix(e)}}(),add:function(e){if(1<arguments.length){for(var t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(THREE.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e instanceof THREE.Object3D?(void 0!==e.parent&&e.parent.remove(e),e.parent=this,e.dispatchEvent({type:"added"}),this.children.push(e)):THREE.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)},remove:function(e){if(1<arguments.length)for(var t=0;t<arguments.length;t++)this.remove(arguments[t]);t=this.children.indexOf(e),-1!==t&&(e.parent=void 0,e.dispatchEvent({type:"removed"}),this.children.splice(t,1))},getChildByName:function(e){return THREE.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."),this.getObjectByName(e)},getObjectById:function(e){return this.getObjectByProperty("id",e)},getObjectByName:function(e){return this.getObjectByProperty("name",e)},getObjectByProperty:function(e,t){if(this[e]===t)return this;for(var r=0,i=this.children.length;i>r;r++){var n=this.children[r].getObjectByProperty(e,t);if(void 0!==n)return n}},getWorldPosition:function(e){return e=e||new THREE.Vector3,this.updateMatrixWorld(!0),e.setFromMatrixPosition(this.matrixWorld)},getWorldQuaternion:function(){var e=new THREE.Vector3,t=new THREE.Vector3;return function(r){return r=r||new THREE.Quaternion,this.updateMatrixWorld(!0),this.matrixWorld.decompose(e,r,t),r}}(),getWorldRotation:function(){var e=new THREE.Quaternion;return function(t){return t=t||new THREE.Euler,this.getWorldQuaternion(e),t.setFromQuaternion(e,this.rotation.order,!1)}}(),getWorldScale:function(){var e=new THREE.Vector3,t=new THREE.Quaternion;return function(r){return r=r||new THREE.Vector3,this.updateMatrixWorld(!0),this.matrixWorld.decompose(e,t,r),r}}(),getWorldDirection:function(){var e=new THREE.Quaternion;return function(t){return t=t||new THREE.Vector3,this.getWorldQuaternion(e),t.set(0,0,1).applyQuaternion(e)}}(),raycast:function(){},traverse:function(e){e(this);for(var t=0,r=this.children.length;r>t;t++)this.children[t].traverse(e)},traverseVisible:function(e){if(!1!==this.visible){e(this);for(var t=0,r=this.children.length;r>t;t++)this.children[t].traverseVisible(e)}},traverseAncestors:function(e){this.parent&&(e(this.parent),this.parent.traverseAncestors(e))},updateMatrix:function(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0},updateMatrixWorld:function(e){!0===this.matrixAutoUpdate&&this.updateMatrix(),(!0===this.matrixWorldNeedsUpdate||!0===e)&&(void 0===this.parent?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);for(var t=0,r=this.children.length;r>t;t++)this.children[t].updateMatrixWorld(e)},toJSON:function(){var e={metadata:{version:4.3,type:"Object",generator:"ObjectExporter"}},t={},r={},i=function(t){if(void 0===e.materials&&(e.materials=[]),void 0===r[t.uuid]){var i=t.toJSON();delete i.metadata,r[t.uuid]=i,e.materials.push(i)}return t.uuid},n=function(r){var o={};if(o.uuid=r.uuid,o.type=r.type,""!==r.name&&(o.name=r.name),"{}"!==JSON.stringify(r.userData)&&(o.userData=r.userData),!0!==r.visible&&(o.visible=r.visible),r instanceof THREE.PerspectiveCamera)o.fov=r.fov,o.aspect=r.aspect,o.near=r.near,o.far=r.far;else if(r instanceof THREE.OrthographicCamera)o.left=r.left,o.right=r.right,o.top=r.top,o.bottom=r.bottom,o.near=r.near,o.far=r.far;else if(r instanceof THREE.AmbientLight)o.color=r.color.getHex();else if(r instanceof THREE.DirectionalLight)o.color=r.color.getHex(),o.intensity=r.intensity;else if(r instanceof THREE.PointLight)o.color=r.color.getHex(),o.intensity=r.intensity,o.distance=r.distance,o.decay=r.decay;else if(r instanceof THREE.SpotLight)o.color=r.color.getHex(),o.intensity=r.intensity,o.distance=r.distance,o.angle=r.angle,o.exponent=r.exponent,o.decay=r.decay;else if(r instanceof THREE.HemisphereLight)o.color=r.color.getHex(),o.groundColor=r.groundColor.getHex();else if(r instanceof THREE.Mesh||r instanceof THREE.Line||r instanceof THREE.PointCloud){var a=r.geometry;if(void 0===e.geometries&&(e.geometries=[]),void 0===t[a.uuid]){var s=a.toJSON();delete s.metadata,t[a.uuid]=s,e.geometries.push(s)}o.geometry=a.uuid,o.material=i(r.material),r instanceof THREE.Line&&(o.mode=r.mode)}else r instanceof THREE.Sprite&&(o.material=i(r.material));if(o.matrix=r.matrix.toArray(),0<r.children.length)for(o.children=[],a=0;a<r.children.length;a++)o.children.push(n(r.children[a]));return o};return e.object=n(this),e},clone:function(e,t){if(void 0===e&&(e=new THREE.Object3D),void 0===t&&(t=!0),e.name=this.name,e.up.copy(this.up),e.position.copy(this.position),e.quaternion.copy(this.quaternion),e.scale.copy(this.scale),e.rotationAutoUpdate=this.rotationAutoUpdate,e.matrix.copy(this.matrix),e.matrixWorld.copy(this.matrixWorld),e.matrixAutoUpdate=this.matrixAutoUpdate,e.matrixWorldNeedsUpdate=this.matrixWorldNeedsUpdate,e.visible=this.visible,e.castShadow=this.castShadow,e.receiveShadow=this.receiveShadow,e.frustumCulled=this.frustumCulled,e.userData=JSON.parse(JSON.stringify(this.userData)),!0===t)for(var r=0;r<this.children.length;r++)e.add(this.children[r].clone());return e}},THREE.EventDispatcher.prototype.apply(THREE.Object3D.prototype),THREE.Object3DIdCount=0,THREE.Face3=function(e,t,r,i,n,o){this.a=e,this.b=t,this.c=r,this.normal=i instanceof THREE.Vector3?i:new THREE.Vector3,this.vertexNormals=i instanceof Array?i:[],this.color=n instanceof THREE.Color?n:new THREE.Color,this.vertexColors=n instanceof Array?n:[],this.vertexTangents=[],this.materialIndex=void 0!==o?o:0},THREE.Face3.prototype={constructor:THREE.Face3,clone:function(){var e=new THREE.Face3(this.a,this.b,this.c);e.normal.copy(this.normal),e.color.copy(this.color),e.materialIndex=this.materialIndex;for(var t=0,r=this.vertexNormals.length;r>t;t++)e.vertexNormals[t]=this.vertexNormals[t].clone();for(t=0,r=this.vertexColors.length;r>t;t++)e.vertexColors[t]=this.vertexColors[t].clone();for(t=0,r=this.vertexTangents.length;r>t;t++)e.vertexTangents[t]=this.vertexTangents[t].clone();return e}},THREE.Face4=function(e,t,r,i,n,o,a){return THREE.warn("THREE.Face4 has been removed. A THREE.Face3 will be created instead."),new THREE.Face3(e,t,r,n,o,a)},THREE.BufferAttribute=function(e,t){this.array=e,this.itemSize=t,this.needsUpdate=!1},THREE.BufferAttribute.prototype={constructor:THREE.BufferAttribute,get length(){return this.array.length},copyAt:function(e,t,r){e*=this.itemSize,r*=t.itemSize;for(var i=0,n=this.itemSize;n>i;i++)this.array[e+i]=t.array[r+i];return this},set:function(e,t){return void 0===t&&(t=0),this.array.set(e,t),this},setX:function(e,t){return this.array[e*this.itemSize]=t,this},setY:function(e,t){return this.array[e*this.itemSize+1]=t,this},setZ:function(e,t){return this.array[e*this.itemSize+2]=t,this},setXY:function(e,t,r){return e*=this.itemSize,this.array[e]=t,this.array[e+1]=r,this},setXYZ:function(e,t,r,i){return e*=this.itemSize,this.array[e]=t,this.array[e+1]=r,this.array[e+2]=i,this},setXYZW:function(e,t,r,i,n){return e*=this.itemSize,this.array[e]=t,this.array[e+1]=r,this.array[e+2]=i,this.array[e+3]=n,this},clone:function(){return new THREE.BufferAttribute(new this.array.constructor(this.array),this.itemSize)}},THREE.Int8Attribute=function(e,t){return THREE.warn("THREE.Int8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."),new THREE.BufferAttribute(e,t)},THREE.Uint8Attribute=function(e,t){return THREE.warn("THREE.Uint8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."),new THREE.BufferAttribute(e,t)},THREE.Uint8ClampedAttribute=function(e,t){return THREE.warn("THREE.Uint8ClampedAttribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."),new THREE.BufferAttribute(e,t)},THREE.Int16Attribute=function(e,t){return THREE.warn("THREE.Int16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."),new THREE.BufferAttribute(e,t)},THREE.Uint16Attribute=function(e,t){return THREE.warn("THREE.Uint16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."),new THREE.BufferAttribute(e,t)},THREE.Int32Attribute=function(e,t){return THREE.warn("THREE.Int32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."),new THREE.BufferAttribute(e,t)},THREE.Uint32Attribute=function(e,t){return THREE.warn("THREE.Uint32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."),new THREE.BufferAttribute(e,t)},THREE.Float32Attribute=function(e,t){return THREE.warn("THREE.Float32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."),new THREE.BufferAttribute(e,t)},THREE.Float64Attribute=function(e,t){return THREE.warn("THREE.Float64Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."),new THREE.BufferAttribute(e,t)},THREE.DynamicBufferAttribute=function(e,t){THREE.BufferAttribute.call(this,e,t),this.updateRange={offset:0,count:-1}},THREE.DynamicBufferAttribute.prototype=Object.create(THREE.BufferAttribute.prototype),THREE.DynamicBufferAttribute.prototype.constructor=THREE.DynamicBufferAttribute,THREE.DynamicBufferAttribute.prototype.clone=function(){return new THREE.DynamicBufferAttribute(new this.array.constructor(this.array),this.itemSize)},THREE.BufferGeometry=function(){Object.defineProperty(this,"id",{value:THREE.GeometryIdCount++}),this.uuid=THREE.Math.generateUUID(),this.name="",this.type="BufferGeometry",this.attributes={},this.attributesKeys=[],this.offsets=this.drawcalls=[],this.boundingSphere=this.boundingBox=null},THREE.BufferGeometry.prototype={constructor:THREE.BufferGeometry,addAttribute:function(e,t,r){!1==t instanceof THREE.BufferAttribute?(THREE.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."),this.attributes[e]={array:t,itemSize:r}):(this.attributes[e]=t,this.attributesKeys=Object.keys(this.attributes))},getAttribute:function(e){return this.attributes[e]},addDrawCall:function(e,t,r){this.drawcalls.push({start:e,count:t,index:void 0!==r?r:0})},applyMatrix:function(e){var t=this.attributes.position;void 0!==t&&(e.applyToVector3Array(t.array),t.needsUpdate=!0),t=this.attributes.normal,void 0!==t&&((new THREE.Matrix3).getNormalMatrix(e).applyToVector3Array(t.array),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere()},center:function(){this.computeBoundingBox();var e=this.boundingBox.center().negate();return this.applyMatrix((new THREE.Matrix4).setPosition(e)),e},fromGeometry:function(e,t){t=t||{vertexColors:THREE.NoColors};var r=e.vertices,i=e.faces,n=e.faceVertexUvs,o=t.vertexColors,a=0<n[0].length,s=3==i[0].vertexNormals.length,h=new Float32Array(9*i.length);this.addAttribute("position",new THREE.BufferAttribute(h,3));var c=new Float32Array(9*i.length);if(this.addAttribute("normal",new THREE.BufferAttribute(c,3)),o!==THREE.NoColors){var l=new Float32Array(9*i.length);this.addAttribute("color",new THREE.BufferAttribute(l,3))}if(!0===a){var u=new Float32Array(6*i.length);this.addAttribute("uv",new THREE.BufferAttribute(u,2))}for(var E=0,p=0,d=0;E<i.length;E++,p+=6,d+=9){var f=i[E],m=r[f.a],T=r[f.b],g=r[f.c];h[d]=m.x,h[d+1]=m.y,h[d+2]=m.z,h[d+3]=T.x,h[d+4]=T.y,h[d+5]=T.z,h[d+6]=g.x,h[d+7]=g.y,h[d+8]=g.z,!0===s?(m=f.vertexNormals[0],T=f.vertexNormals[1],g=f.vertexNormals[2],c[d]=m.x,c[d+1]=m.y,c[d+2]=m.z,c[d+3]=T.x,c[d+4]=T.y,c[d+5]=T.z,c[d+6]=g.x,c[d+7]=g.y,c[d+8]=g.z):(m=f.normal,c[d]=m.x,c[d+1]=m.y,c[d+2]=m.z,c[d+3]=m.x,c[d+4]=m.y,c[d+5]=m.z,c[d+6]=m.x,c[d+7]=m.y,c[d+8]=m.z),o===THREE.FaceColors?(f=f.color,l[d]=f.r,l[d+1]=f.g,l[d+2]=f.b,l[d+3]=f.r,l[d+4]=f.g,l[d+5]=f.b,l[d+6]=f.r,l[d+7]=f.g,l[d+8]=f.b):o===THREE.VertexColors&&(m=f.vertexColors[0],T=f.vertexColors[1],f=f.vertexColors[2],l[d]=m.r,l[d+1]=m.g,l[d+2]=m.b,l[d+3]=T.r,l[d+4]=T.g,l[d+5]=T.b,l[d+6]=f.r,l[d+7]=f.g,l[d+8]=f.b),!0===a&&(f=n[0][E][0],m=n[0][E][1],T=n[0][E][2],u[p]=f.x,u[p+1]=f.y,u[p+2]=m.x,u[p+3]=m.y,u[p+4]=T.x,u[p+5]=T.y)}return this.computeBoundingSphere(),this},computeBoundingBox:function(){var e=new THREE.Vector3;return function(){null===this.boundingBox&&(this.boundingBox=new THREE.Box3);var t=this.attributes.position.array;if(t){var r=this.boundingBox;r.makeEmpty();for(var i=0,n=t.length;n>i;i+=3)e.set(t[i],t[i+1],t[i+2]),r.expandByPoint(e)}(void 0===t||0===t.length)&&(this.boundingBox.min.set(0,0,0),this.boundingBox.max.set(0,0,0)),(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&THREE.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.')}}(),computeBoundingSphere:function(){var e=new THREE.Box3,t=new THREE.Vector3;return function(){null===this.boundingSphere&&(this.boundingSphere=new THREE.Sphere);var r=this.attributes.position.array;if(r){e.makeEmpty();for(var i=this.boundingSphere.center,n=0,o=r.length;o>n;n+=3)t.set(r[n],r[n+1],r[n+2]),e.expandByPoint(t);e.center(i);for(var a=0,n=0,o=r.length;o>n;n+=3)t.set(r[n],r[n+1],r[n+2]),a=Math.max(a,i.distanceToSquared(t));this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&THREE.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.')}}}(),computeFaceNormals:function(){},computeVertexNormals:function(){var e=this.attributes;if(e.position){var t=e.position.array;if(void 0===e.normal)this.addAttribute("normal",new THREE.BufferAttribute(new Float32Array(t.length),3));else for(var r=e.normal.array,i=0,n=r.length;n>i;i++)r[i]=0;var o,a,s,r=e.normal.array,h=new THREE.Vector3,c=new THREE.Vector3,l=new THREE.Vector3,u=new THREE.Vector3,E=new THREE.Vector3;if(e.index)for(var p=e.index.array,d=0<this.offsets.length?this.offsets:[{start:0,count:p.length,index:0}],f=0,m=d.length;m>f;++f){n=d[f].start,o=d[f].count;for(var T=d[f].index,i=n,n=n+o;n>i;i+=3)o=3*(T+p[i]),a=3*(T+p[i+1]),s=3*(T+p[i+2]),h.fromArray(t,o),c.fromArray(t,a),l.fromArray(t,s),u.subVectors(l,c),E.subVectors(h,c),u.cross(E),r[o]+=u.x,r[o+1]+=u.y,r[o+2]+=u.z,r[a]+=u.x,r[a+1]+=u.y,r[a+2]+=u.z,r[s]+=u.x,r[s+1]+=u.y,r[s+2]+=u.z}else for(i=0,n=t.length;n>i;i+=9)h.fromArray(t,i),c.fromArray(t,i+3),l.fromArray(t,i+6),u.subVectors(l,c),E.subVectors(h,c),u.cross(E),r[i]=u.x,r[i+1]=u.y,r[i+2]=u.z,r[i+3]=u.x,r[i+4]=u.y,r[i+5]=u.z,r[i+6]=u.x,r[i+7]=u.y,r[i+8]=u.z;this.normalizeNormals(),e.normal.needsUpdate=!0}},computeTangents:function(){function e(e,t,r){M.fromArray(i,3*e),S.fromArray(i,3*t),A.fromArray(i,3*r),C.fromArray(o,2*e),L.fromArray(o,2*t),P.fromArray(o,2*r),u=S.x-M.x,E=A.x-M.x,p=S.y-M.y,d=A.y-M.y,f=S.z-M.z,m=A.z-M.z,T=L.x-C.x,g=P.x-C.x,R=L.y-C.y,y=P.y-C.y,v=1/(T*y-g*R),F.set((y*u-R*E)*v,(y*p-R*d)*v,(y*f-R*m)*v),D.set((T*E-g*u)*v,(T*d-g*p)*v,(T*m-g*f)*v),h[e].add(F),h[t].add(F),h[r].add(F),c[e].add(D),c[t].add(D),c[r].add(D)}function t(e){I.fromArray(n,3*e),G.copy(I),O=h[e],k.copy(O),k.sub(I.multiplyScalar(I.dot(O))).normalize(),z.crossVectors(G,O),N=z.dot(c[e]),V=0>N?-1:1,s[4*e]=k.x,s[4*e+1]=k.y,s[4*e+2]=k.z,s[4*e+3]=V}if(void 0===this.attributes.index||void 0===this.attributes.position||void 0===this.attributes.normal||void 0===this.attributes.uv)THREE.warn("THREE.BufferGeometry: Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()");else{var r=this.attributes.index.array,i=this.attributes.position.array,n=this.attributes.normal.array,o=this.attributes.uv.array,a=i.length/3;void 0===this.attributes.tangent&&this.addAttribute("tangent",new THREE.BufferAttribute(new Float32Array(4*a),4));for(var s=this.attributes.tangent.array,h=[],c=[],l=0;a>l;l++)h[l]=new THREE.Vector3,c[l]=new THREE.Vector3;var u,E,p,d,f,m,T,g,R,y,v,H,x,b,w,_,M=new THREE.Vector3,S=new THREE.Vector3,A=new THREE.Vector3,C=new THREE.Vector2,L=new THREE.Vector2,P=new THREE.Vector2,F=new THREE.Vector3,D=new THREE.Vector3;0===this.drawcalls.length&&this.addDrawCall(0,r.length,0);var U=this.drawcalls,l=0;for(x=U.length;x>l;++l){H=U[l].start,b=U[l].count;var B=U[l].index,a=H;for(H+=b;H>a;a+=3)b=B+r[a],w=B+r[a+1],_=B+r[a+2],e(b,w,_)}var V,O,N,k=new THREE.Vector3,z=new THREE.Vector3,I=new THREE.Vector3,G=new THREE.Vector3,l=0;for(x=U.length;x>l;++l)for(H=U[l].start,b=U[l].count,B=U[l].index,a=H,H+=b;H>a;a+=3)b=B+r[a],w=B+r[a+1],_=B+r[a+2],t(b),t(w),t(_)}},computeOffsets:function(e){void 0===e&&(e=65535);for(var t=this.attributes.index.array,r=this.attributes.position.array,i=t.length/3,n=new Uint16Array(t.length),o=0,a=0,s=[{start:0,count:0,index:0}],h=s[0],c=0,l=0,u=new Int32Array(6),E=new Int32Array(r.length),p=new Int32Array(r.length),d=0;d<r.length;d++)E[d]=-1,p[d]=-1;for(r=0;i>r;r++){for(var f=l=0;3>f;f++)d=t[3*r+f],-1==E[d]?(u[2*f]=d,u[2*f+1]=-1,l++):E[d]<h.index?(u[2*f]=d,u[2*f+1]=-1,c++):(u[2*f]=d,u[2*f+1]=E[d]);if(a+l>h.index+e)for(h={start:o,count:0,index:a},s.push(h),l=0;6>l;l+=2)f=u[l+1],f>-1&&f<h.index&&(u[l+1]=-1);for(l=0;6>l;l+=2)d=u[l],f=u[l+1],-1===f&&(f=a++),E[d]=f,p[f]=d,n[o++]=f-h.index,h.count++}return this.reorderBuffers(n,p,a),this.drawcalls=this.offsets=s},merge:function(e,t){if(!1!=e instanceof THREE.BufferGeometry){void 0===t&&(t=0);var r,i=this.attributes;for(r in i)if(void 0!==e.attributes[r])for(var n=i[r].array,o=e.attributes[r],a=o.array,s=0,o=o.itemSize*t;s<a.length;s++,o++)n[o]=a[s];return this}THREE.error("THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.",e)},normalizeNormals:function(){for(var e,t,r,i=this.attributes.normal.array,n=0,o=i.length;o>n;n+=3)e=i[n],t=i[n+1],r=i[n+2],e=1/Math.sqrt(e*e+t*t+r*r),i[n]*=e,i[n+1]*=e,i[n+2]*=e},reorderBuffers:function(e,t,r){var i,n={};for(i in this.attributes)"index"!=i&&(n[i]=new this.attributes[i].array.constructor(this.attributes[i].itemSize*r));for(var o=0;r>o;o++){var a=t[o];for(i in this.attributes)if("index"!=i)for(var s=this.attributes[i].array,h=this.attributes[i].itemSize,c=n[i],l=0;h>l;l++)c[o*h+l]=s[a*h+l]}this.attributes.index.array=e;for(i in this.attributes)"index"!=i&&(this.attributes[i].array=n[i],this.attributes[i].numItems=this.attributes[i].itemSize*r)},toJSON:function(){var e,t={metadata:{version:4,type:"BufferGeometry",generator:"BufferGeometryExporter"},uuid:this.uuid,type:this.type,data:{attributes:{}}},r=this.attributes,i=this.offsets,n=this.boundingSphere;for(e in r){var o=r[e],a=Array.prototype.slice.call(o.array);t.data.attributes[e]={itemSize:o.itemSize,type:o.array.constructor.name,array:a}}return 0<i.length&&(t.data.offsets=JSON.parse(JSON.stringify(i))),null!==n&&(t.data.boundingSphere={center:n.center.toArray(),radius:n.radius}),t},clone:function(){var e,t=new THREE.BufferGeometry;for(e in this.attributes)t.addAttribute(e,this.attributes[e].clone());e=0;for(var r=this.offsets.length;r>e;e++){var i=this.offsets[e];t.offsets.push({start:i.start,index:i.index,count:i.count})}return t},dispose:function(){this.dispatchEvent({type:"dispose"})}},THREE.EventDispatcher.prototype.apply(THREE.BufferGeometry.prototype),THREE.Geometry=function(){Object.defineProperty(this,"id",{value:THREE.GeometryIdCount++}),this.uuid=THREE.Math.generateUUID(),this.name="",this.type="Geometry",this.vertices=[],
	this.colors=[],this.faces=[],this.faceVertexUvs=[[]],this.morphTargets=[],this.morphColors=[],this.morphNormals=[],this.skinWeights=[],this.skinIndices=[],this.lineDistances=[],this.boundingSphere=this.boundingBox=null,this.hasTangents=!1,this.dynamic=!0,this.groupsNeedUpdate=this.lineDistancesNeedUpdate=this.colorsNeedUpdate=this.tangentsNeedUpdate=this.normalsNeedUpdate=this.uvsNeedUpdate=this.elementsNeedUpdate=this.verticesNeedUpdate=!1},THREE.Geometry.prototype={constructor:THREE.Geometry,applyMatrix:function(e){for(var t=(new THREE.Matrix3).getNormalMatrix(e),r=0,i=this.vertices.length;i>r;r++)this.vertices[r].applyMatrix4(e);for(r=0,i=this.faces.length;i>r;r++){e=this.faces[r],e.normal.applyMatrix3(t).normalize();for(var n=0,o=e.vertexNormals.length;o>n;n++)e.vertexNormals[n].applyMatrix3(t).normalize()}null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this.normalsNeedUpdate=this.verticesNeedUpdate=!0},fromBufferGeometry:function(e){for(var t=this,r=e.attributes,i=r.position.array,n=void 0!==r.index?r.index.array:void 0,o=void 0!==r.normal?r.normal.array:void 0,a=void 0!==r.color?r.color.array:void 0,s=void 0!==r.uv?r.uv.array:void 0,h=[],c=[],l=r=0;r<i.length;r+=3,l+=2)t.vertices.push(new THREE.Vector3(i[r],i[r+1],i[r+2])),void 0!==o&&h.push(new THREE.Vector3(o[r],o[r+1],o[r+2])),void 0!==a&&t.colors.push(new THREE.Color(a[r],a[r+1],a[r+2])),void 0!==s&&c.push(new THREE.Vector2(s[l],s[l+1]));var u=function(e,r,i){var n=void 0!==o?[h[e].clone(),h[r].clone(),h[i].clone()]:[],l=void 0!==a?[t.colors[e].clone(),t.colors[r].clone(),t.colors[i].clone()]:[];t.faces.push(new THREE.Face3(e,r,i,n,l)),void 0!==s&&t.faceVertexUvs[0].push([c[e].clone(),c[r].clone(),c[i].clone()])};if(void 0!==n)if(i=e.drawcalls,0<i.length)for(r=0;r<i.length;r++)for(var l=i[r],E=l.start,p=l.count,d=l.index,l=E,E=E+p;E>l;l+=3)u(d+n[l],d+n[l+1],d+n[l+2]);else for(r=0;r<n.length;r+=3)u(n[r],n[r+1],n[r+2]);else for(r=0;r<i.length/3;r+=3)u(r,r+1,r+2);return this.computeFaceNormals(),null!==e.boundingBox&&(this.boundingBox=e.boundingBox.clone()),null!==e.boundingSphere&&(this.boundingSphere=e.boundingSphere.clone()),this},center:function(){this.computeBoundingBox();var e=this.boundingBox.center().negate();return this.applyMatrix((new THREE.Matrix4).setPosition(e)),e},computeFaceNormals:function(){for(var e=new THREE.Vector3,t=new THREE.Vector3,r=0,i=this.faces.length;i>r;r++){var n=this.faces[r],o=this.vertices[n.a],a=this.vertices[n.b];e.subVectors(this.vertices[n.c],a),t.subVectors(o,a),e.cross(t),e.normalize(),n.normal.copy(e)}},computeVertexNormals:function(e){var t,r,i;for(i=Array(this.vertices.length),t=0,r=this.vertices.length;r>t;t++)i[t]=new THREE.Vector3;if(e){var n,o,a,s=new THREE.Vector3,h=new THREE.Vector3;for(e=0,t=this.faces.length;t>e;e++)r=this.faces[e],n=this.vertices[r.a],o=this.vertices[r.b],a=this.vertices[r.c],s.subVectors(a,o),h.subVectors(n,o),s.cross(h),i[r.a].add(s),i[r.b].add(s),i[r.c].add(s)}else for(e=0,t=this.faces.length;t>e;e++)r=this.faces[e],i[r.a].add(r.normal),i[r.b].add(r.normal),i[r.c].add(r.normal);for(t=0,r=this.vertices.length;r>t;t++)i[t].normalize();for(e=0,t=this.faces.length;t>e;e++)r=this.faces[e],r.vertexNormals[0]=i[r.a].clone(),r.vertexNormals[1]=i[r.b].clone(),r.vertexNormals[2]=i[r.c].clone()},computeMorphNormals:function(){var e,t,r,i,n;for(r=0,i=this.faces.length;i>r;r++)for(n=this.faces[r],n.__originalFaceNormal?n.__originalFaceNormal.copy(n.normal):n.__originalFaceNormal=n.normal.clone(),n.__originalVertexNormals||(n.__originalVertexNormals=[]),e=0,t=n.vertexNormals.length;t>e;e++)n.__originalVertexNormals[e]?n.__originalVertexNormals[e].copy(n.vertexNormals[e]):n.__originalVertexNormals[e]=n.vertexNormals[e].clone();var o=new THREE.Geometry;for(o.faces=this.faces,e=0,t=this.morphTargets.length;t>e;e++){if(!this.morphNormals[e]){this.morphNormals[e]={},this.morphNormals[e].faceNormals=[],this.morphNormals[e].vertexNormals=[],n=this.morphNormals[e].faceNormals;var a,s,h=this.morphNormals[e].vertexNormals;for(r=0,i=this.faces.length;i>r;r++)a=new THREE.Vector3,s={a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3},n.push(a),h.push(s)}for(h=this.morphNormals[e],o.vertices=this.morphTargets[e].vertices,o.computeFaceNormals(),o.computeVertexNormals(),r=0,i=this.faces.length;i>r;r++)n=this.faces[r],a=h.faceNormals[r],s=h.vertexNormals[r],a.copy(n.normal),s.a.copy(n.vertexNormals[0]),s.b.copy(n.vertexNormals[1]),s.c.copy(n.vertexNormals[2])}for(r=0,i=this.faces.length;i>r;r++)n=this.faces[r],n.normal=n.__originalFaceNormal,n.vertexNormals=n.__originalVertexNormals},computeTangents:function(){var e,t,r,i,n,o,a,s,h,c,l,u,E,p,d,f,m,T=[],g=[];r=new THREE.Vector3;var R=new THREE.Vector3,y=new THREE.Vector3,v=new THREE.Vector3,H=new THREE.Vector3;for(e=0,t=this.vertices.length;t>e;e++)T[e]=new THREE.Vector3,g[e]=new THREE.Vector3;for(e=0,t=this.faces.length;t>e;e++)n=this.faces[e],o=this.faceVertexUvs[0][e],i=n.a,m=n.b,n=n.c,a=this.vertices[i],s=this.vertices[m],h=this.vertices[n],c=o[0],l=o[1],u=o[2],o=s.x-a.x,E=h.x-a.x,p=s.y-a.y,d=h.y-a.y,s=s.z-a.z,a=h.z-a.z,h=l.x-c.x,f=u.x-c.x,l=l.y-c.y,c=u.y-c.y,u=1/(h*c-f*l),r.set((c*o-l*E)*u,(c*p-l*d)*u,(c*s-l*a)*u),R.set((h*E-f*o)*u,(h*d-f*p)*u,(h*a-f*s)*u),T[i].add(r),T[m].add(r),T[n].add(r),g[i].add(R),g[m].add(R),g[n].add(R);for(R=["a","b","c","d"],e=0,t=this.faces.length;t>e;e++)for(n=this.faces[e],r=0;r<Math.min(n.vertexNormals.length,3);r++)H.copy(n.vertexNormals[r]),i=n[R[r]],m=T[i],y.copy(m),y.sub(H.multiplyScalar(H.dot(m))).normalize(),v.crossVectors(n.vertexNormals[r],m),i=v.dot(g[i]),i=0>i?-1:1,n.vertexTangents[r]=new THREE.Vector4(y.x,y.y,y.z,i);this.hasTangents=!0},computeLineDistances:function(){for(var e=0,t=this.vertices,r=0,i=t.length;i>r;r++)r>0&&(e+=t[r].distanceTo(t[r-1])),this.lineDistances[r]=e},computeBoundingBox:function(){null===this.boundingBox&&(this.boundingBox=new THREE.Box3),this.boundingBox.setFromPoints(this.vertices)},computeBoundingSphere:function(){null===this.boundingSphere&&(this.boundingSphere=new THREE.Sphere),this.boundingSphere.setFromPoints(this.vertices)},merge:function(e,t,r){if(!1==e instanceof THREE.Geometry)THREE.error("THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.",e);else{var i,n=this.vertices.length,o=this.vertices,a=e.vertices,s=this.faces,h=e.faces,c=this.faceVertexUvs[0];e=e.faceVertexUvs[0],void 0===r&&(r=0),void 0!==t&&(i=(new THREE.Matrix3).getNormalMatrix(t));for(var l=0,u=a.length;u>l;l++){var E=a[l].clone();void 0!==t&&E.applyMatrix4(t),o.push(E)}for(l=0,u=h.length;u>l;l++){var p,a=h[l],d=a.vertexNormals,f=a.vertexColors,E=new THREE.Face3(a.a+n,a.b+n,a.c+n);for(E.normal.copy(a.normal),void 0!==i&&E.normal.applyMatrix3(i).normalize(),t=0,o=d.length;o>t;t++)p=d[t].clone(),void 0!==i&&p.applyMatrix3(i).normalize(),E.vertexNormals.push(p);for(E.color.copy(a.color),t=0,o=f.length;o>t;t++)p=f[t],E.vertexColors.push(p.clone());E.materialIndex=a.materialIndex+r,s.push(E)}for(l=0,u=e.length;u>l;l++)if(r=e[l],i=[],void 0!==r){for(t=0,o=r.length;o>t;t++)i.push(r[t].clone());c.push(i)}}},mergeMesh:function(e){!1==e instanceof THREE.Mesh?THREE.error("THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.",e):(e.matrixAutoUpdate&&e.updateMatrix(),this.merge(e.geometry,e.matrix))},mergeVertices:function(){var e,t,r,i={},n=[],o=[],a=Math.pow(10,4);for(t=0,r=this.vertices.length;r>t;t++)e=this.vertices[t],e=Math.round(e.x*a)+"_"+Math.round(e.y*a)+"_"+Math.round(e.z*a),void 0===i[e]?(i[e]=t,n.push(this.vertices[t]),o[t]=n.length-1):o[t]=o[i[e]];for(i=[],t=0,r=this.faces.length;r>t;t++)for(a=this.faces[t],a.a=o[a.a],a.b=o[a.b],a.c=o[a.c],a=[a.a,a.b,a.c],e=0;3>e;e++)if(a[e]==a[(e+1)%3]){i.push(t);break}for(t=i.length-1;t>=0;t--)for(a=i[t],this.faces.splice(a,1),o=0,r=this.faceVertexUvs.length;r>o;o++)this.faceVertexUvs[o].splice(a,1);return t=this.vertices.length-n.length,this.vertices=n,t},toJSON:function(){function e(e,t,r){return r?e|1<<t:e&~(1<<t)}function t(e){var t=e.x.toString()+e.y.toString()+e.z.toString();return void 0!==c[t]?c[t]:(c[t]=h.length/3,h.push(e.x,e.y,e.z),c[t])}function r(e){var t=e.r.toString()+e.g.toString()+e.b.toString();return void 0!==u[t]?u[t]:(u[t]=l.length,l.push(e.getHex()),u[t])}function i(e){var t=e.x.toString()+e.y.toString();return void 0!==p[t]?p[t]:(p[t]=E.length/2,E.push(e.x,e.y),p[t])}var n={metadata:{version:4,type:"BufferGeometry",generator:"BufferGeometryExporter"},uuid:this.uuid,type:this.type};if(""!==this.name&&(n.name=this.name),void 0!==this.parameters){var o,a=this.parameters;for(o in a)void 0!==a[o]&&(n[o]=a[o]);return n}for(a=[],o=0;o<this.vertices.length;o++){var s=this.vertices[o];a.push(s.x,s.y,s.z)}var s=[],h=[],c={},l=[],u={},E=[],p={};for(o=0;o<this.faces.length;o++){var d=this.faces[o],f=void 0!==this.faceVertexUvs[0][o],m=0<d.normal.length(),T=0<d.vertexNormals.length,g=1!==d.color.r||1!==d.color.g||1!==d.color.b,R=0<d.vertexColors.length,y=0,y=e(y,0,0),y=e(y,1,!1),y=e(y,2,!1),y=e(y,3,f),y=e(y,4,m),y=e(y,5,T),y=e(y,6,g),y=e(y,7,R);s.push(y),s.push(d.a,d.b,d.c),f&&(f=this.faceVertexUvs[0][o],s.push(i(f[0]),i(f[1]),i(f[2]))),m&&s.push(t(d.normal)),T&&(m=d.vertexNormals,s.push(t(m[0]),t(m[1]),t(m[2]))),g&&s.push(r(d.color)),R&&(d=d.vertexColors,s.push(r(d[0]),r(d[1]),r(d[2])))}return n.data={},n.data.vertices=a,n.data.normals=h,0<l.length&&(n.data.colors=l),0<E.length&&(n.data.uvs=[E]),n.data.faces=s,n},clone:function(){for(var e=new THREE.Geometry,t=this.vertices,r=0,i=t.length;i>r;r++)e.vertices.push(t[r].clone());for(t=this.faces,r=0,i=t.length;i>r;r++)e.faces.push(t[r].clone());for(r=0,i=this.faceVertexUvs.length;i>r;r++){t=this.faceVertexUvs[r],void 0===e.faceVertexUvs[r]&&(e.faceVertexUvs[r]=[]);for(var n=0,o=t.length;o>n;n++){for(var a=t[n],s=[],h=0,c=a.length;c>h;h++)s.push(a[h].clone());e.faceVertexUvs[r].push(s)}}return e},dispose:function(){this.dispatchEvent({type:"dispose"})}},THREE.EventDispatcher.prototype.apply(THREE.Geometry.prototype),THREE.GeometryIdCount=0,THREE.Camera=function(){THREE.Object3D.call(this),this.type="Camera",this.matrixWorldInverse=new THREE.Matrix4,this.projectionMatrix=new THREE.Matrix4},THREE.Camera.prototype=Object.create(THREE.Object3D.prototype),THREE.Camera.prototype.constructor=THREE.Camera,THREE.Camera.prototype.getWorldDirection=function(){var e=new THREE.Quaternion;return function(t){return t=t||new THREE.Vector3,this.getWorldQuaternion(e),t.set(0,0,-1).applyQuaternion(e)}}(),THREE.Camera.prototype.lookAt=function(){var e=new THREE.Matrix4;return function(t){e.lookAt(this.position,t,this.up),this.quaternion.setFromRotationMatrix(e)}}(),THREE.Camera.prototype.clone=function(e){return void 0===e&&(e=new THREE.Camera),THREE.Object3D.prototype.clone.call(this,e),e.matrixWorldInverse.copy(this.matrixWorldInverse),e.projectionMatrix.copy(this.projectionMatrix),e},THREE.CubeCamera=function(e,t,r){THREE.Object3D.call(this),this.type="CubeCamera";var i=new THREE.PerspectiveCamera(90,1,e,t);i.up.set(0,-1,0),i.lookAt(new THREE.Vector3(1,0,0)),this.add(i);var n=new THREE.PerspectiveCamera(90,1,e,t);n.up.set(0,-1,0),n.lookAt(new THREE.Vector3(-1,0,0)),this.add(n);var o=new THREE.PerspectiveCamera(90,1,e,t);o.up.set(0,0,1),o.lookAt(new THREE.Vector3(0,1,0)),this.add(o);var a=new THREE.PerspectiveCamera(90,1,e,t);a.up.set(0,0,-1),a.lookAt(new THREE.Vector3(0,-1,0)),this.add(a);var s=new THREE.PerspectiveCamera(90,1,e,t);s.up.set(0,-1,0),s.lookAt(new THREE.Vector3(0,0,1)),this.add(s);var h=new THREE.PerspectiveCamera(90,1,e,t);h.up.set(0,-1,0),h.lookAt(new THREE.Vector3(0,0,-1)),this.add(h),this.renderTarget=new THREE.WebGLRenderTargetCube(r,r,{format:THREE.RGBFormat,magFilter:THREE.LinearFilter,minFilter:THREE.LinearFilter}),this.updateCubeMap=function(e,t){var r=this.renderTarget,c=r.generateMipmaps;r.generateMipmaps=!1,r.activeCubeFace=0,e.render(t,i,r),r.activeCubeFace=1,e.render(t,n,r),r.activeCubeFace=2,e.render(t,o,r),r.activeCubeFace=3,e.render(t,a,r),r.activeCubeFace=4,e.render(t,s,r),r.generateMipmaps=c,r.activeCubeFace=5,e.render(t,h,r)}},THREE.CubeCamera.prototype=Object.create(THREE.Object3D.prototype),THREE.CubeCamera.prototype.constructor=THREE.CubeCamera,THREE.OrthographicCamera=function(e,t,r,i,n,o){THREE.Camera.call(this),this.type="OrthographicCamera",this.zoom=1,this.left=e,this.right=t,this.top=r,this.bottom=i,this.near=void 0!==n?n:.1,this.far=void 0!==o?o:2e3,this.updateProjectionMatrix()},THREE.OrthographicCamera.prototype=Object.create(THREE.Camera.prototype),THREE.OrthographicCamera.prototype.constructor=THREE.OrthographicCamera,THREE.OrthographicCamera.prototype.updateProjectionMatrix=function(){var e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,i=(this.top+this.bottom)/2;this.projectionMatrix.makeOrthographic(r-e,r+e,i+t,i-t,this.near,this.far)},THREE.OrthographicCamera.prototype.clone=function(){var e=new THREE.OrthographicCamera;return THREE.Camera.prototype.clone.call(this,e),e.zoom=this.zoom,e.left=this.left,e.right=this.right,e.top=this.top,e.bottom=this.bottom,e.near=this.near,e.far=this.far,e.projectionMatrix.copy(this.projectionMatrix),e},THREE.PerspectiveCamera=function(e,t,r,i){THREE.Camera.call(this),this.type="PerspectiveCamera",this.zoom=1,this.fov=void 0!==e?e:50,this.aspect=void 0!==t?t:1,this.near=void 0!==r?r:.1,this.far=void 0!==i?i:2e3,this.updateProjectionMatrix()},THREE.PerspectiveCamera.prototype=Object.create(THREE.Camera.prototype),THREE.PerspectiveCamera.prototype.constructor=THREE.PerspectiveCamera,THREE.PerspectiveCamera.prototype.setLens=function(e,t){void 0===t&&(t=24),this.fov=2*THREE.Math.radToDeg(Math.atan(t/(2*e))),this.updateProjectionMatrix()},THREE.PerspectiveCamera.prototype.setViewOffset=function(e,t,r,i,n,o){this.fullWidth=e,this.fullHeight=t,this.x=r,this.y=i,this.width=n,this.height=o,this.updateProjectionMatrix()},THREE.PerspectiveCamera.prototype.updateProjectionMatrix=function(){var e=THREE.Math.radToDeg(2*Math.atan(Math.tan(.5*THREE.Math.degToRad(this.fov))/this.zoom));if(this.fullWidth){var t=this.fullWidth/this.fullHeight,e=Math.tan(THREE.Math.degToRad(.5*e))*this.near,r=-e,i=t*r,t=Math.abs(t*e-i),r=Math.abs(e-r);this.projectionMatrix.makeFrustum(i+this.x*t/this.fullWidth,i+(this.x+this.width)*t/this.fullWidth,e-(this.y+this.height)*r/this.fullHeight,e-this.y*r/this.fullHeight,this.near,this.far)}else this.projectionMatrix.makePerspective(e,this.aspect,this.near,this.far)},THREE.PerspectiveCamera.prototype.clone=function(){var e=new THREE.PerspectiveCamera;return THREE.Camera.prototype.clone.call(this,e),e.zoom=this.zoom,e.fov=this.fov,e.aspect=this.aspect,e.near=this.near,e.far=this.far,e.projectionMatrix.copy(this.projectionMatrix),e},THREE.Light=function(e){THREE.Object3D.call(this),this.type="Light",this.color=new THREE.Color(e)},THREE.Light.prototype=Object.create(THREE.Object3D.prototype),THREE.Light.prototype.constructor=THREE.Light,THREE.Light.prototype.clone=function(e){return void 0===e&&(e=new THREE.Light),THREE.Object3D.prototype.clone.call(this,e),e.color.copy(this.color),e},THREE.AmbientLight=function(e){THREE.Light.call(this,e),this.type="AmbientLight"},THREE.AmbientLight.prototype=Object.create(THREE.Light.prototype),THREE.AmbientLight.prototype.constructor=THREE.AmbientLight,THREE.AmbientLight.prototype.clone=function(){var e=new THREE.AmbientLight;return THREE.Light.prototype.clone.call(this,e),e},THREE.AreaLight=function(e,t){THREE.Light.call(this,e),this.type="AreaLight",this.normal=new THREE.Vector3(0,-1,0),this.right=new THREE.Vector3(1,0,0),this.intensity=void 0!==t?t:1,this.height=this.width=1,this.constantAttenuation=1.5,this.linearAttenuation=.5,this.quadraticAttenuation=.1},THREE.AreaLight.prototype=Object.create(THREE.Light.prototype),THREE.AreaLight.prototype.constructor=THREE.AreaLight,THREE.DirectionalLight=function(e,t){THREE.Light.call(this,e),this.type="DirectionalLight",this.position.set(0,1,0),this.target=new THREE.Object3D,this.intensity=void 0!==t?t:1,this.onlyShadow=this.castShadow=!1,this.shadowCameraNear=50,this.shadowCameraFar=5e3,this.shadowCameraLeft=-500,this.shadowCameraTop=this.shadowCameraRight=500,this.shadowCameraBottom=-500,this.shadowCameraVisible=!1,this.shadowBias=0,this.shadowDarkness=.5,this.shadowMapHeight=this.shadowMapWidth=512,this.shadowCascade=!1,this.shadowCascadeOffset=new THREE.Vector3(0,0,-1e3),this.shadowCascadeCount=2,this.shadowCascadeBias=[0,0,0],this.shadowCascadeWidth=[512,512,512],this.shadowCascadeHeight=[512,512,512],this.shadowCascadeNearZ=[-1,.99,.998],this.shadowCascadeFarZ=[.99,.998,1],this.shadowCascadeArray=[],this.shadowMatrix=this.shadowCamera=this.shadowMapSize=this.shadowMap=null},THREE.DirectionalLight.prototype=Object.create(THREE.Light.prototype),THREE.DirectionalLight.prototype.constructor=THREE.DirectionalLight,THREE.DirectionalLight.prototype.clone=function(){var e=new THREE.DirectionalLight;return THREE.Light.prototype.clone.call(this,e),e.target=this.target.clone(),e.intensity=this.intensity,e.castShadow=this.castShadow,e.onlyShadow=this.onlyShadow,e.shadowCameraNear=this.shadowCameraNear,e.shadowCameraFar=this.shadowCameraFar,e.shadowCameraLeft=this.shadowCameraLeft,e.shadowCameraRight=this.shadowCameraRight,e.shadowCameraTop=this.shadowCameraTop,e.shadowCameraBottom=this.shadowCameraBottom,e.shadowCameraVisible=this.shadowCameraVisible,e.shadowBias=this.shadowBias,e.shadowDarkness=this.shadowDarkness,e.shadowMapWidth=this.shadowMapWidth,e.shadowMapHeight=this.shadowMapHeight,e.shadowCascade=this.shadowCascade,e.shadowCascadeOffset.copy(this.shadowCascadeOffset),e.shadowCascadeCount=this.shadowCascadeCount,e.shadowCascadeBias=this.shadowCascadeBias.slice(0),e.shadowCascadeWidth=this.shadowCascadeWidth.slice(0),e.shadowCascadeHeight=this.shadowCascadeHeight.slice(0),e.shadowCascadeNearZ=this.shadowCascadeNearZ.slice(0),e.shadowCascadeFarZ=this.shadowCascadeFarZ.slice(0),e},THREE.HemisphereLight=function(e,t,r){THREE.Light.call(this,e),this.type="HemisphereLight",this.position.set(0,100,0),this.groundColor=new THREE.Color(t),this.intensity=void 0!==r?r:1},THREE.HemisphereLight.prototype=Object.create(THREE.Light.prototype),THREE.HemisphereLight.prototype.constructor=THREE.HemisphereLight,THREE.HemisphereLight.prototype.clone=function(){var e=new THREE.HemisphereLight;return THREE.Light.prototype.clone.call(this,e),e.groundColor.copy(this.groundColor),e.intensity=this.intensity,e},THREE.PointLight=function(e,t,r,i){THREE.Light.call(this,e),this.type="PointLight",this.intensity=void 0!==t?t:1,this.distance=void 0!==r?r:0,this.decay=void 0!==i?i:1},THREE.PointLight.prototype=Object.create(THREE.Light.prototype),THREE.PointLight.prototype.constructor=THREE.PointLight,THREE.PointLight.prototype.clone=function(){var e=new THREE.PointLight;return THREE.Light.prototype.clone.call(this,e),e.intensity=this.intensity,e.distance=this.distance,e.decay=this.decay,e},THREE.SpotLight=function(e,t,r,i,n,o){THREE.Light.call(this,e),this.type="SpotLight",this.position.set(0,1,0),this.target=new THREE.Object3D,this.intensity=void 0!==t?t:1,this.distance=void 0!==r?r:0,this.angle=void 0!==i?i:Math.PI/3,this.exponent=void 0!==n?n:10,this.decay=void 0!==o?o:1,this.onlyShadow=this.castShadow=!1,this.shadowCameraNear=50,this.shadowCameraFar=5e3,this.shadowCameraFov=50,this.shadowCameraVisible=!1,this.shadowBias=0,this.shadowDarkness=.5,this.shadowMapHeight=this.shadowMapWidth=512,this.shadowMatrix=this.shadowCamera=this.shadowMapSize=this.shadowMap=null},THREE.SpotLight.prototype=Object.create(THREE.Light.prototype),THREE.SpotLight.prototype.constructor=THREE.SpotLight,THREE.SpotLight.prototype.clone=function(){var e=new THREE.SpotLight;return THREE.Light.prototype.clone.call(this,e),e.target=this.target.clone(),e.intensity=this.intensity,e.distance=this.distance,e.angle=this.angle,e.exponent=this.exponent,e.decay=this.decay,e.castShadow=this.castShadow,e.onlyShadow=this.onlyShadow,e.shadowCameraNear=this.shadowCameraNear,e.shadowCameraFar=this.shadowCameraFar,e.shadowCameraFov=this.shadowCameraFov,e.shadowCameraVisible=this.shadowCameraVisible,e.shadowBias=this.shadowBias,e.shadowDarkness=this.shadowDarkness,e.shadowMapWidth=this.shadowMapWidth,e.shadowMapHeight=this.shadowMapHeight,e},THREE.Cache={files:{},add:function(e,t){this.files[e]=t},get:function(e){return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}},THREE.Loader=function(e){this.statusDomElement=(this.showStatus=e)?THREE.Loader.prototype.addStatusElement():null,this.imageLoader=new THREE.ImageLoader,this.onLoadStart=function(){},this.onLoadProgress=function(){},this.onLoadComplete=function(){}},THREE.Loader.prototype={constructor:THREE.Loader,crossOrigin:void 0,addStatusElement:function(){var e=document.createElement("div");return e.style.position="absolute",e.style.right="0px",e.style.top="0px",e.style.fontSize="0.8em",e.style.textAlign="left",e.style.background="rgba(0,0,0,0.25)",e.style.color="#fff",e.style.width="120px",e.style.padding="0.5em 0.5em 0.5em 0.5em",e.style.zIndex=1e3,e.innerHTML="Loading ...",e},updateProgress:function(e){var t="Loaded ",t=e.total?t+((100*e.loaded/e.total).toFixed(0)+"%"):t+((e.loaded/1024).toFixed(2)+" KB");this.statusDomElement.innerHTML=t},extractUrlBase:function(e){return e=e.split("/"),1===e.length?"./":(e.pop(),e.join("/")+"/")},initMaterials:function(e,t){for(var r=[],i=0;i<e.length;++i)r[i]=this.createMaterial(e[i],t);return r},needsTangents:function(e){for(var t=0,r=e.length;r>t;t++)if(e[t]instanceof THREE.ShaderMaterial)return!0;return!1},createMaterial:function(e,t){function r(e){return e=Math.log(e)/Math.LN2,Math.pow(2,Math.round(e))}function i(e,i,n,a,s,h,c){var l,u=t+n,E=THREE.Loader.Handlers.get(u);null!==E?l=E.load(u):(l=new THREE.Texture,E=o.imageLoader,E.crossOrigin=o.crossOrigin,E.load(u,function(e){if(!1===THREE.Math.isPowerOfTwo(e.width)||!1===THREE.Math.isPowerOfTwo(e.height)){var t=r(e.width),i=r(e.height),n=document.createElement("canvas");n.width=t,n.height=i,n.getContext("2d").drawImage(e,0,0,t,i),l.image=n}else l.image=e;l.needsUpdate=!0})),l.sourceFile=n,a&&(l.repeat.set(a[0],a[1]),1!==a[0]&&(l.wrapS=THREE.RepeatWrapping),1!==a[1]&&(l.wrapT=THREE.RepeatWrapping)),s&&l.offset.set(s[0],s[1]),h&&(n={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping},void 0!==n[h[0]]&&(l.wrapS=n[h[0]]),void 0!==n[h[1]]&&(l.wrapT=n[h[1]])),c&&(l.anisotropy=c),e[i]=l}function n(e){return(255*e[0]<<16)+(255*e[1]<<8)+255*e[2]}var o=this,a="MeshLambertMaterial",s={color:15658734,opacity:1,map:null,lightMap:null,normalMap:null,bumpMap:null,wireframe:!1};if(e.shading){var h=e.shading.toLowerCase();"phong"===h?a="MeshPhongMaterial":"basic"===h&&(a="MeshBasicMaterial")}return void 0!==e.blending&&void 0!==THREE[e.blending]&&(s.blending=THREE[e.blending]),void 0!==e.transparent&&(s.transparent=e.transparent),void 0!==e.opacity&&1>e.opacity&&(s.transparent=!0),void 0!==e.depthTest&&(s.depthTest=e.depthTest),void 0!==e.depthWrite&&(s.depthWrite=e.depthWrite),void 0!==e.visible&&(s.visible=e.visible),void 0!==e.flipSided&&(s.side=THREE.BackSide),void 0!==e.doubleSided&&(s.side=THREE.DoubleSide),void 0!==e.wireframe&&(s.wireframe=e.wireframe),void 0!==e.vertexColors&&("face"===e.vertexColors?s.vertexColors=THREE.FaceColors:e.vertexColors&&(s.vertexColors=THREE.VertexColors)),e.colorDiffuse?s.color=n(e.colorDiffuse):e.DbgColor&&(s.color=e.DbgColor),e.colorSpecular&&(s.specular=n(e.colorSpecular)),e.colorEmissive&&(s.emissive=n(e.colorEmissive)),void 0!==e.transparency&&(console.warn("THREE.Loader: transparency has been renamed to opacity"),e.opacity=e.transparency),void 0!==e.opacity&&(s.opacity=e.opacity),e.specularCoef&&(s.shininess=e.specularCoef),e.mapDiffuse&&t&&i(s,"map",e.mapDiffuse,e.mapDiffuseRepeat,e.mapDiffuseOffset,e.mapDiffuseWrap,e.mapDiffuseAnisotropy),e.mapLight&&t&&i(s,"lightMap",e.mapLight,e.mapLightRepeat,e.mapLightOffset,e.mapLightWrap,e.mapLightAnisotropy),e.mapBump&&t&&i(s,"bumpMap",e.mapBump,e.mapBumpRepeat,e.mapBumpOffset,e.mapBumpWrap,e.mapBumpAnisotropy),e.mapNormal&&t&&i(s,"normalMap",e.mapNormal,e.mapNormalRepeat,e.mapNormalOffset,e.mapNormalWrap,e.mapNormalAnisotropy),e.mapSpecular&&t&&i(s,"specularMap",e.mapSpecular,e.mapSpecularRepeat,e.mapSpecularOffset,e.mapSpecularWrap,e.mapSpecularAnisotropy),e.mapAlpha&&t&&i(s,"alphaMap",e.mapAlpha,e.mapAlphaRepeat,e.mapAlphaOffset,e.mapAlphaWrap,e.mapAlphaAnisotropy),e.mapBumpScale&&(s.bumpScale=e.mapBumpScale),e.mapNormalFactor&&(s.normalScale=new THREE.Vector2(e.mapNormalFactor,e.mapNormalFactor)),a=new THREE[a](s),void 0!==e.DbgName&&(a.name=e.DbgName),a}},THREE.Loader.Handlers={handlers:[],add:function(e,t){this.handlers.push(e,t)},get:function(e){for(var t=0,r=this.handlers.length;r>t;t+=2){var i=this.handlers[t+1];if(this.handlers[t].test(e))return i}return null}},THREE.XHRLoader=function(e){this.manager=void 0!==e?e:THREE.DefaultLoadingManager},THREE.XHRLoader.prototype={constructor:THREE.XHRLoader,load:function(e,t,r,i){var n=this,o=THREE.Cache.get(e);void 0!==o?t&&t(o):(o=new XMLHttpRequest,o.open("GET",e,!0),o.addEventListener("load",function(r){THREE.Cache.add(e,this.response),t&&t(this.response),n.manager.itemEnd(e)},!1),void 0!==r&&o.addEventListener("progress",function(e){r(e)},!1),void 0!==i&&o.addEventListener("error",function(e){i(e)},!1),void 0!==this.crossOrigin&&(o.crossOrigin=this.crossOrigin),void 0!==this.responseType&&(o.responseType=this.responseType),o.send(null),n.manager.itemStart(e))},setResponseType:function(e){this.responseType=e},setCrossOrigin:function(e){this.crossOrigin=e}},THREE.ImageLoader=function(e){this.manager=void 0!==e?e:THREE.DefaultLoadingManager},THREE.ImageLoader.prototype={constructor:THREE.ImageLoader,load:function(e,t,r,i){var n=this,o=THREE.Cache.get(e);return void 0===o?(o=document.createElement("img"),o.addEventListener("load",function(r){THREE.Cache.add(e,this),t&&t(this),n.manager.itemEnd(e)},!1),void 0!==r&&o.addEventListener("progress",function(e){r(e)},!1),void 0!==i&&o.addEventListener("error",function(e){i(e)},!1),void 0!==this.crossOrigin&&(o.crossOrigin=this.crossOrigin),o.src=e,n.manager.itemStart(e),o):void t(o)},setCrossOrigin:function(e){this.crossOrigin=e}},THREE.JSONLoader=function(e){THREE.Loader.call(this,e),this.withCredentials=!1},THREE.JSONLoader.prototype=Object.create(THREE.Loader.prototype),THREE.JSONLoader.prototype.constructor=THREE.JSONLoader,THREE.JSONLoader.prototype.load=function(e,t,r){r=r&&"string"==typeof r?r:this.extractUrlBase(e),this.onLoadStart(),this.loadAjaxJSON(this,e,t,r)},THREE.JSONLoader.prototype.loadAjaxJSON=function(e,t,r,i,n){var o=new XMLHttpRequest,a=0;o.onreadystatechange=function(){if(o.readyState===o.DONE)if(200===o.status||0===o.status){if(o.responseText){var s=JSON.parse(o.responseText),h=s.metadata;if(void 0!==h){if("object"===h.type)return void THREE.error("THREE.JSONLoader: "+t+" should be loaded with THREE.ObjectLoader instead.");if("scene"===h.type)return void THREE.error("THREE.JSONLoader: "+t+" seems to be a Scene. Use THREE.SceneLoader instead.")}s=e.parse(s,i),r(s.geometry,s.materials)}else THREE.error("THREE.JSONLoader: "+t+" seems to be unreachable or the file is empty.");e.onLoadComplete()}else THREE.error("THREE.JSONLoader: Couldn't load "+t+" ("+o.status+")");else o.readyState===o.LOADING?n&&(0===a&&(a=o.getResponseHeader("Content-Length")),n({total:a,loaded:o.responseText.length})):o.readyState===o.HEADERS_RECEIVED&&void 0!==n&&(a=o.getResponseHeader("Content-Length"))},o.open("GET",t,!0),o.withCredentials=this.withCredentials,o.send(null)},THREE.JSONLoader.prototype.parse=function(e,t){var r=new THREE.Geometry,i=void 0!==e.scale?1/e.scale:1;return function(t){var i,n,o,a,s,h,c,l,u,E,p,d,f,m=e.faces;h=e.vertices;var T=e.normals,g=e.colors,R=0;if(void 0!==e.uvs){for(i=0;i<e.uvs.length;i++)e.uvs[i].length&&R++;for(i=0;R>i;i++)r.faceVertexUvs[i]=[]}for(a=0,s=h.length;s>a;)i=new THREE.Vector3,i.x=h[a++]*t,i.y=h[a++]*t,i.z=h[a++]*t,r.vertices.push(i);for(a=0,s=m.length;s>a;)if(t=m[a++],u=1&t,o=2&t,i=8&t,c=16&t,E=32&t,h=64&t,t&=128,u){if(u=new THREE.Face3,u.a=m[a],u.b=m[a+1],u.c=m[a+3],p=new THREE.Face3,p.a=m[a+1],p.b=m[a+2],p.c=m[a+3],a+=4,o&&(o=m[a++],u.materialIndex=o,p.materialIndex=o),o=r.faces.length,i)for(i=0;R>i;i++)for(d=e.uvs[i],r.faceVertexUvs[i][o]=[],r.faceVertexUvs[i][o+1]=[],n=0;4>n;n++)l=m[a++],f=d[2*l],l=d[2*l+1],f=new THREE.Vector2(f,l),2!==n&&r.faceVertexUvs[i][o].push(f),0!==n&&r.faceVertexUvs[i][o+1].push(f);if(c&&(c=3*m[a++],u.normal.set(T[c++],T[c++],T[c]),p.normal.copy(u.normal)),E)for(i=0;4>i;i++)c=3*m[a++],E=new THREE.Vector3(T[c++],T[c++],T[c]),2!==i&&u.vertexNormals.push(E),0!==i&&p.vertexNormals.push(E);if(h&&(h=m[a++],h=g[h],u.color.setHex(h),p.color.setHex(h)),t)for(i=0;4>i;i++)h=m[a++],h=g[h],2!==i&&u.vertexColors.push(new THREE.Color(h)),0!==i&&p.vertexColors.push(new THREE.Color(h));r.faces.push(u),r.faces.push(p)}else{if(u=new THREE.Face3,u.a=m[a++],u.b=m[a++],u.c=m[a++],o&&(o=m[a++],u.materialIndex=o),o=r.faces.length,i)for(i=0;R>i;i++)for(d=e.uvs[i],r.faceVertexUvs[i][o]=[],n=0;3>n;n++)l=m[a++],f=d[2*l],l=d[2*l+1],f=new THREE.Vector2(f,l),r.faceVertexUvs[i][o].push(f);if(c&&(c=3*m[a++],u.normal.set(T[c++],T[c++],T[c])),E)for(i=0;3>i;i++)c=3*m[a++],E=new THREE.Vector3(T[c++],T[c++],T[c]),u.vertexNormals.push(E);if(h&&(h=m[a++],u.color.setHex(g[h])),t)for(i=0;3>i;i++)h=m[a++],u.vertexColors.push(new THREE.Color(g[h]));r.faces.push(u)}}(i),function(){var t=void 0!==e.influencesPerVertex?e.influencesPerVertex:2;if(e.skinWeights)for(var i=0,n=e.skinWeights.length;n>i;i+=t)r.skinWeights.push(new THREE.Vector4(e.skinWeights[i],t>1?e.skinWeights[i+1]:0,t>2?e.skinWeights[i+2]:0,t>3?e.skinWeights[i+3]:0));if(e.skinIndices)for(i=0,n=e.skinIndices.length;n>i;i+=t)r.skinIndices.push(new THREE.Vector4(e.skinIndices[i],t>1?e.skinIndices[i+1]:0,t>2?e.skinIndices[i+2]:0,t>3?e.skinIndices[i+3]:0));r.bones=e.bones,r.bones&&0<r.bones.length&&(r.skinWeights.length!==r.skinIndices.length||r.skinIndices.length!==r.vertices.length)&&THREE.warn("THREE.JSONLoader: When skinning, number of vertices ("+r.vertices.length+"), skinIndices ("+r.skinIndices.length+"), and skinWeights ("+r.skinWeights.length+") should match."),r.animation=e.animation,r.animations=e.animations}(),function(t){if(void 0!==e.morphTargets){var i,n,o,a,s,h;for(i=0,n=e.morphTargets.length;n>i;i++)for(r.morphTargets[i]={},r.morphTargets[i].name=e.morphTargets[i].name,r.morphTargets[i].vertices=[],s=r.morphTargets[i].vertices,h=e.morphTargets[i].vertices,o=0,a=h.length;a>o;o+=3){var c=new THREE.Vector3;c.x=h[o]*t,c.y=h[o+1]*t,c.z=h[o+2]*t,s.push(c)}}if(void 0!==e.morphColors)for(i=0,n=e.morphColors.length;n>i;i++)for(r.morphColors[i]={},r.morphColors[i].name=e.morphColors[i].name,r.morphColors[i].colors=[],a=r.morphColors[i].colors,s=e.morphColors[i].colors,t=0,o=s.length;o>t;t+=3)h=new THREE.Color(16755200),h.setRGB(s[t],s[t+1],s[t+2]),a.push(h)}(i),r.computeFaceNormals(),r.computeBoundingSphere(),void 0===e.materials||0===e.materials.length?{geometry:r}:(i=this.initMaterials(e.materials,t),this.needsTangents(i)&&r.computeTangents(),{geometry:r,materials:i})},THREE.LoadingManager=function(e,t,r){var i=this,n=0,o=0;this.onLoad=e,this.onProgress=t,this.onError=r,this.itemStart=function(e){o++},this.itemEnd=function(e){n++,void 0!==i.onProgress&&i.onProgress(e,n,o),n===o&&void 0!==i.onLoad&&i.onLoad()}},THREE.DefaultLoadingManager=new THREE.LoadingManager,THREE.BufferGeometryLoader=function(e){this.manager=void 0!==e?e:THREE.DefaultLoadingManager},THREE.BufferGeometryLoader.prototype={constructor:THREE.BufferGeometryLoader,load:function(e,t,r,i){var n=this,o=new THREE.XHRLoader(n.manager);o.setCrossOrigin(this.crossOrigin),o.load(e,function(e){t(n.parse(JSON.parse(e)))},r,i)},setCrossOrigin:function(e){this.crossOrigin=e},parse:function(e){var t,r=new THREE.BufferGeometry,i=e.data.attributes;for(t in i){var n=i[t],o=new self[n.type](n.array);r.addAttribute(t,new THREE.BufferAttribute(o,n.itemSize))}return i=e.data.offsets,
	void 0!==i&&(r.offsets=JSON.parse(JSON.stringify(i))),e=e.data.boundingSphere,void 0!==e&&(i=new THREE.Vector3,void 0!==e.center&&i.fromArray(e.center),r.boundingSphere=new THREE.Sphere(i,e.radius)),r}},THREE.MaterialLoader=function(e){this.manager=void 0!==e?e:THREE.DefaultLoadingManager},THREE.MaterialLoader.prototype={constructor:THREE.MaterialLoader,load:function(e,t,r,i){var n=this,o=new THREE.XHRLoader(n.manager);o.setCrossOrigin(this.crossOrigin),o.load(e,function(e){t(n.parse(JSON.parse(e)))},r,i)},setCrossOrigin:function(e){this.crossOrigin=e},parse:function(e){var t=new THREE[e.type];if(void 0!==e.color&&t.color.setHex(e.color),void 0!==e.emissive&&t.emissive.setHex(e.emissive),void 0!==e.specular&&t.specular.setHex(e.specular),void 0!==e.shininess&&(t.shininess=e.shininess),void 0!==e.uniforms&&(t.uniforms=e.uniforms),void 0!==e.vertexShader&&(t.vertexShader=e.vertexShader),void 0!==e.fragmentShader&&(t.fragmentShader=e.fragmentShader),void 0!==e.vertexColors&&(t.vertexColors=e.vertexColors),void 0!==e.shading&&(t.shading=e.shading),void 0!==e.blending&&(t.blending=e.blending),void 0!==e.side&&(t.side=e.side),void 0!==e.opacity&&(t.opacity=e.opacity),void 0!==e.transparent&&(t.transparent=e.transparent),void 0!==e.wireframe&&(t.wireframe=e.wireframe),void 0!==e.size&&(t.size=e.size),void 0!==e.sizeAttenuation&&(t.sizeAttenuation=e.sizeAttenuation),void 0!==e.materials)for(var r=0,i=e.materials.length;i>r;r++)t.materials.push(this.parse(e.materials[r]));return t}},THREE.ObjectLoader=function(e){this.manager=void 0!==e?e:THREE.DefaultLoadingManager,this.texturePath=""},THREE.ObjectLoader.prototype={constructor:THREE.ObjectLoader,load:function(e,t,r,i){""===this.texturePath&&(this.texturePath=e.substring(0,e.lastIndexOf("/")+1));var n=this,o=new THREE.XHRLoader(n.manager);o.setCrossOrigin(this.crossOrigin),o.load(e,function(e){n.parse(JSON.parse(e),t)},r,i)},setTexturePath:function(e){this.texturePath=e},setCrossOrigin:function(e){this.crossOrigin=e},parse:function(e,t){var r=this.parseGeometries(e.geometries),i=this.parseImages(e.images,function(){void 0!==t&&t(n)}),i=this.parseTextures(e.textures,i),i=this.parseMaterials(e.materials,i),n=this.parseObject(e.object,r,i);return void 0!==e.images&&0!==e.images.length||void 0===t||t(n),n},parseGeometries:function(e){var t={};if(void 0!==e)for(var r=new THREE.JSONLoader,i=new THREE.BufferGeometryLoader,n=0,o=e.length;o>n;n++){var a,s=e[n];switch(s.type){case"PlaneGeometry":case"PlaneBufferGeometry":a=new THREE[s.type](s.width,s.height,s.widthSegments,s.heightSegments);break;case"BoxGeometry":case"CubeGeometry":a=new THREE.BoxGeometry(s.width,s.height,s.depth,s.widthSegments,s.heightSegments,s.depthSegments);break;case"CircleGeometry":a=new THREE.CircleGeometry(s.radius,s.segments);break;case"CylinderGeometry":a=new THREE.CylinderGeometry(s.radiusTop,s.radiusBottom,s.height,s.radialSegments,s.heightSegments,s.openEnded);break;case"SphereGeometry":a=new THREE.SphereGeometry(s.radius,s.widthSegments,s.heightSegments,s.phiStart,s.phiLength,s.thetaStart,s.thetaLength);break;case"IcosahedronGeometry":a=new THREE.IcosahedronGeometry(s.radius,s.detail);break;case"TorusGeometry":a=new THREE.TorusGeometry(s.radius,s.tube,s.radialSegments,s.tubularSegments,s.arc);break;case"TorusKnotGeometry":a=new THREE.TorusKnotGeometry(s.radius,s.tube,s.radialSegments,s.tubularSegments,s.p,s.q,s.heightScale);break;case"BufferGeometry":a=i.parse(s);break;case"Geometry":a=r.parse(s.data).geometry}a.uuid=s.uuid,void 0!==s.name&&(a.name=s.name),t[s.uuid]=a}return t},parseMaterials:function(e,t){var r={};if(void 0!==e)for(var i=function(e){return void 0===t[e]&&THREE.warn("THREE.ObjectLoader: Undefined texture",e),t[e]},n=new THREE.MaterialLoader,o=0,a=e.length;a>o;o++){var s=e[o],h=n.parse(s);h.uuid=s.uuid,void 0!==s.name&&(h.name=s.name),void 0!==s.map&&(h.map=i(s.map)),void 0!==s.bumpMap&&(h.bumpMap=i(s.bumpMap),s.bumpScale&&(h.bumpScale=new THREE.Vector2(s.bumpScale,s.bumpScale))),void 0!==s.alphaMap&&(h.alphaMap=i(s.alphaMap)),void 0!==s.envMap&&(h.envMap=i(s.envMap)),void 0!==s.normalMap&&(h.normalMap=i(s.normalMap),s.normalScale&&(h.normalScale=new THREE.Vector2(s.normalScale,s.normalScale))),void 0!==s.lightMap&&(h.lightMap=i(s.lightMap)),void 0!==s.specularMap&&(h.specularMap=i(s.specularMap)),r[s.uuid]=h}return r},parseImages:function(e,t){var r=this,i={};if(void 0!==e&&0<e.length){var n=new THREE.LoadingManager(t),o=new THREE.ImageLoader(n);o.setCrossOrigin(this.crossOrigin);for(var n=function(e){return r.manager.itemStart(e),o.load(e,function(){r.manager.itemEnd(e)})},a=0,s=e.length;s>a;a++){var h=e[a],c=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(h.url)?h.url:r.texturePath+h.url;i[h.uuid]=n(c)}}return i},parseTextures:function(e,t){var r={};if(void 0!==e)for(var i=0,n=e.length;n>i;i++){var o=e[i];void 0===o.image&&THREE.warn('THREE.ObjectLoader: No "image" speficied for',o.uuid),void 0===t[o.image]&&THREE.warn("THREE.ObjectLoader: Undefined image",o.image);var a=new THREE.Texture(t[o.image]);a.needsUpdate=!0,a.uuid=o.uuid,void 0!==o.name&&(a.name=o.name),void 0!==o.repeat&&(a.repeat=new THREE.Vector2(o.repeat[0],o.repeat[1])),void 0!==o.minFilter&&(a.minFilter=THREE[o.minFilter]),void 0!==o.magFilter&&(a.magFilter=THREE[o.magFilter]),void 0!==o.anisotropy&&(a.anisotropy=o.anisotropy),o.wrap instanceof Array&&(a.wrapS=THREE[o.wrap[0]],a.wrapT=THREE[o.wrap[1]]),r[o.uuid]=a}return r},parseObject:function(){var e=new THREE.Matrix4;return function(t,r,i){var n;n=function(e){return void 0===r[e]&&THREE.warn("THREE.ObjectLoader: Undefined geometry",e),r[e]};var o=function(e){return void 0===i[e]&&THREE.warn("THREE.ObjectLoader: Undefined material",e),i[e]};switch(t.type){case"Scene":n=new THREE.Scene;break;case"PerspectiveCamera":n=new THREE.PerspectiveCamera(t.fov,t.aspect,t.near,t.far);break;case"OrthographicCamera":n=new THREE.OrthographicCamera(t.left,t.right,t.top,t.bottom,t.near,t.far);break;case"AmbientLight":n=new THREE.AmbientLight(t.color);break;case"DirectionalLight":n=new THREE.DirectionalLight(t.color,t.intensity);break;case"PointLight":n=new THREE.PointLight(t.color,t.intensity,t.distance,t.decay);break;case"SpotLight":n=new THREE.SpotLight(t.color,t.intensity,t.distance,t.angle,t.exponent,t.decay);break;case"HemisphereLight":n=new THREE.HemisphereLight(t.color,t.groundColor,t.intensity);break;case"Mesh":n=new THREE.Mesh(n(t.geometry),o(t.material));break;case"Line":n=new THREE.Line(n(t.geometry),o(t.material),t.mode);break;case"PointCloud":n=new THREE.PointCloud(n(t.geometry),o(t.material));break;case"Sprite":n=new THREE.Sprite(o(t.material));break;case"Group":n=new THREE.Group;break;default:n=new THREE.Object3D}if(n.uuid=t.uuid,void 0!==t.name&&(n.name=t.name),void 0!==t.matrix?(e.fromArray(t.matrix),e.decompose(n.position,n.quaternion,n.scale)):(void 0!==t.position&&n.position.fromArray(t.position),void 0!==t.rotation&&n.rotation.fromArray(t.rotation),void 0!==t.scale&&n.scale.fromArray(t.scale)),void 0!==t.visible&&(n.visible=t.visible),void 0!==t.userData&&(n.userData=t.userData),void 0!==t.children)for(var a in t.children)n.add(this.parseObject(t.children[a],r,i));return n}}()},THREE.TextureLoader=function(e){this.manager=void 0!==e?e:THREE.DefaultLoadingManager},THREE.TextureLoader.prototype={constructor:THREE.TextureLoader,load:function(e,t,r,i){var n=new THREE.ImageLoader(this.manager);n.setCrossOrigin(this.crossOrigin),n.load(e,function(e){e=new THREE.Texture(e),e.needsUpdate=!0,void 0!==t&&t(e)},r,i)},setCrossOrigin:function(e){this.crossOrigin=e}},THREE.DataTextureLoader=THREE.BinaryTextureLoader=function(){this._parser=null},THREE.BinaryTextureLoader.prototype={constructor:THREE.BinaryTextureLoader,load:function(e,t,r,i){var n=this,o=new THREE.DataTexture,a=new THREE.XHRLoader;return a.setResponseType("arraybuffer"),a.load(e,function(e){(e=n._parser(e))&&(void 0!==e.image?o.image=e.image:void 0!==e.data&&(o.image.width=e.width,o.image.height=e.height,o.image.data=e.data),o.wrapS=void 0!==e.wrapS?e.wrapS:THREE.ClampToEdgeWrapping,o.wrapT=void 0!==e.wrapT?e.wrapT:THREE.ClampToEdgeWrapping,o.magFilter=void 0!==e.magFilter?e.magFilter:THREE.LinearFilter,o.minFilter=void 0!==e.minFilter?e.minFilter:THREE.LinearMipMapLinearFilter,o.anisotropy=void 0!==e.anisotropy?e.anisotropy:1,void 0!==e.format&&(o.format=e.format),void 0!==e.type&&(o.type=e.type),void 0!==e.mipmaps&&(o.mipmaps=e.mipmaps),1===e.mipmapCount&&(o.minFilter=THREE.LinearFilter),o.needsUpdate=!0,t&&t(o,e))},r,i),o}},THREE.CompressedTextureLoader=function(){this._parser=null},THREE.CompressedTextureLoader.prototype={constructor:THREE.CompressedTextureLoader,load:function(e,t,r){var i=this,n=[],o=new THREE.CompressedTexture;o.image=n;var a=new THREE.XHRLoader;if(a.setResponseType("arraybuffer"),e instanceof Array){var s=0;r=function(r){a.load(e[r],function(e){e=i._parser(e,!0),n[r]={width:e.width,height:e.height,format:e.format,mipmaps:e.mipmaps},s+=1,6===s&&(1==e.mipmapCount&&(o.minFilter=THREE.LinearFilter),o.format=e.format,o.needsUpdate=!0,t&&t(o))})};for(var h=0,c=e.length;c>h;++h)r(h)}else a.load(e,function(e){if(e=i._parser(e,!0),e.isCubemap)for(var r=e.mipmaps.length/e.mipmapCount,a=0;r>a;a++){n[a]={mipmaps:[]};for(var s=0;s<e.mipmapCount;s++)n[a].mipmaps.push(e.mipmaps[a*e.mipmapCount+s]),n[a].format=e.format,n[a].width=e.width,n[a].height=e.height}else o.image.width=e.width,o.image.height=e.height,o.mipmaps=e.mipmaps;1===e.mipmapCount&&(o.minFilter=THREE.LinearFilter),o.format=e.format,o.needsUpdate=!0,t&&t(o)});return o}},THREE.Material=function(){Object.defineProperty(this,"id",{value:THREE.MaterialIdCount++}),this.uuid=THREE.Math.generateUUID(),this.name="",this.type="Material",this.side=THREE.FrontSide,this.opacity=1,this.transparent=!1,this.blending=THREE.NormalBlending,this.blendSrc=THREE.SrcAlphaFactor,this.blendDst=THREE.OneMinusSrcAlphaFactor,this.blendEquation=THREE.AddEquation,this.blendEquationAlpha=this.blendDstAlpha=this.blendSrcAlpha=null,this.colorWrite=this.depthWrite=this.depthTest=!0,this.polygonOffset=!1,this.overdraw=this.alphaTest=this.polygonOffsetUnits=this.polygonOffsetFactor=0,this._needsUpdate=this.visible=!0},THREE.Material.prototype={constructor:THREE.Material,get needsUpdate(){return this._needsUpdate},set needsUpdate(e){!0===e&&this.update(),this._needsUpdate=e},setValues:function(e){if(void 0!==e)for(var t in e){var r=e[t];if(void 0===r)THREE.warn("THREE.Material: '"+t+"' parameter is undefined.");else if(t in this){var i=this[t];i instanceof THREE.Color?i.set(r):i instanceof THREE.Vector3&&r instanceof THREE.Vector3?i.copy(r):this[t]="overdraw"==t?Number(r):r}}},toJSON:function(){var e={metadata:{version:4.2,type:"material",generator:"MaterialExporter"},uuid:this.uuid,type:this.type};return""!==this.name&&(e.name=this.name),this instanceof THREE.MeshBasicMaterial?(e.color=this.color.getHex(),this.vertexColors!==THREE.NoColors&&(e.vertexColors=this.vertexColors),this.blending!==THREE.NormalBlending&&(e.blending=this.blending),this.side!==THREE.FrontSide&&(e.side=this.side)):this instanceof THREE.MeshLambertMaterial?(e.color=this.color.getHex(),e.emissive=this.emissive.getHex(),this.vertexColors!==THREE.NoColors&&(e.vertexColors=this.vertexColors),this.shading!==THREE.SmoothShading&&(e.shading=this.shading),this.blending!==THREE.NormalBlending&&(e.blending=this.blending),this.side!==THREE.FrontSide&&(e.side=this.side)):this instanceof THREE.MeshPhongMaterial?(e.color=this.color.getHex(),e.emissive=this.emissive.getHex(),e.specular=this.specular.getHex(),e.shininess=this.shininess,this.vertexColors!==THREE.NoColors&&(e.vertexColors=this.vertexColors),this.shading!==THREE.SmoothShading&&(e.shading=this.shading),this.blending!==THREE.NormalBlending&&(e.blending=this.blending),this.side!==THREE.FrontSide&&(e.side=this.side)):this instanceof THREE.MeshNormalMaterial?(this.blending!==THREE.NormalBlending&&(e.blending=this.blending),this.side!==THREE.FrontSide&&(e.side=this.side)):this instanceof THREE.MeshDepthMaterial?(this.blending!==THREE.NormalBlending&&(e.blending=this.blending),this.side!==THREE.FrontSide&&(e.side=this.side)):this instanceof THREE.PointCloudMaterial?(e.size=this.size,e.sizeAttenuation=this.sizeAttenuation,e.color=this.color.getHex(),this.vertexColors!==THREE.NoColors&&(e.vertexColors=this.vertexColors),this.blending!==THREE.NormalBlending&&(e.blending=this.blending)):this instanceof THREE.ShaderMaterial?(e.uniforms=this.uniforms,e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader):this instanceof THREE.SpriteMaterial&&(e.color=this.color.getHex()),1>this.opacity&&(e.opacity=this.opacity),!1!==this.transparent&&(e.transparent=this.transparent),!1!==this.wireframe&&(e.wireframe=this.wireframe),e},clone:function(e){return void 0===e&&(e=new THREE.Material),e.name=this.name,e.side=this.side,e.opacity=this.opacity,e.transparent=this.transparent,e.blending=this.blending,e.blendSrc=this.blendSrc,e.blendDst=this.blendDst,e.blendEquation=this.blendEquation,e.blendSrcAlpha=this.blendSrcAlpha,e.blendDstAlpha=this.blendDstAlpha,e.blendEquationAlpha=this.blendEquationAlpha,e.depthTest=this.depthTest,e.depthWrite=this.depthWrite,e.polygonOffset=this.polygonOffset,e.polygonOffsetFactor=this.polygonOffsetFactor,e.polygonOffsetUnits=this.polygonOffsetUnits,e.alphaTest=this.alphaTest,e.overdraw=this.overdraw,e.visible=this.visible,e},update:function(){this.dispatchEvent({type:"update"})},dispose:function(){this.dispatchEvent({type:"dispose"})}},THREE.EventDispatcher.prototype.apply(THREE.Material.prototype),THREE.MaterialIdCount=0,THREE.LineBasicMaterial=function(e){THREE.Material.call(this),this.type="LineBasicMaterial",this.color=new THREE.Color(16777215),this.linewidth=1,this.linejoin=this.linecap="round",this.vertexColors=THREE.NoColors,this.fog=!0,this.setValues(e)},THREE.LineBasicMaterial.prototype=Object.create(THREE.Material.prototype),THREE.LineBasicMaterial.prototype.constructor=THREE.LineBasicMaterial,THREE.LineBasicMaterial.prototype.clone=function(){var e=new THREE.LineBasicMaterial;return THREE.Material.prototype.clone.call(this,e),e.color.copy(this.color),e.linewidth=this.linewidth,e.linecap=this.linecap,e.linejoin=this.linejoin,e.vertexColors=this.vertexColors,e.fog=this.fog,e},THREE.LineDashedMaterial=function(e){THREE.Material.call(this),this.type="LineDashedMaterial",this.color=new THREE.Color(16777215),this.scale=this.linewidth=1,this.dashSize=3,this.gapSize=1,this.vertexColors=!1,this.fog=!0,this.setValues(e)},THREE.LineDashedMaterial.prototype=Object.create(THREE.Material.prototype),THREE.LineDashedMaterial.prototype.constructor=THREE.LineDashedMaterial,THREE.LineDashedMaterial.prototype.clone=function(){var e=new THREE.LineDashedMaterial;return THREE.Material.prototype.clone.call(this,e),e.color.copy(this.color),e.linewidth=this.linewidth,e.scale=this.scale,e.dashSize=this.dashSize,e.gapSize=this.gapSize,e.vertexColors=this.vertexColors,e.fog=this.fog,e},THREE.MeshBasicMaterial=function(e){THREE.Material.call(this),this.type="MeshBasicMaterial",this.color=new THREE.Color(16777215),this.envMap=this.alphaMap=this.specularMap=this.lightMap=this.map=null,this.combine=THREE.MultiplyOperation,this.reflectivity=1,this.refractionRatio=.98,this.fog=!0,this.shading=THREE.SmoothShading,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinejoin=this.wireframeLinecap="round",this.vertexColors=THREE.NoColors,this.morphTargets=this.skinning=!1,this.setValues(e)},THREE.MeshBasicMaterial.prototype=Object.create(THREE.Material.prototype),THREE.MeshBasicMaterial.prototype.constructor=THREE.MeshBasicMaterial,THREE.MeshBasicMaterial.prototype.clone=function(){var e=new THREE.MeshBasicMaterial;return THREE.Material.prototype.clone.call(this,e),e.color.copy(this.color),e.map=this.map,e.lightMap=this.lightMap,e.specularMap=this.specularMap,e.alphaMap=this.alphaMap,e.envMap=this.envMap,e.combine=this.combine,e.reflectivity=this.reflectivity,e.refractionRatio=this.refractionRatio,e.fog=this.fog,e.shading=this.shading,e.wireframe=this.wireframe,e.wireframeLinewidth=this.wireframeLinewidth,e.wireframeLinecap=this.wireframeLinecap,e.wireframeLinejoin=this.wireframeLinejoin,e.vertexColors=this.vertexColors,e.skinning=this.skinning,e.morphTargets=this.morphTargets,e},THREE.MeshLambertMaterial=function(e){THREE.Material.call(this),this.type="MeshLambertMaterial",this.color=new THREE.Color(16777215),this.emissive=new THREE.Color(0),this.wrapAround=!1,this.wrapRGB=new THREE.Vector3(1,1,1),this.envMap=this.alphaMap=this.specularMap=this.lightMap=this.map=null,this.combine=THREE.MultiplyOperation,this.reflectivity=1,this.refractionRatio=.98,this.fog=!0,this.shading=THREE.SmoothShading,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinejoin=this.wireframeLinecap="round",this.vertexColors=THREE.NoColors,this.morphNormals=this.morphTargets=this.skinning=!1,this.setValues(e)},THREE.MeshLambertMaterial.prototype=Object.create(THREE.Material.prototype),THREE.MeshLambertMaterial.prototype.constructor=THREE.MeshLambertMaterial,THREE.MeshLambertMaterial.prototype.clone=function(){var e=new THREE.MeshLambertMaterial;return THREE.Material.prototype.clone.call(this,e),e.color.copy(this.color),e.emissive.copy(this.emissive),e.wrapAround=this.wrapAround,e.wrapRGB.copy(this.wrapRGB),e.map=this.map,e.lightMap=this.lightMap,e.specularMap=this.specularMap,e.alphaMap=this.alphaMap,e.envMap=this.envMap,e.combine=this.combine,e.reflectivity=this.reflectivity,e.refractionRatio=this.refractionRatio,e.fog=this.fog,e.shading=this.shading,e.wireframe=this.wireframe,e.wireframeLinewidth=this.wireframeLinewidth,e.wireframeLinecap=this.wireframeLinecap,e.wireframeLinejoin=this.wireframeLinejoin,e.vertexColors=this.vertexColors,e.skinning=this.skinning,e.morphTargets=this.morphTargets,e.morphNormals=this.morphNormals,e},THREE.MeshPhongMaterial=function(e){THREE.Material.call(this),this.type="MeshPhongMaterial",this.color=new THREE.Color(16777215),this.emissive=new THREE.Color(0),this.specular=new THREE.Color(1118481),this.shininess=30,this.wrapAround=this.metal=!1,this.wrapRGB=new THREE.Vector3(1,1,1),this.bumpMap=this.lightMap=this.map=null,this.bumpScale=1,this.normalMap=null,this.normalScale=new THREE.Vector2(1,1),this.envMap=this.alphaMap=this.specularMap=null,this.combine=THREE.MultiplyOperation,this.reflectivity=1,this.refractionRatio=.98,this.fog=!0,this.shading=THREE.SmoothShading,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinejoin=this.wireframeLinecap="round",this.vertexColors=THREE.NoColors,this.morphNormals=this.morphTargets=this.skinning=!1,this.setValues(e)},THREE.MeshPhongMaterial.prototype=Object.create(THREE.Material.prototype),THREE.MeshPhongMaterial.prototype.constructor=THREE.MeshPhongMaterial,THREE.MeshPhongMaterial.prototype.clone=function(){var e=new THREE.MeshPhongMaterial;return THREE.Material.prototype.clone.call(this,e),e.color.copy(this.color),e.emissive.copy(this.emissive),e.specular.copy(this.specular),e.shininess=this.shininess,e.metal=this.metal,e.wrapAround=this.wrapAround,e.wrapRGB.copy(this.wrapRGB),e.map=this.map,e.lightMap=this.lightMap,e.bumpMap=this.bumpMap,e.bumpScale=this.bumpScale,e.normalMap=this.normalMap,e.normalScale.copy(this.normalScale),e.specularMap=this.specularMap,e.alphaMap=this.alphaMap,e.envMap=this.envMap,e.combine=this.combine,e.reflectivity=this.reflectivity,e.refractionRatio=this.refractionRatio,e.fog=this.fog,e.shading=this.shading,e.wireframe=this.wireframe,e.wireframeLinewidth=this.wireframeLinewidth,e.wireframeLinecap=this.wireframeLinecap,e.wireframeLinejoin=this.wireframeLinejoin,e.vertexColors=this.vertexColors,e.skinning=this.skinning,e.morphTargets=this.morphTargets,e.morphNormals=this.morphNormals,e},THREE.MeshDepthMaterial=function(e){THREE.Material.call(this),this.type="MeshDepthMaterial",this.wireframe=this.morphTargets=!1,this.wireframeLinewidth=1,this.setValues(e)},THREE.MeshDepthMaterial.prototype=Object.create(THREE.Material.prototype),THREE.MeshDepthMaterial.prototype.constructor=THREE.MeshDepthMaterial,THREE.MeshDepthMaterial.prototype.clone=function(){var e=new THREE.MeshDepthMaterial;return THREE.Material.prototype.clone.call(this,e),e.wireframe=this.wireframe,e.wireframeLinewidth=this.wireframeLinewidth,e},THREE.MeshNormalMaterial=function(e){THREE.Material.call(this,e),this.type="MeshNormalMaterial",this.wireframe=!1,this.wireframeLinewidth=1,this.morphTargets=!1,this.setValues(e)},THREE.MeshNormalMaterial.prototype=Object.create(THREE.Material.prototype),THREE.MeshNormalMaterial.prototype.constructor=THREE.MeshNormalMaterial,THREE.MeshNormalMaterial.prototype.clone=function(){var e=new THREE.MeshNormalMaterial;return THREE.Material.prototype.clone.call(this,e),e.wireframe=this.wireframe,e.wireframeLinewidth=this.wireframeLinewidth,e},THREE.MeshFaceMaterial=function(e){this.uuid=THREE.Math.generateUUID(),this.type="MeshFaceMaterial",this.materials=e instanceof Array?e:[]},THREE.MeshFaceMaterial.prototype={constructor:THREE.MeshFaceMaterial,toJSON:function(){for(var e={metadata:{version:4.2,type:"material",generator:"MaterialExporter"},uuid:this.uuid,type:this.type,materials:[]},t=0,r=this.materials.length;r>t;t++)e.materials.push(this.materials[t].toJSON());return e},clone:function(){for(var e=new THREE.MeshFaceMaterial,t=0;t<this.materials.length;t++)e.materials.push(this.materials[t].clone());return e}},THREE.PointCloudMaterial=function(e){THREE.Material.call(this),this.type="PointCloudMaterial",this.color=new THREE.Color(16777215),this.map=null,this.size=1,this.sizeAttenuation=!0,this.vertexColors=THREE.NoColors,this.fog=!0,this.setValues(e)},THREE.PointCloudMaterial.prototype=Object.create(THREE.Material.prototype),THREE.PointCloudMaterial.prototype.constructor=THREE.PointCloudMaterial,THREE.PointCloudMaterial.prototype.clone=function(){var e=new THREE.PointCloudMaterial;return THREE.Material.prototype.clone.call(this,e),e.color.copy(this.color),e.map=this.map,e.size=this.size,e.sizeAttenuation=this.sizeAttenuation,e.vertexColors=this.vertexColors,e.fog=this.fog,e},THREE.ParticleBasicMaterial=function(e){return THREE.warn("THREE.ParticleBasicMaterial has been renamed to THREE.PointCloudMaterial."),new THREE.PointCloudMaterial(e)},THREE.ParticleSystemMaterial=function(e){return THREE.warn("THREE.ParticleSystemMaterial has been renamed to THREE.PointCloudMaterial."),new THREE.PointCloudMaterial(e)},THREE.ShaderMaterial=function(e){THREE.Material.call(this),this.type="ShaderMaterial",this.defines={},this.uniforms={},this.attributes=null,this.vertexShader="void main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",this.fragmentShader="void main() {\n	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}",this.shading=THREE.SmoothShading,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.lights=this.fog=!1,this.vertexColors=THREE.NoColors,this.morphNormals=this.morphTargets=this.skinning=!1,this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.setValues(e)},THREE.ShaderMaterial.prototype=Object.create(THREE.Material.prototype),THREE.ShaderMaterial.prototype.constructor=THREE.ShaderMaterial,THREE.ShaderMaterial.prototype.clone=function(){var e=new THREE.ShaderMaterial;return THREE.Material.prototype.clone.call(this,e),e.fragmentShader=this.fragmentShader,e.vertexShader=this.vertexShader,e.uniforms=THREE.UniformsUtils.clone(this.uniforms),e.attributes=this.attributes,e.defines=this.defines,e.shading=this.shading,e.wireframe=this.wireframe,e.wireframeLinewidth=this.wireframeLinewidth,e.fog=this.fog,e.lights=this.lights,e.vertexColors=this.vertexColors,e.skinning=this.skinning,e.morphTargets=this.morphTargets,e.morphNormals=this.morphNormals,e},THREE.RawShaderMaterial=function(e){THREE.ShaderMaterial.call(this,e),this.type="RawShaderMaterial"},THREE.RawShaderMaterial.prototype=Object.create(THREE.ShaderMaterial.prototype),THREE.RawShaderMaterial.prototype.constructor=THREE.RawShaderMaterial,THREE.RawShaderMaterial.prototype.clone=function(){var e=new THREE.RawShaderMaterial;return THREE.ShaderMaterial.prototype.clone.call(this,e),e},THREE.SpriteMaterial=function(e){THREE.Material.call(this),this.type="SpriteMaterial",this.color=new THREE.Color(16777215),this.map=null,this.rotation=0,this.fog=!1,this.setValues(e)},THREE.SpriteMaterial.prototype=Object.create(THREE.Material.prototype),THREE.SpriteMaterial.prototype.constructor=THREE.SpriteMaterial,THREE.SpriteMaterial.prototype.clone=function(){var e=new THREE.SpriteMaterial;return THREE.Material.prototype.clone.call(this,e),e.color.copy(this.color),e.map=this.map,e.rotation=this.rotation,e.fog=this.fog,e},THREE.Texture=function(e,t,r,i,n,o,a,s,h){Object.defineProperty(this,"id",{value:THREE.TextureIdCount++}),this.uuid=THREE.Math.generateUUID(),this.sourceFile=this.name="",this.image=void 0!==e?e:THREE.Texture.DEFAULT_IMAGE,this.mipmaps=[],this.mapping=void 0!==t?t:THREE.Texture.DEFAULT_MAPPING,this.wrapS=void 0!==r?r:THREE.ClampToEdgeWrapping,this.wrapT=void 0!==i?i:THREE.ClampToEdgeWrapping,this.magFilter=void 0!==n?n:THREE.LinearFilter,this.minFilter=void 0!==o?o:THREE.LinearMipMapLinearFilter,this.anisotropy=void 0!==h?h:1,this.format=void 0!==a?a:THREE.RGBAFormat,this.type=void 0!==s?s:THREE.UnsignedByteType,this.offset=new THREE.Vector2(0,0),this.repeat=new THREE.Vector2(1,1),this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this._needsUpdate=!1,this.onUpdate=null},THREE.Texture.DEFAULT_IMAGE=void 0,THREE.Texture.DEFAULT_MAPPING=THREE.UVMapping,THREE.Texture.prototype={constructor:THREE.Texture,get needsUpdate(){return this._needsUpdate},set needsUpdate(e){!0===e&&this.update(),this._needsUpdate=e},clone:function(e){return void 0===e&&(e=new THREE.Texture),e.image=this.image,e.mipmaps=this.mipmaps.slice(0),e.mapping=this.mapping,e.wrapS=this.wrapS,e.wrapT=this.wrapT,e.magFilter=this.magFilter,e.minFilter=this.minFilter,e.anisotropy=this.anisotropy,e.format=this.format,e.type=this.type,e.offset.copy(this.offset),e.repeat.copy(this.repeat),e.generateMipmaps=this.generateMipmaps,e.premultiplyAlpha=this.premultiplyAlpha,e.flipY=this.flipY,e.unpackAlignment=this.unpackAlignment,e},update:function(){this.dispatchEvent({type:"update"})},dispose:function(){this.dispatchEvent({type:"dispose"})}},THREE.EventDispatcher.prototype.apply(THREE.Texture.prototype),THREE.TextureIdCount=0,THREE.CubeTexture=function(e,t,r,i,n,o,a,s,h){t=void 0!==t?t:THREE.CubeReflectionMapping,THREE.Texture.call(this,e,t,r,i,n,o,a,s,h),this.images=e},THREE.CubeTexture.prototype=Object.create(THREE.Texture.prototype),THREE.CubeTexture.prototype.constructor=THREE.CubeTexture,THREE.CubeTexture.clone=function(e){return void 0===e&&(e=new THREE.CubeTexture),THREE.Texture.prototype.clone.call(this,e),e.images=this.images,e},THREE.CompressedTexture=function(e,t,r,i,n,o,a,s,h,c,l){THREE.Texture.call(this,null,o,a,s,h,c,i,n,l),this.image={width:t,height:r},this.mipmaps=e,this.generateMipmaps=this.flipY=!1},THREE.CompressedTexture.prototype=Object.create(THREE.Texture.prototype),THREE.CompressedTexture.prototype.constructor=THREE.CompressedTexture,THREE.CompressedTexture.prototype.clone=function(){var e=new THREE.CompressedTexture;return THREE.Texture.prototype.clone.call(this,e),e},THREE.DataTexture=function(e,t,r,i,n,o,a,s,h,c,l){THREE.Texture.call(this,null,o,a,s,h,c,i,n,l),this.image={data:e,width:t,height:r}},THREE.DataTexture.prototype=Object.create(THREE.Texture.prototype),THREE.DataTexture.prototype.constructor=THREE.DataTexture,THREE.DataTexture.prototype.clone=function(){var e=new THREE.DataTexture;return THREE.Texture.prototype.clone.call(this,e),e},THREE.VideoTexture=function(e,t,r,i,n,o,a,s,h){THREE.Texture.call(this,e,t,r,i,n,o,a,s,h),this.generateMipmaps=!1;var c=this,l=function(){requestAnimationFrame(l),e.readyState===e.HAVE_ENOUGH_DATA&&(c.needsUpdate=!0)};l()},THREE.VideoTexture.prototype=Object.create(THREE.Texture.prototype),THREE.VideoTexture.prototype.constructor=THREE.VideoTexture,THREE.Group=function(){THREE.Object3D.call(this),this.type="Group"},THREE.Group.prototype=Object.create(THREE.Object3D.prototype),THREE.Group.prototype.constructor=THREE.Group,THREE.PointCloud=function(e,t){THREE.Object3D.call(this),this.type="PointCloud",this.geometry=void 0!==e?e:new THREE.Geometry,this.material=void 0!==t?t:new THREE.PointCloudMaterial({color:16777215*Math.random()})},THREE.PointCloud.prototype=Object.create(THREE.Object3D.prototype),THREE.PointCloud.prototype.constructor=THREE.PointCloud,THREE.PointCloud.prototype.raycast=function(){var e=new THREE.Matrix4,t=new THREE.Ray;return function(r,i){var n=this,o=n.geometry,a=r.params.PointCloud.threshold;if(e.getInverse(this.matrixWorld),t.copy(r.ray).applyMatrix4(e),null===o.boundingBox||!1!==t.isIntersectionBox(o.boundingBox)){var s=a/((this.scale.x+this.scale.y+this.scale.z)/3),h=new THREE.Vector3,a=function(e,o){var a=t.distanceToPoint(e);if(s>a){var h=t.closestPointToPoint(e);h.applyMatrix4(n.matrixWorld);var c=r.ray.origin.distanceTo(h);i.push({distance:c,distanceToRay:a,point:h.clone(),index:o,face:null,object:n})}};if(o instanceof THREE.BufferGeometry){var c=o.attributes,l=c.position.array;if(void 0!==c.index){var c=c.index.array,u=o.offsets;0===u.length&&(u=[{start:0,count:c.length,index:0}]);for(var E=0,p=u.length;p>E;++E)for(var d=u[E].start,f=u[E].index,o=d,d=d+u[E].count;d>o;o++){var m=f+c[o];h.fromArray(l,3*m),a(h,m)}}else for(c=l.length/3,o=0;c>o;o++)h.set(l[3*o],l[3*o+1],l[3*o+2]),a(h,o)}else for(h=this.geometry.vertices,o=0;o<h.length;o++)a(h[o],o)}}}(),THREE.PointCloud.prototype.clone=function(e){return void 0===e&&(e=new THREE.PointCloud(this.geometry,this.material)),THREE.Object3D.prototype.clone.call(this,e),e},THREE.ParticleSystem=function(e,t){return THREE.warn("THREE.ParticleSystem has been renamed to THREE.PointCloud."),new THREE.PointCloud(e,t)},THREE.Line=function(e,t,r){THREE.Object3D.call(this),this.type="Line",this.geometry=void 0!==e?e:new THREE.Geometry,this.material=void 0!==t?t:new THREE.LineBasicMaterial({color:16777215*Math.random()}),this.mode=void 0!==r?r:THREE.LineStrip},THREE.LineStrip=0,THREE.LinePieces=1,THREE.Line.prototype=Object.create(THREE.Object3D.prototype),THREE.Line.prototype.constructor=THREE.Line,THREE.Line.prototype.raycast=function(){var e=new THREE.Matrix4,t=new THREE.Ray,r=new THREE.Sphere;return function(i,n){var o=i.linePrecision,o=o*o,a=this.geometry;if(null===a.boundingSphere&&a.computeBoundingSphere(),r.copy(a.boundingSphere),r.applyMatrix4(this.matrixWorld),!1!==i.ray.isIntersectionSphere(r)){e.getInverse(this.matrixWorld),t.copy(i.ray).applyMatrix4(e);var s=new THREE.Vector3,h=new THREE.Vector3,c=new THREE.Vector3,l=new THREE.Vector3,u=this.mode===THREE.LineStrip?1:2;if(a instanceof THREE.BufferGeometry){var E=a.attributes;if(void 0!==E.index){var p=E.index.array,E=E.position.array,d=a.offsets;0===d.length&&(d=[{start:0,count:p.length,index:0}]);for(var f=0;f<d.length;f++)for(var m=d[f].start,T=d[f].count,g=d[f].index,a=m;m+T-1>a;a+=u){var R=g+p[a+1];s.fromArray(E,3*(g+p[a])),h.fromArray(E,3*R),R=t.distanceSqToSegment(s,h,l,c),R>o||(R=t.origin.distanceTo(l),R<i.near||R>i.far||n.push({distance:R,point:c.clone().applyMatrix4(this.matrixWorld),index:a,offsetIndex:f,face:null,faceIndex:null,object:this}))}}else for(E=E.position.array,a=0;a<E.length/3-1;a+=u)s.fromArray(E,3*a),h.fromArray(E,3*a+3),R=t.distanceSqToSegment(s,h,l,c),R>o||(R=t.origin.distanceTo(l),R<i.near||R>i.far||n.push({distance:R,point:c.clone().applyMatrix4(this.matrixWorld),index:a,face:null,faceIndex:null,object:this}))}else if(a instanceof THREE.Geometry)for(s=a.vertices,h=s.length,a=0;h-1>a;a+=u)R=t.distanceSqToSegment(s[a],s[a+1],l,c),R>o||(R=t.origin.distanceTo(l),R<i.near||R>i.far||n.push({distance:R,point:c.clone().applyMatrix4(this.matrixWorld),index:a,face:null,faceIndex:null,object:this}))}}}(),THREE.Line.prototype.clone=function(e){return void 0===e&&(e=new THREE.Line(this.geometry,this.material,this.mode)),THREE.Object3D.prototype.clone.call(this,e),
	e},THREE.Mesh=function(e,t){THREE.Object3D.call(this),this.type="Mesh",this.geometry=void 0!==e?e:new THREE.Geometry,this.material=void 0!==t?t:new THREE.MeshBasicMaterial({color:16777215*Math.random()}),this.updateMorphTargets()},THREE.Mesh.prototype=Object.create(THREE.Object3D.prototype),THREE.Mesh.prototype.constructor=THREE.Mesh,THREE.Mesh.prototype.updateMorphTargets=function(){if(void 0!==this.geometry.morphTargets&&0<this.geometry.morphTargets.length){this.morphTargetBase=-1,this.morphTargetForcedOrder=[],this.morphTargetInfluences=[],this.morphTargetDictionary={};for(var e=0,t=this.geometry.morphTargets.length;t>e;e++)this.morphTargetInfluences.push(0),this.morphTargetDictionary[this.geometry.morphTargets[e].name]=e}},THREE.Mesh.prototype.getMorphTargetIndexByName=function(e){return void 0!==this.morphTargetDictionary[e]?this.morphTargetDictionary[e]:(THREE.warn("THREE.Mesh.getMorphTargetIndexByName: morph target "+e+" does not exist. Returning 0."),0)},THREE.Mesh.prototype.raycast=function(){var e=new THREE.Matrix4,t=new THREE.Ray,r=new THREE.Sphere,i=new THREE.Vector3,n=new THREE.Vector3,o=new THREE.Vector3;return function(a,s){var h=this.geometry;if(null===h.boundingSphere&&h.computeBoundingSphere(),r.copy(h.boundingSphere),r.applyMatrix4(this.matrixWorld),!1!==a.ray.isIntersectionSphere(r)&&(e.getInverse(this.matrixWorld),t.copy(a.ray).applyMatrix4(e),null===h.boundingBox||!1!==t.isIntersectionBox(h.boundingBox)))if(h instanceof THREE.BufferGeometry){var c=this.material;if(void 0!==c){var l,u,E=h.attributes,p=a.precision;if(void 0!==E.index){var d=E.index.array,f=E.position.array,m=h.offsets;0===m.length&&(m=[{start:0,count:d.length,index:0}]);for(var T=0,g=m.length;g>T;++T)for(var E=m[T].start,R=m[T].index,h=E,y=E+m[T].count;y>h;h+=3){E=R+d[h],l=R+d[h+1],u=R+d[h+2],i.fromArray(f,3*E),n.fromArray(f,3*l),o.fromArray(f,3*u);var v=c.side===THREE.BackSide?t.intersectTriangle(o,n,i,!0):t.intersectTriangle(i,n,o,c.side!==THREE.DoubleSide);if(null!==v){v.applyMatrix4(this.matrixWorld);var H=a.ray.origin.distanceTo(v);p>H||H<a.near||H>a.far||s.push({distance:H,point:v,face:new THREE.Face3(E,l,u,THREE.Triangle.normal(i,n,o)),faceIndex:null,object:this})}}}else for(f=E.position.array,d=h=0,y=f.length;y>h;h+=3,d+=9)E=h,l=h+1,u=h+2,i.fromArray(f,d),n.fromArray(f,d+3),o.fromArray(f,d+6),v=c.side===THREE.BackSide?t.intersectTriangle(o,n,i,!0):t.intersectTriangle(i,n,o,c.side!==THREE.DoubleSide),null!==v&&(v.applyMatrix4(this.matrixWorld),H=a.ray.origin.distanceTo(v),p>H||H<a.near||H>a.far||s.push({distance:H,point:v,face:new THREE.Face3(E,l,u,THREE.Triangle.normal(i,n,o)),faceIndex:null,object:this}))}}else if(h instanceof THREE.Geometry)for(d=this.material instanceof THREE.MeshFaceMaterial,f=!0===d?this.material.materials:null,p=a.precision,m=h.vertices,T=0,g=h.faces.length;g>T;T++)if(R=h.faces[T],c=!0===d?f[R.materialIndex]:this.material,void 0!==c){if(E=m[R.a],l=m[R.b],u=m[R.c],!0===c.morphTargets){v=h.morphTargets,H=this.morphTargetInfluences,i.set(0,0,0),n.set(0,0,0),o.set(0,0,0);for(var y=0,x=v.length;x>y;y++){var b=H[y];if(0!==b){var w=v[y].vertices;i.x+=(w[R.a].x-E.x)*b,i.y+=(w[R.a].y-E.y)*b,i.z+=(w[R.a].z-E.z)*b,n.x+=(w[R.b].x-l.x)*b,n.y+=(w[R.b].y-l.y)*b,n.z+=(w[R.b].z-l.z)*b,o.x+=(w[R.c].x-u.x)*b,o.y+=(w[R.c].y-u.y)*b,o.z+=(w[R.c].z-u.z)*b}}i.add(E),n.add(l),o.add(u),E=i,l=n,u=o}v=c.side===THREE.BackSide?t.intersectTriangle(u,l,E,!0):t.intersectTriangle(E,l,u,c.side!==THREE.DoubleSide),null!==v&&(v.applyMatrix4(this.matrixWorld),H=a.ray.origin.distanceTo(v),p>H||H<a.near||H>a.far||s.push({distance:H,point:v,face:R,faceIndex:T,object:this}))}}}(),THREE.Mesh.prototype.clone=function(e,t){return void 0===e&&(e=new THREE.Mesh(this.geometry,this.material)),THREE.Object3D.prototype.clone.call(this,e,t),e},THREE.Bone=function(e){THREE.Object3D.call(this),this.type="Bone",this.skin=e},THREE.Bone.prototype=Object.create(THREE.Object3D.prototype),THREE.Bone.prototype.constructor=THREE.Bone,THREE.Skeleton=function(e,t,r){if(this.useVertexTexture=void 0!==r?r:!0,this.identityMatrix=new THREE.Matrix4,e=e||[],this.bones=e.slice(0),this.useVertexTexture?(this.boneTextureHeight=this.boneTextureWidth=e=256<this.bones.length?64:64<this.bones.length?32:16<this.bones.length?16:8,this.boneMatrices=new Float32Array(this.boneTextureWidth*this.boneTextureHeight*4),this.boneTexture=new THREE.DataTexture(this.boneMatrices,this.boneTextureWidth,this.boneTextureHeight,THREE.RGBAFormat,THREE.FloatType),this.boneTexture.minFilter=THREE.NearestFilter,this.boneTexture.magFilter=THREE.NearestFilter,this.boneTexture.generateMipmaps=!1,this.boneTexture.flipY=!1):this.boneMatrices=new Float32Array(16*this.bones.length),void 0===t)this.calculateInverses();else if(this.bones.length===t.length)this.boneInverses=t.slice(0);else for(THREE.warn("THREE.Skeleton bonInverses is the wrong length."),this.boneInverses=[],t=0,e=this.bones.length;e>t;t++)this.boneInverses.push(new THREE.Matrix4)},THREE.Skeleton.prototype.calculateInverses=function(){this.boneInverses=[];for(var e=0,t=this.bones.length;t>e;e++){var r=new THREE.Matrix4;this.bones[e]&&r.getInverse(this.bones[e].matrixWorld),this.boneInverses.push(r)}},THREE.Skeleton.prototype.pose=function(){for(var e,t=0,r=this.bones.length;r>t;t++)(e=this.bones[t])&&e.matrixWorld.getInverse(this.boneInverses[t]);for(t=0,r=this.bones.length;r>t;t++)(e=this.bones[t])&&(e.parent?(e.matrix.getInverse(e.parent.matrixWorld),e.matrix.multiply(e.matrixWorld)):e.matrix.copy(e.matrixWorld),e.matrix.decompose(e.position,e.quaternion,e.scale))},THREE.Skeleton.prototype.update=function(){var e=new THREE.Matrix4;return function(){for(var t=0,r=this.bones.length;r>t;t++)e.multiplyMatrices(this.bones[t]?this.bones[t].matrixWorld:this.identityMatrix,this.boneInverses[t]),e.flattenToArrayOffset(this.boneMatrices,16*t);this.useVertexTexture&&(this.boneTexture.needsUpdate=!0)}}(),THREE.SkinnedMesh=function(e,t,r){if(THREE.Mesh.call(this,e,t),this.type="SkinnedMesh",this.bindMode="attached",this.bindMatrix=new THREE.Matrix4,this.bindMatrixInverse=new THREE.Matrix4,e=[],this.geometry&&void 0!==this.geometry.bones){for(var i,n,o,a,s=0,h=this.geometry.bones.length;h>s;++s)i=this.geometry.bones[s],n=i.pos,o=i.rotq,a=i.scl,t=new THREE.Bone(this),e.push(t),t.name=i.name,t.position.set(n[0],n[1],n[2]),t.quaternion.set(o[0],o[1],o[2],o[3]),void 0!==a?t.scale.set(a[0],a[1],a[2]):t.scale.set(1,1,1);for(s=0,h=this.geometry.bones.length;h>s;++s)i=this.geometry.bones[s],-1!==i.parent?e[i.parent].add(e[s]):this.add(e[s])}this.normalizeSkinWeights(),this.updateMatrixWorld(!0),this.bind(new THREE.Skeleton(e,void 0,r))},THREE.SkinnedMesh.prototype=Object.create(THREE.Mesh.prototype),THREE.SkinnedMesh.prototype.constructor=THREE.SkinnedMesh,THREE.SkinnedMesh.prototype.bind=function(e,t){this.skeleton=e,void 0===t&&(this.updateMatrixWorld(!0),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.getInverse(t)},THREE.SkinnedMesh.prototype.pose=function(){this.skeleton.pose()},THREE.SkinnedMesh.prototype.normalizeSkinWeights=function(){if(this.geometry instanceof THREE.Geometry)for(var e=0;e<this.geometry.skinIndices.length;e++){var t=this.geometry.skinWeights[e],r=1/t.lengthManhattan();1/0!==r?t.multiplyScalar(r):t.set(1)}},THREE.SkinnedMesh.prototype.updateMatrixWorld=function(e){THREE.Mesh.prototype.updateMatrixWorld.call(this,!0),"attached"===this.bindMode?this.bindMatrixInverse.getInverse(this.matrixWorld):"detached"===this.bindMode?this.bindMatrixInverse.getInverse(this.bindMatrix):THREE.warn("THREE.SkinnedMesh unreckognized bindMode: "+this.bindMode)},THREE.SkinnedMesh.prototype.clone=function(e){return void 0===e&&(e=new THREE.SkinnedMesh(this.geometry,this.material,this.useVertexTexture)),THREE.Mesh.prototype.clone.call(this,e),e},THREE.MorphAnimMesh=function(e,t){THREE.Mesh.call(this,e,t),this.type="MorphAnimMesh",this.duration=1e3,this.mirroredLoop=!1,this.currentKeyframe=this.lastKeyframe=this.time=0,this.direction=1,this.directionBackwards=!1,this.setFrameRange(0,this.geometry.morphTargets.length-1)},THREE.MorphAnimMesh.prototype=Object.create(THREE.Mesh.prototype),THREE.MorphAnimMesh.prototype.constructor=THREE.MorphAnimMesh,THREE.MorphAnimMesh.prototype.setFrameRange=function(e,t){this.startKeyframe=e,this.endKeyframe=t,this.length=this.endKeyframe-this.startKeyframe+1},THREE.MorphAnimMesh.prototype.setDirectionForward=function(){this.direction=1,this.directionBackwards=!1},THREE.MorphAnimMesh.prototype.setDirectionBackward=function(){this.direction=-1,this.directionBackwards=!0},THREE.MorphAnimMesh.prototype.parseAnimations=function(){var e=this.geometry;e.animations||(e.animations={});for(var t,r=e.animations,i=/([a-z]+)_?(\d+)/,n=0,o=e.morphTargets.length;o>n;n++){var a=e.morphTargets[n].name.match(i);if(a&&1<a.length){a=a[1],r[a]||(r[a]={start:1/0,end:-(1/0)});var s=r[a];n<s.start&&(s.start=n),n>s.end&&(s.end=n),t||(t=a)}}e.firstAnimation=t},THREE.MorphAnimMesh.prototype.setAnimationLabel=function(e,t,r){this.geometry.animations||(this.geometry.animations={}),this.geometry.animations[e]={start:t,end:r}},THREE.MorphAnimMesh.prototype.playAnimation=function(e,t){var r=this.geometry.animations[e];r?(this.setFrameRange(r.start,r.end),this.duration=(r.end-r.start)/t*1e3,this.time=0):THREE.warn("THREE.MorphAnimMesh: animation["+e+"] undefined in .playAnimation()")},THREE.MorphAnimMesh.prototype.updateAnimation=function(e){var t=this.duration/this.length;this.time+=this.direction*e,this.mirroredLoop?(this.time>this.duration||0>this.time)&&(this.direction*=-1,this.time>this.duration&&(this.time=this.duration,this.directionBackwards=!0),0>this.time&&(this.time=0,this.directionBackwards=!1)):(this.time%=this.duration,0>this.time&&(this.time+=this.duration)),e=this.startKeyframe+THREE.Math.clamp(Math.floor(this.time/t),0,this.length-1),e!==this.currentKeyframe&&(this.morphTargetInfluences[this.lastKeyframe]=0,this.morphTargetInfluences[this.currentKeyframe]=1,this.morphTargetInfluences[e]=0,this.lastKeyframe=this.currentKeyframe,this.currentKeyframe=e),t=this.time%t/t,this.directionBackwards&&(t=1-t),this.morphTargetInfluences[this.currentKeyframe]=t,this.morphTargetInfluences[this.lastKeyframe]=1-t},THREE.MorphAnimMesh.prototype.interpolateTargets=function(e,t,r){for(var i=this.morphTargetInfluences,n=0,o=i.length;o>n;n++)i[n]=0;e>-1&&(i[e]=1-r),t>-1&&(i[t]=r)},THREE.MorphAnimMesh.prototype.clone=function(e){return void 0===e&&(e=new THREE.MorphAnimMesh(this.geometry,this.material)),e.duration=this.duration,e.mirroredLoop=this.mirroredLoop,e.time=this.time,e.lastKeyframe=this.lastKeyframe,e.currentKeyframe=this.currentKeyframe,e.direction=this.direction,e.directionBackwards=this.directionBackwards,THREE.Mesh.prototype.clone.call(this,e),e},THREE.LOD=function(){THREE.Object3D.call(this),this.objects=[]},THREE.LOD.prototype=Object.create(THREE.Object3D.prototype),THREE.LOD.prototype.constructor=THREE.LOD,THREE.LOD.prototype.addLevel=function(e,t){void 0===t&&(t=0),t=Math.abs(t);for(var r=0;r<this.objects.length&&!(t<this.objects[r].distance);r++);this.objects.splice(r,0,{distance:t,object:e}),this.add(e)},THREE.LOD.prototype.getObjectForDistance=function(e){for(var t=1,r=this.objects.length;r>t&&!(e<this.objects[t].distance);t++);return this.objects[t-1].object},THREE.LOD.prototype.raycast=function(){var e=new THREE.Vector3;return function(t,r){e.setFromMatrixPosition(this.matrixWorld);var i=t.ray.origin.distanceTo(e);this.getObjectForDistance(i).raycast(t,r)}}(),THREE.LOD.prototype.update=function(){var e=new THREE.Vector3,t=new THREE.Vector3;return function(r){if(1<this.objects.length){e.setFromMatrixPosition(r.matrixWorld),t.setFromMatrixPosition(this.matrixWorld),r=e.distanceTo(t),this.objects[0].object.visible=!0;for(var i=1,n=this.objects.length;n>i&&r>=this.objects[i].distance;i++)this.objects[i-1].object.visible=!1,this.objects[i].object.visible=!0;for(;n>i;i++)this.objects[i].object.visible=!1}}}(),THREE.LOD.prototype.clone=function(e){void 0===e&&(e=new THREE.LOD),THREE.Object3D.prototype.clone.call(this,e);for(var t=0,r=this.objects.length;r>t;t++){var i=this.objects[t].object.clone();i.visible=0===t,e.addLevel(i,this.objects[t].distance)}return e},THREE.Sprite=function(){var e=new Uint16Array([0,1,2,0,2,3]),t=new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0]),r=new Float32Array([0,0,1,0,1,1,0,1]),i=new THREE.BufferGeometry;return i.addAttribute("index",new THREE.BufferAttribute(e,1)),i.addAttribute("position",new THREE.BufferAttribute(t,3)),i.addAttribute("uv",new THREE.BufferAttribute(r,2)),function(e){THREE.Object3D.call(this),this.type="Sprite",this.geometry=i,this.material=void 0!==e?e:new THREE.SpriteMaterial}}(),THREE.Sprite.prototype=Object.create(THREE.Object3D.prototype),THREE.Sprite.prototype.constructor=THREE.Sprite,THREE.Sprite.prototype.raycast=function(){var e=new THREE.Vector3;return function(t,r){e.setFromMatrixPosition(this.matrixWorld);var i=t.ray.distanceToPoint(e);i>this.scale.x||r.push({distance:i,point:this.position,face:null,object:this})}}(),THREE.Sprite.prototype.clone=function(e){return void 0===e&&(e=new THREE.Sprite(this.material)),THREE.Object3D.prototype.clone.call(this,e),e},THREE.Particle=THREE.Sprite,THREE.LensFlare=function(e,t,r,i,n){THREE.Object3D.call(this),this.lensFlares=[],this.positionScreen=new THREE.Vector3,this.customUpdateCallback=void 0,void 0!==e&&this.add(e,t,r,i,n)},THREE.LensFlare.prototype=Object.create(THREE.Object3D.prototype),THREE.LensFlare.prototype.constructor=THREE.LensFlare,THREE.LensFlare.prototype.add=function(e,t,r,i,n,o){void 0===t&&(t=-1),void 0===r&&(r=0),void 0===o&&(o=1),void 0===n&&(n=new THREE.Color(16777215)),void 0===i&&(i=THREE.NormalBlending),r=Math.min(r,Math.max(0,r)),this.lensFlares.push({texture:e,size:t,distance:r,x:0,y:0,z:0,scale:1,rotation:1,opacity:o,color:n,blending:i})},THREE.LensFlare.prototype.updateLensFlares=function(){var e,t,r=this.lensFlares.length,i=2*-this.positionScreen.x,n=2*-this.positionScreen.y;for(e=0;r>e;e++)t=this.lensFlares[e],t.x=this.positionScreen.x+i*t.distance,t.y=this.positionScreen.y+n*t.distance,t.wantedRotation=t.x*Math.PI*.25,t.rotation+=.25*(t.wantedRotation-t.rotation)},THREE.Scene=function(){THREE.Object3D.call(this),this.type="Scene",this.overrideMaterial=this.fog=null,this.autoUpdate=!0},THREE.Scene.prototype=Object.create(THREE.Object3D.prototype),THREE.Scene.prototype.constructor=THREE.Scene,THREE.Scene.prototype.clone=function(e){return void 0===e&&(e=new THREE.Scene),THREE.Object3D.prototype.clone.call(this,e),null!==this.fog&&(e.fog=this.fog.clone()),null!==this.overrideMaterial&&(e.overrideMaterial=this.overrideMaterial.clone()),e.autoUpdate=this.autoUpdate,e.matrixAutoUpdate=this.matrixAutoUpdate,e},THREE.Fog=function(e,t,r){this.name="",this.color=new THREE.Color(e),this.near=void 0!==t?t:1,this.far=void 0!==r?r:1e3},THREE.Fog.prototype.clone=function(){return new THREE.Fog(this.color.getHex(),this.near,this.far)},THREE.FogExp2=function(e,t){this.name="",this.color=new THREE.Color(e),this.density=void 0!==t?t:25e-5},THREE.FogExp2.prototype.clone=function(){return new THREE.FogExp2(this.color.getHex(),this.density)},THREE.ShaderChunk={},THREE.ShaderChunk.common="#define PI 3.14159\n#define PI2 6.28318\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\nfloat square( in float a ) { return a*a; }\nvec2  square( in vec2 a )  { return vec2( a.x*a.x, a.y*a.y ); }\nvec3  square( in vec3 a )  { return vec3( a.x*a.x, a.y*a.y, a.z*a.z ); }\nvec4  square( in vec4 a )  { return vec4( a.x*a.x, a.y*a.y, a.z*a.z, a.w*a.w ); }\nfloat saturate( in float a ) { return clamp( a, 0.0, 1.0 ); }\nvec2  saturate( in vec2 a )  { return clamp( a, 0.0, 1.0 ); }\nvec3  saturate( in vec3 a )  { return clamp( a, 0.0, 1.0 ); }\nvec4  saturate( in vec4 a )  { return clamp( a, 0.0, 1.0 ); }\nfloat average( in float a ) { return a; }\nfloat average( in vec2 a )  { return ( a.x + a.y) * 0.5; }\nfloat average( in vec3 a )  { return ( a.x + a.y + a.z) / 3.0; }\nfloat average( in vec4 a )  { return ( a.x + a.y + a.z + a.w) * 0.25; }\nfloat whiteCompliment( in float a ) { return saturate( 1.0 - a ); }\nvec2  whiteCompliment( in vec2 a )  { return saturate( vec2(1.0) - a ); }\nvec3  whiteCompliment( in vec3 a )  { return saturate( vec3(1.0) - a ); }\nvec4  whiteCompliment( in vec4 a )  { return saturate( vec4(1.0) - a ); }\nvec3 transformDirection( in vec3 normal, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );\n}\n// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\nvec3 inverseTransformDirection( in vec3 normal, in mat4 matrix ) {\n	return normalize( ( vec4( normal, 0.0 ) * matrix ).xyz );\n}\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal) {\n	float distance = dot( planeNormal, point-pointOnPlane );\n	return point - distance * planeNormal;\n}\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	return sign( dot( point - pointOnPlane, planeNormal ) );\n}\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	return pointOnLine + lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) );\n}\nfloat calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {\n	if ( decayExponent > 0.0 ) {\n	  return pow( saturate( 1.0 - lightDistance / cutoffDistance ), decayExponent );\n	}\n	return 1.0;\n}\n\nvec3 inputToLinear( in vec3 a ) {\n#ifdef GAMMA_INPUT\n	return pow( a, vec3( float( GAMMA_FACTOR ) ) );\n#else\n	return a;\n#endif\n}\nvec3 linearToOutput( in vec3 a ) {\n#ifdef GAMMA_OUTPUT\n	return pow( a, vec3( 1.0 / float( GAMMA_FACTOR ) ) );\n#else\n	return a;\n#endif\n}\n",THREE.ShaderChunk.alphatest_fragment="#ifdef ALPHATEST\n\n	if ( diffuseColor.a < ALPHATEST ) discard;\n\n#endif\n",THREE.ShaderChunk.lights_lambert_vertex="vLightFront = vec3( 0.0 );\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vec3( 0.0 );\n\n#endif\n\ntransformedNormal = normalize( transformedNormal );\n\n#if MAX_DIR_LIGHTS > 0\n\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n	vec3 dirVector = transformDirection( directionalLightDirection[ i ], viewMatrix );\n\n	float dotProduct = dot( transformedNormal, dirVector );\n	vec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n	#ifdef DOUBLE_SIDED\n\n		vec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n		#ifdef WRAP_AROUND\n\n			vec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n		#endif\n\n	#endif\n\n	#ifdef WRAP_AROUND\n\n		vec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n		directionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n\n		#ifdef DOUBLE_SIDED\n\n			directionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n\n		#endif\n\n	#endif\n\n	vLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n\n	#ifdef DOUBLE_SIDED\n\n		vLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n\n	#endif\n\n}\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );\n\n		lVector = normalize( lVector );\n		float dotProduct = dot( transformedNormal, lVector );\n\n		vec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n		#ifdef DOUBLE_SIDED\n\n			vec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n			#ifdef WRAP_AROUND\n\n				vec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n			#endif\n\n		#endif\n\n		#ifdef WRAP_AROUND\n\n			vec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n			pointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n\n			#ifdef DOUBLE_SIDED\n\n				pointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n\n			#endif\n\n		#endif\n\n		vLightFront += pointLightColor[ i ] * pointLightWeighting * attenuation;\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += pointLightColor[ i ] * pointLightWeightingBack * attenuation;\n\n		#endif\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - worldPosition.xyz ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n			float attenuation = calcLightAttenuation( length( lVector ), spotLightDistance[ i ], spotLightDecay[ i ] );\n\n			lVector = normalize( lVector );\n\n			float dotProduct = dot( transformedNormal, lVector );\n			vec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n			#ifdef DOUBLE_SIDED\n\n				vec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n				#ifdef WRAP_AROUND\n\n					vec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n				#endif\n\n			#endif\n\n			#ifdef WRAP_AROUND\n\n				vec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n				spotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n\n				#ifdef DOUBLE_SIDED\n\n					spotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n\n				#endif\n\n			#endif\n\n			vLightFront += spotLightColor[ i ] * spotLightWeighting * attenuation * spotEffect;\n\n			#ifdef DOUBLE_SIDED\n\n				vLightBack += spotLightColor[ i ] * spotLightWeightingBack * attenuation * spotEffect;\n\n			#endif\n\n		}\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec3 lVector = transformDirection( hemisphereLightDirection[ i ], viewMatrix );\n\n		float dotProduct = dot( transformedNormal, lVector );\n\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n		float hemiDiffuseWeightBack = -0.5 * dotProduct + 0.5;\n\n		vLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n\n		#endif\n\n	}\n\n#endif\n\nvLightFront += ambientLightColor;\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack += ambientLightColor;\n\n#endif\n",THREE.ShaderChunk.map_particle_pars_fragment="#ifdef USE_MAP\n\n	uniform vec4 offsetRepeat;\n	uniform sampler2D map;\n\n#endif\n",THREE.ShaderChunk.default_vertex="#ifdef USE_SKINNING\n\n	vec4 mvPosition = modelViewMatrix * skinned;\n\n#elif defined( USE_MORPHTARGETS )\n\n	vec4 mvPosition = modelViewMatrix * vec4( morphed, 1.0 );\n\n#else\n\n	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\n#endif\n\ngl_Position = projectionMatrix * mvPosition;\n",THREE.ShaderChunk.map_pars_fragment="#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n\n#endif\n\n#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif",THREE.ShaderChunk.skinnormal_vertex="#ifdef USE_SKINNING\n\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\n	#ifdef USE_MORPHNORMALS\n\n	vec4 skinnedNormal = skinMatrix * vec4( morphedNormal, 0.0 );\n\n	#else\n\n	vec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n\n	#endif\n\n#endif\n",THREE.ShaderChunk.logdepthbuf_pars_vertex="#ifdef USE_LOGDEPTHBUF\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		varying float vFragDepth;\n\n	#endif\n\n	uniform float logDepthBufFC;\n\n#endif",THREE.ShaderChunk.lightmap_pars_vertex="#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n\n#endif",THREE.ShaderChunk.lights_phong_fragment="#ifndef FLAT_SHADED\n\n	vec3 normal = normalize( vNormal );\n\n	#ifdef DOUBLE_SIDED\n\n		normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n\n	#endif\n\n#else\n\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n\n#endif\n\nvec3 viewPosition = normalize( vViewPosition );\n\n#ifdef USE_NORMALMAP\n\n	normal = perturbNormal2Arb( -vViewPosition, normal );\n\n#elif defined( USE_BUMPMAP )\n\n	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n\n#endif\n\nvec3 totalDiffuseLight = vec3( 0.0 );\nvec3 totalSpecularLight = vec3( 0.0 );\n\n#if MAX_POINT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );\n\n		lVector = normalize( lVector );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lVector );\n\n		#ifdef WRAP_AROUND\n\n			float pointDiffuseWeightFull = max( dotProduct, 0.0 );\n			float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float pointDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		totalDiffuseLight += pointLightColor[ i ] * pointDiffuseWeight * attenuation;\n\n				// specular\n\n		vec3 pointHalfVector = normalize( lVector + viewPosition );\n		float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\n		float pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, pointHalfVector ), 0.0 ), 5.0 );\n		totalSpecularLight += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * attenuation * specularNormalization;\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float attenuation = calcLightAttenuation( length( lVector ), spotLightDistance[ i ], spotLightDecay[ i ] );\n\n		lVector = normalize( lVector );\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n			// diffuse\n\n			float dotProduct = dot( normal, lVector );\n\n			#ifdef WRAP_AROUND\n\n				float spotDiffuseWeightFull = max( dotProduct, 0.0 );\n				float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n				vec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n\n			#else\n\n				float spotDiffuseWeight = max( dotProduct, 0.0 );\n\n			#endif\n\n			totalDiffuseLight += spotLightColor[ i ] * spotDiffuseWeight * attenuation * spotEffect;\n\n			// specular\n\n			vec3 spotHalfVector = normalize( lVector + viewPosition );\n			float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\n			float spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n\n			float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, spotHalfVector ), 0.0 ), 5.0 );\n			totalSpecularLight += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * attenuation * specularNormalization * spotEffect;\n\n		}\n\n	}\n\n#endif\n\n#if MAX_DIR_LIGHTS > 0\n\n	for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n		vec3 dirVector = transformDirection( directionalLightDirection[ i ], viewMatrix );\n\n		// diffuse\n\n		float dotProduct = dot( normal, dirVector );\n\n		#ifdef WRAP_AROUND\n\n			float dirDiffuseWeightFull = max( dotProduct, 0.0 );\n			float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float dirDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		totalDiffuseLight += directionalLightColor[ i ] * dirDiffuseWeight;\n\n		// specular\n\n		vec3 dirHalfVector = normalize( dirVector + viewPosition );\n		float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\n		float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n\n		/*\n		// fresnel term from skin shader\n		const float F0 = 0.128;\n\n		float base = 1.0 - dot( viewPosition, dirHalfVector );\n		float exponential = pow( base, 5.0 );\n\n		float fresnel = exponential + F0 * ( 1.0 - exponential );\n		*/\n\n		/*\n		// fresnel term from fresnel shader\n		const float mFresnelBias = 0.08;\n		const float mFresnelScale = 0.3;\n		const float mFresnelPower = 5.0;\n\n		float fresnel = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( -viewPosition ), normal ), mFresnelPower );\n		*/\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		// 		dirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization * fresnel;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );\n		totalSpecularLight += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec3 lVector = transformDirection( hemisphereLightDirection[ i ], viewMatrix );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lVector );\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\n		vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		totalDiffuseLight += hemiColor;\n\n		// specular (sky light)\n\n		vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\n		float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\n		float hemiSpecularWeightSky = specularStrength * max( pow( max( hemiDotNormalHalfSky, 0.0 ), shininess ), 0.0 );\n\n		// specular (ground light)\n\n		vec3 lVectorGround = -lVector;\n\n		vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\n		float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\n		float hemiSpecularWeightGround = specularStrength * max( pow( max( hemiDotNormalHalfGround, 0.0 ), shininess ), 0.0 );\n\n		float dotProductGround = dot( normal, lVectorGround );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );\n		vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );\n		totalSpecularLight += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n\n	}\n\n#endif\n\n#ifdef METAL\n\n	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + ambientLightColor ) * specular + totalSpecularLight + emissive;\n\n#else\n\n	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + ambientLightColor ) + totalSpecularLight + emissive;\n\n#endif\n",THREE.ShaderChunk.fog_pars_fragment="#ifdef USE_FOG\n\n	uniform vec3 fogColor;\n\n	#ifdef FOG_EXP2\n\n		uniform float fogDensity;\n\n	#else\n\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n\n#endif",
	THREE.ShaderChunk.morphnormal_vertex="#ifdef USE_MORPHNORMALS\n\n	vec3 morphedNormal = vec3( 0.0 );\n\n	morphedNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n	morphedNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n	morphedNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n	morphedNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n\n	morphedNormal += normal;\n\n#endif",THREE.ShaderChunk.envmap_pars_fragment="#ifdef USE_ENVMAP\n\n	uniform float reflectivity;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n	uniform float flipEnvMap;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		uniform float refractionRatio;\n\n	#else\n\n		varying vec3 vReflect;\n\n	#endif\n\n#endif\n",THREE.ShaderChunk.logdepthbuf_fragment="#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n\n	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n\n#endif",THREE.ShaderChunk.normalmap_pars_fragment="#ifdef USE_NORMALMAP\n\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n\n	// Per-Pixel Tangent Space Normal Mapping\n	// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html\n\n	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( vUv.st );\n		vec2 st1 = dFdy( vUv.st );\n\n		vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n		vec3 N = normalize( surf_norm );\n\n		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n		mapN.xy = normalScale * mapN.xy;\n		mat3 tsn = mat3( S, T, N );\n		return normalize( tsn * mapN );\n\n	}\n\n#endif\n",THREE.ShaderChunk.lights_phong_pars_vertex="#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n",THREE.ShaderChunk.lightmap_pars_fragment="#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n	uniform sampler2D lightMap;\n\n#endif",THREE.ShaderChunk.shadowmap_vertex="#ifdef USE_SHADOWMAP\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n\n	}\n\n#endif",THREE.ShaderChunk.lights_phong_vertex="#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	vWorldPosition = worldPosition.xyz;\n\n#endif",THREE.ShaderChunk.map_fragment="#ifdef USE_MAP\n\n	vec4 texelColor = texture2D( map, vUv );\n\n	texelColor.xyz = inputToLinear( texelColor.xyz );\n\n	diffuseColor *= texelColor;\n\n#endif",THREE.ShaderChunk.lightmap_vertex="#ifdef USE_LIGHTMAP\n\n	vUv2 = uv2;\n\n#endif",THREE.ShaderChunk.map_particle_fragment="#ifdef USE_MAP\n\n	diffuseColor *= texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) * offsetRepeat.zw + offsetRepeat.xy );\n\n#endif\n",THREE.ShaderChunk.color_pars_fragment="#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif\n",THREE.ShaderChunk.color_vertex="#ifdef USE_COLOR\n\n	vColor.xyz = inputToLinear( color.xyz );\n\n#endif",THREE.ShaderChunk.skinning_vertex="#ifdef USE_SKINNING\n\n	#ifdef USE_MORPHTARGETS\n\n	vec4 skinVertex = bindMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n	vec4 skinVertex = bindMatrix * vec4( position, 1.0 );\n\n	#endif\n\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	skinned  = bindMatrixInverse * skinned;\n\n#endif\n",THREE.ShaderChunk.envmap_pars_vertex="#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	varying vec3 vReflect;\n\n	uniform float refractionRatio;\n\n#endif\n",THREE.ShaderChunk.linear_to_gamma_fragment="\n	outgoingLight = linearToOutput( outgoingLight );\n",THREE.ShaderChunk.color_pars_vertex="#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif",THREE.ShaderChunk.lights_lambert_pars_vertex="uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDecay[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n",THREE.ShaderChunk.map_pars_vertex="#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n	uniform vec4 offsetRepeat;\n\n#endif\n",THREE.ShaderChunk.envmap_fragment="#ifdef USE_ENVMAP\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\n		// Transforming Normal Vectors with the Inverse Transformation\n		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\n		#ifdef ENVMAP_MODE_REFLECTION\n\n			vec3 reflectVec = reflect( cameraToVertex, worldNormal );\n\n		#else\n\n			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\n		#endif\n\n	#else\n\n		vec3 reflectVec = vReflect;\n\n	#endif\n\n	#ifdef DOUBLE_SIDED\n		float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n	#else\n		float flipNormal = 1.0;\n	#endif\n\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#elif defined( ENVMAP_TYPE_EQUIREC )\n		vec2 sampleUV;\n		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n		vec4 envColor = texture2D( envMap, sampleUV );\n\n	#elif defined( ENVMAP_TYPE_SPHERE )\n		vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));\n		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );\n	#endif\n\n	envColor.xyz = inputToLinear( envColor.xyz );\n\n	#ifdef ENVMAP_BLENDING_MULTIPLY\n\n		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\n	#elif defined( ENVMAP_BLENDING_MIX )\n\n		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\n	#elif defined( ENVMAP_BLENDING_ADD )\n\n		outgoingLight += envColor.xyz * specularStrength * reflectivity;\n\n	#endif\n\n#endif\n",THREE.ShaderChunk.specularmap_pars_fragment="#ifdef USE_SPECULARMAP\n\n	uniform sampler2D specularMap;\n\n#endif",THREE.ShaderChunk.logdepthbuf_vertex="#ifdef USE_LOGDEPTHBUF\n\n	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		vFragDepth = 1.0 + gl_Position.w;\n\n#else\n\n		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n\n	#endif\n\n#endif",THREE.ShaderChunk.morphtarget_pars_vertex="#ifdef USE_MORPHTARGETS\n\n	#ifndef USE_MORPHNORMALS\n\n	uniform float morphTargetInfluences[ 8 ];\n\n	#else\n\n	uniform float morphTargetInfluences[ 4 ];\n\n	#endif\n\n#endif",THREE.ShaderChunk.specularmap_fragment="float specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n	vec4 texelSpecular = texture2D( specularMap, vUv );\n	specularStrength = texelSpecular.r;\n\n#else\n\n	specularStrength = 1.0;\n\n#endif",THREE.ShaderChunk.fog_fragment="#ifdef USE_FOG\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n\n	#else\n\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n\n	#endif\n\n	#ifdef FOG_EXP2\n\n		float fogFactor = exp2( - square( fogDensity ) * square( depth ) * LOG2 );\n		fogFactor = whiteCompliment( fogFactor );\n\n	#else\n\n		float fogFactor = smoothstep( fogNear, fogFar, depth );\n\n	#endif\n	\n	outgoingLight = mix( outgoingLight, fogColor, fogFactor );\n\n#endif",THREE.ShaderChunk.bumpmap_pars_fragment="#ifdef USE_BUMPMAP\n\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n\n	// Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\n	// http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\n\n	// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n	vec2 dHdxy_fwd() {\n\n		vec2 dSTdx = dFdx( vUv );\n		vec2 dSTdy = dFdy( vUv );\n\n		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\n		return vec2( dBx, dBy );\n\n	}\n\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\n		vec3 vSigmaX = dFdx( surf_pos );\n		vec3 vSigmaY = dFdy( surf_pos );\n		vec3 vN = surf_norm;		// normalized\n\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n\n		float fDet = dot( vSigmaX, R1 );\n\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n\n	}\n\n#endif\n",THREE.ShaderChunk.defaultnormal_vertex="#ifdef USE_SKINNING\n\n	vec3 objectNormal = skinnedNormal.xyz;\n\n#elif defined( USE_MORPHNORMALS )\n\n	vec3 objectNormal = morphedNormal;\n\n#else\n\n	vec3 objectNormal = normal;\n\n#endif\n\n#ifdef FLIP_SIDED\n\n	objectNormal = -objectNormal;\n\n#endif\n\nvec3 transformedNormal = normalMatrix * objectNormal;\n",THREE.ShaderChunk.lights_phong_pars_fragment="uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDecay[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n\n	varying vec3 vNormal;\n\n#endif\n",THREE.ShaderChunk.skinbase_vertex="#ifdef USE_SKINNING\n\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n\n#endif",THREE.ShaderChunk.map_vertex="#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n\n#endif",THREE.ShaderChunk.lightmap_fragment="#ifdef USE_LIGHTMAP\n\n	outgoingLight *= diffuseColor.xyz * texture2D( lightMap, vUv2 ).xyz;\n\n#endif",THREE.ShaderChunk.shadowmap_pars_vertex="#ifdef USE_SHADOWMAP\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n	uniform mat4 shadowMatrix[ MAX_SHADOWS ];\n\n#endif",THREE.ShaderChunk.color_fragment="#ifdef USE_COLOR\n\n	diffuseColor.rgb *= vColor;\n\n#endif",THREE.ShaderChunk.morphtarget_vertex="#ifdef USE_MORPHTARGETS\n\n	vec3 morphed = vec3( 0.0 );\n	morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n	morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n	morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n	morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\n	#ifndef USE_MORPHNORMALS\n\n	morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n	morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n	morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n	morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\n	#endif\n\n	morphed += position;\n\n#endif",THREE.ShaderChunk.envmap_vertex="#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	vec3 worldNormal = transformDirection( objectNormal, modelMatrix );\n\n	vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\n	#ifdef ENVMAP_MODE_REFLECTION\n\n		vReflect = reflect( cameraToVertex, worldNormal );\n\n	#else\n\n		vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\n	#endif\n\n#endif\n",THREE.ShaderChunk.shadowmap_fragment="#ifdef USE_SHADOWMAP\n\n	#ifdef SHADOWMAP_DEBUG\n\n		vec3 frustumColors[3];\n		frustumColors[0] = vec3( 1.0, 0.5, 0.0 );\n		frustumColors[1] = vec3( 0.0, 1.0, 0.8 );\n		frustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n\n	#endif\n\n	#ifdef SHADOWMAP_CASCADE\n\n		int inFrustumCount = 0;\n\n	#endif\n\n	float fDepth;\n	vec3 shadowColor = vec3( 1.0 );\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\n\n				// if ( something && something ) breaks ATI OpenGL shader compiler\n				// if ( all( something, something ) ) using this instead\n\n		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n		bool inFrustum = all( inFrustumVec );\n\n				// don't shadow pixels outside of light frustum\n				// use just first frustum (for cascades)\n				// don't shadow pixels behind far plane of light frustum\n\n		#ifdef SHADOWMAP_CASCADE\n\n			inFrustumCount += int( inFrustum );\n			bvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n\n		#else\n\n			bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n		#endif\n\n		bool frustumTest = all( frustumTestVec );\n\n		if ( frustumTest ) {\n\n			shadowCoord.z += shadowBias[ i ];\n\n			#if defined( SHADOWMAP_TYPE_PCF )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n		/*\n						// nested loops breaks shader compiler / validator on some ATI cards when using OpenGL\n						// must enroll loop manually\n\n				for ( float y = -1.25; y <= 1.25; y += 1.25 )\n					for ( float x = -1.25; x <= 1.25; x += 1.25 ) {\n\n						vec4 rgbaDepth = texture2D( shadowMap[ i ], vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy );\n\n								// doesn't seem to produce any noticeable visual difference compared to simple texture2D lookup\n								//vec4 rgbaDepth = texture2DProj( shadowMap[ i ], vec4( vShadowCoord[ i ].w * ( vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy ), 0.05, vShadowCoord[ i ].w ) );\n\n						float fDepth = unpackDepth( rgbaDepth );\n\n						if ( fDepth < shadowCoord.z )\n							shadow += 1.0;\n\n				}\n\n				shadow /= 9.0;\n\n		*/\n\n				const float shadowDelta = 1.0 / 9.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.25 * xPixelOffset;\n				float dy0 = -1.25 * yPixelOffset;\n				float dx1 = 1.25 * xPixelOffset;\n				float dy1 = 1.25 * yPixelOffset;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.0 * xPixelOffset;\n				float dy0 = -1.0 * yPixelOffset;\n				float dx1 = 1.0 * xPixelOffset;\n				float dy1 = 1.0 * yPixelOffset;\n\n				mat3 shadowKernel;\n				mat3 depthKernel;\n\n				depthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				depthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				depthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				depthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				depthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				depthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				depthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				depthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				depthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n\n				vec3 shadowZ = vec3( shadowCoord.z );\n				shadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));\n				shadowKernel[0] *= vec3(0.25);\n\n				shadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));\n				shadowKernel[1] *= vec3(0.25);\n\n				shadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));\n				shadowKernel[2] *= vec3(0.25);\n\n				vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );\n\n				shadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );\n				shadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );\n\n				vec4 shadowValues;\n				shadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );\n				shadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );\n				shadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );\n				shadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );\n\n				shadow = dot( shadowValues, vec4( 1.0 ) );\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#else\n\n				vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\n				float fDepth = unpackDepth( rgbaDepth );\n\n				if ( fDepth < shadowCoord.z )\n\n		// spot with multiple shadows is darker\n\n					shadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n\n		// spot with multiple shadows has the same color as single shadow spot\n\n		// 					shadowColor = min( shadowColor, vec3( shadowDarkness[ i ] ) );\n\n			#endif\n\n		}\n\n\n		#ifdef SHADOWMAP_DEBUG\n\n			#ifdef SHADOWMAP_CASCADE\n\n				if ( inFrustum && inFrustumCount == 1 ) outgoingLight *= frustumColors[ i ];\n\n			#else\n\n				if ( inFrustum ) outgoingLight *= frustumColors[ i ];\n\n			#endif\n\n		#endif\n\n	}\n\n	// NOTE: I am unsure if this is correct in linear space.  -bhouston, Dec 29, 2014\n	shadowColor = inputToLinear( shadowColor );\n\n	outgoingLight = outgoingLight * shadowColor;\n\n#endif\n",THREE.ShaderChunk.worldpos_vertex="#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n\n	#ifdef USE_SKINNING\n\n		vec4 worldPosition = modelMatrix * skinned;\n\n	#elif defined( USE_MORPHTARGETS )\n\n		vec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\n	#endif\n\n#endif\n",THREE.ShaderChunk.shadowmap_pars_fragment="#ifdef USE_SHADOWMAP\n\n	uniform sampler2D shadowMap[ MAX_SHADOWS ];\n	uniform vec2 shadowMapSize[ MAX_SHADOWS ];\n\n	uniform float shadowDarkness[ MAX_SHADOWS ];\n	uniform float shadowBias[ MAX_SHADOWS ];\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n\n	float unpackDepth( const in vec4 rgba_depth ) {\n\n		const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n		float depth = dot( rgba_depth, bit_shift );\n		return depth;\n\n	}\n\n#endif",THREE.ShaderChunk.skinning_pars_vertex="#ifdef USE_SKINNING\n\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n\n	#ifdef BONE_TEXTURE\n\n		uniform sampler2D boneTexture;\n		uniform int boneTextureWidth;\n		uniform int boneTextureHeight;\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			float j = i * 4.0;\n			float x = mod( j, float( boneTextureWidth ) );\n			float y = floor( j / float( boneTextureWidth ) );\n\n			float dx = 1.0 / float( boneTextureWidth );\n			float dy = 1.0 / float( boneTextureHeight );\n\n			y = dy * ( y + 0.5 );\n\n			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\n			mat4 bone = mat4( v1, v2, v3, v4 );\n\n			return bone;\n\n		}\n\n	#else\n\n		uniform mat4 boneGlobalMatrices[ MAX_BONES ];\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			mat4 bone = boneGlobalMatrices[ int(i) ];\n			return bone;\n\n		}\n\n	#endif\n\n#endif\n",THREE.ShaderChunk.logdepthbuf_pars_fragment="#ifdef USE_LOGDEPTHBUF\n\n	uniform float logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		#extension GL_EXT_frag_depth : enable\n		varying float vFragDepth;\n\n	#endif\n\n#endif",THREE.ShaderChunk.alphamap_fragment="#ifdef USE_ALPHAMAP\n\n	diffuseColor.a *= texture2D( alphaMap, vUv ).g;\n\n#endif\n",THREE.ShaderChunk.alphamap_pars_fragment="#ifdef USE_ALPHAMAP\n\n	uniform sampler2D alphaMap;\n\n#endif\n",THREE.UniformsUtils={merge:function(e){for(var t={},r=0;r<e.length;r++){var i,n=this.clone(e[r]);for(i in n)t[i]=n[i]}return t},clone:function(e){var t,r={};for(t in e){r[t]={};for(var i in e[t]){var n=e[t][i];r[t][i]=n instanceof THREE.Color||n instanceof THREE.Vector2||n instanceof THREE.Vector3||n instanceof THREE.Vector4||n instanceof THREE.Matrix4||n instanceof THREE.Texture?n.clone():n instanceof Array?n.slice():n}}return r}},THREE.UniformsLib={common:{diffuse:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},map:{type:"t",value:null},offsetRepeat:{type:"v4",value:new THREE.Vector4(0,0,1,1)},lightMap:{type:"t",value:null},specularMap:{type:"t",value:null},alphaMap:{type:"t",value:null},envMap:{type:"t",value:null},flipEnvMap:{type:"f",value:-1},reflectivity:{type:"f",value:1},refractionRatio:{type:"f",value:.98},morphTargetInfluences:{type:"f",value:0}},bump:{bumpMap:{type:"t",value:null},bumpScale:{type:"f",value:1}},normalmap:{normalMap:{type:"t",value:null},normalScale:{type:"v2",value:new THREE.Vector2(1,1)}},fog:{fogDensity:{type:"f",value:25e-5},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2e3},fogColor:{type:"c",value:new THREE.Color(16777215)}},lights:{ambientLightColor:{type:"fv",value:[]},directionalLightDirection:{type:"fv",value:[]},directionalLightColor:{type:"fv",value:[]},hemisphereLightDirection:{type:"fv",value:[]},hemisphereLightSkyColor:{type:"fv",value:[]},hemisphereLightGroundColor:{type:"fv",value:[]},pointLightColor:{type:"fv",value:[]},pointLightPosition:{type:"fv",value:[]},pointLightDistance:{type:"fv1",value:[]},pointLightDecay:{type:"fv1",value:[]},spotLightColor:{type:"fv",value:[]},spotLightPosition:{type:"fv",value:[]},spotLightDirection:{type:"fv",value:[]},spotLightDistance:{type:"fv1",value:[]},spotLightAngleCos:{type:"fv1",value:[]},spotLightExponent:{type:"fv1",value:[]},spotLightDecay:{type:"fv1",value:[]}},particle:{psColor:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},size:{type:"f",value:1},scale:{type:"f",value:1},map:{type:"t",value:null},offsetRepeat:{type:"v4",value:new THREE.Vector4(0,0,1,1)},fogDensity:{type:"f",value:25e-5},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2e3},fogColor:{type:"c",value:new THREE.Color(16777215)}},shadowmap:{shadowMap:{type:"tv",value:[]},shadowMapSize:{type:"v2v",value:[]},shadowBias:{type:"fv1",value:[]},shadowDarkness:{type:"fv1",value:[]},shadowMatrix:{type:"m4v",value:[]}}},THREE.ShaderLib={basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.shadowmap]),vertexShader:[THREE.ShaderChunk.common,THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.skinbase_vertex,"	#ifdef USE_ENVMAP",THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinnormal_vertex,THREE.ShaderChunk.defaultnormal_vertex,"	#endif",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;",THREE.ShaderChunk.common,THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.alphamap_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );",THREE.ShaderChunk.logdepthbuf_fragment,THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.alphamap_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,"	outgoingLight = diffuseColor.rgb;",THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n}"].join("\n")},lambert:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{emissive:{type:"c",value:new THREE.Color(0)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["#define LAMBERT\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\n	varying vec3 vLightBack;\n#endif",THREE.ShaderChunk.common,THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_lambert_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,THREE.ShaderChunk.defaultnormal_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.lights_lambert_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\n	varying vec3 vLightBack;\n#endif",THREE.ShaderChunk.common,THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.alphamap_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );",THREE.ShaderChunk.logdepthbuf_fragment,THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.alphamap_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,"	#ifdef DOUBLE_SIDED\n		if ( gl_FrontFacing )\n			outgoingLight += diffuseColor.rgb * vLightFront + emissive;\n		else\n			outgoingLight += diffuseColor.rgb * vLightBack + emissive;\n	#else\n		outgoingLight += diffuseColor.rgb * vLightFront + emissive;\n	#endif",THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n}"].join("\n")},phong:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.bump,THREE.UniformsLib.normalmap,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{emissive:{type:"c",value:new THREE.Color(0)},specular:{type:"c",value:new THREE.Color(1118481)},shininess:{type:"f",value:30},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["#define PHONG\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif",THREE.ShaderChunk.common,THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_phong_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,THREE.ShaderChunk.defaultnormal_vertex,"#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n#endif",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,"	vViewPosition = -mvPosition.xyz;",THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.lights_phong_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),
	fragmentShader:["#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;",THREE.ShaderChunk.common,THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.alphamap_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.lights_phong_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.bumpmap_pars_fragment,THREE.ShaderChunk.normalmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );",THREE.ShaderChunk.logdepthbuf_fragment,THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.alphamap_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,THREE.ShaderChunk.lights_phong_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n}"].join("\n")},particle_basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.particle,THREE.UniformsLib.shadowmap]),vertexShader:["uniform float size;\nuniform float scale;",THREE.ShaderChunk.common,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.color_vertex,"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n	#ifdef USE_SIZEATTENUATION\n		gl_PointSize = size * ( scale / length( mvPosition.xyz ) );\n	#else\n		gl_PointSize = size;\n	#endif\n	gl_Position = projectionMatrix * mvPosition;",THREE.ShaderChunk.logdepthbuf_vertex,THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 psColor;\nuniform float opacity;",THREE.ShaderChunk.common,THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_particle_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( psColor, opacity );",THREE.ShaderChunk.logdepthbuf_fragment,THREE.ShaderChunk.map_particle_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.alphatest_fragment,"	outgoingLight = diffuseColor.rgb;",THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,"	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n}"].join("\n")},dashed:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,{scale:{type:"f",value:1},dashSize:{type:"f",value:1},totalSize:{type:"f",value:2}}]),vertexShader:["uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;",THREE.ShaderChunk.common,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.color_vertex,"	vLineDistance = scale * lineDistance;\n	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n	gl_Position = projectionMatrix * mvPosition;",THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;",THREE.ShaderChunk.common,THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n	if ( mod( vLineDistance, totalSize ) > dashSize ) {\n		discard;\n	}\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );",THREE.ShaderChunk.logdepthbuf_fragment,THREE.ShaderChunk.color_fragment,"	outgoingLight = diffuseColor.rgb;",THREE.ShaderChunk.fog_fragment,"	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n}"].join("\n")},depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2e3},opacity:{type:"f",value:1}},vertexShader:[THREE.ShaderChunk.common,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:["uniform float mNear;\nuniform float mFar;\nuniform float opacity;",THREE.ShaderChunk.common,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {",THREE.ShaderChunk.logdepthbuf_fragment,"	#ifdef USE_LOGDEPTHBUF_EXT\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n	#else\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n	#endif\n	float color = 1.0 - smoothstep( mNear, mFar, depth );\n	gl_FragColor = vec4( vec3( color ), opacity );\n}"].join("\n")},normal:{uniforms:{opacity:{type:"f",value:1}},vertexShader:["varying vec3 vNormal;",THREE.ShaderChunk.common,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {\n	vNormal = normalize( normalMatrix * normal );",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:["uniform float opacity;\nvarying vec3 vNormal;",THREE.ShaderChunk.common,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n	gl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );",THREE.ShaderChunk.logdepthbuf_fragment,"}"].join("\n")},cube:{uniforms:{tCube:{type:"t",value:null},tFlip:{type:"f",value:-1}},vertexShader:["varying vec3 vWorldPosition;",THREE.ShaderChunk.common,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {\n	vWorldPosition = transformDirection( position, modelMatrix );\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:["uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vWorldPosition;",THREE.ShaderChunk.common,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );",THREE.ShaderChunk.logdepthbuf_fragment,"}"].join("\n")},equirect:{uniforms:{tEquirect:{type:"t",value:null},tFlip:{type:"f",value:-1}},vertexShader:["varying vec3 vWorldPosition;",THREE.ShaderChunk.common,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {\n	vWorldPosition = transformDirection( position, modelMatrix );\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:["uniform sampler2D tEquirect;\nuniform float tFlip;\nvarying vec3 vWorldPosition;",THREE.ShaderChunk.common,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\nvec3 direction = normalize( vWorldPosition );\nvec2 sampleUV;\nsampleUV.y = saturate( tFlip * direction.y * -0.5 + 0.5 );\nsampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;\ngl_FragColor = texture2D( tEquirect, sampleUV );",THREE.ShaderChunk.logdepthbuf_fragment,"}"].join("\n")},depthRGBA:{uniforms:{},vertexShader:[THREE.ShaderChunk.common,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:[THREE.ShaderChunk.common,THREE.ShaderChunk.logdepthbuf_pars_fragment,"vec4 pack_depth( const in float depth ) {\n	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\n	const vec4 bit_mask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\n	vec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );\n	res -= res.xxyz * bit_mask;\n	return res;\n}\nvoid main() {",THREE.ShaderChunk.logdepthbuf_fragment,"	#ifdef USE_LOGDEPTHBUF_EXT\n		gl_FragData[ 0 ] = pack_depth( gl_FragDepthEXT );\n	#else\n		gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );\n	#endif\n}"].join("\n")}},THREE.WebGLRenderer=function(e){function t(e){var t=e.geometry;e=e.material;var r=t.vertices.length;if(e.attributes){void 0===t.__webglCustomAttributesList&&(t.__webglCustomAttributesList=[]);for(var i in e.attributes){var n=e.attributes[i];if(!n.__webglInitialized||n.createUniqueBuffers){n.__webglInitialized=!0;var o=1;"v2"===n.type?o=2:"v3"===n.type?o=3:"v4"===n.type?o=4:"c"===n.type&&(o=3),n.size=o,n.array=new Float32Array(r*o),n.buffer=q.createBuffer(),n.buffer.belongsToAttribute=i,n.needsUpdate=!0}t.__webglCustomAttributesList.push(n)}}}function r(e,t){return e.material instanceof THREE.MeshFaceMaterial?e.material.materials[t.materialIndex]:e.material}function i(e,t,r,i){r=r.attributes;var n=t.attributes;t=t.attributesKeys;for(var o=0,a=t.length;a>o;o++){var s=t[o],h=n[s];if(h>=0){var c=r[s];void 0!==c?(s=c.itemSize,q.bindBuffer(q.ARRAY_BUFFER,c.buffer),Te.enableAttribute(h),q.vertexAttribPointer(h,s,q.FLOAT,!1,0,i*s*4)):void 0!==e.defaultAttributeValues&&(2===e.defaultAttributeValues[s].length?q.vertexAttrib2fv(h,e.defaultAttributeValues[s]):3===e.defaultAttributeValues[s].length&&q.vertexAttrib3fv(h,e.defaultAttributeValues[s]))}}Te.disableUnusedAttributes()}function n(e,t){return e.object.renderOrder!==t.object.renderOrder?e.object.renderOrder-t.object.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.z!==t.z?e.z-t.z:e.id-t.id}function o(e,t){return e.object.renderOrder!==t.object.renderOrder?e.object.renderOrder-t.object.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function a(e,t){return t[0]-e[0]}function s(e){if(!1!==e.visible){if(!(e instanceof THREE.Scene||e instanceof THREE.Group)){void 0===e.__webglInit&&(e.__webglInit=!0,e._modelViewMatrix=new THREE.Matrix4,e._normalMatrix=new THREE.Matrix3,e.addEventListener("removed",Oe));var r=e.geometry;if(void 0!==r&&void 0===r.__webglInit)if(r.__webglInit=!0,r.addEventListener("dispose",Ne),r instanceof THREE.BufferGeometry)K.info.memory.geometries++;else if(e instanceof THREE.Mesh)u(e,r);else if(e instanceof THREE.Line){if(void 0===r.__webglVertexBuffer){r.__webglVertexBuffer=q.createBuffer(),r.__webglColorBuffer=q.createBuffer(),r.__webglLineDistanceBuffer=q.createBuffer(),K.info.memory.geometries++;var i=r.vertices.length;r.__vertexArray=new Float32Array(3*i),r.__colorArray=new Float32Array(3*i),r.__lineDistanceArray=new Float32Array(1*i),r.__webglLineCount=i,t(e),r.verticesNeedUpdate=!0,r.colorsNeedUpdate=!0,r.lineDistancesNeedUpdate=!0}}else e instanceof THREE.PointCloud&&void 0===r.__webglVertexBuffer&&(r.__webglVertexBuffer=q.createBuffer(),r.__webglColorBuffer=q.createBuffer(),K.info.memory.geometries++,i=r.vertices.length,r.__vertexArray=new Float32Array(3*i),r.__colorArray=new Float32Array(3*i),r.__webglParticleCount=i,t(e),r.verticesNeedUpdate=!0,r.colorsNeedUpdate=!0);if(void 0===e.__webglActive)if(e.__webglActive=!0,e instanceof THREE.Mesh){if(r instanceof THREE.BufferGeometry)E(I,r,e);else if(r instanceof THREE.Geometry)for(var r=je[r.id],i=0,n=r.length;n>i;i++)E(I,r[i],e)}else e instanceof THREE.Line||e instanceof THREE.PointCloud?E(I,r,e):(e instanceof THREE.ImmediateRenderObject||e.immediateRenderCallback)&&G.push({id:null,object:e,opaque:null,transparent:null,z:0});if(e instanceof THREE.Light)z.push(e);else if(e instanceof THREE.Sprite)X.push(e);else if(e instanceof THREE.LensFlare)Y.push(e);else if((r=I[e.id])&&(!1===e.frustumCulled||!0===ce.intersectsObject(e)))for(i=0,n=r.length;n>i;i++){var o=r[i],a=o,h=a.object,c=a.buffer,l=h.geometry,h=h.material;h instanceof THREE.MeshFaceMaterial?(h=h.materials[l instanceof THREE.BufferGeometry?0:c.materialIndex],a.material=h,h.transparent?j.push(a):W.push(a)):h&&(a.material=h,h.transparent?j.push(a):W.push(a)),o.render=!0,!0===K.sortObjects&&(ue.setFromMatrixPosition(e.matrixWorld),ue.applyProjection(le),o.z=ue.z)}}for(i=0,n=e.children.length;n>i;i++)s(e.children[i])}}function h(e,t,r,i,n){for(var o,a=0,s=e.length;s>a;a++){o=e[a];var h=o.object,c=o.buffer;if(y(h,t),n)o=n;else{if(o=o.material,!o)continue;m(o)}K.setMaterialFaces(o),c instanceof THREE.BufferGeometry?K.renderBufferDirect(t,r,i,o,c,h):K.renderBuffer(t,r,i,o,c,h)}}function c(e,t,r,i,n,o){for(var a,s=0,h=e.length;h>s;s++){a=e[s];var c=a.object;if(c.visible){if(o)a=o;else{if(a=a[t],!a)continue;m(a)}K.renderImmediateObject(r,i,n,a,c)}}}function l(e){var t=e.object.material;t.transparent?(e.transparent=t,e.opaque=null):(e.opaque=t,e.transparent=null)}function u(e,t){var i=e.material,n=!1;if(void 0===je[t.id]||!0===t.groupsNeedUpdate){delete I[e.id];for(var o,a,s=je,h=t.id,i=i instanceof THREE.MeshFaceMaterial,c=ge.get("OES_element_index_uint")?4294967296:65535,n={},l=t.morphTargets.length,u=t.morphNormals.length,p={},d=[],f=0,m=t.faces.length;m>f;f++){o=t.faces[f];var T=i?o.materialIndex:0;T in n||(n[T]={hash:T,counter:0}),o=n[T].hash+"_"+n[T].counter,o in p||(a={id:Xe++,faces3:[],materialIndex:T,vertices:0,numMorphTargets:l,numMorphNormals:u},p[o]=a,d.push(a)),p[o].vertices+3>c&&(n[T].counter+=1,o=n[T].hash+"_"+n[T].counter,o in p||(a={id:Xe++,faces3:[],materialIndex:T,vertices:0,numMorphTargets:l,numMorphNormals:u},p[o]=a,d.push(a))),p[o].faces3.push(f),p[o].vertices+=3}s[h]=d,t.groupsNeedUpdate=!1}for(s=je[t.id],h=0,i=s.length;i>h;h++){if(c=s[h],void 0===c.__webglVertexBuffer){if(n=c,n.__webglVertexBuffer=q.createBuffer(),n.__webglNormalBuffer=q.createBuffer(),n.__webglTangentBuffer=q.createBuffer(),n.__webglColorBuffer=q.createBuffer(),n.__webglUVBuffer=q.createBuffer(),n.__webglUV2Buffer=q.createBuffer(),n.__webglSkinIndicesBuffer=q.createBuffer(),n.__webglSkinWeightsBuffer=q.createBuffer(),n.__webglFaceBuffer=q.createBuffer(),n.__webglLineBuffer=q.createBuffer(),u=n.numMorphTargets)for(n.__webglMorphTargetsBuffers=[],l=0;u>l;l++)n.__webglMorphTargetsBuffers.push(q.createBuffer());if(u=n.numMorphNormals)for(n.__webglMorphNormalsBuffers=[],l=0;u>l;l++)n.__webglMorphNormalsBuffers.push(q.createBuffer());if(K.info.memory.geometries++,n=c,f=e,m=f.geometry,u=n.faces3,l=3*u.length,p=1*u.length,d=3*u.length,u=r(f,n),n.__vertexArray=new Float32Array(3*l),n.__normalArray=new Float32Array(3*l),n.__colorArray=new Float32Array(3*l),n.__uvArray=new Float32Array(2*l),1<m.faceVertexUvs.length&&(n.__uv2Array=new Float32Array(2*l)),m.hasTangents&&(n.__tangentArray=new Float32Array(4*l)),f.geometry.skinWeights.length&&f.geometry.skinIndices.length&&(n.__skinIndexArray=new Float32Array(4*l),n.__skinWeightArray=new Float32Array(4*l)),f=null!==ge.get("OES_element_index_uint")&&p>21845?Uint32Array:Uint16Array,n.__typeArray=f,n.__faceArray=new f(3*p),n.__lineArray=new f(2*d),m=n.numMorphTargets)for(n.__morphTargetsArrays=[],f=0;m>f;f++)n.__morphTargetsArrays.push(new Float32Array(3*l));if(m=n.numMorphNormals)for(n.__morphNormalsArrays=[],f=0;m>f;f++)n.__morphNormalsArrays.push(new Float32Array(3*l));if(n.__webglFaceCount=3*p,n.__webglLineCount=2*d,u.attributes)for(p in void 0===n.__webglCustomAttributesList&&(n.__webglCustomAttributesList=[]),p=void 0,u.attributes){var g,d=u.attributes[p],f={};for(g in d)f[g]=d[g];(!f.__webglInitialized||f.createUniqueBuffers)&&(f.__webglInitialized=!0,m=1,"v2"===f.type?m=2:"v3"===f.type?m=3:"v4"===f.type?m=4:"c"===f.type&&(m=3),f.size=m,f.array=new Float32Array(l*m),f.buffer=q.createBuffer(),f.buffer.belongsToAttribute=p,d.needsUpdate=!0,f.__original=d),n.__webglCustomAttributesList.push(f)}n.__inittedArrays=!0,t.verticesNeedUpdate=!0,t.morphTargetsNeedUpdate=!0,t.elementsNeedUpdate=!0,t.uvsNeedUpdate=!0,t.normalsNeedUpdate=!0,t.tangentsNeedUpdate=!0,n=t.colorsNeedUpdate=!0}else n=!1;(n||void 0===e.__webglActive)&&E(I,c,e)}e.__webglActive=!0}function E(e,t,r){var i=r.id;e[i]=e[i]||[],e[i].push({id:i,buffer:t,object:r,material:null,z:0})}function p(e){var t=e.geometry;if(t instanceof THREE.BufferGeometry)for(var i=t.attributes,n=t.attributesKeys,o=0,a=n.length;a>o;o++){var s=n[o],h=i[s],c="index"===s?q.ELEMENT_ARRAY_BUFFER:q.ARRAY_BUFFER;void 0===h.buffer?(h.buffer=q.createBuffer(),q.bindBuffer(c,h.buffer),q.bufferData(c,h.array,h instanceof THREE.DynamicBufferAttribute?q.DYNAMIC_DRAW:q.STATIC_DRAW),h.needsUpdate=!1):!0===h.needsUpdate&&(q.bindBuffer(c,h.buffer),void 0===h.updateRange||-1===h.updateRange.count?q.bufferSubData(c,0,h.array):0===h.updateRange.count?console.error("THREE.WebGLRenderer.updateObject: using updateRange for THREE.DynamicBufferAttribute and marked as needsUpdate but count is 0, ensure you are using set methods or updating manually."):(q.bufferSubData(c,h.updateRange.offset*h.array.BYTES_PER_ELEMENT,h.array.subarray(h.updateRange.offset,h.updateRange.offset+h.updateRange.count)),h.updateRange.count=0),h.needsUpdate=!1)}else if(e instanceof THREE.Mesh){!0===t.groupsNeedUpdate&&u(e,t);for(var l=je[t.id],o=0,E=l.length;E>o;o++){var p=l[o],m=r(e,p),T=m.attributes&&d(m);if(t.verticesNeedUpdate||t.morphTargetsNeedUpdate||t.elementsNeedUpdate||t.uvsNeedUpdate||t.normalsNeedUpdate||t.colorsNeedUpdate||t.tangentsNeedUpdate||T){var g=p,R=e,y=q.DYNAMIC_DRAW,v=!t.dynamic,H=m;if(g.__inittedArrays){var x=!1==H instanceof THREE.MeshPhongMaterial&&H.shading===THREE.FlatShading,b=void 0,w=void 0,_=void 0,M=void 0,S=void 0,A=void 0,C=void 0,L=void 0,P=void 0,F=void 0,D=void 0,U=void 0,B=void 0,V=void 0,O=void 0,N=void 0,k=void 0,z=void 0,I=void 0,G=void 0,W=void 0,j=void 0,X=void 0,Y=void 0,K=void 0,Z=void 0,Q=void 0,J=void 0,$=void 0,ee=void 0,te=void 0,re=void 0,ie=void 0,ne=void 0,oe=void 0,ae=void 0,se=void 0,he=void 0,ce=void 0,le=void 0,ue=0,Ee=0,pe=0,de=0,fe=0,me=0,Te=0,ge=0,Re=0,ye=0,ve=0,He=0,xe=void 0,be=g.__vertexArray,we=g.__uvArray,_e=g.__uv2Array,Me=g.__normalArray,Se=g.__tangentArray,Ae=g.__colorArray,Ce=g.__skinIndexArray,Le=g.__skinWeightArray,Pe=g.__morphTargetsArrays,Fe=g.__morphNormalsArrays,De=g.__webglCustomAttributesList,Ue=void 0,Be=g.__faceArray,Ve=g.__lineArray,Oe=R.geometry,Ne=Oe.elementsNeedUpdate,ke=Oe.uvsNeedUpdate,ze=Oe.normalsNeedUpdate,Ie=Oe.tangentsNeedUpdate,Ge=Oe.colorsNeedUpdate,We=Oe.morphTargetsNeedUpdate,Xe=Oe.vertices,Ye=g.faces3,qe=Oe.faces,Ke=Oe.faceVertexUvs[0],Ze=Oe.faceVertexUvs[1],Qe=Oe.skinIndices,Je=Oe.skinWeights,$e=Oe.morphTargets,et=Oe.morphNormals;if(Oe.verticesNeedUpdate){for(b=0,w=Ye.length;w>b;b++)M=qe[Ye[b]],U=Xe[M.a],B=Xe[M.b],V=Xe[M.c],be[Ee]=U.x,be[Ee+1]=U.y,be[Ee+2]=U.z,be[Ee+3]=B.x,be[Ee+4]=B.y,be[Ee+5]=B.z,be[Ee+6]=V.x,be[Ee+7]=V.y,be[Ee+8]=V.z,Ee+=9;q.bindBuffer(q.ARRAY_BUFFER,g.__webglVertexBuffer),q.bufferData(q.ARRAY_BUFFER,be,y)}if(We)for(oe=0,ae=$e.length;ae>oe;oe++){for(b=ve=0,w=Ye.length;w>b;b++)ce=Ye[b],M=qe[ce],U=$e[oe].vertices[M.a],B=$e[oe].vertices[M.b],V=$e[oe].vertices[M.c],se=Pe[oe],se[ve]=U.x,se[ve+1]=U.y,se[ve+2]=U.z,se[ve+3]=B.x,se[ve+4]=B.y,se[ve+5]=B.z,se[ve+6]=V.x,se[ve+7]=V.y,se[ve+8]=V.z,H.morphNormals&&(x?G=I=z=et[oe].faceNormals[ce]:(le=et[oe].vertexNormals[ce],z=le.a,I=le.b,G=le.c),he=Fe[oe],he[ve]=z.x,he[ve+1]=z.y,he[ve+2]=z.z,he[ve+3]=I.x,he[ve+4]=I.y,he[ve+5]=I.z,he[ve+6]=G.x,he[ve+7]=G.y,he[ve+8]=G.z),ve+=9;q.bindBuffer(q.ARRAY_BUFFER,g.__webglMorphTargetsBuffers[oe]),q.bufferData(q.ARRAY_BUFFER,Pe[oe],y),H.morphNormals&&(q.bindBuffer(q.ARRAY_BUFFER,g.__webglMorphNormalsBuffers[oe]),q.bufferData(q.ARRAY_BUFFER,Fe[oe],y))}if(Je.length){for(b=0,w=Ye.length;w>b;b++)M=qe[Ye[b]],Y=Je[M.a],K=Je[M.b],Z=Je[M.c],Le[ye]=Y.x,Le[ye+1]=Y.y,Le[ye+2]=Y.z,Le[ye+3]=Y.w,Le[ye+4]=K.x,Le[ye+5]=K.y,Le[ye+6]=K.z,Le[ye+7]=K.w,Le[ye+8]=Z.x,Le[ye+9]=Z.y,Le[ye+10]=Z.z,Le[ye+11]=Z.w,Q=Qe[M.a],J=Qe[M.b],$=Qe[M.c],Ce[ye]=Q.x,Ce[ye+1]=Q.y,Ce[ye+2]=Q.z,Ce[ye+3]=Q.w,Ce[ye+4]=J.x,Ce[ye+5]=J.y,Ce[ye+6]=J.z,Ce[ye+7]=J.w,Ce[ye+8]=$.x,Ce[ye+9]=$.y,Ce[ye+10]=$.z,Ce[ye+11]=$.w,ye+=12;ye>0&&(q.bindBuffer(q.ARRAY_BUFFER,g.__webglSkinIndicesBuffer),q.bufferData(q.ARRAY_BUFFER,Ce,y),q.bindBuffer(q.ARRAY_BUFFER,g.__webglSkinWeightsBuffer),q.bufferData(q.ARRAY_BUFFER,Le,y))}if(Ge){for(b=0,w=Ye.length;w>b;b++)M=qe[Ye[b]],C=M.vertexColors,L=M.color,3===C.length&&H.vertexColors===THREE.VertexColors?(W=C[0],j=C[1],X=C[2]):X=j=W=L,Ae[Re]=W.r,Ae[Re+1]=W.g,Ae[Re+2]=W.b,Ae[Re+3]=j.r,Ae[Re+4]=j.g,Ae[Re+5]=j.b,Ae[Re+6]=X.r,Ae[Re+7]=X.g,Ae[Re+8]=X.b,Re+=9;Re>0&&(q.bindBuffer(q.ARRAY_BUFFER,g.__webglColorBuffer),q.bufferData(q.ARRAY_BUFFER,Ae,y))}if(Ie&&Oe.hasTangents){for(b=0,w=Ye.length;w>b;b++)M=qe[Ye[b]],P=M.vertexTangents,O=P[0],N=P[1],k=P[2],Se[Te]=O.x,Se[Te+1]=O.y,Se[Te+2]=O.z,Se[Te+3]=O.w,Se[Te+4]=N.x,Se[Te+5]=N.y,Se[Te+6]=N.z,Se[Te+7]=N.w,Se[Te+8]=k.x,Se[Te+9]=k.y,Se[Te+10]=k.z,Se[Te+11]=k.w,Te+=12;q.bindBuffer(q.ARRAY_BUFFER,g.__webglTangentBuffer),q.bufferData(q.ARRAY_BUFFER,Se,y)}if(ze){for(b=0,w=Ye.length;w>b;b++)if(M=qe[Ye[b]],S=M.vertexNormals,A=M.normal,3===S.length&&!1===x)for(ee=0;3>ee;ee++)re=S[ee],Me[me]=re.x,Me[me+1]=re.y,Me[me+2]=re.z,me+=3;else for(ee=0;3>ee;ee++)Me[me]=A.x,Me[me+1]=A.y,Me[me+2]=A.z,me+=3;q.bindBuffer(q.ARRAY_BUFFER,g.__webglNormalBuffer),q.bufferData(q.ARRAY_BUFFER,Me,y)}if(ke&&Ke){for(b=0,w=Ye.length;w>b;b++)if(_=Ye[b],F=Ke[_],void 0!==F)for(ee=0;3>ee;ee++)ie=F[ee],we[pe]=ie.x,we[pe+1]=ie.y,pe+=2;pe>0&&(q.bindBuffer(q.ARRAY_BUFFER,g.__webglUVBuffer),q.bufferData(q.ARRAY_BUFFER,we,y))}if(ke&&Ze){for(b=0,w=Ye.length;w>b;b++)if(_=Ye[b],D=Ze[_],void 0!==D)for(ee=0;3>ee;ee++)ne=D[ee],_e[de]=ne.x,_e[de+1]=ne.y,de+=2;de>0&&(q.bindBuffer(q.ARRAY_BUFFER,g.__webglUV2Buffer),q.bufferData(q.ARRAY_BUFFER,_e,y))}if(Ne){for(b=0,w=Ye.length;w>b;b++)Be[fe]=ue,Be[fe+1]=ue+1,Be[fe+2]=ue+2,fe+=3,Ve[ge]=ue,Ve[ge+1]=ue+1,Ve[ge+2]=ue,Ve[ge+3]=ue+2,Ve[ge+4]=ue+1,Ve[ge+5]=ue+2,ge+=6,ue+=3;q.bindBuffer(q.ELEMENT_ARRAY_BUFFER,g.__webglFaceBuffer),q.bufferData(q.ELEMENT_ARRAY_BUFFER,Be,y),q.bindBuffer(q.ELEMENT_ARRAY_BUFFER,g.__webglLineBuffer),q.bufferData(q.ELEMENT_ARRAY_BUFFER,Ve,y)}if(De)for(ee=0,te=De.length;te>ee;ee++)if(Ue=De[ee],Ue.__original.needsUpdate){if(He=0,1===Ue.size){if(void 0===Ue.boundTo||"vertices"===Ue.boundTo)for(b=0,w=Ye.length;w>b;b++)M=qe[Ye[b]],Ue.array[He]=Ue.value[M.a],Ue.array[He+1]=Ue.value[M.b],Ue.array[He+2]=Ue.value[M.c],He+=3;else if("faces"===Ue.boundTo)for(b=0,w=Ye.length;w>b;b++)xe=Ue.value[Ye[b]],Ue.array[He]=xe,Ue.array[He+1]=xe,Ue.array[He+2]=xe,He+=3}else if(2===Ue.size){if(void 0===Ue.boundTo||"vertices"===Ue.boundTo)for(b=0,w=Ye.length;w>b;b++)M=qe[Ye[b]],U=Ue.value[M.a],B=Ue.value[M.b],V=Ue.value[M.c],Ue.array[He]=U.x,Ue.array[He+1]=U.y,Ue.array[He+2]=B.x,Ue.array[He+3]=B.y,Ue.array[He+4]=V.x,Ue.array[He+5]=V.y,He+=6;else if("faces"===Ue.boundTo)for(b=0,w=Ye.length;w>b;b++)V=B=U=xe=Ue.value[Ye[b]],Ue.array[He]=U.x,Ue.array[He+1]=U.y,Ue.array[He+2]=B.x,Ue.array[He+3]=B.y,Ue.array[He+4]=V.x,Ue.array[He+5]=V.y,He+=6}else if(3===Ue.size){var tt;if(tt="c"===Ue.type?["r","g","b"]:["x","y","z"],void 0===Ue.boundTo||"vertices"===Ue.boundTo)for(b=0,w=Ye.length;w>b;b++)M=qe[Ye[b]],U=Ue.value[M.a],B=Ue.value[M.b],V=Ue.value[M.c],Ue.array[He]=U[tt[0]],Ue.array[He+1]=U[tt[1]],Ue.array[He+2]=U[tt[2]],Ue.array[He+3]=B[tt[0]],Ue.array[He+4]=B[tt[1]],Ue.array[He+5]=B[tt[2]],Ue.array[He+6]=V[tt[0]],Ue.array[He+7]=V[tt[1]],Ue.array[He+8]=V[tt[2]],He+=9;else if("faces"===Ue.boundTo)for(b=0,w=Ye.length;w>b;b++)V=B=U=xe=Ue.value[Ye[b]],Ue.array[He]=U[tt[0]],Ue.array[He+1]=U[tt[1]],Ue.array[He+2]=U[tt[2]],Ue.array[He+3]=B[tt[0]],Ue.array[He+4]=B[tt[1]],Ue.array[He+5]=B[tt[2]],Ue.array[He+6]=V[tt[0]],Ue.array[He+7]=V[tt[1]],Ue.array[He+8]=V[tt[2]],He+=9;else if("faceVertices"===Ue.boundTo)for(b=0,w=Ye.length;w>b;b++)xe=Ue.value[Ye[b]],U=xe[0],B=xe[1],V=xe[2],Ue.array[He]=U[tt[0]],Ue.array[He+1]=U[tt[1]],Ue.array[He+2]=U[tt[2]],Ue.array[He+3]=B[tt[0]],Ue.array[He+4]=B[tt[1]],Ue.array[He+5]=B[tt[2]],Ue.array[He+6]=V[tt[0]],Ue.array[He+7]=V[tt[1]],Ue.array[He+8]=V[tt[2]],He+=9}else if(4===Ue.size)if(void 0===Ue.boundTo||"vertices"===Ue.boundTo)for(b=0,w=Ye.length;w>b;b++)M=qe[Ye[b]],U=Ue.value[M.a],B=Ue.value[M.b],V=Ue.value[M.c],Ue.array[He]=U.x,Ue.array[He+1]=U.y,Ue.array[He+2]=U.z,Ue.array[He+3]=U.w,Ue.array[He+4]=B.x,Ue.array[He+5]=B.y,Ue.array[He+6]=B.z,Ue.array[He+7]=B.w,Ue.array[He+8]=V.x,Ue.array[He+9]=V.y,Ue.array[He+10]=V.z,Ue.array[He+11]=V.w,He+=12;else if("faces"===Ue.boundTo)for(b=0,w=Ye.length;w>b;b++)V=B=U=xe=Ue.value[Ye[b]],Ue.array[He]=U.x,Ue.array[He+1]=U.y,Ue.array[He+2]=U.z,Ue.array[He+3]=U.w,Ue.array[He+4]=B.x,Ue.array[He+5]=B.y,Ue.array[He+6]=B.z,Ue.array[He+7]=B.w,Ue.array[He+8]=V.x,Ue.array[He+9]=V.y,Ue.array[He+10]=V.z,Ue.array[He+11]=V.w,He+=12;else if("faceVertices"===Ue.boundTo)for(b=0,w=Ye.length;w>b;b++)xe=Ue.value[Ye[b]],U=xe[0],B=xe[1],V=xe[2],Ue.array[He]=U.x,Ue.array[He+1]=U.y,Ue.array[He+2]=U.z,Ue.array[He+3]=U.w,Ue.array[He+4]=B.x,Ue.array[He+5]=B.y,Ue.array[He+6]=B.z,Ue.array[He+7]=B.w,Ue.array[He+8]=V.x,Ue.array[He+9]=V.y,Ue.array[He+10]=V.z,Ue.array[He+11]=V.w,He+=12;q.bindBuffer(q.ARRAY_BUFFER,Ue.buffer),q.bufferData(q.ARRAY_BUFFER,Ue.array,y)}v&&(delete g.__inittedArrays,delete g.__colorArray,delete g.__normalArray,delete g.__tangentArray,delete g.__uvArray,delete g.__uv2Array,delete g.__faceArray,delete g.__vertexArray,delete g.__lineArray,delete g.__skinIndexArray,delete g.__skinWeightArray)}}}t.verticesNeedUpdate=!1,t.morphTargetsNeedUpdate=!1,t.elementsNeedUpdate=!1,t.uvsNeedUpdate=!1,t.normalsNeedUpdate=!1,t.colorsNeedUpdate=!1,t.tangentsNeedUpdate=!1,m.attributes&&f(m)}else if(e instanceof THREE.Line){if(m=r(e,t),T=m.attributes&&d(m),t.verticesNeedUpdate||t.colorsNeedUpdate||t.lineDistancesNeedUpdate||T){var rt,it,nt,ot,at,st,ht,ct,lt,ut,Et,pt,dt=q.DYNAMIC_DRAW,ft=t.vertices,mt=t.colors,Tt=t.lineDistances,gt=ft.length,Rt=mt.length,yt=Tt.length,vt=t.__vertexArray,Ht=t.__colorArray,xt=t.__lineDistanceArray,bt=t.colorsNeedUpdate,wt=t.lineDistancesNeedUpdate,_t=t.__webglCustomAttributesList;if(t.verticesNeedUpdate){for(rt=0;gt>rt;rt++)ot=ft[rt],at=3*rt,vt[at]=ot.x,vt[at+1]=ot.y,vt[at+2]=ot.z;q.bindBuffer(q.ARRAY_BUFFER,t.__webglVertexBuffer),q.bufferData(q.ARRAY_BUFFER,vt,dt)}if(bt){for(it=0;Rt>it;it++)st=mt[it],at=3*it,Ht[at]=st.r,Ht[at+1]=st.g,Ht[at+2]=st.b;q.bindBuffer(q.ARRAY_BUFFER,t.__webglColorBuffer),q.bufferData(q.ARRAY_BUFFER,Ht,dt)}if(wt){for(nt=0;yt>nt;nt++)xt[nt]=Tt[nt];q.bindBuffer(q.ARRAY_BUFFER,t.__webglLineDistanceBuffer),q.bufferData(q.ARRAY_BUFFER,xt,dt)}if(_t)for(ht=0,ct=_t.length;ct>ht;ht++)if(pt=_t[ht],pt.needsUpdate&&(void 0===pt.boundTo||"vertices"===pt.boundTo)){if(at=0,ut=pt.value.length,1===pt.size)for(lt=0;ut>lt;lt++)pt.array[lt]=pt.value[lt];else if(2===pt.size)for(lt=0;ut>lt;lt++)Et=pt.value[lt],pt.array[at]=Et.x,pt.array[at+1]=Et.y,at+=2;else if(3===pt.size)if("c"===pt.type)for(lt=0;ut>lt;lt++)Et=pt.value[lt],pt.array[at]=Et.r,pt.array[at+1]=Et.g,pt.array[at+2]=Et.b,at+=3;else for(lt=0;ut>lt;lt++)Et=pt.value[lt],pt.array[at]=Et.x,pt.array[at+1]=Et.y,pt.array[at+2]=Et.z,at+=3;else if(4===pt.size)for(lt=0;ut>lt;lt++)Et=pt.value[lt],pt.array[at]=Et.x,pt.array[at+1]=Et.y,pt.array[at+2]=Et.z,pt.array[at+3]=Et.w,at+=4;q.bindBuffer(q.ARRAY_BUFFER,pt.buffer),q.bufferData(q.ARRAY_BUFFER,pt.array,dt),pt.needsUpdate=!1}}t.verticesNeedUpdate=!1,t.colorsNeedUpdate=!1,t.lineDistancesNeedUpdate=!1,m.attributes&&f(m)}else if(e instanceof THREE.PointCloud){if(m=r(e,t),T=m.attributes&&d(m),t.verticesNeedUpdate||t.colorsNeedUpdate||T){var Mt,St,At,Ct,Lt,Pt,Ft,Dt,Ut,Bt,Vt,Ot=q.DYNAMIC_DRAW,Nt=t.vertices,kt=Nt.length,zt=t.colors,It=zt.length,Gt=t.__vertexArray,Wt=t.__colorArray,jt=t.colorsNeedUpdate,Xt=t.__webglCustomAttributesList;if(t.verticesNeedUpdate){for(Mt=0;kt>Mt;Mt++)At=Nt[Mt],Ct=3*Mt,Gt[Ct]=At.x,Gt[Ct+1]=At.y,Gt[Ct+2]=At.z;q.bindBuffer(q.ARRAY_BUFFER,t.__webglVertexBuffer),q.bufferData(q.ARRAY_BUFFER,Gt,Ot)}if(jt){for(St=0;It>St;St++)Lt=zt[St],Ct=3*St,Wt[Ct]=Lt.r,Wt[Ct+1]=Lt.g,Wt[Ct+2]=Lt.b;q.bindBuffer(q.ARRAY_BUFFER,t.__webglColorBuffer),q.bufferData(q.ARRAY_BUFFER,Wt,Ot)}if(Xt)for(Pt=0,Ft=Xt.length;Ft>Pt;Pt++){if(Vt=Xt[Pt],Vt.needsUpdate&&(void 0===Vt.boundTo||"vertices"===Vt.boundTo))if(Ut=Vt.value.length,Ct=0,1===Vt.size)for(Dt=0;Ut>Dt;Dt++)Vt.array[Dt]=Vt.value[Dt];else if(2===Vt.size)for(Dt=0;Ut>Dt;Dt++)Bt=Vt.value[Dt],Vt.array[Ct]=Bt.x,Vt.array[Ct+1]=Bt.y,Ct+=2;else if(3===Vt.size)if("c"===Vt.type)for(Dt=0;Ut>Dt;Dt++)Bt=Vt.value[Dt],Vt.array[Ct]=Bt.r,Vt.array[Ct+1]=Bt.g,Vt.array[Ct+2]=Bt.b,Ct+=3;else for(Dt=0;Ut>Dt;Dt++)Bt=Vt.value[Dt],Vt.array[Ct]=Bt.x,Vt.array[Ct+1]=Bt.y,Vt.array[Ct+2]=Bt.z,Ct+=3;else if(4===Vt.size)for(Dt=0;Ut>Dt;Dt++)Bt=Vt.value[Dt],Vt.array[Ct]=Bt.x,Vt.array[Ct+1]=Bt.y,Vt.array[Ct+2]=Bt.z,Vt.array[Ct+3]=Bt.w,Ct+=4;q.bindBuffer(q.ARRAY_BUFFER,Vt.buffer),q.bufferData(q.ARRAY_BUFFER,Vt.array,Ot),Vt.needsUpdate=!1}}t.verticesNeedUpdate=!1,t.colorsNeedUpdate=!1,m.attributes&&f(m)}}function d(e){for(var t in e.attributes)if(e.attributes[t].needsUpdate)return!0;return!1}function f(e){for(var t in e.attributes)e.attributes[t].needsUpdate=!1}function m(e){!0===e.transparent?Te.setBlending(e.blending,e.blendEquation,e.blendSrc,e.blendDst,e.blendEquationAlpha,e.blendSrcAlpha,e.blendDstAlpha):Te.setBlending(THREE.NoBlending),Te.setDepthTest(e.depthTest),Te.setDepthWrite(e.depthWrite),Te.setColorWrite(e.colorWrite),Te.setPolygonOffset(e.polygonOffset,e.polygonOffsetFactor,e.polygonOffsetUnits)}function T(e,t,r,i,n){var o,a,s,h;if(re=0,i.needsUpdate){i.program&&We(i),i.addEventListener("dispose",Ie);var c=Ye[i.type];if(c){var l=THREE.ShaderLib[c];i.__webglShader={uniforms:THREE.UniformsUtils.clone(l.uniforms),vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}}else i.__webglShader={uniforms:i.uniforms,vertexShader:i.vertexShader,fragmentShader:i.fragmentShader};for(var u=0,E=0,p=0,d=0,f=0,m=t.length;m>f;f++){var T=t[f];T.onlyShadow||!1===T.visible||(T instanceof THREE.DirectionalLight&&u++,T instanceof THREE.PointLight&&E++,T instanceof THREE.SpotLight&&p++,T instanceof THREE.HemisphereLight&&d++)}o=u,a=E,s=p,h=d;for(var y,b=0,w=0,_=t.length;_>w;w++){var A=t[w];A.castShadow&&(A instanceof THREE.SpotLight&&b++,A instanceof THREE.DirectionalLight&&!A.shadowCascade&&b++)}y=b;var C;if(Me&&n&&n.skeleton&&n.skeleton.useVertexTexture)C=1024;else{var P=q.getParameter(q.MAX_VERTEX_UNIFORM_VECTORS),F=Math.floor((P-20)/4);void 0!==n&&n instanceof THREE.SkinnedMesh&&(F=Math.min(n.skeleton.bones.length,F),F<n.skeleton.bones.length&&THREE.warn("WebGLRenderer: too many bones - "+n.skeleton.bones.length+", this GPU supports just "+F+" (try OpenGL instead of ANGLE)")),C=F}var D={precision:L,supportsVertexTextures:_e,map:!!i.map,envMap:!!i.envMap,envMapMode:i.envMap&&i.envMap.mapping,lightMap:!!i.lightMap,bumpMap:!!i.bumpMap,normalMap:!!i.normalMap,specularMap:!!i.specularMap,alphaMap:!!i.alphaMap,combine:i.combine,vertexColors:i.vertexColors,fog:r,useFog:i.fog,fogExp:r instanceof THREE.FogExp2,flatShading:i.shading===THREE.FlatShading,sizeAttenuation:i.sizeAttenuation,logarithmicDepthBuffer:O,skinning:i.skinning,maxBones:C,useVertexTexture:Me&&n&&n.skeleton&&n.skeleton.useVertexTexture,morphTargets:i.morphTargets,morphNormals:i.morphNormals,maxMorphTargets:K.maxMorphTargets,maxMorphNormals:K.maxMorphNormals,maxDirLights:o,maxPointLights:a,maxSpotLights:s,maxHemiLights:h,maxShadows:y,shadowMapEnabled:K.shadowMapEnabled&&n.receiveShadow&&y>0,shadowMapType:K.shadowMapType,shadowMapDebug:K.shadowMapDebug,shadowMapCascade:K.shadowMapCascade,alphaTest:i.alphaTest,metal:i.metal,wrapAround:i.wrapAround,doubleSided:i.side===THREE.DoubleSide,flipSided:i.side===THREE.BackSide},U=[];if(c?U.push(c):(U.push(i.fragmentShader),U.push(i.vertexShader)),void 0!==i.defines)for(var B in i.defines)U.push(B),U.push(i.defines[B]);for(B in D)U.push(B),U.push(D[B]);for(var V,N=U.join(),k=0,z=Z.length;z>k;k++){var I=Z[k];if(I.code===N){V=I,V.usedTimes++;break}}void 0===V&&(V=new THREE.WebGLProgram(K,N,i,D),Z.push(V),K.info.memory.programs=Z.length),i.program=V;var G=V.attributes;if(i.morphTargets){i.numSupportedMorphTargets=0;for(var W,j="morphTarget",X=0;X<K.maxMorphTargets;X++)W=j+X,0<=G[W]&&i.numSupportedMorphTargets++}if(i.morphNormals)for(i.numSupportedMorphNormals=0,j="morphNormal",X=0;X<K.maxMorphNormals;X++)W=j+X,0<=G[W]&&i.numSupportedMorphNormals++;i.uniformsList=[];for(var Y in i.__webglShader.uniforms){
	var J=i.program.uniforms[Y];J&&i.uniformsList.push([i.__webglShader.uniforms[Y],J])}i.needsUpdate=!1}i.morphTargets&&!n.__webglMorphTargetInfluences&&(n.__webglMorphTargetInfluences=new Float32Array(K.maxMorphTargets));var ee=!1,ie=!1,ne=!1,oe=i.program,ae=oe.uniforms,se=i.__webglShader.uniforms;if(oe.id!==Q&&(q.useProgram(oe.program),Q=oe.id,ne=ie=ee=!0),i.id!==$&&(-1===$&&(ne=!0),$=i.id,ie=!0),(ee||e!==te)&&(q.uniformMatrix4fv(ae.projectionMatrix,!1,e.projectionMatrix.elements),O&&q.uniform1f(ae.logDepthBufFC,2/(Math.log(e.far+1)/Math.LN2)),e!==te&&(te=e),(i instanceof THREE.ShaderMaterial||i instanceof THREE.MeshPhongMaterial||i.envMap)&&null!==ae.cameraPosition&&(ue.setFromMatrixPosition(e.matrixWorld),q.uniform3f(ae.cameraPosition,ue.x,ue.y,ue.z)),(i instanceof THREE.MeshPhongMaterial||i instanceof THREE.MeshLambertMaterial||i instanceof THREE.MeshBasicMaterial||i instanceof THREE.ShaderMaterial||i.skinning)&&null!==ae.viewMatrix&&q.uniformMatrix4fv(ae.viewMatrix,!1,e.matrixWorldInverse.elements)),i.skinning)if(n.bindMatrix&&null!==ae.bindMatrix&&q.uniformMatrix4fv(ae.bindMatrix,!1,n.bindMatrix.elements),n.bindMatrixInverse&&null!==ae.bindMatrixInverse&&q.uniformMatrix4fv(ae.bindMatrixInverse,!1,n.bindMatrixInverse.elements),Me&&n.skeleton&&n.skeleton.useVertexTexture){if(null!==ae.boneTexture){var he=R();q.uniform1i(ae.boneTexture,he),K.setTexture(n.skeleton.boneTexture,he)}null!==ae.boneTextureWidth&&q.uniform1i(ae.boneTextureWidth,n.skeleton.boneTextureWidth),null!==ae.boneTextureHeight&&q.uniform1i(ae.boneTextureHeight,n.skeleton.boneTextureHeight)}else n.skeleton&&n.skeleton.boneMatrices&&null!==ae.boneGlobalMatrices&&q.uniformMatrix4fv(ae.boneGlobalMatrices,!1,n.skeleton.boneMatrices);if(ie){if(r&&i.fog&&(se.fogColor.value=r.color,r instanceof THREE.Fog?(se.fogNear.value=r.near,se.fogFar.value=r.far):r instanceof THREE.FogExp2&&(se.fogDensity.value=r.density)),i instanceof THREE.MeshPhongMaterial||i instanceof THREE.MeshLambertMaterial||i.lights){if(pe){var ce,le,fe,me,Te,ge,Re,ye,ne=!0,ve=0,He=0,xe=0,be=de,Se=be.directional.colors,Ae=be.directional.positions,Ce=be.point.colors,Le=be.point.positions,Fe=be.point.distances,De=be.point.decays,Ue=be.spot.colors,Be=be.spot.positions,Ve=be.spot.distances,Oe=be.spot.directions,Ne=be.spot.anglesCos,ze=be.spot.exponents,Ge=be.spot.decays,je=be.hemi.skyColors,Xe=be.hemi.groundColors,qe=be.hemi.positions,Ke=0,Ze=0,Qe=0,Je=0,$e=0,et=0,tt=0,rt=0,it=0,nt=0,ot=0,at=0;for(ce=0,le=t.length;le>ce;ce++)fe=t[ce],fe.onlyShadow||(me=fe.color,Re=fe.intensity,ye=fe.distance,fe instanceof THREE.AmbientLight?fe.visible&&(ve+=me.r,He+=me.g,xe+=me.b):fe instanceof THREE.DirectionalLight?($e+=1,fe.visible&&(Ee.setFromMatrixPosition(fe.matrixWorld),ue.setFromMatrixPosition(fe.target.matrixWorld),Ee.sub(ue),Ee.normalize(),it=3*Ke,Ae[it]=Ee.x,Ae[it+1]=Ee.y,Ae[it+2]=Ee.z,v(Se,it,me,Re),Ke+=1)):fe instanceof THREE.PointLight?(et+=1,fe.visible&&(nt=3*Ze,v(Ce,nt,me,Re),ue.setFromMatrixPosition(fe.matrixWorld),Le[nt]=ue.x,Le[nt+1]=ue.y,Le[nt+2]=ue.z,Fe[Ze]=ye,De[Ze]=0===fe.distance?0:fe.decay,Ze+=1)):fe instanceof THREE.SpotLight?(tt+=1,fe.visible&&(ot=3*Qe,v(Ue,ot,me,Re),Ee.setFromMatrixPosition(fe.matrixWorld),Be[ot]=Ee.x,Be[ot+1]=Ee.y,Be[ot+2]=Ee.z,Ve[Qe]=ye,ue.setFromMatrixPosition(fe.target.matrixWorld),Ee.sub(ue),Ee.normalize(),Oe[ot]=Ee.x,Oe[ot+1]=Ee.y,Oe[ot+2]=Ee.z,Ne[Qe]=Math.cos(fe.angle),ze[Qe]=fe.exponent,Ge[Qe]=0===fe.distance?0:fe.decay,Qe+=1)):fe instanceof THREE.HemisphereLight&&(rt+=1,fe.visible&&(Ee.setFromMatrixPosition(fe.matrixWorld),Ee.normalize(),at=3*Je,qe[at]=Ee.x,qe[at+1]=Ee.y,qe[at+2]=Ee.z,Te=fe.color,ge=fe.groundColor,v(je,at,Te,Re),v(Xe,at,ge,Re),Je+=1)));for(ce=3*Ke,le=Math.max(Se.length,3*$e);le>ce;ce++)Se[ce]=0;for(ce=3*Ze,le=Math.max(Ce.length,3*et);le>ce;ce++)Ce[ce]=0;for(ce=3*Qe,le=Math.max(Ue.length,3*tt);le>ce;ce++)Ue[ce]=0;for(ce=3*Je,le=Math.max(je.length,3*rt);le>ce;ce++)je[ce]=0;for(ce=3*Je,le=Math.max(Xe.length,3*rt);le>ce;ce++)Xe[ce]=0;be.directional.length=Ke,be.point.length=Ze,be.spot.length=Qe,be.hemi.length=Je,be.ambient[0]=ve,be.ambient[1]=He,be.ambient[2]=xe,pe=!1}if(ne){var st=de;se.ambientLightColor.value=st.ambient,se.directionalLightColor.value=st.directional.colors,se.directionalLightDirection.value=st.directional.positions,se.pointLightColor.value=st.point.colors,se.pointLightPosition.value=st.point.positions,se.pointLightDistance.value=st.point.distances,se.pointLightDecay.value=st.point.decays,se.spotLightColor.value=st.spot.colors,se.spotLightPosition.value=st.spot.positions,se.spotLightDistance.value=st.spot.distances,se.spotLightDirection.value=st.spot.directions,se.spotLightAngleCos.value=st.spot.anglesCos,se.spotLightExponent.value=st.spot.exponents,se.spotLightDecay.value=st.spot.decays,se.hemisphereLightSkyColor.value=st.hemi.skyColors,se.hemisphereLightGroundColor.value=st.hemi.groundColors,se.hemisphereLightDirection.value=st.hemi.positions,g(se,!0)}else g(se,!1)}if(i instanceof THREE.MeshBasicMaterial||i instanceof THREE.MeshLambertMaterial||i instanceof THREE.MeshPhongMaterial){se.opacity.value=i.opacity,se.diffuse.value=i.color,se.map.value=i.map,se.lightMap.value=i.lightMap,se.specularMap.value=i.specularMap,se.alphaMap.value=i.alphaMap,i.bumpMap&&(se.bumpMap.value=i.bumpMap,se.bumpScale.value=i.bumpScale),i.normalMap&&(se.normalMap.value=i.normalMap,se.normalScale.value.copy(i.normalScale));var ht;if(i.map?ht=i.map:i.specularMap?ht=i.specularMap:i.normalMap?ht=i.normalMap:i.bumpMap?ht=i.bumpMap:i.alphaMap&&(ht=i.alphaMap),void 0!==ht){var ct=ht.offset,lt=ht.repeat;se.offsetRepeat.value.set(ct.x,ct.y,lt.x,lt.y)}se.envMap.value=i.envMap,se.flipEnvMap.value=i.envMap instanceof THREE.WebGLRenderTargetCube?1:-1,se.reflectivity.value=i.reflectivity,se.refractionRatio.value=i.refractionRatio}if(i instanceof THREE.LineBasicMaterial)se.diffuse.value=i.color,se.opacity.value=i.opacity;else if(i instanceof THREE.LineDashedMaterial)se.diffuse.value=i.color,se.opacity.value=i.opacity,se.dashSize.value=i.dashSize,se.totalSize.value=i.dashSize+i.gapSize,se.scale.value=i.scale;else if(i instanceof THREE.PointCloudMaterial){if(se.psColor.value=i.color,se.opacity.value=i.opacity,se.size.value=i.size,se.scale.value=S.height/2,se.map.value=i.map,null!==i.map){var ut=i.map.offset,Et=i.map.repeat;se.offsetRepeat.value.set(ut.x,ut.y,Et.x,Et.y)}}else i instanceof THREE.MeshPhongMaterial?(se.shininess.value=i.shininess,se.emissive.value=i.emissive,se.specular.value=i.specular,i.wrapAround&&se.wrapRGB.value.copy(i.wrapRGB)):i instanceof THREE.MeshLambertMaterial?(se.emissive.value=i.emissive,i.wrapAround&&se.wrapRGB.value.copy(i.wrapRGB)):i instanceof THREE.MeshDepthMaterial?(se.mNear.value=e.near,se.mFar.value=e.far,se.opacity.value=i.opacity):i instanceof THREE.MeshNormalMaterial&&(se.opacity.value=i.opacity);if(n.receiveShadow&&!i._shadowPass&&se.shadowMatrix)for(var pt=0,dt=0,ft=t.length;ft>dt;dt++){var mt=t[dt];mt.castShadow&&(mt instanceof THREE.SpotLight||mt instanceof THREE.DirectionalLight&&!mt.shadowCascade)&&(se.shadowMap.value[pt]=mt.shadowMap,se.shadowMapSize.value[pt]=mt.shadowMapSize,se.shadowMatrix.value[pt]=mt.shadowMatrix,se.shadowDarkness.value[pt]=mt.shadowDarkness,se.shadowBias.value[pt]=mt.shadowBias,pt++)}for(var Tt,gt,Rt,yt=i.uniformsList,vt=0,Ht=yt.length;Ht>vt;vt++){var xt=yt[vt][0];if(!1!==xt.needsUpdate){var bt=xt.type,wt=xt.value,_t=yt[vt][1];switch(bt){case"1i":q.uniform1i(_t,wt);break;case"1f":q.uniform1f(_t,wt);break;case"2f":q.uniform2f(_t,wt[0],wt[1]);break;case"3f":q.uniform3f(_t,wt[0],wt[1],wt[2]);break;case"4f":q.uniform4f(_t,wt[0],wt[1],wt[2],wt[3]);break;case"1iv":q.uniform1iv(_t,wt);break;case"3iv":q.uniform3iv(_t,wt);break;case"1fv":q.uniform1fv(_t,wt);break;case"2fv":q.uniform2fv(_t,wt);break;case"3fv":q.uniform3fv(_t,wt);break;case"4fv":q.uniform4fv(_t,wt);break;case"Matrix3fv":q.uniformMatrix3fv(_t,!1,wt);break;case"Matrix4fv":q.uniformMatrix4fv(_t,!1,wt);break;case"i":q.uniform1i(_t,wt);break;case"f":q.uniform1f(_t,wt);break;case"v2":q.uniform2f(_t,wt.x,wt.y);break;case"v3":q.uniform3f(_t,wt.x,wt.y,wt.z);break;case"v4":q.uniform4f(_t,wt.x,wt.y,wt.z,wt.w);break;case"c":q.uniform3f(_t,wt.r,wt.g,wt.b);break;case"iv1":q.uniform1iv(_t,wt);break;case"iv":q.uniform3iv(_t,wt);break;case"fv1":q.uniform1fv(_t,wt);break;case"fv":q.uniform3fv(_t,wt);break;case"v2v":void 0===xt._array&&(xt._array=new Float32Array(2*wt.length));for(var Mt=0,St=wt.length;St>Mt;Mt++)Rt=2*Mt,xt._array[Rt]=wt[Mt].x,xt._array[Rt+1]=wt[Mt].y;q.uniform2fv(_t,xt._array);break;case"v3v":for(void 0===xt._array&&(xt._array=new Float32Array(3*wt.length)),Mt=0,St=wt.length;St>Mt;Mt++)Rt=3*Mt,xt._array[Rt]=wt[Mt].x,xt._array[Rt+1]=wt[Mt].y,xt._array[Rt+2]=wt[Mt].z;q.uniform3fv(_t,xt._array);break;case"v4v":for(void 0===xt._array&&(xt._array=new Float32Array(4*wt.length)),Mt=0,St=wt.length;St>Mt;Mt++)Rt=4*Mt,xt._array[Rt]=wt[Mt].x,xt._array[Rt+1]=wt[Mt].y,xt._array[Rt+2]=wt[Mt].z,xt._array[Rt+3]=wt[Mt].w;q.uniform4fv(_t,xt._array);break;case"m3":q.uniformMatrix3fv(_t,!1,wt.elements);break;case"m3v":for(void 0===xt._array&&(xt._array=new Float32Array(9*wt.length)),Mt=0,St=wt.length;St>Mt;Mt++)wt[Mt].flattenToArrayOffset(xt._array,9*Mt);q.uniformMatrix3fv(_t,!1,xt._array);break;case"m4":q.uniformMatrix4fv(_t,!1,wt.elements);break;case"m4v":for(void 0===xt._array&&(xt._array=new Float32Array(16*wt.length)),Mt=0,St=wt.length;St>Mt;Mt++)wt[Mt].flattenToArrayOffset(xt._array,16*Mt);q.uniformMatrix4fv(_t,!1,xt._array);break;case"t":if(Tt=wt,gt=R(),q.uniform1i(_t,gt),!Tt)continue;if(Tt instanceof THREE.CubeTexture||Tt.image instanceof Array&&6===Tt.image.length){var At=Tt,Ct=gt;if(6===At.image.length)if(At.needsUpdate){At.image.__webglTextureCube||(At.addEventListener("dispose",ke),At.image.__webglTextureCube=q.createTexture(),K.info.memory.textures++),q.activeTexture(q.TEXTURE0+Ct),q.bindTexture(q.TEXTURE_CUBE_MAP,At.image.__webglTextureCube),q.pixelStorei(q.UNPACK_FLIP_Y_WEBGL,At.flipY);for(var Lt=At instanceof THREE.CompressedTexture,Pt=At.image[0]instanceof THREE.DataTexture,Ft=[],Dt=0;6>Dt;Dt++)Ft[Dt]=!K.autoScaleCubemaps||Lt||Pt?Pt?At.image[Dt].image:At.image[Dt]:x(At.image[Dt],we);var Ut=Ft[0],Bt=THREE.Math.isPowerOfTwo(Ut.width)&&THREE.Math.isPowerOfTwo(Ut.height),Vt=M(At.format),Ot=M(At.type);for(H(q.TEXTURE_CUBE_MAP,At,Bt),Dt=0;6>Dt;Dt++)if(Lt)for(var Nt,kt=Ft[Dt].mipmaps,zt=0,It=kt.length;It>zt;zt++)Nt=kt[zt],At.format!==THREE.RGBAFormat&&At.format!==THREE.RGBFormat?-1<Pe().indexOf(Vt)?q.compressedTexImage2D(q.TEXTURE_CUBE_MAP_POSITIVE_X+Dt,zt,Vt,Nt.width,Nt.height,0,Nt.data):THREE.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setCubeTexture()"):q.texImage2D(q.TEXTURE_CUBE_MAP_POSITIVE_X+Dt,zt,Vt,Nt.width,Nt.height,0,Vt,Ot,Nt.data);else Pt?q.texImage2D(q.TEXTURE_CUBE_MAP_POSITIVE_X+Dt,0,Vt,Ft[Dt].width,Ft[Dt].height,0,Vt,Ot,Ft[Dt].data):q.texImage2D(q.TEXTURE_CUBE_MAP_POSITIVE_X+Dt,0,Vt,Vt,Ot,Ft[Dt]);At.generateMipmaps&&Bt&&q.generateMipmap(q.TEXTURE_CUBE_MAP),At.needsUpdate=!1,At.onUpdate&&At.onUpdate()}else q.activeTexture(q.TEXTURE0+Ct),q.bindTexture(q.TEXTURE_CUBE_MAP,At.image.__webglTextureCube)}else if(Tt instanceof THREE.WebGLRenderTargetCube){var Gt=Tt;q.activeTexture(q.TEXTURE0+gt),q.bindTexture(q.TEXTURE_CUBE_MAP,Gt.__webglTexture)}else K.setTexture(Tt,gt);break;case"tv":for(void 0===xt._array&&(xt._array=[]),Mt=0,St=xt.value.length;St>Mt;Mt++)xt._array[Mt]=R();for(q.uniform1iv(_t,xt._array),Mt=0,St=xt.value.length;St>Mt;Mt++)Tt=xt.value[Mt],gt=xt._array[Mt],Tt&&K.setTexture(Tt,gt);break;default:THREE.warn("THREE.WebGLRenderer: Unknown uniform type: "+bt)}}}}return q.uniformMatrix4fv(ae.modelViewMatrix,!1,n._modelViewMatrix.elements),ae.normalMatrix&&q.uniformMatrix3fv(ae.normalMatrix,!1,n._normalMatrix.elements),null!==ae.modelMatrix&&q.uniformMatrix4fv(ae.modelMatrix,!1,n.matrixWorld.elements),oe}function g(e,t){e.ambientLightColor.needsUpdate=t,e.directionalLightColor.needsUpdate=t,e.directionalLightDirection.needsUpdate=t,e.pointLightColor.needsUpdate=t,e.pointLightPosition.needsUpdate=t,e.pointLightDistance.needsUpdate=t,e.pointLightDecay.needsUpdate=t,e.spotLightColor.needsUpdate=t,e.spotLightPosition.needsUpdate=t,e.spotLightDistance.needsUpdate=t,e.spotLightDirection.needsUpdate=t,e.spotLightAngleCos.needsUpdate=t,e.spotLightExponent.needsUpdate=t,e.spotLightDecay.needsUpdate=t,e.hemisphereLightSkyColor.needsUpdate=t,e.hemisphereLightGroundColor.needsUpdate=t,e.hemisphereLightDirection.needsUpdate=t}function R(){var e=re;return e>=He&&THREE.warn("WebGLRenderer: trying to use "+e+" texture units while this GPU supports only "+He),re+=1,e}function y(e,t){e._modelViewMatrix.multiplyMatrices(t.matrixWorldInverse,e.matrixWorld),e._normalMatrix.getNormalMatrix(e._modelViewMatrix)}function v(e,t,r,i){e[t]=r.r*i,e[t+1]=r.g*i,e[t+2]=r.b*i}function H(e,t,r){r?(q.texParameteri(e,q.TEXTURE_WRAP_S,M(t.wrapS)),q.texParameteri(e,q.TEXTURE_WRAP_T,M(t.wrapT)),q.texParameteri(e,q.TEXTURE_MAG_FILTER,M(t.magFilter)),q.texParameteri(e,q.TEXTURE_MIN_FILTER,M(t.minFilter))):(q.texParameteri(e,q.TEXTURE_WRAP_S,q.CLAMP_TO_EDGE),q.texParameteri(e,q.TEXTURE_WRAP_T,q.CLAMP_TO_EDGE),t.wrapS===THREE.ClampToEdgeWrapping&&t.wrapT===THREE.ClampToEdgeWrapping||THREE.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping. ( "+t.sourceFile+" )"),q.texParameteri(e,q.TEXTURE_MAG_FILTER,_(t.magFilter)),q.texParameteri(e,q.TEXTURE_MIN_FILTER,_(t.minFilter)),t.minFilter!==THREE.NearestFilter&&t.minFilter!==THREE.LinearFilter&&THREE.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter. ( "+t.sourceFile+" )")),(r=ge.get("EXT_texture_filter_anisotropic"))&&t.type!==THREE.FloatType&&t.type!==THREE.HalfFloatType&&(1<t.anisotropy||t.__currentAnisotropy)&&(q.texParameterf(e,r.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(t.anisotropy,K.getMaxAnisotropy())),t.__currentAnisotropy=t.anisotropy)}function x(e,t){if(e.width>t||e.height>t){var r=t/Math.max(e.width,e.height),i=document.createElement("canvas");return i.width=Math.floor(e.width*r),i.height=Math.floor(e.height*r),i.getContext("2d").drawImage(e,0,0,e.width,e.height,0,0,i.width,i.height),THREE.warn("THREE.WebGLRenderer: image is too big ("+e.width+"x"+e.height+"). Resized to "+i.width+"x"+i.height,e),i}return e}function b(e,t){q.bindRenderbuffer(q.RENDERBUFFER,e),t.depthBuffer&&!t.stencilBuffer?(q.renderbufferStorage(q.RENDERBUFFER,q.DEPTH_COMPONENT16,t.width,t.height),q.framebufferRenderbuffer(q.FRAMEBUFFER,q.DEPTH_ATTACHMENT,q.RENDERBUFFER,e)):t.depthBuffer&&t.stencilBuffer?(q.renderbufferStorage(q.RENDERBUFFER,q.DEPTH_STENCIL,t.width,t.height),q.framebufferRenderbuffer(q.FRAMEBUFFER,q.DEPTH_STENCIL_ATTACHMENT,q.RENDERBUFFER,e)):q.renderbufferStorage(q.RENDERBUFFER,q.RGBA4,t.width,t.height)}function w(e){e instanceof THREE.WebGLRenderTargetCube?(q.bindTexture(q.TEXTURE_CUBE_MAP,e.__webglTexture),q.generateMipmap(q.TEXTURE_CUBE_MAP),q.bindTexture(q.TEXTURE_CUBE_MAP,null)):(q.bindTexture(q.TEXTURE_2D,e.__webglTexture),q.generateMipmap(q.TEXTURE_2D),q.bindTexture(q.TEXTURE_2D,null))}function _(e){return e===THREE.NearestFilter||e===THREE.NearestMipMapNearestFilter||e===THREE.NearestMipMapLinearFilter?q.NEAREST:q.LINEAR}function M(e){var t;if(e===THREE.RepeatWrapping)return q.REPEAT;if(e===THREE.ClampToEdgeWrapping)return q.CLAMP_TO_EDGE;if(e===THREE.MirroredRepeatWrapping)return q.MIRRORED_REPEAT;if(e===THREE.NearestFilter)return q.NEAREST;if(e===THREE.NearestMipMapNearestFilter)return q.NEAREST_MIPMAP_NEAREST;if(e===THREE.NearestMipMapLinearFilter)return q.NEAREST_MIPMAP_LINEAR;if(e===THREE.LinearFilter)return q.LINEAR;if(e===THREE.LinearMipMapNearestFilter)return q.LINEAR_MIPMAP_NEAREST;if(e===THREE.LinearMipMapLinearFilter)return q.LINEAR_MIPMAP_LINEAR;if(e===THREE.UnsignedByteType)return q.UNSIGNED_BYTE;if(e===THREE.UnsignedShort4444Type)return q.UNSIGNED_SHORT_4_4_4_4;if(e===THREE.UnsignedShort5551Type)return q.UNSIGNED_SHORT_5_5_5_1;if(e===THREE.UnsignedShort565Type)return q.UNSIGNED_SHORT_5_6_5;if(e===THREE.ByteType)return q.BYTE;if(e===THREE.ShortType)return q.SHORT;if(e===THREE.UnsignedShortType)return q.UNSIGNED_SHORT;if(e===THREE.IntType)return q.INT;if(e===THREE.UnsignedIntType)return q.UNSIGNED_INT;if(e===THREE.FloatType)return q.FLOAT;if(t=ge.get("OES_texture_half_float"),null!==t&&e===THREE.HalfFloatType)return t.HALF_FLOAT_OES;if(e===THREE.AlphaFormat)return q.ALPHA;if(e===THREE.RGBFormat)return q.RGB;if(e===THREE.RGBAFormat)return q.RGBA;if(e===THREE.LuminanceFormat)return q.LUMINANCE;if(e===THREE.LuminanceAlphaFormat)return q.LUMINANCE_ALPHA;if(e===THREE.AddEquation)return q.FUNC_ADD;if(e===THREE.SubtractEquation)return q.FUNC_SUBTRACT;if(e===THREE.ReverseSubtractEquation)return q.FUNC_REVERSE_SUBTRACT;if(e===THREE.ZeroFactor)return q.ZERO;if(e===THREE.OneFactor)return q.ONE;if(e===THREE.SrcColorFactor)return q.SRC_COLOR;if(e===THREE.OneMinusSrcColorFactor)return q.ONE_MINUS_SRC_COLOR;if(e===THREE.SrcAlphaFactor)return q.SRC_ALPHA;if(e===THREE.OneMinusSrcAlphaFactor)return q.ONE_MINUS_SRC_ALPHA;if(e===THREE.DstAlphaFactor)return q.DST_ALPHA;if(e===THREE.OneMinusDstAlphaFactor)return q.ONE_MINUS_DST_ALPHA;if(e===THREE.DstColorFactor)return q.DST_COLOR;if(e===THREE.OneMinusDstColorFactor)return q.ONE_MINUS_DST_COLOR;if(e===THREE.SrcAlphaSaturateFactor)return q.SRC_ALPHA_SATURATE;if(t=ge.get("WEBGL_compressed_texture_s3tc"),null!==t){if(e===THREE.RGB_S3TC_DXT1_Format)return t.COMPRESSED_RGB_S3TC_DXT1_EXT;if(e===THREE.RGBA_S3TC_DXT1_Format)return t.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(e===THREE.RGBA_S3TC_DXT3_Format)return t.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(e===THREE.RGBA_S3TC_DXT5_Format)return t.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(t=ge.get("WEBGL_compressed_texture_pvrtc"),null!==t){if(e===THREE.RGB_PVRTC_4BPPV1_Format)return t.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(e===THREE.RGB_PVRTC_2BPPV1_Format)return t.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(e===THREE.RGBA_PVRTC_4BPPV1_Format)return t.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(e===THREE.RGBA_PVRTC_2BPPV1_Format)return t.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(t=ge.get("EXT_blend_minmax"),null!==t){if(e===THREE.MinEquation)return t.MIN_EXT;if(e===THREE.MaxEquation)return t.MAX_EXT}return 0}console.log("THREE.WebGLRenderer",THREE.REVISION),e=e||{};var S=void 0!==e.canvas?e.canvas:document.createElement("canvas"),A=void 0!==e.context?e.context:null,C=1,L=void 0!==e.precision?e.precision:"highp",P=void 0!==e.alpha?e.alpha:!1,F=void 0!==e.depth?e.depth:!0,D=void 0!==e.stencil?e.stencil:!0,U=void 0!==e.antialias?e.antialias:!1,B=void 0!==e.premultipliedAlpha?e.premultipliedAlpha:!0,V=void 0!==e.preserveDrawingBuffer?e.preserveDrawingBuffer:!1,O=void 0!==e.logarithmicDepthBuffer?e.logarithmicDepthBuffer:!1,N=new THREE.Color(0),k=0,z=[],I={},G=[],W=[],j=[],X=[],Y=[];this.domElement=S,this.context=null,this.sortObjects=this.autoClearStencil=this.autoClearDepth=this.autoClearColor=this.autoClear=!0,this.gammaFactor=2,this.shadowMapEnabled=this.gammaOutput=this.gammaInput=!1,this.shadowMapType=THREE.PCFShadowMap,this.shadowMapCullFace=THREE.CullFaceFront,this.shadowMapCascade=this.shadowMapDebug=!1,this.maxMorphTargets=8,this.maxMorphNormals=4,this.autoScaleCubemaps=!0,this.info={memory:{programs:0,geometries:0,textures:0},render:{calls:0,vertices:0,faces:0,points:0}};var q,K=this,Z=[],Q=null,J=null,$=-1,ee="",te=null,re=0,ie=0,ne=0,oe=S.width,ae=S.height,se=0,he=0,ce=new THREE.Frustum,le=new THREE.Matrix4,ue=new THREE.Vector3,Ee=new THREE.Vector3,pe=!0,de={ambient:[0,0,0],directional:{length:0,colors:[],positions:[]},point:{length:0,colors:[],positions:[],distances:[],decays:[]},spot:{length:0,colors:[],positions:[],distances:[],directions:[],anglesCos:[],exponents:[],decays:[]},hemi:{length:0,skyColors:[],groundColors:[],positions:[]}};try{var fe={alpha:P,depth:F,stencil:D,antialias:U,premultipliedAlpha:B,preserveDrawingBuffer:V};if(q=A||S.getContext("webgl",fe)||S.getContext("experimental-webgl",fe),null===q){if(null!==S.getContext("webgl"))throw"Error creating WebGL context with your selected attributes.";throw"Error creating WebGL context."}S.addEventListener("webglcontextlost",function(e){e.preventDefault(),ve(),ye(),I={}},!1)}catch(me){THREE.error("THREE.WebGLRenderer: "+me)}var Te=new THREE.WebGLState(q,M);void 0===q.getShaderPrecisionFormat&&(q.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}});var ge=new THREE.WebGLExtensions(q);ge.get("OES_texture_float"),ge.get("OES_texture_float_linear"),ge.get("OES_texture_half_float"),ge.get("OES_texture_half_float_linear"),ge.get("OES_standard_derivatives"),O&&ge.get("EXT_frag_depth");var Re=function(e,t,r,i){!0===B&&(e*=i,t*=i,r*=i),q.clearColor(e,t,r,i)},ye=function(){q.clearColor(0,0,0,1),q.clearDepth(1),q.clearStencil(0),q.enable(q.DEPTH_TEST),q.depthFunc(q.LEQUAL),q.frontFace(q.CCW),q.cullFace(q.BACK),q.enable(q.CULL_FACE),q.enable(q.BLEND),q.blendEquation(q.FUNC_ADD),q.blendFunc(q.SRC_ALPHA,q.ONE_MINUS_SRC_ALPHA),q.viewport(ie,ne,oe,ae),Re(N.r,N.g,N.b,k)},ve=function(){te=Q=null,ee="",$=-1,pe=!0,Te.reset()};ye(),this.context=q,this.state=Te;var He=q.getParameter(q.MAX_TEXTURE_IMAGE_UNITS),xe=q.getParameter(q.MAX_VERTEX_TEXTURE_IMAGE_UNITS),be=q.getParameter(q.MAX_TEXTURE_SIZE),we=q.getParameter(q.MAX_CUBE_MAP_TEXTURE_SIZE),_e=xe>0,Me=_e&&ge.get("OES_texture_float"),Se=q.getShaderPrecisionFormat(q.VERTEX_SHADER,q.HIGH_FLOAT),Ae=q.getShaderPrecisionFormat(q.VERTEX_SHADER,q.MEDIUM_FLOAT),Ce=q.getShaderPrecisionFormat(q.FRAGMENT_SHADER,q.HIGH_FLOAT),Le=q.getShaderPrecisionFormat(q.FRAGMENT_SHADER,q.MEDIUM_FLOAT),Pe=function(){var e;return function(){if(void 0!==e)return e;if(e=[],ge.get("WEBGL_compressed_texture_pvrtc")||ge.get("WEBGL_compressed_texture_s3tc"))for(var t=q.getParameter(q.COMPRESSED_TEXTURE_FORMATS),r=0;r<t.length;r++)e.push(t[r]);return e}}(),Fe=0<Se.precision&&0<Ce.precision,De=0<Ae.precision&&0<Le.precision;"highp"!==L||Fe||(De?(L="mediump",THREE.warn("THREE.WebGLRenderer: highp not supported, using mediump.")):(L="lowp",THREE.warn("THREE.WebGLRenderer: highp and mediump not supported, using lowp."))),"mediump"!==L||De||(L="lowp",THREE.warn("THREE.WebGLRenderer: mediump not supported, using lowp."));var Ue=new THREE.ShadowMapPlugin(this,z,I,G),Be=new THREE.SpritePlugin(this,X),Ve=new THREE.LensFlarePlugin(this,Y);this.getContext=function(){return q},this.forceContextLoss=function(){ge.get("WEBGL_lose_context").loseContext()},this.supportsVertexTextures=function(){return _e},this.supportsFloatTextures=function(){return ge.get("OES_texture_float")},this.supportsHalfFloatTextures=function(){return ge.get("OES_texture_half_float")},this.supportsStandardDerivatives=function(){return ge.get("OES_standard_derivatives")},this.supportsCompressedTextureS3TC=function(){return ge.get("WEBGL_compressed_texture_s3tc")},this.supportsCompressedTexturePVRTC=function(){return ge.get("WEBGL_compressed_texture_pvrtc")},this.supportsBlendMinMax=function(){return ge.get("EXT_blend_minmax")},this.getMaxAnisotropy=function(){var e;return function(){if(void 0!==e)return e;var t=ge.get("EXT_texture_filter_anisotropic");return e=null!==t?q.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT):0}}(),this.getPrecision=function(){return L},this.getPixelRatio=function(){return C},this.setPixelRatio=function(e){C=e},this.setSize=function(e,t,r){S.width=e*C,S.height=t*C,!1!==r&&(S.style.width=e+"px",S.style.height=t+"px"),this.setViewport(0,0,e,t)},this.setViewport=function(e,t,r,i){ie=e*C,ne=t*C,oe=r*C,ae=i*C,q.viewport(ie,ne,oe,ae)},this.setScissor=function(e,t,r,i){q.scissor(e*C,t*C,r*C,i*C)},this.enableScissorTest=function(e){e?q.enable(q.SCISSOR_TEST):q.disable(q.SCISSOR_TEST)},this.getClearColor=function(){return N},this.setClearColor=function(e,t){N.set(e),k=void 0!==t?t:1,Re(N.r,N.g,N.b,k)},this.getClearAlpha=function(){return k},this.setClearAlpha=function(e){k=e,Re(N.r,N.g,N.b,k)},this.clear=function(e,t,r){var i=0;(void 0===e||e)&&(i|=q.COLOR_BUFFER_BIT),(void 0===t||t)&&(i|=q.DEPTH_BUFFER_BIT),(void 0===r||r)&&(i|=q.STENCIL_BUFFER_BIT),q.clear(i)},this.clearColor=function(){q.clear(q.COLOR_BUFFER_BIT)},this.clearDepth=function(){q.clear(q.DEPTH_BUFFER_BIT)},this.clearStencil=function(){q.clear(q.STENCIL_BUFFER_BIT)},this.clearTarget=function(e,t,r,i){this.setRenderTarget(e),this.clear(t,r,i)},this.resetGLState=ve;var Oe=function(e){e.target.traverse(function(e){if(e.removeEventListener("remove",Oe),e instanceof THREE.Mesh||e instanceof THREE.PointCloud||e instanceof THREE.Line)delete I[e.id];else if(e instanceof THREE.ImmediateRenderObject||e.immediateRenderCallback)for(var t=G,r=t.length-1;r>=0;r--)t[r].object===e&&t.splice(r,1);delete e.__webglInit,delete e._modelViewMatrix,delete e._normalMatrix,delete e.__webglActive})},Ne=function(e){if(e=e.target,e.removeEventListener("dispose",Ne),delete e.__webglInit,e instanceof THREE.BufferGeometry){for(var t in e.attributes){var r=e.attributes[t];void 0!==r.buffer&&(q.deleteBuffer(r.buffer),delete r.buffer)}K.info.memory.geometries--}else if(t=je[e.id],void 0!==t){for(var r=0,i=t.length;i>r;r++){var n=t[r];if(void 0!==n.numMorphTargets){for(var o=0,a=n.numMorphTargets;a>o;o++)q.deleteBuffer(n.__webglMorphTargetsBuffers[o]);delete n.__webglMorphTargetsBuffers}if(void 0!==n.numMorphNormals){for(o=0,a=n.numMorphNormals;a>o;o++)q.deleteBuffer(n.__webglMorphNormalsBuffers[o]);delete n.__webglMorphNormalsBuffers}Ge(n)}delete je[e.id]}else Ge(e);ee=""},ke=function(e){e=e.target,e.removeEventListener("dispose",ke),e.image&&e.image.__webglTextureCube?(q.deleteTexture(e.image.__webglTextureCube),delete e.image.__webglTextureCube):void 0!==e.__webglInit&&(q.deleteTexture(e.__webglTexture),delete e.__webglTexture,delete e.__webglInit),K.info.memory.textures--},ze=function(e){if(e=e.target,e.removeEventListener("dispose",ze),e&&void 0!==e.__webglTexture){if(q.deleteTexture(e.__webglTexture),delete e.__webglTexture,e instanceof THREE.WebGLRenderTargetCube)for(var t=0;6>t;t++)q.deleteFramebuffer(e.__webglFramebuffer[t]),q.deleteRenderbuffer(e.__webglRenderbuffer[t]);else q.deleteFramebuffer(e.__webglFramebuffer),q.deleteRenderbuffer(e.__webglRenderbuffer);delete e.__webglFramebuffer,delete e.__webglRenderbuffer}K.info.memory.textures--},Ie=function(e){e=e.target,e.removeEventListener("dispose",Ie),We(e)},Ge=function(e){for(var t="__webglVertexBuffer __webglNormalBuffer __webglTangentBuffer __webglColorBuffer __webglUVBuffer __webglUV2Buffer __webglSkinIndicesBuffer __webglSkinWeightsBuffer __webglFaceBuffer __webglLineBuffer __webglLineDistanceBuffer".split(" "),r=0,i=t.length;i>r;r++){var n=t[r];void 0!==e[n]&&(q.deleteBuffer(e[n]),delete e[n])}if(void 0!==e.__webglCustomAttributesList){for(n in e.__webglCustomAttributesList)q.deleteBuffer(e.__webglCustomAttributesList[n].buffer);delete e.__webglCustomAttributesList}K.info.memory.geometries--},We=function(e){var t=e.program.program;if(void 0!==t){e.program=void 0;var r,i,n=!1;for(e=0,r=Z.length;r>e;e++)if(i=Z[e],i.program===t){i.usedTimes--,0===i.usedTimes&&(n=!0);break}if(!0===n){for(n=[],e=0,r=Z.length;r>e;e++)i=Z[e],i.program!==t&&n.push(i);Z=n,q.deleteProgram(t),K.info.memory.programs--}}};this.renderBufferImmediate=function(e,t,r){if(Te.initAttributes(),e.hasPositions&&!e.__webglVertexBuffer&&(e.__webglVertexBuffer=q.createBuffer()),e.hasNormals&&!e.__webglNormalBuffer&&(e.__webglNormalBuffer=q.createBuffer()),e.hasUvs&&!e.__webglUvBuffer&&(e.__webglUvBuffer=q.createBuffer()),e.hasColors&&!e.__webglColorBuffer&&(e.__webglColorBuffer=q.createBuffer()),e.hasPositions&&(q.bindBuffer(q.ARRAY_BUFFER,e.__webglVertexBuffer),q.bufferData(q.ARRAY_BUFFER,e.positionArray,q.DYNAMIC_DRAW),Te.enableAttribute(t.attributes.position),q.vertexAttribPointer(t.attributes.position,3,q.FLOAT,!1,0,0)),e.hasNormals){if(q.bindBuffer(q.ARRAY_BUFFER,e.__webglNormalBuffer),!1==r instanceof THREE.MeshPhongMaterial&&r.shading===THREE.FlatShading){var i,n,o,a,s,h,c,l,u,E,p,d=3*e.count;for(p=0;d>p;p+=9)E=e.normalArray,i=E[p],n=E[p+1],o=E[p+2],a=E[p+3],h=E[p+4],l=E[p+5],s=E[p+6],c=E[p+7],u=E[p+8],i=(i+a+s)/3,n=(n+h+c)/3,o=(o+l+u)/3,E[p]=i,E[p+1]=n,E[p+2]=o,E[p+3]=i,E[p+4]=n,E[p+5]=o,E[p+6]=i,E[p+7]=n,E[p+8]=o}q.bufferData(q.ARRAY_BUFFER,e.normalArray,q.DYNAMIC_DRAW),Te.enableAttribute(t.attributes.normal),q.vertexAttribPointer(t.attributes.normal,3,q.FLOAT,!1,0,0)}e.hasUvs&&r.map&&(q.bindBuffer(q.ARRAY_BUFFER,e.__webglUvBuffer),q.bufferData(q.ARRAY_BUFFER,e.uvArray,q.DYNAMIC_DRAW),Te.enableAttribute(t.attributes.uv),q.vertexAttribPointer(t.attributes.uv,2,q.FLOAT,!1,0,0)),e.hasColors&&r.vertexColors!==THREE.NoColors&&(q.bindBuffer(q.ARRAY_BUFFER,e.__webglColorBuffer),q.bufferData(q.ARRAY_BUFFER,e.colorArray,q.DYNAMIC_DRAW),Te.enableAttribute(t.attributes.color),q.vertexAttribPointer(t.attributes.color,3,q.FLOAT,!1,0,0)),Te.disableUnusedAttributes(),q.drawArrays(q.TRIANGLES,0,e.count),e.count=0},this.renderBufferDirect=function(e,t,r,n,o,a){if(!1!==n.visible)if(p(a),e=T(e,t,r,n,a),t=!1,r="direct_"+o.id+"_"+e.id+"_"+(n.wireframe?1:0),r!==ee&&(ee=r,t=!0),t&&Te.initAttributes(),a instanceof THREE.Mesh){a=!0===n.wireframe?q.LINES:q.TRIANGLES;var s=o.attributes.index;if(s){var h,c;if(s.array instanceof Uint32Array&&ge.get("OES_element_index_uint")?(h=q.UNSIGNED_INT,c=4):(h=q.UNSIGNED_SHORT,c=2),r=o.offsets,0===r.length)t&&(i(n,e,o,0),q.bindBuffer(q.ELEMENT_ARRAY_BUFFER,s.buffer)),q.drawElements(a,s.array.length,h,0),K.info.render.calls++,K.info.render.vertices+=s.array.length,K.info.render.faces+=s.array.length/3;else{t=!0;for(var l=0,u=r.length;u>l;l++){var E=r[l].index;t&&(i(n,e,o,E),q.bindBuffer(q.ELEMENT_ARRAY_BUFFER,s.buffer)),q.drawElements(a,r[l].count,h,r[l].start*c),K.info.render.calls++,K.info.render.vertices+=r[l].count,K.info.render.faces+=r[l].count/3}}}else t&&i(n,e,o,0),n=o.attributes.position,q.drawArrays(a,0,n.array.length/n.itemSize),K.info.render.calls++,K.info.render.vertices+=n.array.length/n.itemSize,K.info.render.faces+=n.array.length/(3*n.itemSize)}else if(a instanceof THREE.PointCloud)if(a=q.POINTS,s=o.attributes.index)if(s.array instanceof Uint32Array&&ge.get("OES_element_index_uint")?(h=q.UNSIGNED_INT,c=4):(h=q.UNSIGNED_SHORT,c=2),r=o.offsets,0===r.length)t&&(i(n,e,o,0),q.bindBuffer(q.ELEMENT_ARRAY_BUFFER,s.buffer)),q.drawElements(a,s.array.length,h,0),K.info.render.calls++,K.info.render.points+=s.array.length;else for(1<r.length&&(t=!0),l=0,u=r.length;u>l;l++)E=r[l].index,t&&(i(n,e,o,E),q.bindBuffer(q.ELEMENT_ARRAY_BUFFER,s.buffer)),q.drawElements(a,r[l].count,h,r[l].start*c),K.info.render.calls++,K.info.render.points+=r[l].count;else if(t&&i(n,e,o,0),n=o.attributes.position,r=o.offsets,0===r.length)q.drawArrays(a,0,n.array.length/3),K.info.render.calls++,K.info.render.points+=n.array.length/3;else for(l=0,u=r.length;u>l;l++)q.drawArrays(a,r[l].index,r[l].count),K.info.render.calls++,K.info.render.points+=r[l].count;else if(a instanceof THREE.Line)if(a=a.mode===THREE.LineStrip?q.LINE_STRIP:q.LINES,Te.setLineWidth(n.linewidth*C),s=o.attributes.index)if(s.array instanceof Uint32Array?(h=q.UNSIGNED_INT,c=4):(h=q.UNSIGNED_SHORT,c=2),r=o.offsets,0===r.length)t&&(i(n,e,o,0),q.bindBuffer(q.ELEMENT_ARRAY_BUFFER,s.buffer)),q.drawElements(a,s.array.length,h,0),K.info.render.calls++,K.info.render.vertices+=s.array.length;else for(1<r.length&&(t=!0),l=0,u=r.length;u>l;l++)E=r[l].index,t&&(i(n,e,o,E),q.bindBuffer(q.ELEMENT_ARRAY_BUFFER,s.buffer)),q.drawElements(a,r[l].count,h,r[l].start*c),K.info.render.calls++,K.info.render.vertices+=r[l].count;else if(t&&i(n,e,o,0),n=o.attributes.position,r=o.offsets,0===r.length)q.drawArrays(a,0,n.array.length/3),K.info.render.calls++,K.info.render.vertices+=n.array.length/3;else for(l=0,u=r.length;u>l;l++)q.drawArrays(a,r[l].index,r[l].count),K.info.render.calls++,K.info.render.vertices+=r[l].count},this.renderBuffer=function(e,t,r,i,n,o){if(!1!==i.visible){if(p(o),r=T(e,t,r,i,o),t=r.attributes,e=!1,r=n.id+"_"+r.id+"_"+(i.wireframe?1:0),r!==ee&&(ee=r,e=!0),e&&Te.initAttributes(),!i.morphTargets&&0<=t.position)e&&(q.bindBuffer(q.ARRAY_BUFFER,n.__webglVertexBuffer),
	Te.enableAttribute(t.position),q.vertexAttribPointer(t.position,3,q.FLOAT,!1,0,0));else if(o.morphTargetBase){if(r=i.program.attributes,-1!==o.morphTargetBase&&0<=r.position?(q.bindBuffer(q.ARRAY_BUFFER,n.__webglMorphTargetsBuffers[o.morphTargetBase]),Te.enableAttribute(r.position),q.vertexAttribPointer(r.position,3,q.FLOAT,!1,0,0)):0<=r.position&&(q.bindBuffer(q.ARRAY_BUFFER,n.__webglVertexBuffer),Te.enableAttribute(r.position),q.vertexAttribPointer(r.position,3,q.FLOAT,!1,0,0)),o.morphTargetForcedOrder.length)for(var s,h=0,c=o.morphTargetForcedOrder,l=o.morphTargetInfluences;h<i.numSupportedMorphTargets&&h<c.length;)s=r["morphTarget"+h],s>=0&&(q.bindBuffer(q.ARRAY_BUFFER,n.__webglMorphTargetsBuffers[c[h]]),Te.enableAttribute(s),q.vertexAttribPointer(s,3,q.FLOAT,!1,0,0)),s=r["morphNormal"+h],s>=0&&i.morphNormals&&(q.bindBuffer(q.ARRAY_BUFFER,n.__webglMorphNormalsBuffers[c[h]]),Te.enableAttribute(s),q.vertexAttribPointer(s,3,q.FLOAT,!1,0,0)),o.__webglMorphTargetInfluences[h]=l[c[h]],h++;else{for(c=[],l=o.morphTargetInfluences,h=o.geometry.morphTargets,l.length>h.length&&(console.warn("THREE.WebGLRenderer: Influences array is bigger than morphTargets array."),l.length=h.length),h=0,s=l.length;s>h;h++)c.push([l[h],h]);c.length>i.numSupportedMorphTargets?(c.sort(a),c.length=i.numSupportedMorphTargets):c.length>i.numSupportedMorphNormals?c.sort(a):0===c.length&&c.push([0,0]);for(var h=0,u=i.numSupportedMorphTargets;u>h;h++)if(c[h]){var E=c[h][1];s=r["morphTarget"+h],s>=0&&(q.bindBuffer(q.ARRAY_BUFFER,n.__webglMorphTargetsBuffers[E]),Te.enableAttribute(s),q.vertexAttribPointer(s,3,q.FLOAT,!1,0,0)),s=r["morphNormal"+h],s>=0&&i.morphNormals&&(q.bindBuffer(q.ARRAY_BUFFER,n.__webglMorphNormalsBuffers[E]),Te.enableAttribute(s),q.vertexAttribPointer(s,3,q.FLOAT,!1,0,0)),o.__webglMorphTargetInfluences[h]=l[E]}else o.__webglMorphTargetInfluences[h]=0}null!==i.program.uniforms.morphTargetInfluences&&q.uniform1fv(i.program.uniforms.morphTargetInfluences,o.__webglMorphTargetInfluences)}if(e){if(n.__webglCustomAttributesList)for(r=0,l=n.__webglCustomAttributesList.length;l>r;r++)c=n.__webglCustomAttributesList[r],0<=t[c.buffer.belongsToAttribute]&&(q.bindBuffer(q.ARRAY_BUFFER,c.buffer),Te.enableAttribute(t[c.buffer.belongsToAttribute]),q.vertexAttribPointer(t[c.buffer.belongsToAttribute],c.size,q.FLOAT,!1,0,0));0<=t.color&&(0<o.geometry.colors.length||0<o.geometry.faces.length?(q.bindBuffer(q.ARRAY_BUFFER,n.__webglColorBuffer),Te.enableAttribute(t.color),q.vertexAttribPointer(t.color,3,q.FLOAT,!1,0,0)):void 0!==i.defaultAttributeValues&&q.vertexAttrib3fv(t.color,i.defaultAttributeValues.color)),0<=t.normal&&(q.bindBuffer(q.ARRAY_BUFFER,n.__webglNormalBuffer),Te.enableAttribute(t.normal),q.vertexAttribPointer(t.normal,3,q.FLOAT,!1,0,0)),0<=t.tangent&&(q.bindBuffer(q.ARRAY_BUFFER,n.__webglTangentBuffer),Te.enableAttribute(t.tangent),q.vertexAttribPointer(t.tangent,4,q.FLOAT,!1,0,0)),0<=t.uv&&(o.geometry.faceVertexUvs[0]?(q.bindBuffer(q.ARRAY_BUFFER,n.__webglUVBuffer),Te.enableAttribute(t.uv),q.vertexAttribPointer(t.uv,2,q.FLOAT,!1,0,0)):void 0!==i.defaultAttributeValues&&q.vertexAttrib2fv(t.uv,i.defaultAttributeValues.uv)),0<=t.uv2&&(o.geometry.faceVertexUvs[1]?(q.bindBuffer(q.ARRAY_BUFFER,n.__webglUV2Buffer),Te.enableAttribute(t.uv2),q.vertexAttribPointer(t.uv2,2,q.FLOAT,!1,0,0)):void 0!==i.defaultAttributeValues&&q.vertexAttrib2fv(t.uv2,i.defaultAttributeValues.uv2)),i.skinning&&0<=t.skinIndex&&0<=t.skinWeight&&(q.bindBuffer(q.ARRAY_BUFFER,n.__webglSkinIndicesBuffer),Te.enableAttribute(t.skinIndex),q.vertexAttribPointer(t.skinIndex,4,q.FLOAT,!1,0,0),q.bindBuffer(q.ARRAY_BUFFER,n.__webglSkinWeightsBuffer),Te.enableAttribute(t.skinWeight),q.vertexAttribPointer(t.skinWeight,4,q.FLOAT,!1,0,0)),0<=t.lineDistance&&(q.bindBuffer(q.ARRAY_BUFFER,n.__webglLineDistanceBuffer),Te.enableAttribute(t.lineDistance),q.vertexAttribPointer(t.lineDistance,1,q.FLOAT,!1,0,0))}Te.disableUnusedAttributes(),o instanceof THREE.Mesh?(o=n.__typeArray===Uint32Array?q.UNSIGNED_INT:q.UNSIGNED_SHORT,i.wireframe?(Te.setLineWidth(i.wireframeLinewidth*C),e&&q.bindBuffer(q.ELEMENT_ARRAY_BUFFER,n.__webglLineBuffer),q.drawElements(q.LINES,n.__webglLineCount,o,0)):(e&&q.bindBuffer(q.ELEMENT_ARRAY_BUFFER,n.__webglFaceBuffer),q.drawElements(q.TRIANGLES,n.__webglFaceCount,o,0)),K.info.render.calls++,K.info.render.vertices+=n.__webglFaceCount,K.info.render.faces+=n.__webglFaceCount/3):o instanceof THREE.Line?(o=o.mode===THREE.LineStrip?q.LINE_STRIP:q.LINES,Te.setLineWidth(i.linewidth*C),q.drawArrays(o,0,n.__webglLineCount),K.info.render.calls++):o instanceof THREE.PointCloud&&(q.drawArrays(q.POINTS,0,n.__webglParticleCount),K.info.render.calls++,K.info.render.points+=n.__webglParticleCount)}},this.render=function(e,t,r,i){if(!1==t instanceof THREE.Camera)THREE.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");else{var a=e.fog;ee="",$=-1,te=null,pe=!0,!0===e.autoUpdate&&e.updateMatrixWorld(),void 0===t.parent&&t.updateMatrixWorld(),e.traverse(function(e){e instanceof THREE.SkinnedMesh&&e.skeleton.update()}),t.matrixWorldInverse.getInverse(t.matrixWorld),le.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ce.setFromMatrix(le),z.length=0,W.length=0,j.length=0,X.length=0,Y.length=0,s(e),!0===K.sortObjects&&(W.sort(n),j.sort(o)),Ue.render(e,t),K.info.render.calls=0,K.info.render.vertices=0,K.info.render.faces=0,K.info.render.points=0,this.setRenderTarget(r),(this.autoClear||i)&&this.clear(this.autoClearColor,this.autoClearDepth,this.autoClearStencil),i=0;for(var u=G.length;u>i;i++){var E=G[i],p=E.object;p.visible&&(y(p,t),l(E))}e.overrideMaterial?(i=e.overrideMaterial,m(i),h(W,t,z,a,i),h(j,t,z,a,i),c(G,"",t,z,a,i)):(Te.setBlending(THREE.NoBlending),h(W,t,z,a,null),c(G,"opaque",t,z,a,null),h(j,t,z,a,null),c(G,"transparent",t,z,a,null)),Be.render(e,t),Ve.render(e,t,se,he),r&&r.generateMipmaps&&r.minFilter!==THREE.NearestFilter&&r.minFilter!==THREE.LinearFilter&&w(r),Te.setDepthTest(!0),Te.setDepthWrite(!0),Te.setColorWrite(!0)}},this.renderImmediateObject=function(e,t,r,i,n){var o=T(e,t,r,i,n);ee="",K.setMaterialFaces(i),n.immediateRenderCallback?n.immediateRenderCallback(o,q,ce):n.render(function(e){K.renderBufferImmediate(e,o,i)})};var je={},Xe=0,Ye={MeshDepthMaterial:"depth",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointCloudMaterial:"particle_basic"};this.setFaceCulling=function(e,t){e===THREE.CullFaceNone?q.disable(q.CULL_FACE):(q.frontFace(t===THREE.FrontFaceDirectionCW?q.CW:q.CCW),q.cullFace(e===THREE.CullFaceBack?q.BACK:e===THREE.CullFaceFront?q.FRONT:q.FRONT_AND_BACK),q.enable(q.CULL_FACE))},this.setMaterialFaces=function(e){Te.setDoubleSided(e.side===THREE.DoubleSide),Te.setFlipSided(e.side===THREE.BackSide)},this.uploadTexture=function(e){void 0===e.__webglInit&&(e.__webglInit=!0,e.addEventListener("dispose",ke),e.__webglTexture=q.createTexture(),K.info.memory.textures++),q.bindTexture(q.TEXTURE_2D,e.__webglTexture),q.pixelStorei(q.UNPACK_FLIP_Y_WEBGL,e.flipY),q.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,e.premultiplyAlpha),q.pixelStorei(q.UNPACK_ALIGNMENT,e.unpackAlignment),e.image=x(e.image,be);var t=e.image,r=THREE.Math.isPowerOfTwo(t.width)&&THREE.Math.isPowerOfTwo(t.height),i=M(e.format),n=M(e.type);H(q.TEXTURE_2D,e,r);var o=e.mipmaps;if(e instanceof THREE.DataTexture)if(0<o.length&&r){for(var a=0,s=o.length;s>a;a++)t=o[a],q.texImage2D(q.TEXTURE_2D,a,i,t.width,t.height,0,i,n,t.data);e.generateMipmaps=!1}else q.texImage2D(q.TEXTURE_2D,0,i,t.width,t.height,0,i,n,t.data);else if(e instanceof THREE.CompressedTexture)for(a=0,s=o.length;s>a;a++)t=o[a],e.format!==THREE.RGBAFormat&&e.format!==THREE.RGBFormat?-1<Pe().indexOf(i)?q.compressedTexImage2D(q.TEXTURE_2D,a,i,t.width,t.height,0,t.data):THREE.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):q.texImage2D(q.TEXTURE_2D,a,i,t.width,t.height,0,i,n,t.data);else if(0<o.length&&r){for(a=0,s=o.length;s>a;a++)t=o[a],q.texImage2D(q.TEXTURE_2D,a,i,i,n,t);e.generateMipmaps=!1}else q.texImage2D(q.TEXTURE_2D,0,i,i,n,e.image);e.generateMipmaps&&r&&q.generateMipmap(q.TEXTURE_2D),e.needsUpdate=!1,e.onUpdate&&e.onUpdate()},this.setTexture=function(e,t){q.activeTexture(q.TEXTURE0+t),e.needsUpdate?K.uploadTexture(e):q.bindTexture(q.TEXTURE_2D,e.__webglTexture)},this.setRenderTarget=function(e){var t=e instanceof THREE.WebGLRenderTargetCube;if(e&&void 0===e.__webglFramebuffer){void 0===e.depthBuffer&&(e.depthBuffer=!0),void 0===e.stencilBuffer&&(e.stencilBuffer=!0),e.addEventListener("dispose",ze),e.__webglTexture=q.createTexture(),K.info.memory.textures++;var r=THREE.Math.isPowerOfTwo(e.width)&&THREE.Math.isPowerOfTwo(e.height),i=M(e.format),n=M(e.type);if(t){e.__webglFramebuffer=[],e.__webglRenderbuffer=[],q.bindTexture(q.TEXTURE_CUBE_MAP,e.__webglTexture),H(q.TEXTURE_CUBE_MAP,e,r);for(var o=0;6>o;o++){e.__webglFramebuffer[o]=q.createFramebuffer(),e.__webglRenderbuffer[o]=q.createRenderbuffer(),q.texImage2D(q.TEXTURE_CUBE_MAP_POSITIVE_X+o,0,i,e.width,e.height,0,i,n,null);var a=e,s=q.TEXTURE_CUBE_MAP_POSITIVE_X+o;q.bindFramebuffer(q.FRAMEBUFFER,e.__webglFramebuffer[o]),q.framebufferTexture2D(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,s,a.__webglTexture,0),b(e.__webglRenderbuffer[o],e)}r&&q.generateMipmap(q.TEXTURE_CUBE_MAP)}else e.__webglFramebuffer=q.createFramebuffer(),e.__webglRenderbuffer=e.shareDepthFrom?e.shareDepthFrom.__webglRenderbuffer:q.createRenderbuffer(),q.bindTexture(q.TEXTURE_2D,e.__webglTexture),H(q.TEXTURE_2D,e,r),q.texImage2D(q.TEXTURE_2D,0,i,e.width,e.height,0,i,n,null),i=q.TEXTURE_2D,q.bindFramebuffer(q.FRAMEBUFFER,e.__webglFramebuffer),q.framebufferTexture2D(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,i,e.__webglTexture,0),e.shareDepthFrom?e.depthBuffer&&!e.stencilBuffer?q.framebufferRenderbuffer(q.FRAMEBUFFER,q.DEPTH_ATTACHMENT,q.RENDERBUFFER,e.__webglRenderbuffer):e.depthBuffer&&e.stencilBuffer&&q.framebufferRenderbuffer(q.FRAMEBUFFER,q.DEPTH_STENCIL_ATTACHMENT,q.RENDERBUFFER,e.__webglRenderbuffer):b(e.__webglRenderbuffer,e),r&&q.generateMipmap(q.TEXTURE_2D);t?q.bindTexture(q.TEXTURE_CUBE_MAP,null):q.bindTexture(q.TEXTURE_2D,null),q.bindRenderbuffer(q.RENDERBUFFER,null),q.bindFramebuffer(q.FRAMEBUFFER,null)}e?(t=t?e.__webglFramebuffer[e.activeCubeFace]:e.__webglFramebuffer,r=e.width,e=e.height,n=i=0):(t=null,r=oe,e=ae,i=ie,n=ne),t!==J&&(q.bindFramebuffer(q.FRAMEBUFFER,t),q.viewport(i,n,r,e),J=t),se=r,he=e},this.readRenderTargetPixels=function(e,t,r,i,n,o){if(e instanceof THREE.WebGLRenderTarget){if(e.__webglFramebuffer)if(e.format!==THREE.RGBAFormat)console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA format. readPixels can read only RGBA format.");else{var a=!1;e.__webglFramebuffer!==J&&(q.bindFramebuffer(q.FRAMEBUFFER,e.__webglFramebuffer),a=!0),q.checkFramebufferStatus(q.FRAMEBUFFER)===q.FRAMEBUFFER_COMPLETE?q.readPixels(t,r,i,n,q.RGBA,q.UNSIGNED_BYTE,o):console.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete."),a&&q.bindFramebuffer(q.FRAMEBUFFER,J)}}else console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.")},this.initMaterial=function(){THREE.warn("THREE.WebGLRenderer: .initMaterial() has been removed.")},this.addPrePlugin=function(){THREE.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.")},this.addPostPlugin=function(){THREE.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.")},this.updateShadowMap=function(){THREE.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.")}},THREE.WebGLRenderTarget=function(e,t,r){this.width=e,this.height=t,r=r||{},this.wrapS=void 0!==r.wrapS?r.wrapS:THREE.ClampToEdgeWrapping,this.wrapT=void 0!==r.wrapT?r.wrapT:THREE.ClampToEdgeWrapping,this.magFilter=void 0!==r.magFilter?r.magFilter:THREE.LinearFilter,this.minFilter=void 0!==r.minFilter?r.minFilter:THREE.LinearMipMapLinearFilter,this.anisotropy=void 0!==r.anisotropy?r.anisotropy:1,this.offset=new THREE.Vector2(0,0),this.repeat=new THREE.Vector2(1,1),this.format=void 0!==r.format?r.format:THREE.RGBAFormat,this.type=void 0!==r.type?r.type:THREE.UnsignedByteType,this.depthBuffer=void 0!==r.depthBuffer?r.depthBuffer:!0,this.stencilBuffer=void 0!==r.stencilBuffer?r.stencilBuffer:!0,this.generateMipmaps=!0,this.shareDepthFrom=void 0!==r.shareDepthFrom?r.shareDepthFrom:null},THREE.WebGLRenderTarget.prototype={constructor:THREE.WebGLRenderTarget,setSize:function(e,t){this.width=e,this.height=t},clone:function(){var e=new THREE.WebGLRenderTarget(this.width,this.height);return e.wrapS=this.wrapS,e.wrapT=this.wrapT,e.magFilter=this.magFilter,e.minFilter=this.minFilter,e.anisotropy=this.anisotropy,e.offset.copy(this.offset),e.repeat.copy(this.repeat),e.format=this.format,e.type=this.type,e.depthBuffer=this.depthBuffer,e.stencilBuffer=this.stencilBuffer,e.generateMipmaps=this.generateMipmaps,e.shareDepthFrom=this.shareDepthFrom,e},dispose:function(){this.dispatchEvent({type:"dispose"})}},THREE.EventDispatcher.prototype.apply(THREE.WebGLRenderTarget.prototype),THREE.WebGLRenderTargetCube=function(e,t,r){THREE.WebGLRenderTarget.call(this,e,t,r),this.activeCubeFace=0},THREE.WebGLRenderTargetCube.prototype=Object.create(THREE.WebGLRenderTarget.prototype),THREE.WebGLRenderTargetCube.prototype.constructor=THREE.WebGLRenderTargetCube,THREE.WebGLExtensions=function(e){var t={};this.get=function(r){if(void 0!==t[r])return t[r];var i;switch(r){case"EXT_texture_filter_anisotropic":i=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=e.getExtension(r)}return null===i&&THREE.warn("THREE.WebGLRenderer: "+r+" extension not supported."),t[r]=i}},THREE.WebGLProgram=function(){var e=0;return function(t,r,i,n){var o=t.context,a=i.defines,s=i.__webglShader.uniforms,h=i.attributes,c=i.__webglShader.vertexShader,l=i.__webglShader.fragmentShader,u=i.index0AttributeName;void 0===u&&!0===n.morphTargets&&(u="position");var E="SHADOWMAP_TYPE_BASIC";n.shadowMapType===THREE.PCFShadowMap?E="SHADOWMAP_TYPE_PCF":n.shadowMapType===THREE.PCFSoftShadowMap&&(E="SHADOWMAP_TYPE_PCF_SOFT");var p="ENVMAP_TYPE_CUBE",d="ENVMAP_MODE_REFLECTION",f="ENVMAP_BLENDING_MULTIPLY";if(n.envMap){switch(i.envMap.mapping){case THREE.CubeReflectionMapping:case THREE.CubeRefractionMapping:p="ENVMAP_TYPE_CUBE";break;case THREE.EquirectangularReflectionMapping:case THREE.EquirectangularRefractionMapping:p="ENVMAP_TYPE_EQUIREC";break;case THREE.SphericalReflectionMapping:p="ENVMAP_TYPE_SPHERE"}switch(i.envMap.mapping){case THREE.CubeRefractionMapping:case THREE.EquirectangularRefractionMapping:d="ENVMAP_MODE_REFRACTION"}switch(i.combine){case THREE.MultiplyOperation:f="ENVMAP_BLENDING_MULTIPLY";break;case THREE.MixOperation:f="ENVMAP_BLENDING_MIX";break;case THREE.AddOperation:f="ENVMAP_BLENDING_ADD"}}var m,T,g=0<t.gammaFactor?t.gammaFactor:1;m=[];for(var R in a)T=a[R],!1!==T&&(T="#define "+R+" "+T,m.push(T));m=m.join("\n"),a=o.createProgram(),i instanceof THREE.RawShaderMaterial?t=i="":(i=["precision "+n.precision+" float;","precision "+n.precision+" int;",m,n.supportsVertexTextures?"#define VERTEX_TEXTURES":"",t.gammaInput?"#define GAMMA_INPUT":"",t.gammaOutput?"#define GAMMA_OUTPUT":"","#define GAMMA_FACTOR "+g,"#define MAX_DIR_LIGHTS "+n.maxDirLights,"#define MAX_POINT_LIGHTS "+n.maxPointLights,"#define MAX_SPOT_LIGHTS "+n.maxSpotLights,"#define MAX_HEMI_LIGHTS "+n.maxHemiLights,"#define MAX_SHADOWS "+n.maxShadows,"#define MAX_BONES "+n.maxBones,n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+d:"",n.lightMap?"#define USE_LIGHTMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.vertexColors?"#define USE_COLOR":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.useVertexTexture?"#define BONE_TEXTURE":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals?"#define USE_MORPHNORMALS":"",n.wrapAround?"#define WRAP_AROUND":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+E:"",n.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",n.shadowMapCascade?"#define SHADOWMAP_CASCADE":"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n#ifdef USE_COLOR\n	attribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\n	attribute vec3 morphTarget0;\n	attribute vec3 morphTarget1;\n	attribute vec3 morphTarget2;\n	attribute vec3 morphTarget3;\n	#ifdef USE_MORPHNORMALS\n		attribute vec3 morphNormal0;\n		attribute vec3 morphNormal1;\n		attribute vec3 morphNormal2;\n		attribute vec3 morphNormal3;\n	#else\n		attribute vec3 morphTarget4;\n		attribute vec3 morphTarget5;\n		attribute vec3 morphTarget6;\n		attribute vec3 morphTarget7;\n	#endif\n#endif\n#ifdef USE_SKINNING\n	attribute vec4 skinIndex;\n	attribute vec4 skinWeight;\n#endif\n"].join("\n"),t=["precision "+n.precision+" float;","precision "+n.precision+" int;",n.bumpMap||n.normalMap||n.flatShading?"#extension GL_OES_standard_derivatives : enable":"",m,"#define MAX_DIR_LIGHTS "+n.maxDirLights,"#define MAX_POINT_LIGHTS "+n.maxPointLights,"#define MAX_SPOT_LIGHTS "+n.maxSpotLights,"#define MAX_HEMI_LIGHTS "+n.maxHemiLights,"#define MAX_SHADOWS "+n.maxShadows,n.alphaTest?"#define ALPHATEST "+n.alphaTest:"",t.gammaInput?"#define GAMMA_INPUT":"",t.gammaOutput?"#define GAMMA_OUTPUT":"","#define GAMMA_FACTOR "+g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+p:"",n.envMap?"#define "+d:"",n.envMap?"#define "+f:"",n.lightMap?"#define USE_LIGHTMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.vertexColors?"#define USE_COLOR":"",n.flatShading?"#define FLAT_SHADED":"",n.metal?"#define METAL":"",n.wrapAround?"#define WRAP_AROUND":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+E:"",n.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",n.shadowMapCascade?"#define SHADOWMAP_CASCADE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n")),c=new THREE.WebGLShader(o,o.VERTEX_SHADER,i+c),l=new THREE.WebGLShader(o,o.FRAGMENT_SHADER,t+l),o.attachShader(a,c),o.attachShader(a,l),void 0!==u&&o.bindAttribLocation(a,0,u),o.linkProgram(a),u=o.getProgramInfoLog(a),!1===o.getProgramParameter(a,o.LINK_STATUS)&&THREE.error("THREE.WebGLProgram: shader error: "+o.getError(),"gl.VALIDATE_STATUS",o.getProgramParameter(a,o.VALIDATE_STATUS),"gl.getPRogramInfoLog",u),""!==u&&THREE.warn("THREE.WebGLProgram: gl.getProgramInfoLog()"+u),o.deleteShader(c),o.deleteShader(l),u="viewMatrix modelViewMatrix projectionMatrix normalMatrix modelMatrix cameraPosition morphTargetInfluences bindMatrix bindMatrixInverse".split(" "),n.useVertexTexture?(u.push("boneTexture"),u.push("boneTextureWidth"),u.push("boneTextureHeight")):u.push("boneGlobalMatrices"),n.logarithmicDepthBuffer&&u.push("logDepthBufFC");for(var y in s)u.push(y);for(s=u,y={},u=0,t=s.length;t>u;u++)E=s[u],y[E]=o.getUniformLocation(a,E);for(this.uniforms=y,u="position normal uv uv2 tangent color skinIndex skinWeight lineDistance".split(" "),s=0;s<n.maxMorphTargets;s++)u.push("morphTarget"+s);for(s=0;s<n.maxMorphNormals;s++)u.push("morphNormal"+s);for(var v in h)u.push(v);for(n=u,h={},v=0,s=n.length;s>v;v++)y=n[v],h[y]=o.getAttribLocation(a,y);return this.attributes=h,this.attributesKeys=Object.keys(this.attributes),this.id=e++,this.code=r,this.usedTimes=1,this.program=a,this.vertexShader=c,this.fragmentShader=l,this}}(),THREE.WebGLShader=function(){var e=function(e){e=e.split("\n");for(var t=0;t<e.length;t++)e[t]=t+1+": "+e[t];return e.join("\n")};return function(t,r,i){return r=t.createShader(r),t.shaderSource(r,i),t.compileShader(r),!1===t.getShaderParameter(r,t.COMPILE_STATUS)&&THREE.error("THREE.WebGLShader: Shader couldn't compile."),""!==t.getShaderInfoLog(r)&&THREE.warn("THREE.WebGLShader: gl.getShaderInfoLog()",t.getShaderInfoLog(r),e(i)),r}}(),THREE.WebGLState=function(e,t){var r=new Uint8Array(16),i=new Uint8Array(16),n=null,o=null,a=null,s=null,h=null,c=null,l=null,u=null,E=null,p=null,d=null,f=null,m=null,T=null,g=null,R=null;this.initAttributes=function(){for(var e=0,t=r.length;t>e;e++)r[e]=0},this.enableAttribute=function(t){r[t]=1,0===i[t]&&(e.enableVertexAttribArray(t),i[t]=1)},this.disableUnusedAttributes=function(){for(var t=0,n=i.length;n>t;t++)i[t]!==r[t]&&(e.disableVertexAttribArray(t),i[t]=0)},this.setBlending=function(r,i,u,E,p,d,f){r!==n&&(r===THREE.NoBlending?e.disable(e.BLEND):r===THREE.AdditiveBlending?(e.enable(e.BLEND),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.SRC_ALPHA,e.ONE)):r===THREE.SubtractiveBlending?(e.enable(e.BLEND),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ZERO,e.ONE_MINUS_SRC_COLOR)):r===THREE.MultiplyBlending?(e.enable(e.BLEND),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ZERO,e.SRC_COLOR)):r===THREE.CustomBlending?e.enable(e.BLEND):(e.enable(e.BLEND),e.blendEquationSeparate(e.FUNC_ADD,e.FUNC_ADD),e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA)),n=r),r===THREE.CustomBlending?(p=p||i,d=d||u,f=f||E,(i!==o||p!==h)&&(e.blendEquationSeparate(t(i),t(p)),o=i,h=p),(u!==a||E!==s||d!==c||f!==l)&&(e.blendFuncSeparate(t(u),t(E),t(d),t(f)),a=u,s=E,c=d,l=f)):l=c=h=s=a=o=null},this.setDepthTest=function(t){u!==t&&(t?e.enable(e.DEPTH_TEST):e.disable(e.DEPTH_TEST),u=t)},this.setDepthWrite=function(t){E!==t&&(e.depthMask(t),E=t)},this.setColorWrite=function(t){p!==t&&(e.colorMask(t,t,t,t),p=t)},this.setDoubleSided=function(t){d!==t&&(t?e.disable(e.CULL_FACE):e.enable(e.CULL_FACE),d=t)},this.setFlipSided=function(t){f!==t&&(e.frontFace(t?e.CW:e.CCW),f=t)},this.setLineWidth=function(t){t!==m&&(e.lineWidth(t),m=t)},this.setPolygonOffset=function(t,r,i){T!==t&&(t?e.enable(e.POLYGON_OFFSET_FILL):e.disable(e.POLYGON_OFFSET_FILL),T=t),!t||g===r&&R===i||(e.polygonOffset(r,i),g=r,R=i)},this.reset=function(){for(var e=0;e<i.length;e++)i[e]=0;f=d=p=E=u=n=null}},THREE.LensFlarePlugin=function(e,t){var r,i,n,o,a,s,h,c,l,u,E,p,d,f,m,T,g=e.context;this.render=function(R,y,v,H){if(0!==t.length){R=new THREE.Vector3;var x=H/v,b=.5*v,w=.5*H,_=16/H,M=new THREE.Vector2(_*x,_),S=new THREE.Vector3(1,1,0),A=new THREE.Vector2(1,1);if(void 0===d){var _=new Float32Array([-1,-1,0,0,1,-1,1,0,1,1,1,1,-1,1,0,1]),C=new Uint16Array([0,1,2,0,2,3]);E=g.createBuffer(),p=g.createBuffer(),g.bindBuffer(g.ARRAY_BUFFER,E),g.bufferData(g.ARRAY_BUFFER,_,g.STATIC_DRAW),g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,p),g.bufferData(g.ELEMENT_ARRAY_BUFFER,C,g.STATIC_DRAW),m=g.createTexture(),T=g.createTexture(),g.bindTexture(g.TEXTURE_2D,m),g.texImage2D(g.TEXTURE_2D,0,g.RGB,16,16,0,g.RGB,g.UNSIGNED_BYTE,null),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.NEAREST),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.NEAREST),g.bindTexture(g.TEXTURE_2D,T),g.texImage2D(g.TEXTURE_2D,0,g.RGBA,16,16,0,g.RGBA,g.UNSIGNED_BYTE,null),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.NEAREST),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.NEAREST);var _=(f=0<g.getParameter(g.MAX_VERTEX_TEXTURE_IMAGE_UNITS))?{vertexShader:"uniform lowp int renderType;\nuniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility =        visibility.r / 9.0;\nvVisibility *= 1.0 - visibility.g / 9.0;\nvVisibility *=       visibility.b / 9.0;\nvVisibility *= 1.0 - visibility.a / 9.0;\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",fragmentShader:"uniform lowp int renderType;\nuniform sampler2D map;\nuniform float opacity;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"}:{vertexShader:"uniform lowp int renderType;\nuniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",fragmentShader:"precision mediump float;\nuniform lowp int renderType;\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform vec3 color;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a;\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a;\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a;\nvisibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * visibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"},C=g.createProgram(),L=g.createShader(g.FRAGMENT_SHADER),P=g.createShader(g.VERTEX_SHADER),F="precision "+e.getPrecision()+" float;\n";g.shaderSource(L,F+_.fragmentShader),g.shaderSource(P,F+_.vertexShader),g.compileShader(L),g.compileShader(P),g.attachShader(C,L),g.attachShader(C,P),g.linkProgram(C),d=C,l=g.getAttribLocation(d,"position"),u=g.getAttribLocation(d,"uv"),r=g.getUniformLocation(d,"renderType"),i=g.getUniformLocation(d,"map"),n=g.getUniformLocation(d,"occlusionMap"),o=g.getUniformLocation(d,"opacity"),a=g.getUniformLocation(d,"color"),s=g.getUniformLocation(d,"scale"),h=g.getUniformLocation(d,"rotation"),c=g.getUniformLocation(d,"screenPosition")}for(g.useProgram(d),g.enableVertexAttribArray(l),g.enableVertexAttribArray(u),g.uniform1i(n,0),g.uniform1i(i,1),g.bindBuffer(g.ARRAY_BUFFER,E),g.vertexAttribPointer(l,2,g.FLOAT,!1,16,0),g.vertexAttribPointer(u,2,g.FLOAT,!1,16,8),g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,p),g.disable(g.CULL_FACE),g.depthMask(!1),C=0,L=t.length;L>C;C++)if(_=16/H,M.set(_*x,_),P=t[C],R.set(P.matrixWorld.elements[12],P.matrixWorld.elements[13],P.matrixWorld.elements[14]),R.applyMatrix4(y.matrixWorldInverse),R.applyProjection(y.projectionMatrix),S.copy(R),A.x=S.x*b+b,A.y=S.y*w+w,f||0<A.x&&A.x<v&&0<A.y&&A.y<H){g.activeTexture(g.TEXTURE1),g.bindTexture(g.TEXTURE_2D,m),g.copyTexImage2D(g.TEXTURE_2D,0,g.RGB,A.x-8,A.y-8,16,16,0),g.uniform1i(r,0),g.uniform2f(s,M.x,M.y),g.uniform3f(c,S.x,S.y,S.z),g.disable(g.BLEND),g.enable(g.DEPTH_TEST),g.drawElements(g.TRIANGLES,6,g.UNSIGNED_SHORT,0),g.activeTexture(g.TEXTURE0),g.bindTexture(g.TEXTURE_2D,T),g.copyTexImage2D(g.TEXTURE_2D,0,g.RGBA,A.x-8,A.y-8,16,16,0),g.uniform1i(r,1),g.disable(g.DEPTH_TEST),g.activeTexture(g.TEXTURE1),g.bindTexture(g.TEXTURE_2D,m),g.drawElements(g.TRIANGLES,6,g.UNSIGNED_SHORT,0),P.positionScreen.copy(S),P.customUpdateCallback?P.customUpdateCallback(P):P.updateLensFlares(),g.uniform1i(r,2),g.enable(g.BLEND);for(var F=0,D=P.lensFlares.length;D>F;F++){var U=P.lensFlares[F];.001<U.opacity&&.001<U.scale&&(S.x=U.x,S.y=U.y,S.z=U.z,_=U.size*U.scale/H,M.x=_*x,M.y=_,g.uniform3f(c,S.x,S.y,S.z),g.uniform2f(s,M.x,M.y),g.uniform1f(h,U.rotation),g.uniform1f(o,U.opacity),g.uniform3f(a,U.color.r,U.color.g,U.color.b),e.state.setBlending(U.blending,U.blendEquation,U.blendSrc,U.blendDst),e.setTexture(U.texture,1),g.drawElements(g.TRIANGLES,6,g.UNSIGNED_SHORT,0))}}g.enable(g.CULL_FACE),g.enable(g.DEPTH_TEST),g.depthMask(!0),e.resetGLState()}}},THREE.ShadowMapPlugin=function(e,t,r,i){function n(e,t,i){if(t.visible){var o=r[t.id];if(o&&t.castShadow&&(!1===t.frustumCulled||!0===l.intersectsObject(t)))for(var a=0,s=o.length;s>a;a++){var h=o[a];t._modelViewMatrix.multiplyMatrices(i.matrixWorldInverse,t.matrixWorld),f.push(h)}for(a=0,s=t.children.length;s>a;a++)n(e,t.children[a],i)}}var o,a,s,h,c=e.context,l=new THREE.Frustum,u=new THREE.Matrix4,E=new THREE.Vector3,p=new THREE.Vector3,d=new THREE.Vector3,f=[],m=THREE.ShaderLib.depthRGBA,T=THREE.UniformsUtils.clone(m.uniforms);o=new THREE.ShaderMaterial({uniforms:T,vertexShader:m.vertexShader,fragmentShader:m.fragmentShader}),a=new THREE.ShaderMaterial({uniforms:T,vertexShader:m.vertexShader,fragmentShader:m.fragmentShader,morphTargets:!0}),s=new THREE.ShaderMaterial({uniforms:T,vertexShader:m.vertexShader,fragmentShader:m.fragmentShader,skinning:!0}),h=new THREE.ShaderMaterial({uniforms:T,vertexShader:m.vertexShader,fragmentShader:m.fragmentShader,morphTargets:!0,skinning:!0}),o._shadowPass=!0,a._shadowPass=!0,s._shadowPass=!0,h._shadowPass=!0,this.render=function(r,m){if(!1!==e.shadowMapEnabled){var T,g,R,y,v,H,x,b,w=[];for(y=0,c.clearColor(1,1,1,1),c.disable(c.BLEND),c.enable(c.CULL_FACE),c.frontFace(c.CCW),c.cullFace(e.shadowMapCullFace===THREE.CullFaceFront?c.FRONT:c.BACK),e.state.setDepthTest(!0),T=0,g=t.length;g>T;T++)if(R=t[T],R.castShadow)if(R instanceof THREE.DirectionalLight&&R.shadowCascade)for(v=0;v<R.shadowCascadeCount;v++){var _;if(R.shadowCascadeArray[v])_=R.shadowCascadeArray[v];else{x=R;var M=v;_=new THREE.DirectionalLight,_.isVirtual=!0,_.onlyShadow=!0,_.castShadow=!0,_.shadowCameraNear=x.shadowCameraNear,_.shadowCameraFar=x.shadowCameraFar,_.shadowCameraLeft=x.shadowCameraLeft,_.shadowCameraRight=x.shadowCameraRight,_.shadowCameraBottom=x.shadowCameraBottom,_.shadowCameraTop=x.shadowCameraTop,_.shadowCameraVisible=x.shadowCameraVisible,_.shadowDarkness=x.shadowDarkness,_.shadowBias=x.shadowCascadeBias[M],_.shadowMapWidth=x.shadowCascadeWidth[M],_.shadowMapHeight=x.shadowCascadeHeight[M],
	_.pointsWorld=[],_.pointsFrustum=[],b=_.pointsWorld,H=_.pointsFrustum;for(var S=0;8>S;S++)b[S]=new THREE.Vector3,H[S]=new THREE.Vector3;b=x.shadowCascadeNearZ[M],x=x.shadowCascadeFarZ[M],H[0].set(-1,-1,b),H[1].set(1,-1,b),H[2].set(-1,1,b),H[3].set(1,1,b),H[4].set(-1,-1,x),H[5].set(1,-1,x),H[6].set(-1,1,x),H[7].set(1,1,x),_.originalCamera=m,H=new THREE.Gyroscope,H.position.copy(R.shadowCascadeOffset),H.add(_),H.add(_.target),m.add(H),R.shadowCascadeArray[v]=_}M=R,b=v,x=M.shadowCascadeArray[b],x.position.copy(M.position),x.target.position.copy(M.target.position),x.lookAt(x.target),x.shadowCameraVisible=M.shadowCameraVisible,x.shadowDarkness=M.shadowDarkness,x.shadowBias=M.shadowCascadeBias[b],H=M.shadowCascadeNearZ[b],M=M.shadowCascadeFarZ[b],x=x.pointsFrustum,x[0].z=H,x[1].z=H,x[2].z=H,x[3].z=H,x[4].z=M,x[5].z=M,x[6].z=M,x[7].z=M,w[y]=_,y++}else w[y]=R,y++;for(T=0,g=w.length;g>T;T++){if(R=w[T],R.shadowMap||(v=THREE.LinearFilter,e.shadowMapType===THREE.PCFSoftShadowMap&&(v=THREE.NearestFilter),R.shadowMap=new THREE.WebGLRenderTarget(R.shadowMapWidth,R.shadowMapHeight,{minFilter:v,magFilter:v,format:THREE.RGBAFormat}),R.shadowMapSize=new THREE.Vector2(R.shadowMapWidth,R.shadowMapHeight),R.shadowMatrix=new THREE.Matrix4),!R.shadowCamera){if(R instanceof THREE.SpotLight)R.shadowCamera=new THREE.PerspectiveCamera(R.shadowCameraFov,R.shadowMapWidth/R.shadowMapHeight,R.shadowCameraNear,R.shadowCameraFar);else{if(!(R instanceof THREE.DirectionalLight)){THREE.error("THREE.ShadowMapPlugin: Unsupported light type for shadow",R);continue}R.shadowCamera=new THREE.OrthographicCamera(R.shadowCameraLeft,R.shadowCameraRight,R.shadowCameraTop,R.shadowCameraBottom,R.shadowCameraNear,R.shadowCameraFar)}r.add(R.shadowCamera),!0===r.autoUpdate&&r.updateMatrixWorld()}if(R.shadowCameraVisible&&!R.cameraHelper&&(R.cameraHelper=new THREE.CameraHelper(R.shadowCamera),r.add(R.cameraHelper)),R.isVirtual&&_.originalCamera==m){for(v=m,y=R.shadowCamera,H=R.pointsFrustum,x=R.pointsWorld,E.set(1/0,1/0,1/0),p.set(-(1/0),-(1/0),-(1/0)),M=0;8>M;M++)b=x[M],b.copy(H[M]),b.unproject(v),b.applyMatrix4(y.matrixWorldInverse),b.x<E.x&&(E.x=b.x),b.x>p.x&&(p.x=b.x),b.y<E.y&&(E.y=b.y),b.y>p.y&&(p.y=b.y),b.z<E.z&&(E.z=b.z),b.z>p.z&&(p.z=b.z);y.left=E.x,y.right=p.x,y.top=p.y,y.bottom=E.y,y.updateProjectionMatrix()}for(y=R.shadowMap,H=R.shadowMatrix,v=R.shadowCamera,v.position.setFromMatrixPosition(R.matrixWorld),d.setFromMatrixPosition(R.target.matrixWorld),v.lookAt(d),v.updateMatrixWorld(),v.matrixWorldInverse.getInverse(v.matrixWorld),R.cameraHelper&&(R.cameraHelper.visible=R.shadowCameraVisible),R.shadowCameraVisible&&R.cameraHelper.update(),H.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),H.multiply(v.projectionMatrix),H.multiply(v.matrixWorldInverse),u.multiplyMatrices(v.projectionMatrix,v.matrixWorldInverse),l.setFromMatrix(u),e.setRenderTarget(y),e.clear(),f.length=0,n(r,r,v),R=0,y=f.length;y>R;R++)x=f[R],H=x.object,x=x.buffer,M=H.material instanceof THREE.MeshFaceMaterial?H.material.materials[0]:H.material,b=void 0!==H.geometry.morphTargets&&0<H.geometry.morphTargets.length&&M.morphTargets,S=H instanceof THREE.SkinnedMesh&&M.skinning,b=H.customDepthMaterial?H.customDepthMaterial:S?b?h:s:b?a:o,e.setMaterialFaces(M),x instanceof THREE.BufferGeometry?e.renderBufferDirect(v,t,null,b,x,H):e.renderBuffer(v,t,null,b,x,H);for(R=0,y=i.length;y>R;R++)x=i[R],H=x.object,H.visible&&H.castShadow&&(H._modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,H.matrixWorld),e.renderImmediateObject(v,t,null,o,H))}T=e.getClearColor(),g=e.getClearAlpha(),c.clearColor(T.r,T.g,T.b,g),c.enable(c.BLEND),e.shadowMapCullFace===THREE.CullFaceFront&&c.cullFace(c.BACK),e.resetGLState()}}},THREE.SpritePlugin=function(e,t){function r(e,t){return e.z!==t.z?t.z-e.z:t.id-e.id}var i,n,o,a,s,h,c,l,u,E,p,d,f,m,T,g,R,y,v,H,x,b=e.context,w=new THREE.Vector3,_=new THREE.Quaternion,M=new THREE.Vector3;this.render=function(S,A){if(0!==t.length){if(void 0===H){var C=new Float32Array([-.5,-.5,0,0,.5,-.5,1,0,.5,.5,1,1,-.5,.5,0,1]),L=new Uint16Array([0,1,2,0,2,3]);y=b.createBuffer(),v=b.createBuffer(),b.bindBuffer(b.ARRAY_BUFFER,y),b.bufferData(b.ARRAY_BUFFER,C,b.STATIC_DRAW),b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,v),b.bufferData(b.ELEMENT_ARRAY_BUFFER,L,b.STATIC_DRAW);var C=b.createProgram(),L=b.createShader(b.VERTEX_SHADER),P=b.createShader(b.FRAGMENT_SHADER);b.shaderSource(L,["precision "+e.getPrecision()+" float;","uniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position * scale;\nvec2 rotatedPosition;\nrotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\nrotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\nvec4 finalPosition;\nfinalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition;\nfinalPosition = projectionMatrix * finalPosition;\ngl_Position = finalPosition;\n}"].join("\n")),b.shaderSource(P,["precision "+e.getPrecision()+" float;","uniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nuniform int fogType;\nuniform vec3 fogColor;\nuniform float fogDensity;\nuniform float fogNear;\nuniform float fogFar;\nuniform float alphaTest;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\nif ( texture.a < alphaTest ) discard;\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\nif ( fogType > 0 ) {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat fogFactor = 0.0;\nif ( fogType == 1 ) {\nfogFactor = smoothstep( fogNear, fogFar, depth );\n} else {\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n}\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n}\n}"].join("\n")),b.compileShader(L),b.compileShader(P),b.attachShader(C,L),b.attachShader(C,P),b.linkProgram(C),H=C,g=b.getAttribLocation(H,"position"),R=b.getAttribLocation(H,"uv"),i=b.getUniformLocation(H,"uvOffset"),n=b.getUniformLocation(H,"uvScale"),o=b.getUniformLocation(H,"rotation"),a=b.getUniformLocation(H,"scale"),s=b.getUniformLocation(H,"color"),h=b.getUniformLocation(H,"map"),c=b.getUniformLocation(H,"opacity"),l=b.getUniformLocation(H,"modelViewMatrix"),u=b.getUniformLocation(H,"projectionMatrix"),E=b.getUniformLocation(H,"fogType"),p=b.getUniformLocation(H,"fogDensity"),d=b.getUniformLocation(H,"fogNear"),f=b.getUniformLocation(H,"fogFar"),m=b.getUniformLocation(H,"fogColor"),T=b.getUniformLocation(H,"alphaTest"),C=document.createElement("canvas"),C.width=8,C.height=8,L=C.getContext("2d"),L.fillStyle="white",L.fillRect(0,0,8,8),x=new THREE.Texture(C),x.needsUpdate=!0}b.useProgram(H),b.enableVertexAttribArray(g),b.enableVertexAttribArray(R),b.disable(b.CULL_FACE),b.enable(b.BLEND),b.bindBuffer(b.ARRAY_BUFFER,y),b.vertexAttribPointer(g,2,b.FLOAT,!1,16,0),b.vertexAttribPointer(R,2,b.FLOAT,!1,16,8),b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,v),b.uniformMatrix4fv(u,!1,A.projectionMatrix.elements),b.activeTexture(b.TEXTURE0),b.uniform1i(h,0),L=C=0,(P=S.fog)?(b.uniform3f(m,P.color.r,P.color.g,P.color.b),P instanceof THREE.Fog?(b.uniform1f(d,P.near),b.uniform1f(f,P.far),b.uniform1i(E,1),L=C=1):P instanceof THREE.FogExp2&&(b.uniform1f(p,P.density),b.uniform1i(E,2),L=C=2)):(b.uniform1i(E,0),L=C=0);for(var P=0,F=t.length;F>P;P++){var D=t[P];D._modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,D.matrixWorld),D.z=-D._modelViewMatrix.elements[14]}t.sort(r);for(var U=[],P=0,F=t.length;F>P;P++){var D=t[P],B=D.material;b.uniform1f(T,B.alphaTest),b.uniformMatrix4fv(l,!1,D._modelViewMatrix.elements),D.matrixWorld.decompose(w,_,M),U[0]=M.x,U[1]=M.y,D=0,S.fog&&B.fog&&(D=L),C!==D&&(b.uniform1i(E,D),C=D),null!==B.map?(b.uniform2f(i,B.map.offset.x,B.map.offset.y),b.uniform2f(n,B.map.repeat.x,B.map.repeat.y)):(b.uniform2f(i,0,0),b.uniform2f(n,1,1)),b.uniform1f(c,B.opacity),b.uniform3f(s,B.color.r,B.color.g,B.color.b),b.uniform1f(o,B.rotation),b.uniform2fv(a,U),e.state.setBlending(B.blending,B.blendEquation,B.blendSrc,B.blendDst),e.state.setDepthTest(B.depthTest),e.state.setDepthWrite(B.depthWrite),B.map&&B.map.image&&B.map.image.width?e.setTexture(B.map,0):e.setTexture(x,0),b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0)}b.enable(b.CULL_FACE),e.resetGLState()}}},THREE.GeometryUtils={merge:function(e,t,r){THREE.warn("THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.");var i;t instanceof THREE.Mesh&&(t.matrixAutoUpdate&&t.updateMatrix(),i=t.matrix,t=t.geometry),e.merge(t,i,r)},center:function(e){return THREE.warn("THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead."),e.center()}},THREE.ImageUtils={crossOrigin:void 0,loadTexture:function(e,t,r,i){var n=new THREE.ImageLoader;n.crossOrigin=this.crossOrigin;var o=new THREE.Texture(void 0,t);return n.load(e,function(e){o.image=e,o.needsUpdate=!0,r&&r(o)},void 0,function(e){i&&i(e)}),o.sourceFile=e,o},loadTextureCube:function(e,t,r,i){var n=new THREE.ImageLoader;n.crossOrigin=this.crossOrigin;var o=new THREE.CubeTexture([],t);o.flipY=!1;var a=0;t=function(t){n.load(e[t],function(e){o.images[t]=e,a+=1,6===a&&(o.needsUpdate=!0,r&&r(o))},void 0,i)};for(var s=0,h=e.length;h>s;++s)t(s);return o},loadCompressedTexture:function(){THREE.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.")},loadCompressedTextureCube:function(){THREE.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.")},getNormalMap:function(e,t){var r=function(e){var t=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);return[e[0]/t,e[1]/t,e[2]/t]};t|=1;var i=e.width,n=e.height,o=document.createElement("canvas");o.width=i,o.height=n;var a=o.getContext("2d");a.drawImage(e,0,0);for(var s=a.getImageData(0,0,i,n).data,h=a.createImageData(i,n),c=h.data,l=0;i>l;l++)for(var u=0;n>u;u++){var E=0>u-1?0:u-1,p=u+1>n-1?n-1:u+1,d=0>l-1?0:l-1,f=l+1>i-1?i-1:l+1,m=[],T=[0,0,s[4*(u*i+l)]/255*t];for(m.push([-1,0,s[4*(u*i+d)]/255*t]),m.push([-1,-1,s[4*(E*i+d)]/255*t]),m.push([0,-1,s[4*(E*i+l)]/255*t]),m.push([1,-1,s[4*(E*i+f)]/255*t]),m.push([1,0,s[4*(u*i+f)]/255*t]),m.push([1,1,s[4*(p*i+f)]/255*t]),m.push([0,1,s[4*(p*i+l)]/255*t]),m.push([-1,1,s[4*(p*i+d)]/255*t]),E=[],d=m.length,p=0;d>p;p++){var f=m[p],g=m[(p+1)%d],f=[f[0]-T[0],f[1]-T[1],f[2]-T[2]],g=[g[0]-T[0],g[1]-T[1],g[2]-T[2]];E.push(r([f[1]*g[2]-f[2]*g[1],f[2]*g[0]-f[0]*g[2],f[0]*g[1]-f[1]*g[0]]))}for(m=[0,0,0],p=0;p<E.length;p++)m[0]+=E[p][0],m[1]+=E[p][1],m[2]+=E[p][2];m[0]/=E.length,m[1]/=E.length,m[2]/=E.length,T=4*(u*i+l),c[T]=(m[0]+1)/2*255|0,c[T+1]=(m[1]+1)/2*255|0,c[T+2]=255*m[2]|0,c[T+3]=255}return a.putImageData(h,0,0),o},generateDataTexture:function(e,t,r){var i=e*t,n=new Uint8Array(3*i),o=Math.floor(255*r.r),a=Math.floor(255*r.g);r=Math.floor(255*r.b);for(var s=0;i>s;s++)n[3*s]=o,n[3*s+1]=a,n[3*s+2]=r;return e=new THREE.DataTexture(n,e,t,THREE.RGBFormat),e.needsUpdate=!0,e}},THREE.SceneUtils={createMultiMaterialObject:function(e,t){for(var r=new THREE.Object3D,i=0,n=t.length;n>i;i++)r.add(new THREE.Mesh(e,t[i]));return r},detach:function(e,t,r){e.applyMatrix(t.matrixWorld),t.remove(e),r.add(e)},attach:function(e,t,r){var i=new THREE.Matrix4;i.getInverse(r.matrixWorld),e.applyMatrix(i),t.remove(e),r.add(e)}},THREE.FontUtils={faces:{},face:"helvetiker",weight:"normal",style:"normal",size:150,divisions:10,getFace:function(){try{return this.faces[this.face][this.weight][this.style]}catch(e){throw"The font "+this.face+" with "+this.weight+" weight and "+this.style+" style is missing."}},loadFace:function(e){var t=e.familyName.toLowerCase();return this.faces[t]=this.faces[t]||{},this.faces[t][e.cssFontWeight]=this.faces[t][e.cssFontWeight]||{},this.faces[t][e.cssFontWeight][e.cssFontStyle]=e,this.faces[t][e.cssFontWeight][e.cssFontStyle]=e},drawText:function(e){var t=this.getFace(),r=this.size/t.resolution,i=0,n=String(e).split(""),o=n.length,a=[];for(e=0;o>e;e++){var s=new THREE.Path,s=this.extractGlyphPoints(n[e],t,r,i,s),i=i+s.offset;a.push(s.path)}return{paths:a,offset:i/2}},extractGlyphPoints:function(e,t,r,i,n){var o,a,s,h,c,l,u,E,p,d,f,m=[],T=t.glyphs[e]||t.glyphs["?"];if(T){if(T.o)for(t=T._cachedOutline||(T._cachedOutline=T.o.split(" ")),h=t.length,e=0;h>e;)switch(s=t[e++]){case"m":s=t[e++]*r+i,c=t[e++]*r,n.moveTo(s,c);break;case"l":s=t[e++]*r+i,c=t[e++]*r,n.lineTo(s,c);break;case"q":if(s=t[e++]*r+i,c=t[e++]*r,E=t[e++]*r+i,p=t[e++]*r,n.quadraticCurveTo(E,p,s,c),o=m[m.length-1])for(l=o.x,u=o.y,o=1,a=this.divisions;a>=o;o++){var g=o/a;THREE.Shape.Utils.b2(g,l,E,s),THREE.Shape.Utils.b2(g,u,p,c)}break;case"b":if(s=t[e++]*r+i,c=t[e++]*r,E=t[e++]*r+i,p=t[e++]*r,d=t[e++]*r+i,f=t[e++]*r,n.bezierCurveTo(E,p,d,f,s,c),o=m[m.length-1])for(l=o.x,u=o.y,o=1,a=this.divisions;a>=o;o++)g=o/a,THREE.Shape.Utils.b3(g,l,E,d,s),THREE.Shape.Utils.b3(g,u,p,f,c)}return{offset:T.ha*r,path:n}}}},THREE.FontUtils.generateShapes=function(e,t){t=t||{};var r=void 0!==t.curveSegments?t.curveSegments:4,i=void 0!==t.font?t.font:"helvetiker",n=void 0!==t.weight?t.weight:"normal",o=void 0!==t.style?t.style:"normal";for(THREE.FontUtils.size=void 0!==t.size?t.size:100,THREE.FontUtils.divisions=r,THREE.FontUtils.face=i,THREE.FontUtils.weight=n,THREE.FontUtils.style=o,r=THREE.FontUtils.drawText(e).paths,i=[],n=0,o=r.length;o>n;n++)Array.prototype.push.apply(i,r[n].toShapes());return i},function(e){var t=function(e){for(var t=e.length,r=0,i=t-1,n=0;t>n;i=n++)r+=e[i].x*e[n].y-e[n].x*e[i].y;return.5*r};return e.Triangulate=function(e,r){var i=e.length;if(3>i)return null;var n,o,a,s=[],h=[],c=[];if(0<t(e))for(o=0;i>o;o++)h[o]=o;else for(o=0;i>o;o++)h[o]=i-1-o;var l=2*i;for(o=i-1;i>2;){if(0>=l--){THREE.warn("THREE.FontUtils: Warning, unable to triangulate polygon! in Triangulate.process()");break}n=o,n>=i&&(n=0),o=n+1,o>=i&&(o=0),a=o+1,a>=i&&(a=0);var u;e:{var E=u=void 0,p=void 0,d=void 0,f=void 0,m=void 0,T=void 0,g=void 0,R=void 0,E=e[h[n]].x,p=e[h[n]].y,d=e[h[o]].x,f=e[h[o]].y,m=e[h[a]].x,T=e[h[a]].y;if(1e-10>(d-E)*(T-p)-(f-p)*(m-E))u=!1;else{var y=void 0,v=void 0,H=void 0,x=void 0,b=void 0,w=void 0,_=void 0,M=void 0,S=void 0,A=void 0,S=M=_=R=g=void 0,y=m-d,v=T-f,H=E-m,x=p-T,b=d-E,w=f-p;for(u=0;i>u;u++)if(g=e[h[u]].x,R=e[h[u]].y,!(g===E&&R===p||g===d&&R===f||g===m&&R===T)&&(_=g-E,M=R-p,S=g-d,A=R-f,g-=m,R-=T,S=y*A-v*S,_=b*M-w*_,M=H*R-x*g,S>=-1e-10&&M>=-1e-10&&_>=-1e-10)){u=!1;break e}u=!0}}if(u){for(s.push([e[h[n]],e[h[o]],e[h[a]]]),c.push([h[n],h[o],h[a]]),n=o,a=o+1;i>a;n++,a++)h[n]=h[a];i--,l=2*i}}return r?c:s},e.Triangulate.area=t,e}(THREE.FontUtils),self._typeface_js={faces:THREE.FontUtils.faces,loadFace:THREE.FontUtils.loadFace},THREE.typeface_js=self._typeface_js,THREE.Audio=function(e){THREE.Object3D.call(this),this.type="Audio",this.context=e.context,this.source=this.context.createBufferSource(),this.source.onended=this.onEnded.bind(this),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.panner=this.context.createPanner(),this.panner.connect(this.gain),this.autoplay=!1,this.startTime=0,this.isPlaying=!1},THREE.Audio.prototype=Object.create(THREE.Object3D.prototype),THREE.Audio.prototype.constructor=THREE.Audio,THREE.Audio.prototype.load=function(e){var t=this,r=new XMLHttpRequest;return r.open("GET",e,!0),r.responseType="arraybuffer",r.onload=function(e){t.context.decodeAudioData(this.response,function(e){t.source.buffer=e,t.autoplay&&t.play()})},r.send(),this},THREE.Audio.prototype.play=function(){if(!0===this.isPlaying)THREE.warn("THREE.Audio: Audio is already playing.");else{var e=this.context.createBufferSource();e.buffer=this.source.buffer,e.loop=this.source.loop,e.onended=this.source.onended,e.connect(this.panner),e.start(0,this.startTime),this.isPlaying=!0,this.source=e}},THREE.Audio.prototype.pause=function(){this.source.stop(),this.startTime=this.context.currentTime},THREE.Audio.prototype.stop=function(){this.source.stop(),this.startTime=0},THREE.Audio.prototype.onEnded=function(){this.isPlaying=!1},THREE.Audio.prototype.setLoop=function(e){this.source.loop=e},THREE.Audio.prototype.setRefDistance=function(e){this.panner.refDistance=e},THREE.Audio.prototype.setRolloffFactor=function(e){this.panner.rolloffFactor=e},THREE.Audio.prototype.setVolume=function(e){this.gain.gain.value=e},THREE.Audio.prototype.updateMatrixWorld=function(){var e=new THREE.Vector3;return function(t){THREE.Object3D.prototype.updateMatrixWorld.call(this,t),e.setFromMatrixPosition(this.matrixWorld),this.panner.setPosition(e.x,e.y,e.z)}}(),THREE.AudioListener=function(){THREE.Object3D.call(this),this.type="AudioListener",this.context=new(window.AudioContext||window.webkitAudioContext)},THREE.AudioListener.prototype=Object.create(THREE.Object3D.prototype),THREE.AudioListener.prototype.constructor=THREE.AudioListener,THREE.AudioListener.prototype.updateMatrixWorld=function(){var e=new THREE.Vector3,t=new THREE.Quaternion,r=new THREE.Vector3,i=new THREE.Vector3,n=new THREE.Vector3,o=new THREE.Vector3;return function(a){THREE.Object3D.prototype.updateMatrixWorld.call(this,a),a=this.context.listener;var s=this.up;this.matrixWorld.decompose(e,t,r),i.set(0,0,-1).applyQuaternion(t),n.subVectors(e,o),a.setPosition(e.x,e.y,e.z),a.setOrientation(i.x,i.y,i.z,s.x,s.y,s.z),a.setVelocity(n.x,n.y,n.z),o.copy(e)}}(),THREE.Curve=function(){},THREE.Curve.prototype.getPoint=function(e){return THREE.warn("THREE.Curve: Warning, getPoint() not implemented!"),null},THREE.Curve.prototype.getPointAt=function(e){return e=this.getUtoTmapping(e),this.getPoint(e)},THREE.Curve.prototype.getPoints=function(e){e||(e=5);var t,r=[];for(t=0;e>=t;t++)r.push(this.getPoint(t/e));return r},THREE.Curve.prototype.getSpacedPoints=function(e){e||(e=5);var t,r=[];for(t=0;e>=t;t++)r.push(this.getPointAt(t/e));return r},THREE.Curve.prototype.getLength=function(){var e=this.getLengths();return e[e.length-1]},THREE.Curve.prototype.getLengths=function(e){if(e||(e=this.__arcLengthDivisions?this.__arcLengthDivisions:200),this.cacheArcLengths&&this.cacheArcLengths.length==e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;var t,r,i=[],n=this.getPoint(0),o=0;for(i.push(0),r=1;e>=r;r++)t=this.getPoint(r/e),o+=t.distanceTo(n),i.push(o),n=t;return this.cacheArcLengths=i},THREE.Curve.prototype.updateArcLengths=function(){this.needsUpdate=!0,this.getLengths()},THREE.Curve.prototype.getUtoTmapping=function(e,t){var r,i=this.getLengths(),n=0,o=i.length;r=t?t:e*i[o-1];for(var a,s=0,h=o-1;h>=s;)if(n=Math.floor(s+(h-s)/2),a=i[n]-r,0>a)s=n+1;else{if(!(a>0)){h=n;break}h=n-1}return n=h,i[n]==r?n/(o-1):(s=i[n],i=(n+(r-s)/(i[n+1]-s))/(o-1))},THREE.Curve.prototype.getTangent=function(e){var t=e-1e-4;return e+=1e-4,0>t&&(t=0),e>1&&(e=1),t=this.getPoint(t),this.getPoint(e).clone().sub(t).normalize()},THREE.Curve.prototype.getTangentAt=function(e){return e=this.getUtoTmapping(e),this.getTangent(e)},THREE.Curve.Utils={tangentQuadraticBezier:function(e,t,r,i){return 2*(1-e)*(r-t)+2*e*(i-r)},tangentCubicBezier:function(e,t,r,i,n){return-3*t*(1-e)*(1-e)+3*r*(1-e)*(1-e)-6*e*r*(1-e)+6*e*i*(1-e)-3*e*e*i+3*e*e*n},tangentSpline:function(e,t,r,i,n){return 6*e*e-6*e+(3*e*e-4*e+1)+(-6*e*e+6*e)+(3*e*e-2*e)},interpolate:function(e,t,r,i,n){e=.5*(r-e),i=.5*(i-t);var o=n*n;return(2*t-2*r+e+i)*n*o+(-3*t+3*r-2*e-i)*o+e*n+t}},THREE.Curve.create=function(e,t){return e.prototype=Object.create(THREE.Curve.prototype),e.prototype.constructor=e,e.prototype.getPoint=t,e},THREE.CurvePath=function(){this.curves=[],this.bends=[],this.autoClose=!1},THREE.CurvePath.prototype=Object.create(THREE.Curve.prototype),THREE.CurvePath.prototype.constructor=THREE.CurvePath,THREE.CurvePath.prototype.add=function(e){this.curves.push(e)},THREE.CurvePath.prototype.checkConnection=function(){},THREE.CurvePath.prototype.closePath=function(){var e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);e.equals(t)||this.curves.push(new THREE.LineCurve(t,e))},THREE.CurvePath.prototype.getPoint=function(e){var t=e*this.getLength(),r=this.getCurveLengths();for(e=0;e<r.length;){if(r[e]>=t)return t=r[e]-t,e=this.curves[e],t=1-t/e.getLength(),e.getPointAt(t);e++}return null},THREE.CurvePath.prototype.getLength=function(){var e=this.getCurveLengths();return e[e.length-1]},THREE.CurvePath.prototype.getCurveLengths=function(){if(this.cacheLengths&&this.cacheLengths.length==this.curves.length)return this.cacheLengths;var e,t=[],r=0,i=this.curves.length;for(e=0;i>e;e++)r+=this.curves[e].getLength(),t.push(r);return this.cacheLengths=t},THREE.CurvePath.prototype.getBoundingBox=function(){var e,t,r,i,n,o,a=this.getPoints();e=t=Number.NEGATIVE_INFINITY,i=n=Number.POSITIVE_INFINITY;var s,h,c,l,u=a[0]instanceof THREE.Vector3;for(l=u?new THREE.Vector3:new THREE.Vector2,h=0,c=a.length;c>h;h++)s=a[h],s.x>e?e=s.x:s.x<i&&(i=s.x),s.y>t?t=s.y:s.y<n&&(n=s.y),u&&(s.z>r?r=s.z:s.z<o&&(o=s.z)),l.add(s);return a={minX:i,minY:n,maxX:e,maxY:t},u&&(a.maxZ=r,a.minZ=o),a},THREE.CurvePath.prototype.createPointsGeometry=function(e){return e=this.getPoints(e,!0),this.createGeometry(e)},THREE.CurvePath.prototype.createSpacedPointsGeometry=function(e){return e=this.getSpacedPoints(e,!0),this.createGeometry(e)},THREE.CurvePath.prototype.createGeometry=function(e){for(var t=new THREE.Geometry,r=0;r<e.length;r++)t.vertices.push(new THREE.Vector3(e[r].x,e[r].y,e[r].z||0));return t},THREE.CurvePath.prototype.addWrapPath=function(e){this.bends.push(e)},THREE.CurvePath.prototype.getTransformedPoints=function(e,t){var r,i,n=this.getPoints(e);for(t||(t=this.bends),r=0,i=t.length;i>r;r++)n=this.getWrapPoints(n,t[r]);return n},THREE.CurvePath.prototype.getTransformedSpacedPoints=function(e,t){var r,i,n=this.getSpacedPoints(e);for(t||(t=this.bends),r=0,i=t.length;i>r;r++)n=this.getWrapPoints(n,t[r]);return n},THREE.CurvePath.prototype.getWrapPoints=function(e,t){var r,i,n,o,a,s,h=this.getBoundingBox();for(r=0,i=e.length;i>r;r++)n=e[r],o=n.x,a=n.y,s=o/h.maxX,s=t.getUtoTmapping(s,o),o=t.getPoint(s),s=t.getTangent(s),s.set(-s.y,s.x).multiplyScalar(a),n.x=o.x+s.x,n.y=o.y+s.y;return e},THREE.Gyroscope=function(){THREE.Object3D.call(this)},THREE.Gyroscope.prototype=Object.create(THREE.Object3D.prototype),THREE.Gyroscope.prototype.constructor=THREE.Gyroscope,THREE.Gyroscope.prototype.updateMatrixWorld=function(){var e=new THREE.Vector3,t=new THREE.Quaternion,r=new THREE.Vector3,i=new THREE.Vector3,n=new THREE.Quaternion,o=new THREE.Vector3;return function(a){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||a)&&(this.parent?(this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorld.decompose(i,n,o),this.matrix.decompose(e,t,r),this.matrixWorld.compose(i,t,o)):this.matrixWorld.copy(this.matrix),this.matrixWorldNeedsUpdate=!1,a=!0);for(var s=0,h=this.children.length;h>s;s++)this.children[s].updateMatrixWorld(a)}}(),THREE.Path=function(e){THREE.CurvePath.call(this),this.actions=[],e&&this.fromPoints(e)},THREE.Path.prototype=Object.create(THREE.CurvePath.prototype),THREE.Path.prototype.constructor=THREE.Path,THREE.PathActions={MOVE_TO:"moveTo",LINE_TO:"lineTo",QUADRATIC_CURVE_TO:"quadraticCurveTo",BEZIER_CURVE_TO:"bezierCurveTo",CSPLINE_THRU:"splineThru",ARC:"arc",ELLIPSE:"ellipse"},THREE.Path.prototype.fromPoints=function(e){this.moveTo(e[0].x,e[0].y);for(var t=1,r=e.length;r>t;t++)this.lineTo(e[t].x,e[t].y)},THREE.Path.prototype.moveTo=function(e,t){var r=Array.prototype.slice.call(arguments);this.actions.push({action:THREE.PathActions.MOVE_TO,args:r})},THREE.Path.prototype.lineTo=function(e,t){var r=Array.prototype.slice.call(arguments),i=this.actions[this.actions.length-1].args,i=new THREE.LineCurve(new THREE.Vector2(i[i.length-2],i[i.length-1]),new THREE.Vector2(e,t));this.curves.push(i),this.actions.push({action:THREE.PathActions.LINE_TO,args:r})},THREE.Path.prototype.quadraticCurveTo=function(e,t,r,i){var n=Array.prototype.slice.call(arguments),o=this.actions[this.actions.length-1].args,o=new THREE.QuadraticBezierCurve(new THREE.Vector2(o[o.length-2],o[o.length-1]),new THREE.Vector2(e,t),new THREE.Vector2(r,i));this.curves.push(o),this.actions.push({action:THREE.PathActions.QUADRATIC_CURVE_TO,args:n})},THREE.Path.prototype.bezierCurveTo=function(e,t,r,i,n,o){var a=Array.prototype.slice.call(arguments),s=this.actions[this.actions.length-1].args,s=new THREE.CubicBezierCurve(new THREE.Vector2(s[s.length-2],s[s.length-1]),new THREE.Vector2(e,t),new THREE.Vector2(r,i),new THREE.Vector2(n,o));this.curves.push(s),this.actions.push({action:THREE.PathActions.BEZIER_CURVE_TO,args:a})},THREE.Path.prototype.splineThru=function(e){var t=Array.prototype.slice.call(arguments),r=this.actions[this.actions.length-1].args,r=[new THREE.Vector2(r[r.length-2],r[r.length-1])];Array.prototype.push.apply(r,e),r=new THREE.SplineCurve(r),this.curves.push(r),this.actions.push({action:THREE.PathActions.CSPLINE_THRU,args:t})},THREE.Path.prototype.arc=function(e,t,r,i,n,o){var a=this.actions[this.actions.length-1].args;this.absarc(e+a[a.length-2],t+a[a.length-1],r,i,n,o)},THREE.Path.prototype.absarc=function(e,t,r,i,n,o){this.absellipse(e,t,r,r,i,n,o)},THREE.Path.prototype.ellipse=function(e,t,r,i,n,o,a){var s=this.actions[this.actions.length-1].args;this.absellipse(e+s[s.length-2],t+s[s.length-1],r,i,n,o,a)},THREE.Path.prototype.absellipse=function(e,t,r,i,n,o,a){var s=Array.prototype.slice.call(arguments),h=new THREE.EllipseCurve(e,t,r,i,n,o,a);this.curves.push(h),h=h.getPoint(1),s.push(h.x),s.push(h.y),this.actions.push({action:THREE.PathActions.ELLIPSE,args:s})},THREE.Path.prototype.getSpacedPoints=function(e,t){e||(e=40);for(var r=[],i=0;e>i;i++)r.push(this.getPoint(i/e));return r},THREE.Path.prototype.getPoints=function(e,t){if(this.useSpacedPoints)return console.log("tata"),this.getSpacedPoints(e,t);e=e||12;var r,i,n,o,a,s,h,c,l,u,E,p,d,f=[];for(r=0,i=this.actions.length;i>r;r++)switch(n=this.actions[r],o=n.action,n=n.args,o){case THREE.PathActions.MOVE_TO:f.push(new THREE.Vector2(n[0],n[1]));break;case THREE.PathActions.LINE_TO:f.push(new THREE.Vector2(n[0],n[1]));break;case THREE.PathActions.QUADRATIC_CURVE_TO:for(a=n[2],s=n[3],l=n[0],u=n[1],0<f.length?(o=f[f.length-1],E=o.x,p=o.y):(o=this.actions[r-1].args,E=o[o.length-2],p=o[o.length-1]),n=1;e>=n;n++)d=n/e,o=THREE.Shape.Utils.b2(d,E,l,a),d=THREE.Shape.Utils.b2(d,p,u,s),f.push(new THREE.Vector2(o,d));break;case THREE.PathActions.BEZIER_CURVE_TO:for(a=n[4],s=n[5],l=n[0],u=n[1],h=n[2],c=n[3],0<f.length?(o=f[f.length-1],E=o.x,p=o.y):(o=this.actions[r-1].args,E=o[o.length-2],p=o[o.length-1]),n=1;e>=n;n++)d=n/e,o=THREE.Shape.Utils.b3(d,E,l,h,a),d=THREE.Shape.Utils.b3(d,p,u,c,s),f.push(new THREE.Vector2(o,d));break;case THREE.PathActions.CSPLINE_THRU:for(o=this.actions[r-1].args,d=[new THREE.Vector2(o[o.length-2],o[o.length-1])],o=e*n[0].length,d=d.concat(n[0]),d=new THREE.SplineCurve(d),n=1;o>=n;n++)f.push(d.getPointAt(n/o));break;case THREE.PathActions.ARC:for(a=n[0],s=n[1],u=n[2],h=n[3],o=n[4],l=!!n[5],E=o-h,p=2*e,n=1;p>=n;n++)d=n/p,l||(d=1-d),d=h+d*E,o=a+u*Math.cos(d),d=s+u*Math.sin(d),f.push(new THREE.Vector2(o,d));break;case THREE.PathActions.ELLIPSE:for(a=n[0],s=n[1],u=n[2],c=n[3],h=n[4],o=n[5],l=!!n[6],E=o-h,p=2*e,n=1;p>=n;n++)d=n/p,l||(d=1-d),d=h+d*E,o=a+u*Math.cos(d),d=s+c*Math.sin(d),f.push(new THREE.Vector2(o,d))}return r=f[f.length-1],1e-10>Math.abs(r.x-f[0].x)&&1e-10>Math.abs(r.y-f[0].y)&&f.splice(f.length-1,1),t&&f.push(f[0]),f},THREE.Path.prototype.toShapes=function(e,t){function r(e){for(var t=[],r=0,i=e.length;i>r;r++){var n=e[r],o=new THREE.Shape;o.actions=n.actions,o.curves=n.curves,t.push(o)}return t}function i(e,t){for(var r=t.length,i=!1,n=r-1,o=0;r>o;n=o++){var a=t[n],s=t[o],h=s.x-a.x,c=s.y-a.y;if(1e-10<Math.abs(c)){if(0>c&&(a=t[o],h=-h,s=t[n],c=-c),!(e.y<a.y||e.y>s.y))if(e.y==a.y){if(e.x==a.x)return!0}else{if(n=c*(e.x-a.x)-h*(e.y-a.y),0==n)return!0;0>n||(i=!i)}}else if(e.y==a.y&&(s.x<=e.x&&e.x<=a.x||a.x<=e.x&&e.x<=s.x))return!0}return i}var n=function(e){var t,r,i,n,o=[],a=new THREE.Path;for(t=0,r=e.length;r>t;t++)i=e[t],n=i.args,i=i.action,i==THREE.PathActions.MOVE_TO&&0!=a.actions.length&&(o.push(a),a=new THREE.Path),a[i].apply(a,n);return 0!=a.actions.length&&o.push(a),o}(this.actions);if(0==n.length)return[];if(!0===t)return r(n);var o,a,s,h=[];if(1==n.length)return a=n[0],s=new THREE.Shape,s.actions=a.actions,s.curves=a.curves,h.push(s),h;var c=!THREE.Shape.Utils.isClockWise(n[0].getPoints()),c=e?!c:c;s=[];var l,u=[],E=[],p=0;u[p]=void 0,E[p]=[];var d,f;for(d=0,f=n.length;f>d;d++)a=n[d],l=a.getPoints(),o=THREE.Shape.Utils.isClockWise(l),(o=e?!o:o)?(!c&&u[p]&&p++,u[p]={s:new THREE.Shape,p:l},u[p].s.actions=a.actions,u[p].s.curves=a.curves,c&&p++,E[p]=[]):E[p].push({h:a,p:l[0]});if(!u[0])return r(n);if(1<u.length){for(d=!1,f=[],a=0,n=u.length;n>a;a++)s[a]=[];for(a=0,n=u.length;n>a;a++)for(o=E[a],c=0;c<o.length;c++){p=o[c],l=!0;for(var m=0;m<u.length;m++)i(p.p,u[m].p)&&(a!=m&&f.push({froms:a,tos:m,hole:c}),l?(l=!1,s[m].push(p)):d=!0);l&&s[a].push(p)}0<f.length&&(d||(E=s))}for(d=0,f=u.length;f>d;d++)for(s=u[d].s,h.push(s),a=E[d],n=0,o=a.length;o>n;n++)s.holes.push(a[n].h);return h},THREE.Shape=function(){THREE.Path.apply(this,arguments),this.holes=[]},THREE.Shape.prototype=Object.create(THREE.Path.prototype),THREE.Shape.prototype.constructor=THREE.Shape,THREE.Shape.prototype.extrude=function(e){return new THREE.ExtrudeGeometry(this,e)},THREE.Shape.prototype.makeGeometry=function(e){return new THREE.ShapeGeometry(this,e)},THREE.Shape.prototype.getPointsHoles=function(e){var t,r=this.holes.length,i=[];for(t=0;r>t;t++)i[t]=this.holes[t].getTransformedPoints(e,this.bends);return i},THREE.Shape.prototype.getSpacedPointsHoles=function(e){var t,r=this.holes.length,i=[];for(t=0;r>t;t++)i[t]=this.holes[t].getTransformedSpacedPoints(e,this.bends);return i},THREE.Shape.prototype.extractAllPoints=function(e){return{shape:this.getTransformedPoints(e),holes:this.getPointsHoles(e)}},THREE.Shape.prototype.extractPoints=function(e){return this.useSpacedPoints?this.extractAllSpacedPoints(e):this.extractAllPoints(e)},THREE.Shape.prototype.extractAllSpacedPoints=function(e){return{shape:this.getTransformedSpacedPoints(e),holes:this.getSpacedPointsHoles(e)}},THREE.Shape.Utils={triangulateShape:function(e,t){function r(e,t,r){return e.x!=t.x?e.x<t.x?e.x<=r.x&&r.x<=t.x:t.x<=r.x&&r.x<=e.x:e.y<t.y?e.y<=r.y&&r.y<=t.y:t.y<=r.y&&r.y<=e.y}function i(e,t,i,n,o){var a=t.x-e.x,s=t.y-e.y,h=n.x-i.x,c=n.y-i.y,l=e.x-i.x,u=e.y-i.y,E=s*h-a*c,p=s*l-a*u;if(1e-10<Math.abs(E)){if(E>0){if(0>p||p>E)return[];if(h=c*l-h*u,0>h||h>E)return[]}else{if(p>0||E>p)return[];if(h=c*l-h*u,h>0||E>h)return[]}return 0==h?!o||0!=p&&p!=E?[e]:[]:h==E?!o||0!=p&&p!=E?[t]:[]:0==p?[i]:p==E?[n]:(o=h/E,[{x:e.x+o*a,y:e.y+o*s}])}return 0!=p||c*l!=h*u?[]:(s=0==a&&0==s,h=0==h&&0==c,s&&h?e.x!=i.x||e.y!=i.y?[]:[e]:s?r(i,n,e)?[e]:[]:h?r(e,t,i)?[i]:[]:(0!=a?(e.x<t.x?(a=e,h=e.x,s=t,e=t.x):(a=t,h=t.x,s=e,e=e.x),i.x<n.x?(t=i,E=i.x,c=n,i=n.x):(t=n,E=n.x,c=i,i=i.x)):(e.y<t.y?(a=e,h=e.y,s=t,e=t.y):(a=t,h=t.y,s=e,e=e.y),i.y<n.y?(t=i,E=i.y,c=n,i=n.y):(t=n,E=n.y,c=i,i=i.y)),E>=h?E>e?[]:e==E?o?[]:[t]:i>=e?[t,s]:[t,c]:h>i?[]:h==i?o?[]:[a]:i>=e?[a,s]:[a,c]))}function n(e,t,r,i){var n=t.x-e.x,o=t.y-e.y;t=r.x-e.x,r=r.y-e.y;var a=i.x-e.x;return i=i.y-e.y,e=n*r-o*t,n=n*i-o*a,1e-10<Math.abs(e)?(t=a*r-i*t,e>0?n>=0&&t>=0:n>=0||t>=0):n>0}var o,a,s,h,c,l={};for(s=e.concat(),o=0,a=t.length;a>o;o++)Array.prototype.push.apply(s,t[o]);for(o=0,a=s.length;a>o;o++)c=s[o].x+":"+s[o].y,void 0!==l[c]&&THREE.warn("THREE.Shape: Duplicate point",c),l[c]=o;o=function(e,t){function r(e,t){var r=m.length-1,i=e-1;0>i&&(i=r);var o=e+1;return o>r&&(o=0),(r=n(m[e],m[i],m[o],s[t]))?(r=s.length-1,i=t-1,0>i&&(i=r),o=t+1,o>r&&(o=0),(r=n(s[t],s[i],s[o],m[e]))?!0:!1):!1}function o(e,t){var r,n;for(r=0;r<m.length;r++)if(n=r+1,
	n%=m.length,n=i(e,t,m[r],m[n],!0),0<n.length)return!0;return!1}function a(e,r){var n,o,a,s;for(n=0;n<T.length;n++)for(o=t[T[n]],a=0;a<o.length;a++)if(s=a+1,s%=o.length,s=i(e,r,o[a],o[s],!0),0<s.length)return!0;return!1}var s,h,c,l,u,E,p,d,f,m=e.concat(),T=[],g=[],R=0;for(h=t.length;h>R;R++)T.push(R);p=0;for(var y=2*T.length;0<T.length;){if(y--,0>y){console.log("Infinite Loop! Holes left:"+T.length+", Probably Hole outside Shape!");break}for(c=p;c<m.length;c++){for(l=m[c],h=-1,R=0;R<T.length;R++)if(u=T[R],E=l.x+":"+l.y+":"+u,void 0===g[E]){for(s=t[u],d=0;d<s.length;d++)if(u=s[d],r(c,d)&&!o(l,u)&&!a(l,u)){h=d,T.splice(R,1),p=m.slice(0,c+1),u=m.slice(c),d=s.slice(h),f=s.slice(0,h+1),m=p.concat(d).concat(f).concat(u),p=c;break}if(h>=0)break;g[E]=!0}if(h>=0)break}}return m}(e,t);var u=THREE.FontUtils.Triangulate(o,!1);for(o=0,a=u.length;a>o;o++)for(h=u[o],s=0;3>s;s++)c=h[s].x+":"+h[s].y,c=l[c],void 0!==c&&(h[s]=c);return u.concat()},isClockWise:function(e){return 0>THREE.FontUtils.Triangulate.area(e)},b2p0:function(e,t){var r=1-e;return r*r*t},b2p1:function(e,t){return 2*(1-e)*e*t},b2p2:function(e,t){return e*e*t},b2:function(e,t,r,i){return this.b2p0(e,t)+this.b2p1(e,r)+this.b2p2(e,i)},b3p0:function(e,t){var r=1-e;return r*r*r*t},b3p1:function(e,t){var r=1-e;return 3*r*r*e*t},b3p2:function(e,t){return 3*(1-e)*e*e*t},b3p3:function(e,t){return e*e*e*t},b3:function(e,t,r,i,n){return this.b3p0(e,t)+this.b3p1(e,r)+this.b3p2(e,i)+this.b3p3(e,n)}},THREE.LineCurve=function(e,t){this.v1=e,this.v2=t},THREE.LineCurve.prototype=Object.create(THREE.Curve.prototype),THREE.LineCurve.prototype.constructor=THREE.LineCurve,THREE.LineCurve.prototype.getPoint=function(e){var t=this.v2.clone().sub(this.v1);return t.multiplyScalar(e).add(this.v1),t},THREE.LineCurve.prototype.getPointAt=function(e){return this.getPoint(e)},THREE.LineCurve.prototype.getTangent=function(e){return this.v2.clone().sub(this.v1).normalize()},THREE.QuadraticBezierCurve=function(e,t,r){this.v0=e,this.v1=t,this.v2=r},THREE.QuadraticBezierCurve.prototype=Object.create(THREE.Curve.prototype),THREE.QuadraticBezierCurve.prototype.constructor=THREE.QuadraticBezierCurve,THREE.QuadraticBezierCurve.prototype.getPoint=function(e){var t=new THREE.Vector2;return t.x=THREE.Shape.Utils.b2(e,this.v0.x,this.v1.x,this.v2.x),t.y=THREE.Shape.Utils.b2(e,this.v0.y,this.v1.y,this.v2.y),t},THREE.QuadraticBezierCurve.prototype.getTangent=function(e){var t=new THREE.Vector2;return t.x=THREE.Curve.Utils.tangentQuadraticBezier(e,this.v0.x,this.v1.x,this.v2.x),t.y=THREE.Curve.Utils.tangentQuadraticBezier(e,this.v0.y,this.v1.y,this.v2.y),t.normalize()},THREE.CubicBezierCurve=function(e,t,r,i){this.v0=e,this.v1=t,this.v2=r,this.v3=i},THREE.CubicBezierCurve.prototype=Object.create(THREE.Curve.prototype),THREE.CubicBezierCurve.prototype.constructor=THREE.CubicBezierCurve,THREE.CubicBezierCurve.prototype.getPoint=function(e){var t;return t=THREE.Shape.Utils.b3(e,this.v0.x,this.v1.x,this.v2.x,this.v3.x),e=THREE.Shape.Utils.b3(e,this.v0.y,this.v1.y,this.v2.y,this.v3.y),new THREE.Vector2(t,e)},THREE.CubicBezierCurve.prototype.getTangent=function(e){var t;return t=THREE.Curve.Utils.tangentCubicBezier(e,this.v0.x,this.v1.x,this.v2.x,this.v3.x),e=THREE.Curve.Utils.tangentCubicBezier(e,this.v0.y,this.v1.y,this.v2.y,this.v3.y),t=new THREE.Vector2(t,e),t.normalize(),t},THREE.SplineCurve=function(e){this.points=void 0==e?[]:e},THREE.SplineCurve.prototype=Object.create(THREE.Curve.prototype),THREE.SplineCurve.prototype.constructor=THREE.SplineCurve,THREE.SplineCurve.prototype.getPoint=function(e){var t=this.points;e*=t.length-1;var r=Math.floor(e);e-=r;var i=t[0==r?r:r-1],n=t[r],o=t[r>t.length-2?t.length-1:r+1],t=t[r>t.length-3?t.length-1:r+2],r=new THREE.Vector2;return r.x=THREE.Curve.Utils.interpolate(i.x,n.x,o.x,t.x,e),r.y=THREE.Curve.Utils.interpolate(i.y,n.y,o.y,t.y,e),r},THREE.EllipseCurve=function(e,t,r,i,n,o,a){this.aX=e,this.aY=t,this.xRadius=r,this.yRadius=i,this.aStartAngle=n,this.aEndAngle=o,this.aClockwise=a},THREE.EllipseCurve.prototype=Object.create(THREE.Curve.prototype),THREE.EllipseCurve.prototype.constructor=THREE.EllipseCurve,THREE.EllipseCurve.prototype.getPoint=function(e){var t=this.aEndAngle-this.aStartAngle;return 0>t&&(t+=2*Math.PI),t>2*Math.PI&&(t-=2*Math.PI),e=!0===this.aClockwise?this.aEndAngle+(1-e)*(2*Math.PI-t):this.aStartAngle+e*t,t=new THREE.Vector2,t.x=this.aX+this.xRadius*Math.cos(e),t.y=this.aY+this.yRadius*Math.sin(e),t},THREE.ArcCurve=function(e,t,r,i,n,o){THREE.EllipseCurve.call(this,e,t,r,r,i,n,o)},THREE.ArcCurve.prototype=Object.create(THREE.EllipseCurve.prototype),THREE.ArcCurve.prototype.constructor=THREE.ArcCurve,THREE.LineCurve3=THREE.Curve.create(function(e,t){this.v1=e,this.v2=t},function(e){var t=new THREE.Vector3;return t.subVectors(this.v2,this.v1),t.multiplyScalar(e),t.add(this.v1),t}),THREE.QuadraticBezierCurve3=THREE.Curve.create(function(e,t,r){this.v0=e,this.v1=t,this.v2=r},function(e){var t=new THREE.Vector3;return t.x=THREE.Shape.Utils.b2(e,this.v0.x,this.v1.x,this.v2.x),t.y=THREE.Shape.Utils.b2(e,this.v0.y,this.v1.y,this.v2.y),t.z=THREE.Shape.Utils.b2(e,this.v0.z,this.v1.z,this.v2.z),t}),THREE.CubicBezierCurve3=THREE.Curve.create(function(e,t,r,i){this.v0=e,this.v1=t,this.v2=r,this.v3=i},function(e){var t=new THREE.Vector3;return t.x=THREE.Shape.Utils.b3(e,this.v0.x,this.v1.x,this.v2.x,this.v3.x),t.y=THREE.Shape.Utils.b3(e,this.v0.y,this.v1.y,this.v2.y,this.v3.y),t.z=THREE.Shape.Utils.b3(e,this.v0.z,this.v1.z,this.v2.z,this.v3.z),t}),THREE.SplineCurve3=THREE.Curve.create(function(e){this.points=void 0==e?[]:e},function(e){var t=this.points;e*=t.length-1;var r=Math.floor(e);e-=r;var i=t[0==r?r:r-1],n=t[r],o=t[r>t.length-2?t.length-1:r+1],t=t[r>t.length-3?t.length-1:r+2],r=new THREE.Vector3;return r.x=THREE.Curve.Utils.interpolate(i.x,n.x,o.x,t.x,e),r.y=THREE.Curve.Utils.interpolate(i.y,n.y,o.y,t.y,e),r.z=THREE.Curve.Utils.interpolate(i.z,n.z,o.z,t.z,e),r}),THREE.ClosedSplineCurve3=THREE.Curve.create(function(e){this.points=void 0==e?[]:e},function(e){var t=this.points;e*=t.length-0;var r=Math.floor(e);e-=r;var r=r+(r>0?0:(Math.floor(Math.abs(r)/t.length)+1)*t.length),i=t[(r-1)%t.length],n=t[r%t.length],o=t[(r+1)%t.length],t=t[(r+2)%t.length],r=new THREE.Vector3;return r.x=THREE.Curve.Utils.interpolate(i.x,n.x,o.x,t.x,e),r.y=THREE.Curve.Utils.interpolate(i.y,n.y,o.y,t.y,e),r.z=THREE.Curve.Utils.interpolate(i.z,n.z,o.z,t.z,e),r}),THREE.AnimationHandler={LINEAR:0,CATMULLROM:1,CATMULLROM_FORWARD:2,add:function(){THREE.warn("THREE.AnimationHandler.add() has been deprecated.")},get:function(){THREE.warn("THREE.AnimationHandler.get() has been deprecated.")},remove:function(){THREE.warn("THREE.AnimationHandler.remove() has been deprecated.")},animations:[],init:function(e){if(!0===e.initialized)return e;for(var t=0;t<e.hierarchy.length;t++){for(var r=0;r<e.hierarchy[t].keys.length;r++)if(0>e.hierarchy[t].keys[r].time&&(e.hierarchy[t].keys[r].time=0),void 0!==e.hierarchy[t].keys[r].rot&&!(e.hierarchy[t].keys[r].rot instanceof THREE.Quaternion)){var i=e.hierarchy[t].keys[r].rot;e.hierarchy[t].keys[r].rot=(new THREE.Quaternion).fromArray(i)}if(e.hierarchy[t].keys.length&&void 0!==e.hierarchy[t].keys[0].morphTargets){for(i={},r=0;r<e.hierarchy[t].keys.length;r++)for(var n=0;n<e.hierarchy[t].keys[r].morphTargets.length;n++){var o=e.hierarchy[t].keys[r].morphTargets[n];i[o]=-1}for(e.hierarchy[t].usedMorphTargets=i,r=0;r<e.hierarchy[t].keys.length;r++){var a={};for(o in i){for(n=0;n<e.hierarchy[t].keys[r].morphTargets.length;n++)if(e.hierarchy[t].keys[r].morphTargets[n]===o){a[o]=e.hierarchy[t].keys[r].morphTargetsInfluences[n];break}n===e.hierarchy[t].keys[r].morphTargets.length&&(a[o]=0)}e.hierarchy[t].keys[r].morphTargetsInfluences=a}}for(r=1;r<e.hierarchy[t].keys.length;r++)e.hierarchy[t].keys[r].time===e.hierarchy[t].keys[r-1].time&&(e.hierarchy[t].keys.splice(r,1),r--);for(r=0;r<e.hierarchy[t].keys.length;r++)e.hierarchy[t].keys[r].index=r}return e.initialized=!0,e},parse:function(e){var t=function(e,r){r.push(e);for(var i=0;i<e.children.length;i++)t(e.children[i],r)},r=[];if(e instanceof THREE.SkinnedMesh)for(var i=0;i<e.skeleton.bones.length;i++)r.push(e.skeleton.bones[i]);else t(e,r);return r},play:function(e){-1===this.animations.indexOf(e)&&this.animations.push(e)},stop:function(e){e=this.animations.indexOf(e),-1!==e&&this.animations.splice(e,1)},update:function(e){for(var t=0;t<this.animations.length;t++)this.animations[t].resetBlendWeights();for(t=0;t<this.animations.length;t++)this.animations[t].update(e)}},THREE.Animation=function(e,t){this.root=e,this.data=THREE.AnimationHandler.init(t),this.hierarchy=THREE.AnimationHandler.parse(e),this.currentTime=0,this.timeScale=1,this.isPlaying=!1,this.loop=!0,this.weight=0,this.interpolationType=THREE.AnimationHandler.LINEAR},THREE.Animation.prototype={constructor:THREE.Animation,keyTypes:["pos","rot","scl"],play:function(e,t){this.currentTime=void 0!==e?e:0,this.weight=void 0!==t?t:1,this.isPlaying=!0,this.reset(),THREE.AnimationHandler.play(this)},stop:function(){this.isPlaying=!1,THREE.AnimationHandler.stop(this)},reset:function(){for(var e=0,t=this.hierarchy.length;t>e;e++){var r=this.hierarchy[e];void 0===r.animationCache&&(r.animationCache={animations:{},blending:{positionWeight:0,quaternionWeight:0,scaleWeight:0}});var i=this.data.name,n=r.animationCache.animations,o=n[i];for(void 0===o&&(o={prevKey:{pos:0,rot:0,scl:0},nextKey:{pos:0,rot:0,scl:0},originalMatrix:r.matrix},n[i]=o),r=0;3>r;r++){for(var i=this.keyTypes[r],n=this.data.hierarchy[e].keys[0],a=this.getNextKeyWith(i,e,1);a.time<this.currentTime&&a.index>n.index;)n=a,a=this.getNextKeyWith(i,e,a.index+1);o.prevKey[i]=n,o.nextKey[i]=a}}},resetBlendWeights:function(){for(var e=0,t=this.hierarchy.length;t>e;e++){var r=this.hierarchy[e].animationCache;void 0!==r&&(r=r.blending,r.positionWeight=0,r.quaternionWeight=0,r.scaleWeight=0)}},update:function(){var e=[],t=new THREE.Vector3,r=new THREE.Vector3,i=new THREE.Quaternion,n=function(e,t){var r,i,n,a,s,h,c=[],l=[];return r=(e.length-1)*t,i=Math.floor(r),r-=i,c[0]=0===i?i:i-1,c[1]=i,c[2]=i>e.length-2?i:i+1,c[3]=i>e.length-3?i:i+2,i=e[c[0]],a=e[c[1]],s=e[c[2]],h=e[c[3]],c=r*r,n=r*c,l[0]=o(i[0],a[0],s[0],h[0],r,c,n),l[1]=o(i[1],a[1],s[1],h[1],r,c,n),l[2]=o(i[2],a[2],s[2],h[2],r,c,n),l},o=function(e,t,r,i,n,o,a){return e=.5*(r-e),i=.5*(i-t),(2*(t-r)+e+i)*a+(-3*(t-r)-2*e-i)*o+e*n+t};return function(o){if(!1!==this.isPlaying&&(this.currentTime+=o*this.timeScale,0!==this.weight)){o=this.data.length,(this.currentTime>o||0>this.currentTime)&&(this.loop?(this.currentTime%=o,0>this.currentTime&&(this.currentTime+=o),this.reset()):this.stop()),o=0;for(var a=this.hierarchy.length;a>o;o++)for(var s=this.hierarchy[o],h=s.animationCache.animations[this.data.name],c=s.animationCache.blending,l=0;3>l;l++){var u=this.keyTypes[l],E=h.prevKey[u],p=h.nextKey[u];if(0<this.timeScale&&p.time<=this.currentTime||0>this.timeScale&&E.time>=this.currentTime){for(E=this.data.hierarchy[o].keys[0],p=this.getNextKeyWith(u,o,1);p.time<this.currentTime&&p.index>E.index;)E=p,p=this.getNextKeyWith(u,o,p.index+1);h.prevKey[u]=E,h.nextKey[u]=p}var d=(this.currentTime-E.time)/(p.time-E.time),f=E[u],m=p[u];0>d&&(d=0),d>1&&(d=1),"pos"===u?this.interpolationType===THREE.AnimationHandler.LINEAR?(r.x=f[0]+(m[0]-f[0])*d,r.y=f[1]+(m[1]-f[1])*d,r.z=f[2]+(m[2]-f[2])*d,E=this.weight/(this.weight+c.positionWeight),s.position.lerp(r,E),c.positionWeight+=this.weight):(this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD)&&(e[0]=this.getPrevKeyWith("pos",o,E.index-1).pos,e[1]=f,e[2]=m,e[3]=this.getNextKeyWith("pos",o,p.index+1).pos,d=.33*d+.33,p=n(e,d),E=this.weight/(this.weight+c.positionWeight),c.positionWeight+=this.weight,u=s.position,u.x+=(p[0]-u.x)*E,u.y+=(p[1]-u.y)*E,u.z+=(p[2]-u.z)*E,this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD&&(d=n(e,1.01*d),t.set(d[0],d[1],d[2]),t.sub(u),t.y=0,t.normalize(),d=Math.atan2(t.x,t.z),s.rotation.set(0,d,0))):"rot"===u?(THREE.Quaternion.slerp(f,m,i,d),0===c.quaternionWeight?(s.quaternion.copy(i),c.quaternionWeight=this.weight):(E=this.weight/(this.weight+c.quaternionWeight),THREE.Quaternion.slerp(s.quaternion,i,s.quaternion,E),c.quaternionWeight+=this.weight)):"scl"===u&&(r.x=f[0]+(m[0]-f[0])*d,r.y=f[1]+(m[1]-f[1])*d,r.z=f[2]+(m[2]-f[2])*d,E=this.weight/(this.weight+c.scaleWeight),s.scale.lerp(r,E),c.scaleWeight+=this.weight)}return!0}}}(),getNextKeyWith:function(e,t,r){var i=this.data.hierarchy[t].keys;for(r=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?r<i.length-1?r:i.length-1:r%i.length;r<i.length;r++)if(void 0!==i[r][e])return i[r];return this.data.hierarchy[t].keys[0]},getPrevKeyWith:function(e,t,r){var i=this.data.hierarchy[t].keys;for(r=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?r>0?r:0:r>=0?r:r+i.length;r>=0;r--)if(void 0!==i[r][e])return i[r];return this.data.hierarchy[t].keys[i.length-1]}},THREE.KeyFrameAnimation=function(e){this.root=e.node,this.data=THREE.AnimationHandler.init(e),this.hierarchy=THREE.AnimationHandler.parse(this.root),this.currentTime=0,this.timeScale=.001,this.isPlaying=!1,this.loop=this.isPaused=!0,e=0;for(var t=this.hierarchy.length;t>e;e++){var r=this.data.hierarchy[e].sids,i=this.hierarchy[e];if(this.data.hierarchy[e].keys.length&&r){for(var n=0;n<r.length;n++){var o=r[n],a=this.getNextKeyWith(o,e,0);a&&a.apply(o)}i.matrixAutoUpdate=!1,this.data.hierarchy[e].node.updateMatrix(),i.matrixWorldNeedsUpdate=!0}}},THREE.KeyFrameAnimation.prototype={constructor:THREE.KeyFrameAnimation,play:function(e){if(this.currentTime=void 0!==e?e:0,!1===this.isPlaying){this.isPlaying=!0;var t,r,i=this.hierarchy.length;for(e=0;i>e;e++)t=this.hierarchy[e],r=this.data.hierarchy[e],void 0===r.animationCache&&(r.animationCache={},r.animationCache.prevKey=null,r.animationCache.nextKey=null,r.animationCache.originalMatrix=t.matrix),t=this.data.hierarchy[e].keys,t.length&&(r.animationCache.prevKey=t[0],r.animationCache.nextKey=t[1],this.startTime=Math.min(t[0].time,this.startTime),this.endTime=Math.max(t[t.length-1].time,this.endTime));this.update(0)}this.isPaused=!1,THREE.AnimationHandler.play(this)},stop:function(){this.isPaused=this.isPlaying=!1,THREE.AnimationHandler.stop(this);for(var e=0;e<this.data.hierarchy.length;e++){var t=this.hierarchy[e],r=this.data.hierarchy[e];if(void 0!==r.animationCache){var i=r.animationCache.originalMatrix;i.copy(t.matrix),t.matrix=i,delete r.animationCache}}},update:function(e){if(!1!==this.isPlaying){this.currentTime+=e*this.timeScale,e=this.data.length,!0===this.loop&&this.currentTime>e&&(this.currentTime%=e),this.currentTime=Math.min(this.currentTime,e),e=0;for(var t=this.hierarchy.length;t>e;e++){var r=this.hierarchy[e],i=this.data.hierarchy[e],n=i.keys,i=i.animationCache;if(n.length){var o=i.prevKey,a=i.nextKey;if(a.time<=this.currentTime){for(;a.time<this.currentTime&&a.index>o.index;)o=a,a=n[o.index+1];i.prevKey=o,i.nextKey=a}a.time>=this.currentTime?o.interpolate(a,this.currentTime):o.interpolate(a,a.time),this.data.hierarchy[e].node.updateMatrix(),r.matrixWorldNeedsUpdate=!0}}}},getNextKeyWith:function(e,t,r){for(t=this.data.hierarchy[t].keys,r%=t.length;r<t.length;r++)if(t[r].hasTarget(e))return t[r];return t[0]},getPrevKeyWith:function(e,t,r){for(t=this.data.hierarchy[t].keys,r=r>=0?r:r+t.length;r>=0;r--)if(t[r].hasTarget(e))return t[r];return t[t.length-1]}},THREE.MorphAnimation=function(e){this.mesh=e,this.frames=e.morphTargetInfluences.length,this.currentTime=0,this.duration=1e3,this.loop=!0,this.currentFrame=this.lastFrame=0,this.isPlaying=!1},THREE.MorphAnimation.prototype={constructor:THREE.MorphAnimation,play:function(){this.isPlaying=!0},pause:function(){this.isPlaying=!1},update:function(e){if(!1!==this.isPlaying){this.currentTime+=e,!0===this.loop&&this.currentTime>this.duration&&(this.currentTime%=this.duration),this.currentTime=Math.min(this.currentTime,this.duration),e=this.duration/this.frames;var t=Math.floor(this.currentTime/e),r=this.mesh.morphTargetInfluences;t!=this.currentFrame&&(r[this.lastFrame]=0,r[this.currentFrame]=1,r[t]=0,this.lastFrame=this.currentFrame,this.currentFrame=t),r[t]=this.currentTime%e/e,r[this.lastFrame]=1-r[t]}}},THREE.BoxGeometry=function(e,t,r,i,n,o){function a(e,t,r,i,n,o,a,h){var c,l=s.widthSegments,u=s.heightSegments,E=n/2,p=o/2,d=s.vertices.length;"x"===e&&"y"===t||"y"===e&&"x"===t?c="z":"x"===e&&"z"===t||"z"===e&&"x"===t?(c="y",u=s.depthSegments):("z"===e&&"y"===t||"y"===e&&"z"===t)&&(c="x",l=s.depthSegments);var f=l+1,m=u+1,T=n/l,g=o/u,R=new THREE.Vector3;for(R[c]=a>0?1:-1,n=0;m>n;n++)for(o=0;f>o;o++){var y=new THREE.Vector3;y[e]=(o*T-E)*r,y[t]=(n*g-p)*i,y[c]=a,s.vertices.push(y)}for(n=0;u>n;n++)for(o=0;l>o;o++)p=o+f*n,e=o+f*(n+1),t=o+1+f*(n+1),r=o+1+f*n,i=new THREE.Vector2(o/l,1-n/u),a=new THREE.Vector2(o/l,1-(n+1)/u),c=new THREE.Vector2((o+1)/l,1-(n+1)/u),E=new THREE.Vector2((o+1)/l,1-n/u),p=new THREE.Face3(p+d,e+d,r+d),p.normal.copy(R),p.vertexNormals.push(R.clone(),R.clone(),R.clone()),p.materialIndex=h,s.faces.push(p),s.faceVertexUvs[0].push([i,a,E]),p=new THREE.Face3(e+d,t+d,r+d),p.normal.copy(R),p.vertexNormals.push(R.clone(),R.clone(),R.clone()),p.materialIndex=h,s.faces.push(p),s.faceVertexUvs[0].push([a.clone(),c,E.clone()])}THREE.Geometry.call(this),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:r,widthSegments:i,heightSegments:n,depthSegments:o},this.widthSegments=i||1,this.heightSegments=n||1,this.depthSegments=o||1;var s=this;i=e/2,n=t/2,o=r/2,a("z","y",-1,-1,r,t,i,0),a("z","y",1,-1,r,t,-i,1),a("x","z",1,1,e,r,n,2),a("x","z",1,-1,e,r,-n,3),a("x","y",1,-1,e,t,o,4),a("x","y",-1,-1,e,t,-o,5),this.mergeVertices()},THREE.BoxGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.BoxGeometry.prototype.constructor=THREE.BoxGeometry,THREE.CircleGeometry=function(e,t,r,i){THREE.Geometry.call(this),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:r,thetaLength:i},e=e||50,t=void 0!==t?Math.max(3,t):8,r=void 0!==r?r:0,i=void 0!==i?i:2*Math.PI;var n,o=[];n=new THREE.Vector3;var a=new THREE.Vector2(.5,.5);for(this.vertices.push(n),o.push(a),n=0;t>=n;n++){var s=new THREE.Vector3,h=r+n/t*i;s.x=e*Math.cos(h),s.y=e*Math.sin(h),this.vertices.push(s),o.push(new THREE.Vector2((s.x/e+1)/2,(s.y/e+1)/2))}for(r=new THREE.Vector3(0,0,1),n=1;t>=n;n++)this.faces.push(new THREE.Face3(n,n+1,0,[r.clone(),r.clone(),r.clone()])),this.faceVertexUvs[0].push([o[n].clone(),o[n+1].clone(),a.clone()]);this.computeFaceNormals(),this.boundingSphere=new THREE.Sphere(new THREE.Vector3,e)},THREE.CircleGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.CircleGeometry.prototype.constructor=THREE.CircleGeometry,THREE.CubeGeometry=function(e,t,r,i,n,o){return THREE.warn("THREE.CubeGeometry has been renamed to THREE.BoxGeometry."),new THREE.BoxGeometry(e,t,r,i,n,o)},THREE.CylinderGeometry=function(e,t,r,i,n,o,a,s){THREE.Geometry.call(this),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:r,radialSegments:i,heightSegments:n,openEnded:o,thetaStart:a,thetaLength:s},e=void 0!==e?e:20,t=void 0!==t?t:20,r=void 0!==r?r:100,i=i||8,n=n||1,o=void 0!==o?o:!1,a=void 0!==a?a:0,s=void 0!==s?s:2*Math.PI;var h,c,l=r/2,u=[],E=[];for(c=0;n>=c;c++){var p=[],d=[],f=c/n,m=f*(t-e)+e;for(h=0;i>=h;h++){var T=h/i,g=new THREE.Vector3;g.x=m*Math.sin(T*s+a),g.y=-f*r+l,g.z=m*Math.cos(T*s+a),this.vertices.push(g),p.push(this.vertices.length-1),d.push(new THREE.Vector2(T,1-f))}u.push(p),E.push(d)}for(r=(t-e)/r,h=0;i>h;h++)for(0!==e?(a=this.vertices[u[0][h]].clone(),s=this.vertices[u[0][h+1]].clone()):(a=this.vertices[u[1][h]].clone(),s=this.vertices[u[1][h+1]].clone()),a.setY(Math.sqrt(a.x*a.x+a.z*a.z)*r).normalize(),s.setY(Math.sqrt(s.x*s.x+s.z*s.z)*r).normalize(),c=0;n>c;c++){var p=u[c][h],d=u[c+1][h],f=u[c+1][h+1],m=u[c][h+1],T=a.clone(),g=a.clone(),R=s.clone(),y=s.clone(),v=E[c][h].clone(),H=E[c+1][h].clone(),x=E[c+1][h+1].clone(),b=E[c][h+1].clone();this.faces.push(new THREE.Face3(p,d,m,[T,g,y])),this.faceVertexUvs[0].push([v,H,b]),this.faces.push(new THREE.Face3(d,f,m,[g.clone(),R,y.clone()])),this.faceVertexUvs[0].push([H.clone(),x,b.clone()])}if(!1===o&&e>0)for(this.vertices.push(new THREE.Vector3(0,l,0)),h=0;i>h;h++)p=u[0][h],d=u[0][h+1],f=this.vertices.length-1,T=new THREE.Vector3(0,1,0),g=new THREE.Vector3(0,1,0),R=new THREE.Vector3(0,1,0),v=E[0][h].clone(),H=E[0][h+1].clone(),x=new THREE.Vector2(H.x,0),this.faces.push(new THREE.Face3(p,d,f,[T,g,R])),this.faceVertexUvs[0].push([v,H,x]);if(!1===o&&t>0)for(this.vertices.push(new THREE.Vector3(0,-l,0)),h=0;i>h;h++)p=u[n][h+1],d=u[n][h],f=this.vertices.length-1,T=new THREE.Vector3(0,-1,0),g=new THREE.Vector3(0,-1,0),R=new THREE.Vector3(0,-1,0),v=E[n][h+1].clone(),H=E[n][h].clone(),x=new THREE.Vector2(H.x,1),this.faces.push(new THREE.Face3(p,d,f,[T,g,R])),this.faceVertexUvs[0].push([v,H,x]);this.computeFaceNormals()},THREE.CylinderGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.CylinderGeometry.prototype.constructor=THREE.CylinderGeometry,THREE.ExtrudeGeometry=function(e,t){"undefined"!=typeof e&&(THREE.Geometry.call(this),this.type="ExtrudeGeometry",e=e instanceof Array?e:[e],this.addShapeList(e,t),this.computeFaceNormals())},THREE.ExtrudeGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.ExtrudeGeometry.prototype.constructor=THREE.ExtrudeGeometry,THREE.ExtrudeGeometry.prototype.addShapeList=function(e,t){for(var r=e.length,i=0;r>i;i++)this.addShape(e[i],t)},THREE.ExtrudeGeometry.prototype.addShape=function(e,t){function r(e,t,r){return t||THREE.error("THREE.ExtrudeGeometry: vec does not exist"),t.clone().multiplyScalar(r).add(e)}function i(e,t,r){var i=1,i=e.x-t.x,n=e.y-t.y,o=r.x-e.x,a=r.y-e.y,s=i*i+n*n;if(1e-10<Math.abs(i*a-n*o)){var h=Math.sqrt(s),c=Math.sqrt(o*o+a*a),s=t.x-n/h;if(t=t.y+i/h,o=((r.x-a/c-s)*a-(r.y+o/c-t)*o)/(i*a-n*o),r=s+i*o-e.x,e=t+n*o-e.y,i=r*r+e*e,2>=i)return new THREE.Vector2(r,e);i=Math.sqrt(i/2)}else e=!1,i>1e-10?o>1e-10&&(e=!0):-1e-10>i?-1e-10>o&&(e=!0):Math.sign(n)==Math.sign(a)&&(e=!0),e?(r=-n,e=i,i=Math.sqrt(s)):(r=i,e=n,i=Math.sqrt(s/2));return new THREE.Vector2(r/i,e/i)}function n(e,t){var r,i;for(k=e.length;0<=--k;){r=k,i=k-1,0>i&&(i=e.length-1);for(var n=0,o=g+2*f,n=0;o>n;n++){var a=O*n,s=O*(n+1),h=t+r+a,a=t+i+a,c=t+i+s,s=t+r+s,h=h+S,a=a+S,c=c+S,s=s+S;M.faces.push(new THREE.Face3(h,a,s,null,null,H)),M.faces.push(new THREE.Face3(a,c,s,null,null,H)),h=x.generateSideWallUV(M,h,a,c,s),M.faceVertexUvs[0].push([h[0],h[1],h[3]]),M.faceVertexUvs[0].push([h[1],h[2],h[3]])}}}function o(e,t,r){M.vertices.push(new THREE.Vector3(e,t,r))}function a(e,t,r){e+=S,t+=S,r+=S,M.faces.push(new THREE.Face3(e,t,r,null,null,v)),e=x.generateTopUV(M,e,t,r),M.faceVertexUvs[0].push(e)}var s,h,c,l,u,E=void 0!==t.amount?t.amount:100,p=void 0!==t.bevelThickness?t.bevelThickness:6,d=void 0!==t.bevelSize?t.bevelSize:p-2,f=void 0!==t.bevelSegments?t.bevelSegments:3,m=void 0!==t.bevelEnabled?t.bevelEnabled:!0,T=void 0!==t.curveSegments?t.curveSegments:12,g=void 0!==t.steps?t.steps:1,R=t.extrudePath,y=!1,v=t.material,H=t.extrudeMaterial,x=void 0!==t.UVGenerator?t.UVGenerator:THREE.ExtrudeGeometry.WorldUVGenerator;R&&(s=R.getSpacedPoints(g),y=!0,m=!1,h=void 0!==t.frames?t.frames:new THREE.TubeGeometry.FrenetFrames(R,g,!1),c=new THREE.Vector3,l=new THREE.Vector3,u=new THREE.Vector3),m||(d=p=f=0);var b,w,_,M=this,S=this.vertices.length,R=e.extractPoints(T),T=R.shape,A=R.holes;if(R=!THREE.Shape.Utils.isClockWise(T)){for(T=T.reverse(),w=0,_=A.length;_>w;w++)b=A[w],THREE.Shape.Utils.isClockWise(b)&&(A[w]=b.reverse());R=!1}var C=THREE.Shape.Utils.triangulateShape(T,A),L=T;for(w=0,_=A.length;_>w;w++)b=A[w],T=T.concat(b);var P,F,D,U,B,V,O=T.length,N=C.length,R=[],k=0;for(D=L.length,P=D-1,F=k+1;D>k;k++,P++,F++)P===D&&(P=0),F===D&&(F=0),R[k]=i(L[k],L[P],L[F]);var z,I=[],G=R.concat();for(w=0,_=A.length;_>w;w++){for(b=A[w],z=[],k=0,D=b.length,P=D-1,F=k+1;D>k;k++,P++,F++)P===D&&(P=0),F===D&&(F=0),z[k]=i(b[k],b[P],b[F]);I.push(z),G=G.concat(z)}for(P=0;f>P;P++){for(D=P/f,U=p*(1-D),F=d*Math.sin(D*Math.PI/2),k=0,D=L.length;D>k;k++)B=r(L[k],R[k],F),o(B.x,B.y,-U);for(w=0,_=A.length;_>w;w++)for(b=A[w],z=I[w],k=0,D=b.length;D>k;k++)B=r(b[k],z[k],F),o(B.x,B.y,-U)}for(F=d,k=0;O>k;k++)B=m?r(T[k],G[k],F):T[k],y?(l.copy(h.normals[0]).multiplyScalar(B.x),c.copy(h.binormals[0]).multiplyScalar(B.y),u.copy(s[0]).add(l).add(c),o(u.x,u.y,u.z)):o(B.x,B.y,0);for(D=1;g>=D;D++)for(k=0;O>k;k++)B=m?r(T[k],G[k],F):T[k],y?(l.copy(h.normals[D]).multiplyScalar(B.x),c.copy(h.binormals[D]).multiplyScalar(B.y),u.copy(s[D]).add(l).add(c),o(u.x,u.y,u.z)):o(B.x,B.y,E/g*D);for(P=f-1;P>=0;P--){for(D=P/f,U=p*(1-D),F=d*Math.sin(D*Math.PI/2),k=0,D=L.length;D>k;k++)B=r(L[k],R[k],F),o(B.x,B.y,E+U);for(w=0,_=A.length;_>w;w++)for(b=A[w],z=I[w],k=0,D=b.length;D>k;k++)B=r(b[k],z[k],F),y?o(B.x,B.y+s[g-1].y,s[g-1].x+U):o(B.x,B.y,E+U)}!function(){if(m){var e;for(e=0*O,k=0;N>k;k++)V=C[k],a(V[2]+e,V[1]+e,V[0]+e);for(e=g+2*f,e*=O,k=0;N>k;k++)V=C[k],a(V[0]+e,V[1]+e,V[2]+e)}else{for(k=0;N>k;k++)V=C[k],a(V[2],V[1],V[0]);for(k=0;N>k;k++)V=C[k],a(V[0]+O*g,V[1]+O*g,V[2]+O*g)}}(),function(){var e=0;for(n(L,e),e+=L.length,w=0,_=A.length;_>w;w++)b=A[w],n(b,e),e+=b.length}()},THREE.ExtrudeGeometry.WorldUVGenerator={generateTopUV:function(e,t,r,i){return e=e.vertices,t=e[t],r=e[r],i=e[i],[new THREE.Vector2(t.x,t.y),new THREE.Vector2(r.x,r.y),new THREE.Vector2(i.x,i.y)]},generateSideWallUV:function(e,t,r,i,n){return e=e.vertices,t=e[t],r=e[r],i=e[i],n=e[n],.01>Math.abs(t.y-r.y)?[new THREE.Vector2(t.x,1-t.z),new THREE.Vector2(r.x,1-r.z),new THREE.Vector2(i.x,1-i.z),new THREE.Vector2(n.x,1-n.z)]:[new THREE.Vector2(t.y,1-t.z),new THREE.Vector2(r.y,1-r.z),new THREE.Vector2(i.y,1-i.z),new THREE.Vector2(n.y,1-n.z)]}},THREE.ShapeGeometry=function(e,t){THREE.Geometry.call(this),this.type="ShapeGeometry",!1==e instanceof Array&&(e=[e]),this.addShapeList(e,t),this.computeFaceNormals()},THREE.ShapeGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.ShapeGeometry.prototype.constructor=THREE.ShapeGeometry,THREE.ShapeGeometry.prototype.addShapeList=function(e,t){for(var r=0,i=e.length;i>r;r++)this.addShape(e[r],t);return this},THREE.ShapeGeometry.prototype.addShape=function(e,t){void 0===t&&(t={});var r,i,n,o=t.material,a=void 0===t.UVGenerator?THREE.ExtrudeGeometry.WorldUVGenerator:t.UVGenerator,s=this.vertices.length;r=e.extractPoints(void 0!==t.curveSegments?t.curveSegments:12);var h=r.shape,c=r.holes;if(!THREE.Shape.Utils.isClockWise(h))for(h=h.reverse(),r=0,i=c.length;i>r;r++)n=c[r],THREE.Shape.Utils.isClockWise(n)&&(c[r]=n.reverse());var l=THREE.Shape.Utils.triangulateShape(h,c);for(r=0,i=c.length;i>r;r++)n=c[r],h=h.concat(n);for(c=h.length,i=l.length,r=0;c>r;r++)n=h[r],this.vertices.push(new THREE.Vector3(n.x,n.y,0));for(r=0;i>r;r++)c=l[r],h=c[0]+s,n=c[1]+s,c=c[2]+s,this.faces.push(new THREE.Face3(h,n,c,null,null,o)),this.faceVertexUvs[0].push(a.generateTopUV(this,h,n,c))},THREE.LatheGeometry=function(e,t,r,i){THREE.Geometry.call(this),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:r,phiLength:i},t=t||12,r=r||0,i=i||2*Math.PI;for(var n=1/(e.length-1),o=1/t,a=0,s=t;s>=a;a++)for(var h=r+a*o*i,c=Math.cos(h),l=Math.sin(h),h=0,u=e.length;u>h;h++){var E=e[h],p=new THREE.Vector3;p.x=c*E.x-l*E.y,p.y=l*E.x+c*E.y,p.z=E.z,this.vertices.push(p)}for(r=e.length,a=0,s=t;s>a;a++)for(h=0,u=e.length-1;u>h;h++){t=l=h+r*a,i=l+r;var c=l+1+r,l=l+1,E=a*o,p=h*n,d=E+o,f=p+n;this.faces.push(new THREE.Face3(t,i,l)),this.faceVertexUvs[0].push([new THREE.Vector2(E,p),new THREE.Vector2(d,p),new THREE.Vector2(E,f)]),this.faces.push(new THREE.Face3(i,c,l)),this.faceVertexUvs[0].push([new THREE.Vector2(d,p),new THREE.Vector2(d,f),new THREE.Vector2(E,f)])}this.mergeVertices(),this.computeFaceNormals(),this.computeVertexNormals()},THREE.LatheGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.LatheGeometry.prototype.constructor=THREE.LatheGeometry,THREE.PlaneGeometry=function(e,t,r,i){console.info("THREE.PlaneGeometry: Consider using THREE.PlaneBufferGeometry for lower memory footprint."),THREE.Geometry.call(this),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:i},this.fromBufferGeometry(new THREE.PlaneBufferGeometry(e,t,r,i))},THREE.PlaneGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.PlaneGeometry.prototype.constructor=THREE.PlaneGeometry,THREE.PlaneBufferGeometry=function(e,t,r,i){THREE.BufferGeometry.call(this),this.type="PlaneBufferGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:i};var n=e/2,o=t/2;r=r||1,i=i||1;var a=r+1,s=i+1,h=e/r,c=t/i;t=new Float32Array(a*s*3),e=new Float32Array(a*s*3);for(var l=new Float32Array(a*s*2),u=0,E=0,p=0;s>p;p++)for(var d=p*c-o,f=0;a>f;f++)t[u]=f*h-n,t[u+1]=-d,e[u+2]=1,l[E]=f/r,l[E+1]=1-p/i,u+=3,E+=2;for(u=0,n=new(65535<t.length/3?Uint32Array:Uint16Array)(r*i*6),p=0;i>p;p++)for(f=0;r>f;f++)o=f+a*(p+1),s=f+1+a*(p+1),h=f+1+a*p,n[u]=f+a*p,n[u+1]=o,n[u+2]=h,n[u+3]=o,n[u+4]=s,n[u+5]=h,u+=6;this.addAttribute("index",new THREE.BufferAttribute(n,1)),this.addAttribute("position",new THREE.BufferAttribute(t,3)),this.addAttribute("normal",new THREE.BufferAttribute(e,3)),this.addAttribute("uv",new THREE.BufferAttribute(l,2))},THREE.PlaneBufferGeometry.prototype=Object.create(THREE.BufferGeometry.prototype),THREE.PlaneBufferGeometry.prototype.constructor=THREE.PlaneBufferGeometry,THREE.RingGeometry=function(e,t,r,i,n,o){THREE.Geometry.call(this),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:r,phiSegments:i,thetaStart:n,thetaLength:o},e=e||0,t=t||50,n=void 0!==n?n:0,o=void 0!==o?o:2*Math.PI,r=void 0!==r?Math.max(3,r):8,i=void 0!==i?Math.max(1,i):8;var a,s=[],h=e,c=(t-e)/i;for(e=0;i+1>e;e++){for(a=0;r+1>a;a++){var l=new THREE.Vector3,u=n+a/r*o;l.x=h*Math.cos(u),l.y=h*Math.sin(u),this.vertices.push(l),s.push(new THREE.Vector2((l.x/t+1)/2,(l.y/t+1)/2))}h+=c}for(t=new THREE.Vector3(0,0,1),e=0;i>e;e++)for(n=e*(r+1),a=0;r>a;a++)o=u=a+n,c=u+r+1,l=u+r+2,this.faces.push(new THREE.Face3(o,c,l,[t.clone(),t.clone(),t.clone()])),this.faceVertexUvs[0].push([s[o].clone(),s[c].clone(),s[l].clone()]),o=u,c=u+r+2,l=u+1,this.faces.push(new THREE.Face3(o,c,l,[t.clone(),t.clone(),t.clone()])),this.faceVertexUvs[0].push([s[o].clone(),s[c].clone(),s[l].clone()]);this.computeFaceNormals(),this.boundingSphere=new THREE.Sphere(new THREE.Vector3,h)},THREE.RingGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.RingGeometry.prototype.constructor=THREE.RingGeometry,THREE.SphereGeometry=function(e,t,r,i,n,o,a){THREE.Geometry.call(this),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:r,phiStart:i,phiLength:n,thetaStart:o,thetaLength:a},e=e||50,t=Math.max(3,Math.floor(t)||8),r=Math.max(2,Math.floor(r)||6),i=void 0!==i?i:0,n=void 0!==n?n:2*Math.PI,o=void 0!==o?o:0,a=void 0!==a?a:Math.PI;var s,h,c=[],l=[];for(h=0;r>=h;h++){var u=[],E=[];for(s=0;t>=s;s++){var p=s/t,d=h/r,f=new THREE.Vector3;f.x=-e*Math.cos(i+p*n)*Math.sin(o+d*a),f.y=e*Math.cos(o+d*a),f.z=e*Math.sin(i+p*n)*Math.sin(o+d*a),this.vertices.push(f),u.push(this.vertices.length-1),E.push(new THREE.Vector2(p,1-d))}c.push(u),l.push(E)}for(h=0;r>h;h++)for(s=0;t>s;s++){i=c[h][s+1],n=c[h][s],o=c[h+1][s],a=c[h+1][s+1];var u=this.vertices[i].clone().normalize(),E=this.vertices[n].clone().normalize(),p=this.vertices[o].clone().normalize(),d=this.vertices[a].clone().normalize(),f=l[h][s+1].clone(),m=l[h][s].clone(),T=l[h+1][s].clone(),g=l[h+1][s+1].clone();Math.abs(this.vertices[i].y)===e?(f.x=(f.x+m.x)/2,this.faces.push(new THREE.Face3(i,o,a,[u,p,d])),this.faceVertexUvs[0].push([f,T,g])):Math.abs(this.vertices[o].y)===e?(T.x=(T.x+g.x)/2,this.faces.push(new THREE.Face3(i,n,o,[u,E,p])),this.faceVertexUvs[0].push([f,m,T])):(this.faces.push(new THREE.Face3(i,n,a,[u,E,d])),this.faceVertexUvs[0].push([f,m,g]),
	this.faces.push(new THREE.Face3(n,o,a,[E.clone(),p,d.clone()])),this.faceVertexUvs[0].push([m.clone(),T,g.clone()]))}this.computeFaceNormals(),this.boundingSphere=new THREE.Sphere(new THREE.Vector3,e)},THREE.SphereGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.SphereGeometry.prototype.constructor=THREE.SphereGeometry,THREE.TextGeometry=function(e,t){t=t||{};var r=THREE.FontUtils.generateShapes(e,t);t.amount=void 0!==t.height?t.height:50,void 0===t.bevelThickness&&(t.bevelThickness=10),void 0===t.bevelSize&&(t.bevelSize=8),void 0===t.bevelEnabled&&(t.bevelEnabled=!1),THREE.ExtrudeGeometry.call(this,r,t),this.type="TextGeometry"},THREE.TextGeometry.prototype=Object.create(THREE.ExtrudeGeometry.prototype),THREE.TextGeometry.prototype.constructor=THREE.TextGeometry,THREE.TorusGeometry=function(e,t,r,i,n){THREE.Geometry.call(this),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:r,tubularSegments:i,arc:n},e=e||100,t=t||40,r=r||8,i=i||6,n=n||2*Math.PI;for(var o=new THREE.Vector3,a=[],s=[],h=0;r>=h;h++)for(var c=0;i>=c;c++){var l=c/i*n,u=h/r*Math.PI*2;o.x=e*Math.cos(l),o.y=e*Math.sin(l);var E=new THREE.Vector3;E.x=(e+t*Math.cos(u))*Math.cos(l),E.y=(e+t*Math.cos(u))*Math.sin(l),E.z=t*Math.sin(u),this.vertices.push(E),a.push(new THREE.Vector2(c/i,h/r)),s.push(E.clone().sub(o).normalize())}for(h=1;r>=h;h++)for(c=1;i>=c;c++)e=(i+1)*h+c-1,t=(i+1)*(h-1)+c-1,n=(i+1)*(h-1)+c,o=(i+1)*h+c,l=new THREE.Face3(e,t,o,[s[e].clone(),s[t].clone(),s[o].clone()]),this.faces.push(l),this.faceVertexUvs[0].push([a[e].clone(),a[t].clone(),a[o].clone()]),l=new THREE.Face3(t,n,o,[s[t].clone(),s[n].clone(),s[o].clone()]),this.faces.push(l),this.faceVertexUvs[0].push([a[t].clone(),a[n].clone(),a[o].clone()]);this.computeFaceNormals()},THREE.TorusGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.TorusGeometry.prototype.constructor=THREE.TorusGeometry,THREE.TorusKnotGeometry=function(e,t,r,i,n,o,a){function s(e,t,r,i,n){var o=Math.cos(e),a=Math.sin(e);return e*=t/r,t=Math.cos(e),o*=i*(2+t)*.5,a=i*(2+t)*a*.5,i=n*i*Math.sin(e)*.5,new THREE.Vector3(o,a,i)}THREE.Geometry.call(this),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,radialSegments:r,tubularSegments:i,p:n,q:o,heightScale:a},e=e||100,t=t||40,r=r||64,i=i||8,n=n||2,o=o||3,a=a||1;for(var h=Array(r),c=new THREE.Vector3,l=new THREE.Vector3,u=new THREE.Vector3,E=0;r>E;++E){h[E]=Array(i);var p=E/r*2*n*Math.PI,d=s(p,o,n,e,a),p=s(p+.01,o,n,e,a);for(c.subVectors(p,d),l.addVectors(p,d),u.crossVectors(c,l),l.crossVectors(u,c),u.normalize(),l.normalize(),p=0;i>p;++p){var f=p/i*2*Math.PI,m=-t*Math.cos(f),f=t*Math.sin(f),T=new THREE.Vector3;T.x=d.x+m*l.x+f*u.x,T.y=d.y+m*l.y+f*u.y,T.z=d.z+m*l.z+f*u.z,h[E][p]=this.vertices.push(T)-1}}for(E=0;r>E;++E)for(p=0;i>p;++p)n=(E+1)%r,o=(p+1)%i,e=h[E][p],t=h[n][p],n=h[n][o],o=h[E][o],a=new THREE.Vector2(E/r,p/i),c=new THREE.Vector2((E+1)/r,p/i),l=new THREE.Vector2((E+1)/r,(p+1)/i),u=new THREE.Vector2(E/r,(p+1)/i),this.faces.push(new THREE.Face3(e,t,o)),this.faceVertexUvs[0].push([a,c,u]),this.faces.push(new THREE.Face3(t,n,o)),this.faceVertexUvs[0].push([c.clone(),l,u.clone()]);this.computeFaceNormals(),this.computeVertexNormals()},THREE.TorusKnotGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.TorusKnotGeometry.prototype.constructor=THREE.TorusKnotGeometry,THREE.TubeGeometry=function(e,t,r,i,n,o){THREE.Geometry.call(this),this.type="TubeGeometry",this.parameters={path:e,segments:t,radius:r,radialSegments:i,closed:n},t=t||64,r=r||1,i=i||8,n=n||!1,o=o||THREE.TubeGeometry.NoTaper;var a,s,h,c,l,u,E,p,d,f,m=[],T=t+1,g=new THREE.Vector3;for(p=new THREE.TubeGeometry.FrenetFrames(e,t,n),d=p.normals,f=p.binormals,this.tangents=p.tangents,this.normals=d,this.binormals=f,p=0;T>p;p++)for(m[p]=[],h=p/(T-1),E=e.getPointAt(h),a=d[p],s=f[p],l=r*o(h),h=0;i>h;h++)c=h/i*2*Math.PI,u=-l*Math.cos(c),c=l*Math.sin(c),g.copy(E),g.x+=u*a.x+c*s.x,g.y+=u*a.y+c*s.y,g.z+=u*a.z+c*s.z,m[p][h]=this.vertices.push(new THREE.Vector3(g.x,g.y,g.z))-1;for(p=0;t>p;p++)for(h=0;i>h;h++)o=n?(p+1)%t:p+1,T=(h+1)%i,e=m[p][h],r=m[o][h],o=m[o][T],T=m[p][T],g=new THREE.Vector2(p/t,h/i),d=new THREE.Vector2((p+1)/t,h/i),f=new THREE.Vector2((p+1)/t,(h+1)/i),a=new THREE.Vector2(p/t,(h+1)/i),this.faces.push(new THREE.Face3(e,r,T)),this.faceVertexUvs[0].push([g,d,a]),this.faces.push(new THREE.Face3(r,o,T)),this.faceVertexUvs[0].push([d.clone(),f,a.clone()]);this.computeFaceNormals(),this.computeVertexNormals()},THREE.TubeGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.TubeGeometry.prototype.constructor=THREE.TubeGeometry,THREE.TubeGeometry.NoTaper=function(e){return 1},THREE.TubeGeometry.SinusoidalTaper=function(e){return Math.sin(Math.PI*e)},THREE.TubeGeometry.FrenetFrames=function(e,t,r){var i=new THREE.Vector3,n=[],o=[],a=[],s=new THREE.Vector3,h=new THREE.Matrix4;t+=1;var c,l,u;for(this.tangents=n,this.normals=o,this.binormals=a,c=0;t>c;c++)l=c/(t-1),n[c]=e.getTangentAt(l),n[c].normalize();for(o[0]=new THREE.Vector3,a[0]=new THREE.Vector3,e=Number.MAX_VALUE,c=Math.abs(n[0].x),l=Math.abs(n[0].y),u=Math.abs(n[0].z),e>=c&&(e=c,i.set(1,0,0)),e>=l&&(e=l,i.set(0,1,0)),e>=u&&i.set(0,0,1),s.crossVectors(n[0],i).normalize(),o[0].crossVectors(n[0],s),a[0].crossVectors(n[0],o[0]),c=1;t>c;c++)o[c]=o[c-1].clone(),a[c]=a[c-1].clone(),s.crossVectors(n[c-1],n[c]),1e-4<s.length()&&(s.normalize(),i=Math.acos(THREE.Math.clamp(n[c-1].dot(n[c]),-1,1)),o[c].applyMatrix4(h.makeRotationAxis(s,i))),a[c].crossVectors(n[c],o[c]);if(r)for(i=Math.acos(THREE.Math.clamp(o[0].dot(o[t-1]),-1,1)),i/=t-1,0<n[0].dot(s.crossVectors(o[0],o[t-1]))&&(i=-i),c=1;t>c;c++)o[c].applyMatrix4(h.makeRotationAxis(n[c],i*c)),a[c].crossVectors(n[c],o[c])},THREE.PolyhedronGeometry=function(e,t,r,i){function n(e){var t=e.normalize().clone();t.index=h.vertices.push(t)-1;var r=Math.atan2(e.z,-e.x)/2/Math.PI+.5;return e=Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))/Math.PI+.5,t.uv=new THREE.Vector2(r,1-e),t}function o(e,t,r){var i=new THREE.Face3(e.index,t.index,r.index,[e.clone(),t.clone(),r.clone()]);h.faces.push(i),m.copy(e).add(t).add(r).divideScalar(3),i=Math.atan2(m.z,-m.x),h.faceVertexUvs[0].push([s(e.uv,e,i),s(t.uv,t,i),s(r.uv,r,i)])}function a(e,t){for(var r=Math.pow(2,t),i=n(h.vertices[e.a]),a=n(h.vertices[e.b]),s=n(h.vertices[e.c]),c=[],l=0;r>=l;l++){c[l]=[];for(var u=n(i.clone().lerp(s,l/r)),E=n(a.clone().lerp(s,l/r)),p=r-l,d=0;p>=d;d++)c[l][d]=0==d&&l==r?u:n(u.clone().lerp(E,d/p))}for(l=0;r>l;l++)for(d=0;2*(r-l)-1>d;d++)i=Math.floor(d/2),0==d%2?o(c[l][i+1],c[l+1][i],c[l][i]):o(c[l][i+1],c[l+1][i+1],c[l+1][i])}function s(e,t,r){return 0>r&&1===e.x&&(e=new THREE.Vector2(e.x-1,e.y)),0===t.x&&0===t.z&&(e=new THREE.Vector2(r/2/Math.PI+.5,e.y)),e.clone()}THREE.Geometry.call(this),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:r,detail:i},r=r||1,i=i||0;for(var h=this,c=0,l=e.length;l>c;c+=3)n(new THREE.Vector3(e[c],e[c+1],e[c+2]));e=this.vertices;for(var u=[],E=c=0,l=t.length;l>c;c+=3,E++){var p=e[t[c]],d=e[t[c+1]],f=e[t[c+2]];u[E]=new THREE.Face3(p.index,d.index,f.index,[p.clone(),d.clone(),f.clone()])}for(var m=new THREE.Vector3,c=0,l=u.length;l>c;c++)a(u[c],i);for(c=0,l=this.faceVertexUvs[0].length;l>c;c++)t=this.faceVertexUvs[0][c],i=t[0].x,e=t[1].x,u=t[2].x,E=Math.max(i,Math.max(e,u)),p=Math.min(i,Math.min(e,u)),E>.9&&.1>p&&(.2>i&&(t[0].x+=1),.2>e&&(t[1].x+=1),.2>u&&(t[2].x+=1));for(c=0,l=this.vertices.length;l>c;c++)this.vertices[c].multiplyScalar(r);this.mergeVertices(),this.computeFaceNormals(),this.boundingSphere=new THREE.Sphere(new THREE.Vector3,r)},THREE.PolyhedronGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.PolyhedronGeometry.prototype.constructor=THREE.PolyhedronGeometry,THREE.DodecahedronGeometry=function(e,t){this.parameters={radius:e,detail:t};var r=(1+Math.sqrt(5))/2,i=1/r;THREE.PolyhedronGeometry.call(this,[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-r,0,-i,r,0,i,-r,0,i,r,-i,-r,0,-i,r,0,i,-r,0,i,r,0,-r,0,-i,r,0,-i,-r,0,i,r,0,i],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t)},THREE.DodecahedronGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.DodecahedronGeometry.prototype.constructor=THREE.DodecahedronGeometry,THREE.IcosahedronGeometry=function(e,t){var r=(1+Math.sqrt(5))/2;THREE.PolyhedronGeometry.call(this,[-1,r,0,1,r,0,-1,-r,0,1,-r,0,0,-1,r,0,1,r,0,-1,-r,0,1,-r,r,0,-1,r,0,1,-r,0,-1,-r,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}},THREE.IcosahedronGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.IcosahedronGeometry.prototype.constructor=THREE.IcosahedronGeometry,THREE.OctahedronGeometry=function(e,t){this.parameters={radius:e,detail:t},THREE.PolyhedronGeometry.call(this,[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}},THREE.OctahedronGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.OctahedronGeometry.prototype.constructor=THREE.OctahedronGeometry,THREE.TetrahedronGeometry=function(e,t){THREE.PolyhedronGeometry.call(this,[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}},THREE.TetrahedronGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.TetrahedronGeometry.prototype.constructor=THREE.TetrahedronGeometry,THREE.ParametricGeometry=function(e,t,r){THREE.Geometry.call(this),this.type="ParametricGeometry",this.parameters={func:e,slices:t,stacks:r};var i,n,o,a,s=this.vertices,h=this.faces,c=this.faceVertexUvs[0],l=t+1;for(i=0;r>=i;i++)for(a=i/r,n=0;t>=n;n++)o=n/t,o=e(o,a),s.push(o);var u,E,p,d;for(i=0;r>i;i++)for(n=0;t>n;n++)e=i*l+n,s=i*l+n+1,a=(i+1)*l+n+1,o=(i+1)*l+n,u=new THREE.Vector2(n/t,i/r),E=new THREE.Vector2((n+1)/t,i/r),p=new THREE.Vector2((n+1)/t,(i+1)/r),d=new THREE.Vector2(n/t,(i+1)/r),h.push(new THREE.Face3(e,s,o)),c.push([u,E,d]),h.push(new THREE.Face3(s,a,o)),c.push([E.clone(),p,d.clone()]);this.computeFaceNormals(),this.computeVertexNormals()},THREE.ParametricGeometry.prototype=Object.create(THREE.Geometry.prototype),THREE.ParametricGeometry.prototype.constructor=THREE.ParametricGeometry,THREE.AxisHelper=function(e){e=e||1;var t=new Float32Array([0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e]),r=new Float32Array([1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1]);e=new THREE.BufferGeometry,e.addAttribute("position",new THREE.BufferAttribute(t,3)),e.addAttribute("color",new THREE.BufferAttribute(r,3)),t=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors}),THREE.Line.call(this,e,t,THREE.LinePieces)},THREE.AxisHelper.prototype=Object.create(THREE.Line.prototype),THREE.AxisHelper.prototype.constructor=THREE.AxisHelper,THREE.ArrowHelper=function(){var e=new THREE.Geometry;e.vertices.push(new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));var t=new THREE.CylinderGeometry(0,.5,1,5,1);return t.applyMatrix((new THREE.Matrix4).makeTranslation(0,-.5,0)),function(r,i,n,o,a,s){THREE.Object3D.call(this),void 0===o&&(o=16776960),void 0===n&&(n=1),void 0===a&&(a=.2*n),void 0===s&&(s=.2*a),this.position.copy(i),this.line=new THREE.Line(e,new THREE.LineBasicMaterial({color:o})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new THREE.Mesh(t,new THREE.MeshBasicMaterial({color:o})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(r),this.setLength(n,a,s)}}(),THREE.ArrowHelper.prototype=Object.create(THREE.Object3D.prototype),THREE.ArrowHelper.prototype.constructor=THREE.ArrowHelper,THREE.ArrowHelper.prototype.setDirection=function(){var e,t=new THREE.Vector3;return function(r){.99999<r.y?this.quaternion.set(0,0,0,1):-.99999>r.y?this.quaternion.set(1,0,0,0):(t.set(r.z,0,-r.x).normalize(),e=Math.acos(r.y),this.quaternion.setFromAxisAngle(t,e))}}(),THREE.ArrowHelper.prototype.setLength=function(e,t,r){void 0===t&&(t=.2*e),void 0===r&&(r=.2*t),this.line.scale.set(1,e-t,1),this.line.updateMatrix(),this.cone.scale.set(r,t,r),this.cone.position.y=e,this.cone.updateMatrix()},THREE.ArrowHelper.prototype.setColor=function(e){this.line.material.color.set(e),this.cone.material.color.set(e)},THREE.BoxHelper=function(e){var t=new THREE.BufferGeometry;t.addAttribute("position",new THREE.BufferAttribute(new Float32Array(72),3)),THREE.Line.call(this,t,new THREE.LineBasicMaterial({color:16776960}),THREE.LinePieces),void 0!==e&&this.update(e)},THREE.BoxHelper.prototype=Object.create(THREE.Line.prototype),THREE.BoxHelper.prototype.constructor=THREE.BoxHelper,THREE.BoxHelper.prototype.update=function(e){var t=e.geometry;null===t.boundingBox&&t.computeBoundingBox();var r=t.boundingBox.min,t=t.boundingBox.max,i=this.geometry.attributes.position.array;i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=r.x,i[4]=t.y,i[5]=t.z,i[6]=r.x,i[7]=t.y,i[8]=t.z,i[9]=r.x,i[10]=r.y,i[11]=t.z,i[12]=r.x,i[13]=r.y,i[14]=t.z,i[15]=t.x,i[16]=r.y,i[17]=t.z,i[18]=t.x,i[19]=r.y,i[20]=t.z,i[21]=t.x,i[22]=t.y,i[23]=t.z,i[24]=t.x,i[25]=t.y,i[26]=r.z,i[27]=r.x,i[28]=t.y,i[29]=r.z,i[30]=r.x,i[31]=t.y,i[32]=r.z,i[33]=r.x,i[34]=r.y,i[35]=r.z,i[36]=r.x,i[37]=r.y,i[38]=r.z,i[39]=t.x,i[40]=r.y,i[41]=r.z,i[42]=t.x,i[43]=r.y,i[44]=r.z,i[45]=t.x,i[46]=t.y,i[47]=r.z,i[48]=t.x,i[49]=t.y,i[50]=t.z,i[51]=t.x,i[52]=t.y,i[53]=r.z,i[54]=r.x,i[55]=t.y,i[56]=t.z,i[57]=r.x,i[58]=t.y,i[59]=r.z,i[60]=r.x,i[61]=r.y,i[62]=t.z,i[63]=r.x,i[64]=r.y,i[65]=r.z,i[66]=t.x,i[67]=r.y,i[68]=t.z,i[69]=t.x,i[70]=r.y,i[71]=r.z,this.geometry.attributes.position.needsUpdate=!0,this.geometry.computeBoundingSphere(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1},THREE.BoundingBoxHelper=function(e,t){var r=void 0!==t?t:8947848;this.object=e,this.box=new THREE.Box3,THREE.Mesh.call(this,new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:r,wireframe:!0}))},THREE.BoundingBoxHelper.prototype=Object.create(THREE.Mesh.prototype),THREE.BoundingBoxHelper.prototype.constructor=THREE.BoundingBoxHelper,THREE.BoundingBoxHelper.prototype.update=function(){this.box.setFromObject(this.object),this.box.size(this.scale),this.box.center(this.position)},THREE.CameraHelper=function(e){function t(e,t,i){r(e,i),r(t,i)}function r(e,t){i.vertices.push(new THREE.Vector3),i.colors.push(new THREE.Color(t)),void 0===o[e]&&(o[e]=[]),o[e].push(i.vertices.length-1)}var i=new THREE.Geometry,n=new THREE.LineBasicMaterial({color:16777215,vertexColors:THREE.FaceColors}),o={};t("n1","n2",16755200),t("n2","n4",16755200),t("n4","n3",16755200),t("n3","n1",16755200),t("f1","f2",16755200),t("f2","f4",16755200),t("f4","f3",16755200),t("f3","f1",16755200),t("n1","f1",16755200),t("n2","f2",16755200),t("n3","f3",16755200),t("n4","f4",16755200),t("p","n1",16711680),t("p","n2",16711680),t("p","n3",16711680),t("p","n4",16711680),t("u1","u2",43775),t("u2","u3",43775),t("u3","u1",43775),t("c","t",16777215),t("p","c",3355443),t("cn1","cn2",3355443),t("cn3","cn4",3355443),t("cf1","cf2",3355443),t("cf3","cf4",3355443),THREE.Line.call(this,i,n,THREE.LinePieces),this.camera=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=o,this.update()},THREE.CameraHelper.prototype=Object.create(THREE.Line.prototype),THREE.CameraHelper.prototype.constructor=THREE.CameraHelper,THREE.CameraHelper.prototype.update=function(){var e,t,r=new THREE.Vector3,i=new THREE.Camera,n=function(n,o,a,s){if(r.set(o,a,s).unproject(i),n=t[n],void 0!==n)for(o=0,a=n.length;a>o;o++)e.vertices[n[o]].copy(r)};return function(){e=this.geometry,t=this.pointMap,i.projectionMatrix.copy(this.camera.projectionMatrix),n("c",0,0,-1),n("t",0,0,1),n("n1",-1,-1,-1),n("n2",1,-1,-1),n("n3",-1,1,-1),n("n4",1,1,-1),n("f1",-1,-1,1),n("f2",1,-1,1),n("f3",-1,1,1),n("f4",1,1,1),n("u1",.7,1.1,-1),n("u2",-.7,1.1,-1),n("u3",0,2,-1),n("cf1",-1,0,1),n("cf2",1,0,1),n("cf3",0,-1,1),n("cf4",0,1,1),n("cn1",-1,0,-1),n("cn2",1,0,-1),n("cn3",0,-1,-1),n("cn4",0,1,-1),e.verticesNeedUpdate=!0}}(),THREE.DirectionalLightHelper=function(e,t){THREE.Object3D.call(this),this.light=e,this.light.updateMatrixWorld(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,t=t||1;var r=new THREE.Geometry;r.vertices.push(new THREE.Vector3(-t,t,0),new THREE.Vector3(t,t,0),new THREE.Vector3(t,-t,0),new THREE.Vector3(-t,-t,0),new THREE.Vector3(-t,t,0));var i=new THREE.LineBasicMaterial({fog:!1});i.color.copy(this.light.color).multiplyScalar(this.light.intensity),this.lightPlane=new THREE.Line(r,i),this.add(this.lightPlane),r=new THREE.Geometry,r.vertices.push(new THREE.Vector3,new THREE.Vector3),i=new THREE.LineBasicMaterial({fog:!1}),i.color.copy(this.light.color).multiplyScalar(this.light.intensity),this.targetLine=new THREE.Line(r,i),this.add(this.targetLine),this.update()},THREE.DirectionalLightHelper.prototype=Object.create(THREE.Object3D.prototype),THREE.DirectionalLightHelper.prototype.constructor=THREE.DirectionalLightHelper,THREE.DirectionalLightHelper.prototype.dispose=function(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()},THREE.DirectionalLightHelper.prototype.update=function(){var e=new THREE.Vector3,t=new THREE.Vector3,r=new THREE.Vector3;return function(){e.setFromMatrixPosition(this.light.matrixWorld),t.setFromMatrixPosition(this.light.target.matrixWorld),r.subVectors(t,e),this.lightPlane.lookAt(r),this.lightPlane.material.color.copy(this.light.color).multiplyScalar(this.light.intensity),this.targetLine.geometry.vertices[1].copy(r),this.targetLine.geometry.verticesNeedUpdate=!0,this.targetLine.material.color.copy(this.lightPlane.material.color)}}(),THREE.EdgesHelper=function(e,t,r){t=void 0!==t?t:16777215,r=Math.cos(THREE.Math.degToRad(void 0!==r?r:1));var i,n=[0,0],o={},a=function(e,t){return e-t},s=["a","b","c"],h=new THREE.BufferGeometry;e.geometry instanceof THREE.BufferGeometry?(i=new THREE.Geometry,i.fromBufferGeometry(e.geometry)):i=e.geometry.clone(),i.mergeVertices(),i.computeFaceNormals();var c=i.vertices;i=i.faces;for(var l=0,u=0,E=i.length;E>u;u++)for(var p=i[u],d=0;3>d;d++){n[0]=p[s[d]],n[1]=p[s[(d+1)%3]],n.sort(a);var f=n.toString();void 0===o[f]?(o[f]={vert1:n[0],vert2:n[1],face1:u,face2:void 0},l++):o[f].face2=u}n=new Float32Array(6*l),a=0;for(f in o)s=o[f],(void 0===s.face2||i[s.face1].normal.dot(i[s.face2].normal)<=r)&&(l=c[s.vert1],n[a++]=l.x,n[a++]=l.y,n[a++]=l.z,l=c[s.vert2],n[a++]=l.x,n[a++]=l.y,n[a++]=l.z);h.addAttribute("position",new THREE.BufferAttribute(n,3)),THREE.Line.call(this,h,new THREE.LineBasicMaterial({color:t}),THREE.LinePieces),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1},THREE.EdgesHelper.prototype=Object.create(THREE.Line.prototype),THREE.EdgesHelper.prototype.constructor=THREE.EdgesHelper,THREE.FaceNormalsHelper=function(e,t,r,i){this.object=e,this.size=void 0!==t?t:1,e=void 0!==r?r:16776960,i=void 0!==i?i:1,t=new THREE.Geometry,r=0;for(var n=this.object.geometry.faces.length;n>r;r++)t.vertices.push(new THREE.Vector3,new THREE.Vector3);THREE.Line.call(this,t,new THREE.LineBasicMaterial({color:e,linewidth:i}),THREE.LinePieces),this.matrixAutoUpdate=!1,this.normalMatrix=new THREE.Matrix3,this.update()},THREE.FaceNormalsHelper.prototype=Object.create(THREE.Line.prototype),THREE.FaceNormalsHelper.prototype.constructor=THREE.FaceNormalsHelper,THREE.FaceNormalsHelper.prototype.update=function(){var e=this.geometry.vertices,t=this.object,r=t.geometry.vertices,i=t.geometry.faces,n=t.matrixWorld;t.updateMatrixWorld(!0),this.normalMatrix.getNormalMatrix(n);for(var o=t=0,a=i.length;a>t;t++,o+=2){var s=i[t];e[o].copy(r[s.a]).add(r[s.b]).add(r[s.c]).divideScalar(3).applyMatrix4(n),e[o+1].copy(s.normal).applyMatrix3(this.normalMatrix).normalize().multiplyScalar(this.size).add(e[o])}return this.geometry.verticesNeedUpdate=!0,this},THREE.GridHelper=function(e,t){var r=new THREE.Geometry,i=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors});this.color1=new THREE.Color(4473924),this.color2=new THREE.Color(8947848);for(var n=-e;e>=n;n+=t){r.vertices.push(new THREE.Vector3(-e,0,n),new THREE.Vector3(e,0,n),new THREE.Vector3(n,0,-e),new THREE.Vector3(n,0,e));var o=0===n?this.color1:this.color2;r.colors.push(o,o,o,o)}THREE.Line.call(this,r,i,THREE.LinePieces)},THREE.GridHelper.prototype=Object.create(THREE.Line.prototype),THREE.GridHelper.prototype.constructor=THREE.GridHelper,THREE.GridHelper.prototype.setColors=function(e,t){this.color1.set(e),this.color2.set(t),this.geometry.colorsNeedUpdate=!0},THREE.HemisphereLightHelper=function(e,t){THREE.Object3D.call(this),this.light=e,this.light.updateMatrixWorld(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.colors=[new THREE.Color,new THREE.Color];var r=new THREE.SphereGeometry(t,4,2);r.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI/2));for(var i=0;8>i;i++)r.faces[i].color=this.colors[4>i?0:1];i=new THREE.MeshBasicMaterial({vertexColors:THREE.FaceColors,wireframe:!0}),this.lightSphere=new THREE.Mesh(r,i),this.add(this.lightSphere),this.update()},THREE.HemisphereLightHelper.prototype=Object.create(THREE.Object3D.prototype),THREE.HemisphereLightHelper.prototype.constructor=THREE.HemisphereLightHelper,THREE.HemisphereLightHelper.prototype.dispose=function(){this.lightSphere.geometry.dispose(),this.lightSphere.material.dispose()},THREE.HemisphereLightHelper.prototype.update=function(){var e=new THREE.Vector3;return function(){this.colors[0].copy(this.light.color).multiplyScalar(this.light.intensity),this.colors[1].copy(this.light.groundColor).multiplyScalar(this.light.intensity),this.lightSphere.lookAt(e.setFromMatrixPosition(this.light.matrixWorld).negate()),this.lightSphere.geometry.colorsNeedUpdate=!0}}(),THREE.PointLightHelper=function(e,t){this.light=e,this.light.updateMatrixWorld();var r=new THREE.SphereGeometry(t,4,2),i=new THREE.MeshBasicMaterial({wireframe:!0,fog:!1});i.color.copy(this.light.color).multiplyScalar(this.light.intensity),THREE.Mesh.call(this,r,i),this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1},THREE.PointLightHelper.prototype=Object.create(THREE.Mesh.prototype),THREE.PointLightHelper.prototype.constructor=THREE.PointLightHelper,THREE.PointLightHelper.prototype.dispose=function(){this.geometry.dispose(),this.material.dispose()},THREE.PointLightHelper.prototype.update=function(){this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity)},THREE.SkeletonHelper=function(e){this.bones=this.getBoneList(e);for(var t=new THREE.Geometry,r=0;r<this.bones.length;r++)this.bones[r].parent instanceof THREE.Bone&&(t.vertices.push(new THREE.Vector3),t.vertices.push(new THREE.Vector3),t.colors.push(new THREE.Color(0,0,1)),t.colors.push(new THREE.Color(0,1,0)));r=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors,depthTest:!1,depthWrite:!1,transparent:!0}),THREE.Line.call(this,t,r,THREE.LinePieces),this.root=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.update()},THREE.SkeletonHelper.prototype=Object.create(THREE.Line.prototype),THREE.SkeletonHelper.prototype.constructor=THREE.SkeletonHelper,THREE.SkeletonHelper.prototype.getBoneList=function(e){var t=[];e instanceof THREE.Bone&&t.push(e);for(var r=0;r<e.children.length;r++)t.push.apply(t,this.getBoneList(e.children[r]));return t},THREE.SkeletonHelper.prototype.update=function(){for(var e=this.geometry,t=(new THREE.Matrix4).getInverse(this.root.matrixWorld),r=new THREE.Matrix4,i=0,n=0;n<this.bones.length;n++){var o=this.bones[n];o.parent instanceof THREE.Bone&&(r.multiplyMatrices(t,o.matrixWorld),e.vertices[i].setFromMatrixPosition(r),r.multiplyMatrices(t,o.parent.matrixWorld),e.vertices[i+1].setFromMatrixPosition(r),i+=2)}e.verticesNeedUpdate=!0,e.computeBoundingSphere()},THREE.SpotLightHelper=function(e){THREE.Object3D.call(this),this.light=e,this.light.updateMatrixWorld(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,e=new THREE.CylinderGeometry(0,1,1,8,1,!0),e.applyMatrix((new THREE.Matrix4).makeTranslation(0,-.5,0)),e.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI/2));var t=new THREE.MeshBasicMaterial({wireframe:!0,fog:!1});this.cone=new THREE.Mesh(e,t),this.add(this.cone),this.update()},THREE.SpotLightHelper.prototype=Object.create(THREE.Object3D.prototype),THREE.SpotLightHelper.prototype.constructor=THREE.SpotLightHelper,THREE.SpotLightHelper.prototype.dispose=function(){this.cone.geometry.dispose(),this.cone.material.dispose()},THREE.SpotLightHelper.prototype.update=function(){var e=new THREE.Vector3,t=new THREE.Vector3;return function(){var r=this.light.distance?this.light.distance:1e4,i=r*Math.tan(this.light.angle);this.cone.scale.set(i,i,r),e.setFromMatrixPosition(this.light.matrixWorld),t.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(t.sub(e)),this.cone.material.color.copy(this.light.color).multiplyScalar(this.light.intensity)}}(),THREE.VertexNormalsHelper=function(e,t,r,i){this.object=e,this.size=void 0!==t?t:1,t=void 0!==r?r:16711680,i=void 0!==i?i:1,r=new THREE.Geometry,e=e.geometry.faces;for(var n=0,o=e.length;o>n;n++)for(var a=0,s=e[n].vertexNormals.length;s>a;a++)r.vertices.push(new THREE.Vector3,new THREE.Vector3);THREE.Line.call(this,r,new THREE.LineBasicMaterial({color:t,linewidth:i}),THREE.LinePieces),this.matrixAutoUpdate=!1,this.normalMatrix=new THREE.Matrix3,this.update()},THREE.VertexNormalsHelper.prototype=Object.create(THREE.Line.prototype),THREE.VertexNormalsHelper.prototype.constructor=THREE.VertexNormalsHelper,THREE.VertexNormalsHelper.prototype.update=function(e){var t=new THREE.Vector3;return function(e){e=["a","b","c","d"],this.object.updateMatrixWorld(!0),this.normalMatrix.getNormalMatrix(this.object.matrixWorld);for(var r=this.geometry.vertices,i=this.object.geometry.vertices,n=this.object.geometry.faces,o=this.object.matrixWorld,a=0,s=0,h=n.length;h>s;s++)for(var c=n[s],l=0,u=c.vertexNormals.length;u>l;l++){var E=c.vertexNormals[l];r[a].copy(i[c[e[l]]]).applyMatrix4(o),t.copy(E).applyMatrix3(this.normalMatrix).normalize().multiplyScalar(this.size),t.add(r[a]),a+=1,r[a].copy(t),a+=1}return this.geometry.verticesNeedUpdate=!0,this}}(),THREE.VertexTangentsHelper=function(e,t,r,i){this.object=e,this.size=void 0!==t?t:1,t=void 0!==r?r:255,i=void 0!==i?i:1,r=new THREE.Geometry,e=e.geometry.faces;for(var n=0,o=e.length;o>n;n++)for(var a=0,s=e[n].vertexTangents.length;s>a;a++)r.vertices.push(new THREE.Vector3),r.vertices.push(new THREE.Vector3);THREE.Line.call(this,r,new THREE.LineBasicMaterial({color:t,linewidth:i}),THREE.LinePieces),this.matrixAutoUpdate=!1,this.update()},THREE.VertexTangentsHelper.prototype=Object.create(THREE.Line.prototype),THREE.VertexTangentsHelper.prototype.constructor=THREE.VertexTangentsHelper,THREE.VertexTangentsHelper.prototype.update=function(e){var t=new THREE.Vector3;return function(e){e=["a","b","c","d"],this.object.updateMatrixWorld(!0);for(var r=this.geometry.vertices,i=this.object.geometry.vertices,n=this.object.geometry.faces,o=this.object.matrixWorld,a=0,s=0,h=n.length;h>s;s++)for(var c=n[s],l=0,u=c.vertexTangents.length;u>l;l++){var E=c.vertexTangents[l];r[a].copy(i[c[e[l]]]).applyMatrix4(o),t.copy(E).transformDirection(o).multiplyScalar(this.size),t.add(r[a]),a+=1,r[a].copy(t),a+=1}return this.geometry.verticesNeedUpdate=!0,this}}(),THREE.WireframeHelper=function(e,t){var r=void 0!==t?t:16777215,i=[0,0],n={},o=function(e,t){return e-t},a=["a","b","c"],s=new THREE.BufferGeometry;if(e.geometry instanceof THREE.Geometry){for(var h=e.geometry.vertices,c=e.geometry.faces,l=0,u=new Uint32Array(6*c.length),E=0,p=c.length;p>E;E++)for(var d=c[E],f=0;3>f;f++){i[0]=d[a[f]],i[1]=d[a[(f+1)%3]],i.sort(o);var m=i.toString();void 0===n[m]&&(u[2*l]=i[0],u[2*l+1]=i[1],n[m]=!0,l++)}for(i=new Float32Array(6*l),E=0,p=l;p>E;E++)for(f=0;2>f;f++)l=h[u[2*E+f]],a=6*E+3*f,i[a+0]=l.x,i[a+1]=l.y,i[a+2]=l.z;s.addAttribute("position",new THREE.BufferAttribute(i,3))}else if(e.geometry instanceof THREE.BufferGeometry){if(void 0!==e.geometry.attributes.index){h=e.geometry.attributes.position.array,p=e.geometry.attributes.index.array,c=e.geometry.drawcalls,l=0,0===c.length&&(c=[{count:p.length,index:0,start:0}]);for(var u=new Uint32Array(2*p.length),d=0,T=c.length;T>d;++d)for(var f=c[d].start,m=c[d].count,a=c[d].index,E=f,g=f+m;g>E;E+=3)for(f=0;3>f;f++)i[0]=a+p[E+f],i[1]=a+p[E+(f+1)%3],i.sort(o),m=i.toString(),void 0===n[m]&&(u[2*l]=i[0],u[2*l+1]=i[1],n[m]=!0,l++);for(i=new Float32Array(6*l),E=0,p=l;p>E;E++)for(f=0;2>f;f++)a=6*E+3*f,l=3*u[2*E+f],i[a+0]=h[l],i[a+1]=h[l+1],i[a+2]=h[l+2]}else for(h=e.geometry.attributes.position.array,l=h.length/3,u=l/3,i=new Float32Array(6*l),E=0,p=u;p>E;E++)for(f=0;3>f;f++)a=18*E+6*f,u=9*E+3*f,i[a+0]=h[u],i[a+1]=h[u+1],i[a+2]=h[u+2],l=9*E+(f+1)%3*3,i[a+3]=h[l],i[a+4]=h[l+1],i[a+5]=h[l+2];s.addAttribute("position",new THREE.BufferAttribute(i,3))}THREE.Line.call(this,s,new THREE.LineBasicMaterial({color:r}),THREE.LinePieces),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1},THREE.WireframeHelper.prototype=Object.create(THREE.Line.prototype),THREE.WireframeHelper.prototype.constructor=THREE.WireframeHelper,THREE.ImmediateRenderObject=function(){THREE.Object3D.call(this),this.render=function(e){}},THREE.ImmediateRenderObject.prototype=Object.create(THREE.Object3D.prototype),THREE.ImmediateRenderObject.prototype.constructor=THREE.ImmediateRenderObject,THREE.MorphBlendMesh=function(e,t){THREE.Mesh.call(this,e,t),this.animationsMap={},this.animationsList=[];var r=this.geometry.morphTargets.length;this.createAnimation("__default",0,r-1,r/1),this.setAnimationWeight("__default",1)},THREE.MorphBlendMesh.prototype=Object.create(THREE.Mesh.prototype),THREE.MorphBlendMesh.prototype.constructor=THREE.MorphBlendMesh,THREE.MorphBlendMesh.prototype.createAnimation=function(e,t,r,i){t={startFrame:t,endFrame:r,length:r-t+1,fps:i,duration:(r-t)/i,lastFrame:0,currentFrame:0,active:!1,time:0,direction:1,weight:1,directionBackwards:!1,mirroredLoop:!1},this.animationsMap[e]=t,this.animationsList.push(t)},THREE.MorphBlendMesh.prototype.autoCreateAnimations=function(e){for(var t,r=/([a-z]+)_?(\d+)/,i={},n=this.geometry,o=0,a=n.morphTargets.length;a>o;o++){var s=n.morphTargets[o].name.match(r);if(s&&1<s.length){var h=s[1];i[h]||(i[h]={start:1/0,end:-(1/0)}),s=i[h],o<s.start&&(s.start=o),o>s.end&&(s.end=o),t||(t=h)}}for(h in i)s=i[h],this.createAnimation(h,s.start,s.end,e);this.firstAnimation=t},THREE.MorphBlendMesh.prototype.setAnimationDirectionForward=function(e){(e=this.animationsMap[e])&&(e.direction=1,e.directionBackwards=!1)},THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward=function(e){(e=this.animationsMap[e])&&(e.direction=-1,e.directionBackwards=!0)},THREE.MorphBlendMesh.prototype.setAnimationFPS=function(e,t){var r=this.animationsMap[e];r&&(r.fps=t,r.duration=(r.end-r.start)/r.fps)},THREE.MorphBlendMesh.prototype.setAnimationDuration=function(e,t){var r=this.animationsMap[e];r&&(r.duration=t,r.fps=(r.end-r.start)/r.duration)},THREE.MorphBlendMesh.prototype.setAnimationWeight=function(e,t){var r=this.animationsMap[e];r&&(r.weight=t)},THREE.MorphBlendMesh.prototype.setAnimationTime=function(e,t){var r=this.animationsMap[e];r&&(r.time=t)},THREE.MorphBlendMesh.prototype.getAnimationTime=function(e){var t=0;return(e=this.animationsMap[e])&&(t=e.time),t},THREE.MorphBlendMesh.prototype.getAnimationDuration=function(e){var t=-1;return(e=this.animationsMap[e])&&(t=e.duration),t},THREE.MorphBlendMesh.prototype.playAnimation=function(e){var t=this.animationsMap[e];t?(t.time=0,t.active=!0):THREE.warn("THREE.MorphBlendMesh: animation["+e+"] undefined in .playAnimation()")},THREE.MorphBlendMesh.prototype.stopAnimation=function(e){(e=this.animationsMap[e])&&(e.active=!1)},THREE.MorphBlendMesh.prototype.update=function(e){for(var t=0,r=this.animationsList.length;r>t;t++){var i=this.animationsList[t];if(i.active){var n=i.duration/i.length;
	
	i.time+=i.direction*e,i.mirroredLoop?(i.time>i.duration||0>i.time)&&(i.direction*=-1,i.time>i.duration&&(i.time=i.duration,i.directionBackwards=!0),0>i.time&&(i.time=0,i.directionBackwards=!1)):(i.time%=i.duration,0>i.time&&(i.time+=i.duration));var o=i.startFrame+THREE.Math.clamp(Math.floor(i.time/n),0,i.length-1),a=i.weight;o!==i.currentFrame&&(this.morphTargetInfluences[i.lastFrame]=0,this.morphTargetInfluences[i.currentFrame]=1*a,this.morphTargetInfluences[o]=0,i.lastFrame=i.currentFrame,i.currentFrame=o),n=i.time%n/n,i.directionBackwards&&(n=1-n),this.morphTargetInfluences[i.currentFrame]=n*a,this.morphTargetInfluences[i.lastFrame]=(1-n)*a}}}, true?("undefined"!=typeof module&&module.exports&&(exports=module.exports=THREE),exports.THREE=THREE):this.THREE=THREE,THREE.CSS3DObject=function(e){THREE.Object3D.call(this),this.element=e,this.element.style.position="absolute",this.addEventListener("removed",function(e){null!==this.element.parentNode&&this.element.parentNode.removeChild(this.element)})},THREE.CSS3DObject.prototype=Object.create(THREE.Object3D.prototype),THREE.CSS3DObject.prototype.constructor=THREE.CSS3DObject,THREE.CSS3DSprite=function(e){THREE.CSS3DObject.call(this,e)},THREE.CSS3DSprite.prototype=Object.create(THREE.CSS3DObject.prototype),THREE.CSS3DSprite.prototype.constructor=THREE.CSS3DSprite,THREE.CSS3DRenderer=function(){console.log("THREE.CSS3DRenderer",THREE.REVISION);var e,t,r,i,n=new THREE.Matrix4,o={camera:{fov:0,style:""},objects:{}},a=document.createElement("div");a.style.overflow="hidden",a.style.webkitTransformStyle="preserve-3d",a.style.MozTransformStyle="preserve-3d",a.style.oTransformStyle="preserve-3d",a.style.transformStyle="preserve-3d",this.domElement=a;var s=document.createElement("div");s.style.webkitTransformStyle="preserve-3d",s.style.MozTransformStyle="preserve-3d",s.style.oTransformStyle="preserve-3d",s.style.transformStyle="preserve-3d",a.appendChild(s),this.setClearColor=function(){},this.setSize=function(n,o){e=n,t=o,r=e/2,i=t/2,a.style.width=n+"px",a.style.height=o+"px",s.style.width=n+"px",s.style.height=o+"px"};var h=function(e){return Math.abs(e)<1e-6?0:e},c=function(e){var t=e.elements;return"matrix3d("+h(t[0])+","+h(-t[1])+","+h(t[2])+","+h(t[3])+","+h(t[4])+","+h(-t[5])+","+h(t[6])+","+h(t[7])+","+h(t[8])+","+h(-t[9])+","+h(t[10])+","+h(t[11])+","+h(t[12])+","+h(-t[13])+","+h(t[14])+","+h(t[15])+")"},l=function(e){var t=e.elements;return"translate3d(-50%,-50%,0) matrix3d("+h(t[0])+","+h(t[1])+","+h(t[2])+","+h(t[3])+","+h(-t[4])+","+h(-t[5])+","+h(-t[6])+","+h(-t[7])+","+h(t[8])+","+h(t[9])+","+h(t[10])+","+h(t[11])+","+h(t[12])+","+h(t[13])+","+h(t[14])+","+h(t[15])+")"},u=function(e,t){if(e instanceof THREE.CSS3DObject){var r;e instanceof THREE.CSS3DSprite?(n.copy(t.matrixWorldInverse),n.transpose(),n.copyPosition(e.matrixWorld),n.scale(e.scale),n.elements[3]=0,n.elements[7]=0,n.elements[11]=0,n.elements[15]=1,r=l(n)):r=l(e.matrixWorld);var i=e.element,a=o.objects[e.id];(void 0===a||a!==r)&&(i.style.webkitTransform=r,i.style.MozTransform=r,i.style.oTransform=r,i.style.transform=r,o.objects[e.id]=r),i.parentNode!==s&&s.appendChild(i)}for(var h=0,c=e.children.length;c>h;h++)u(e.children[h],t)};this.render=function(e,n){var h=.5/Math.tan(THREE.Math.degToRad(.5*n.fov))*t;o.camera.fov!==h&&(a.style.webkitPerspective=h+"px",a.style.MozPerspective=h+"px",a.style.oPerspective=h+"px",a.style.perspective=h+"px",o.camera.fov=h),e.updateMatrixWorld(),void 0===n.parent&&n.updateMatrixWorld(),n.matrixWorldInverse.getInverse(n.matrixWorld);var l="translate3d(0,0,"+h+"px)"+c(n.matrixWorldInverse)+" translate3d("+r+"px,"+i+"px, 0)";o.camera.style!==l&&(s.style.webkitTransform=l,s.style.MozTransform=l,s.style.oTransform=l,s.style.transform=l,o.camera.style=l),u(e,n)}},THREE.DeviceOrientationControls=function(e){var t=this;this.object=e,this.object.rotation.reorder("YXZ"),this.enabled=!0,this.deviceOrientation={},this.screenOrientation=0;var r=function(e){t.deviceOrientation=e},i=function(){t.screenOrientation=window.orientation||0},n=function(){var e=new THREE.Vector3(0,0,1),t=new THREE.Euler,r=new THREE.Quaternion,i=new THREE.Quaternion(-Math.sqrt(.5),0,0,Math.sqrt(.5));return function(n,o,a,s,h){t.set(a,o,-s,"YXZ"),n.setFromEuler(t),n.multiply(i),n.multiply(r.setFromAxisAngle(e,-h))}}();this.connect=function(){i(),window.addEventListener("orientationchange",i,!1),window.addEventListener("deviceorientation",r,!1),t.enabled=!0},this.disconnect=function(){window.removeEventListener("orientationchange",i,!1),window.removeEventListener("deviceorientation",r,!1),t.enabled=!1},this.update=function(){if(t.enabled!==!1){var e=t.deviceOrientation.alpha?THREE.Math.degToRad(t.deviceOrientation.alpha):0,r=t.deviceOrientation.beta?THREE.Math.degToRad(t.deviceOrientation.beta):0,i=t.deviceOrientation.gamma?THREE.Math.degToRad(t.deviceOrientation.gamma):0,o=t.screenOrientation?THREE.Math.degToRad(t.screenOrientation):0;n(t.object.quaternion,e,r,i,o)}},this.connect()},THREE.OrbitControls=function(e,t){function r(){return 2*Math.PI/60/60*d.autoRotateSpeed}function i(){return Math.pow(.95,d.zoomSpeed)}function n(e){if(d.enabled!==!1){if(e.preventDefault(),e.button===d.mouseButtons.ORBIT){if(d.noRotate===!0)return;D=F.ROTATE,m.set(e.clientX,e.clientY)}else if(e.button===d.mouseButtons.ZOOM){if(d.noZoom===!0)return;D=F.DOLLY,b.set(e.clientX,e.clientY)}else if(e.button===d.mouseButtons.PAN){if(d.noPan===!0)return;D=F.PAN,R.set(e.clientX,e.clientY)}D!==F.NONE&&(document.addEventListener("mousemove",o,!1),document.addEventListener("mouseup",a,!1),d.dispatchEvent(O))}}function o(e){if(d.enabled!==!1){e.preventDefault();var t=d.domElement===document?d.domElement.body:d.domElement;if(D===F.ROTATE){if(d.noRotate===!0)return;T.set(e.clientX,e.clientY),g.subVectors(T,m),d.rotateLeft(2*Math.PI*g.x/t.clientWidth*d.rotateSpeed),d.rotateUp(2*Math.PI*g.y/t.clientHeight*d.rotateSpeed),m.copy(T)}else if(D===F.DOLLY){if(d.noZoom===!0)return;w.set(e.clientX,e.clientY),_.subVectors(w,b),_.y>0?d.dollyIn():_.y<0&&d.dollyOut(),b.copy(w)}else if(D===F.PAN){if(d.noPan===!0)return;y.set(e.clientX,e.clientY),v.subVectors(y,R),d.pan(v.x,v.y),R.copy(y)}D!==F.NONE&&d.update()}}function a(){d.enabled!==!1&&(document.removeEventListener("mousemove",o,!1),document.removeEventListener("mouseup",a,!1),d.dispatchEvent(N),D=F.NONE)}function s(e){if(d.enabled!==!1&&d.noZoom!==!0&&D===F.NONE){e.preventDefault(),e.stopPropagation();var t=0;void 0!==e.wheelDelta?t=e.wheelDelta:void 0!==e.detail&&(t=-e.detail),t>0?d.dollyOut():0>t&&d.dollyIn(),d.update(),d.dispatchEvent(O),d.dispatchEvent(N)}}function h(e){if(d.enabled!==!1&&d.noKeys!==!0&&d.noPan!==!0)switch(e.keyCode){case d.keys.UP:d.pan(0,d.keyPanSpeed),d.update();break;case d.keys.BOTTOM:d.pan(0,-d.keyPanSpeed),d.update();break;case d.keys.LEFT:d.pan(d.keyPanSpeed,0),d.update();break;case d.keys.RIGHT:d.pan(-d.keyPanSpeed,0),d.update()}}function c(e){if(d.enabled!==!1){switch(e.touches.length){case 1:if(d.noRotate===!0)return;D=F.TOUCH_ROTATE,m.set(e.touches[0].pageX,e.touches[0].pageY);break;case 2:if(d.noZoom===!0)return;D=F.TOUCH_DOLLY;var t=e.touches[0].pageX-e.touches[1].pageX,r=e.touches[0].pageY-e.touches[1].pageY,i=Math.sqrt(t*t+r*r);b.set(0,i);break;case 3:if(d.noPan===!0)return;D=F.TOUCH_PAN,R.set(e.touches[0].pageX,e.touches[0].pageY);break;default:D=F.NONE}D!==F.NONE&&d.dispatchEvent(O)}}function l(e){if(d.enabled!==!1){e.preventDefault(),e.stopPropagation();var t=d.domElement===document?d.domElement.body:d.domElement;switch(e.touches.length){case 1:if(d.noRotate===!0)return;if(D!==F.TOUCH_ROTATE)return;T.set(e.touches[0].pageX,e.touches[0].pageY),g.subVectors(T,m),d.rotateLeft(2*Math.PI*g.x/t.clientWidth*d.rotateSpeed),d.rotateUp(2*Math.PI*g.y/t.clientHeight*d.rotateSpeed),m.copy(T),d.update();break;case 2:if(d.noZoom===!0)return;if(D!==F.TOUCH_DOLLY)return;var r=e.touches[0].pageX-e.touches[1].pageX,i=e.touches[0].pageY-e.touches[1].pageY,n=Math.sqrt(r*r+i*i);w.set(0,n),_.subVectors(w,b),_.y>0?d.dollyOut():_.y<0&&d.dollyIn(),b.copy(w),d.update();break;case 3:if(d.noPan===!0)return;if(D!==F.TOUCH_PAN)return;y.set(e.touches[0].pageX,e.touches[0].pageY),v.subVectors(y,R),d.pan(v.x,v.y),R.copy(y),d.update();break;default:D=F.NONE}}}function u(){d.enabled!==!1&&(d.dispatchEvent(N),D=F.NONE)}this.object=e,this.domElement=void 0!==t?t:document,this.enabled=!0,this.target=new THREE.Vector3,this.center=this.target,this.noZoom=!1,this.zoomSpeed=1,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.noRotate=!1,this.rotateSpeed=1,this.noPan=!1,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-(1/0),this.maxAzimuthAngle=1/0,this.noKeys=!1,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ORBIT:THREE.MOUSE.LEFT,ZOOM:THREE.MOUSE.MIDDLE,PAN:THREE.MOUSE.RIGHT};var E,p,d=this,f=1e-6,m=new THREE.Vector2,T=new THREE.Vector2,g=new THREE.Vector2,R=new THREE.Vector2,y=new THREE.Vector2,v=new THREE.Vector2,H=new THREE.Vector3,x=new THREE.Vector3,b=new THREE.Vector2,w=new THREE.Vector2,_=new THREE.Vector2,M=0,S=0,A=1,C=new THREE.Vector3,L=new THREE.Vector3,P=new THREE.Quaternion,F={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY:4,TOUCH_PAN:5},D=F.NONE;this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom;var U=(new THREE.Quaternion).setFromUnitVectors(e.up,new THREE.Vector3(0,1,0)),B=U.clone().inverse(),V={type:"change"},O={type:"start"},N={type:"end"};this.rotateLeft=function(e){void 0===e&&(e=r()),S-=e},this.rotateUp=function(e){void 0===e&&(e=r()),M-=e},this.panLeft=function(e){var t=this.object.matrix.elements;H.set(t[0],t[1],t[2]),H.multiplyScalar(-e),C.add(H)},this.panUp=function(e){var t=this.object.matrix.elements;H.set(t[4],t[5],t[6]),H.multiplyScalar(e),C.add(H)},this.pan=function(e,t){var r=d.domElement===document?d.domElement.body:d.domElement;if(d.object instanceof THREE.PerspectiveCamera){var i=d.object.position,n=i.clone().sub(d.target),o=n.length();o*=Math.tan(d.object.fov/2*Math.PI/180),d.panLeft(2*e*o/r.clientHeight),d.panUp(2*t*o/r.clientHeight)}else d.object instanceof THREE.OrthographicCamera?(d.panLeft(e*(d.object.right-d.object.left)/r.clientWidth),d.panUp(t*(d.object.top-d.object.bottom)/r.clientHeight)):console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.")},this.dollyIn=function(e){void 0===e&&(e=i()),d.object instanceof THREE.PerspectiveCamera?A/=e:d.object instanceof THREE.OrthographicCamera?(d.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom*e)),d.object.updateProjectionMatrix(),d.dispatchEvent(V)):console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.")},this.dollyOut=function(e){void 0===e&&(e=i()),d.object instanceof THREE.PerspectiveCamera?A*=e:d.object instanceof THREE.OrthographicCamera?(d.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/e)),d.object.updateProjectionMatrix(),d.dispatchEvent(V)):console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.")},this.update=function(){var e=this.object.position;x.copy(e).sub(this.target),x.applyQuaternion(U),E=Math.atan2(x.x,x.z),p=Math.atan2(Math.sqrt(x.x*x.x+x.z*x.z),x.y),this.autoRotate&&D===F.NONE&&this.rotateLeft(r()),E+=S,p+=M,E=Math.max(this.minAzimuthAngle,Math.min(this.maxAzimuthAngle,E)),p=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,p)),p=Math.max(f,Math.min(Math.PI-f,p));var t=x.length()*A;t=Math.max(this.minDistance,Math.min(this.maxDistance,t)),this.target.add(C),x.x=t*Math.sin(p)*Math.sin(E),x.y=t*Math.cos(p),x.z=t*Math.sin(p)*Math.cos(E),x.applyQuaternion(B),e.copy(this.target).add(x),this.object.lookAt(this.target),S=0,M=0,A=1,C.set(0,0,0),(L.distanceToSquared(this.object.position)>f||8*(1-P.dot(this.object.quaternion))>f)&&(this.dispatchEvent(V),L.copy(this.object.position),P.copy(this.object.quaternion))},this.reset=function(){D=F.NONE,this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(V),this.update()},this.getPolarAngle=function(){return p},this.getAzimuthalAngle=function(){return E},this.domElement.addEventListener("contextmenu",function(e){e.preventDefault()},!1),this.domElement.addEventListener("mousedown",n,!1),this.domElement.addEventListener("mousewheel",s,!1),this.domElement.addEventListener("DOMMouseScroll",s,!1),this.domElement.addEventListener("touchstart",c,!1),this.domElement.addEventListener("touchend",u,!1),this.domElement.addEventListener("touchmove",l,!1),window.addEventListener("keydown",h,!1),this.update()},THREE.OrbitControls.prototype=Object.create(THREE.EventDispatcher.prototype),THREE.OrbitControls.prototype.constructor=THREE.OrbitControls,THREE.TrackballControls=function(e,t){function r(e){u.enabled!==!1&&(window.removeEventListener("keydown",r),m=f,f===E.NONE&&(e.keyCode!==u.keys[E.ROTATE]||u.noRotate?e.keyCode!==u.keys[E.ZOOM]||u.noZoom?e.keyCode!==u.keys[E.PAN]||u.noPan||(f=E.PAN):f=E.ZOOM:f=E.ROTATE))}function i(e){u.enabled!==!1&&(f=m,window.addEventListener("keydown",r,!1))}function n(e){u.enabled!==!1&&(e.preventDefault(),e.stopPropagation(),f===E.NONE&&(f=e.button),f!==E.ROTATE||u.noRotate?f!==E.ZOOM||u.noZoom?f!==E.PAN||u.noPan||(_.copy(L(e.pageX,e.pageY)),M.copy(_)):(H.copy(L(e.pageX,e.pageY)),x.copy(H)):(R.copy(P(e.pageX,e.pageY)),g.copy(R)),document.addEventListener("mousemove",o,!1),document.addEventListener("mouseup",a,!1),u.dispatchEvent(A))}function o(e){u.enabled!==!1&&(e.preventDefault(),e.stopPropagation(),f!==E.ROTATE||u.noRotate?f!==E.ZOOM||u.noZoom?f!==E.PAN||u.noPan||M.copy(L(e.pageX,e.pageY)):x.copy(L(e.pageX,e.pageY)):(g.copy(R),R.copy(P(e.pageX,e.pageY))))}function a(e){u.enabled!==!1&&(e.preventDefault(),e.stopPropagation(),f=E.NONE,document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",a),u.dispatchEvent(C))}function s(e){if(u.enabled!==!1){e.preventDefault(),e.stopPropagation();var t=0;e.wheelDelta?t=e.wheelDelta/40:e.detail&&(t=-e.detail/3),H.y+=.01*t,u.dispatchEvent(A),u.dispatchEvent(C)}}function h(e){if(u.enabled!==!1){switch(e.touches.length){case 1:f=E.TOUCH_ROTATE,R.copy(P(e.touches[0].pageX,e.touches[0].pageY)),g.copy(R);break;case 2:f=E.TOUCH_ZOOM_PAN;var t=e.touches[0].pageX-e.touches[1].pageX,r=e.touches[0].pageY-e.touches[1].pageY;w=b=Math.sqrt(t*t+r*r);var i=(e.touches[0].pageX+e.touches[1].pageX)/2,n=(e.touches[0].pageY+e.touches[1].pageY)/2;_.copy(L(i,n)),M.copy(_);break;default:f=E.NONE}u.dispatchEvent(A)}}function c(e){if(u.enabled!==!1)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:g.copy(R),R.copy(P(e.touches[0].pageX,e.touches[0].pageY));break;case 2:var t=e.touches[0].pageX-e.touches[1].pageX,r=e.touches[0].pageY-e.touches[1].pageY;w=Math.sqrt(t*t+r*r);var i=(e.touches[0].pageX+e.touches[1].pageX)/2,n=(e.touches[0].pageY+e.touches[1].pageY)/2;M.copy(L(i,n));break;default:f=E.NONE}}function l(e){if(u.enabled!==!1){switch(e.touches.length){case 1:g.copy(R),R.copy(P(e.touches[0].pageX,e.touches[0].pageY));break;case 2:b=w=0;var t=(e.touches[0].pageX+e.touches[1].pageX)/2,r=(e.touches[0].pageY+e.touches[1].pageY)/2;M.copy(L(t,r)),_.copy(M)}f=E.NONE,u.dispatchEvent(C)}}var u=this,E={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM_PAN:4};this.object=e,this.domElement=void 0!==t?t:document,this.enabled=!0,this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.keys=[65,83,68],this.target=new THREE.Vector3;var p=1e-6,d=new THREE.Vector3,f=E.NONE,m=E.NONE,T=new THREE.Vector3,g=new THREE.Vector2,R=new THREE.Vector2,y=new THREE.Vector3,v=0,H=new THREE.Vector2,x=new THREE.Vector2,b=0,w=0,_=new THREE.Vector2,M=new THREE.Vector2;this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.up0=this.object.up.clone();var S={type:"change"},A={type:"start"},C={type:"end"};this.handleResize=function(){if(this.domElement===document)this.screen.left=0,this.screen.top=0,this.screen.width=window.innerWidth,this.screen.height=window.innerHeight;else{var e=this.domElement.getBoundingClientRect(),t=this.domElement.ownerDocument.documentElement;this.screen.left=e.left+window.pageXOffset-t.clientLeft,this.screen.top=e.top+window.pageYOffset-t.clientTop,this.screen.width=e.width,this.screen.height=e.height}},this.handleEvent=function(e){"function"==typeof this[e.type]&&this[e.type](e)};var L=function(){var e=new THREE.Vector2;return function(t,r){return e.set((t-u.screen.left)/u.screen.width,(r-u.screen.top)/u.screen.height),e}}(),P=function(){var e=new THREE.Vector2;return function(t,r){return e.set((t-.5*u.screen.width-u.screen.left)/(.5*u.screen.width),(u.screen.height+2*(u.screen.top-r))/u.screen.width),e}}();this.rotateCamera=function(){var e,t=new THREE.Vector3,r=new THREE.Quaternion,i=new THREE.Vector3,n=new THREE.Vector3,o=new THREE.Vector3,a=new THREE.Vector3;return function(){a.set(R.x-g.x,R.y-g.y,0),e=a.length(),e?(T.copy(u.object.position).sub(u.target),i.copy(T).normalize(),n.copy(u.object.up).normalize(),o.crossVectors(n,i).normalize(),n.setLength(R.y-g.y),o.setLength(R.x-g.x),a.copy(n.add(o)),t.crossVectors(a,T).normalize(),e*=u.rotateSpeed,r.setFromAxisAngle(t,e),T.applyQuaternion(r),u.object.up.applyQuaternion(r),y.copy(t),v=e):!u.staticMoving&&v&&(v*=Math.sqrt(1-u.dynamicDampingFactor),T.copy(u.object.position).sub(u.target),r.setFromAxisAngle(y,v),T.applyQuaternion(r),u.object.up.applyQuaternion(r)),g.copy(R)}}(),this.zoomCamera=function(){var e;f===E.TOUCH_ZOOM_PAN?(e=b/w,b=w,T.multiplyScalar(e)):(e=1+(x.y-H.y)*u.zoomSpeed,1!==e&&e>0&&(T.multiplyScalar(e),u.staticMoving?H.copy(x):H.y+=(x.y-H.y)*this.dynamicDampingFactor))},this.panCamera=function(){var e=new THREE.Vector2,t=new THREE.Vector3,r=new THREE.Vector3;return function(){e.copy(M).sub(_),e.lengthSq()&&(e.multiplyScalar(T.length()*u.panSpeed),r.copy(T).cross(u.object.up).setLength(e.x),r.add(t.copy(u.object.up).setLength(e.y)),u.object.position.add(r),u.target.add(r),u.staticMoving?_.copy(M):_.add(e.subVectors(M,_).multiplyScalar(u.dynamicDampingFactor)))}}(),this.checkDistances=function(){u.noZoom&&u.noPan||(T.lengthSq()>u.maxDistance*u.maxDistance&&u.object.position.addVectors(u.target,T.setLength(u.maxDistance)),T.lengthSq()<u.minDistance*u.minDistance&&u.object.position.addVectors(u.target,T.setLength(u.minDistance)))},this.update=function(){T.subVectors(u.object.position,u.target),u.noRotate||u.rotateCamera(),u.noZoom||u.zoomCamera(),u.noPan||u.panCamera(),u.object.position.addVectors(u.target,T),u.checkDistances(),u.object.lookAt(u.target),d.distanceToSquared(u.object.position)>p&&(u.dispatchEvent(S),d.copy(u.object.position))},this.reset=function(){f=E.NONE,m=E.NONE,u.target.copy(u.target0),u.object.position.copy(u.position0),u.object.up.copy(u.up0),T.subVectors(u.object.position,u.target),u.object.lookAt(u.target),u.dispatchEvent(S),d.copy(u.object.position)},this.domElement.addEventListener("contextmenu",function(e){e.preventDefault()},!1),this.domElement.addEventListener("mousedown",n,!1),this.domElement.addEventListener("mousewheel",s,!1),this.domElement.addEventListener("DOMMouseScroll",s,!1),this.domElement.addEventListener("touchstart",h,!1),this.domElement.addEventListener("touchend",l,!1),this.domElement.addEventListener("touchmove",c,!1),window.addEventListener("keydown",r,!1),window.addEventListener("keyup",i,!1),this.handleResize(),this.update()},THREE.TrackballControls.prototype=Object.create(THREE.EventDispatcher.prototype),THREE.TrackballControls.prototype.constructor=THREE.TrackballControls;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Tween.js - Licensed under the MIT license
	 * https://github.com/sole/tween.js
	 * ----------------------------------------------
	 *
	 * See https://github.com/sole/tween.js/graphs/contributors for the full list of contributors.
	 * Thank you all, you're awesome!
	 */
	
	// performance.now polyfill
	( function ( root ) {
	
		if ( 'performance' in root === false ) {
			root.performance = {};
		}
	
		// IE 8
		Date.now = ( Date.now || function () {
			return new Date().getTime();
		} );
	
		if ( 'now' in root.performance === false ) {
			var offset = root.performance.timing && root.performance.timing.navigationStart ? performance.timing.navigationStart
			                                                                                : Date.now();
	
			root.performance.now = function () {
				return Date.now() - offset;
			};
		}
	
	} )( this );
	
	var TWEEN = TWEEN || ( function () {
	
		var _tweens = [];
	
		return {
	
			REVISION: '14',
	
			getAll: function () {
	
				return _tweens;
	
			},
	
			removeAll: function () {
	
				_tweens = [];
	
			},
	
			add: function ( tween ) {
	
				_tweens.push( tween );
	
			},
	
			remove: function ( tween ) {
	
				var i = _tweens.indexOf( tween );
	
				if ( i !== -1 ) {
	
					_tweens.splice( i, 1 );
	
				}
	
			},
	
			update: function ( time ) {
	
				if ( _tweens.length === 0 ) return false;
	
				var i = 0;
	
				time = time !== undefined ? time : window.performance.now();
	
				while ( i < _tweens.length ) {
	
					if ( _tweens[ i ].update( time ) ) {
	
						i++;
	
					} else {
	
						_tweens.splice( i, 1 );
	
					}
	
				}
	
				return true;
	
			}
		};
	
	} )();
	
	TWEEN.Tween = function ( object ) {
	
		var _object = object;
		var _valuesStart = {};
		var _valuesEnd = {};
		var _valuesStartRepeat = {};
		var _duration = 1000;
		var _repeat = 0;
		var _yoyo = false;
		var _isPlaying = false;
		var _reversed = false;
		var _delayTime = 0;
		var _startTime = null;
		var _easingFunction = TWEEN.Easing.Linear.None;
		var _interpolationFunction = TWEEN.Interpolation.Linear;
		var _chainedTweens = [];
		var _onStartCallback = null;
		var _onStartCallbackFired = false;
		var _onUpdateCallback = null;
		var _onCompleteCallback = null;
		var _onStopCallback = null;
	
		// Set all starting values present on the target object
		for ( var field in object ) {
	
			_valuesStart[ field ] = parseFloat(object[field], 10);
	
		}
	
		this.to = function ( properties, duration ) {
	
			if ( duration !== undefined ) {
	
				_duration = duration;
	
			}
	
			_valuesEnd = properties;
	
			return this;
	
		};
	
		this.start = function ( time ) {
	
			TWEEN.add( this );
	
			_isPlaying = true;
	
			_onStartCallbackFired = false;
	
			_startTime = time !== undefined ? time : window.performance.now();
			_startTime += _delayTime;
	
			for ( var property in _valuesEnd ) {
	
				// check if an Array was provided as property value
				if ( _valuesEnd[ property ] instanceof Array ) {
	
					if ( _valuesEnd[ property ].length === 0 ) {
	
						continue;
	
					}
	
					// create a local copy of the Array with the start value at the front
					_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );
	
				}
	
				_valuesStart[ property ] = _object[ property ];
	
				if( ( _valuesStart[ property ] instanceof Array ) === false ) {
					_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
				}
	
				_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;
	
			}
	
			return this;
	
		};
	
		this.stop = function () {
	
			if ( !_isPlaying ) {
				return this;
			}
	
			TWEEN.remove( this );
			_isPlaying = false;
	
			if ( _onStopCallback !== null ) {
	
				_onStopCallback.call( _object );
	
			}
	
			this.stopChainedTweens();
			return this;
	
		};
	
		this.stopChainedTweens = function () {
	
			for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
	
				_chainedTweens[ i ].stop();
	
			}
	
		};
	
		this.delay = function ( amount ) {
	
			_delayTime = amount;
			return this;
	
		};
	
		this.repeat = function ( times ) {
	
			_repeat = times;
			return this;
	
		};
	
		this.yoyo = function( yoyo ) {
	
			_yoyo = yoyo;
			return this;
	
		};
	
	
		this.easing = function ( easing ) {
	
			_easingFunction = easing;
			return this;
	
		};
	
		this.interpolation = function ( interpolation ) {
	
			_interpolationFunction = interpolation;
			return this;
	
		};
	
		this.chain = function () {
	
			_chainedTweens = arguments;
			return this;
	
		};
	
		this.onStart = function ( callback ) {
	
			_onStartCallback = callback;
			return this;
	
		};
	
		this.onUpdate = function ( callback ) {
	
			_onUpdateCallback = callback;
			return this;
	
		};
	
		this.onComplete = function ( callback ) {
	
			_onCompleteCallback = callback;
			return this;
	
		};
	
		this.onStop = function ( callback ) {
	
			_onStopCallback = callback;
			return this;
	
		};
	
		this.update = function ( time ) {
	
			var property;
	
			if ( time < _startTime ) {
	
				return true;
	
			}
	
			if ( _onStartCallbackFired === false ) {
	
				if ( _onStartCallback !== null ) {
	
					_onStartCallback.call( _object );
	
				}
	
				_onStartCallbackFired = true;
	
			}
	
			var elapsed = ( time - _startTime ) / _duration;
			elapsed = elapsed > 1 ? 1 : elapsed;
	
			var value = _easingFunction( elapsed );
	
			for ( property in _valuesEnd ) {
	
				var start = _valuesStart[ property ] || 0;
				var end = _valuesEnd[ property ];
	
				if ( end instanceof Array ) {
	
					_object[ property ] = _interpolationFunction( end, value );
	
				} else {
	
					// Parses relative end values with start as base (e.g.: +10, -3)
					if ( typeof(end) === "string" ) {
						end = start + parseFloat(end, 10);
					}
	
					// protect against non numeric properties.
					if ( typeof(end) === "number" ) {
						_object[ property ] = start + ( end - start ) * value;
					}
	
				}
	
			}
	
			if ( _onUpdateCallback !== null ) {
	
				_onUpdateCallback.call( _object, value );
	
			}
	
			if ( elapsed == 1 ) {
	
				if ( _repeat > 0 ) {
	
					if( isFinite( _repeat ) ) {
						_repeat--;
					}
	
					// reassign starting values, restart by making startTime = now
					for( property in _valuesStartRepeat ) {
	
						if ( typeof( _valuesEnd[ property ] ) === "string" ) {
							_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
						}
	
						if (_yoyo) {
							var tmp = _valuesStartRepeat[ property ];
							_valuesStartRepeat[ property ] = _valuesEnd[ property ];
							_valuesEnd[ property ] = tmp;
						}
	
						_valuesStart[ property ] = _valuesStartRepeat[ property ];
	
					}
	
					if (_yoyo) {
						_reversed = !_reversed;
					}
	
					_startTime = time + _delayTime;
	
					return true;
	
				} else {
	
					if ( _onCompleteCallback !== null ) {
	
						_onCompleteCallback.call( _object );
	
					}
	
					for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
	
						_chainedTweens[ i ].start( time );
	
					}
	
					return false;
	
				}
	
			}
	
			return true;
	
		};
	
	};
	
	
	TWEEN.Easing = {
	
		Linear: {
	
			None: function ( k ) {
	
				return k;
	
			}
	
		},
	
		Quadratic: {
	
			In: function ( k ) {
	
				return k * k;
	
			},
	
			Out: function ( k ) {
	
				return k * ( 2 - k );
	
			},
	
			InOut: function ( k ) {
	
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
				return - 0.5 * ( --k * ( k - 2 ) - 1 );
	
			}
	
		},
	
		Cubic: {
	
			In: function ( k ) {
	
				return k * k * k;
	
			},
	
			Out: function ( k ) {
	
				return --k * k * k + 1;
	
			},
	
			InOut: function ( k ) {
	
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
				return 0.5 * ( ( k -= 2 ) * k * k + 2 );
	
			}
	
		},
	
		Quartic: {
	
			In: function ( k ) {
	
				return k * k * k * k;
	
			},
	
			Out: function ( k ) {
	
				return 1 - ( --k * k * k * k );
	
			},
	
			InOut: function ( k ) {
	
				if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
				return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
	
			}
	
		},
	
		Quintic: {
	
			In: function ( k ) {
	
				return k * k * k * k * k;
	
			},
	
			Out: function ( k ) {
	
				return --k * k * k * k * k + 1;
	
			},
	
			InOut: function ( k ) {
	
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
				return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
	
			}
	
		},
	
		Sinusoidal: {
	
			In: function ( k ) {
	
				return 1 - Math.cos( k * Math.PI / 2 );
	
			},
	
			Out: function ( k ) {
	
				return Math.sin( k * Math.PI / 2 );
	
			},
	
			InOut: function ( k ) {
	
				return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
	
			}
	
		},
	
		Exponential: {
	
			In: function ( k ) {
	
				return k === 0 ? 0 : Math.pow( 1024, k - 1 );
	
			},
	
			Out: function ( k ) {
	
				return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
	
			},
	
			InOut: function ( k ) {
	
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
				return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
	
			}
	
		},
	
		Circular: {
	
			In: function ( k ) {
	
				return 1 - Math.sqrt( 1 - k * k );
	
			},
	
			Out: function ( k ) {
	
				return Math.sqrt( 1 - ( --k * k ) );
	
			},
	
			InOut: function ( k ) {
	
				if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
				return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
	
			}
	
		},
	
		Elastic: {
	
			In: function ( k ) {
	
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
	
			},
	
			Out: function ( k ) {
	
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
	
			},
	
			InOut: function ( k ) {
	
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
				return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
	
			}
	
		},
	
		Back: {
	
			In: function ( k ) {
	
				var s = 1.70158;
				return k * k * ( ( s + 1 ) * k - s );
	
			},
	
			Out: function ( k ) {
	
				var s = 1.70158;
				return --k * k * ( ( s + 1 ) * k + s ) + 1;
	
			},
	
			InOut: function ( k ) {
	
				var s = 1.70158 * 1.525;
				if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
				return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
	
			}
	
		},
	
		Bounce: {
	
			In: function ( k ) {
	
				return 1 - TWEEN.Easing.Bounce.Out( 1 - k );
	
			},
	
			Out: function ( k ) {
	
				if ( k < ( 1 / 2.75 ) ) {
	
					return 7.5625 * k * k;
	
				} else if ( k < ( 2 / 2.75 ) ) {
	
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
	
				} else if ( k < ( 2.5 / 2.75 ) ) {
	
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
	
				} else {
	
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
	
				}
	
			},
	
			InOut: function ( k ) {
	
				if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
				return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;
	
			}
	
		}
	
	};
	
	TWEEN.Interpolation = {
	
		Linear: function ( v, k ) {
	
			var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;
	
			if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
			if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );
	
			return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );
	
		},
	
		Bezier: function ( v, k ) {
	
			var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;
	
			for ( i = 0; i <= n; i++ ) {
				b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
			}
	
			return b;
	
		},
	
		CatmullRom: function ( v, k ) {
	
			var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;
	
			if ( v[ 0 ] === v[ m ] ) {
	
				if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );
	
				return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );
	
			} else {
	
				if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
				if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );
	
				return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );
	
			}
	
		},
	
		Utils: {
	
			Linear: function ( p0, p1, t ) {
	
				return ( p1 - p0 ) * t + p0;
	
			},
	
			Bernstein: function ( n , i ) {
	
				var fc = TWEEN.Interpolation.Utils.Factorial;
				return fc( n ) / fc( i ) / fc( n - i );
	
			},
	
			Factorial: ( function () {
	
				var a = [ 1 ];
	
				return function ( n ) {
	
					var s = 1, i;
					if ( a[ n ] ) return a[ n ];
					for ( i = n; i > 1; i-- ) s *= i;
					return a[ n ] = s;
	
				};
	
			} )(),
	
			CatmullRom: function ( p0, p1, p2, p3, t ) {
	
				var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
				return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;
	
			}
	
		}
	
	};
	
	// UMD (Universal Module Definition)
	( function ( root ) {
	
		if ( true ) {
	
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return TWEEN;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	
		} else if ( typeof exports === 'object' ) {
	
			// Node.js
			module.exports = TWEEN;
	
		} else {
	
			// Global variable
			root.TWEEN = TWEEN;
	
		}
	
	} )( this );


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;!function() {
	  var d3 = {
	    version: "3.5.6"
	  };
	  var d3_arraySlice = [].slice, d3_array = function(list) {
	    return d3_arraySlice.call(list);
	  };
	  var d3_document = this.document;
	  function d3_documentElement(node) {
	    return node && (node.ownerDocument || node.document || node).documentElement;
	  }
	  function d3_window(node) {
	    return node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
	  }
	  if (d3_document) {
	    try {
	      d3_array(d3_document.documentElement.childNodes)[0].nodeType;
	    } catch (e) {
	      d3_array = function(list) {
	        var i = list.length, array = new Array(i);
	        while (i--) array[i] = list[i];
	        return array;
	      };
	    }
	  }
	  if (!Date.now) Date.now = function() {
	    return +new Date();
	  };
	  if (d3_document) {
	    try {
	      d3_document.createElement("DIV").style.setProperty("opacity", 0, "");
	    } catch (error) {
	      var d3_element_prototype = this.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = this.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;
	      d3_element_prototype.setAttribute = function(name, value) {
	        d3_element_setAttribute.call(this, name, value + "");
	      };
	      d3_element_prototype.setAttributeNS = function(space, local, value) {
	        d3_element_setAttributeNS.call(this, space, local, value + "");
	      };
	      d3_style_prototype.setProperty = function(name, value, priority) {
	        d3_style_setProperty.call(this, name, value + "", priority);
	      };
	    }
	  }
	  d3.ascending = d3_ascending;
	  function d3_ascending(a, b) {
	    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	  }
	  d3.descending = function(a, b) {
	    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
	  };
	  d3.min = function(array, f) {
	    var i = -1, n = array.length, a, b;
	    if (arguments.length === 1) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
	    } else {
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
	    }
	    return a;
	  };
	  d3.max = function(array, f) {
	    var i = -1, n = array.length, a, b;
	    if (arguments.length === 1) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
	    } else {
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
	    }
	    return a;
	  };
	  d3.extent = function(array, f) {
	    var i = -1, n = array.length, a, b, c;
	    if (arguments.length === 1) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) {
	        a = c = b;
	        break;
	      }
	      while (++i < n) if ((b = array[i]) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    } else {
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
	        a = c = b;
	        break;
	      }
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    }
	    return [ a, c ];
	  };
	  function d3_number(x) {
	    return x === null ? NaN : +x;
	  }
	  function d3_numeric(x) {
	    return !isNaN(x);
	  }
	  d3.sum = function(array, f) {
	    var s = 0, n = array.length, a, i = -1;
	    if (arguments.length === 1) {
	      while (++i < n) if (d3_numeric(a = +array[i])) s += a;
	    } else {
	      while (++i < n) if (d3_numeric(a = +f.call(array, array[i], i))) s += a;
	    }
	    return s;
	  };
	  d3.mean = function(array, f) {
	    var s = 0, n = array.length, a, i = -1, j = n;
	    if (arguments.length === 1) {
	      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) s += a; else --j;
	    } else {
	      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) s += a; else --j;
	    }
	    if (j) return s / j;
	  };
	  d3.quantile = function(values, p) {
	    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;
	    return e ? v + e * (values[h] - v) : v;
	  };
	  d3.median = function(array, f) {
	    var numbers = [], n = array.length, a, i = -1;
	    if (arguments.length === 1) {
	      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) numbers.push(a);
	    } else {
	      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) numbers.push(a);
	    }
	    if (numbers.length) return d3.quantile(numbers.sort(d3_ascending), .5);
	  };
	  d3.variance = function(array, f) {
	    var n = array.length, m = 0, a, d, s = 0, i = -1, j = 0;
	    if (arguments.length === 1) {
	      while (++i < n) {
	        if (d3_numeric(a = d3_number(array[i]))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    } else {
	      while (++i < n) {
	        if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    }
	    if (j > 1) return s / (j - 1);
	  };
	  d3.deviation = function() {
	    var v = d3.variance.apply(this, arguments);
	    return v ? Math.sqrt(v) : v;
	  };
	  function d3_bisector(compare) {
	    return {
	      left: function(a, x, lo, hi) {
	        if (arguments.length < 3) lo = 0;
	        if (arguments.length < 4) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid;
	        }
	        return lo;
	      },
	      right: function(a, x, lo, hi) {
	        if (arguments.length < 3) lo = 0;
	        if (arguments.length < 4) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1;
	        }
	        return lo;
	      }
	    };
	  }
	  var d3_bisect = d3_bisector(d3_ascending);
	  d3.bisectLeft = d3_bisect.left;
	  d3.bisect = d3.bisectRight = d3_bisect.right;
	  d3.bisector = function(f) {
	    return d3_bisector(f.length === 1 ? function(d, x) {
	      return d3_ascending(f(d), x);
	    } : f);
	  };
	  d3.shuffle = function(array, i0, i1) {
	    if ((m = arguments.length) < 3) {
	      i1 = array.length;
	      if (m < 2) i0 = 0;
	    }
	    var m = i1 - i0, t, i;
	    while (m) {
	      i = Math.random() * m-- | 0;
	      t = array[m + i0], array[m + i0] = array[i + i0], array[i + i0] = t;
	    }
	    return array;
	  };
	  d3.permute = function(array, indexes) {
	    var i = indexes.length, permutes = new Array(i);
	    while (i--) permutes[i] = array[indexes[i]];
	    return permutes;
	  };
	  d3.pairs = function(array) {
	    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
	    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];
	    return pairs;
	  };
	  d3.zip = function() {
	    if (!(n = arguments.length)) return [];
	    for (var i = -1, m = d3.min(arguments, d3_zipLength), zips = new Array(m); ++i < m; ) {
	      for (var j = -1, n, zip = zips[i] = new Array(n); ++j < n; ) {
	        zip[j] = arguments[j][i];
	      }
	    }
	    return zips;
	  };
	  function d3_zipLength(d) {
	    return d.length;
	  }
	  d3.transpose = function(matrix) {
	    return d3.zip.apply(d3, matrix);
	  };
	  d3.keys = function(map) {
	    var keys = [];
	    for (var key in map) keys.push(key);
	    return keys;
	  };
	  d3.values = function(map) {
	    var values = [];
	    for (var key in map) values.push(map[key]);
	    return values;
	  };
	  d3.entries = function(map) {
	    var entries = [];
	    for (var key in map) entries.push({
	      key: key,
	      value: map[key]
	    });
	    return entries;
	  };
	  d3.merge = function(arrays) {
	    var n = arrays.length, m, i = -1, j = 0, merged, array;
	    while (++i < n) j += arrays[i].length;
	    merged = new Array(j);
	    while (--n >= 0) {
	      array = arrays[n];
	      m = array.length;
	      while (--m >= 0) {
	        merged[--j] = array[m];
	      }
	    }
	    return merged;
	  };
	  var abs = Math.abs;
	  d3.range = function(start, stop, step) {
	    if (arguments.length < 3) {
	      step = 1;
	      if (arguments.length < 2) {
	        stop = start;
	        start = 0;
	      }
	    }
	    if ((stop - start) / step === Infinity) throw new Error("infinite range");
	    var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;
	    start *= k, stop *= k, step *= k;
	    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
	    return range;
	  };
	  function d3_range_integerScale(x) {
	    var k = 1;
	    while (x * k % 1) k *= 10;
	    return k;
	  }
	  function d3_class(ctor, properties) {
	    for (var key in properties) {
	      Object.defineProperty(ctor.prototype, key, {
	        value: properties[key],
	        enumerable: false
	      });
	    }
	  }
	  d3.map = function(object, f) {
	    var map = new d3_Map();
	    if (object instanceof d3_Map) {
	      object.forEach(function(key, value) {
	        map.set(key, value);
	      });
	    } else if (Array.isArray(object)) {
	      var i = -1, n = object.length, o;
	      if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
	    } else {
	      for (var key in object) map.set(key, object[key]);
	    }
	    return map;
	  };
	  function d3_Map() {
	    this._ = Object.create(null);
	  }
	  var d3_map_proto = "__proto__", d3_map_zero = "\x00";
	  d3_class(d3_Map, {
	    has: d3_map_has,
	    get: function(key) {
	      return this._[d3_map_escape(key)];
	    },
	    set: function(key, value) {
	      return this._[d3_map_escape(key)] = value;
	    },
	    remove: d3_map_remove,
	    keys: d3_map_keys,
	    values: function() {
	      var values = [];
	      for (var key in this._) values.push(this._[key]);
	      return values;
	    },
	    entries: function() {
	      var entries = [];
	      for (var key in this._) entries.push({
	        key: d3_map_unescape(key),
	        value: this._[key]
	      });
	      return entries;
	    },
	    size: d3_map_size,
	    empty: d3_map_empty,
	    forEach: function(f) {
	      for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
	    }
	  });
	  function d3_map_escape(key) {
	    return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
	  }
	  function d3_map_unescape(key) {
	    return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
	  }
	  function d3_map_has(key) {
	    return d3_map_escape(key) in this._;
	  }
	  function d3_map_remove(key) {
	    return (key = d3_map_escape(key)) in this._ && delete this._[key];
	  }
	  function d3_map_keys() {
	    var keys = [];
	    for (var key in this._) keys.push(d3_map_unescape(key));
	    return keys;
	  }
	  function d3_map_size() {
	    var size = 0;
	    for (var key in this._) ++size;
	    return size;
	  }
	  function d3_map_empty() {
	    for (var key in this._) return false;
	    return true;
	  }
	  d3.nest = function() {
	    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
	    function map(mapType, array, depth) {
	      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
	      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;
	      while (++i < n) {
	        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
	          values.push(object);
	        } else {
	          valuesByKey.set(keyValue, [ object ]);
	        }
	      }
	      if (mapType) {
	        object = mapType();
	        setter = function(keyValue, values) {
	          object.set(keyValue, map(mapType, values, depth));
	        };
	      } else {
	        object = {};
	        setter = function(keyValue, values) {
	          object[keyValue] = map(mapType, values, depth);
	        };
	      }
	      valuesByKey.forEach(setter);
	      return object;
	    }
	    function entries(map, depth) {
	      if (depth >= keys.length) return map;
	      var array = [], sortKey = sortKeys[depth++];
	      map.forEach(function(key, keyMap) {
	        array.push({
	          key: key,
	          values: entries(keyMap, depth)
	        });
	      });
	      return sortKey ? array.sort(function(a, b) {
	        return sortKey(a.key, b.key);
	      }) : array;
	    }
	    nest.map = function(array, mapType) {
	      return map(mapType, array, 0);
	    };
	    nest.entries = function(array) {
	      return entries(map(d3.map, array, 0), 0);
	    };
	    nest.key = function(d) {
	      keys.push(d);
	      return nest;
	    };
	    nest.sortKeys = function(order) {
	      sortKeys[keys.length - 1] = order;
	      return nest;
	    };
	    nest.sortValues = function(order) {
	      sortValues = order;
	      return nest;
	    };
	    nest.rollup = function(f) {
	      rollup = f;
	      return nest;
	    };
	    return nest;
	  };
	  d3.set = function(array) {
	    var set = new d3_Set();
	    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
	    return set;
	  };
	  function d3_Set() {
	    this._ = Object.create(null);
	  }
	  d3_class(d3_Set, {
	    has: d3_map_has,
	    add: function(key) {
	      this._[d3_map_escape(key += "")] = true;
	      return key;
	    },
	    remove: d3_map_remove,
	    values: d3_map_keys,
	    size: d3_map_size,
	    empty: d3_map_empty,
	    forEach: function(f) {
	      for (var key in this._) f.call(this, d3_map_unescape(key));
	    }
	  });
	  d3.behavior = {};
	  function d3_identity(d) {
	    return d;
	  }
	  d3.rebind = function(target, source) {
	    var i = 1, n = arguments.length, method;
	    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
	    return target;
	  };
	  function d3_rebind(target, source, method) {
	    return function() {
	      var value = method.apply(source, arguments);
	      return value === source ? target : value;
	    };
	  }
	  function d3_vendorSymbol(object, name) {
	    if (name in object) return name;
	    name = name.charAt(0).toUpperCase() + name.slice(1);
	    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
	      var prefixName = d3_vendorPrefixes[i] + name;
	      if (prefixName in object) return prefixName;
	    }
	  }
	  var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
	  function d3_noop() {}
	  d3.dispatch = function() {
	    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;
	    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
	    return dispatch;
	  };
	  function d3_dispatch() {}
	  d3_dispatch.prototype.on = function(type, listener) {
	    var i = type.indexOf("."), name = "";
	    if (i >= 0) {
	      name = type.slice(i + 1);
	      type = type.slice(0, i);
	    }
	    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
	    if (arguments.length === 2) {
	      if (listener == null) for (type in this) {
	        if (this.hasOwnProperty(type)) this[type].on(name, null);
	      }
	      return this;
	    }
	  };
	  function d3_dispatch_event(dispatch) {
	    var listeners = [], listenerByName = new d3_Map();
	    function event() {
	      var z = listeners, i = -1, n = z.length, l;
	      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
	      return dispatch;
	    }
	    event.on = function(name, listener) {
	      var l = listenerByName.get(name), i;
	      if (arguments.length < 2) return l && l.on;
	      if (l) {
	        l.on = null;
	        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
	        listenerByName.remove(name);
	      }
	      if (listener) listeners.push(listenerByName.set(name, {
	        on: listener
	      }));
	      return dispatch;
	    };
	    return event;
	  }
	  d3.event = null;
	  function d3_eventPreventDefault() {
	    d3.event.preventDefault();
	  }
	  function d3_eventSource() {
	    var e = d3.event, s;
	    while (s = e.sourceEvent) e = s;
	    return e;
	  }
	  function d3_eventDispatch(target) {
	    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;
	    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
	    dispatch.of = function(thiz, argumentz) {
	      return function(e1) {
	        try {
	          var e0 = e1.sourceEvent = d3.event;
	          e1.target = target;
	          d3.event = e1;
	          dispatch[e1.type].apply(thiz, argumentz);
	        } finally {
	          d3.event = e0;
	        }
	      };
	    };
	    return dispatch;
	  }
	  d3.requote = function(s) {
	    return s.replace(d3_requote_re, "\\$&");
	  };
	  var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
	  var d3_subclass = {}.__proto__ ? function(object, prototype) {
	    object.__proto__ = prototype;
	  } : function(object, prototype) {
	    for (var property in prototype) object[property] = prototype[property];
	  };
	  function d3_selection(groups) {
	    d3_subclass(groups, d3_selectionPrototype);
	    return groups;
	  }
	  var d3_select = function(s, n) {
	    return n.querySelector(s);
	  }, d3_selectAll = function(s, n) {
	    return n.querySelectorAll(s);
	  }, d3_selectMatches = function(n, s) {
	    var d3_selectMatcher = n.matches || n[d3_vendorSymbol(n, "matchesSelector")];
	    d3_selectMatches = function(n, s) {
	      return d3_selectMatcher.call(n, s);
	    };
	    return d3_selectMatches(n, s);
	  };
	  if (typeof Sizzle === "function") {
	    d3_select = function(s, n) {
	      return Sizzle(s, n)[0] || null;
	    };
	    d3_selectAll = Sizzle;
	    d3_selectMatches = Sizzle.matchesSelector;
	  }
	  d3.selection = function() {
	    return d3.select(d3_document.documentElement);
	  };
	  var d3_selectionPrototype = d3.selection.prototype = [];
	  d3_selectionPrototype.select = function(selector) {
	    var subgroups = [], subgroup, subnode, group, node;
	    selector = d3_selection_selector(selector);
	    for (var j = -1, m = this.length; ++j < m; ) {
	      subgroups.push(subgroup = []);
	      subgroup.parentNode = (group = this[j]).parentNode;
	      for (var i = -1, n = group.length; ++i < n; ) {
	        if (node = group[i]) {
	          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
	          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
	        } else {
	          subgroup.push(null);
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  function d3_selection_selector(selector) {
	    return typeof selector === "function" ? selector : function() {
	      return d3_select(selector, this);
	    };
	  }
	  d3_selectionPrototype.selectAll = function(selector) {
	    var subgroups = [], subgroup, node;
	    selector = d3_selection_selectorAll(selector);
	    for (var j = -1, m = this.length; ++j < m; ) {
	      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
	        if (node = group[i]) {
	          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
	          subgroup.parentNode = node;
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  function d3_selection_selectorAll(selector) {
	    return typeof selector === "function" ? selector : function() {
	      return d3_selectAll(selector, this);
	    };
	  }
	  var d3_nsPrefix = {
	    svg: "http://www.w3.org/2000/svg",
	    xhtml: "http://www.w3.org/1999/xhtml",
	    xlink: "http://www.w3.org/1999/xlink",
	    xml: "http://www.w3.org/XML/1998/namespace",
	    xmlns: "http://www.w3.org/2000/xmlns/"
	  };
	  d3.ns = {
	    prefix: d3_nsPrefix,
	    qualify: function(name) {
	      var i = name.indexOf(":"), prefix = name;
	      if (i >= 0) {
	        prefix = name.slice(0, i);
	        name = name.slice(i + 1);
	      }
	      return d3_nsPrefix.hasOwnProperty(prefix) ? {
	        space: d3_nsPrefix[prefix],
	        local: name
	      } : name;
	    }
	  };
	  d3_selectionPrototype.attr = function(name, value) {
	    if (arguments.length < 2) {
	      if (typeof name === "string") {
	        var node = this.node();
	        name = d3.ns.qualify(name);
	        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
	      }
	      for (value in name) this.each(d3_selection_attr(value, name[value]));
	      return this;
	    }
	    return this.each(d3_selection_attr(name, value));
	  };
	  function d3_selection_attr(name, value) {
	    name = d3.ns.qualify(name);
	    function attrNull() {
	      this.removeAttribute(name);
	    }
	    function attrNullNS() {
	      this.removeAttributeNS(name.space, name.local);
	    }
	    function attrConstant() {
	      this.setAttribute(name, value);
	    }
	    function attrConstantNS() {
	      this.setAttributeNS(name.space, name.local, value);
	    }
	    function attrFunction() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
	    }
	    function attrFunctionNS() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
	    }
	    return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
	  }
	  function d3_collapse(s) {
	    return s.trim().replace(/\s+/g, " ");
	  }
	  d3_selectionPrototype.classed = function(name, value) {
	    if (arguments.length < 2) {
	      if (typeof name === "string") {
	        var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;
	        if (value = node.classList) {
	          while (++i < n) if (!value.contains(name[i])) return false;
	        } else {
	          value = node.getAttribute("class");
	          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
	        }
	        return true;
	      }
	      for (value in name) this.each(d3_selection_classed(value, name[value]));
	      return this;
	    }
	    return this.each(d3_selection_classed(name, value));
	  };
	  function d3_selection_classedRe(name) {
	    return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
	  }
	  function d3_selection_classes(name) {
	    return (name + "").trim().split(/^|\s+/);
	  }
	  function d3_selection_classed(name, value) {
	    name = d3_selection_classes(name).map(d3_selection_classedName);
	    var n = name.length;
	    function classedConstant() {
	      var i = -1;
	      while (++i < n) name[i](this, value);
	    }
	    function classedFunction() {
	      var i = -1, x = value.apply(this, arguments);
	      while (++i < n) name[i](this, x);
	    }
	    return typeof value === "function" ? classedFunction : classedConstant;
	  }
	  function d3_selection_classedName(name) {
	    var re = d3_selection_classedRe(name);
	    return function(node, value) {
	      if (c = node.classList) return value ? c.add(name) : c.remove(name);
	      var c = node.getAttribute("class") || "";
	      if (value) {
	        re.lastIndex = 0;
	        if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
	      } else {
	        node.setAttribute("class", d3_collapse(c.replace(re, " ")));
	      }
	    };
	  }
	  d3_selectionPrototype.style = function(name, value, priority) {
	    var n = arguments.length;
	    if (n < 3) {
	      if (typeof name !== "string") {
	        if (n < 2) value = "";
	        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
	        return this;
	      }
	      if (n < 2) {
	        var node = this.node();
	        return d3_window(node).getComputedStyle(node, null).getPropertyValue(name);
	      }
	      priority = "";
	    }
	    return this.each(d3_selection_style(name, value, priority));
	  };
	  function d3_selection_style(name, value, priority) {
	    function styleNull() {
	      this.style.removeProperty(name);
	    }
	    function styleConstant() {
	      this.style.setProperty(name, value, priority);
	    }
	    function styleFunction() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
	    }
	    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
	  }
	  d3_selectionPrototype.property = function(name, value) {
	    if (arguments.length < 2) {
	      if (typeof name === "string") return this.node()[name];
	      for (value in name) this.each(d3_selection_property(value, name[value]));
	      return this;
	    }
	    return this.each(d3_selection_property(name, value));
	  };
	  function d3_selection_property(name, value) {
	    function propertyNull() {
	      delete this[name];
	    }
	    function propertyConstant() {
	      this[name] = value;
	    }
	    function propertyFunction() {
	      var x = value.apply(this, arguments);
	      if (x == null) delete this[name]; else this[name] = x;
	    }
	    return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
	  }
	  d3_selectionPrototype.text = function(value) {
	    return arguments.length ? this.each(typeof value === "function" ? function() {
	      var v = value.apply(this, arguments);
	      this.textContent = v == null ? "" : v;
	    } : value == null ? function() {
	      this.textContent = "";
	    } : function() {
	      this.textContent = value;
	    }) : this.node().textContent;
	  };
	  d3_selectionPrototype.html = function(value) {
	    return arguments.length ? this.each(typeof value === "function" ? function() {
	      var v = value.apply(this, arguments);
	      this.innerHTML = v == null ? "" : v;
	    } : value == null ? function() {
	      this.innerHTML = "";
	    } : function() {
	      this.innerHTML = value;
	    }) : this.node().innerHTML;
	  };
	  d3_selectionPrototype.append = function(name) {
	    name = d3_selection_creator(name);
	    return this.select(function() {
	      return this.appendChild(name.apply(this, arguments));
	    });
	  };
	  function d3_selection_creator(name) {
	    function create() {
	      var document = this.ownerDocument, namespace = this.namespaceURI;
	      return namespace ? document.createElementNS(namespace, name) : document.createElement(name);
	    }
	    function createNS() {
	      return this.ownerDocument.createElementNS(name.space, name.local);
	    }
	    return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? createNS : create;
	  }
	  d3_selectionPrototype.insert = function(name, before) {
	    name = d3_selection_creator(name);
	    before = d3_selection_selector(before);
	    return this.select(function() {
	      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
	    });
	  };
	  d3_selectionPrototype.remove = function() {
	    return this.each(d3_selectionRemove);
	  };
	  function d3_selectionRemove() {
	    var parent = this.parentNode;
	    if (parent) parent.removeChild(this);
	  }
	  d3_selectionPrototype.data = function(value, key) {
	    var i = -1, n = this.length, group, node;
	    if (!arguments.length) {
	      value = new Array(n = (group = this[0]).length);
	      while (++i < n) {
	        if (node = group[i]) {
	          value[i] = node.__data__;
	        }
	      }
	      return value;
	    }
	    function bind(group, groupData) {
	      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
	      if (key) {
	        var nodeByKeyValue = new d3_Map(), keyValues = new Array(n), keyValue;
	        for (i = -1; ++i < n; ) {
	          if (nodeByKeyValue.has(keyValue = key.call(node = group[i], node.__data__, i))) {
	            exitNodes[i] = node;
	          } else {
	            nodeByKeyValue.set(keyValue, node);
	          }
	          keyValues[i] = keyValue;
	        }
	        for (i = -1; ++i < m; ) {
	          if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
	            enterNodes[i] = d3_selection_dataNode(nodeData);
	          } else if (node !== true) {
	            updateNodes[i] = node;
	            node.__data__ = nodeData;
	          }
	          nodeByKeyValue.set(keyValue, true);
	        }
	        for (i = -1; ++i < n; ) {
	          if (nodeByKeyValue.get(keyValues[i]) !== true) {
	            exitNodes[i] = group[i];
	          }
	        }
	      } else {
	        for (i = -1; ++i < n0; ) {
	          node = group[i];
	          nodeData = groupData[i];
	          if (node) {
	            node.__data__ = nodeData;
	            updateNodes[i] = node;
	          } else {
	            enterNodes[i] = d3_selection_dataNode(nodeData);
	          }
	        }
	        for (;i < m; ++i) {
	          enterNodes[i] = d3_selection_dataNode(groupData[i]);
	        }
	        for (;i < n; ++i) {
	          exitNodes[i] = group[i];
	        }
	      }
	      enterNodes.update = updateNodes;
	      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
	      enter.push(enterNodes);
	      update.push(updateNodes);
	      exit.push(exitNodes);
	    }
	    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
	    if (typeof value === "function") {
	      while (++i < n) {
	        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
	      }
	    } else {
	      while (++i < n) {
	        bind(group = this[i], value);
	      }
	    }
	    update.enter = function() {
	      return enter;
	    };
	    update.exit = function() {
	      return exit;
	    };
	    return update;
	  };
	  function d3_selection_dataNode(data) {
	    return {
	      __data__: data
	    };
	  }
	  d3_selectionPrototype.datum = function(value) {
	    return arguments.length ? this.property("__data__", value) : this.property("__data__");
	  };
	  d3_selectionPrototype.filter = function(filter) {
	    var subgroups = [], subgroup, group, node;
	    if (typeof filter !== "function") filter = d3_selection_filter(filter);
	    for (var j = 0, m = this.length; j < m; j++) {
	      subgroups.push(subgroup = []);
	      subgroup.parentNode = (group = this[j]).parentNode;
	      for (var i = 0, n = group.length; i < n; i++) {
	        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
	          subgroup.push(node);
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  function d3_selection_filter(selector) {
	    return function() {
	      return d3_selectMatches(this, selector);
	    };
	  }
	  d3_selectionPrototype.order = function() {
	    for (var j = -1, m = this.length; ++j < m; ) {
	      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
	        if (node = group[i]) {
	          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
	          next = node;
	        }
	      }
	    }
	    return this;
	  };
	  d3_selectionPrototype.sort = function(comparator) {
	    comparator = d3_selection_sortComparator.apply(this, arguments);
	    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
	    return this.order();
	  };
	  function d3_selection_sortComparator(comparator) {
	    if (!arguments.length) comparator = d3_ascending;
	    return function(a, b) {
	      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
	    };
	  }
	  d3_selectionPrototype.each = function(callback) {
	    return d3_selection_each(this, function(node, i, j) {
	      callback.call(node, node.__data__, i, j);
	    });
	  };
	  function d3_selection_each(groups, callback) {
	    for (var j = 0, m = groups.length; j < m; j++) {
	      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
	        if (node = group[i]) callback(node, i, j);
	      }
	    }
	    return groups;
	  }
	  d3_selectionPrototype.call = function(callback) {
	    var args = d3_array(arguments);
	    callback.apply(args[0] = this, args);
	    return this;
	  };
	  d3_selectionPrototype.empty = function() {
	    return !this.node();
	  };
	  d3_selectionPrototype.node = function() {
	    for (var j = 0, m = this.length; j < m; j++) {
	      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
	        var node = group[i];
	        if (node) return node;
	      }
	    }
	    return null;
	  };
	  d3_selectionPrototype.size = function() {
	    var n = 0;
	    d3_selection_each(this, function() {
	      ++n;
	    });
	    return n;
	  };
	  function d3_selection_enter(selection) {
	    d3_subclass(selection, d3_selection_enterPrototype);
	    return selection;
	  }
	  var d3_selection_enterPrototype = [];
	  d3.selection.enter = d3_selection_enter;
	  d3.selection.enter.prototype = d3_selection_enterPrototype;
	  d3_selection_enterPrototype.append = d3_selectionPrototype.append;
	  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
	  d3_selection_enterPrototype.node = d3_selectionPrototype.node;
	  d3_selection_enterPrototype.call = d3_selectionPrototype.call;
	  d3_selection_enterPrototype.size = d3_selectionPrototype.size;
	  d3_selection_enterPrototype.select = function(selector) {
	    var subgroups = [], subgroup, subnode, upgroup, group, node;
	    for (var j = -1, m = this.length; ++j < m; ) {
	      upgroup = (group = this[j]).update;
	      subgroups.push(subgroup = []);
	      subgroup.parentNode = group.parentNode;
	      for (var i = -1, n = group.length; ++i < n; ) {
	        if (node = group[i]) {
	          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
	          subnode.__data__ = node.__data__;
	        } else {
	          subgroup.push(null);
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  d3_selection_enterPrototype.insert = function(name, before) {
	    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
	    return d3_selectionPrototype.insert.call(this, name, before);
	  };
	  function d3_selection_enterInsertBefore(enter) {
	    var i0, j0;
	    return function(d, i, j) {
	      var group = enter[j].update, n = group.length, node;
	      if (j != j0) j0 = j, i0 = 0;
	      if (i >= i0) i0 = i + 1;
	      while (!(node = group[i0]) && ++i0 < n) ;
	      return node;
	    };
	  }
	  d3.select = function(node) {
	    var group;
	    if (typeof node === "string") {
	      group = [ d3_select(node, d3_document) ];
	      group.parentNode = d3_document.documentElement;
	    } else {
	      group = [ node ];
	      group.parentNode = d3_documentElement(node);
	    }
	    return d3_selection([ group ]);
	  };
	  d3.selectAll = function(nodes) {
	    var group;
	    if (typeof nodes === "string") {
	      group = d3_array(d3_selectAll(nodes, d3_document));
	      group.parentNode = d3_document.documentElement;
	    } else {
	      group = nodes;
	      group.parentNode = null;
	    }
	    return d3_selection([ group ]);
	  };
	  d3_selectionPrototype.on = function(type, listener, capture) {
	    var n = arguments.length;
	    if (n < 3) {
	      if (typeof type !== "string") {
	        if (n < 2) listener = false;
	        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
	        return this;
	      }
	      if (n < 2) return (n = this.node()["__on" + type]) && n._;
	      capture = false;
	    }
	    return this.each(d3_selection_on(type, listener, capture));
	  };
	  function d3_selection_on(type, listener, capture) {
	    var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
	    if (i > 0) type = type.slice(0, i);
	    var filter = d3_selection_onFilters.get(type);
	    if (filter) type = filter, wrap = d3_selection_onFilter;
	    function onRemove() {
	      var l = this[name];
	      if (l) {
	        this.removeEventListener(type, l, l.$);
	        delete this[name];
	      }
	    }
	    function onAdd() {
	      var l = wrap(listener, d3_array(arguments));
	      onRemove.call(this);
	      this.addEventListener(type, this[name] = l, l.$ = capture);
	      l._ = listener;
	    }
	    function removeAll() {
	      var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"), match;
	      for (var name in this) {
	        if (match = name.match(re)) {
	          var l = this[name];
	          this.removeEventListener(match[1], l, l.$);
	          delete this[name];
	        }
	      }
	    }
	    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
	  }
	  var d3_selection_onFilters = d3.map({
	    mouseenter: "mouseover",
	    mouseleave: "mouseout"
	  });
	  if (d3_document) {
	    d3_selection_onFilters.forEach(function(k) {
	      if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
	    });
	  }
	  function d3_selection_onListener(listener, argumentz) {
	    return function(e) {
	      var o = d3.event;
	      d3.event = e;
	      argumentz[0] = this.__data__;
	      try {
	        listener.apply(this, argumentz);
	      } finally {
	        d3.event = o;
	      }
	    };
	  }
	  function d3_selection_onFilter(listener, argumentz) {
	    var l = d3_selection_onListener(listener, argumentz);
	    return function(e) {
	      var target = this, related = e.relatedTarget;
	      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
	        l.call(target, e);
	      }
	    };
	  }
	  var d3_event_dragSelect, d3_event_dragId = 0;
	  function d3_event_dragSuppress(node) {
	    var name = ".dragsuppress-" + ++d3_event_dragId, click = "click" + name, w = d3.select(d3_window(node)).on("touchmove" + name, d3_eventPreventDefault).on("dragstart" + name, d3_eventPreventDefault).on("selectstart" + name, d3_eventPreventDefault);
	    if (d3_event_dragSelect == null) {
	      d3_event_dragSelect = "onselectstart" in node ? false : d3_vendorSymbol(node.style, "userSelect");
	    }
	    if (d3_event_dragSelect) {
	      var style = d3_documentElement(node).style, select = style[d3_event_dragSelect];
	      style[d3_event_dragSelect] = "none";
	    }
	    return function(suppressClick) {
	      w.on(name, null);
	      if (d3_event_dragSelect) style[d3_event_dragSelect] = select;
	      if (suppressClick) {
	        var off = function() {
	          w.on(click, null);
	        };
	        w.on(click, function() {
	          d3_eventPreventDefault();
	          off();
	        }, true);
	        setTimeout(off, 0);
	      }
	    };
	  }
	  d3.mouse = function(container) {
	    return d3_mousePoint(container, d3_eventSource());
	  };
	  var d3_mouse_bug44083 = this.navigator && /WebKit/.test(this.navigator.userAgent) ? -1 : 0;
	  function d3_mousePoint(container, e) {
	    if (e.changedTouches) e = e.changedTouches[0];
	    var svg = container.ownerSVGElement || container;
	    if (svg.createSVGPoint) {
	      var point = svg.createSVGPoint();
	      if (d3_mouse_bug44083 < 0) {
	        var window = d3_window(container);
	        if (window.scrollX || window.scrollY) {
	          svg = d3.select("body").append("svg").style({
	            position: "absolute",
	            top: 0,
	            left: 0,
	            margin: 0,
	            padding: 0,
	            border: "none"
	          }, "important");
	          var ctm = svg[0][0].getScreenCTM();
	          d3_mouse_bug44083 = !(ctm.f || ctm.e);
	          svg.remove();
	        }
	      }
	      if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, 
	      point.y = e.clientY;
	      point = point.matrixTransform(container.getScreenCTM().inverse());
	      return [ point.x, point.y ];
	    }
	    var rect = container.getBoundingClientRect();
	    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
	  }
	  d3.touch = function(container, touches, identifier) {
	    if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches;
	    if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {
	      if ((touch = touches[i]).identifier === identifier) {
	        return d3_mousePoint(container, touch);
	      }
	    }
	  };
	  d3.behavior.drag = function() {
	    var event = d3_eventDispatch(drag, "drag", "dragstart", "dragend"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, d3_window, "mousemove", "mouseup"), touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_identity, "touchmove", "touchend");
	    function drag() {
	      this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart);
	    }
	    function dragstart(id, position, subject, move, end) {
	      return function() {
	        var that = this, target = d3.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = ".drag" + (dragId == null ? "" : "-" + dragId), dragOffset, dragSubject = d3.select(subject(target)).on(move + dragName, moved).on(end + dragName, ended), dragRestore = d3_event_dragSuppress(target), position0 = position(parent, dragId);
	        if (origin) {
	          dragOffset = origin.apply(that, arguments);
	          dragOffset = [ dragOffset.x - position0[0], dragOffset.y - position0[1] ];
	        } else {
	          dragOffset = [ 0, 0 ];
	        }
	        dispatch({
	          type: "dragstart"
	        });
	        function moved() {
	          var position1 = position(parent, dragId), dx, dy;
	          if (!position1) return;
	          dx = position1[0] - position0[0];
	          dy = position1[1] - position0[1];
	          dragged |= dx | dy;
	          position0 = position1;
	          dispatch({
	            type: "drag",
	            x: position1[0] + dragOffset[0],
	            y: position1[1] + dragOffset[1],
	            dx: dx,
	            dy: dy
	          });
	        }
	        function ended() {
	          if (!position(parent, dragId)) return;
	          dragSubject.on(move + dragName, null).on(end + dragName, null);
	          dragRestore(dragged && d3.event.target === target);
	          dispatch({
	            type: "dragend"
	          });
	        }
	      };
	    }
	    drag.origin = function(x) {
	      if (!arguments.length) return origin;
	      origin = x;
	      return drag;
	    };
	    return d3.rebind(drag, event, "on");
	  };
	  function d3_behavior_dragTouchId() {
	    return d3.event.changedTouches[0].identifier;
	  }
	  d3.touches = function(container, touches) {
	    if (arguments.length < 2) touches = d3_eventSource().touches;
	    return touches ? d3_array(touches).map(function(touch) {
	      var point = d3_mousePoint(container, touch);
	      point.identifier = touch.identifier;
	      return point;
	    }) : [];
	  };
	  var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;
	  function d3_sgn(x) {
	    return x > 0 ? 1 : x < 0 ? -1 : 0;
	  }
	  function d3_cross2d(a, b, c) {
	    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
	  }
	  function d3_acos(x) {
	    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
	  }
	  function d3_asin(x) {
	    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
	  }
	  function d3_sinh(x) {
	    return ((x = Math.exp(x)) - 1 / x) / 2;
	  }
	  function d3_cosh(x) {
	    return ((x = Math.exp(x)) + 1 / x) / 2;
	  }
	  function d3_tanh(x) {
	    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
	  }
	  function d3_haversin(x) {
	    return (x = Math.sin(x / 2)) * x;
	  }
	  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;
	  d3.interpolateZoom = function(p0, p1) {
	    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2];
	    var dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), dr = r1 - r0, S = (dr || Math.log(w1 / w0)) / ρ;
	    function interpolate(t) {
	      var s = t * S;
	      if (dr) {
	        var coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));
	        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ];
	      }
	      return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * s) ];
	    }
	    interpolate.duration = S * 1e3;
	    return interpolate;
	  };
	  d3.behavior.zoom = function() {
	    var view = {
	      x: 0,
	      y: 0,
	      k: 1
	    }, translate0, center0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, duration = 250, zooming = 0, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", mousewheelTimer, touchstart = "touchstart.zoom", touchtime, event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"), x0, x1, y0, y1;
	    if (!d3_behavior_zoomWheel) {
	      d3_behavior_zoomWheel = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function() {
	        return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);
	      }, "wheel") : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function() {
	        return d3.event.wheelDelta;
	      }, "mousewheel") : (d3_behavior_zoomDelta = function() {
	        return -d3.event.detail;
	      }, "MozMousePixelScroll");
	    }
	    function zoom(g) {
	      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted);
	    }
	    zoom.event = function(g) {
	      g.each(function() {
	        var dispatch = event.of(this, arguments), view1 = view;
	        if (d3_transitionInheritId) {
	          d3.select(this).transition().each("start.zoom", function() {
	            view = this.__chart__ || {
	              x: 0,
	              y: 0,
	              k: 1
	            };
	            zoomstarted(dispatch);
	          }).tween("zoom:zoom", function() {
	            var dx = size[0], dy = size[1], cx = center0 ? center0[0] : dx / 2, cy = center0 ? center0[1] : dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);
	            return function(t) {
	              var l = i(t), k = dx / l[2];
	              this.__chart__ = view = {
	                x: cx - l[0] * k,
	                y: cy - l[1] * k,
	                k: k
	              };
	              zoomed(dispatch);
	            };
	          }).each("interrupt.zoom", function() {
	            zoomended(dispatch);
	          }).each("end.zoom", function() {
	            zoomended(dispatch);
	          });
	        } else {
	          this.__chart__ = view;
	          zoomstarted(dispatch);
	          zoomed(dispatch);
	          zoomended(dispatch);
	        }
	      });
	    };
	    zoom.translate = function(_) {
	      if (!arguments.length) return [ view.x, view.y ];
	      view = {
	        x: +_[0],
	        y: +_[1],
	        k: view.k
	      };
	      rescale();
	      return zoom;
	    };
	    zoom.scale = function(_) {
	      if (!arguments.length) return view.k;
	      view = {
	        x: view.x,
	        y: view.y,
	        k: +_
	      };
	      rescale();
	      return zoom;
	    };
	    zoom.scaleExtent = function(_) {
	      if (!arguments.length) return scaleExtent;
	      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];
	      return zoom;
	    };
	    zoom.center = function(_) {
	      if (!arguments.length) return center;
	      center = _ && [ +_[0], +_[1] ];
	      return zoom;
	    };
	    zoom.size = function(_) {
	      if (!arguments.length) return size;
	      size = _ && [ +_[0], +_[1] ];
	      return zoom;
	    };
	    zoom.duration = function(_) {
	      if (!arguments.length) return duration;
	      duration = +_;
	      return zoom;
	    };
	    zoom.x = function(z) {
	      if (!arguments.length) return x1;
	      x1 = z;
	      x0 = z.copy();
	      view = {
	        x: 0,
	        y: 0,
	        k: 1
	      };
	      return zoom;
	    };
	    zoom.y = function(z) {
	      if (!arguments.length) return y1;
	      y1 = z;
	      y0 = z.copy();
	      view = {
	        x: 0,
	        y: 0,
	        k: 1
	      };
	      return zoom;
	    };
	    function location(p) {
	      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];
	    }
	    function point(l) {
	      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];
	    }
	    function scaleTo(s) {
	      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
	    }
	    function translateTo(p, l) {
	      l = point(l);
	      view.x += p[0] - l[0];
	      view.y += p[1] - l[1];
	    }
	    function zoomTo(that, p, l, k) {
	      that.__chart__ = {
	        x: view.x,
	        y: view.y,
	        k: view.k
	      };
	      scaleTo(Math.pow(2, k));
	      translateTo(center0 = p, l);
	      that = d3.select(that);
	      if (duration > 0) that = that.transition().duration(duration);
	      that.call(zoom.event);
	    }
	    function rescale() {
	      if (x1) x1.domain(x0.range().map(function(x) {
	        return (x - view.x) / view.k;
	      }).map(x0.invert));
	      if (y1) y1.domain(y0.range().map(function(y) {
	        return (y - view.y) / view.k;
	      }).map(y0.invert));
	    }
	    function zoomstarted(dispatch) {
	      if (!zooming++) dispatch({
	        type: "zoomstart"
	      });
	    }
	    function zoomed(dispatch) {
	      rescale();
	      dispatch({
	        type: "zoom",
	        scale: view.k,
	        translate: [ view.x, view.y ]
	      });
	    }
	    function zoomended(dispatch) {
	      if (!--zooming) dispatch({
	        type: "zoomend"
	      }), center0 = null;
	    }
	    function mousedowned() {
	      var that = this, target = d3.event.target, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window(that)).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress(that);
	      d3_selection_interrupt.call(that);
	      zoomstarted(dispatch);
	      function moved() {
	        dragged = 1;
	        translateTo(d3.mouse(that), location0);
	        zoomed(dispatch);
	      }
	      function ended() {
	        subject.on(mousemove, null).on(mouseup, null);
	        dragRestore(dragged && d3.event.target === target);
	        zoomended(dispatch);
	      }
	    }
	    function touchstarted() {
	      var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = ".zoom-" + d3.event.changedTouches[0].identifier, touchmove = "touchmove" + zoomName, touchend = "touchend" + zoomName, targets = [], subject = d3.select(that), dragRestore = d3_event_dragSuppress(that);
	      started();
	      zoomstarted(dispatch);
	      subject.on(mousedown, null).on(touchstart, started);
	      function relocate() {
	        var touches = d3.touches(that);
	        scale0 = view.k;
	        touches.forEach(function(t) {
	          if (t.identifier in locations0) locations0[t.identifier] = location(t);
	        });
	        return touches;
	      }
	      function started() {
	        var target = d3.event.target;
	        d3.select(target).on(touchmove, moved).on(touchend, ended);
	        targets.push(target);
	        var changed = d3.event.changedTouches;
	        for (var i = 0, n = changed.length; i < n; ++i) {
	          locations0[changed[i].identifier] = null;
	        }
	        var touches = relocate(), now = Date.now();
	        if (touches.length === 1) {
	          if (now - touchtime < 500) {
	            var p = touches[0];
	            zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.k) / Math.LN2) + 1);
	            d3_eventPreventDefault();
	          }
	          touchtime = now;
	        } else if (touches.length > 1) {
	          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
	          distance0 = dx * dx + dy * dy;
	        }
	      }
	      function moved() {
	        var touches = d3.touches(that), p0, l0, p1, l1;
	        d3_selection_interrupt.call(that);
	        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
	          p1 = touches[i];
	          if (l1 = locations0[p1.identifier]) {
	            if (l0) break;
	            p0 = p1, l0 = l1;
	          }
	        }
	        if (l1) {
	          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);
	          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];
	          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];
	          scaleTo(scale1 * scale0);
	        }
	        touchtime = null;
	        translateTo(p0, l0);
	        zoomed(dispatch);
	      }
	      function ended() {
	        if (d3.event.touches.length) {
	          var changed = d3.event.changedTouches;
	          for (var i = 0, n = changed.length; i < n; ++i) {
	            delete locations0[changed[i].identifier];
	          }
	          for (var identifier in locations0) {
	            return void relocate();
	          }
	        }
	        d3.selectAll(targets).on(zoomName, null);
	        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);
	        dragRestore();
	        zoomended(dispatch);
	      }
	    }
	    function mousewheeled() {
	      var dispatch = event.of(this, arguments);
	      if (mousewheelTimer) clearTimeout(mousewheelTimer); else d3_selection_interrupt.call(this), 
	      translate0 = location(center0 = center || d3.mouse(this)), zoomstarted(dispatch);
	      mousewheelTimer = setTimeout(function() {
	        mousewheelTimer = null;
	        zoomended(dispatch);
	      }, 50);
	      d3_eventPreventDefault();
	      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);
	      translateTo(center0, translate0);
	      zoomed(dispatch);
	    }
	    function dblclicked() {
	      var p = d3.mouse(this), k = Math.log(view.k) / Math.LN2;
	      zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1);
	    }
	    return d3.rebind(zoom, event, "on");
	  };
	  var d3_behavior_zoomInfinity = [ 0, Infinity ], d3_behavior_zoomDelta, d3_behavior_zoomWheel;
	  d3.color = d3_color;
	  function d3_color() {}
	  d3_color.prototype.toString = function() {
	    return this.rgb() + "";
	  };
	  d3.hsl = d3_hsl;
	  function d3_hsl(h, s, l) {
	    return this instanceof d3_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l);
	  }
	  var d3_hslPrototype = d3_hsl.prototype = new d3_color();
	  d3_hslPrototype.brighter = function(k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    return new d3_hsl(this.h, this.s, this.l / k);
	  };
	  d3_hslPrototype.darker = function(k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    return new d3_hsl(this.h, this.s, k * this.l);
	  };
	  d3_hslPrototype.rgb = function() {
	    return d3_hsl_rgb(this.h, this.s, this.l);
	  };
	  function d3_hsl_rgb(h, s, l) {
	    var m1, m2;
	    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
	    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
	    l = l < 0 ? 0 : l > 1 ? 1 : l;
	    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
	    m1 = 2 * l - m2;
	    function v(h) {
	      if (h > 360) h -= 360; else if (h < 0) h += 360;
	      if (h < 60) return m1 + (m2 - m1) * h / 60;
	      if (h < 180) return m2;
	      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
	      return m1;
	    }
	    function vv(h) {
	      return Math.round(v(h) * 255);
	    }
	    return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));
	  }
	  d3.hcl = d3_hcl;
	  function d3_hcl(h, c, l) {
	    return this instanceof d3_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l);
	  }
	  var d3_hclPrototype = d3_hcl.prototype = new d3_color();
	  d3_hclPrototype.brighter = function(k) {
	    return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
	  };
	  d3_hclPrototype.darker = function(k) {
	    return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
	  };
	  d3_hclPrototype.rgb = function() {
	    return d3_hcl_lab(this.h, this.c, this.l).rgb();
	  };
	  function d3_hcl_lab(h, c, l) {
	    if (isNaN(h)) h = 0;
	    if (isNaN(c)) c = 0;
	    return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
	  }
	  d3.lab = d3_lab;
	  function d3_lab(l, a, b) {
	    return this instanceof d3_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h, l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b);
	  }
	  var d3_lab_K = 18;
	  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;
	  var d3_labPrototype = d3_lab.prototype = new d3_color();
	  d3_labPrototype.brighter = function(k) {
	    return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
	  };
	  d3_labPrototype.darker = function(k) {
	    return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
	  };
	  d3_labPrototype.rgb = function() {
	    return d3_lab_rgb(this.l, this.a, this.b);
	  };
	  function d3_lab_rgb(l, a, b) {
	    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
	    x = d3_lab_xyz(x) * d3_lab_X;
	    y = d3_lab_xyz(y) * d3_lab_Y;
	    z = d3_lab_xyz(z) * d3_lab_Z;
	    return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
	  }
	  function d3_lab_hcl(l, a, b) {
	    return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(NaN, NaN, l);
	  }
	  function d3_lab_xyz(x) {
	    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
	  }
	  function d3_xyz_lab(x) {
	    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
	  }
	  function d3_xyz_rgb(r) {
	    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
	  }
	  d3.rgb = d3_rgb;
	  function d3_rgb(r, g, b) {
	    return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);
	  }
	  function d3_rgbNumber(value) {
	    return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
	  }
	  function d3_rgbString(value) {
	    return d3_rgbNumber(value) + "";
	  }
	  var d3_rgbPrototype = d3_rgb.prototype = new d3_color();
	  d3_rgbPrototype.brighter = function(k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    var r = this.r, g = this.g, b = this.b, i = 30;
	    if (!r && !g && !b) return new d3_rgb(i, i, i);
	    if (r && r < i) r = i;
	    if (g && g < i) g = i;
	    if (b && b < i) b = i;
	    return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
	  };
	  d3_rgbPrototype.darker = function(k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    return new d3_rgb(k * this.r, k * this.g, k * this.b);
	  };
	  d3_rgbPrototype.hsl = function() {
	    return d3_rgb_hsl(this.r, this.g, this.b);
	  };
	  d3_rgbPrototype.toString = function() {
	    return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
	  };
	  function d3_rgb_hex(v) {
	    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
	  }
	  function d3_rgb_parse(format, rgb, hsl) {
	    format = format.toLowerCase();
	    var r = 0, g = 0, b = 0, m1, m2, color;
	    m1 = /([a-z]+)\((.*)\)/.exec(format);
	    if (m1) {
	      m2 = m1[2].split(",");
	      switch (m1[1]) {
	       case "hsl":
	        {
	          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
	        }
	
	       case "rgb":
	        {
	          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
	        }
	      }
	    }
	    if (color = d3_rgb_names.get(format)) {
	      return rgb(color.r, color.g, color.b);
	    }
	    if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
	      if (format.length === 4) {
	        r = (color & 3840) >> 4;
	        r = r >> 4 | r;
	        g = color & 240;
	        g = g >> 4 | g;
	        b = color & 15;
	        b = b << 4 | b;
	      } else if (format.length === 7) {
	        r = (color & 16711680) >> 16;
	        g = (color & 65280) >> 8;
	        b = color & 255;
	      }
	    }
	    return rgb(r, g, b);
	  }
	  function d3_rgb_hsl(r, g, b) {
	    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
	    if (d) {
	      s = l < .5 ? d / (max + min) : d / (2 - max - min);
	      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
	      h *= 60;
	    } else {
	      h = NaN;
	      s = l > 0 && l < 1 ? 0 : h;
	    }
	    return new d3_hsl(h, s, l);
	  }
	  function d3_rgb_lab(r, g, b) {
	    r = d3_rgb_xyz(r);
	    g = d3_rgb_xyz(g);
	    b = d3_rgb_xyz(b);
	    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
	    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
	  }
	  function d3_rgb_xyz(r) {
	    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
	  }
	  function d3_rgb_parseNumber(c) {
	    var f = parseFloat(c);
	    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
	  }
	  var d3_rgb_names = d3.map({
	    aliceblue: 15792383,
	    antiquewhite: 16444375,
	    aqua: 65535,
	    aquamarine: 8388564,
	    azure: 15794175,
	    beige: 16119260,
	    bisque: 16770244,
	    black: 0,
	    blanchedalmond: 16772045,
	    blue: 255,
	    blueviolet: 9055202,
	    brown: 10824234,
	    burlywood: 14596231,
	    cadetblue: 6266528,
	    chartreuse: 8388352,
	    chocolate: 13789470,
	    coral: 16744272,
	    cornflowerblue: 6591981,
	    cornsilk: 16775388,
	    crimson: 14423100,
	    cyan: 65535,
	    darkblue: 139,
	    darkcyan: 35723,
	    darkgoldenrod: 12092939,
	    darkgray: 11119017,
	    darkgreen: 25600,
	    darkgrey: 11119017,
	    darkkhaki: 12433259,
	    darkmagenta: 9109643,
	    darkolivegreen: 5597999,
	    darkorange: 16747520,
	    darkorchid: 10040012,
	    darkred: 9109504,
	    darksalmon: 15308410,
	    darkseagreen: 9419919,
	    darkslateblue: 4734347,
	    darkslategray: 3100495,
	    darkslategrey: 3100495,
	    darkturquoise: 52945,
	    darkviolet: 9699539,
	    deeppink: 16716947,
	    deepskyblue: 49151,
	    dimgray: 6908265,
	    dimgrey: 6908265,
	    dodgerblue: 2003199,
	    firebrick: 11674146,
	    floralwhite: 16775920,
	    forestgreen: 2263842,
	    fuchsia: 16711935,
	    gainsboro: 14474460,
	    ghostwhite: 16316671,
	    gold: 16766720,
	    goldenrod: 14329120,
	    gray: 8421504,
	    green: 32768,
	    greenyellow: 11403055,
	    grey: 8421504,
	    honeydew: 15794160,
	    hotpink: 16738740,
	    indianred: 13458524,
	    indigo: 4915330,
	    ivory: 16777200,
	    khaki: 15787660,
	    lavender: 15132410,
	    lavenderblush: 16773365,
	    lawngreen: 8190976,
	    lemonchiffon: 16775885,
	    lightblue: 11393254,
	    lightcoral: 15761536,
	    lightcyan: 14745599,
	    lightgoldenrodyellow: 16448210,
	    lightgray: 13882323,
	    lightgreen: 9498256,
	    lightgrey: 13882323,
	    lightpink: 16758465,
	    lightsalmon: 16752762,
	    lightseagreen: 2142890,
	    lightskyblue: 8900346,
	    lightslategray: 7833753,
	    lightslategrey: 7833753,
	    lightsteelblue: 11584734,
	    lightyellow: 16777184,
	    lime: 65280,
	    limegreen: 3329330,
	    linen: 16445670,
	    magenta: 16711935,
	    maroon: 8388608,
	    mediumaquamarine: 6737322,
	    mediumblue: 205,
	    mediumorchid: 12211667,
	    mediumpurple: 9662683,
	    mediumseagreen: 3978097,
	    mediumslateblue: 8087790,
	    mediumspringgreen: 64154,
	    mediumturquoise: 4772300,
	    mediumvioletred: 13047173,
	    midnightblue: 1644912,
	    mintcream: 16121850,
	    mistyrose: 16770273,
	    moccasin: 16770229,
	    navajowhite: 16768685,
	    navy: 128,
	    oldlace: 16643558,
	    olive: 8421376,
	    olivedrab: 7048739,
	    orange: 16753920,
	    orangered: 16729344,
	    orchid: 14315734,
	    palegoldenrod: 15657130,
	    palegreen: 10025880,
	    paleturquoise: 11529966,
	    palevioletred: 14381203,
	    papayawhip: 16773077,
	    peachpuff: 16767673,
	    peru: 13468991,
	    pink: 16761035,
	    plum: 14524637,
	    powderblue: 11591910,
	    purple: 8388736,
	    rebeccapurple: 6697881,
	    red: 16711680,
	    rosybrown: 12357519,
	    royalblue: 4286945,
	    saddlebrown: 9127187,
	    salmon: 16416882,
	    sandybrown: 16032864,
	    seagreen: 3050327,
	    seashell: 16774638,
	    sienna: 10506797,
	    silver: 12632256,
	    skyblue: 8900331,
	    slateblue: 6970061,
	    slategray: 7372944,
	    slategrey: 7372944,
	    snow: 16775930,
	    springgreen: 65407,
	    steelblue: 4620980,
	    tan: 13808780,
	    teal: 32896,
	    thistle: 14204888,
	    tomato: 16737095,
	    turquoise: 4251856,
	    violet: 15631086,
	    wheat: 16113331,
	    white: 16777215,
	    whitesmoke: 16119285,
	    yellow: 16776960,
	    yellowgreen: 10145074
	  });
	  d3_rgb_names.forEach(function(key, value) {
	    d3_rgb_names.set(key, d3_rgbNumber(value));
	  });
	  function d3_functor(v) {
	    return typeof v === "function" ? v : function() {
	      return v;
	    };
	  }
	  d3.functor = d3_functor;
	  d3.xhr = d3_xhrType(d3_identity);
	  function d3_xhrType(response) {
	    return function(url, mimeType, callback) {
	      if (arguments.length === 2 && typeof mimeType === "function") callback = mimeType, 
	      mimeType = null;
	      return d3_xhr(url, mimeType, response, callback);
	    };
	  }
	  function d3_xhr(url, mimeType, response, callback) {
	    var xhr = {}, dispatch = d3.dispatch("beforesend", "progress", "load", "error"), headers = {}, request = new XMLHttpRequest(), responseType = null;
	    if (this.XDomainRequest && !("withCredentials" in request) && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();
	    "onload" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {
	      request.readyState > 3 && respond();
	    };
	    function respond() {
	      var status = request.status, result;
	      if (!status && d3_xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
	        try {
	          result = response.call(xhr, request);
	        } catch (e) {
	          dispatch.error.call(xhr, e);
	          return;
	        }
	        dispatch.load.call(xhr, result);
	      } else {
	        dispatch.error.call(xhr, request);
	      }
	    }
	    request.onprogress = function(event) {
	      var o = d3.event;
	      d3.event = event;
	      try {
	        dispatch.progress.call(xhr, request);
	      } finally {
	        d3.event = o;
	      }
	    };
	    xhr.header = function(name, value) {
	      name = (name + "").toLowerCase();
	      if (arguments.length < 2) return headers[name];
	      if (value == null) delete headers[name]; else headers[name] = value + "";
	      return xhr;
	    };
	    xhr.mimeType = function(value) {
	      if (!arguments.length) return mimeType;
	      mimeType = value == null ? null : value + "";
	      return xhr;
	    };
	    xhr.responseType = function(value) {
	      if (!arguments.length) return responseType;
	      responseType = value;
	      return xhr;
	    };
	    xhr.response = function(value) {
	      response = value;
	      return xhr;
	    };
	    [ "get", "post" ].forEach(function(method) {
	      xhr[method] = function() {
	        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));
	      };
	    });
	    xhr.send = function(method, data, callback) {
	      if (arguments.length === 2 && typeof data === "function") callback = data, data = null;
	      request.open(method, url, true);
	      if (mimeType != null && !("accept" in headers)) headers["accept"] = mimeType + ",*/*";
	      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);
	      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
	      if (responseType != null) request.responseType = responseType;
	      if (callback != null) xhr.on("error", callback).on("load", function(request) {
	        callback(null, request);
	      });
	      dispatch.beforesend.call(xhr, request);
	      request.send(data == null ? null : data);
	      return xhr;
	    };
	    xhr.abort = function() {
	      request.abort();
	      return xhr;
	    };
	    d3.rebind(xhr, dispatch, "on");
	    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));
	  }
	  function d3_xhr_fixCallback(callback) {
	    return callback.length === 1 ? function(error, request) {
	      callback(error == null ? request : null);
	    } : callback;
	  }
	  function d3_xhrHasResponse(request) {
	    var type = request.responseType;
	    return type && type !== "text" ? request.response : request.responseText;
	  }
	  d3.dsv = function(delimiter, mimeType) {
	    var reFormat = new RegExp('["' + delimiter + "\n]"), delimiterCode = delimiter.charCodeAt(0);
	    function dsv(url, row, callback) {
	      if (arguments.length < 3) callback = row, row = null;
	      var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback);
	      xhr.row = function(_) {
	        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;
	      };
	      return xhr;
	    }
	    function response(request) {
	      return dsv.parse(request.responseText);
	    }
	    function typedResponse(f) {
	      return function(request) {
	        return dsv.parse(request.responseText, f);
	      };
	    }
	    dsv.parse = function(text, f) {
	      var o;
	      return dsv.parseRows(text, function(row, i) {
	        if (o) return o(row, i - 1);
	        var a = new Function("d", "return {" + row.map(function(name, i) {
	          return JSON.stringify(name) + ": d[" + i + "]";
	        }).join(",") + "}");
	        o = f ? function(row, i) {
	          return f(a(row), i);
	        } : a;
	      });
	    };
	    dsv.parseRows = function(text, f) {
	      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;
	      function token() {
	        if (I >= N) return EOF;
	        if (eol) return eol = false, EOL;
	        var j = I;
	        if (text.charCodeAt(j) === 34) {
	          var i = j;
	          while (i++ < N) {
	            if (text.charCodeAt(i) === 34) {
	              if (text.charCodeAt(i + 1) !== 34) break;
	              ++i;
	            }
	          }
	          I = i + 2;
	          var c = text.charCodeAt(i + 1);
	          if (c === 13) {
	            eol = true;
	            if (text.charCodeAt(i + 2) === 10) ++I;
	          } else if (c === 10) {
	            eol = true;
	          }
	          return text.slice(j + 1, i).replace(/""/g, '"');
	        }
	        while (I < N) {
	          var c = text.charCodeAt(I++), k = 1;
	          if (c === 10) eol = true; else if (c === 13) {
	            eol = true;
	            if (text.charCodeAt(I) === 10) ++I, ++k;
	          } else if (c !== delimiterCode) continue;
	          return text.slice(j, I - k);
	        }
	        return text.slice(j);
	      }
	      while ((t = token()) !== EOF) {
	        var a = [];
	        while (t !== EOL && t !== EOF) {
	          a.push(t);
	          t = token();
	        }
	        if (f && (a = f(a, n++)) == null) continue;
	        rows.push(a);
	      }
	      return rows;
	    };
	    dsv.format = function(rows) {
	      if (Array.isArray(rows[0])) return dsv.formatRows(rows);
	      var fieldSet = new d3_Set(), fields = [];
	      rows.forEach(function(row) {
	        for (var field in row) {
	          if (!fieldSet.has(field)) {
	            fields.push(fieldSet.add(field));
	          }
	        }
	      });
	      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {
	        return fields.map(function(field) {
	          return formatValue(row[field]);
	        }).join(delimiter);
	      })).join("\n");
	    };
	    dsv.formatRows = function(rows) {
	      return rows.map(formatRow).join("\n");
	    };
	    function formatRow(row) {
	      return row.map(formatValue).join(delimiter);
	    }
	    function formatValue(text) {
	      return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text;
	    }
	    return dsv;
	  };
	  d3.csv = d3.dsv(",", "text/csv");
	  d3.tsv = d3.dsv("	", "text/tab-separated-values");
	  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = this[d3_vendorSymbol(this, "requestAnimationFrame")] || function(callback) {
	    setTimeout(callback, 17);
	  };
	  d3.timer = function(callback, delay, then) {
	    var n = arguments.length;
	    if (n < 2) delay = 0;
	    if (n < 3) then = Date.now();
	    var time = then + delay, timer = {
	      c: callback,
	      t: time,
	      f: false,
	      n: null
	    };
	    if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;
	    d3_timer_queueTail = timer;
	    if (!d3_timer_interval) {
	      d3_timer_timeout = clearTimeout(d3_timer_timeout);
	      d3_timer_interval = 1;
	      d3_timer_frame(d3_timer_step);
	    }
	  };
	  function d3_timer_step() {
	    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
	    if (delay > 24) {
	      if (isFinite(delay)) {
	        clearTimeout(d3_timer_timeout);
	        d3_timer_timeout = setTimeout(d3_timer_step, delay);
	      }
	      d3_timer_interval = 0;
	    } else {
	      d3_timer_interval = 1;
	      d3_timer_frame(d3_timer_step);
	    }
	  }
	  d3.timer.flush = function() {
	    d3_timer_mark();
	    d3_timer_sweep();
	  };
	  function d3_timer_mark() {
	    var now = Date.now();
	    d3_timer_active = d3_timer_queueHead;
	    while (d3_timer_active) {
	      if (now >= d3_timer_active.t) d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t);
	      d3_timer_active = d3_timer_active.n;
	    }
	    return now;
	  }
	  function d3_timer_sweep() {
	    var t0, t1 = d3_timer_queueHead, time = Infinity;
	    while (t1) {
	      if (t1.f) {
	        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
	      } else {
	        if (t1.t < time) time = t1.t;
	        t1 = (t0 = t1).n;
	      }
	    }
	    d3_timer_queueTail = t0;
	    return time;
	  }
	  function d3_format_precision(x, p) {
	    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
	  }
	  d3.round = function(x, n) {
	    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
	  };
	  var d3_formatPrefixes = [ "y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y" ].map(d3_formatPrefix);
	  d3.formatPrefix = function(value, precision) {
	    var i = 0;
	    if (value) {
	      if (value < 0) value *= -1;
	      if (precision) value = d3.round(value, d3_format_precision(value, precision));
	      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
	      i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
	    }
	    return d3_formatPrefixes[8 + i / 3];
	  };
	  function d3_formatPrefix(d, i) {
	    var k = Math.pow(10, abs(8 - i) * 3);
	    return {
	      scale: i > 8 ? function(d) {
	        return d / k;
	      } : function(d) {
	        return d * k;
	      },
	      symbol: d
	    };
	  }
	  function d3_locale_numberFormat(locale) {
	    var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping && locale_thousands ? function(value, width) {
	      var i = value.length, t = [], j = 0, g = locale_grouping[0], length = 0;
	      while (i > 0 && g > 0) {
	        if (length + g + 1 > width) g = Math.max(1, width - length);
	        t.push(value.substring(i -= g, i + g));
	        if ((length += g + 1) > width) break;
	        g = locale_grouping[j = (j + 1) % locale_grouping.length];
	      }
	      return t.reverse().join(locale_thousands);
	    } : d3_identity;
	    return function(specifier) {
	      var match = d3_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "-", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = "", suffix = "", integer = false, exponent = true;
	      if (precision) precision = +precision.substring(1);
	      if (zfill || fill === "0" && align === "=") {
	        zfill = fill = "0";
	        align = "=";
	      }
	      switch (type) {
	       case "n":
	        comma = true;
	        type = "g";
	        break;
	
	       case "%":
	        scale = 100;
	        suffix = "%";
	        type = "f";
	        break;
	
	       case "p":
	        scale = 100;
	        suffix = "%";
	        type = "r";
	        break;
	
	       case "b":
	       case "o":
	       case "x":
	       case "X":
	        if (symbol === "#") prefix = "0" + type.toLowerCase();
	
	       case "c":
	        exponent = false;
	
	       case "d":
	        integer = true;
	        precision = 0;
	        break;
	
	       case "s":
	        scale = -1;
	        type = "r";
	        break;
	      }
	      if (symbol === "$") prefix = locale_currency[0], suffix = locale_currency[1];
	      if (type == "r" && !precision) type = "g";
	      if (precision != null) {
	        if (type == "g") precision = Math.max(1, Math.min(21, precision)); else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
	      }
	      type = d3_format_types.get(type) || d3_format_typeDefault;
	      var zcomma = zfill && comma;
	      return function(value) {
	        var fullSuffix = suffix;
	        if (integer && value % 1) return "";
	        var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign === "-" ? "" : sign;
	        if (scale < 0) {
	          var unit = d3.formatPrefix(value, precision);
	          value = unit.scale(value);
	          fullSuffix = unit.symbol + suffix;
	        } else {
	          value *= scale;
	        }
	        value = type(value, precision);
	        var i = value.lastIndexOf("."), before, after;
	        if (i < 0) {
	          var j = exponent ? value.lastIndexOf("e") : -1;
	          if (j < 0) before = value, after = ""; else before = value.substring(0, j), after = value.substring(j);
	        } else {
	          before = value.substring(0, i);
	          after = locale_decimal + value.substring(i + 1);
	        }
	        if (!zfill && comma) before = formatGroup(before, Infinity);
	        var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
	        if (zcomma) before = formatGroup(padding + before, padding.length ? width - after.length : Infinity);
	        negative += prefix;
	        value = before + after;
	        return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;
	      };
	    };
	  }
	  var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
	  var d3_format_types = d3.map({
	    b: function(x) {
	      return x.toString(2);
	    },
	    c: function(x) {
	      return String.fromCharCode(x);
	    },
	    o: function(x) {
	      return x.toString(8);
	    },
	    x: function(x) {
	      return x.toString(16);
	    },
	    X: function(x) {
	      return x.toString(16).toUpperCase();
	    },
	    g: function(x, p) {
	      return x.toPrecision(p);
	    },
	    e: function(x, p) {
	      return x.toExponential(p);
	    },
	    f: function(x, p) {
	      return x.toFixed(p);
	    },
	    r: function(x, p) {
	      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));
	    }
	  });
	  function d3_format_typeDefault(x) {
	    return x + "";
	  }
	  var d3_time = d3.time = {}, d3_date = Date;
	  function d3_date_utc() {
	    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
	  }
	  d3_date_utc.prototype = {
	    getDate: function() {
	      return this._.getUTCDate();
	    },
	    getDay: function() {
	      return this._.getUTCDay();
	    },
	    getFullYear: function() {
	      return this._.getUTCFullYear();
	    },
	    getHours: function() {
	      return this._.getUTCHours();
	    },
	    getMilliseconds: function() {
	      return this._.getUTCMilliseconds();
	    },
	    getMinutes: function() {
	      return this._.getUTCMinutes();
	    },
	    getMonth: function() {
	      return this._.getUTCMonth();
	    },
	    getSeconds: function() {
	      return this._.getUTCSeconds();
	    },
	    getTime: function() {
	      return this._.getTime();
	    },
	    getTimezoneOffset: function() {
	      return 0;
	    },
	    valueOf: function() {
	      return this._.valueOf();
	    },
	    setDate: function() {
	      d3_time_prototype.setUTCDate.apply(this._, arguments);
	    },
	    setDay: function() {
	      d3_time_prototype.setUTCDay.apply(this._, arguments);
	    },
	    setFullYear: function() {
	      d3_time_prototype.setUTCFullYear.apply(this._, arguments);
	    },
	    setHours: function() {
	      d3_time_prototype.setUTCHours.apply(this._, arguments);
	    },
	    setMilliseconds: function() {
	      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);
	    },
	    setMinutes: function() {
	      d3_time_prototype.setUTCMinutes.apply(this._, arguments);
	    },
	    setMonth: function() {
	      d3_time_prototype.setUTCMonth.apply(this._, arguments);
	    },
	    setSeconds: function() {
	      d3_time_prototype.setUTCSeconds.apply(this._, arguments);
	    },
	    setTime: function() {
	      d3_time_prototype.setTime.apply(this._, arguments);
	    }
	  };
	  var d3_time_prototype = Date.prototype;
	  function d3_time_interval(local, step, number) {
	    function round(date) {
	      var d0 = local(date), d1 = offset(d0, 1);
	      return date - d0 < d1 - date ? d0 : d1;
	    }
	    function ceil(date) {
	      step(date = local(new d3_date(date - 1)), 1);
	      return date;
	    }
	    function offset(date, k) {
	      step(date = new d3_date(+date), k);
	      return date;
	    }
	    function range(t0, t1, dt) {
	      var time = ceil(t0), times = [];
	      if (dt > 1) {
	        while (time < t1) {
	          if (!(number(time) % dt)) times.push(new Date(+time));
	          step(time, 1);
	        }
	      } else {
	        while (time < t1) times.push(new Date(+time)), step(time, 1);
	      }
	      return times;
	    }
	    function range_utc(t0, t1, dt) {
	      try {
	        d3_date = d3_date_utc;
	        var utc = new d3_date_utc();
	        utc._ = t0;
	        return range(utc, t1, dt);
	      } finally {
	        d3_date = Date;
	      }
	    }
	    local.floor = local;
	    local.round = round;
	    local.ceil = ceil;
	    local.offset = offset;
	    local.range = range;
	    var utc = local.utc = d3_time_interval_utc(local);
	    utc.floor = utc;
	    utc.round = d3_time_interval_utc(round);
	    utc.ceil = d3_time_interval_utc(ceil);
	    utc.offset = d3_time_interval_utc(offset);
	    utc.range = range_utc;
	    return local;
	  }
	  function d3_time_interval_utc(method) {
	    return function(date, k) {
	      try {
	        d3_date = d3_date_utc;
	        var utc = new d3_date_utc();
	        utc._ = date;
	        return method(utc, k)._;
	      } finally {
	        d3_date = Date;
	      }
	    };
	  }
	  d3_time.year = d3_time_interval(function(date) {
	    date = d3_time.day(date);
	    date.setMonth(0, 1);
	    return date;
	  }, function(date, offset) {
	    date.setFullYear(date.getFullYear() + offset);
	  }, function(date) {
	    return date.getFullYear();
	  });
	  d3_time.years = d3_time.year.range;
	  d3_time.years.utc = d3_time.year.utc.range;
	  d3_time.day = d3_time_interval(function(date) {
	    var day = new d3_date(2e3, 0);
	    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
	    return day;
	  }, function(date, offset) {
	    date.setDate(date.getDate() + offset);
	  }, function(date) {
	    return date.getDate() - 1;
	  });
	  d3_time.days = d3_time.day.range;
	  d3_time.days.utc = d3_time.day.utc.range;
	  d3_time.dayOfYear = function(date) {
	    var year = d3_time.year(date);
	    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
	  };
	  [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ].forEach(function(day, i) {
	    i = 7 - i;
	    var interval = d3_time[day] = d3_time_interval(function(date) {
	      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
	      return date;
	    }, function(date, offset) {
	      date.setDate(date.getDate() + Math.floor(offset) * 7);
	    }, function(date) {
	      var day = d3_time.year(date).getDay();
	      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
	    });
	    d3_time[day + "s"] = interval.range;
	    d3_time[day + "s"].utc = interval.utc.range;
	    d3_time[day + "OfYear"] = function(date) {
	      var day = d3_time.year(date).getDay();
	      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);
	    };
	  });
	  d3_time.week = d3_time.sunday;
	  d3_time.weeks = d3_time.sunday.range;
	  d3_time.weeks.utc = d3_time.sunday.utc.range;
	  d3_time.weekOfYear = d3_time.sundayOfYear;
	  function d3_locale_timeFormat(locale) {
	    var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;
	    function d3_time_format(template) {
	      var n = template.length;
	      function format(date) {
	        var string = [], i = -1, j = 0, c, p, f;
	        while (++i < n) {
	          if (template.charCodeAt(i) === 37) {
	            string.push(template.slice(j, i));
	            if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
	            if (f = d3_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
	            string.push(c);
	            j = i + 1;
	          }
	        }
	        string.push(template.slice(j, i));
	        return string.join("");
	      }
	      format.parse = function(string) {
	        var d = {
	          y: 1900,
	          m: 0,
	          d: 1,
	          H: 0,
	          M: 0,
	          S: 0,
	          L: 0,
	          Z: null
	        }, i = d3_time_parse(d, template, string, 0);
	        if (i != string.length) return null;
	        if ("p" in d) d.H = d.H % 12 + d.p * 12;
	        var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();
	        if ("j" in d) date.setFullYear(d.y, 0, d.j); else if ("w" in d && ("W" in d || "U" in d)) {
	          date.setFullYear(d.y, 0, 1);
	          date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
	        } else date.setFullYear(d.y, d.m, d.d);
	        date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L);
	        return localZ ? date._ : date;
	      };
	      format.toString = function() {
	        return template;
	      };
	      return format;
	    }
	    function d3_time_parse(date, template, string, j) {
	      var c, p, t, i = 0, n = template.length, m = string.length;
	      while (i < n) {
	        if (j >= m) return -1;
	        c = template.charCodeAt(i++);
	        if (c === 37) {
	          t = template.charAt(i++);
	          p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];
	          if (!p || (j = p(date, string, j)) < 0) return -1;
	        } else if (c != string.charCodeAt(j++)) {
	          return -1;
	        }
	      }
	      return j;
	    }
	    d3_time_format.utc = function(template) {
	      var local = d3_time_format(template);
	      function format(date) {
	        try {
	          d3_date = d3_date_utc;
	          var utc = new d3_date();
	          utc._ = date;
	          return local(utc);
	        } finally {
	          d3_date = Date;
	        }
	      }
	      format.parse = function(string) {
	        try {
	          d3_date = d3_date_utc;
	          var date = local.parse(string);
	          return date && date._;
	        } finally {
	          d3_date = Date;
	        }
	      };
	      format.toString = local.toString;
	      return format;
	    };
	    d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;
	    var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);
	    locale_periods.forEach(function(p, i) {
	      d3_time_periodLookup.set(p.toLowerCase(), i);
	    });
	    var d3_time_formats = {
	      a: function(d) {
	        return locale_shortDays[d.getDay()];
	      },
	      A: function(d) {
	        return locale_days[d.getDay()];
	      },
	      b: function(d) {
	        return locale_shortMonths[d.getMonth()];
	      },
	      B: function(d) {
	        return locale_months[d.getMonth()];
	      },
	      c: d3_time_format(locale_dateTime),
	      d: function(d, p) {
	        return d3_time_formatPad(d.getDate(), p, 2);
	      },
	      e: function(d, p) {
	        return d3_time_formatPad(d.getDate(), p, 2);
	      },
	      H: function(d, p) {
	        return d3_time_formatPad(d.getHours(), p, 2);
	      },
	      I: function(d, p) {
	        return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);
	      },
	      j: function(d, p) {
	        return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);
	      },
	      L: function(d, p) {
	        return d3_time_formatPad(d.getMilliseconds(), p, 3);
	      },
	      m: function(d, p) {
	        return d3_time_formatPad(d.getMonth() + 1, p, 2);
	      },
	      M: function(d, p) {
	        return d3_time_formatPad(d.getMinutes(), p, 2);
	      },
	      p: function(d) {
	        return locale_periods[+(d.getHours() >= 12)];
	      },
	      S: function(d, p) {
	        return d3_time_formatPad(d.getSeconds(), p, 2);
	      },
	      U: function(d, p) {
	        return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);
	      },
	      w: function(d) {
	        return d.getDay();
	      },
	      W: function(d, p) {
	        return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);
	      },
	      x: d3_time_format(locale_date),
	      X: d3_time_format(locale_time),
	      y: function(d, p) {
	        return d3_time_formatPad(d.getFullYear() % 100, p, 2);
	      },
	      Y: function(d, p) {
	        return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);
	      },
	      Z: d3_time_zone,
	      "%": function() {
	        return "%";
	      }
	    };
	    var d3_time_parsers = {
	      a: d3_time_parseWeekdayAbbrev,
	      A: d3_time_parseWeekday,
	      b: d3_time_parseMonthAbbrev,
	      B: d3_time_parseMonth,
	      c: d3_time_parseLocaleFull,
	      d: d3_time_parseDay,
	      e: d3_time_parseDay,
	      H: d3_time_parseHour24,
	      I: d3_time_parseHour24,
	      j: d3_time_parseDayOfYear,
	      L: d3_time_parseMilliseconds,
	      m: d3_time_parseMonthNumber,
	      M: d3_time_parseMinutes,
	      p: d3_time_parseAmPm,
	      S: d3_time_parseSeconds,
	      U: d3_time_parseWeekNumberSunday,
	      w: d3_time_parseWeekdayNumber,
	      W: d3_time_parseWeekNumberMonday,
	      x: d3_time_parseLocaleDate,
	      X: d3_time_parseLocaleTime,
	      y: d3_time_parseYear,
	      Y: d3_time_parseFullYear,
	      Z: d3_time_parseZone,
	      "%": d3_time_parseLiteralPercent
	    };
	    function d3_time_parseWeekdayAbbrev(date, string, i) {
	      d3_time_dayAbbrevRe.lastIndex = 0;
	      var n = d3_time_dayAbbrevRe.exec(string.slice(i));
	      return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseWeekday(date, string, i) {
	      d3_time_dayRe.lastIndex = 0;
	      var n = d3_time_dayRe.exec(string.slice(i));
	      return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseMonthAbbrev(date, string, i) {
	      d3_time_monthAbbrevRe.lastIndex = 0;
	      var n = d3_time_monthAbbrevRe.exec(string.slice(i));
	      return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseMonth(date, string, i) {
	      d3_time_monthRe.lastIndex = 0;
	      var n = d3_time_monthRe.exec(string.slice(i));
	      return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseLocaleFull(date, string, i) {
	      return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
	    }
	    function d3_time_parseLocaleDate(date, string, i) {
	      return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
	    }
	    function d3_time_parseLocaleTime(date, string, i) {
	      return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
	    }
	    function d3_time_parseAmPm(date, string, i) {
	      var n = d3_time_periodLookup.get(string.slice(i, i += 2).toLowerCase());
	      return n == null ? -1 : (date.p = n, i);
	    }
	    return d3_time_format;
	  }
	  var d3_time_formatPads = {
	    "-": "",
	    _: " ",
	    "0": "0"
	  }, d3_time_numberRe = /^\s*\d+/, d3_time_percentRe = /^%/;
	  function d3_time_formatPad(value, fill, width) {
	    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
	    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	  }
	  function d3_time_formatRe(names) {
	    return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
	  }
	  function d3_time_formatLookup(names) {
	    var map = new d3_Map(), i = -1, n = names.length;
	    while (++i < n) map.set(names[i].toLowerCase(), i);
	    return map;
	  }
	  function d3_time_parseWeekdayNumber(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 1));
	    return n ? (date.w = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseWeekNumberSunday(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i));
	    return n ? (date.U = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseWeekNumberMonday(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i));
	    return n ? (date.W = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseFullYear(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 4));
	    return n ? (date.y = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseYear(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;
	  }
	  function d3_time_parseZone(date, string, i) {
	    return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string, 
	    i + 5) : -1;
	  }
	  function d3_time_expandYear(d) {
	    return d + (d > 68 ? 1900 : 2e3);
	  }
	  function d3_time_parseMonthNumber(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
	  }
	  function d3_time_parseDay(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.d = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseDayOfYear(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
	    return n ? (date.j = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseHour24(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.H = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseMinutes(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.M = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseSeconds(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.S = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseMilliseconds(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
	    return n ? (date.L = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_zone(d) {
	    var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = abs(z) / 60 | 0, zm = abs(z) % 60;
	    return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
	  }
	  function d3_time_parseLiteralPercent(date, string, i) {
	    d3_time_percentRe.lastIndex = 0;
	    var n = d3_time_percentRe.exec(string.slice(i, i + 1));
	    return n ? i + n[0].length : -1;
	  }
	  function d3_time_formatMulti(formats) {
	    var n = formats.length, i = -1;
	    while (++i < n) formats[i][0] = this(formats[i][0]);
	    return function(date) {
	      var i = 0, f = formats[i];
	      while (!f[1](date)) f = formats[++i];
	      return f[0](date);
	    };
	  }
	  d3.locale = function(locale) {
	    return {
	      numberFormat: d3_locale_numberFormat(locale),
	      timeFormat: d3_locale_timeFormat(locale)
	    };
	  };
	  var d3_locale_enUS = d3.locale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [ 3 ],
	    currency: [ "$", "" ],
	    dateTime: "%a %b %e %X %Y",
	    date: "%m/%d/%Y",
	    time: "%H:%M:%S",
	    periods: [ "AM", "PM" ],
	    days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
	    shortDays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
	    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
	    shortMonths: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
	  });
	  d3.format = d3_locale_enUS.numberFormat;
	  d3.geo = {};
	  function d3_adder() {}
	  d3_adder.prototype = {
	    s: 0,
	    t: 0,
	    add: function(y) {
	      d3_adderSum(y, this.t, d3_adderTemp);
	      d3_adderSum(d3_adderTemp.s, this.s, this);
	      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;
	    },
	    reset: function() {
	      this.s = this.t = 0;
	    },
	    valueOf: function() {
	      return this.s;
	    }
	  };
	  var d3_adderTemp = new d3_adder();
	  function d3_adderSum(a, b, o) {
	    var x = o.s = a + b, bv = x - a, av = x - bv;
	    o.t = a - av + (b - bv);
	  }
	  d3.geo.stream = function(object, listener) {
	    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
	      d3_geo_streamObjectType[object.type](object, listener);
	    } else {
	      d3_geo_streamGeometry(object, listener);
	    }
	  };
	  function d3_geo_streamGeometry(geometry, listener) {
	    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
	      d3_geo_streamGeometryType[geometry.type](geometry, listener);
	    }
	  }
	  var d3_geo_streamObjectType = {
	    Feature: function(feature, listener) {
	      d3_geo_streamGeometry(feature.geometry, listener);
	    },
	    FeatureCollection: function(object, listener) {
	      var features = object.features, i = -1, n = features.length;
	      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);
	    }
	  };
	  var d3_geo_streamGeometryType = {
	    Sphere: function(object, listener) {
	      listener.sphere();
	    },
	    Point: function(object, listener) {
	      object = object.coordinates;
	      listener.point(object[0], object[1], object[2]);
	    },
	    MultiPoint: function(object, listener) {
	      var coordinates = object.coordinates, i = -1, n = coordinates.length;
	      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);
	    },
	    LineString: function(object, listener) {
	      d3_geo_streamLine(object.coordinates, listener, 0);
	    },
	    MultiLineString: function(object, listener) {
	      var coordinates = object.coordinates, i = -1, n = coordinates.length;
	      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);
	    },
	    Polygon: function(object, listener) {
	      d3_geo_streamPolygon(object.coordinates, listener);
	    },
	    MultiPolygon: function(object, listener) {
	      var coordinates = object.coordinates, i = -1, n = coordinates.length;
	      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);
	    },
	    GeometryCollection: function(object, listener) {
	      var geometries = object.geometries, i = -1, n = geometries.length;
	      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);
	    }
	  };
	  function d3_geo_streamLine(coordinates, listener, closed) {
	    var i = -1, n = coordinates.length - closed, coordinate;
	    listener.lineStart();
	    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);
	    listener.lineEnd();
	  }
	  function d3_geo_streamPolygon(coordinates, listener) {
	    var i = -1, n = coordinates.length;
	    listener.polygonStart();
	    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);
	    listener.polygonEnd();
	  }
	  d3.geo.area = function(object) {
	    d3_geo_areaSum = 0;
	    d3.geo.stream(object, d3_geo_area);
	    return d3_geo_areaSum;
	  };
	  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();
	  var d3_geo_area = {
	    sphere: function() {
	      d3_geo_areaSum += 4 * π;
	    },
	    point: d3_noop,
	    lineStart: d3_noop,
	    lineEnd: d3_noop,
	    polygonStart: function() {
	      d3_geo_areaRingSum.reset();
	      d3_geo_area.lineStart = d3_geo_areaRingStart;
	    },
	    polygonEnd: function() {
	      var area = 2 * d3_geo_areaRingSum;
	      d3_geo_areaSum += area < 0 ? 4 * π + area : area;
	      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;
	    }
	  };
	  function d3_geo_areaRingStart() {
	    var λ00, φ00, λ0, cosφ0, sinφ0;
	    d3_geo_area.point = function(λ, φ) {
	      d3_geo_area.point = nextPoint;
	      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), 
	      sinφ0 = Math.sin(φ);
	    };
	    function nextPoint(λ, φ) {
	      λ *= d3_radians;
	      φ = φ * d3_radians / 2 + π / 4;
	      var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ);
	      d3_geo_areaRingSum.add(Math.atan2(v, u));
	      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
	    }
	    d3_geo_area.lineEnd = function() {
	      nextPoint(λ00, φ00);
	    };
	  }
	  function d3_geo_cartesian(spherical) {
	    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);
	    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];
	  }
	  function d3_geo_cartesianDot(a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	  }
	  function d3_geo_cartesianCross(a, b) {
	    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
	  }
	  function d3_geo_cartesianAdd(a, b) {
	    a[0] += b[0];
	    a[1] += b[1];
	    a[2] += b[2];
	  }
	  function d3_geo_cartesianScale(vector, k) {
	    return [ vector[0] * k, vector[1] * k, vector[2] * k ];
	  }
	  function d3_geo_cartesianNormalize(d) {
	    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
	    d[0] /= l;
	    d[1] /= l;
	    d[2] /= l;
	  }
	  function d3_geo_spherical(cartesian) {
	    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];
	  }
	  function d3_geo_sphericalEqual(a, b) {
	    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;
	  }
	  d3.geo.bounds = function() {
	    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;
	    var bound = {
	      point: point,
	      lineStart: lineStart,
	      lineEnd: lineEnd,
	      polygonStart: function() {
	        bound.point = ringPoint;
	        bound.lineStart = ringStart;
	        bound.lineEnd = ringEnd;
	        dλSum = 0;
	        d3_geo_area.polygonStart();
	      },
	      polygonEnd: function() {
	        d3_geo_area.polygonEnd();
	        bound.point = point;
	        bound.lineStart = lineStart;
	        bound.lineEnd = lineEnd;
	        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;
	        range[0] = λ0, range[1] = λ1;
	      }
	    };
	    function point(λ, φ) {
	      ranges.push(range = [ λ0 = λ, λ1 = λ ]);
	      if (φ < φ0) φ0 = φ;
	      if (φ > φ1) φ1 = φ;
	    }
	    function linePoint(λ, φ) {
	      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);
	      if (p0) {
	        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);
	        d3_geo_cartesianNormalize(inflection);
	        inflection = d3_geo_spherical(inflection);
	        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;
	        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
	          var φi = inflection[1] * d3_degrees;
	          if (φi > φ1) φ1 = φi;
	        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
	          var φi = -inflection[1] * d3_degrees;
	          if (φi < φ0) φ0 = φi;
	        } else {
	          if (φ < φ0) φ0 = φ;
	          if (φ > φ1) φ1 = φ;
	        }
	        if (antimeridian) {
	          if (λ < λ_) {
	            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
	          } else {
	            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
	          }
	        } else {
	          if (λ1 >= λ0) {
	            if (λ < λ0) λ0 = λ;
	            if (λ > λ1) λ1 = λ;
	          } else {
	            if (λ > λ_) {
	              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
	            } else {
	              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
	            }
	          }
	        }
	      } else {
	        point(λ, φ);
	      }
	      p0 = p, λ_ = λ;
	    }
	    function lineStart() {
	      bound.point = linePoint;
	    }
	    function lineEnd() {
	      range[0] = λ0, range[1] = λ1;
	      bound.point = point;
	      p0 = null;
	    }
	    function ringPoint(λ, φ) {
	      if (p0) {
	        var dλ = λ - λ_;
	        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;
	      } else λ__ = λ, φ__ = φ;
	      d3_geo_area.point(λ, φ);
	      linePoint(λ, φ);
	    }
	    function ringStart() {
	      d3_geo_area.lineStart();
	    }
	    function ringEnd() {
	      ringPoint(λ__, φ__);
	      d3_geo_area.lineEnd();
	      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);
	      range[0] = λ0, range[1] = λ1;
	      p0 = null;
	    }
	    function angle(λ0, λ1) {
	      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;
	    }
	    function compareRanges(a, b) {
	      return a[0] - b[0];
	    }
	    function withinRange(x, range) {
	      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
	    }
	    return function(feature) {
	      φ1 = λ1 = -(λ0 = φ0 = Infinity);
	      ranges = [];
	      d3.geo.stream(feature, bound);
	      var n = ranges.length;
	      if (n) {
	        ranges.sort(compareRanges);
	        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {
	          b = ranges[i];
	          if (withinRange(b[0], a) || withinRange(b[1], a)) {
	            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
	            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
	          } else {
	            merged.push(a = b);
	          }
	        }
	        var best = -Infinity, dλ;
	        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {
	          b = merged[i];
	          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];
	        }
	      }
	      ranges = range = null;
	      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];
	    };
	  }();
	  d3.geo.centroid = function(object) {
	    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
	    d3.geo.stream(object, d3_geo_centroid);
	    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;
	    if (m < ε2) {
	      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;
	      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;
	      m = x * x + y * y + z * z;
	      if (m < ε2) return [ NaN, NaN ];
	    }
	    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];
	  };
	  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;
	  var d3_geo_centroid = {
	    sphere: d3_noop,
	    point: d3_geo_centroidPoint,
	    lineStart: d3_geo_centroidLineStart,
	    lineEnd: d3_geo_centroidLineEnd,
	    polygonStart: function() {
	      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;
	    },
	    polygonEnd: function() {
	      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;
	    }
	  };
	  function d3_geo_centroidPoint(λ, φ) {
	    λ *= d3_radians;
	    var cosφ = Math.cos(φ *= d3_radians);
	    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));
	  }
	  function d3_geo_centroidPointXYZ(x, y, z) {
	    ++d3_geo_centroidW0;
	    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;
	    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;
	    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;
	  }
	  function d3_geo_centroidLineStart() {
	    var x0, y0, z0;
	    d3_geo_centroid.point = function(λ, φ) {
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians);
	      x0 = cosφ * Math.cos(λ);
	      y0 = cosφ * Math.sin(λ);
	      z0 = Math.sin(φ);
	      d3_geo_centroid.point = nextPoint;
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    };
	    function nextPoint(λ, φ) {
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
	      d3_geo_centroidW1 += w;
	      d3_geo_centroidX1 += w * (x0 + (x0 = x));
	      d3_geo_centroidY1 += w * (y0 + (y0 = y));
	      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    }
	  }
	  function d3_geo_centroidLineEnd() {
	    d3_geo_centroid.point = d3_geo_centroidPoint;
	  }
	  function d3_geo_centroidRingStart() {
	    var λ00, φ00, x0, y0, z0;
	    d3_geo_centroid.point = function(λ, φ) {
	      λ00 = λ, φ00 = φ;
	      d3_geo_centroid.point = nextPoint;
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians);
	      x0 = cosφ * Math.cos(λ);
	      y0 = cosφ * Math.sin(λ);
	      z0 = Math.sin(φ);
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    };
	    d3_geo_centroid.lineEnd = function() {
	      nextPoint(λ00, φ00);
	      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;
	      d3_geo_centroid.point = d3_geo_centroidPoint;
	    };
	    function nextPoint(λ, φ) {
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);
	      d3_geo_centroidX2 += v * cx;
	      d3_geo_centroidY2 += v * cy;
	      d3_geo_centroidZ2 += v * cz;
	      d3_geo_centroidW1 += w;
	      d3_geo_centroidX1 += w * (x0 + (x0 = x));
	      d3_geo_centroidY1 += w * (y0 + (y0 = y));
	      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    }
	  }
	  function d3_geo_compose(a, b) {
	    function compose(x, y) {
	      return x = a(x, y), b(x[0], x[1]);
	    }
	    if (a.invert && b.invert) compose.invert = function(x, y) {
	      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
	    };
	    return compose;
	  }
	  function d3_true() {
	    return true;
	  }
	  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {
	    var subject = [], clip = [];
	    segments.forEach(function(segment) {
	      if ((n = segment.length - 1) <= 0) return;
	      var n, p0 = segment[0], p1 = segment[n];
	      if (d3_geo_sphericalEqual(p0, p1)) {
	        listener.lineStart();
	        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);
	        listener.lineEnd();
	        return;
	      }
	      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false);
	      a.o = b;
	      subject.push(a);
	      clip.push(b);
	      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);
	      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);
	      a.o = b;
	      subject.push(a);
	      clip.push(b);
	    });
	    clip.sort(compare);
	    d3_geo_clipPolygonLinkCircular(subject);
	    d3_geo_clipPolygonLinkCircular(clip);
	    if (!subject.length) return;
	    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {
	      clip[i].e = entry = !entry;
	    }
	    var start = subject[0], points, point;
	    while (1) {
	      var current = start, isSubject = true;
	      while (current.v) if ((current = current.n) === start) return;
	      points = current.z;
	      listener.lineStart();
	      do {
	        current.v = current.o.v = true;
	        if (current.e) {
	          if (isSubject) {
	            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);
	          } else {
	            interpolate(current.x, current.n.x, 1, listener);
	          }
	          current = current.n;
	        } else {
	          if (isSubject) {
	            points = current.p.z;
	            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);
	          } else {
	            interpolate(current.x, current.p.x, -1, listener);
	          }
	          current = current.p;
	        }
	        current = current.o;
	        points = current.z;
	        isSubject = !isSubject;
	      } while (!current.v);
	      listener.lineEnd();
	    }
	  }
	  function d3_geo_clipPolygonLinkCircular(array) {
	    if (!(n = array.length)) return;
	    var n, i = 0, a = array[0], b;
	    while (++i < n) {
	      a.n = b = array[i];
	      b.p = a;
	      a = b;
	    }
	    a.n = b = array[0];
	    b.p = a;
	  }
	  function d3_geo_clipPolygonIntersection(point, points, other, entry) {
	    this.x = point;
	    this.z = points;
	    this.o = other;
	    this.e = entry;
	    this.v = false;
	    this.n = this.p = null;
	  }
	  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {
	    return function(rotate, listener) {
	      var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);
	      var clip = {
	        point: point,
	        lineStart: lineStart,
	        lineEnd: lineEnd,
	        polygonStart: function() {
	          clip.point = pointRing;
	          clip.lineStart = ringStart;
	          clip.lineEnd = ringEnd;
	          segments = [];
	          polygon = [];
	        },
	        polygonEnd: function() {
	          clip.point = point;
	          clip.lineStart = lineStart;
	          clip.lineEnd = lineEnd;
	          segments = d3.merge(segments);
	          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);
	          if (segments.length) {
	            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
	            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);
	          } else if (clipStartInside) {
	            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
	            listener.lineStart();
	            interpolate(null, null, 1, listener);
	            listener.lineEnd();
	          }
	          if (polygonStarted) listener.polygonEnd(), polygonStarted = false;
	          segments = polygon = null;
	        },
	        sphere: function() {
	          listener.polygonStart();
	          listener.lineStart();
	          interpolate(null, null, 1, listener);
	          listener.lineEnd();
	          listener.polygonEnd();
	        }
	      };
	      function point(λ, φ) {
	        var point = rotate(λ, φ);
	        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);
	      }
	      function pointLine(λ, φ) {
	        var point = rotate(λ, φ);
	        line.point(point[0], point[1]);
	      }
	      function lineStart() {
	        clip.point = pointLine;
	        line.lineStart();
	      }
	      function lineEnd() {
	        clip.point = point;
	        line.lineEnd();
	      }
	      var segments;
	      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygonStarted = false, polygon, ring;
	      function pointRing(λ, φ) {
	        ring.push([ λ, φ ]);
	        var point = rotate(λ, φ);
	        ringListener.point(point[0], point[1]);
	      }
	      function ringStart() {
	        ringListener.lineStart();
	        ring = [];
	      }
	      function ringEnd() {
	        pointRing(ring[0][0], ring[0][1]);
	        ringListener.lineEnd();
	        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;
	        ring.pop();
	        polygon.push(ring);
	        ring = null;
	        if (!n) return;
	        if (clean & 1) {
	          segment = ringSegments[0];
	          var n = segment.length - 1, i = -1, point;
	          if (n > 0) {
	            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
	            listener.lineStart();
	            while (++i < n) listener.point((point = segment[i])[0], point[1]);
	            listener.lineEnd();
	          }
	          return;
	        }
	        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
	        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));
	      }
	      return clip;
	    };
	  }
	  function d3_geo_clipSegmentLength1(segment) {
	    return segment.length > 1;
	  }
	  function d3_geo_clipBufferListener() {
	    var lines = [], line;
	    return {
	      lineStart: function() {
	        lines.push(line = []);
	      },
	      point: function(λ, φ) {
	        line.push([ λ, φ ]);
	      },
	      lineEnd: d3_noop,
	      buffer: function() {
	        var buffer = lines;
	        lines = [];
	        line = null;
	        return buffer;
	      },
	      rejoin: function() {
	        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
	      }
	    };
	  }
	  function d3_geo_clipSort(a, b) {
	    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);
	  }
	  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ]);
	  function d3_geo_clipAntimeridianLine(listener) {
	    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;
	    return {
	      lineStart: function() {
	        listener.lineStart();
	        clean = 1;
	      },
	      point: function(λ1, φ1) {
	        var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);
	        if (abs(dλ - π) < ε) {
	          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);
	          listener.point(sλ0, φ0);
	          listener.lineEnd();
	          listener.lineStart();
	          listener.point(sλ1, φ0);
	          listener.point(λ1, φ0);
	          clean = 0;
	        } else if (sλ0 !== sλ1 && dλ >= π) {
	          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;
	          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;
	          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);
	          listener.point(sλ0, φ0);
	          listener.lineEnd();
	          listener.lineStart();
	          listener.point(sλ1, φ0);
	          clean = 0;
	        }
	        listener.point(λ0 = λ1, φ0 = φ1);
	        sλ0 = sλ1;
	      },
	      lineEnd: function() {
	        listener.lineEnd();
	        λ0 = φ0 = NaN;
	      },
	      clean: function() {
	        return 2 - clean;
	      }
	    };
	  }
	  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {
	    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);
	    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;
	  }
	  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {
	    var φ;
	    if (from == null) {
	      φ = direction * halfπ;
	      listener.point(-π, φ);
	      listener.point(0, φ);
	      listener.point(π, φ);
	      listener.point(π, 0);
	      listener.point(π, -φ);
	      listener.point(0, -φ);
	      listener.point(-π, -φ);
	      listener.point(-π, 0);
	      listener.point(-π, φ);
	    } else if (abs(from[0] - to[0]) > ε) {
	      var s = from[0] < to[0] ? π : -π;
	      φ = direction * s / 2;
	      listener.point(-s, φ);
	      listener.point(0, φ);
	      listener.point(s, φ);
	    } else {
	      listener.point(to[0], to[1]);
	    }
	  }
	  function d3_geo_pointInPolygon(point, polygon) {
	    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0;
	    d3_geo_areaRingSum.reset();
	    for (var i = 0, n = polygon.length; i < n; ++i) {
	      var ring = polygon[i], m = ring.length;
	      if (!m) continue;
	      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;
	      while (true) {
	        if (j === m) j = 0;
	        point = ring[j];
	        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, antimeridian = adλ > π, k = sinφ0 * sinφ;
	        d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ)));
	        polarAngle += antimeridian ? dλ + sdλ * τ : dλ;
	        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
	          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
	          d3_geo_cartesianNormalize(arc);
	          var intersection = d3_geo_cartesianCross(meridianNormal, arc);
	          d3_geo_cartesianNormalize(intersection);
	          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);
	          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {
	            winding += antimeridian ^ dλ >= 0 ? 1 : -1;
	          }
	        }
	        if (!j++) break;
	        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;
	      }
	    }
	    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < 0) ^ winding & 1;
	  }
	  function d3_geo_clipCircle(radius) {
	    var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);
	    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ]);
	    function visible(λ, φ) {
	      return Math.cos(λ) * Math.cos(φ) > cr;
	    }
	    function clipLine(listener) {
	      var point0, c0, v0, v00, clean;
	      return {
	        lineStart: function() {
	          v00 = v0 = false;
	          clean = 1;
	        },
	        point: function(λ, φ) {
	          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;
	          if (!point0 && (v00 = v0 = v)) listener.lineStart();
	          if (v !== v0) {
	            point2 = intersect(point0, point1);
	            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {
	              point1[0] += ε;
	              point1[1] += ε;
	              v = visible(point1[0], point1[1]);
	            }
	          }
	          if (v !== v0) {
	            clean = 0;
	            if (v) {
	              listener.lineStart();
	              point2 = intersect(point1, point0);
	              listener.point(point2[0], point2[1]);
	            } else {
	              point2 = intersect(point0, point1);
	              listener.point(point2[0], point2[1]);
	              listener.lineEnd();
	            }
	            point0 = point2;
	          } else if (notHemisphere && point0 && smallRadius ^ v) {
	            var t;
	            if (!(c & c0) && (t = intersect(point1, point0, true))) {
	              clean = 0;
	              if (smallRadius) {
	                listener.lineStart();
	                listener.point(t[0][0], t[0][1]);
	                listener.point(t[1][0], t[1][1]);
	                listener.lineEnd();
	              } else {
	                listener.point(t[1][0], t[1][1]);
	                listener.lineEnd();
	                listener.lineStart();
	                listener.point(t[0][0], t[0][1]);
	              }
	            }
	          }
	          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {
	            listener.point(point1[0], point1[1]);
	          }
	          point0 = point1, v0 = v, c0 = c;
	        },
	        lineEnd: function() {
	          if (v0) listener.lineEnd();
	          point0 = null;
	        },
	        clean: function() {
	          return clean | (v00 && v0) << 1;
	        }
	      };
	    }
	    function intersect(a, b, two) {
	      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);
	      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
	      if (!determinant) return !two && a;
	      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);
	      d3_geo_cartesianAdd(A, B);
	      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);
	      if (t2 < 0) return;
	      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);
	      d3_geo_cartesianAdd(q, A);
	      q = d3_geo_spherical(q);
	      if (!two) return q;
	      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;
	      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;
	      var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε;
	      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;
	      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
	        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);
	        d3_geo_cartesianAdd(q1, A);
	        return [ q, d3_geo_spherical(q1) ];
	      }
	    }
	    function code(λ, φ) {
	      var r = smallRadius ? radius : π - radius, code = 0;
	      if (λ < -r) code |= 1; else if (λ > r) code |= 2;
	      if (φ < -r) code |= 4; else if (φ > r) code |= 8;
	      return code;
	    }
	  }
	  function d3_geom_clipLine(x0, y0, x1, y1) {
	    return function(line) {
	      var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r;
	      r = x0 - ax;
	      if (!dx && r > 0) return;
	      r /= dx;
	      if (dx < 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      } else if (dx > 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      }
	      r = x1 - ax;
	      if (!dx && r < 0) return;
	      r /= dx;
	      if (dx < 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      } else if (dx > 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      }
	      r = y0 - ay;
	      if (!dy && r > 0) return;
	      r /= dy;
	      if (dy < 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      } else if (dy > 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      }
	      r = y1 - ay;
	      if (!dy && r < 0) return;
	      r /= dy;
	      if (dy < 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      } else if (dy > 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      }
	      if (t0 > 0) line.a = {
	        x: ax + t0 * dx,
	        y: ay + t0 * dy
	      };
	      if (t1 < 1) line.b = {
	        x: ax + t1 * dx,
	        y: ay + t1 * dy
	      };
	      return line;
	    };
	  }
	  var d3_geo_clipExtentMAX = 1e9;
	  d3.geo.clipExtent = function() {
	    var x0, y0, x1, y1, stream, clip, clipExtent = {
	      stream: function(output) {
	        if (stream) stream.valid = false;
	        stream = clip(output);
	        stream.valid = true;
	        return stream;
	      },
	      extent: function(_) {
	        if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
	        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);
	        if (stream) stream.valid = false, stream = null;
	        return clipExtent;
	      }
	    };
	    return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ]);
	  };
	  function d3_geo_clipExtent(x0, y0, x1, y1) {
	    return function(listener) {
	      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring;
	      var clip = {
	        point: point,
	        lineStart: lineStart,
	        lineEnd: lineEnd,
	        polygonStart: function() {
	          listener = bufferListener;
	          segments = [];
	          polygon = [];
	          clean = true;
	        },
	        polygonEnd: function() {
	          listener = listener_;
	          segments = d3.merge(segments);
	          var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length;
	          if (inside || visible) {
	            listener.polygonStart();
	            if (inside) {
	              listener.lineStart();
	              interpolate(null, null, 1, listener);
	              listener.lineEnd();
	            }
	            if (visible) {
	              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);
	            }
	            listener.polygonEnd();
	          }
	          segments = polygon = ring = null;
	        }
	      };
	      function insidePolygon(p) {
	        var wn = 0, n = polygon.length, y = p[1];
	        for (var i = 0; i < n; ++i) {
	          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {
	            b = v[j];
	            if (a[1] <= y) {
	              if (b[1] > y && d3_cross2d(a, b, p) > 0) ++wn;
	            } else {
	              if (b[1] <= y && d3_cross2d(a, b, p) < 0) --wn;
	            }
	            a = b;
	          }
	        }
	        return wn !== 0;
	      }
	      function interpolate(from, to, direction, listener) {
	        var a = 0, a1 = 0;
	        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
	          do {
	            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
	          } while ((a = (a + direction + 4) % 4) !== a1);
	        } else {
	          listener.point(to[0], to[1]);
	        }
	      }
	      function pointVisible(x, y) {
	        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
	      }
	      function point(x, y) {
	        if (pointVisible(x, y)) listener.point(x, y);
	      }
	      var x__, y__, v__, x_, y_, v_, first, clean;
	      function lineStart() {
	        clip.point = linePoint;
	        if (polygon) polygon.push(ring = []);
	        first = true;
	        v_ = false;
	        x_ = y_ = NaN;
	      }
	      function lineEnd() {
	        if (segments) {
	          linePoint(x__, y__);
	          if (v__ && v_) bufferListener.rejoin();
	          segments.push(bufferListener.buffer());
	        }
	        clip.point = point;
	        if (v_) listener.lineEnd();
	      }
	      function linePoint(x, y) {
	        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));
	        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));
	        var v = pointVisible(x, y);
	        if (polygon) ring.push([ x, y ]);
	        if (first) {
	          x__ = x, y__ = y, v__ = v;
	          first = false;
	          if (v) {
	            listener.lineStart();
	            listener.point(x, y);
	          }
	        } else {
	          if (v && v_) listener.point(x, y); else {
	            var l = {
	              a: {
	                x: x_,
	                y: y_
	              },
	              b: {
	                x: x,
	                y: y
	              }
	            };
	            if (clipLine(l)) {
	              if (!v_) {
	                listener.lineStart();
	                listener.point(l.a.x, l.a.y);
	              }
	              listener.point(l.b.x, l.b.y);
	              if (!v) listener.lineEnd();
	              clean = false;
	            } else if (v) {
	              listener.lineStart();
	              listener.point(x, y);
	              clean = false;
	            }
	          }
	        }
	        x_ = x, y_ = y, v_ = v;
	      }
	      return clip;
	    };
	    function corner(p, direction) {
	      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;
	    }
	    function compare(a, b) {
	      return comparePoints(a.x, b.x);
	    }
	    function comparePoints(a, b) {
	      var ca = corner(a, 1), cb = corner(b, 1);
	      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
	    }
	  }
	  function d3_geo_conic(projectAt) {
	    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);
	    p.parallels = function(_) {
	      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];
	      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
	    };
	    return p;
	  }
	  function d3_geo_conicEqualArea(φ0, φ1) {
	    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;
	    function forward(λ, φ) {
	      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
	      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];
	    }
	    forward.invert = function(x, y) {
	      var ρ0_y = ρ0 - y;
	      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];
	    };
	    return forward;
	  }
	  (d3.geo.conicEqualArea = function() {
	    return d3_geo_conic(d3_geo_conicEqualArea);
	  }).raw = d3_geo_conicEqualArea;
	  d3.geo.albers = function() {
	    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);
	  };
	  d3.geo.albersUsa = function() {
	    var lower48 = d3.geo.albers();
	    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);
	    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);
	    var point, pointStream = {
	      point: function(x, y) {
	        point = [ x, y ];
	      }
	    }, lower48Point, alaskaPoint, hawaiiPoint;
	    function albersUsa(coordinates) {
	      var x = coordinates[0], y = coordinates[1];
	      point = null;
	      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
	      return point;
	    }
	    albersUsa.invert = function(coordinates) {
	      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
	      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);
	    };
	    albersUsa.stream = function(stream) {
	      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);
	      return {
	        point: function(x, y) {
	          lower48Stream.point(x, y);
	          alaskaStream.point(x, y);
	          hawaiiStream.point(x, y);
	        },
	        sphere: function() {
	          lower48Stream.sphere();
	          alaskaStream.sphere();
	          hawaiiStream.sphere();
	        },
	        lineStart: function() {
	          lower48Stream.lineStart();
	          alaskaStream.lineStart();
	          hawaiiStream.lineStart();
	        },
	        lineEnd: function() {
	          lower48Stream.lineEnd();
	          alaskaStream.lineEnd();
	          hawaiiStream.lineEnd();
	        },
	        polygonStart: function() {
	          lower48Stream.polygonStart();
	          alaskaStream.polygonStart();
	          hawaiiStream.polygonStart();
	        },
	        polygonEnd: function() {
	          lower48Stream.polygonEnd();
	          alaskaStream.polygonEnd();
	          hawaiiStream.polygonEnd();
	        }
	      };
	    };
	    albersUsa.precision = function(_) {
	      if (!arguments.length) return lower48.precision();
	      lower48.precision(_);
	      alaska.precision(_);
	      hawaii.precision(_);
	      return albersUsa;
	    };
	    albersUsa.scale = function(_) {
	      if (!arguments.length) return lower48.scale();
	      lower48.scale(_);
	      alaska.scale(_ * .35);
	      hawaii.scale(_);
	      return albersUsa.translate(lower48.translate());
	    };
	    albersUsa.translate = function(_) {
	      if (!arguments.length) return lower48.translate();
	      var k = lower48.scale(), x = +_[0], y = +_[1];
	      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;
	      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
	      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
	      return albersUsa;
	    };
	    return albersUsa.scale(1070);
	  };
	  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {
	    point: d3_noop,
	    lineStart: d3_noop,
	    lineEnd: d3_noop,
	    polygonStart: function() {
	      d3_geo_pathAreaPolygon = 0;
	      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;
	    },
	    polygonEnd: function() {
	      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;
	      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);
	    }
	  };
	  function d3_geo_pathAreaRingStart() {
	    var x00, y00, x0, y0;
	    d3_geo_pathArea.point = function(x, y) {
	      d3_geo_pathArea.point = nextPoint;
	      x00 = x0 = x, y00 = y0 = y;
	    };
	    function nextPoint(x, y) {
	      d3_geo_pathAreaPolygon += y0 * x - x0 * y;
	      x0 = x, y0 = y;
	    }
	    d3_geo_pathArea.lineEnd = function() {
	      nextPoint(x00, y00);
	    };
	  }
	  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;
	  var d3_geo_pathBounds = {
	    point: d3_geo_pathBoundsPoint,
	    lineStart: d3_noop,
	    lineEnd: d3_noop,
	    polygonStart: d3_noop,
	    polygonEnd: d3_noop
	  };
	  function d3_geo_pathBoundsPoint(x, y) {
	    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;
	    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;
	    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;
	    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;
	  }
	  function d3_geo_pathBuffer() {
	    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];
	    var stream = {
	      point: point,
	      lineStart: function() {
	        stream.point = pointLineStart;
	      },
	      lineEnd: lineEnd,
	      polygonStart: function() {
	        stream.lineEnd = lineEndPolygon;
	      },
	      polygonEnd: function() {
	        stream.lineEnd = lineEnd;
	        stream.point = point;
	      },
	      pointRadius: function(_) {
	        pointCircle = d3_geo_pathBufferCircle(_);
	        return stream;
	      },
	      result: function() {
	        if (buffer.length) {
	          var result = buffer.join("");
	          buffer = [];
	          return result;
	        }
	      }
	    };
	    function point(x, y) {
	      buffer.push("M", x, ",", y, pointCircle);
	    }
	    function pointLineStart(x, y) {
	      buffer.push("M", x, ",", y);
	      stream.point = pointLine;
	    }
	    function pointLine(x, y) {
	      buffer.push("L", x, ",", y);
	    }
	    function lineEnd() {
	      stream.point = point;
	    }
	    function lineEndPolygon() {
	      buffer.push("Z");
	    }
	    return stream;
	  }
	  function d3_geo_pathBufferCircle(radius) {
	    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
	  }
	  var d3_geo_pathCentroid = {
	    point: d3_geo_pathCentroidPoint,
	    lineStart: d3_geo_pathCentroidLineStart,
	    lineEnd: d3_geo_pathCentroidLineEnd,
	    polygonStart: function() {
	      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;
	    },
	    polygonEnd: function() {
	      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
	      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;
	      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;
	    }
	  };
	  function d3_geo_pathCentroidPoint(x, y) {
	    d3_geo_centroidX0 += x;
	    d3_geo_centroidY0 += y;
	    ++d3_geo_centroidZ0;
	  }
	  function d3_geo_pathCentroidLineStart() {
	    var x0, y0;
	    d3_geo_pathCentroid.point = function(x, y) {
	      d3_geo_pathCentroid.point = nextPoint;
	      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
	    };
	    function nextPoint(x, y) {
	      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
	      d3_geo_centroidX1 += z * (x0 + x) / 2;
	      d3_geo_centroidY1 += z * (y0 + y) / 2;
	      d3_geo_centroidZ1 += z;
	      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
	    }
	  }
	  function d3_geo_pathCentroidLineEnd() {
	    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
	  }
	  function d3_geo_pathCentroidRingStart() {
	    var x00, y00, x0, y0;
	    d3_geo_pathCentroid.point = function(x, y) {
	      d3_geo_pathCentroid.point = nextPoint;
	      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);
	    };
	    function nextPoint(x, y) {
	      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
	      d3_geo_centroidX1 += z * (x0 + x) / 2;
	      d3_geo_centroidY1 += z * (y0 + y) / 2;
	      d3_geo_centroidZ1 += z;
	      z = y0 * x - x0 * y;
	      d3_geo_centroidX2 += z * (x0 + x);
	      d3_geo_centroidY2 += z * (y0 + y);
	      d3_geo_centroidZ2 += z * 3;
	      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
	    }
	    d3_geo_pathCentroid.lineEnd = function() {
	      nextPoint(x00, y00);
	    };
	  }
	  function d3_geo_pathContext(context) {
	    var pointRadius = 4.5;
	    var stream = {
	      point: point,
	      lineStart: function() {
	        stream.point = pointLineStart;
	      },
	      lineEnd: lineEnd,
	      polygonStart: function() {
	        stream.lineEnd = lineEndPolygon;
	      },
	      polygonEnd: function() {
	        stream.lineEnd = lineEnd;
	        stream.point = point;
	      },
	      pointRadius: function(_) {
	        pointRadius = _;
	        return stream;
	      },
	      result: d3_noop
	    };
	    function point(x, y) {
	      context.moveTo(x + pointRadius, y);
	      context.arc(x, y, pointRadius, 0, τ);
	    }
	    function pointLineStart(x, y) {
	      context.moveTo(x, y);
	      stream.point = pointLine;
	    }
	    function pointLine(x, y) {
	      context.lineTo(x, y);
	    }
	    function lineEnd() {
	      stream.point = point;
	    }
	    function lineEndPolygon() {
	      context.closePath();
	    }
	    return stream;
	  }
	  function d3_geo_resample(project) {
	    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;
	    function resample(stream) {
	      return (maxDepth ? resampleRecursive : resampleNone)(stream);
	    }
	    function resampleNone(stream) {
	      return d3_geo_transformPoint(stream, function(x, y) {
	        x = project(x, y);
	        stream.point(x[0], x[1]);
	      });
	    }
	    function resampleRecursive(stream) {
	      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;
	      var resample = {
	        point: point,
	        lineStart: lineStart,
	        lineEnd: lineEnd,
	        polygonStart: function() {
	          stream.polygonStart();
	          resample.lineStart = ringStart;
	        },
	        polygonEnd: function() {
	          stream.polygonEnd();
	          resample.lineStart = lineStart;
	        }
	      };
	      function point(x, y) {
	        x = project(x, y);
	        stream.point(x[0], x[1]);
	      }
	      function lineStart() {
	        x0 = NaN;
	        resample.point = linePoint;
	        stream.lineStart();
	      }
	      function linePoint(λ, φ) {
	        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);
	        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
	        stream.point(x0, y0);
	      }
	      function lineEnd() {
	        resample.point = point;
	        stream.lineEnd();
	      }
	      function ringStart() {
	        lineStart();
	        resample.point = ringPoint;
	        resample.lineEnd = ringEnd;
	      }
	      function ringPoint(λ, φ) {
	        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
	        resample.point = linePoint;
	      }
	      function ringEnd() {
	        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);
	        resample.lineEnd = lineEnd;
	        lineEnd();
	      }
	      return resample;
	    }
	    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
	      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
	      if (d2 > 4 * δ2 && depth--) {
	        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;
	        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
	          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);
	          stream.point(x2, y2);
	          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);
	        }
	      }
	    }
	    resample.precision = function(_) {
	      if (!arguments.length) return Math.sqrt(δ2);
	      maxDepth = (δ2 = _ * _) > 0 && 16;
	      return resample;
	    };
	    return resample;
	  }
	  d3.geo.path = function() {
	    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;
	    function path(object) {
	      if (object) {
	        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
	        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);
	        d3.geo.stream(object, cacheStream);
	      }
	      return contextStream.result();
	    }
	    path.area = function(object) {
	      d3_geo_pathAreaSum = 0;
	      d3.geo.stream(object, projectStream(d3_geo_pathArea));
	      return d3_geo_pathAreaSum;
	    };
	    path.centroid = function(object) {
	      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
	      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));
	      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];
	    };
	    path.bounds = function(object) {
	      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);
	      d3.geo.stream(object, projectStream(d3_geo_pathBounds));
	      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];
	    };
	    path.projection = function(_) {
	      if (!arguments.length) return projection;
	      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;
	      return reset();
	    };
	    path.context = function(_) {
	      if (!arguments.length) return context;
	      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);
	      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
	      return reset();
	    };
	    path.pointRadius = function(_) {
	      if (!arguments.length) return pointRadius;
	      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
	      return path;
	    };
	    function reset() {
	      cacheStream = null;
	      return path;
	    }
	    return path.projection(d3.geo.albersUsa()).context(null);
	  };
	  function d3_geo_pathProjectStream(project) {
	    var resample = d3_geo_resample(function(x, y) {
	      return project([ x * d3_degrees, y * d3_degrees ]);
	    });
	    return function(stream) {
	      return d3_geo_projectionRadians(resample(stream));
	    };
	  }
	  d3.geo.transform = function(methods) {
	    return {
	      stream: function(stream) {
	        var transform = new d3_geo_transform(stream);
	        for (var k in methods) transform[k] = methods[k];
	        return transform;
	      }
	    };
	  };
	  function d3_geo_transform(stream) {
	    this.stream = stream;
	  }
	  d3_geo_transform.prototype = {
	    point: function(x, y) {
	      this.stream.point(x, y);
	    },
	    sphere: function() {
	      this.stream.sphere();
	    },
	    lineStart: function() {
	      this.stream.lineStart();
	    },
	    lineEnd: function() {
	      this.stream.lineEnd();
	    },
	    polygonStart: function() {
	      this.stream.polygonStart();
	    },
	    polygonEnd: function() {
	      this.stream.polygonEnd();
	    }
	  };
	  function d3_geo_transformPoint(stream, point) {
	    return {
	      point: point,
	      sphere: function() {
	        stream.sphere();
	      },
	      lineStart: function() {
	        stream.lineStart();
	      },
	      lineEnd: function() {
	        stream.lineEnd();
	      },
	      polygonStart: function() {
	        stream.polygonStart();
	      },
	      polygonEnd: function() {
	        stream.polygonEnd();
	      }
	    };
	  }
	  d3.geo.projection = d3_geo_projection;
	  d3.geo.projectionMutator = d3_geo_projectionMutator;
	  function d3_geo_projection(project) {
	    return d3_geo_projectionMutator(function() {
	      return project;
	    })();
	  }
	  function d3_geo_projectionMutator(projectAt) {
	    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {
	      x = project(x, y);
	      return [ x[0] * k + δx, δy - x[1] * k ];
	    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;
	    function projection(point) {
	      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);
	      return [ point[0] * k + δx, δy - point[1] * k ];
	    }
	    function invert(point) {
	      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
	      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];
	    }
	    projection.stream = function(output) {
	      if (stream) stream.valid = false;
	      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));
	      stream.valid = true;
	      return stream;
	    };
	    projection.clipAngle = function(_) {
	      if (!arguments.length) return clipAngle;
	      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);
	      return invalidate();
	    };
	    projection.clipExtent = function(_) {
	      if (!arguments.length) return clipExtent;
	      clipExtent = _;
	      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;
	      return invalidate();
	    };
	    projection.scale = function(_) {
	      if (!arguments.length) return k;
	      k = +_;
	      return reset();
	    };
	    projection.translate = function(_) {
	      if (!arguments.length) return [ x, y ];
	      x = +_[0];
	      y = +_[1];
	      return reset();
	    };
	    projection.center = function(_) {
	      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];
	      λ = _[0] % 360 * d3_radians;
	      φ = _[1] % 360 * d3_radians;
	      return reset();
	    };
	    projection.rotate = function(_) {
	      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];
	      δλ = _[0] % 360 * d3_radians;
	      δφ = _[1] % 360 * d3_radians;
	      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;
	      return reset();
	    };
	    d3.rebind(projection, projectResample, "precision");
	    function reset() {
	      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);
	      var center = project(λ, φ);
	      δx = x - center[0] * k;
	      δy = y + center[1] * k;
	      return invalidate();
	    }
	    function invalidate() {
	      if (stream) stream.valid = false, stream = null;
	      return projection;
	    }
	    return function() {
	      project = projectAt.apply(this, arguments);
	      projection.invert = project.invert && invert;
	      return reset();
	    };
	  }
	  function d3_geo_projectionRadians(stream) {
	    return d3_geo_transformPoint(stream, function(x, y) {
	      stream.point(x * d3_radians, y * d3_radians);
	    });
	  }
	  function d3_geo_equirectangular(λ, φ) {
	    return [ λ, φ ];
	  }
	  (d3.geo.equirectangular = function() {
	    return d3_geo_projection(d3_geo_equirectangular);
	  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;
	  d3.geo.rotation = function(rotate) {
	    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);
	    function forward(coordinates) {
	      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
	      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
	    }
	    forward.invert = function(coordinates) {
	      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
	      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
	    };
	    return forward;
	  };
	  function d3_geo_identityRotation(λ, φ) {
	    return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
	  }
	  d3_geo_identityRotation.invert = d3_geo_equirectangular;
	  function d3_geo_rotation(δλ, δφ, δγ) {
	    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;
	  }
	  function d3_geo_forwardRotationλ(δλ) {
	    return function(λ, φ) {
	      return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
	    };
	  }
	  function d3_geo_rotationλ(δλ) {
	    var rotation = d3_geo_forwardRotationλ(δλ);
	    rotation.invert = d3_geo_forwardRotationλ(-δλ);
	    return rotation;
	  }
	  function d3_geo_rotationφγ(δφ, δγ) {
	    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);
	    function rotation(λ, φ) {
	      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;
	      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];
	    }
	    rotation.invert = function(λ, φ) {
	      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;
	      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];
	    };
	    return rotation;
	  }
	  d3.geo.circle = function() {
	    var origin = [ 0, 0 ], angle, precision = 6, interpolate;
	    function circle() {
	      var center = typeof origin === "function" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];
	      interpolate(null, null, 1, {
	        point: function(x, y) {
	          ring.push(x = rotate(x, y));
	          x[0] *= d3_degrees, x[1] *= d3_degrees;
	        }
	      });
	      return {
	        type: "Polygon",
	        coordinates: [ ring ]
	      };
	    }
	    circle.origin = function(x) {
	      if (!arguments.length) return origin;
	      origin = x;
	      return circle;
	    };
	    circle.angle = function(x) {
	      if (!arguments.length) return angle;
	      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);
	      return circle;
	    };
	    circle.precision = function(_) {
	      if (!arguments.length) return precision;
	      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);
	      return circle;
	    };
	    return circle.angle(90);
	  };
	  function d3_geo_circleInterpolate(radius, precision) {
	    var cr = Math.cos(radius), sr = Math.sin(radius);
	    return function(from, to, direction, listener) {
	      var step = direction * precision;
	      if (from != null) {
	        from = d3_geo_circleAngle(cr, from);
	        to = d3_geo_circleAngle(cr, to);
	        if (direction > 0 ? from < to : from > to) from += direction * τ;
	      } else {
	        from = radius + direction * τ;
	        to = radius - .5 * step;
	      }
	      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
	        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);
	      }
	    };
	  }
	  function d3_geo_circleAngle(cr, point) {
	    var a = d3_geo_cartesian(point);
	    a[0] -= cr;
	    d3_geo_cartesianNormalize(a);
	    var angle = d3_acos(-a[1]);
	    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);
	  }
	  d3.geo.distance = function(a, b) {
	    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;
	    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);
	  };
	  d3.geo.graticule = function() {
	    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;
	    function graticule() {
	      return {
	        type: "MultiLineString",
	        coordinates: lines()
	      };
	    }
	    function lines() {
	      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
	        return abs(x % DX) > ε;
	      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {
	        return abs(y % DY) > ε;
	      }).map(y));
	    }
	    graticule.lines = function() {
	      return lines().map(function(coordinates) {
	        return {
	          type: "LineString",
	          coordinates: coordinates
	        };
	      });
	    };
	    graticule.outline = function() {
	      return {
	        type: "Polygon",
	        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]
	      };
	    };
	    graticule.extent = function(_) {
	      if (!arguments.length) return graticule.minorExtent();
	      return graticule.majorExtent(_).minorExtent(_);
	    };
	    graticule.majorExtent = function(_) {
	      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];
	      X0 = +_[0][0], X1 = +_[1][0];
	      Y0 = +_[0][1], Y1 = +_[1][1];
	      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
	      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
	      return graticule.precision(precision);
	    };
	    graticule.minorExtent = function(_) {
	      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
	      x0 = +_[0][0], x1 = +_[1][0];
	      y0 = +_[0][1], y1 = +_[1][1];
	      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
	      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
	      return graticule.precision(precision);
	    };
	    graticule.step = function(_) {
	      if (!arguments.length) return graticule.minorStep();
	      return graticule.majorStep(_).minorStep(_);
	    };
	    graticule.majorStep = function(_) {
	      if (!arguments.length) return [ DX, DY ];
	      DX = +_[0], DY = +_[1];
	      return graticule;
	    };
	    graticule.minorStep = function(_) {
	      if (!arguments.length) return [ dx, dy ];
	      dx = +_[0], dy = +_[1];
	      return graticule;
	    };
	    graticule.precision = function(_) {
	      if (!arguments.length) return precision;
	      precision = +_;
	      x = d3_geo_graticuleX(y0, y1, 90);
	      y = d3_geo_graticuleY(x0, x1, precision);
	      X = d3_geo_graticuleX(Y0, Y1, 90);
	      Y = d3_geo_graticuleY(X0, X1, precision);
	      return graticule;
	    };
	    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);
	  };
	  function d3_geo_graticuleX(y0, y1, dy) {
	    var y = d3.range(y0, y1 - ε, dy).concat(y1);
	    return function(x) {
	      return y.map(function(y) {
	        return [ x, y ];
	      });
	    };
	  }
	  function d3_geo_graticuleY(x0, x1, dx) {
	    var x = d3.range(x0, x1 - ε, dx).concat(x1);
	    return function(y) {
	      return x.map(function(x) {
	        return [ x, y ];
	      });
	    };
	  }
	  function d3_source(d) {
	    return d.source;
	  }
	  function d3_target(d) {
	    return d.target;
	  }
	  d3.geo.greatArc = function() {
	    var source = d3_source, source_, target = d3_target, target_;
	    function greatArc() {
	      return {
	        type: "LineString",
	        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]
	      };
	    }
	    greatArc.distance = function() {
	      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));
	    };
	    greatArc.source = function(_) {
	      if (!arguments.length) return source;
	      source = _, source_ = typeof _ === "function" ? null : _;
	      return greatArc;
	    };
	    greatArc.target = function(_) {
	      if (!arguments.length) return target;
	      target = _, target_ = typeof _ === "function" ? null : _;
	      return greatArc;
	    };
	    greatArc.precision = function() {
	      return arguments.length ? greatArc : 0;
	    };
	    return greatArc;
	  };
	  d3.geo.interpolate = function(source, target) {
	    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);
	  };
	  function d3_geo_interpolate(x0, y0, x1, y1) {
	    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);
	    var interpolate = d ? function(t) {
	      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;
	      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];
	    } : function() {
	      return [ x0 * d3_degrees, y0 * d3_degrees ];
	    };
	    interpolate.distance = d;
	    return interpolate;
	  }
	  d3.geo.length = function(object) {
	    d3_geo_lengthSum = 0;
	    d3.geo.stream(object, d3_geo_length);
	    return d3_geo_lengthSum;
	  };
	  var d3_geo_lengthSum;
	  var d3_geo_length = {
	    sphere: d3_noop,
	    point: d3_noop,
	    lineStart: d3_geo_lengthLineStart,
	    lineEnd: d3_noop,
	    polygonStart: d3_noop,
	    polygonEnd: d3_noop
	  };
	  function d3_geo_lengthLineStart() {
	    var λ0, sinφ0, cosφ0;
	    d3_geo_length.point = function(λ, φ) {
	      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);
	      d3_geo_length.point = nextPoint;
	    };
	    d3_geo_length.lineEnd = function() {
	      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;
	    };
	    function nextPoint(λ, φ) {
	      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);
	      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
	      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
	    }
	  }
	  function d3_geo_azimuthal(scale, angle) {
	    function azimuthal(λ, φ) {
	      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);
	      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];
	    }
	    azimuthal.invert = function(x, y) {
	      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);
	      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];
	    };
	    return azimuthal;
	  }
	  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {
	    return Math.sqrt(2 / (1 + cosλcosφ));
	  }, function(ρ) {
	    return 2 * Math.asin(ρ / 2);
	  });
	  (d3.geo.azimuthalEqualArea = function() {
	    return d3_geo_projection(d3_geo_azimuthalEqualArea);
	  }).raw = d3_geo_azimuthalEqualArea;
	  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {
	    var c = Math.acos(cosλcosφ);
	    return c && c / Math.sin(c);
	  }, d3_identity);
	  (d3.geo.azimuthalEquidistant = function() {
	    return d3_geo_projection(d3_geo_azimuthalEquidistant);
	  }).raw = d3_geo_azimuthalEquidistant;
	  function d3_geo_conicConformal(φ0, φ1) {
	    var cosφ0 = Math.cos(φ0), t = function(φ) {
	      return Math.tan(π / 4 + φ / 2);
	    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;
	    if (!n) return d3_geo_mercator;
	    function forward(λ, φ) {
	      if (F > 0) {
	        if (φ < -halfπ + ε) φ = -halfπ + ε;
	      } else {
	        if (φ > halfπ - ε) φ = halfπ - ε;
	      }
	      var ρ = F / Math.pow(t(φ), n);
	      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];
	    }
	    forward.invert = function(x, y) {
	      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
	      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];
	    };
	    return forward;
	  }
	  (d3.geo.conicConformal = function() {
	    return d3_geo_conic(d3_geo_conicConformal);
	  }).raw = d3_geo_conicConformal;
	  function d3_geo_conicEquidistant(φ0, φ1) {
	    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;
	    if (abs(n) < ε) return d3_geo_equirectangular;
	    function forward(λ, φ) {
	      var ρ = G - φ;
	      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];
	    }
	    forward.invert = function(x, y) {
	      var ρ0_y = G - y;
	      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];
	    };
	    return forward;
	  }
	  (d3.geo.conicEquidistant = function() {
	    return d3_geo_conic(d3_geo_conicEquidistant);
	  }).raw = d3_geo_conicEquidistant;
	  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {
	    return 1 / cosλcosφ;
	  }, Math.atan);
	  (d3.geo.gnomonic = function() {
	    return d3_geo_projection(d3_geo_gnomonic);
	  }).raw = d3_geo_gnomonic;
	  function d3_geo_mercator(λ, φ) {
	    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];
	  }
	  d3_geo_mercator.invert = function(x, y) {
	    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];
	  };
	  function d3_geo_mercatorProjection(project) {
	    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;
	    m.scale = function() {
	      var v = scale.apply(m, arguments);
	      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
	    };
	    m.translate = function() {
	      var v = translate.apply(m, arguments);
	      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
	    };
	    m.clipExtent = function(_) {
	      var v = clipExtent.apply(m, arguments);
	      if (v === m) {
	        if (clipAuto = _ == null) {
	          var k = π * scale(), t = translate();
	          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);
	        }
	      } else if (clipAuto) {
	        v = null;
	      }
	      return v;
	    };
	    return m.clipExtent(null);
	  }
	  (d3.geo.mercator = function() {
	    return d3_geo_mercatorProjection(d3_geo_mercator);
	  }).raw = d3_geo_mercator;
	  var d3_geo_orthographic = d3_geo_azimuthal(function() {
	    return 1;
	  }, Math.asin);
	  (d3.geo.orthographic = function() {
	    return d3_geo_projection(d3_geo_orthographic);
	  }).raw = d3_geo_orthographic;
	  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {
	    return 1 / (1 + cosλcosφ);
	  }, function(ρ) {
	    return 2 * Math.atan(ρ);
	  });
	  (d3.geo.stereographic = function() {
	    return d3_geo_projection(d3_geo_stereographic);
	  }).raw = d3_geo_stereographic;
	  function d3_geo_transverseMercator(λ, φ) {
	    return [ Math.log(Math.tan(π / 4 + φ / 2)), -λ ];
	  }
	  d3_geo_transverseMercator.invert = function(x, y) {
	    return [ -y, 2 * Math.atan(Math.exp(x)) - halfπ ];
	  };
	  (d3.geo.transverseMercator = function() {
	    var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator), center = projection.center, rotate = projection.rotate;
	    projection.center = function(_) {
	      return _ ? center([ -_[1], _[0] ]) : (_ = center(), [ _[1], -_[0] ]);
	    };
	    projection.rotate = function(_) {
	      return _ ? rotate([ _[0], _[1], _.length > 2 ? _[2] + 90 : 90 ]) : (_ = rotate(), 
	      [ _[0], _[1], _[2] - 90 ]);
	    };
	    return rotate([ 0, 0, 90 ]);
	  }).raw = d3_geo_transverseMercator;
	  d3.geom = {};
	  function d3_geom_pointX(d) {
	    return d[0];
	  }
	  function d3_geom_pointY(d) {
	    return d[1];
	  }
	  d3.geom.hull = function(vertices) {
	    var x = d3_geom_pointX, y = d3_geom_pointY;
	    if (arguments.length) return hull(vertices);
	    function hull(data) {
	      if (data.length < 3) return [];
	      var fx = d3_functor(x), fy = d3_functor(y), i, n = data.length, points = [], flippedPoints = [];
	      for (i = 0; i < n; i++) {
	        points.push([ +fx.call(this, data[i], i), +fy.call(this, data[i], i), i ]);
	      }
	      points.sort(d3_geom_hullOrder);
	      for (i = 0; i < n; i++) flippedPoints.push([ points[i][0], -points[i][1] ]);
	      var upper = d3_geom_hullUpper(points), lower = d3_geom_hullUpper(flippedPoints);
	      var skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = [];
	      for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]]);
	      for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]]);
	      return polygon;
	    }
	    hull.x = function(_) {
	      return arguments.length ? (x = _, hull) : x;
	    };
	    hull.y = function(_) {
	      return arguments.length ? (y = _, hull) : y;
	    };
	    return hull;
	  };
	  function d3_geom_hullUpper(points) {
	    var n = points.length, hull = [ 0, 1 ], hs = 2;
	    for (var i = 2; i < n; i++) {
	      while (hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0) --hs;
	      hull[hs++] = i;
	    }
	    return hull.slice(0, hs);
	  }
	  function d3_geom_hullOrder(a, b) {
	    return a[0] - b[0] || a[1] - b[1];
	  }
	  d3.geom.polygon = function(coordinates) {
	    d3_subclass(coordinates, d3_geom_polygonPrototype);
	    return coordinates;
	  };
	  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];
	  d3_geom_polygonPrototype.area = function() {
	    var i = -1, n = this.length, a, b = this[n - 1], area = 0;
	    while (++i < n) {
	      a = b;
	      b = this[i];
	      area += a[1] * b[0] - a[0] * b[1];
	    }
	    return area * .5;
	  };
	  d3_geom_polygonPrototype.centroid = function(k) {
	    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;
	    if (!arguments.length) k = -1 / (6 * this.area());
	    while (++i < n) {
	      a = b;
	      b = this[i];
	      c = a[0] * b[1] - b[0] * a[1];
	      x += (a[0] + b[0]) * c;
	      y += (a[1] + b[1]) * c;
	    }
	    return [ x * k, y * k ];
	  };
	  d3_geom_polygonPrototype.clip = function(subject) {
	    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;
	    while (++i < n) {
	      input = subject.slice();
	      subject.length = 0;
	      b = this[i];
	      c = input[(m = input.length - closed) - 1];
	      j = -1;
	      while (++j < m) {
	        d = input[j];
	        if (d3_geom_polygonInside(d, a, b)) {
	          if (!d3_geom_polygonInside(c, a, b)) {
	            subject.push(d3_geom_polygonIntersect(c, d, a, b));
	          }
	          subject.push(d);
	        } else if (d3_geom_polygonInside(c, a, b)) {
	          subject.push(d3_geom_polygonIntersect(c, d, a, b));
	        }
	        c = d;
	      }
	      if (closed) subject.push(subject[0]);
	      a = b;
	    }
	    return subject;
	  };
	  function d3_geom_polygonInside(p, a, b) {
	    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
	  }
	  function d3_geom_polygonIntersect(c, d, a, b) {
	    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
	    return [ x1 + ua * x21, y1 + ua * y21 ];
	  }
	  function d3_geom_polygonClosed(coordinates) {
	    var a = coordinates[0], b = coordinates[coordinates.length - 1];
	    return !(a[0] - b[0] || a[1] - b[1]);
	  }
	  var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = [];
	  function d3_geom_voronoiBeach() {
	    d3_geom_voronoiRedBlackNode(this);
	    this.edge = this.site = this.circle = null;
	  }
	  function d3_geom_voronoiCreateBeach(site) {
	    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();
	    beach.site = site;
	    return beach;
	  }
	  function d3_geom_voronoiDetachBeach(beach) {
	    d3_geom_voronoiDetachCircle(beach);
	    d3_geom_voronoiBeaches.remove(beach);
	    d3_geom_voronoiBeachPool.push(beach);
	    d3_geom_voronoiRedBlackNode(beach);
	  }
	  function d3_geom_voronoiRemoveBeach(beach) {
	    var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {
	      x: x,
	      y: y
	    }, previous = beach.P, next = beach.N, disappearing = [ beach ];
	    d3_geom_voronoiDetachBeach(beach);
	    var lArc = previous;
	    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {
	      previous = lArc.P;
	      disappearing.unshift(lArc);
	      d3_geom_voronoiDetachBeach(lArc);
	      lArc = previous;
	    }
	    disappearing.unshift(lArc);
	    d3_geom_voronoiDetachCircle(lArc);
	    var rArc = next;
	    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {
	      next = rArc.N;
	      disappearing.push(rArc);
	      d3_geom_voronoiDetachBeach(rArc);
	      rArc = next;
	    }
	    disappearing.push(rArc);
	    d3_geom_voronoiDetachCircle(rArc);
	    var nArcs = disappearing.length, iArc;
	    for (iArc = 1; iArc < nArcs; ++iArc) {
	      rArc = disappearing[iArc];
	      lArc = disappearing[iArc - 1];
	      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
	    }
	    lArc = disappearing[0];
	    rArc = disappearing[nArcs - 1];
	    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);
	    d3_geom_voronoiAttachCircle(lArc);
	    d3_geom_voronoiAttachCircle(rArc);
	  }
	  function d3_geom_voronoiAddBeach(site) {
	    var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._;
	    while (node) {
	      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;
	      if (dxl > ε) node = node.L; else {
	        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);
	        if (dxr > ε) {
	          if (!node.R) {
	            lArc = node;
	            break;
	          }
	          node = node.R;
	        } else {
	          if (dxl > -ε) {
	            lArc = node.P;
	            rArc = node;
	          } else if (dxr > -ε) {
	            lArc = node;
	            rArc = node.N;
	          } else {
	            lArc = rArc = node;
	          }
	          break;
	        }
	      }
	    }
	    var newArc = d3_geom_voronoiCreateBeach(site);
	    d3_geom_voronoiBeaches.insert(lArc, newArc);
	    if (!lArc && !rArc) return;
	    if (lArc === rArc) {
	      d3_geom_voronoiDetachCircle(lArc);
	      rArc = d3_geom_voronoiCreateBeach(lArc.site);
	      d3_geom_voronoiBeaches.insert(newArc, rArc);
	      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
	      d3_geom_voronoiAttachCircle(lArc);
	      d3_geom_voronoiAttachCircle(rArc);
	      return;
	    }
	    if (!rArc) {
	      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
	      return;
	    }
	    d3_geom_voronoiDetachCircle(lArc);
	    d3_geom_voronoiDetachCircle(rArc);
	    var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {
	      x: (cy * hb - by * hc) / d + ax,
	      y: (bx * hc - cx * hb) / d + ay
	    };
	    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);
	    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);
	    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);
	    d3_geom_voronoiAttachCircle(lArc);
	    d3_geom_voronoiAttachCircle(rArc);
	  }
	  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {
	    var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;
	    if (!pby2) return rfocx;
	    var lArc = arc.P;
	    if (!lArc) return -Infinity;
	    site = lArc.site;
	    var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;
	    if (!plby2) return lfocx;
	    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;
	    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
	    return (rfocx + lfocx) / 2;
	  }
	  function d3_geom_voronoiRightBreakPoint(arc, directrix) {
	    var rArc = arc.N;
	    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);
	    var site = arc.site;
	    return site.y === directrix ? site.x : Infinity;
	  }
	  function d3_geom_voronoiCell(site) {
	    this.site = site;
	    this.edges = [];
	  }
	  d3_geom_voronoiCell.prototype.prepare = function() {
	    var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge;
	    while (iHalfEdge--) {
	      edge = halfEdges[iHalfEdge].edge;
	      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);
	    }
	    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);
	    return halfEdges.length;
	  };
	  function d3_geom_voronoiCloseCells(extent) {
	    var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end;
	    while (iCell--) {
	      cell = cells[iCell];
	      if (!cell || !cell.prepare()) continue;
	      halfEdges = cell.edges;
	      nHalfEdges = halfEdges.length;
	      iHalfEdge = 0;
	      while (iHalfEdge < nHalfEdges) {
	        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;
	        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;
	        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {
	          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {
	            x: x0,
	            y: abs(x2 - x0) < ε ? y2 : y1
	          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {
	            x: abs(y2 - y1) < ε ? x2 : x1,
	            y: y1
	          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {
	            x: x1,
	            y: abs(x2 - x1) < ε ? y2 : y0
	          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {
	            x: abs(y2 - y0) < ε ? x2 : x0,
	            y: y0
	          } : null), cell.site, null));
	          ++nHalfEdges;
	        }
	      }
	    }
	  }
	  function d3_geom_voronoiHalfEdgeOrder(a, b) {
	    return b.angle - a.angle;
	  }
	  function d3_geom_voronoiCircle() {
	    d3_geom_voronoiRedBlackNode(this);
	    this.x = this.y = this.arc = this.site = this.cy = null;
	  }
	  function d3_geom_voronoiAttachCircle(arc) {
	    var lArc = arc.P, rArc = arc.N;
	    if (!lArc || !rArc) return;
	    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;
	    if (lSite === rSite) return;
	    var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;
	    var d = 2 * (ax * cy - ay * cx);
	    if (d >= -ε2) return;
	    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by;
	    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();
	    circle.arc = arc;
	    circle.site = cSite;
	    circle.x = x + bx;
	    circle.y = cy + Math.sqrt(x * x + y * y);
	    circle.cy = cy;
	    arc.circle = circle;
	    var before = null, node = d3_geom_voronoiCircles._;
	    while (node) {
	      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
	        if (node.L) node = node.L; else {
	          before = node.P;
	          break;
	        }
	      } else {
	        if (node.R) node = node.R; else {
	          before = node;
	          break;
	        }
	      }
	    }
	    d3_geom_voronoiCircles.insert(before, circle);
	    if (!before) d3_geom_voronoiFirstCircle = circle;
	  }
	  function d3_geom_voronoiDetachCircle(arc) {
	    var circle = arc.circle;
	    if (circle) {
	      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;
	      d3_geom_voronoiCircles.remove(circle);
	      d3_geom_voronoiCirclePool.push(circle);
	      d3_geom_voronoiRedBlackNode(circle);
	      arc.circle = null;
	    }
	  }
	  function d3_geom_voronoiClipEdges(extent) {
	    var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e;
	    while (i--) {
	      e = edges[i];
	      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {
	        e.a = e.b = null;
	        edges.splice(i, 1);
	      }
	    }
	  }
	  function d3_geom_voronoiConnectEdge(edge, extent) {
	    var vb = edge.b;
	    if (vb) return true;
	    var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;
	    if (ry === ly) {
	      if (fx < x0 || fx >= x1) return;
	      if (lx > rx) {
	        if (!va) va = {
	          x: fx,
	          y: y0
	        }; else if (va.y >= y1) return;
	        vb = {
	          x: fx,
	          y: y1
	        };
	      } else {
	        if (!va) va = {
	          x: fx,
	          y: y1
	        }; else if (va.y < y0) return;
	        vb = {
	          x: fx,
	          y: y0
	        };
	      }
	    } else {
	      fm = (lx - rx) / (ry - ly);
	      fb = fy - fm * fx;
	      if (fm < -1 || fm > 1) {
	        if (lx > rx) {
	          if (!va) va = {
	            x: (y0 - fb) / fm,
	            y: y0
	          }; else if (va.y >= y1) return;
	          vb = {
	            x: (y1 - fb) / fm,
	            y: y1
	          };
	        } else {
	          if (!va) va = {
	            x: (y1 - fb) / fm,
	            y: y1
	          }; else if (va.y < y0) return;
	          vb = {
	            x: (y0 - fb) / fm,
	            y: y0
	          };
	        }
	      } else {
	        if (ly < ry) {
	          if (!va) va = {
	            x: x0,
	            y: fm * x0 + fb
	          }; else if (va.x >= x1) return;
	          vb = {
	            x: x1,
	            y: fm * x1 + fb
	          };
	        } else {
	          if (!va) va = {
	            x: x1,
	            y: fm * x1 + fb
	          }; else if (va.x < x0) return;
	          vb = {
	            x: x0,
	            y: fm * x0 + fb
	          };
	        }
	      }
	    }
	    edge.a = va;
	    edge.b = vb;
	    return true;
	  }
	  function d3_geom_voronoiEdge(lSite, rSite) {
	    this.l = lSite;
	    this.r = rSite;
	    this.a = this.b = null;
	  }
	  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {
	    var edge = new d3_geom_voronoiEdge(lSite, rSite);
	    d3_geom_voronoiEdges.push(edge);
	    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);
	    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);
	    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));
	    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));
	    return edge;
	  }
	  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {
	    var edge = new d3_geom_voronoiEdge(lSite, null);
	    edge.a = va;
	    edge.b = vb;
	    d3_geom_voronoiEdges.push(edge);
	    return edge;
	  }
	  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {
	    if (!edge.a && !edge.b) {
	      edge.a = vertex;
	      edge.l = lSite;
	      edge.r = rSite;
	    } else if (edge.l === rSite) {
	      edge.b = vertex;
	    } else {
	      edge.a = vertex;
	    }
	  }
	  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {
	    var va = edge.a, vb = edge.b;
	    this.edge = edge;
	    this.site = lSite;
	    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);
	  }
	  d3_geom_voronoiHalfEdge.prototype = {
	    start: function() {
	      return this.edge.l === this.site ? this.edge.a : this.edge.b;
	    },
	    end: function() {
	      return this.edge.l === this.site ? this.edge.b : this.edge.a;
	    }
	  };
	  function d3_geom_voronoiRedBlackTree() {
	    this._ = null;
	  }
	  function d3_geom_voronoiRedBlackNode(node) {
	    node.U = node.C = node.L = node.R = node.P = node.N = null;
	  }
	  d3_geom_voronoiRedBlackTree.prototype = {
	    insert: function(after, node) {
	      var parent, grandpa, uncle;
	      if (after) {
	        node.P = after;
	        node.N = after.N;
	        if (after.N) after.N.P = node;
	        after.N = node;
	        if (after.R) {
	          after = after.R;
	          while (after.L) after = after.L;
	          after.L = node;
	        } else {
	          after.R = node;
	        }
	        parent = after;
	      } else if (this._) {
	        after = d3_geom_voronoiRedBlackFirst(this._);
	        node.P = null;
	        node.N = after;
	        after.P = after.L = node;
	        parent = after;
	      } else {
	        node.P = node.N = null;
	        this._ = node;
	        parent = null;
	      }
	      node.L = node.R = null;
	      node.U = parent;
	      node.C = true;
	      after = node;
	      while (parent && parent.C) {
	        grandpa = parent.U;
	        if (parent === grandpa.L) {
	          uncle = grandpa.R;
	          if (uncle && uncle.C) {
	            parent.C = uncle.C = false;
	            grandpa.C = true;
	            after = grandpa;
	          } else {
	            if (after === parent.R) {
	              d3_geom_voronoiRedBlackRotateLeft(this, parent);
	              after = parent;
	              parent = after.U;
	            }
	            parent.C = false;
	            grandpa.C = true;
	            d3_geom_voronoiRedBlackRotateRight(this, grandpa);
	          }
	        } else {
	          uncle = grandpa.L;
	          if (uncle && uncle.C) {
	            parent.C = uncle.C = false;
	            grandpa.C = true;
	            after = grandpa;
	          } else {
	            if (after === parent.L) {
	              d3_geom_voronoiRedBlackRotateRight(this, parent);
	              after = parent;
	              parent = after.U;
	            }
	            parent.C = false;
	            grandpa.C = true;
	            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);
	          }
	        }
	        parent = after.U;
	      }
	      this._.C = false;
	    },
	    remove: function(node) {
	      if (node.N) node.N.P = node.P;
	      if (node.P) node.P.N = node.N;
	      node.N = node.P = null;
	      var parent = node.U, sibling, left = node.L, right = node.R, next, red;
	      if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right);
	      if (parent) {
	        if (parent.L === node) parent.L = next; else parent.R = next;
	      } else {
	        this._ = next;
	      }
	      if (left && right) {
	        red = next.C;
	        next.C = node.C;
	        next.L = left;
	        left.U = next;
	        if (next !== right) {
	          parent = next.U;
	          next.U = node.U;
	          node = next.R;
	          parent.L = node;
	          next.R = right;
	          right.U = next;
	        } else {
	          next.U = parent;
	          parent = next;
	          node = next.R;
	        }
	      } else {
	        red = node.C;
	        node = next;
	      }
	      if (node) node.U = parent;
	      if (red) return;
	      if (node && node.C) {
	        node.C = false;
	        return;
	      }
	      do {
	        if (node === this._) break;
	        if (node === parent.L) {
	          sibling = parent.R;
	          if (sibling.C) {
	            sibling.C = false;
	            parent.C = true;
	            d3_geom_voronoiRedBlackRotateLeft(this, parent);
	            sibling = parent.R;
	          }
	          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
	            if (!sibling.R || !sibling.R.C) {
	              sibling.L.C = false;
	              sibling.C = true;
	              d3_geom_voronoiRedBlackRotateRight(this, sibling);
	              sibling = parent.R;
	            }
	            sibling.C = parent.C;
	            parent.C = sibling.R.C = false;
	            d3_geom_voronoiRedBlackRotateLeft(this, parent);
	            node = this._;
	            break;
	          }
	        } else {
	          sibling = parent.L;
	          if (sibling.C) {
	            sibling.C = false;
	            parent.C = true;
	            d3_geom_voronoiRedBlackRotateRight(this, parent);
	            sibling = parent.L;
	          }
	          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
	            if (!sibling.L || !sibling.L.C) {
	              sibling.R.C = false;
	              sibling.C = true;
	              d3_geom_voronoiRedBlackRotateLeft(this, sibling);
	              sibling = parent.L;
	            }
	            sibling.C = parent.C;
	            parent.C = sibling.L.C = false;
	            d3_geom_voronoiRedBlackRotateRight(this, parent);
	            node = this._;
	            break;
	          }
	        }
	        sibling.C = true;
	        node = parent;
	        parent = parent.U;
	      } while (!node.C);
	      if (node) node.C = false;
	    }
	  };
	  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {
	    var p = node, q = node.R, parent = p.U;
	    if (parent) {
	      if (parent.L === p) parent.L = q; else parent.R = q;
	    } else {
	      tree._ = q;
	    }
	    q.U = parent;
	    p.U = q;
	    p.R = q.L;
	    if (p.R) p.R.U = p;
	    q.L = p;
	  }
	  function d3_geom_voronoiRedBlackRotateRight(tree, node) {
	    var p = node, q = node.L, parent = p.U;
	    if (parent) {
	      if (parent.L === p) parent.L = q; else parent.R = q;
	    } else {
	      tree._ = q;
	    }
	    q.U = parent;
	    p.U = q;
	    p.L = q.R;
	    if (p.L) p.L.U = p;
	    q.R = p;
	  }
	  function d3_geom_voronoiRedBlackFirst(node) {
	    while (node.L) node = node.L;
	    return node;
	  }
	  function d3_geom_voronoi(sites, bbox) {
	    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle;
	    d3_geom_voronoiEdges = [];
	    d3_geom_voronoiCells = new Array(sites.length);
	    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();
	    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();
	    while (true) {
	      circle = d3_geom_voronoiFirstCircle;
	      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
	        if (site.x !== x0 || site.y !== y0) {
	          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);
	          d3_geom_voronoiAddBeach(site);
	          x0 = site.x, y0 = site.y;
	        }
	        site = sites.pop();
	      } else if (circle) {
	        d3_geom_voronoiRemoveBeach(circle.arc);
	      } else {
	        break;
	      }
	    }
	    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);
	    var diagram = {
	      cells: d3_geom_voronoiCells,
	      edges: d3_geom_voronoiEdges
	    };
	    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;
	    return diagram;
	  }
	  function d3_geom_voronoiVertexOrder(a, b) {
	    return b.y - a.y || b.x - a.x;
	  }
	  d3.geom.voronoi = function(points) {
	    var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;
	    if (points) return voronoi(points);
	    function voronoi(data) {
	      var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];
	      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function(cell, i) {
	        var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function(e) {
	          var s = e.start();
	          return [ s.x, s.y ];
	        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : [];
	        polygon.point = data[i];
	      });
	      return polygons;
	    }
	    function sites(data) {
	      return data.map(function(d, i) {
	        return {
	          x: Math.round(fx(d, i) / ε) * ε,
	          y: Math.round(fy(d, i) / ε) * ε,
	          i: i
	        };
	      });
	    }
	    voronoi.links = function(data) {
	      return d3_geom_voronoi(sites(data)).edges.filter(function(edge) {
	        return edge.l && edge.r;
	      }).map(function(edge) {
	        return {
	          source: data[edge.l.i],
	          target: data[edge.r.i]
	        };
	      });
	    };
	    voronoi.triangles = function(data) {
	      var triangles = [];
	      d3_geom_voronoi(sites(data)).cells.forEach(function(cell, i) {
	        var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l;
	        while (++j < m) {
	          e0 = e1;
	          s0 = s1;
	          e1 = edges[j].edge;
	          s1 = e1.l === site ? e1.r : e1.l;
	          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {
	            triangles.push([ data[i], data[s0.i], data[s1.i] ]);
	          }
	        }
	      });
	      return triangles;
	    };
	    voronoi.x = function(_) {
	      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;
	    };
	    voronoi.y = function(_) {
	      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;
	    };
	    voronoi.clipExtent = function(_) {
	      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;
	      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;
	      return voronoi;
	    };
	    voronoi.size = function(_) {
	      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];
	      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);
	    };
	    return voronoi;
	  };
	  var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ];
	  function d3_geom_voronoiTriangleArea(a, b, c) {
	    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);
	  }
	  d3.geom.delaunay = function(vertices) {
	    return d3.geom.voronoi().triangles(vertices);
	  };
	  d3.geom.quadtree = function(points, x1, y1, x2, y2) {
	    var x = d3_geom_pointX, y = d3_geom_pointY, compat;
	    if (compat = arguments.length) {
	      x = d3_geom_quadtreeCompatX;
	      y = d3_geom_quadtreeCompatY;
	      if (compat === 3) {
	        y2 = y1;
	        x2 = x1;
	        y1 = x1 = 0;
	      }
	      return quadtree(points);
	    }
	    function quadtree(data) {
	      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;
	      if (x1 != null) {
	        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
	      } else {
	        x2_ = y2_ = -(x1_ = y1_ = Infinity);
	        xs = [], ys = [];
	        n = data.length;
	        if (compat) for (i = 0; i < n; ++i) {
	          d = data[i];
	          if (d.x < x1_) x1_ = d.x;
	          if (d.y < y1_) y1_ = d.y;
	          if (d.x > x2_) x2_ = d.x;
	          if (d.y > y2_) y2_ = d.y;
	          xs.push(d.x);
	          ys.push(d.y);
	        } else for (i = 0; i < n; ++i) {
	          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
	          if (x_ < x1_) x1_ = x_;
	          if (y_ < y1_) y1_ = y_;
	          if (x_ > x2_) x2_ = x_;
	          if (y_ > y2_) y2_ = y_;
	          xs.push(x_);
	          ys.push(y_);
	        }
	      }
	      var dx = x2_ - x1_, dy = y2_ - y1_;
	      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
	      function insert(n, d, x, y, x1, y1, x2, y2) {
	        if (isNaN(x) || isNaN(y)) return;
	        if (n.leaf) {
	          var nx = n.x, ny = n.y;
	          if (nx != null) {
	            if (abs(nx - x) + abs(ny - y) < .01) {
	              insertChild(n, d, x, y, x1, y1, x2, y2);
	            } else {
	              var nPoint = n.point;
	              n.x = n.y = n.point = null;
	              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
	              insertChild(n, d, x, y, x1, y1, x2, y2);
	            }
	          } else {
	            n.x = x, n.y = y, n.point = d;
	          }
	        } else {
	          insertChild(n, d, x, y, x1, y1, x2, y2);
	        }
	      }
	      function insertChild(n, d, x, y, x1, y1, x2, y2) {
	        var xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym, i = below << 1 | right;
	        n.leaf = false;
	        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
	        if (right) x1 = xm; else x2 = xm;
	        if (below) y1 = ym; else y2 = ym;
	        insert(n, d, x, y, x1, y1, x2, y2);
	      }
	      var root = d3_geom_quadtreeNode();
	      root.add = function(d) {
	        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
	      };
	      root.visit = function(f) {
	        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
	      };
	      root.find = function(point) {
	        return d3_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_);
	      };
	      i = -1;
	      if (x1 == null) {
	        while (++i < n) {
	          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
	        }
	        --i;
	      } else data.forEach(root.add);
	      xs = ys = data = d = null;
	      return root;
	    }
	    quadtree.x = function(_) {
	      return arguments.length ? (x = _, quadtree) : x;
	    };
	    quadtree.y = function(_) {
	      return arguments.length ? (y = _, quadtree) : y;
	    };
	    quadtree.extent = function(_) {
	      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];
	      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], 
	      y2 = +_[1][1];
	      return quadtree;
	    };
	    quadtree.size = function(_) {
	      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];
	      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
	      return quadtree;
	    };
	    return quadtree;
	  };
	  function d3_geom_quadtreeCompatX(d) {
	    return d.x;
	  }
	  function d3_geom_quadtreeCompatY(d) {
	    return d.y;
	  }
	  function d3_geom_quadtreeNode() {
	    return {
	      leaf: true,
	      nodes: [],
	      point: null,
	      x: null,
	      y: null
	    };
	  }
	  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
	    if (!f(node, x1, y1, x2, y2)) {
	      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
	      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
	      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
	      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
	      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
	    }
	  }
	  function d3_geom_quadtreeFind(root, x, y, x0, y0, x3, y3) {
	    var minDistance2 = Infinity, closestPoint;
	    (function find(node, x1, y1, x2, y2) {
	      if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return;
	      if (point = node.point) {
	        var point, dx = x - node.x, dy = y - node.y, distance2 = dx * dx + dy * dy;
	        if (distance2 < minDistance2) {
	          var distance = Math.sqrt(minDistance2 = distance2);
	          x0 = x - distance, y0 = y - distance;
	          x3 = x + distance, y3 = y + distance;
	          closestPoint = point;
	        }
	      }
	      var children = node.nodes, xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym;
	      for (var i = below << 1 | right, j = i + 4; i < j; ++i) {
	        if (node = children[i & 3]) switch (i & 3) {
	         case 0:
	          find(node, x1, y1, xm, ym);
	          break;
	
	         case 1:
	          find(node, xm, y1, x2, ym);
	          break;
	
	         case 2:
	          find(node, x1, ym, xm, y2);
	          break;
	
	         case 3:
	          find(node, xm, ym, x2, y2);
	          break;
	        }
	      }
	    })(root, x0, y0, x3, y3);
	    return closestPoint;
	  }
	  d3.interpolateRgb = d3_interpolateRgb;
	  function d3_interpolateRgb(a, b) {
	    a = d3.rgb(a);
	    b = d3.rgb(b);
	    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
	    return function(t) {
	      return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
	    };
	  }
	  d3.interpolateObject = d3_interpolateObject;
	  function d3_interpolateObject(a, b) {
	    var i = {}, c = {}, k;
	    for (k in a) {
	      if (k in b) {
	        i[k] = d3_interpolate(a[k], b[k]);
	      } else {
	        c[k] = a[k];
	      }
	    }
	    for (k in b) {
	      if (!(k in a)) {
	        c[k] = b[k];
	      }
	    }
	    return function(t) {
	      for (k in i) c[k] = i[k](t);
	      return c;
	    };
	  }
	  d3.interpolateNumber = d3_interpolateNumber;
	  function d3_interpolateNumber(a, b) {
	    a = +a, b = +b;
	    return function(t) {
	      return a * (1 - t) + b * t;
	    };
	  }
	  d3.interpolateString = d3_interpolateString;
	  function d3_interpolateString(a, b) {
	    var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
	    a = a + "", b = b + "";
	    while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {
	      if ((bs = bm.index) > bi) {
	        bs = b.slice(bi, bs);
	        if (s[i]) s[i] += bs; else s[++i] = bs;
	      }
	      if ((am = am[0]) === (bm = bm[0])) {
	        if (s[i]) s[i] += bm; else s[++i] = bm;
	      } else {
	        s[++i] = null;
	        q.push({
	          i: i,
	          x: d3_interpolateNumber(am, bm)
	        });
	      }
	      bi = d3_interpolate_numberB.lastIndex;
	    }
	    if (bi < b.length) {
	      bs = b.slice(bi);
	      if (s[i]) s[i] += bs; else s[++i] = bs;
	    }
	    return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {
	      return b(t) + "";
	    }) : function() {
	      return b;
	    } : (b = q.length, function(t) {
	      for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	      return s.join("");
	    });
	  }
	  var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");
	  d3.interpolate = d3_interpolate;
	  function d3_interpolate(a, b) {
	    var i = d3.interpolators.length, f;
	    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
	    return f;
	  }
	  d3.interpolators = [ function(a, b) {
	    var t = typeof b;
	    return (t === "string" ? d3_rgb_names.has(b.toLowerCase()) || /^(#|rgb\(|hsl\()/i.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === "object" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);
	  } ];
	  d3.interpolateArray = d3_interpolateArray;
	  function d3_interpolateArray(a, b) {
	    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
	    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
	    for (;i < na; ++i) c[i] = a[i];
	    for (;i < nb; ++i) c[i] = b[i];
	    return function(t) {
	      for (i = 0; i < n0; ++i) c[i] = x[i](t);
	      return c;
	    };
	  }
	  var d3_ease_default = function() {
	    return d3_identity;
	  };
	  var d3_ease = d3.map({
	    linear: d3_ease_default,
	    poly: d3_ease_poly,
	    quad: function() {
	      return d3_ease_quad;
	    },
	    cubic: function() {
	      return d3_ease_cubic;
	    },
	    sin: function() {
	      return d3_ease_sin;
	    },
	    exp: function() {
	      return d3_ease_exp;
	    },
	    circle: function() {
	      return d3_ease_circle;
	    },
	    elastic: d3_ease_elastic,
	    back: d3_ease_back,
	    bounce: function() {
	      return d3_ease_bounce;
	    }
	  });
	  var d3_ease_mode = d3.map({
	    "in": d3_identity,
	    out: d3_ease_reverse,
	    "in-out": d3_ease_reflect,
	    "out-in": function(f) {
	      return d3_ease_reflect(d3_ease_reverse(f));
	    }
	  });
	  d3.ease = function(name) {
	    var i = name.indexOf("-"), t = i >= 0 ? name.slice(0, i) : name, m = i >= 0 ? name.slice(i + 1) : "in";
	    t = d3_ease.get(t) || d3_ease_default;
	    m = d3_ease_mode.get(m) || d3_identity;
	    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));
	  };
	  function d3_ease_clamp(f) {
	    return function(t) {
	      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
	    };
	  }
	  function d3_ease_reverse(f) {
	    return function(t) {
	      return 1 - f(1 - t);
	    };
	  }
	  function d3_ease_reflect(f) {
	    return function(t) {
	      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
	    };
	  }
	  function d3_ease_quad(t) {
	    return t * t;
	  }
	  function d3_ease_cubic(t) {
	    return t * t * t;
	  }
	  function d3_ease_cubicInOut(t) {
	    if (t <= 0) return 0;
	    if (t >= 1) return 1;
	    var t2 = t * t, t3 = t2 * t;
	    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
	  }
	  function d3_ease_poly(e) {
	    return function(t) {
	      return Math.pow(t, e);
	    };
	  }
	  function d3_ease_sin(t) {
	    return 1 - Math.cos(t * halfπ);
	  }
	  function d3_ease_exp(t) {
	    return Math.pow(2, 10 * (t - 1));
	  }
	  function d3_ease_circle(t) {
	    return 1 - Math.sqrt(1 - t * t);
	  }
	  function d3_ease_elastic(a, p) {
	    var s;
	    if (arguments.length < 2) p = .45;
	    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;
	    return function(t) {
	      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);
	    };
	  }
	  function d3_ease_back(s) {
	    if (!s) s = 1.70158;
	    return function(t) {
	      return t * t * ((s + 1) * t - s);
	    };
	  }
	  function d3_ease_bounce(t) {
	    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
	  }
	  d3.interpolateHcl = d3_interpolateHcl;
	  function d3_interpolateHcl(a, b) {
	    a = d3.hcl(a);
	    b = d3.hcl(b);
	    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;
	    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;
	    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
	    return function(t) {
	      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
	    };
	  }
	  d3.interpolateHsl = d3_interpolateHsl;
	  function d3_interpolateHsl(a, b) {
	    a = d3.hsl(a);
	    b = d3.hsl(b);
	    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;
	    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;
	    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
	    return function(t) {
	      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + "";
	    };
	  }
	  d3.interpolateLab = d3_interpolateLab;
	  function d3_interpolateLab(a, b) {
	    a = d3.lab(a);
	    b = d3.lab(b);
	    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;
	    return function(t) {
	      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
	    };
	  }
	  d3.interpolateRound = d3_interpolateRound;
	  function d3_interpolateRound(a, b) {
	    b -= a;
	    return function(t) {
	      return Math.round(a + b * t);
	    };
	  }
	  d3.transform = function(string) {
	    var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
	    return (d3.transform = function(string) {
	      if (string != null) {
	        g.setAttribute("transform", string);
	        var t = g.transform.baseVal.consolidate();
	      }
	      return new d3_transform(t ? t.matrix : d3_transformIdentity);
	    })(string);
	  };
	  function d3_transform(m) {
	    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
	    if (r0[0] * r1[1] < r1[0] * r0[1]) {
	      r0[0] *= -1;
	      r0[1] *= -1;
	      kx *= -1;
	      kz *= -1;
	    }
	    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
	    this.translate = [ m.e, m.f ];
	    this.scale = [ kx, ky ];
	    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
	  }
	  d3_transform.prototype.toString = function() {
	    return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";
	  };
	  function d3_transformDot(a, b) {
	    return a[0] * b[0] + a[1] * b[1];
	  }
	  function d3_transformNormalize(a) {
	    var k = Math.sqrt(d3_transformDot(a, a));
	    if (k) {
	      a[0] /= k;
	      a[1] /= k;
	    }
	    return k;
	  }
	  function d3_transformCombine(a, b, k) {
	    a[0] += k * b[0];
	    a[1] += k * b[1];
	    return a;
	  }
	  var d3_transformIdentity = {
	    a: 1,
	    b: 0,
	    c: 0,
	    d: 1,
	    e: 0,
	    f: 0
	  };
	  d3.interpolateTransform = d3_interpolateTransform;
	  function d3_interpolateTransform(a, b) {
	    var s = [], q = [], n, A = d3.transform(a), B = d3.transform(b), ta = A.translate, tb = B.translate, ra = A.rotate, rb = B.rotate, wa = A.skew, wb = B.skew, ka = A.scale, kb = B.scale;
	    if (ta[0] != tb[0] || ta[1] != tb[1]) {
	      s.push("translate(", null, ",", null, ")");
	      q.push({
	        i: 1,
	        x: d3_interpolateNumber(ta[0], tb[0])
	      }, {
	        i: 3,
	        x: d3_interpolateNumber(ta[1], tb[1])
	      });
	    } else if (tb[0] || tb[1]) {
	      s.push("translate(" + tb + ")");
	    } else {
	      s.push("");
	    }
	    if (ra != rb) {
	      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;
	      q.push({
	        i: s.push(s.pop() + "rotate(", null, ")") - 2,
	        x: d3_interpolateNumber(ra, rb)
	      });
	    } else if (rb) {
	      s.push(s.pop() + "rotate(" + rb + ")");
	    }
	    if (wa != wb) {
	      q.push({
	        i: s.push(s.pop() + "skewX(", null, ")") - 2,
	        x: d3_interpolateNumber(wa, wb)
	      });
	    } else if (wb) {
	      s.push(s.pop() + "skewX(" + wb + ")");
	    }
	    if (ka[0] != kb[0] || ka[1] != kb[1]) {
	      n = s.push(s.pop() + "scale(", null, ",", null, ")");
	      q.push({
	        i: n - 4,
	        x: d3_interpolateNumber(ka[0], kb[0])
	      }, {
	        i: n - 2,
	        x: d3_interpolateNumber(ka[1], kb[1])
	      });
	    } else if (kb[0] != 1 || kb[1] != 1) {
	      s.push(s.pop() + "scale(" + kb + ")");
	    }
	    n = q.length;
	    return function(t) {
	      var i = -1, o;
	      while (++i < n) s[(o = q[i]).i] = o.x(t);
	      return s.join("");
	    };
	  }
	  function d3_uninterpolateNumber(a, b) {
	    b = (b -= a = +a) || 1 / b;
	    return function(x) {
	      return (x - a) / b;
	    };
	  }
	  function d3_uninterpolateClamp(a, b) {
	    b = (b -= a = +a) || 1 / b;
	    return function(x) {
	      return Math.max(0, Math.min(1, (x - a) / b));
	    };
	  }
	  d3.layout = {};
	  d3.layout.bundle = function() {
	    return function(links) {
	      var paths = [], i = -1, n = links.length;
	      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));
	      return paths;
	    };
	  };
	  function d3_layout_bundlePath(link) {
	    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];
	    while (start !== lca) {
	      start = start.parent;
	      points.push(start);
	    }
	    var k = points.length;
	    while (end !== lca) {
	      points.splice(k, 0, end);
	      end = end.parent;
	    }
	    return points;
	  }
	  function d3_layout_bundleAncestors(node) {
	    var ancestors = [], parent = node.parent;
	    while (parent != null) {
	      ancestors.push(node);
	      node = parent;
	      parent = parent.parent;
	    }
	    ancestors.push(node);
	    return ancestors;
	  }
	  function d3_layout_bundleLeastCommonAncestor(a, b) {
	    if (a === b) return a;
	    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;
	    while (aNode === bNode) {
	      sharedNode = aNode;
	      aNode = aNodes.pop();
	      bNode = bNodes.pop();
	    }
	    return sharedNode;
	  }
	  d3.layout.chord = function() {
	    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
	    function relayout() {
	      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
	      chords = [];
	      groups = [];
	      k = 0, i = -1;
	      while (++i < n) {
	        x = 0, j = -1;
	        while (++j < n) {
	          x += matrix[i][j];
	        }
	        groupSums.push(x);
	        subgroupIndex.push(d3.range(n));
	        k += x;
	      }
	      if (sortGroups) {
	        groupIndex.sort(function(a, b) {
	          return sortGroups(groupSums[a], groupSums[b]);
	        });
	      }
	      if (sortSubgroups) {
	        subgroupIndex.forEach(function(d, i) {
	          d.sort(function(a, b) {
	            return sortSubgroups(matrix[i][a], matrix[i][b]);
	          });
	        });
	      }
	      k = (τ - padding * n) / k;
	      x = 0, i = -1;
	      while (++i < n) {
	        x0 = x, j = -1;
	        while (++j < n) {
	          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
	          subgroups[di + "-" + dj] = {
	            index: di,
	            subindex: dj,
	            startAngle: a0,
	            endAngle: a1,
	            value: v
	          };
	        }
	        groups[di] = {
	          index: di,
	          startAngle: x0,
	          endAngle: x,
	          value: (x - x0) / k
	        };
	        x += padding;
	      }
	      i = -1;
	      while (++i < n) {
	        j = i - 1;
	        while (++j < n) {
	          var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
	          if (source.value || target.value) {
	            chords.push(source.value < target.value ? {
	              source: target,
	              target: source
	            } : {
	              source: source,
	              target: target
	            });
	          }
	        }
	      }
	      if (sortChords) resort();
	    }
	    function resort() {
	      chords.sort(function(a, b) {
	        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
	      });
	    }
	    chord.matrix = function(x) {
	      if (!arguments.length) return matrix;
	      n = (matrix = x) && matrix.length;
	      chords = groups = null;
	      return chord;
	    };
	    chord.padding = function(x) {
	      if (!arguments.length) return padding;
	      padding = x;
	      chords = groups = null;
	      return chord;
	    };
	    chord.sortGroups = function(x) {
	      if (!arguments.length) return sortGroups;
	      sortGroups = x;
	      chords = groups = null;
	      return chord;
	    };
	    chord.sortSubgroups = function(x) {
	      if (!arguments.length) return sortSubgroups;
	      sortSubgroups = x;
	      chords = null;
	      return chord;
	    };
	    chord.sortChords = function(x) {
	      if (!arguments.length) return sortChords;
	      sortChords = x;
	      if (chords) resort();
	      return chord;
	    };
	    chord.chords = function() {
	      if (!chords) relayout();
	      return chords;
	    };
	    chord.groups = function() {
	      if (!groups) relayout();
	      return groups;
	    };
	    return chord;
	  };
	  d3.layout.force = function() {
	    var force = {}, event = d3.dispatch("start", "tick", "end"), size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [], distances, strengths, charges;
	    function repulse(node) {
	      return function(quad, x1, _, x2) {
	        if (quad.point !== node) {
	          var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;
	          if (dw * dw / theta2 < dn) {
	            if (dn < chargeDistance2) {
	              var k = quad.charge / dn;
	              node.px -= dx * k;
	              node.py -= dy * k;
	            }
	            return true;
	          }
	          if (quad.point && dn && dn < chargeDistance2) {
	            var k = quad.pointCharge / dn;
	            node.px -= dx * k;
	            node.py -= dy * k;
	          }
	        }
	        return !quad.charge;
	      };
	    }
	    force.tick = function() {
	      if ((alpha *= .99) < .005) {
	        event.end({
	          type: "end",
	          alpha: alpha = 0
	        });
	        return true;
	      }
	      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;
	      for (i = 0; i < m; ++i) {
	        o = links[i];
	        s = o.source;
	        t = o.target;
	        x = t.x - s.x;
	        y = t.y - s.y;
	        if (l = x * x + y * y) {
	          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
	          x *= l;
	          y *= l;
	          t.x -= x * (k = s.weight / (t.weight + s.weight));
	          t.y -= y * k;
	          s.x += x * (k = 1 - k);
	          s.y += y * k;
	        }
	      }
	      if (k = alpha * gravity) {
	        x = size[0] / 2;
	        y = size[1] / 2;
	        i = -1;
	        if (k) while (++i < n) {
	          o = nodes[i];
	          o.x += (x - o.x) * k;
	          o.y += (y - o.y) * k;
	        }
	      }
	      if (charge) {
	        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
	        i = -1;
	        while (++i < n) {
	          if (!(o = nodes[i]).fixed) {
	            q.visit(repulse(o));
	          }
	        }
	      }
	      i = -1;
	      while (++i < n) {
	        o = nodes[i];
	        if (o.fixed) {
	          o.x = o.px;
	          o.y = o.py;
	        } else {
	          o.x -= (o.px - (o.px = o.x)) * friction;
	          o.y -= (o.py - (o.py = o.y)) * friction;
	        }
	      }
	      event.tick({
	        type: "tick",
	        alpha: alpha
	      });
	    };
	    force.nodes = function(x) {
	      if (!arguments.length) return nodes;
	      nodes = x;
	      return force;
	    };
	    force.links = function(x) {
	      if (!arguments.length) return links;
	      links = x;
	      return force;
	    };
	    force.size = function(x) {
	      if (!arguments.length) return size;
	      size = x;
	      return force;
	    };
	    force.linkDistance = function(x) {
	      if (!arguments.length) return linkDistance;
	      linkDistance = typeof x === "function" ? x : +x;
	      return force;
	    };
	    force.distance = force.linkDistance;
	    force.linkStrength = function(x) {
	      if (!arguments.length) return linkStrength;
	      linkStrength = typeof x === "function" ? x : +x;
	      return force;
	    };
	    force.friction = function(x) {
	      if (!arguments.length) return friction;
	      friction = +x;
	      return force;
	    };
	    force.charge = function(x) {
	      if (!arguments.length) return charge;
	      charge = typeof x === "function" ? x : +x;
	      return force;
	    };
	    force.chargeDistance = function(x) {
	      if (!arguments.length) return Math.sqrt(chargeDistance2);
	      chargeDistance2 = x * x;
	      return force;
	    };
	    force.gravity = function(x) {
	      if (!arguments.length) return gravity;
	      gravity = +x;
	      return force;
	    };
	    force.theta = function(x) {
	      if (!arguments.length) return Math.sqrt(theta2);
	      theta2 = x * x;
	      return force;
	    };
	    force.alpha = function(x) {
	      if (!arguments.length) return alpha;
	      x = +x;
	      if (alpha) {
	        if (x > 0) alpha = x; else alpha = 0;
	      } else if (x > 0) {
	        event.start({
	          type: "start",
	          alpha: alpha = x
	        });
	        d3.timer(force.tick);
	      }
	      return force;
	    };
	    force.start = function() {
	      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
	      for (i = 0; i < n; ++i) {
	        (o = nodes[i]).index = i;
	        o.weight = 0;
	      }
	      for (i = 0; i < m; ++i) {
	        o = links[i];
	        if (typeof o.source == "number") o.source = nodes[o.source];
	        if (typeof o.target == "number") o.target = nodes[o.target];
	        ++o.source.weight;
	        ++o.target.weight;
	      }
	      for (i = 0; i < n; ++i) {
	        o = nodes[i];
	        if (isNaN(o.x)) o.x = position("x", w);
	        if (isNaN(o.y)) o.y = position("y", h);
	        if (isNaN(o.px)) o.px = o.x;
	        if (isNaN(o.py)) o.py = o.y;
	      }
	      distances = [];
	      if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;
	      strengths = [];
	      if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
	      charges = [];
	      if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;
	      function position(dimension, size) {
	        if (!neighbors) {
	          neighbors = new Array(n);
	          for (j = 0; j < n; ++j) {
	            neighbors[j] = [];
	          }
	          for (j = 0; j < m; ++j) {
	            var o = links[j];
	            neighbors[o.source.index].push(o.target);
	            neighbors[o.target.index].push(o.source);
	          }
	        }
	        var candidates = neighbors[i], j = -1, l = candidates.length, x;
	        while (++j < l) if (!isNaN(x = candidates[j][dimension])) return x;
	        return Math.random() * size;
	      }
	      return force.resume();
	    };
	    force.resume = function() {
	      return force.alpha(.1);
	    };
	    force.stop = function() {
	      return force.alpha(0);
	    };
	    force.drag = function() {
	      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force", d3_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", d3_layout_forceDragend);
	      if (!arguments.length) return drag;
	      this.on("mouseover.force", d3_layout_forceMouseover).on("mouseout.force", d3_layout_forceMouseout).call(drag);
	    };
	    function dragmove(d) {
	      d.px = d3.event.x, d.py = d3.event.y;
	      force.resume();
	    }
	    return d3.rebind(force, event, "on");
	  };
	  function d3_layout_forceDragstart(d) {
	    d.fixed |= 2;
	  }
	  function d3_layout_forceDragend(d) {
	    d.fixed &= ~6;
	  }
	  function d3_layout_forceMouseover(d) {
	    d.fixed |= 4;
	    d.px = d.x, d.py = d.y;
	  }
	  function d3_layout_forceMouseout(d) {
	    d.fixed &= ~4;
	  }
	  function d3_layout_forceAccumulate(quad, alpha, charges) {
	    var cx = 0, cy = 0;
	    quad.charge = 0;
	    if (!quad.leaf) {
	      var nodes = quad.nodes, n = nodes.length, i = -1, c;
	      while (++i < n) {
	        c = nodes[i];
	        if (c == null) continue;
	        d3_layout_forceAccumulate(c, alpha, charges);
	        quad.charge += c.charge;
	        cx += c.charge * c.cx;
	        cy += c.charge * c.cy;
	      }
	    }
	    if (quad.point) {
	      if (!quad.leaf) {
	        quad.point.x += Math.random() - .5;
	        quad.point.y += Math.random() - .5;
	      }
	      var k = alpha * charges[quad.point.index];
	      quad.charge += quad.pointCharge = k;
	      cx += k * quad.point.x;
	      cy += k * quad.point.y;
	    }
	    quad.cx = cx / quad.charge;
	    quad.cy = cy / quad.charge;
	  }
	  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = Infinity;
	  d3.layout.hierarchy = function() {
	    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;
	    function hierarchy(root) {
	      var stack = [ root ], nodes = [], node;
	      root.depth = 0;
	      while ((node = stack.pop()) != null) {
	        nodes.push(node);
	        if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
	          var n, childs, child;
	          while (--n >= 0) {
	            stack.push(child = childs[n]);
	            child.parent = node;
	            child.depth = node.depth + 1;
	          }
	          if (value) node.value = 0;
	          node.children = childs;
	        } else {
	          if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
	          delete node.children;
	        }
	      }
	      d3_layout_hierarchyVisitAfter(root, function(node) {
	        var childs, parent;
	        if (sort && (childs = node.children)) childs.sort(sort);
	        if (value && (parent = node.parent)) parent.value += node.value;
	      });
	      return nodes;
	    }
	    hierarchy.sort = function(x) {
	      if (!arguments.length) return sort;
	      sort = x;
	      return hierarchy;
	    };
	    hierarchy.children = function(x) {
	      if (!arguments.length) return children;
	      children = x;
	      return hierarchy;
	    };
	    hierarchy.value = function(x) {
	      if (!arguments.length) return value;
	      value = x;
	      return hierarchy;
	    };
	    hierarchy.revalue = function(root) {
	      if (value) {
	        d3_layout_hierarchyVisitBefore(root, function(node) {
	          if (node.children) node.value = 0;
	        });
	        d3_layout_hierarchyVisitAfter(root, function(node) {
	          var parent;
	          if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
	          if (parent = node.parent) parent.value += node.value;
	        });
	      }
	      return root;
	    };
	    return hierarchy;
	  };
	  function d3_layout_hierarchyRebind(object, hierarchy) {
	    d3.rebind(object, hierarchy, "sort", "children", "value");
	    object.nodes = object;
	    object.links = d3_layout_hierarchyLinks;
	    return object;
	  }
	  function d3_layout_hierarchyVisitBefore(node, callback) {
	    var nodes = [ node ];
	    while ((node = nodes.pop()) != null) {
	      callback(node);
	      if ((children = node.children) && (n = children.length)) {
	        var n, children;
	        while (--n >= 0) nodes.push(children[n]);
	      }
	    }
	  }
	  function d3_layout_hierarchyVisitAfter(node, callback) {
	    var nodes = [ node ], nodes2 = [];
	    while ((node = nodes.pop()) != null) {
	      nodes2.push(node);
	      if ((children = node.children) && (n = children.length)) {
	        var i = -1, n, children;
	        while (++i < n) nodes.push(children[i]);
	      }
	    }
	    while ((node = nodes2.pop()) != null) {
	      callback(node);
	    }
	  }
	  function d3_layout_hierarchyChildren(d) {
	    return d.children;
	  }
	  function d3_layout_hierarchyValue(d) {
	    return d.value;
	  }
	  function d3_layout_hierarchySort(a, b) {
	    return b.value - a.value;
	  }
	  function d3_layout_hierarchyLinks(nodes) {
	    return d3.merge(nodes.map(function(parent) {
	      return (parent.children || []).map(function(child) {
	        return {
	          source: parent,
	          target: child
	        };
	      });
	    }));
	  }
	  d3.layout.partition = function() {
	    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];
	    function position(node, x, dx, dy) {
	      var children = node.children;
	      node.x = x;
	      node.y = node.depth * dy;
	      node.dx = dx;
	      node.dy = dy;
	      if (children && (n = children.length)) {
	        var i = -1, n, c, d;
	        dx = node.value ? dx / node.value : 0;
	        while (++i < n) {
	          position(c = children[i], x, d = c.value * dx, dy);
	          x += d;
	        }
	      }
	    }
	    function depth(node) {
	      var children = node.children, d = 0;
	      if (children && (n = children.length)) {
	        var i = -1, n;
	        while (++i < n) d = Math.max(d, depth(children[i]));
	      }
	      return 1 + d;
	    }
	    function partition(d, i) {
	      var nodes = hierarchy.call(this, d, i);
	      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
	      return nodes;
	    }
	    partition.size = function(x) {
	      if (!arguments.length) return size;
	      size = x;
	      return partition;
	    };
	    return d3_layout_hierarchyRebind(partition, hierarchy);
	  };
	  d3.layout.pie = function() {
	    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ, padAngle = 0;
	    function pie(data) {
	      var n = data.length, values = data.map(function(d, i) {
	        return +value.call(pie, d, i);
	      }), a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle), da = (typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - a, p = Math.min(Math.abs(da) / n, +(typeof padAngle === "function" ? padAngle.apply(this, arguments) : padAngle)), pa = p * (da < 0 ? -1 : 1), k = (da - n * pa) / d3.sum(values), index = d3.range(n), arcs = [], v;
	      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {
	        return values[j] - values[i];
	      } : function(i, j) {
	        return sort(data[i], data[j]);
	      });
	      index.forEach(function(i) {
	        arcs[i] = {
	          data: data[i],
	          value: v = values[i],
	          startAngle: a,
	          endAngle: a += v * k + pa,
	          padAngle: p
	        };
	      });
	      return arcs;
	    }
	    pie.value = function(_) {
	      if (!arguments.length) return value;
	      value = _;
	      return pie;
	    };
	    pie.sort = function(_) {
	      if (!arguments.length) return sort;
	      sort = _;
	      return pie;
	    };
	    pie.startAngle = function(_) {
	      if (!arguments.length) return startAngle;
	      startAngle = _;
	      return pie;
	    };
	    pie.endAngle = function(_) {
	      if (!arguments.length) return endAngle;
	      endAngle = _;
	      return pie;
	    };
	    pie.padAngle = function(_) {
	      if (!arguments.length) return padAngle;
	      padAngle = _;
	      return pie;
	    };
	    return pie;
	  };
	  var d3_layout_pieSortByValue = {};
	  d3.layout.stack = function() {
	    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;
	    function stack(data, index) {
	      if (!(n = data.length)) return data;
	      var series = data.map(function(d, i) {
	        return values.call(stack, d, i);
	      });
	      var points = series.map(function(d) {
	        return d.map(function(v, i) {
	          return [ x.call(stack, v, i), y.call(stack, v, i) ];
	        });
	      });
	      var orders = order.call(stack, points, index);
	      series = d3.permute(series, orders);
	      points = d3.permute(points, orders);
	      var offsets = offset.call(stack, points, index);
	      var m = series[0].length, n, i, j, o;
	      for (j = 0; j < m; ++j) {
	        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
	        for (i = 1; i < n; ++i) {
	          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
	        }
	      }
	      return data;
	    }
	    stack.values = function(x) {
	      if (!arguments.length) return values;
	      values = x;
	      return stack;
	    };
	    stack.order = function(x) {
	      if (!arguments.length) return order;
	      order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
	      return stack;
	    };
	    stack.offset = function(x) {
	      if (!arguments.length) return offset;
	      offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
	      return stack;
	    };
	    stack.x = function(z) {
	      if (!arguments.length) return x;
	      x = z;
	      return stack;
	    };
	    stack.y = function(z) {
	      if (!arguments.length) return y;
	      y = z;
	      return stack;
	    };
	    stack.out = function(z) {
	      if (!arguments.length) return out;
	      out = z;
	      return stack;
	    };
	    return stack;
	  };
	  function d3_layout_stackX(d) {
	    return d.x;
	  }
	  function d3_layout_stackY(d) {
	    return d.y;
	  }
	  function d3_layout_stackOut(d, y0, y) {
	    d.y0 = y0;
	    d.y = y;
	  }
	  var d3_layout_stackOrders = d3.map({
	    "inside-out": function(data) {
	      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {
	        return max[a] - max[b];
	      }), top = 0, bottom = 0, tops = [], bottoms = [];
	      for (i = 0; i < n; ++i) {
	        j = index[i];
	        if (top < bottom) {
	          top += sums[j];
	          tops.push(j);
	        } else {
	          bottom += sums[j];
	          bottoms.push(j);
	        }
	      }
	      return bottoms.reverse().concat(tops);
	    },
	    reverse: function(data) {
	      return d3.range(data.length).reverse();
	    },
	    "default": d3_layout_stackOrderDefault
	  });
	  var d3_layout_stackOffsets = d3.map({
	    silhouette: function(data) {
	      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];
	      for (j = 0; j < m; ++j) {
	        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
	        if (o > max) max = o;
	        sums.push(o);
	      }
	      for (j = 0; j < m; ++j) {
	        y0[j] = (max - sums[j]) / 2;
	      }
	      return y0;
	    },
	    wiggle: function(data) {
	      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];
	      y0[0] = o = o0 = 0;
	      for (j = 1; j < m; ++j) {
	        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];
	        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
	          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
	            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
	          }
	          s2 += s3 * data[i][j][1];
	        }
	        y0[j] = o -= s1 ? s2 / s1 * dx : 0;
	        if (o < o0) o0 = o;
	      }
	      for (j = 0; j < m; ++j) y0[j] -= o0;
	      return y0;
	    },
	    expand: function(data) {
	      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];
	      for (j = 0; j < m; ++j) {
	        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
	        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;
	      }
	      for (j = 0; j < m; ++j) y0[j] = 0;
	      return y0;
	    },
	    zero: d3_layout_stackOffsetZero
	  });
	  function d3_layout_stackOrderDefault(data) {
	    return d3.range(data.length);
	  }
	  function d3_layout_stackOffsetZero(data) {
	    var j = -1, m = data[0].length, y0 = [];
	    while (++j < m) y0[j] = 0;
	    return y0;
	  }
	  function d3_layout_stackMaxIndex(array) {
	    var i = 1, j = 0, v = array[0][1], k, n = array.length;
	    for (;i < n; ++i) {
	      if ((k = array[i][1]) > v) {
	        j = i;
	        v = k;
	      }
	    }
	    return j;
	  }
	  function d3_layout_stackReduceSum(d) {
	    return d.reduce(d3_layout_stackSum, 0);
	  }
	  function d3_layout_stackSum(p, d) {
	    return p + d[1];
	  }
	  d3.layout.histogram = function() {
	    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;
	    function histogram(data, i) {
	      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;
	      while (++i < m) {
	        bin = bins[i] = [];
	        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);
	        bin.y = 0;
	      }
	      if (m > 0) {
	        i = -1;
	        while (++i < n) {
	          x = values[i];
	          if (x >= range[0] && x <= range[1]) {
	            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];
	            bin.y += k;
	            bin.push(data[i]);
	          }
	        }
	      }
	      return bins;
	    }
	    histogram.value = function(x) {
	      if (!arguments.length) return valuer;
	      valuer = x;
	      return histogram;
	    };
	    histogram.range = function(x) {
	      if (!arguments.length) return ranger;
	      ranger = d3_functor(x);
	      return histogram;
	    };
	    histogram.bins = function(x) {
	      if (!arguments.length) return binner;
	      binner = typeof x === "number" ? function(range) {
	        return d3_layout_histogramBinFixed(range, x);
	      } : d3_functor(x);
	      return histogram;
	    };
	    histogram.frequency = function(x) {
	      if (!arguments.length) return frequency;
	      frequency = !!x;
	      return histogram;
	    };
	    return histogram;
	  };
	  function d3_layout_histogramBinSturges(range, values) {
	    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));
	  }
	  function d3_layout_histogramBinFixed(range, n) {
	    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];
	    while (++x <= n) f[x] = m * x + b;
	    return f;
	  }
	  function d3_layout_histogramRange(values) {
	    return [ d3.min(values), d3.max(values) ];
	  }
	  d3.layout.pack = function() {
	    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;
	    function pack(d, i) {
	      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function() {
	        return radius;
	      };
	      root.x = root.y = 0;
	      d3_layout_hierarchyVisitAfter(root, function(d) {
	        d.r = +r(d.value);
	      });
	      d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
	      if (padding) {
	        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
	        d3_layout_hierarchyVisitAfter(root, function(d) {
	          d.r += dr;
	        });
	        d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
	        d3_layout_hierarchyVisitAfter(root, function(d) {
	          d.r -= dr;
	        });
	      }
	      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));
	      return nodes;
	    }
	    pack.size = function(_) {
	      if (!arguments.length) return size;
	      size = _;
	      return pack;
	    };
	    pack.radius = function(_) {
	      if (!arguments.length) return radius;
	      radius = _ == null || typeof _ === "function" ? _ : +_;
	      return pack;
	    };
	    pack.padding = function(_) {
	      if (!arguments.length) return padding;
	      padding = +_;
	      return pack;
	    };
	    return d3_layout_hierarchyRebind(pack, hierarchy);
	  };
	  function d3_layout_packSort(a, b) {
	    return a.value - b.value;
	  }
	  function d3_layout_packInsert(a, b) {
	    var c = a._pack_next;
	    a._pack_next = b;
	    b._pack_prev = a;
	    b._pack_next = c;
	    c._pack_prev = b;
	  }
	  function d3_layout_packSplice(a, b) {
	    a._pack_next = b;
	    b._pack_prev = a;
	  }
	  function d3_layout_packIntersects(a, b) {
	    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;
	    return .999 * dr * dr > dx * dx + dy * dy;
	  }
	  function d3_layout_packSiblings(node) {
	    if (!(nodes = node.children) || !(n = nodes.length)) return;
	    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;
	    function bound(node) {
	      xMin = Math.min(node.x - node.r, xMin);
	      xMax = Math.max(node.x + node.r, xMax);
	      yMin = Math.min(node.y - node.r, yMin);
	      yMax = Math.max(node.y + node.r, yMax);
	    }
	    nodes.forEach(d3_layout_packLink);
	    a = nodes[0];
	    a.x = -a.r;
	    a.y = 0;
	    bound(a);
	    if (n > 1) {
	      b = nodes[1];
	      b.x = b.r;
	      b.y = 0;
	      bound(b);
	      if (n > 2) {
	        c = nodes[2];
	        d3_layout_packPlace(a, b, c);
	        bound(c);
	        d3_layout_packInsert(a, c);
	        a._pack_prev = c;
	        d3_layout_packInsert(c, b);
	        b = a._pack_next;
	        for (i = 3; i < n; i++) {
	          d3_layout_packPlace(a, b, c = nodes[i]);
	          var isect = 0, s1 = 1, s2 = 1;
	          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
	            if (d3_layout_packIntersects(j, c)) {
	              isect = 1;
	              break;
	            }
	          }
	          if (isect == 1) {
	            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
	              if (d3_layout_packIntersects(k, c)) {
	                break;
	              }
	            }
	          }
	          if (isect) {
	            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);
	            i--;
	          } else {
	            d3_layout_packInsert(a, c);
	            b = c;
	            bound(c);
	          }
	        }
	      }
	    }
	    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;
	    for (i = 0; i < n; i++) {
	      c = nodes[i];
	      c.x -= cx;
	      c.y -= cy;
	      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));
	    }
	    node.r = cr;
	    nodes.forEach(d3_layout_packUnlink);
	  }
	  function d3_layout_packLink(node) {
	    node._pack_next = node._pack_prev = node;
	  }
	  function d3_layout_packUnlink(node) {
	    delete node._pack_next;
	    delete node._pack_prev;
	  }
	  function d3_layout_packTransform(node, x, y, k) {
	    var children = node.children;
	    node.x = x += k * node.x;
	    node.y = y += k * node.y;
	    node.r *= k;
	    if (children) {
	      var i = -1, n = children.length;
	      while (++i < n) d3_layout_packTransform(children[i], x, y, k);
	    }
	  }
	  function d3_layout_packPlace(a, b, c) {
	    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;
	    if (db && (dx || dy)) {
	      var da = b.r + c.r, dc = dx * dx + dy * dy;
	      da *= da;
	      db *= db;
	      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
	      c.x = a.x + x * dx + y * dy;
	      c.y = a.y + x * dy - y * dx;
	    } else {
	      c.x = a.x + db;
	      c.y = a.y;
	    }
	  }
	  d3.layout.tree = function() {
	    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = null;
	    function tree(d, i) {
	      var nodes = hierarchy.call(this, d, i), root0 = nodes[0], root1 = wrapTree(root0);
	      d3_layout_hierarchyVisitAfter(root1, firstWalk), root1.parent.m = -root1.z;
	      d3_layout_hierarchyVisitBefore(root1, secondWalk);
	      if (nodeSize) d3_layout_hierarchyVisitBefore(root0, sizeNode); else {
	        var left = root0, right = root0, bottom = root0;
	        d3_layout_hierarchyVisitBefore(root0, function(node) {
	          if (node.x < left.x) left = node;
	          if (node.x > right.x) right = node;
	          if (node.depth > bottom.depth) bottom = node;
	        });
	        var tx = separation(left, right) / 2 - left.x, kx = size[0] / (right.x + separation(right, left) / 2 + tx), ky = size[1] / (bottom.depth || 1);
	        d3_layout_hierarchyVisitBefore(root0, function(node) {
	          node.x = (node.x + tx) * kx;
	          node.y = node.depth * ky;
	        });
	      }
	      return nodes;
	    }
	    function wrapTree(root0) {
	      var root1 = {
	        A: null,
	        children: [ root0 ]
	      }, queue = [ root1 ], node1;
	      while ((node1 = queue.pop()) != null) {
	        for (var children = node1.children, child, i = 0, n = children.length; i < n; ++i) {
	          queue.push((children[i] = child = {
	            _: children[i],
	            parent: node1,
	            children: (child = children[i].children) && child.slice() || [],
	            A: null,
	            a: null,
	            z: 0,
	            m: 0,
	            c: 0,
	            s: 0,
	            t: null,
	            i: i
	          }).a = child);
	        }
	      }
	      return root1.children[0];
	    }
	    function firstWalk(v) {
	      var children = v.children, siblings = v.parent.children, w = v.i ? siblings[v.i - 1] : null;
	      if (children.length) {
	        d3_layout_treeShift(v);
	        var midpoint = (children[0].z + children[children.length - 1].z) / 2;
	        if (w) {
	          v.z = w.z + separation(v._, w._);
	          v.m = v.z - midpoint;
	        } else {
	          v.z = midpoint;
	        }
	      } else if (w) {
	        v.z = w.z + separation(v._, w._);
	      }
	      v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
	    }
	    function secondWalk(v) {
	      v._.x = v.z + v.parent.m;
	      v.m += v.parent.m;
	    }
	    function apportion(v, w, ancestor) {
	      if (w) {
	        var vip = v, vop = v, vim = w, vom = vip.parent.children[0], sip = vip.m, sop = vop.m, sim = vim.m, som = vom.m, shift;
	        while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
	          vom = d3_layout_treeLeft(vom);
	          vop = d3_layout_treeRight(vop);
	          vop.a = v;
	          shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
	          if (shift > 0) {
	            d3_layout_treeMove(d3_layout_treeAncestor(vim, v, ancestor), v, shift);
	            sip += shift;
	            sop += shift;
	          }
	          sim += vim.m;
	          sip += vip.m;
	          som += vom.m;
	          sop += vop.m;
	        }
	        if (vim && !d3_layout_treeRight(vop)) {
	          vop.t = vim;
	          vop.m += sim - sop;
	        }
	        if (vip && !d3_layout_treeLeft(vom)) {
	          vom.t = vip;
	          vom.m += sip - som;
	          ancestor = v;
	        }
	      }
	      return ancestor;
	    }
	    function sizeNode(node) {
	      node.x *= size[0];
	      node.y = node.depth * size[1];
	    }
	    tree.separation = function(x) {
	      if (!arguments.length) return separation;
	      separation = x;
	      return tree;
	    };
	    tree.size = function(x) {
	      if (!arguments.length) return nodeSize ? null : size;
	      nodeSize = (size = x) == null ? sizeNode : null;
	      return tree;
	    };
	    tree.nodeSize = function(x) {
	      if (!arguments.length) return nodeSize ? size : null;
	      nodeSize = (size = x) == null ? null : sizeNode;
	      return tree;
	    };
	    return d3_layout_hierarchyRebind(tree, hierarchy);
	  };
	  function d3_layout_treeSeparation(a, b) {
	    return a.parent == b.parent ? 1 : 2;
	  }
	  function d3_layout_treeLeft(v) {
	    var children = v.children;
	    return children.length ? children[0] : v.t;
	  }
	  function d3_layout_treeRight(v) {
	    var children = v.children, n;
	    return (n = children.length) ? children[n - 1] : v.t;
	  }
	  function d3_layout_treeMove(wm, wp, shift) {
	    var change = shift / (wp.i - wm.i);
	    wp.c -= change;
	    wp.s += shift;
	    wm.c += change;
	    wp.z += shift;
	    wp.m += shift;
	  }
	  function d3_layout_treeShift(v) {
	    var shift = 0, change = 0, children = v.children, i = children.length, w;
	    while (--i >= 0) {
	      w = children[i];
	      w.z += shift;
	      w.m += shift;
	      shift += w.s + (change += w.c);
	    }
	  }
	  function d3_layout_treeAncestor(vim, v, ancestor) {
	    return vim.a.parent === v.parent ? vim.a : ancestor;
	  }
	  d3.layout.cluster = function() {
	    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;
	    function cluster(d, i) {
	      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;
	      d3_layout_hierarchyVisitAfter(root, function(node) {
	        var children = node.children;
	        if (children && children.length) {
	          node.x = d3_layout_clusterX(children);
	          node.y = d3_layout_clusterY(children);
	        } else {
	          node.x = previousNode ? x += separation(node, previousNode) : 0;
	          node.y = 0;
	          previousNode = node;
	        }
	      });
	      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;
	      d3_layout_hierarchyVisitAfter(root, nodeSize ? function(node) {
	        node.x = (node.x - root.x) * size[0];
	        node.y = (root.y - node.y) * size[1];
	      } : function(node) {
	        node.x = (node.x - x0) / (x1 - x0) * size[0];
	        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];
	      });
	      return nodes;
	    }
	    cluster.separation = function(x) {
	      if (!arguments.length) return separation;
	      separation = x;
	      return cluster;
	    };
	    cluster.size = function(x) {
	      if (!arguments.length) return nodeSize ? null : size;
	      nodeSize = (size = x) == null;
	      return cluster;
	    };
	    cluster.nodeSize = function(x) {
	      if (!arguments.length) return nodeSize ? size : null;
	      nodeSize = (size = x) != null;
	      return cluster;
	    };
	    return d3_layout_hierarchyRebind(cluster, hierarchy);
	  };
	  function d3_layout_clusterY(children) {
	    return 1 + d3.max(children, function(child) {
	      return child.y;
	    });
	  }
	  function d3_layout_clusterX(children) {
	    return children.reduce(function(x, child) {
	      return x + child.x;
	    }, 0) / children.length;
	  }
	  function d3_layout_clusterLeft(node) {
	    var children = node.children;
	    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;
	  }
	  function d3_layout_clusterRight(node) {
	    var children = node.children, n;
	    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;
	  }
	  d3.layout.treemap = function() {
	    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = "squarify", ratio = .5 * (1 + Math.sqrt(5));
	    function scale(children, k) {
	      var i = -1, n = children.length, child, area;
	      while (++i < n) {
	        area = (child = children[i]).value * (k < 0 ? 0 : k);
	        child.area = isNaN(area) || area <= 0 ? 0 : area;
	      }
	    }
	    function squarify(node) {
	      var children = node.children;
	      if (children && children.length) {
	        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === "slice" ? rect.dx : mode === "dice" ? rect.dy : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;
	        scale(remaining, rect.dx * rect.dy / node.value);
	        row.area = 0;
	        while ((n = remaining.length) > 0) {
	          row.push(child = remaining[n - 1]);
	          row.area += child.area;
	          if (mode !== "squarify" || (score = worst(row, u)) <= best) {
	            remaining.pop();
	            best = score;
	          } else {
	            row.area -= row.pop().area;
	            position(row, u, rect, false);
	            u = Math.min(rect.dx, rect.dy);
	            row.length = row.area = 0;
	            best = Infinity;
	          }
	        }
	        if (row.length) {
	          position(row, u, rect, true);
	          row.length = row.area = 0;
	        }
	        children.forEach(squarify);
	      }
	    }
	    function stickify(node) {
	      var children = node.children;
	      if (children && children.length) {
	        var rect = pad(node), remaining = children.slice(), child, row = [];
	        scale(remaining, rect.dx * rect.dy / node.value);
	        row.area = 0;
	        while (child = remaining.pop()) {
	          row.push(child);
	          row.area += child.area;
	          if (child.z != null) {
	            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
	            row.length = row.area = 0;
	          }
	        }
	        children.forEach(stickify);
	      }
	    }
	    function worst(row, u) {
	      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;
	      while (++i < n) {
	        if (!(r = row[i].area)) continue;
	        if (r < rmin) rmin = r;
	        if (r > rmax) rmax = r;
	      }
	      s *= s;
	      u *= u;
	      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
	    }
	    function position(row, u, rect, flush) {
	      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;
	      if (u == rect.dx) {
	        if (flush || v > rect.dy) v = rect.dy;
	        while (++i < n) {
	          o = row[i];
	          o.x = x;
	          o.y = y;
	          o.dy = v;
	          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
	        }
	        o.z = true;
	        o.dx += rect.x + rect.dx - x;
	        rect.y += v;
	        rect.dy -= v;
	      } else {
	        if (flush || v > rect.dx) v = rect.dx;
	        while (++i < n) {
	          o = row[i];
	          o.x = x;
	          o.y = y;
	          o.dx = v;
	          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
	        }
	        o.z = false;
	        o.dy += rect.y + rect.dy - y;
	        rect.x += v;
	        rect.dx -= v;
	      }
	    }
	    function treemap(d) {
	      var nodes = stickies || hierarchy(d), root = nodes[0];
	      root.x = 0;
	      root.y = 0;
	      root.dx = size[0];
	      root.dy = size[1];
	      if (stickies) hierarchy.revalue(root);
	      scale([ root ], root.dx * root.dy / root.value);
	      (stickies ? stickify : squarify)(root);
	      if (sticky) stickies = nodes;
	      return nodes;
	    }
	    treemap.size = function(x) {
	      if (!arguments.length) return size;
	      size = x;
	      return treemap;
	    };
	    treemap.padding = function(x) {
	      if (!arguments.length) return padding;
	      function padFunction(node) {
	        var p = x.call(treemap, node, node.depth);
	        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === "number" ? [ p, p, p, p ] : p);
	      }
	      function padConstant(node) {
	        return d3_layout_treemapPad(node, x);
	      }
	      var type;
	      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === "function" ? padFunction : type === "number" ? (x = [ x, x, x, x ], 
	      padConstant) : padConstant;
	      return treemap;
	    };
	    treemap.round = function(x) {
	      if (!arguments.length) return round != Number;
	      round = x ? Math.round : Number;
	      return treemap;
	    };
	    treemap.sticky = function(x) {
	      if (!arguments.length) return sticky;
	      sticky = x;
	      stickies = null;
	      return treemap;
	    };
	    treemap.ratio = function(x) {
	      if (!arguments.length) return ratio;
	      ratio = x;
	      return treemap;
	    };
	    treemap.mode = function(x) {
	      if (!arguments.length) return mode;
	      mode = x + "";
	      return treemap;
	    };
	    return d3_layout_hierarchyRebind(treemap, hierarchy);
	  };
	  function d3_layout_treemapPadNull(node) {
	    return {
	      x: node.x,
	      y: node.y,
	      dx: node.dx,
	      dy: node.dy
	    };
	  }
	  function d3_layout_treemapPad(node, padding) {
	    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];
	    if (dx < 0) {
	      x += dx / 2;
	      dx = 0;
	    }
	    if (dy < 0) {
	      y += dy / 2;
	      dy = 0;
	    }
	    return {
	      x: x,
	      y: y,
	      dx: dx,
	      dy: dy
	    };
	  }
	  d3.random = {
	    normal: function(µ, σ) {
	      var n = arguments.length;
	      if (n < 2) σ = 1;
	      if (n < 1) µ = 0;
	      return function() {
	        var x, y, r;
	        do {
	          x = Math.random() * 2 - 1;
	          y = Math.random() * 2 - 1;
	          r = x * x + y * y;
	        } while (!r || r > 1);
	        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);
	      };
	    },
	    logNormal: function() {
	      var random = d3.random.normal.apply(d3, arguments);
	      return function() {
	        return Math.exp(random());
	      };
	    },
	    bates: function(m) {
	      var random = d3.random.irwinHall(m);
	      return function() {
	        return random() / m;
	      };
	    },
	    irwinHall: function(m) {
	      return function() {
	        for (var s = 0, j = 0; j < m; j++) s += Math.random();
	        return s;
	      };
	    }
	  };
	  d3.scale = {};
	  function d3_scaleExtent(domain) {
	    var start = domain[0], stop = domain[domain.length - 1];
	    return start < stop ? [ start, stop ] : [ stop, start ];
	  }
	  function d3_scaleRange(scale) {
	    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
	  }
	  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
	    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);
	    return function(x) {
	      return i(u(x));
	    };
	  }
	  function d3_scale_nice(domain, nice) {
	    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;
	    if (x1 < x0) {
	      dx = i0, i0 = i1, i1 = dx;
	      dx = x0, x0 = x1, x1 = dx;
	    }
	    domain[i0] = nice.floor(x0);
	    domain[i1] = nice.ceil(x1);
	    return domain;
	  }
	  function d3_scale_niceStep(step) {
	    return step ? {
	      floor: function(x) {
	        return Math.floor(x / step) * step;
	      },
	      ceil: function(x) {
	        return Math.ceil(x / step) * step;
	      }
	    } : d3_scale_niceIdentity;
	  }
	  var d3_scale_niceIdentity = {
	    floor: d3_identity,
	    ceil: d3_identity
	  };
	  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
	    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;
	    if (domain[k] < domain[0]) {
	      domain = domain.slice().reverse();
	      range = range.slice().reverse();
	    }
	    while (++j <= k) {
	      u.push(uninterpolate(domain[j - 1], domain[j]));
	      i.push(interpolate(range[j - 1], range[j]));
	    }
	    return function(x) {
	      var j = d3.bisect(domain, x, 1, k) - 1;
	      return i[j](u[j](x));
	    };
	  }
	  d3.scale.linear = function() {
	    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);
	  };
	  function d3_scale_linear(domain, range, interpolate, clamp) {
	    var output, input;
	    function rescale() {
	      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
	      output = linear(domain, range, uninterpolate, interpolate);
	      input = linear(range, domain, uninterpolate, d3_interpolate);
	      return scale;
	    }
	    function scale(x) {
	      return output(x);
	    }
	    scale.invert = function(y) {
	      return input(y);
	    };
	    scale.domain = function(x) {
	      if (!arguments.length) return domain;
	      domain = x.map(Number);
	      return rescale();
	    };
	    scale.range = function(x) {
	      if (!arguments.length) return range;
	      range = x;
	      return rescale();
	    };
	    scale.rangeRound = function(x) {
	      return scale.range(x).interpolate(d3_interpolateRound);
	    };
	    scale.clamp = function(x) {
	      if (!arguments.length) return clamp;
	      clamp = x;
	      return rescale();
	    };
	    scale.interpolate = function(x) {
	      if (!arguments.length) return interpolate;
	      interpolate = x;
	      return rescale();
	    };
	    scale.ticks = function(m) {
	      return d3_scale_linearTicks(domain, m);
	    };
	    scale.tickFormat = function(m, format) {
	      return d3_scale_linearTickFormat(domain, m, format);
	    };
	    scale.nice = function(m) {
	      d3_scale_linearNice(domain, m);
	      return rescale();
	    };
	    scale.copy = function() {
	      return d3_scale_linear(domain, range, interpolate, clamp);
	    };
	    return rescale();
	  }
	  function d3_scale_linearRebind(scale, linear) {
	    return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
	  }
	  function d3_scale_linearNice(domain, m) {
	    return d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
	  }
	  function d3_scale_linearTickRange(domain, m) {
	    if (m == null) m = 10;
	    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
	    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;
	    extent[0] = Math.ceil(extent[0] / step) * step;
	    extent[1] = Math.floor(extent[1] / step) * step + step * .5;
	    extent[2] = step;
	    return extent;
	  }
	  function d3_scale_linearTicks(domain, m) {
	    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
	  }
	  function d3_scale_linearTickFormat(domain, m, format) {
	    var range = d3_scale_linearTickRange(domain, m);
	    if (format) {
	      var match = d3_format_re.exec(format);
	      match.shift();
	      if (match[8] === "s") {
	        var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
	        if (!match[7]) match[7] = "." + d3_scale_linearPrecision(prefix.scale(range[2]));
	        match[8] = "f";
	        format = d3.format(match.join(""));
	        return function(d) {
	          return format(prefix.scale(d)) + prefix.symbol;
	        };
	      }
	      if (!match[7]) match[7] = "." + d3_scale_linearFormatPrecision(match[8], range);
	      format = match.join("");
	    } else {
	      format = ",." + d3_scale_linearPrecision(range[2]) + "f";
	    }
	    return d3.format(format);
	  }
	  var d3_scale_linearFormatSignificant = {
	    s: 1,
	    g: 1,
	    p: 1,
	    r: 1,
	    e: 1
	  };
	  function d3_scale_linearPrecision(value) {
	    return -Math.floor(Math.log(value) / Math.LN10 + .01);
	  }
	  function d3_scale_linearFormatPrecision(type, range) {
	    var p = d3_scale_linearPrecision(range[2]);
	    return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== "e") : p - (type === "%") * 2;
	  }
	  d3.scale.log = function() {
	    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);
	  };
	  function d3_scale_log(linear, base, positive, domain) {
	    function log(x) {
	      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);
	    }
	    function pow(x) {
	      return positive ? Math.pow(base, x) : -Math.pow(base, -x);
	    }
	    function scale(x) {
	      return linear(log(x));
	    }
	    scale.invert = function(x) {
	      return pow(linear.invert(x));
	    };
	    scale.domain = function(x) {
	      if (!arguments.length) return domain;
	      positive = x[0] >= 0;
	      linear.domain((domain = x.map(Number)).map(log));
	      return scale;
	    };
	    scale.base = function(_) {
	      if (!arguments.length) return base;
	      base = +_;
	      linear.domain(domain.map(log));
	      return scale;
	    };
	    scale.nice = function() {
	      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);
	      linear.domain(niced);
	      domain = niced.map(pow);
	      return scale;
	    };
	    scale.ticks = function() {
	      var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;
	      if (isFinite(j - i)) {
	        if (positive) {
	          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);
	          ticks.push(pow(i));
	        } else {
	          ticks.push(pow(i));
	          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);
	        }
	        for (i = 0; ticks[i] < u; i++) {}
	        for (j = ticks.length; ticks[j - 1] > v; j--) {}
	        ticks = ticks.slice(i, j);
	      }
	      return ticks;
	    };
	    scale.tickFormat = function(n, format) {
	      if (!arguments.length) return d3_scale_logFormat;
	      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== "function") format = d3.format(format);
	      var k = Math.max(.1, n / scale.ticks().length), f = positive ? (e = 1e-12, Math.ceil) : (e = -1e-12, 
	      Math.floor), e;
	      return function(d) {
	        return d / pow(f(log(d) + e)) <= k ? format(d) : "";
	      };
	    };
	    scale.copy = function() {
	      return d3_scale_log(linear.copy(), base, positive, domain);
	    };
	    return d3_scale_linearRebind(scale, linear);
	  }
	  var d3_scale_logFormat = d3.format(".0e"), d3_scale_logNiceNegative = {
	    floor: function(x) {
	      return -Math.ceil(-x);
	    },
	    ceil: function(x) {
	      return -Math.floor(-x);
	    }
	  };
	  d3.scale.pow = function() {
	    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);
	  };
	  function d3_scale_pow(linear, exponent, domain) {
	    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);
	    function scale(x) {
	      return linear(powp(x));
	    }
	    scale.invert = function(x) {
	      return powb(linear.invert(x));
	    };
	    scale.domain = function(x) {
	      if (!arguments.length) return domain;
	      linear.domain((domain = x.map(Number)).map(powp));
	      return scale;
	    };
	    scale.ticks = function(m) {
	      return d3_scale_linearTicks(domain, m);
	    };
	    scale.tickFormat = function(m, format) {
	      return d3_scale_linearTickFormat(domain, m, format);
	    };
	    scale.nice = function(m) {
	      return scale.domain(d3_scale_linearNice(domain, m));
	    };
	    scale.exponent = function(x) {
	      if (!arguments.length) return exponent;
	      powp = d3_scale_powPow(exponent = x);
	      powb = d3_scale_powPow(1 / exponent);
	      linear.domain(domain.map(powp));
	      return scale;
	    };
	    scale.copy = function() {
	      return d3_scale_pow(linear.copy(), exponent, domain);
	    };
	    return d3_scale_linearRebind(scale, linear);
	  }
	  function d3_scale_powPow(e) {
	    return function(x) {
	      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);
	    };
	  }
	  d3.scale.sqrt = function() {
	    return d3.scale.pow().exponent(.5);
	  };
	  d3.scale.ordinal = function() {
	    return d3_scale_ordinal([], {
	      t: "range",
	      a: [ [] ]
	    });
	  };
	  function d3_scale_ordinal(domain, ranger) {
	    var index, range, rangeBand;
	    function scale(x) {
	      return range[((index.get(x) || (ranger.t === "range" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];
	    }
	    function steps(start, step) {
	      return d3.range(domain.length).map(function(i) {
	        return start + step * i;
	      });
	    }
	    scale.domain = function(x) {
	      if (!arguments.length) return domain;
	      domain = [];
	      index = new d3_Map();
	      var i = -1, n = x.length, xi;
	      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
	      return scale[ranger.t].apply(scale, ranger.a);
	    };
	    scale.range = function(x) {
	      if (!arguments.length) return range;
	      range = x;
	      rangeBand = 0;
	      ranger = {
	        t: "range",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangePoints = function(x, padding) {
	      if (arguments.length < 2) padding = 0;
	      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = (start + stop) / 2, 
	      0) : (stop - start) / (domain.length - 1 + padding);
	      range = steps(start + step * padding / 2, step);
	      rangeBand = 0;
	      ranger = {
	        t: "rangePoints",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeRoundPoints = function(x, padding) {
	      if (arguments.length < 2) padding = 0;
	      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 
	      0) : (stop - start) / (domain.length - 1 + padding) | 0;
	      range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
	      rangeBand = 0;
	      ranger = {
	        t: "rangeRoundPoints",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeBands = function(x, padding, outerPadding) {
	      if (arguments.length < 2) padding = 0;
	      if (arguments.length < 3) outerPadding = padding;
	      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
	      range = steps(start + step * outerPadding, step);
	      if (reverse) range.reverse();
	      rangeBand = step * (1 - padding);
	      ranger = {
	        t: "rangeBands",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeRoundBands = function(x, padding, outerPadding) {
	      if (arguments.length < 2) padding = 0;
	      if (arguments.length < 3) outerPadding = padding;
	      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
	      range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
	      if (reverse) range.reverse();
	      rangeBand = Math.round(step * (1 - padding));
	      ranger = {
	        t: "rangeRoundBands",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeBand = function() {
	      return rangeBand;
	    };
	    scale.rangeExtent = function() {
	      return d3_scaleExtent(ranger.a[0]);
	    };
	    scale.copy = function() {
	      return d3_scale_ordinal(domain, ranger);
	    };
	    return scale.domain(domain);
	  }
	  d3.scale.category10 = function() {
	    return d3.scale.ordinal().range(d3_category10);
	  };
	  d3.scale.category20 = function() {
	    return d3.scale.ordinal().range(d3_category20);
	  };
	  d3.scale.category20b = function() {
	    return d3.scale.ordinal().range(d3_category20b);
	  };
	  d3.scale.category20c = function() {
	    return d3.scale.ordinal().range(d3_category20c);
	  };
	  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);
	  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);
	  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);
	  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);
	  d3.scale.quantile = function() {
	    return d3_scale_quantile([], []);
	  };
	  function d3_scale_quantile(domain, range) {
	    var thresholds;
	    function rescale() {
	      var k = 0, q = range.length;
	      thresholds = [];
	      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);
	      return scale;
	    }
	    function scale(x) {
	      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];
	    }
	    scale.domain = function(x) {
	      if (!arguments.length) return domain;
	      domain = x.map(d3_number).filter(d3_numeric).sort(d3_ascending);
	      return rescale();
	    };
	    scale.range = function(x) {
	      if (!arguments.length) return range;
	      range = x;
	      return rescale();
	    };
	    scale.quantiles = function() {
	      return thresholds;
	    };
	    scale.invertExtent = function(y) {
	      y = range.indexOf(y);
	      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];
	    };
	    scale.copy = function() {
	      return d3_scale_quantile(domain, range);
	    };
	    return rescale();
	  }
	  d3.scale.quantize = function() {
	    return d3_scale_quantize(0, 1, [ 0, 1 ]);
	  };
	  function d3_scale_quantize(x0, x1, range) {
	    var kx, i;
	    function scale(x) {
	      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
	    }
	    function rescale() {
	      kx = range.length / (x1 - x0);
	      i = range.length - 1;
	      return scale;
	    }
	    scale.domain = function(x) {
	      if (!arguments.length) return [ x0, x1 ];
	      x0 = +x[0];
	      x1 = +x[x.length - 1];
	      return rescale();
	    };
	    scale.range = function(x) {
	      if (!arguments.length) return range;
	      range = x;
	      return rescale();
	    };
	    scale.invertExtent = function(y) {
	      y = range.indexOf(y);
	      y = y < 0 ? NaN : y / kx + x0;
	      return [ y, y + 1 / kx ];
	    };
	    scale.copy = function() {
	      return d3_scale_quantize(x0, x1, range);
	    };
	    return rescale();
	  }
	  d3.scale.threshold = function() {
	    return d3_scale_threshold([ .5 ], [ 0, 1 ]);
	  };
	  function d3_scale_threshold(domain, range) {
	    function scale(x) {
	      if (x <= x) return range[d3.bisect(domain, x)];
	    }
	    scale.domain = function(_) {
	      if (!arguments.length) return domain;
	      domain = _;
	      return scale;
	    };
	    scale.range = function(_) {
	      if (!arguments.length) return range;
	      range = _;
	      return scale;
	    };
	    scale.invertExtent = function(y) {
	      y = range.indexOf(y);
	      return [ domain[y - 1], domain[y] ];
	    };
	    scale.copy = function() {
	      return d3_scale_threshold(domain, range);
	    };
	    return scale;
	  }
	  d3.scale.identity = function() {
	    return d3_scale_identity([ 0, 1 ]);
	  };
	  function d3_scale_identity(domain) {
	    function identity(x) {
	      return +x;
	    }
	    identity.invert = identity;
	    identity.domain = identity.range = function(x) {
	      if (!arguments.length) return domain;
	      domain = x.map(identity);
	      return identity;
	    };
	    identity.ticks = function(m) {
	      return d3_scale_linearTicks(domain, m);
	    };
	    identity.tickFormat = function(m, format) {
	      return d3_scale_linearTickFormat(domain, m, format);
	    };
	    identity.copy = function() {
	      return d3_scale_identity(domain);
	    };
	    return identity;
	  }
	  d3.svg = {};
	  function d3_zero() {
	    return 0;
	  }
	  d3.svg.arc = function() {
	    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, cornerRadius = d3_zero, padRadius = d3_svg_arcAuto, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle, padAngle = d3_svg_arcPadAngle;
	    function arc() {
	      var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1;
	      if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
	      if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
	      var rc, cr, rp, ap, p0 = 0, p1 = 0, x0, y0, x1, y1, x2, y2, x3, y3, path = [];
	      if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
	        rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments);
	        if (!cw) p1 *= -1;
	        if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
	        if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
	      }
	      if (r1) {
	        x0 = r1 * Math.cos(a0 + p1);
	        y0 = r1 * Math.sin(a0 + p1);
	        x1 = r1 * Math.cos(a1 - p1);
	        y1 = r1 * Math.sin(a1 - p1);
	        var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
	        if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
	          var h1 = (a0 + a1) / 2;
	          x0 = r1 * Math.cos(h1);
	          y0 = r1 * Math.sin(h1);
	          x1 = y1 = null;
	        }
	      } else {
	        x0 = y0 = 0;
	      }
	      if (r0) {
	        x2 = r0 * Math.cos(a1 - p0);
	        y2 = r0 * Math.sin(a1 - p0);
	        x3 = r0 * Math.cos(a0 + p0);
	        y3 = r0 * Math.sin(a0 + p0);
	        var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
	        if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
	          var h0 = (a0 + a1) / 2;
	          x2 = r0 * Math.cos(h0);
	          y2 = r0 * Math.sin(h0);
	          x3 = y3 = null;
	        }
	      } else {
	        x2 = y2 = 0;
	      }
	      if ((rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
	        cr = r0 < r1 ^ cw ? 0 : 1;
	        var oc = x3 == null ? [ x2, y2 ] : x1 == null ? [ x0, y0 ] : d3_geom_polygonIntersect([ x0, y0 ], [ x3, y3 ], [ x1, y1 ], [ x2, y2 ]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
	        if (x1 != null) {
	          var rc1 = Math.min(rc, (r1 - lc) / (kc + 1)), t30 = d3_svg_arcCornerTangents(x3 == null ? [ x2, y2 ] : [ x3, y3 ], [ x0, y0 ], r1, rc1, cw), t12 = d3_svg_arcCornerTangents([ x1, y1 ], [ x2, y2 ], r1, rc1, cw);
	          if (rc === rc1) {
	            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]);
	          } else {
	            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0]);
	          }
	        } else {
	          path.push("M", x0, ",", y0);
	        }
	        if (x3 != null) {
	          var rc0 = Math.min(rc, (r0 - lc) / (kc - 1)), t03 = d3_svg_arcCornerTangents([ x0, y0 ], [ x3, y3 ], r0, -rc0, cw), t21 = d3_svg_arcCornerTangents([ x2, y2 ], x1 == null ? [ x0, y0 ] : [ x1, y1 ], r0, -rc0, cw);
	          if (rc === rc0) {
	            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
	          } else {
	            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
	          }
	        } else {
	          path.push("L", x2, ",", y2);
	        }
	      } else {
	        path.push("M", x0, ",", y0);
	        if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
	        path.push("L", x2, ",", y2);
	        if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
	      }
	      path.push("Z");
	      return path.join("");
	    }
	    function circleSegment(r1, cw) {
	      return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;
	    }
	    arc.innerRadius = function(v) {
	      if (!arguments.length) return innerRadius;
	      innerRadius = d3_functor(v);
	      return arc;
	    };
	    arc.outerRadius = function(v) {
	      if (!arguments.length) return outerRadius;
	      outerRadius = d3_functor(v);
	      return arc;
	    };
	    arc.cornerRadius = function(v) {
	      if (!arguments.length) return cornerRadius;
	      cornerRadius = d3_functor(v);
	      return arc;
	    };
	    arc.padRadius = function(v) {
	      if (!arguments.length) return padRadius;
	      padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
	      return arc;
	    };
	    arc.startAngle = function(v) {
	      if (!arguments.length) return startAngle;
	      startAngle = d3_functor(v);
	      return arc;
	    };
	    arc.endAngle = function(v) {
	      if (!arguments.length) return endAngle;
	      endAngle = d3_functor(v);
	      return arc;
	    };
	    arc.padAngle = function(v) {
	      if (!arguments.length) return padAngle;
	      padAngle = d3_functor(v);
	      return arc;
	    };
	    arc.centroid = function() {
	      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
	      return [ Math.cos(a) * r, Math.sin(a) * r ];
	    };
	    return arc;
	  };
	  var d3_svg_arcAuto = "auto";
	  function d3_svg_arcInnerRadius(d) {
	    return d.innerRadius;
	  }
	  function d3_svg_arcOuterRadius(d) {
	    return d.outerRadius;
	  }
	  function d3_svg_arcStartAngle(d) {
	    return d.startAngle;
	  }
	  function d3_svg_arcEndAngle(d) {
	    return d.endAngle;
	  }
	  function d3_svg_arcPadAngle(d) {
	    return d && d.padAngle;
	  }
	  function d3_svg_arcSweep(x0, y0, x1, y1) {
	    return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1;
	  }
	  function d3_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
	    var x01 = p0[0] - p1[0], y01 = p0[1] - p1[1], lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x1 = p0[0] + ox, y1 = p0[1] + oy, x2 = p1[0] + ox, y2 = p1[1] + oy, x3 = (x1 + x2) / 2, y3 = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy, r = r1 - rc, D = x1 * y2 - x2 * y1, d = (dy < 0 ? -1 : 1) * Math.sqrt(r * r * d2 - D * D), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x3, dy0 = cy0 - y3, dx1 = cx1 - x3, dy1 = cy1 - y3;
	    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
	    return [ [ cx0 - ox, cy0 - oy ], [ cx0 * r1 / r, cy0 * r1 / r ] ];
	  }
	  function d3_svg_line(projection) {
	    var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
	    function line(data) {
	      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);
	      function segment() {
	        segments.push("M", interpolate(projection(points), tension));
	      }
	      while (++i < n) {
	        if (defined.call(this, d = data[i], i)) {
	          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);
	        } else if (points.length) {
	          segment();
	          points = [];
	        }
	      }
	      if (points.length) segment();
	      return segments.length ? segments.join("") : null;
	    }
	    line.x = function(_) {
	      if (!arguments.length) return x;
	      x = _;
	      return line;
	    };
	    line.y = function(_) {
	      if (!arguments.length) return y;
	      y = _;
	      return line;
	    };
	    line.defined = function(_) {
	      if (!arguments.length) return defined;
	      defined = _;
	      return line;
	    };
	    line.interpolate = function(_) {
	      if (!arguments.length) return interpolateKey;
	      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
	      return line;
	    };
	    line.tension = function(_) {
	      if (!arguments.length) return tension;
	      tension = _;
	      return line;
	    };
	    return line;
	  }
	  d3.svg.line = function() {
	    return d3_svg_line(d3_identity);
	  };
	  var d3_svg_lineInterpolators = d3.map({
	    linear: d3_svg_lineLinear,
	    "linear-closed": d3_svg_lineLinearClosed,
	    step: d3_svg_lineStep,
	    "step-before": d3_svg_lineStepBefore,
	    "step-after": d3_svg_lineStepAfter,
	    basis: d3_svg_lineBasis,
	    "basis-open": d3_svg_lineBasisOpen,
	    "basis-closed": d3_svg_lineBasisClosed,
	    bundle: d3_svg_lineBundle,
	    cardinal: d3_svg_lineCardinal,
	    "cardinal-open": d3_svg_lineCardinalOpen,
	    "cardinal-closed": d3_svg_lineCardinalClosed,
	    monotone: d3_svg_lineMonotone
	  });
	  d3_svg_lineInterpolators.forEach(function(key, value) {
	    value.key = key;
	    value.closed = /-closed$/.test(key);
	  });
	  function d3_svg_lineLinear(points) {
	    return points.join("L");
	  }
	  function d3_svg_lineLinearClosed(points) {
	    return d3_svg_lineLinear(points) + "Z";
	  }
	  function d3_svg_lineStep(points) {
	    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
	    while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
	    if (n > 1) path.push("H", p[0]);
	    return path.join("");
	  }
	  function d3_svg_lineStepBefore(points) {
	    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
	    while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
	    return path.join("");
	  }
	  function d3_svg_lineStepAfter(points) {
	    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
	    while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
	    return path.join("");
	  }
	  function d3_svg_lineCardinalOpen(points, tension) {
	    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension));
	  }
	  function d3_svg_lineCardinalClosed(points, tension) {
	    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), 
	    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));
	  }
	  function d3_svg_lineCardinal(points, tension) {
	    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));
	  }
	  function d3_svg_lineHermite(points, tangents) {
	    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
	      return d3_svg_lineLinear(points);
	    }
	    var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
	    if (quad) {
	      path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
	      p0 = points[1];
	      pi = 2;
	    }
	    if (tangents.length > 1) {
	      t = tangents[1];
	      p = points[pi];
	      pi++;
	      path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
	      for (var i = 2; i < tangents.length; i++, pi++) {
	        p = points[pi];
	        t = tangents[i];
	        path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
	      }
	    }
	    if (quad) {
	      var lp = points[pi];
	      path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
	    }
	    return path;
	  }
	  function d3_svg_lineCardinalTangents(points, tension) {
	    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
	    while (++i < n) {
	      p0 = p1;
	      p1 = p2;
	      p2 = points[i];
	      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);
	    }
	    return tangents;
	  }
	  function d3_svg_lineBasis(points) {
	    if (points.length < 3) return d3_svg_lineLinear(points);
	    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
	    points.push(points[n - 1]);
	    while (++i <= n) {
	      pi = points[i];
	      px.shift();
	      px.push(pi[0]);
	      py.shift();
	      py.push(pi[1]);
	      d3_svg_lineBasisBezier(path, px, py);
	    }
	    points.pop();
	    path.push("L", pi);
	    return path.join("");
	  }
	  function d3_svg_lineBasisOpen(points) {
	    if (points.length < 4) return d3_svg_lineLinear(points);
	    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];
	    while (++i < 3) {
	      pi = points[i];
	      px.push(pi[0]);
	      py.push(pi[1]);
	    }
	    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
	    --i;
	    while (++i < n) {
	      pi = points[i];
	      px.shift();
	      px.push(pi[0]);
	      py.shift();
	      py.push(pi[1]);
	      d3_svg_lineBasisBezier(path, px, py);
	    }
	    return path.join("");
	  }
	  function d3_svg_lineBasisClosed(points) {
	    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];
	    while (++i < 4) {
	      pi = points[i % n];
	      px.push(pi[0]);
	      py.push(pi[1]);
	    }
	    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
	    --i;
	    while (++i < m) {
	      pi = points[i % n];
	      px.shift();
	      px.push(pi[0]);
	      py.shift();
	      py.push(pi[1]);
	      d3_svg_lineBasisBezier(path, px, py);
	    }
	    return path.join("");
	  }
	  function d3_svg_lineBundle(points, tension) {
	    var n = points.length - 1;
	    if (n) {
	      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;
	      while (++i <= n) {
	        p = points[i];
	        t = i / n;
	        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
	        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
	      }
	    }
	    return d3_svg_lineBasis(points);
	  }
	  function d3_svg_lineDot4(a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
	  }
	  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];
	  function d3_svg_lineBasisBezier(path, x, y) {
	    path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
	  }
	  function d3_svg_lineSlope(p0, p1) {
	    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
	  }
	  function d3_svg_lineFiniteDifferences(points) {
	    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);
	    while (++i < j) {
	      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
	    }
	    m[i] = d;
	    return m;
	  }
	  function d3_svg_lineMonotoneTangents(points) {
	    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;
	    while (++i < j) {
	      d = d3_svg_lineSlope(points[i], points[i + 1]);
	      if (abs(d) < ε) {
	        m[i] = m[i + 1] = 0;
	      } else {
	        a = m[i] / d;
	        b = m[i + 1] / d;
	        s = a * a + b * b;
	        if (s > 9) {
	          s = d * 3 / Math.sqrt(s);
	          m[i] = s * a;
	          m[i + 1] = s * b;
	        }
	      }
	    }
	    i = -1;
	    while (++i <= j) {
	      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
	      tangents.push([ s || 0, m[i] * s || 0 ]);
	    }
	    return tangents;
	  }
	  function d3_svg_lineMonotone(points) {
	    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
	  }
	  d3.svg.line.radial = function() {
	    var line = d3_svg_line(d3_svg_lineRadial);
	    line.radius = line.x, delete line.x;
	    line.angle = line.y, delete line.y;
	    return line;
	  };
	  function d3_svg_lineRadial(points) {
	    var point, i = -1, n = points.length, r, a;
	    while (++i < n) {
	      point = points[i];
	      r = point[0];
	      a = point[1] - halfπ;
	      point[0] = r * Math.cos(a);
	      point[1] = r * Math.sin(a);
	    }
	    return points;
	  }
	  function d3_svg_area(projection) {
	    var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = "L", tension = .7;
	    function area(data) {
	      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {
	        return x;
	      } : d3_functor(x1), fy1 = y0 === y1 ? function() {
	        return y;
	      } : d3_functor(y1), x, y;
	      function segment() {
	        segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z");
	      }
	      while (++i < n) {
	        if (defined.call(this, d = data[i], i)) {
	          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);
	          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);
	        } else if (points0.length) {
	          segment();
	          points0 = [];
	          points1 = [];
	        }
	      }
	      if (points0.length) segment();
	      return segments.length ? segments.join("") : null;
	    }
	    area.x = function(_) {
	      if (!arguments.length) return x1;
	      x0 = x1 = _;
	      return area;
	    };
	    area.x0 = function(_) {
	      if (!arguments.length) return x0;
	      x0 = _;
	      return area;
	    };
	    area.x1 = function(_) {
	      if (!arguments.length) return x1;
	      x1 = _;
	      return area;
	    };
	    area.y = function(_) {
	      if (!arguments.length) return y1;
	      y0 = y1 = _;
	      return area;
	    };
	    area.y0 = function(_) {
	      if (!arguments.length) return y0;
	      y0 = _;
	      return area;
	    };
	    area.y1 = function(_) {
	      if (!arguments.length) return y1;
	      y1 = _;
	      return area;
	    };
	    area.defined = function(_) {
	      if (!arguments.length) return defined;
	      defined = _;
	      return area;
	    };
	    area.interpolate = function(_) {
	      if (!arguments.length) return interpolateKey;
	      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
	      interpolateReverse = interpolate.reverse || interpolate;
	      L = interpolate.closed ? "M" : "L";
	      return area;
	    };
	    area.tension = function(_) {
	      if (!arguments.length) return tension;
	      tension = _;
	      return area;
	    };
	    return area;
	  }
	  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;
	  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;
	  d3.svg.area = function() {
	    return d3_svg_area(d3_identity);
	  };
	  d3.svg.area.radial = function() {
	    var area = d3_svg_area(d3_svg_lineRadial);
	    area.radius = area.x, delete area.x;
	    area.innerRadius = area.x0, delete area.x0;
	    area.outerRadius = area.x1, delete area.x1;
	    area.angle = area.y, delete area.y;
	    area.startAngle = area.y0, delete area.y0;
	    area.endAngle = area.y1, delete area.y1;
	    return area;
	  };
	  d3.svg.chord = function() {
	    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
	    function chord(d, i) {
	      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
	      return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
	    }
	    function subgroup(self, f, d, i) {
	      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) - halfπ, a1 = endAngle.call(self, subgroup, i) - halfπ;
	      return {
	        r: r,
	        a0: a0,
	        a1: a1,
	        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
	        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
	      };
	    }
	    function equals(a, b) {
	      return a.a0 == b.a0 && a.a1 == b.a1;
	    }
	    function arc(r, p, a) {
	      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
	    }
	    function curve(r0, p0, r1, p1) {
	      return "Q 0,0 " + p1;
	    }
	    chord.radius = function(v) {
	      if (!arguments.length) return radius;
	      radius = d3_functor(v);
	      return chord;
	    };
	    chord.source = function(v) {
	      if (!arguments.length) return source;
	      source = d3_functor(v);
	      return chord;
	    };
	    chord.target = function(v) {
	      if (!arguments.length) return target;
	      target = d3_functor(v);
	      return chord;
	    };
	    chord.startAngle = function(v) {
	      if (!arguments.length) return startAngle;
	      startAngle = d3_functor(v);
	      return chord;
	    };
	    chord.endAngle = function(v) {
	      if (!arguments.length) return endAngle;
	      endAngle = d3_functor(v);
	      return chord;
	    };
	    return chord;
	  };
	  function d3_svg_chordRadius(d) {
	    return d.radius;
	  }
	  d3.svg.diagonal = function() {
	    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;
	    function diagonal(d, i) {
	      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
	        x: p0.x,
	        y: m
	      }, {
	        x: p3.x,
	        y: m
	      }, p3 ];
	      p = p.map(projection);
	      return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
	    }
	    diagonal.source = function(x) {
	      if (!arguments.length) return source;
	      source = d3_functor(x);
	      return diagonal;
	    };
	    diagonal.target = function(x) {
	      if (!arguments.length) return target;
	      target = d3_functor(x);
	      return diagonal;
	    };
	    diagonal.projection = function(x) {
	      if (!arguments.length) return projection;
	      projection = x;
	      return diagonal;
	    };
	    return diagonal;
	  };
	  function d3_svg_diagonalProjection(d) {
	    return [ d.x, d.y ];
	  }
	  d3.svg.diagonal.radial = function() {
	    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;
	    diagonal.projection = function(x) {
	      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;
	    };
	    return diagonal;
	  };
	  function d3_svg_diagonalRadialProjection(projection) {
	    return function() {
	      var d = projection.apply(this, arguments), r = d[0], a = d[1] - halfπ;
	      return [ r * Math.cos(a), r * Math.sin(a) ];
	    };
	  }
	  d3.svg.symbol = function() {
	    var type = d3_svg_symbolType, size = d3_svg_symbolSize;
	    function symbol(d, i) {
	      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));
	    }
	    symbol.type = function(x) {
	      if (!arguments.length) return type;
	      type = d3_functor(x);
	      return symbol;
	    };
	    symbol.size = function(x) {
	      if (!arguments.length) return size;
	      size = d3_functor(x);
	      return symbol;
	    };
	    return symbol;
	  };
	  function d3_svg_symbolSize() {
	    return 64;
	  }
	  function d3_svg_symbolType() {
	    return "circle";
	  }
	  function d3_svg_symbolCircle(size) {
	    var r = Math.sqrt(size / π);
	    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
	  }
	  var d3_svg_symbols = d3.map({
	    circle: d3_svg_symbolCircle,
	    cross: function(size) {
	      var r = Math.sqrt(size / 5) / 2;
	      return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
	    },
	    diamond: function(size) {
	      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;
	      return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";
	    },
	    square: function(size) {
	      var r = Math.sqrt(size) / 2;
	      return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";
	    },
	    "triangle-down": function(size) {
	      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
	      return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";
	    },
	    "triangle-up": function(size) {
	      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
	      return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";
	    }
	  });
	  d3.svg.symbolTypes = d3_svg_symbols.keys();
	  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
	  d3_selectionPrototype.transition = function(name) {
	    var id = d3_transitionInheritId || ++d3_transitionId, ns = d3_transitionNamespace(name), subgroups = [], subgroup, node, transition = d3_transitionInherit || {
	      time: Date.now(),
	      ease: d3_ease_cubicInOut,
	      delay: 0,
	      duration: 250
	    };
	    for (var j = -1, m = this.length; ++j < m; ) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
	        if (node = group[i]) d3_transitionNode(node, i, ns, id, transition);
	        subgroup.push(node);
	      }
	    }
	    return d3_transition(subgroups, ns, id);
	  };
	  d3_selectionPrototype.interrupt = function(name) {
	    return this.each(name == null ? d3_selection_interrupt : d3_selection_interruptNS(d3_transitionNamespace(name)));
	  };
	  var d3_selection_interrupt = d3_selection_interruptNS(d3_transitionNamespace());
	  function d3_selection_interruptNS(ns) {
	    return function() {
	      var lock, active;
	      if ((lock = this[ns]) && (active = lock[lock.active])) {
	        if (--lock.count) delete lock[lock.active]; else delete this[ns];
	        lock.active += .5;
	        active.event && active.event.interrupt.call(this, this.__data__, active.index);
	      }
	    };
	  }
	  function d3_transition(groups, ns, id) {
	    d3_subclass(groups, d3_transitionPrototype);
	    groups.namespace = ns;
	    groups.id = id;
	    return groups;
	  }
	  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;
	  d3_transitionPrototype.call = d3_selectionPrototype.call;
	  d3_transitionPrototype.empty = d3_selectionPrototype.empty;
	  d3_transitionPrototype.node = d3_selectionPrototype.node;
	  d3_transitionPrototype.size = d3_selectionPrototype.size;
	  d3.transition = function(selection, name) {
	    return selection && selection.transition ? d3_transitionInheritId ? selection.transition(name) : selection : d3.selection().transition(selection);
	  };
	  d3.transition.prototype = d3_transitionPrototype;
	  d3_transitionPrototype.select = function(selector) {
	    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnode, node;
	    selector = d3_selection_selector(selector);
	    for (var j = -1, m = this.length; ++j < m; ) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
	        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
	          if ("__data__" in node) subnode.__data__ = node.__data__;
	          d3_transitionNode(subnode, i, ns, id, node[ns][id]);
	          subgroup.push(subnode);
	        } else {
	          subgroup.push(null);
	        }
	      }
	    }
	    return d3_transition(subgroups, ns, id);
	  };
	  d3_transitionPrototype.selectAll = function(selector) {
	    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnodes, node, subnode, transition;
	    selector = d3_selection_selectorAll(selector);
	    for (var j = -1, m = this.length; ++j < m; ) {
	      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
	        if (node = group[i]) {
	          transition = node[ns][id];
	          subnodes = selector.call(node, node.__data__, i, j);
	          subgroups.push(subgroup = []);
	          for (var k = -1, o = subnodes.length; ++k < o; ) {
	            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, ns, id, transition);
	            subgroup.push(subnode);
	          }
	        }
	      }
	    }
	    return d3_transition(subgroups, ns, id);
	  };
	  d3_transitionPrototype.filter = function(filter) {
	    var subgroups = [], subgroup, group, node;
	    if (typeof filter !== "function") filter = d3_selection_filter(filter);
	    for (var j = 0, m = this.length; j < m; j++) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
	        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
	          subgroup.push(node);
	        }
	      }
	    }
	    return d3_transition(subgroups, this.namespace, this.id);
	  };
	  d3_transitionPrototype.tween = function(name, tween) {
	    var id = this.id, ns = this.namespace;
	    if (arguments.length < 2) return this.node()[ns][id].tween.get(name);
	    return d3_selection_each(this, tween == null ? function(node) {
	      node[ns][id].tween.remove(name);
	    } : function(node) {
	      node[ns][id].tween.set(name, tween);
	    });
	  };
	  function d3_transition_tween(groups, name, value, tween) {
	    var id = groups.id, ns = groups.namespace;
	    return d3_selection_each(groups, typeof value === "function" ? function(node, i, j) {
	      node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
	    } : (value = tween(value), function(node) {
	      node[ns][id].tween.set(name, value);
	    }));
	  }
	  d3_transitionPrototype.attr = function(nameNS, value) {
	    if (arguments.length < 2) {
	      for (value in nameNS) this.attr(value, nameNS[value]);
	      return this;
	    }
	    var interpolate = nameNS == "transform" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);
	    function attrNull() {
	      this.removeAttribute(name);
	    }
	    function attrNullNS() {
	      this.removeAttributeNS(name.space, name.local);
	    }
	    function attrTween(b) {
	      return b == null ? attrNull : (b += "", function() {
	        var a = this.getAttribute(name), i;
	        return a !== b && (i = interpolate(a, b), function(t) {
	          this.setAttribute(name, i(t));
	        });
	      });
	    }
	    function attrTweenNS(b) {
	      return b == null ? attrNullNS : (b += "", function() {
	        var a = this.getAttributeNS(name.space, name.local), i;
	        return a !== b && (i = interpolate(a, b), function(t) {
	          this.setAttributeNS(name.space, name.local, i(t));
	        });
	      });
	    }
	    return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
	  };
	  d3_transitionPrototype.attrTween = function(nameNS, tween) {
	    var name = d3.ns.qualify(nameNS);
	    function attrTween(d, i) {
	      var f = tween.call(this, d, i, this.getAttribute(name));
	      return f && function(t) {
	        this.setAttribute(name, f(t));
	      };
	    }
	    function attrTweenNS(d, i) {
	      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
	      return f && function(t) {
	        this.setAttributeNS(name.space, name.local, f(t));
	      };
	    }
	    return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
	  };
	  d3_transitionPrototype.style = function(name, value, priority) {
	    var n = arguments.length;
	    if (n < 3) {
	      if (typeof name !== "string") {
	        if (n < 2) value = "";
	        for (priority in name) this.style(priority, name[priority], value);
	        return this;
	      }
	      priority = "";
	    }
	    function styleNull() {
	      this.style.removeProperty(name);
	    }
	    function styleString(b) {
	      return b == null ? styleNull : (b += "", function() {
	        var a = d3_window(this).getComputedStyle(this, null).getPropertyValue(name), i;
	        return a !== b && (i = d3_interpolate(a, b), function(t) {
	          this.style.setProperty(name, i(t), priority);
	        });
	      });
	    }
	    return d3_transition_tween(this, "style." + name, value, styleString);
	  };
	  d3_transitionPrototype.styleTween = function(name, tween, priority) {
	    if (arguments.length < 3) priority = "";
	    function styleTween(d, i) {
	      var f = tween.call(this, d, i, d3_window(this).getComputedStyle(this, null).getPropertyValue(name));
	      return f && function(t) {
	        this.style.setProperty(name, f(t), priority);
	      };
	    }
	    return this.tween("style." + name, styleTween);
	  };
	  d3_transitionPrototype.text = function(value) {
	    return d3_transition_tween(this, "text", value, d3_transition_text);
	  };
	  function d3_transition_text(b) {
	    if (b == null) b = "";
	    return function() {
	      this.textContent = b;
	    };
	  }
	  d3_transitionPrototype.remove = function() {
	    var ns = this.namespace;
	    return this.each("end.transition", function() {
	      var p;
	      if (this[ns].count < 2 && (p = this.parentNode)) p.removeChild(this);
	    });
	  };
	  d3_transitionPrototype.ease = function(value) {
	    var id = this.id, ns = this.namespace;
	    if (arguments.length < 1) return this.node()[ns][id].ease;
	    if (typeof value !== "function") value = d3.ease.apply(d3, arguments);
	    return d3_selection_each(this, function(node) {
	      node[ns][id].ease = value;
	    });
	  };
	  d3_transitionPrototype.delay = function(value) {
	    var id = this.id, ns = this.namespace;
	    if (arguments.length < 1) return this.node()[ns][id].delay;
	    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
	      node[ns][id].delay = +value.call(node, node.__data__, i, j);
	    } : (value = +value, function(node) {
	      node[ns][id].delay = value;
	    }));
	  };
	  d3_transitionPrototype.duration = function(value) {
	    var id = this.id, ns = this.namespace;
	    if (arguments.length < 1) return this.node()[ns][id].duration;
	    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
	      node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j));
	    } : (value = Math.max(1, value), function(node) {
	      node[ns][id].duration = value;
	    }));
	  };
	  d3_transitionPrototype.each = function(type, listener) {
	    var id = this.id, ns = this.namespace;
	    if (arguments.length < 2) {
	      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;
	      try {
	        d3_transitionInheritId = id;
	        d3_selection_each(this, function(node, i, j) {
	          d3_transitionInherit = node[ns][id];
	          type.call(node, node.__data__, i, j);
	        });
	      } finally {
	        d3_transitionInherit = inherit;
	        d3_transitionInheritId = inheritId;
	      }
	    } else {
	      d3_selection_each(this, function(node) {
	        var transition = node[ns][id];
	        (transition.event || (transition.event = d3.dispatch("start", "end", "interrupt"))).on(type, listener);
	      });
	    }
	    return this;
	  };
	  d3_transitionPrototype.transition = function() {
	    var id0 = this.id, id1 = ++d3_transitionId, ns = this.namespace, subgroups = [], subgroup, group, node, transition;
	    for (var j = 0, m = this.length; j < m; j++) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
	        if (node = group[i]) {
	          transition = node[ns][id0];
	          d3_transitionNode(node, i, ns, id1, {
	            time: transition.time,
	            ease: transition.ease,
	            delay: transition.delay + transition.duration,
	            duration: transition.duration
	          });
	        }
	        subgroup.push(node);
	      }
	    }
	    return d3_transition(subgroups, ns, id1);
	  };
	  function d3_transitionNamespace(name) {
	    return name == null ? "__transition__" : "__transition_" + name + "__";
	  }
	  function d3_transitionNode(node, i, ns, id, inherit) {
	    var lock = node[ns] || (node[ns] = {
	      active: 0,
	      count: 0
	    }), transition = lock[id];
	    if (!transition) {
	      var time = inherit.time;
	      transition = lock[id] = {
	        tween: new d3_Map(),
	        time: time,
	        delay: inherit.delay,
	        duration: inherit.duration,
	        ease: inherit.ease,
	        index: i
	      };
	      inherit = null;
	      ++lock.count;
	      d3.timer(function(elapsed) {
	        var delay = transition.delay, duration, ease, timer = d3_timer_active, tweened = [];
	        timer.t = delay + time;
	        if (delay <= elapsed) return start(elapsed - delay);
	        timer.c = start;
	        function start(elapsed) {
	          if (lock.active > id) return stop();
	          var active = lock[lock.active];
	          if (active) {
	            --lock.count;
	            delete lock[lock.active];
	            active.event && active.event.interrupt.call(node, node.__data__, active.index);
	          }
	          lock.active = id;
	          transition.event && transition.event.start.call(node, node.__data__, i);
	          transition.tween.forEach(function(key, value) {
	            if (value = value.call(node, node.__data__, i)) {
	              tweened.push(value);
	            }
	          });
	          ease = transition.ease;
	          duration = transition.duration;
	          d3.timer(function() {
	            timer.c = tick(elapsed || 1) ? d3_true : tick;
	            return 1;
	          }, 0, time);
	        }
	        function tick(elapsed) {
	          if (lock.active !== id) return 1;
	          var t = elapsed / duration, e = ease(t), n = tweened.length;
	          while (n > 0) {
	            tweened[--n].call(node, e);
	          }
	          if (t >= 1) {
	            transition.event && transition.event.end.call(node, node.__data__, i);
	            return stop();
	          }
	        }
	        function stop() {
	          if (--lock.count) delete lock[id]; else delete node[ns];
	          return 1;
	        }
	      }, 0, time);
	    }
	  }
	  d3.svg.axis = function() {
	    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;
	    function axis(g) {
	      g.each(function() {
	        var g = d3.select(this);
	        var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy();
	        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(".tick").data(ticks, scale1), tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", ε), tickExit = d3.transition(tick.exit()).style("opacity", ε).remove(), tickUpdate = d3.transition(tick.order()).style("opacity", 1), tickSpacing = Math.max(innerTickSize, 0) + tickPadding, tickTransform;
	        var range = d3_scaleRange(scale1), path = g.selectAll(".domain").data([ 0 ]), pathUpdate = (path.enter().append("path").attr("class", "domain"), 
	        d3.transition(path));
	        tickEnter.append("line");
	        tickEnter.append("text");
	        var lineEnter = tickEnter.select("line"), lineUpdate = tickUpdate.select("line"), text = tick.select("text").text(tickFormat), textEnter = tickEnter.select("text"), textUpdate = tickUpdate.select("text"), sign = orient === "top" || orient === "left" ? -1 : 1, x1, x2, y1, y2;
	        if (orient === "bottom" || orient === "top") {
	          tickTransform = d3_svg_axisX, x1 = "x", y1 = "y", x2 = "x2", y2 = "y2";
	          text.attr("dy", sign < 0 ? "0em" : ".71em").style("text-anchor", "middle");
	          pathUpdate.attr("d", "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize);
	        } else {
	          tickTransform = d3_svg_axisY, x1 = "y", y1 = "x", x2 = "y2", y2 = "x2";
	          text.attr("dy", ".32em").style("text-anchor", sign < 0 ? "end" : "start");
	          pathUpdate.attr("d", "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize);
	        }
	        lineEnter.attr(y2, sign * innerTickSize);
	        textEnter.attr(y1, sign * tickSpacing);
	        lineUpdate.attr(x2, 0).attr(y2, sign * innerTickSize);
	        textUpdate.attr(x1, 0).attr(y1, sign * tickSpacing);
	        if (scale1.rangeBand) {
	          var x = scale1, dx = x.rangeBand() / 2;
	          scale0 = scale1 = function(d) {
	            return x(d) + dx;
	          };
	        } else if (scale0.rangeBand) {
	          scale0 = scale1;
	        } else {
	          tickExit.call(tickTransform, scale1, scale0);
	        }
	        tickEnter.call(tickTransform, scale0, scale1);
	        tickUpdate.call(tickTransform, scale1, scale1);
	      });
	    }
	    axis.scale = function(x) {
	      if (!arguments.length) return scale;
	      scale = x;
	      return axis;
	    };
	    axis.orient = function(x) {
	      if (!arguments.length) return orient;
	      orient = x in d3_svg_axisOrients ? x + "" : d3_svg_axisDefaultOrient;
	      return axis;
	    };
	    axis.ticks = function() {
	      if (!arguments.length) return tickArguments_;
	      tickArguments_ = arguments;
	      return axis;
	    };
	    axis.tickValues = function(x) {
	      if (!arguments.length) return tickValues;
	      tickValues = x;
	      return axis;
	    };
	    axis.tickFormat = function(x) {
	      if (!arguments.length) return tickFormat_;
	      tickFormat_ = x;
	      return axis;
	    };
	    axis.tickSize = function(x) {
	      var n = arguments.length;
	      if (!n) return innerTickSize;
	      innerTickSize = +x;
	      outerTickSize = +arguments[n - 1];
	      return axis;
	    };
	    axis.innerTickSize = function(x) {
	      if (!arguments.length) return innerTickSize;
	      innerTickSize = +x;
	      return axis;
	    };
	    axis.outerTickSize = function(x) {
	      if (!arguments.length) return outerTickSize;
	      outerTickSize = +x;
	      return axis;
	    };
	    axis.tickPadding = function(x) {
	      if (!arguments.length) return tickPadding;
	      tickPadding = +x;
	      return axis;
	    };
	    axis.tickSubdivide = function() {
	      return arguments.length && axis;
	    };
	    return axis;
	  };
	  var d3_svg_axisDefaultOrient = "bottom", d3_svg_axisOrients = {
	    top: 1,
	    right: 1,
	    bottom: 1,
	    left: 1
	  };
	  function d3_svg_axisX(selection, x0, x1) {
	    selection.attr("transform", function(d) {
	      var v0 = x0(d);
	      return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)";
	    });
	  }
	  function d3_svg_axisY(selection, y0, y1) {
	    selection.attr("transform", function(d) {
	      var v0 = y0(d);
	      return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")";
	    });
	  }
	  d3.svg.brush = function() {
	    var event = d3_eventDispatch(brush, "brushstart", "brush", "brushend"), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0];
	    function brush(g) {
	      g.each(function() {
	        var g = d3.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", brushstart).on("touchstart.brush", brushstart);
	        var background = g.selectAll(".background").data([ 0 ]);
	        background.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair");
	        g.selectAll(".extent").data([ 0 ]).enter().append("rect").attr("class", "extent").style("cursor", "move");
	        var resize = g.selectAll(".resize").data(resizes, d3_identity);
	        resize.exit().remove();
	        resize.enter().append("g").attr("class", function(d) {
	          return "resize " + d;
	        }).style("cursor", function(d) {
	          return d3_svg_brushCursor[d];
	        }).append("rect").attr("x", function(d) {
	          return /[ew]$/.test(d) ? -3 : null;
	        }).attr("y", function(d) {
	          return /^[ns]/.test(d) ? -3 : null;
	        }).attr("width", 6).attr("height", 6).style("visibility", "hidden");
	        resize.style("display", brush.empty() ? "none" : null);
	        var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range;
	        if (x) {
	          range = d3_scaleRange(x);
	          backgroundUpdate.attr("x", range[0]).attr("width", range[1] - range[0]);
	          redrawX(gUpdate);
	        }
	        if (y) {
	          range = d3_scaleRange(y);
	          backgroundUpdate.attr("y", range[0]).attr("height", range[1] - range[0]);
	          redrawY(gUpdate);
	        }
	        redraw(gUpdate);
	      });
	    }
	    brush.event = function(g) {
	      g.each(function() {
	        var event_ = event.of(this, arguments), extent1 = {
	          x: xExtent,
	          y: yExtent,
	          i: xExtentDomain,
	          j: yExtentDomain
	        }, extent0 = this.__chart__ || extent1;
	        this.__chart__ = extent1;
	        if (d3_transitionInheritId) {
	          d3.select(this).transition().each("start.brush", function() {
	            xExtentDomain = extent0.i;
	            yExtentDomain = extent0.j;
	            xExtent = extent0.x;
	            yExtent = extent0.y;
	            event_({
	              type: "brushstart"
	            });
	          }).tween("brush:brush", function() {
	            var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);
	            xExtentDomain = yExtentDomain = null;
	            return function(t) {
	              xExtent = extent1.x = xi(t);
	              yExtent = extent1.y = yi(t);
	              event_({
	                type: "brush",
	                mode: "resize"
	              });
	            };
	          }).each("end.brush", function() {
	            xExtentDomain = extent1.i;
	            yExtentDomain = extent1.j;
	            event_({
	              type: "brush",
	              mode: "resize"
	            });
	            event_({
	              type: "brushend"
	            });
	          });
	        } else {
	          event_({
	            type: "brushstart"
	          });
	          event_({
	            type: "brush",
	            mode: "resize"
	          });
	          event_({
	            type: "brushend"
	          });
	        }
	      });
	    };
	    function redraw(g) {
	      g.selectAll(".resize").attr("transform", function(d) {
	        return "translate(" + xExtent[+/e$/.test(d)] + "," + yExtent[+/^s/.test(d)] + ")";
	      });
	    }
	    function redrawX(g) {
	      g.select(".extent").attr("x", xExtent[0]);
	      g.selectAll(".extent,.n>rect,.s>rect").attr("width", xExtent[1] - xExtent[0]);
	    }
	    function redrawY(g) {
	      g.select(".extent").attr("y", yExtent[0]);
	      g.selectAll(".extent,.e>rect,.w>rect").attr("height", yExtent[1] - yExtent[0]);
	    }
	    function brushstart() {
	      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed("extent"), dragRestore = d3_event_dragSuppress(target), center, origin = d3.mouse(target), offset;
	      var w = d3.select(d3_window(target)).on("keydown.brush", keydown).on("keyup.brush", keyup);
	      if (d3.event.changedTouches) {
	        w.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
	      } else {
	        w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
	      }
	      g.interrupt().selectAll("*").interrupt();
	      if (dragging) {
	        origin[0] = xExtent[0] - origin[0];
	        origin[1] = yExtent[0] - origin[1];
	      } else if (resizing) {
	        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);
	        offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ];
	        origin[0] = xExtent[ex];
	        origin[1] = yExtent[ey];
	      } else if (d3.event.altKey) center = origin.slice();
	      g.style("pointer-events", "none").selectAll(".resize").style("display", null);
	      d3.select("body").style("cursor", eventTarget.style("cursor"));
	      event_({
	        type: "brushstart"
	      });
	      brushmove();
	      function keydown() {
	        if (d3.event.keyCode == 32) {
	          if (!dragging) {
	            center = null;
	            origin[0] -= xExtent[1];
	            origin[1] -= yExtent[1];
	            dragging = 2;
	          }
	          d3_eventPreventDefault();
	        }
	      }
	      function keyup() {
	        if (d3.event.keyCode == 32 && dragging == 2) {
	          origin[0] += xExtent[1];
	          origin[1] += yExtent[1];
	          dragging = 0;
	          d3_eventPreventDefault();
	        }
	      }
	      function brushmove() {
	        var point = d3.mouse(target), moved = false;
	        if (offset) {
	          point[0] += offset[0];
	          point[1] += offset[1];
	        }
	        if (!dragging) {
	          if (d3.event.altKey) {
	            if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ];
	            origin[0] = xExtent[+(point[0] < center[0])];
	            origin[1] = yExtent[+(point[1] < center[1])];
	          } else center = null;
	        }
	        if (resizingX && move1(point, x, 0)) {
	          redrawX(g);
	          moved = true;
	        }
	        if (resizingY && move1(point, y, 1)) {
	          redrawY(g);
	          moved = true;
	        }
	        if (moved) {
	          redraw(g);
	          event_({
	            type: "brush",
	            mode: dragging ? "move" : "resize"
	          });
	        }
	      }
	      function move1(point, scale, i) {
	        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max;
	        if (dragging) {
	          r0 -= position;
	          r1 -= size + position;
	        }
	        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];
	        if (dragging) {
	          max = (min += position) + size;
	        } else {
	          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));
	          if (position < min) {
	            max = min;
	            min = position;
	          } else {
	            max = position;
	          }
	        }
	        if (extent[0] != min || extent[1] != max) {
	          if (i) yExtentDomain = null; else xExtentDomain = null;
	          extent[0] = min;
	          extent[1] = max;
	          return true;
	        }
	      }
	      function brushend() {
	        brushmove();
	        g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null);
	        d3.select("body").style("cursor", null);
	        w.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null);
	        dragRestore();
	        event_({
	          type: "brushend"
	        });
	      }
	    }
	    brush.x = function(z) {
	      if (!arguments.length) return x;
	      x = z;
	      resizes = d3_svg_brushResizes[!x << 1 | !y];
	      return brush;
	    };
	    brush.y = function(z) {
	      if (!arguments.length) return y;
	      y = z;
	      resizes = d3_svg_brushResizes[!x << 1 | !y];
	      return brush;
	    };
	    brush.clamp = function(z) {
	      if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null;
	      if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z;
	      return brush;
	    };
	    brush.extent = function(z) {
	      var x0, x1, y0, y1, t;
	      if (!arguments.length) {
	        if (x) {
	          if (xExtentDomain) {
	            x0 = xExtentDomain[0], x1 = xExtentDomain[1];
	          } else {
	            x0 = xExtent[0], x1 = xExtent[1];
	            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
	            if (x1 < x0) t = x0, x0 = x1, x1 = t;
	          }
	        }
	        if (y) {
	          if (yExtentDomain) {
	            y0 = yExtentDomain[0], y1 = yExtentDomain[1];
	          } else {
	            y0 = yExtent[0], y1 = yExtent[1];
	            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
	            if (y1 < y0) t = y0, y0 = y1, y1 = t;
	          }
	        }
	        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];
	      }
	      if (x) {
	        x0 = z[0], x1 = z[1];
	        if (y) x0 = x0[0], x1 = x1[0];
	        xExtentDomain = [ x0, x1 ];
	        if (x.invert) x0 = x(x0), x1 = x(x1);
	        if (x1 < x0) t = x0, x0 = x1, x1 = t;
	        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ];
	      }
	      if (y) {
	        y0 = z[0], y1 = z[1];
	        if (x) y0 = y0[1], y1 = y1[1];
	        yExtentDomain = [ y0, y1 ];
	        if (y.invert) y0 = y(y0), y1 = y(y1);
	        if (y1 < y0) t = y0, y0 = y1, y1 = t;
	        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ];
	      }
	      return brush;
	    };
	    brush.clear = function() {
	      if (!brush.empty()) {
	        xExtent = [ 0, 0 ], yExtent = [ 0, 0 ];
	        xExtentDomain = yExtentDomain = null;
	      }
	      return brush;
	    };
	    brush.empty = function() {
	      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];
	    };
	    return d3.rebind(brush, event, "on");
	  };
	  var d3_svg_brushCursor = {
	    n: "ns-resize",
	    e: "ew-resize",
	    s: "ns-resize",
	    w: "ew-resize",
	    nw: "nwse-resize",
	    ne: "nesw-resize",
	    se: "nwse-resize",
	    sw: "nesw-resize"
	  };
	  var d3_svg_brushResizes = [ [ "n", "e", "s", "w", "nw", "ne", "se", "sw" ], [ "e", "w" ], [ "n", "s" ], [] ];
	  var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat;
	  var d3_time_formatUtc = d3_time_format.utc;
	  var d3_time_formatIso = d3_time_formatUtc("%Y-%m-%dT%H:%M:%S.%LZ");
	  d3_time_format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? d3_time_formatIsoNative : d3_time_formatIso;
	  function d3_time_formatIsoNative(date) {
	    return date.toISOString();
	  }
	  d3_time_formatIsoNative.parse = function(string) {
	    var date = new Date(string);
	    return isNaN(date) ? null : date;
	  };
	  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;
	  d3_time.second = d3_time_interval(function(date) {
	    return new d3_date(Math.floor(date / 1e3) * 1e3);
	  }, function(date, offset) {
	    date.setTime(date.getTime() + Math.floor(offset) * 1e3);
	  }, function(date) {
	    return date.getSeconds();
	  });
	  d3_time.seconds = d3_time.second.range;
	  d3_time.seconds.utc = d3_time.second.utc.range;
	  d3_time.minute = d3_time_interval(function(date) {
	    return new d3_date(Math.floor(date / 6e4) * 6e4);
	  }, function(date, offset) {
	    date.setTime(date.getTime() + Math.floor(offset) * 6e4);
	  }, function(date) {
	    return date.getMinutes();
	  });
	  d3_time.minutes = d3_time.minute.range;
	  d3_time.minutes.utc = d3_time.minute.utc.range;
	  d3_time.hour = d3_time_interval(function(date) {
	    var timezone = date.getTimezoneOffset() / 60;
	    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
	  }, function(date, offset) {
	    date.setTime(date.getTime() + Math.floor(offset) * 36e5);
	  }, function(date) {
	    return date.getHours();
	  });
	  d3_time.hours = d3_time.hour.range;
	  d3_time.hours.utc = d3_time.hour.utc.range;
	  d3_time.month = d3_time_interval(function(date) {
	    date = d3_time.day(date);
	    date.setDate(1);
	    return date;
	  }, function(date, offset) {
	    date.setMonth(date.getMonth() + offset);
	  }, function(date) {
	    return date.getMonth();
	  });
	  d3_time.months = d3_time.month.range;
	  d3_time.months.utc = d3_time.month.utc.range;
	  function d3_time_scale(linear, methods, format) {
	    function scale(x) {
	      return linear(x);
	    }
	    scale.invert = function(x) {
	      return d3_time_scaleDate(linear.invert(x));
	    };
	    scale.domain = function(x) {
	      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
	      linear.domain(x);
	      return scale;
	    };
	    function tickMethod(extent, count) {
	      var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);
	      return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {
	        return d / 31536e6;
	      }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];
	    }
	    scale.nice = function(interval, skip) {
	      var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" && tickMethod(extent, interval);
	      if (method) interval = method[0], skip = method[1];
	      function skipped(date) {
	        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;
	      }
	      return scale.domain(d3_scale_nice(domain, skip > 1 ? {
	        floor: function(date) {
	          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);
	          return date;
	        },
	        ceil: function(date) {
	          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);
	          return date;
	        }
	      } : interval));
	    };
	    scale.ticks = function(interval, skip) {
	      var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" ? tickMethod(extent, interval) : !interval.range && [ {
	        range: interval
	      }, skip ];
	      if (method) interval = method[0], skip = method[1];
	      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);
	    };
	    scale.tickFormat = function() {
	      return format;
	    };
	    scale.copy = function() {
	      return d3_time_scale(linear.copy(), methods, format);
	    };
	    return d3_scale_linearRebind(scale, linear);
	  }
	  function d3_time_scaleDate(t) {
	    return new Date(t);
	  }
	  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];
	  var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];
	  var d3_time_scaleLocalFormat = d3_time_format.multi([ [ ".%L", function(d) {
	    return d.getMilliseconds();
	  } ], [ ":%S", function(d) {
	    return d.getSeconds();
	  } ], [ "%I:%M", function(d) {
	    return d.getMinutes();
	  } ], [ "%I %p", function(d) {
	    return d.getHours();
	  } ], [ "%a %d", function(d) {
	    return d.getDay() && d.getDate() != 1;
	  } ], [ "%b %d", function(d) {
	    return d.getDate() != 1;
	  } ], [ "%B", function(d) {
	    return d.getMonth();
	  } ], [ "%Y", d3_true ] ]);
	  var d3_time_scaleMilliseconds = {
	    range: function(start, stop, step) {
	      return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate);
	    },
	    floor: d3_identity,
	    ceil: d3_identity
	  };
	  d3_time_scaleLocalMethods.year = d3_time.year;
	  d3_time.scale = function() {
	    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
	  };
	  var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function(m) {
	    return [ m[0].utc, m[1] ];
	  });
	  var d3_time_scaleUtcFormat = d3_time_formatUtc.multi([ [ ".%L", function(d) {
	    return d.getUTCMilliseconds();
	  } ], [ ":%S", function(d) {
	    return d.getUTCSeconds();
	  } ], [ "%I:%M", function(d) {
	    return d.getUTCMinutes();
	  } ], [ "%I %p", function(d) {
	    return d.getUTCHours();
	  } ], [ "%a %d", function(d) {
	    return d.getUTCDay() && d.getUTCDate() != 1;
	  } ], [ "%b %d", function(d) {
	    return d.getUTCDate() != 1;
	  } ], [ "%B", function(d) {
	    return d.getUTCMonth();
	  } ], [ "%Y", d3_true ] ]);
	  d3_time_scaleUtcMethods.year = d3_time.year.utc;
	  d3_time.scale.utc = function() {
	    return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat);
	  };
	  d3.text = d3_xhrType(function(request) {
	    return request.responseText;
	  });
	  d3.json = function(url, callback) {
	    return d3_xhr(url, "application/json", d3_json, callback);
	  };
	  function d3_json(request) {
	    return JSON.parse(request.responseText);
	  }
	  d3.html = function(url, callback) {
	    return d3_xhr(url, "text/html", d3_html, callback);
	  };
	  function d3_html(request) {
	    var range = d3_document.createRange();
	    range.selectNode(d3_document.body);
	    return range.createContextualFragment(request.responseText);
	  }
	  d3.xml = d3_xhrType(function(request) {
	    return request.responseXML;
	  });
	  if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (d3), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); else if (typeof module === "object" && module.exports) module.exports = d3;
	  this.d3 = d3;
	}();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var pinyin = __webpack_require__(5);
	
	var custom_data = {
	    "蔺立萱": "lin4 li4 xuan1",
	    "雒洛": "luo4 luo4",
	    "靳健": "jin1 jian4",
	    "闫婷钰": "yan2 tin2 yu4",
	    "郝亦雯": "hao3 yi4 wen2"
	}
	
	function getPY(str) {
	    if (str in custom_data) return custom_data[str];
	    return pinyin(str, {
	        style: pinyin.STYLE_TONE2
	    }).toString();
	}
	
	function sortByKeyName(list, key) {
	    list.sort(function (a, b) {
	        return getPY(a[key]).localeCompare(getPY(b[key])); 
	    });
	    return list;
	}
	
	module.exports = sortByKeyName;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(6);


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module) {
	var isNode = typeof process === "object" &&
	  process.toString() === "[object process]";
	
	// 分词模块
	var jieba;
	var PHRASES_DICT;
	var PINYIN_DICT;
	
	
	// 解压拼音库。
	// @param {Object} dict_combo, 压缩的拼音库。
	// @param {Object} 解压的拼音库。
	function buildPinyinCache(dict_combo){
	  var hans;
	  var uncomboed = {};
	
	  for(var py in dict_combo){
	    hans = dict_combo[py];
	    for(var i=0,han,l=hans.length; i<l; i++){
	      han = hans.charCodeAt(i);
	      if(!uncomboed.hasOwnProperty(han)){
	        uncomboed[han] = py;
	      }else{
	        uncomboed[han] += ","+py;
	      }
	    }
	  }
	
	  return uncomboed;
	}
	
	function segment(hans) {
	    jieba = jieba || module['require']('nodejieba');
	    // 词语拼音库。
	    PHRASES_DICT = PHRASES_DICT || module["require"]("./phrases-dict");
	    return jieba.cut(hans)
	}
	if(isNode){
	  // 拼音词库，node 版无需使用压缩合并的拼音库。
	  PINYIN_DICT = module["require"]("./dict-zi");
	}else{
	  PINYIN_DICT = buildPinyinCache(__webpack_require__(9));
	}
	
	
	// 声母表。
	var INITIALS = "zh,ch,sh,b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,z,c,s,yu,y,w".split(",");
	// 韵母表。
	var FINALS = "ang,eng,ing,ong,an,en,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v".split(",");
	var PINYIN_STYLE =  {
	  NORMAL: 0,  // 普通风格，不带音标。
	  TONE: 1,    // 标准风格，音标在韵母的第一个字母上。
	  TONE2: 2,   // 声调中拼音之后，使用数字 1~4 标识。
	  INITIALS: 3,// 仅需要声母部分。
	  FIRST_LETTER: 4 // 仅保留首字母。
	};
	// 带音标字符。
	var PHONETIC_SYMBOL = __webpack_require__(10);
	var re_phonetic_symbol_source = "";
	for(var k in PHONETIC_SYMBOL){
	    re_phonetic_symbol_source += k;
	}
	var RE_PHONETIC_SYMBOL = new RegExp('(['+re_phonetic_symbol_source+'])', 'g');
	var RE_TONE2 = /([aeoiuvnm])([0-4])$/;
	var DEFAULT_OPTIONS = {
	  style: PINYIN_STYLE.TONE, // 风格
	  segment: false, // 分词。
	  heteronym: false // 多音字
	};
	
	
	// 将 more 的属性值，覆盖 origin 中已有的属性。
	// @param {Object} origin.
	// @param {Object} more.
	// @return 返回新的对象。
	function extend(origin, more){
	  var obj = {};
	  for(var k in origin){
	    if(more.hasOwnProperty(k)){
	      obj[k] = more[k]
	    }else{
	      obj[k] = origin[k]
	    }
	  }
	  return obj;
	}
	
	// 修改拼音词库表中的格式。
	// @param {String} pinyin, 单个拼音。
	// @param {PINYIN_STYLE} style, 拼音风格。
	// @return {String}
	function toFixed(pinyin, style){
	  var tone = ""; // 声调。
	  switch(style){
	  case PINYIN_STYLE.INITIALS:
	    return initials(pinyin);
	
	  case PINYIN_STYLE.FIRST_LETTER:
	    var first_letter = pinyin.charAt(0);
	    if(PHONETIC_SYMBOL.hasOwnProperty(first_letter)){
	      first_letter = PHONETIC_SYMBOL[first_letter].charAt(0);
	    }
	    return first_letter;
	
	  case PINYIN_STYLE.NORMAL:
	    return pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1_phonetic){
	      return PHONETIC_SYMBOL[$1_phonetic].replace(RE_TONE2, "$1");
	    });
	
	  case PINYIN_STYLE.TONE2:
	    var py = pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1){
	      // 声调数值。
	      tone = PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$2");
	
	      return PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$1");
	    });
	    return py + tone;
	
	  case PINYIN_STYLE.TONE:
	  default:
	    return pinyin;
	  }
	}
	
	// 单字拼音转换。
	// @param {String} han, 单个汉字
	// @return {Array} 返回拼音列表，多音字会有多个拼音项。
	function single_pinyin(han, options){
	
	  if("string" !== typeof han){return [];}
	  if(han.length !== 1){
	    return single_pinyin(han.charAt(0), options);
	  }
	
	  var hanCode = han.charCodeAt(0);
	
	  if(!PINYIN_DICT[hanCode]){return [han];}
	
	  var pys = PINYIN_DICT[hanCode].split(",");
	  if(!options.heteronym){
	    return [toFixed(pys[0], options.style)];
	  }
	
	  // 临时存储已存在的拼音，避免多音字拼音转换为非注音风格出现重复。
	  var py_cached = {};
	  var pinyins = [];
	  for(var i=0,py,l=pys.length; i<l; i++){
	    py = toFixed(pys[i], options.style);
	    if(py_cached.hasOwnProperty(py)){continue;}
	    py_cached[py] = py;
	
	    pinyins.push(py);
	  }
	  return pinyins;
	}
	
	// 词语注音
	// @param {String} phrases, 指定的词组。
	// @param {Object} options, 选项。
	// @return {Array}
	function phrases_pinyin(phrases, options){
	  var py = [];
	  if(PHRASES_DICT.hasOwnProperty(phrases)){
	    //! copy pinyin result.
	    PHRASES_DICT[phrases].forEach(function(item, idx){
	      py[idx] = [];
	      if (options.heteronym){
	        item.forEach(function(py_item, py_index){
	          py[idx][py_index] = toFixed(py_item, options.style);
	        });
	      } else {
	        py[idx][0] = toFixed(item[0], options.style);
	      }
	    });
	  }else{
	    for(var i=0,l=phrases.length; i<l; i++){
	      py.push(single_pinyin(phrases[i], options));
	    }
	  }
	  return py;
	}
	
	// @param {String} hans 要转为拼音的目标字符串（汉字）。
	// @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
	// @return {Array} 返回的拼音列表。
	function pinyin(hans, options){
	
	  if("string" !== typeof hans){return [];}
	
	  options = extend(DEFAULT_OPTIONS, options || {});
	
	  var phrases = isNode && options.segment ? segment(hans) : hans;
	  var pys = [];
	
	  for(var i=0,nohans="",firstCharCode,words,l=phrases.length; i<l; i++){
	
	    words = phrases[i];
	    firstCharCode = words.charCodeAt(0);
	
	    if(PINYIN_DICT[firstCharCode]){
	
	      // ends of non-chinese words.
	      if(nohans.length > 0){
	        pys.push([nohans]);
	        nohans = ""; // reset non-chinese words.
	      }
	
	      if(words.length===1){
	          pys.push(single_pinyin(words, options));
	      }else{
	        pys = pys.concat(phrases_pinyin(words, options));
	      }
	
	    }else{
	      nohans += words;
	    }
	  }
	
	  // 清理最后的非中文字符串。
	  if(nohans.length > 0){
	    pys.push([nohans]);
	    nohans = ""; // reset non-chinese words.
	  }
	  return pys;
	}
	
	
	// 格式化为声母(Initials)、韵母(Finals)。
	// @param {String}
	// @return {String}
	function initials(pinyin){
	  for(var i=0,l=INITIALS.length; i<l; i++){
	    if(pinyin.indexOf(INITIALS[i]) === 0){
	      return INITIALS[i];
	    }
	  }
	  return "";
	}
	
	pinyin.STYLE_NORMAL = PINYIN_STYLE.NORMAL;
	pinyin.STYLE_TONE = PINYIN_STYLE.TONE;
	pinyin.STYLE_TONE2 = PINYIN_STYLE.TONE2;
	pinyin.STYLE_INITIALS = PINYIN_STYLE.INITIALS;
	pinyin.STYLE_FIRST_LETTER = PINYIN_STYLE.FIRST_LETTER;
	
	module.exports = pinyin;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), __webpack_require__(8)(module)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = {
	"èr":"二贰",
	"shí":"十时实蚀",
	"yǐ":"乙已以蚁倚",
	"yī":"一衣医依伊揖壹",
	"chǎng,ān,hàn":"厂",
	"dīng,zhēng":"丁",
	"qī":"七戚欺漆柒凄嘁",
	"bǔ,bo":"卜",
	"rén":"人仁",
	"rù":"入褥",
	"jiǔ":"九久酒玖灸韭",
	"ér":"儿而",
	"bā":"八巴疤叭芭捌笆",
	"jī,jǐ":"几",
	"liǎo,le":"了",
	"lì":"力历厉立励利例栗粒吏沥荔俐莉砾雳痢",
	"dāo":"刀",
	"nǎi":"乃奶",
	"sān":"三叁",
	"yòu":"又右幼诱佑",
	"yú":"于余鱼娱渔榆愚隅逾舆",
	"shì":"士示世市式势事侍饰试视柿是适室逝释誓拭恃嗜",
	"gān,gàn":"干",
	"gōng":"工弓公功攻宫恭躬",
	"kuī":"亏盔窥",
	"tǔ":"土",
	"cùn":"寸",
	"dà,dài,tài":"大",
	"cái":"才材财裁",
	"xià":"下夏",
	"zhàng":"丈仗帐胀障杖账",
	"yǔ,yù,yú":"与",
	"shàng,shǎng":"上",
	"wàn,mò":"万",
	"kǒu":"口",
	"xiǎo":"小晓",
	"jīn":"巾斤今金津筋襟",
	"shān":"山删衫珊",
	"qiān":"千迁牵谦签",
	"qǐ":"乞企启起",
	"chuān":"川穿",
	"gè,gě":"个各",
	"sháo":"勺芍",
	"yì":"亿义艺忆议亦异役译易疫益谊意毅翼屹抑邑绎奕逸肄溢",
	"jí":"及吉级极即急疾集籍棘辑嫉",
	"fán":"凡烦矾樊",
	"xī":"夕西吸希析牺息悉惜稀锡溪熄膝昔晰犀熙嬉蟋",
	"wán":"丸完玩顽",
	"yāo,mó,ma,me":"么",
	"guǎng,ān":"广",
	"wáng,wú":"亡",
	"mén":"门们",
	"shī":"尸失师诗狮施湿虱",
	"zhī":"之支汁芝肢脂蜘",
	"jǐ":"己挤脊",
	"zǐ":"子紫姊籽滓",
	"wèi":"卫未位味畏胃喂慰谓猬蔚魏",
	"yě":"也冶野",
	"nǚ,rǔ":"女",
	"rèn":"刃认韧纫",
	"fēi":"飞非啡",
	"xí":"习席袭媳",
	"mǎ":"马码玛",
	"chā,chá,chǎ":"叉",
	"fēng":"丰封疯峰锋蜂枫",
	"xiāng":"乡香箱厢湘镶",
	"jǐng":"井警阱",
	"wáng,wàng":"王",
	"kāi":"开揩",
	"tiān":"天添",
	"wú":"无吴芜梧蜈",
	"fū,fú":"夫",
	"zhuān":"专砖",
	"yuán":"元园原圆援缘源袁猿辕",
	"yún":"云匀耘",
	"zā,zhā,zhá":"扎",
	"mù":"木目牧墓幕暮慕沐募睦穆",
	"wǔ":"五午伍武侮舞捂鹉",
	"tīng":"厅听",
	"bù,fǒu":"不",
	"qū,ōu":"区",
	"quǎn":"犬",
	"tài":"太态泰汰",
	"yǒu":"友",
	"chē,jū":"车",
	"pǐ":"匹",
	"yóu":"尤由邮犹油游",
	"jù":"巨拒具俱剧距惧锯聚炬",
	"yá":"牙芽崖蚜涯衙",
	"bǐ":"比彼笔鄙匕秕",
	"jiē":"皆阶接街秸",
	"hù":"互户护沪",
	"qiē,qiè":"切",
	"wǎ,wà":"瓦",
	"zhǐ":"止旨址纸指趾",
	"tún,zhūn":"屯",
	"shǎo,shào":"少",
	"rì":"日",
	"zhōng,zhòng":"中",
	"gāng":"冈刚纲缸肛",
	"nèi,nà":"内",
	"bèi":"贝备倍辈狈惫焙",
	"shuǐ":"水",
	"jiàn,xiàn":"见",
	"niú":"牛",
	"shǒu":"手守首",
	"máo":"毛矛茅锚",
	"qì":"气弃汽器迄泣",
	"shēng":"升生声牲笙甥",
	"cháng,zhǎng":"长",
	"shí,shén":"什",
	"piàn,piān":"片",
	"pū,pú":"仆",
	"huà,huā":"化",
	"bì":"币必毕闭毙碧蔽弊避壁庇蓖痹璧",
	"chóu,qiú":"仇",
	"zhǎo,zhuǎ":"爪",
	"jǐn,jìn":"仅",
	"réng":"仍",
	"fù,fǔ":"父",
	"cóng,zòng":"从",
	"fǎn":"反返",
	"jiè":"介戒届界借诫",
	"xiōng":"凶兄胸匈汹",
	"fēn,fèn":"分",
	"fá":"乏伐罚阀筏",
	"cāng":"仓苍舱沧",
	"yuè":"月阅悦跃越岳粤",
	"shì,zhī":"氏",
	"wù":"勿务物误悟雾坞晤",
	"qiàn":"欠歉",
	"fēng,fěng":"风",
	"dān":"丹耽",
	"wū":"乌污呜屋巫诬",
	"fèng":"凤奉",
	"gōu,gòu":"勾",
	"wén":"文闻蚊",
	"liù,lù":"六",
	"huǒ":"火伙",
	"fāng":"方芳",
	"dǒu,dòu":"斗",
	"wéi,wèi":"为",
	"dìng":"订定锭",
	"jì":"计记技忌际季剂迹既继寄绩妓荠寂鲫冀",
	"xīn":"心辛欣新薪锌",
	"chǐ,chě":"尺",
	"yǐn":"引饮蚓瘾",
	"chǒu":"丑",
	"kǒng":"孔恐",
	"duì":"队对",
	"bàn":"办半扮伴瓣绊",
	"yú,yǔ":"予",
	"yǔn":"允陨",
	"quàn":"劝",
	"shū":"书叔殊梳舒疏输蔬抒枢淑",
	"shuāng":"双霜",
	"yù":"玉育狱浴预域欲遇御裕愈誉芋郁喻寓豫",
	"huàn":"幻换唤患宦涣焕痪",
	"kān":"刊堪勘",
	"mò":"末沫漠墨默茉陌寞",
	"jī":"击饥圾机肌鸡积基激讥叽唧畸箕",
	"dǎ,dá":"打",
	"qiǎo":"巧",
	"zhèng,zhēng":"正挣症",
	"pū":"扑",
	"bā,pá":"扒",
	"gān":"甘肝竿柑",
	"qù":"去",
	"rēng":"扔",
	"gǔ":"古谷股鼓",
	"běn":"本",
	"jié,jiē":"节结",
	"shù,shú,zhú":"术",
	"bǐng":"丙柄饼秉禀",
	"kě,kè":"可",
	"zuǒ":"左",
	"bù":"布步怖部埠",
	"shí,dàn":"石",
	"lóng":"龙聋隆咙胧窿",
	"yà":"轧亚讶",
	"miè":"灭蔑",
	"píng":"平评凭瓶萍坪",
	"dōng":"东冬",
	"qiǎ,kǎ":"卡",
	"běi,bèi":"北",
	"yè":"业页夜液谒腋",
	"jiù":"旧救就舅臼疚",
	"shuài":"帅蟀",
	"guī":"归规闺硅瑰",
	"zhān,zhàn":"占",
	"dàn":"旦但诞淡蛋氮",
	"qiě,jū":"且",
	"yè,xié":"叶",
	"jiǎ":"甲钾",
	"dīng":"叮盯",
	"shēn":"申伸身深呻绅",
	"hào,háo":"号",
	"diàn":"电店垫殿玷淀惦奠",
	"tián":"田甜恬",
	"shǐ":"史使始驶矢屎",
	"zhī,zhǐ":"只",
	"yāng":"央殃秧鸯",
	"diāo":"叼雕刁碉",
	"jiào":"叫轿较窖酵",
	"lìng":"另",
	"tāo,dāo":"叨",
	"sì":"四寺饲肆",
	"tàn":"叹炭探碳",
	"qiū":"丘秋蚯",
	"hé":"禾河荷盒",
	"fù":"付负妇附咐赴复傅富腹覆赋缚",
	"dài":"代带贷怠袋逮戴",
	"xiān":"仙先掀锨",
	"yí":"仪宜姨移遗夷胰",
	"bái":"白",
	"zī,zǐ,zǎi":"仔",
	"chì":"斥赤翅",
	"tā":"他它塌",
	"guā":"瓜刮",
	"hū":"乎呼忽",
	"cóng":"丛",
	"líng,lǐng,lìng":"令",
	"yòng":"用",
	"shuǎi":"甩",
	"yìn":"印",
	"lè,yuè":"乐",
	"jù,gōu":"句",
	"cōng":"匆葱聪囱",
	"fàn":"犯饭泛范贩",
	"cè":"册厕测策",
	"wài":"外",
	"chǔ,chù":"处",
	"niǎo":"鸟",
	"bāo":"包胞苞褒",
	"zhǔ":"主煮嘱拄",
	"shǎn":"闪陕",
	"lán":"兰拦栏蓝篮澜",
	"tóu,tou":"头",
	"huì":"汇绘贿惠慧讳诲晦秽",
	"hàn":"汉旱捍悍焊撼翰憾",
	"tǎo":"讨",
	"xué":"穴学",
	"xiě":"写",
	"níng,nìng,zhù":"宁",
	"ràng":"让",
	"lǐ":"礼李里理鲤",
	"xùn":"训讯迅汛驯逊殉",
	"yǒng":"永咏泳勇蛹踊",
	"mín":"民",
	"chū":"出初",
	"ní":"尼",
	"sī":"司丝私斯撕嘶",
	"liáo":"辽疗僚聊寥嘹缭",
	"jiā":"加佳嘉枷",
	"nú":"奴",
	"zhào,shào":"召",
	"biān":"边编鞭蝙",
	"pí":"皮疲脾啤",
	"yùn":"孕运韵酝蕴",
	"fā,fà":"发",
	"shèng":"圣胜剩",
	"tái,tāi":"台苔",
	"jiū":"纠究揪鸠",
	"mǔ":"母亩牡拇姆",
	"káng,gāng":"扛",
	"xíng":"刑形型邢",
	"dòng":"动冻栋洞",
	"kǎo":"考烤拷",
	"kòu":"扣寇",
	"tuō":"托拖脱",
	"lǎo":"老",
	"gǒng":"巩汞拱",
	"zhí":"执直侄值职植",
	"kuò":"扩阔廓",
	"yáng":"扬阳杨洋",
	"dì,de":"地",
	"sǎo,sào":"扫",
	"cháng,chǎng":"场",
	"ěr":"耳尔饵",
	"gòng,gōng":"共",
	"máng":"芒忙盲茫",
	"xiǔ":"朽",
	"pǔ,pò,pō,piáo":"朴",
	"quán":"权全泉拳痊",
	"guò,guo,guō":"过",
	"chén":"臣尘辰沉陈晨忱",
	"zài":"再在",
	"xié":"协胁斜携鞋谐",
	"yā,yà":"压",
	"yàn":"厌艳宴验雁焰砚唁谚堰",
	"yǒu,yòu":"有",
	"cún":"存",
	"bǎi":"百摆",
	"kuā,kuà":"夸",
	"jiàng":"匠酱",
	"duó":"夺踱",
	"huī":"灰挥恢辉徽",
	"dá":"达",
	"sǐ":"死",
	"liè":"列劣烈猎",
	"guǐ":"轨鬼诡",
	"xié,yá,yé,yú,xú":"邪",
	"jiā,jiá,gā,xiá":"夹",
	"chéng":"成呈诚承城程惩橙",
	"mài":"迈麦卖",
	"huá,huà":"划",
	"zhì":"至志帜制质治致秩智置挚掷窒滞稚",
	"cǐ":"此",
	"zhēn":"贞针侦珍真斟榛",
	"jiān":"尖奸歼坚肩艰兼煎",
	"guāng":"光",
	"dāng,dàng":"当",
	"zǎo":"早枣澡蚤藻",
	"tǔ,tù":"吐",
	"xià,hè":"吓",
	"chóng":"虫崇",
	"tuán":"团",
	"tóng,tòng":"同",
	"qū,qǔ":"曲",
	"diào":"吊钓掉",
	"yīn":"因阴音姻茵",
	"chī":"吃嗤痴",
	"má,mǎ,ma":"吗",
	"yǔ":"屿宇羽",
	"fān":"帆翻",
	"huí":"回茴蛔",
	"qǐ,kǎi":"岂",
	"zé":"则责",
	"suì":"岁碎穗祟遂隧",
	"ròu":"肉",
	"zhū,shú":"朱",
	"wǎng":"网往枉",
	"nián":"年",
	"diū":"丢",
	"shé":"舌",
	"zhú":"竹逐烛",
	"qiáo":"乔侨桥瞧荞憔",
	"wěi":"伟伪苇纬萎",
	"chuán,zhuàn":"传",
	"pāng":"乓",
	"pīng":"乒",
	"xiū,xǔ":"休",
	"fú":"伏扶俘浮符幅福凫芙袱辐蝠",
	"yōu":"优忧悠幽",
	"yán":"延严言岩炎沿盐颜阎蜒檐",
	"jiàn":"件建荐贱剑健舰践鉴键箭涧",
	"rèn,rén":"任",
	"huá,huà,huā":"华",
	"jià,jiè,jie":"价",
	"shāng":"伤商",
	"fèn,bīn":"份",
	"fǎng":"仿访纺",
	"yǎng,áng":"仰",
	"zì":"自字",
	"xiě,xuè":"血",
	"xiàng":"向项象像橡",
	"sì,shì":"似",
	"hòu":"后厚候",
	"zhōu":"舟州周洲",
	"háng,xíng":"行",
	"huì,kuài":"会",
	"shā":"杀纱杉砂",
	"hé,gě":"合",
	"zhào":"兆赵照罩",
	"zhòng":"众仲",
	"yé":"爷",
	"sǎn":"伞",
	"chuàng,chuāng":"创",
	"duǒ":"朵躲",
	"wēi":"危威微偎薇巍",
	"xún":"旬寻巡询循",
	"zá":"杂砸",
	"míng":"名明鸣铭螟",
	"duō":"多哆",
	"zhēng":"争征睁筝蒸怔狰",
	"sè":"色涩瑟",
	"zhuàng":"壮状撞",
	"chōng,chòng":"冲",
	"bīng":"冰兵",
	"zhuāng":"庄装妆桩",
	"qìng":"庆",
	"liú":"刘留流榴琉硫瘤",
	"qí,jì,zī,zhāi":"齐",
	"cì":"次赐",
	"jiāo":"交郊浇娇骄胶椒焦蕉礁",
	"chǎn":"产铲阐",
	"wàng":"妄忘旺望",
	"chōng":"充",
	"wèn":"问",
	"chuǎng":"闯",
	"yáng,xiáng":"羊",
	"bìng,bīng":"并",
	"dēng":"灯登蹬",
	"mǐ":"米",
	"guān":"关官棺",
	"hàn,hán":"汗",
	"jué":"决绝掘诀爵",
	"jiāng":"江姜僵缰",
	"tāng,shāng":"汤",
	"chí":"池驰迟持弛",
	"xīng,xìng":"兴",
	"zhái":"宅",
	"ān":"安氨庵鞍",
	"jiǎng":"讲奖桨蒋",
	"jūn":"军均君钧",
	"xǔ,hǔ":"许",
	"fěng":"讽",
	"lùn,lún":"论",
	"nóng":"农浓脓",
	"shè":"设社舍涉赦",
	"nà,nǎ,nèi,nā":"那",
	"jìn,jǐn":"尽",
	"dǎo":"导岛蹈捣祷",
	"sūn,xùn":"孙",
	"zhèn":"阵振震镇",
	"shōu":"收",
	"fáng":"防妨房肪",
	"rú":"如儒蠕",
	"mā":"妈",
	"xì,hū":"戏",
	"hǎo,hào":"好",
	"tā,jiě":"她",
	"guān,guàn":"观冠",
	"huān":"欢",
	"hóng,gōng":"红",
	"mǎi":"买",
	"xiān,qiàn":"纤",
	"jì,jǐ":"纪济",
	"yuē,yāo":"约",
	"shòu":"寿受授售兽瘦",
	"nòng,lòng":"弄",
	"jìn":"进近晋浸",
	"wéi":"违围唯维桅",
	"yuǎn,yuàn":"远",
	"tūn":"吞",
	"tán":"坛谈痰昙谭潭檀",
	"fǔ":"抚斧府俯辅腐甫脯",
	"huài,pēi,pī,péi":"坏",
	"rǎo":"扰",
	"pī":"批披坯霹",
	"zhǎo":"找沼",
	"chě":"扯",
	"zǒu":"走",
	"chāo":"抄钞超",
	"bà":"坝爸霸",
	"gòng":"贡",
	"zhē,zhé,shé":"折",
	"qiāng,qiǎng,chēng":"抢",
	"zhuā":"抓",
	"xiào":"孝笑效哮啸",
	"pāo":"抛",
	"tóu":"投",
	"kàng":"抗炕",
	"fén":"坟焚",
	"kēng":"坑",
	"dǒu":"抖陡蚪",
	"ké,qiào":"壳",
	"fāng,fáng":"坊",
	"niǔ":"扭纽钮",
	"kuài":"块快筷",
	"bǎ,bà":"把",
	"bào":"报抱爆豹",
	"jié":"劫杰洁捷截竭",
	"què":"却确鹊",
	"huā":"花",
	"fēn":"芬吩纷氛",
	"qín":"芹琴禽勤秦擒",
	"láo":"劳牢",
	"lú":"芦炉卢庐颅",
	"gān,gǎn":"杆",
	"kè":"克刻客课",
	"sū,sù":"苏",
	"dù":"杜渡妒镀",
	"gàng,gāng":"杠",
	"cūn":"村",
	"qiú":"求球囚",
	"xìng":"杏幸性姓",
	"gēng,gèng":"更",
	"liǎng":"两",
	"lì,lí":"丽",
	"shù":"束述树竖恕庶墅漱",
	"dòu":"豆逗痘",
	"huán,hái":"还",
	"fǒu,pǐ":"否",
	"lái":"来莱",
	"lián":"连怜帘莲联廉镰",
	"xiàn,xuán":"县",
	"zhù,chú":"助",
	"dāi":"呆",
	"kuàng":"旷况矿框眶",
	"yā,ya":"呀",
	"zú":"足族",
	"dūn":"吨蹲墩",
	"kùn":"困",
	"nán":"男",
	"chǎo,chāo":"吵",
	"yuán,yún,yùn":"员",
	"chuàn":"串",
	"chuī":"吹炊",
	"bā,ba":"吧",
	"hǒu":"吼",
	"gǎng":"岗",
	"bié,biè":"别",
	"dīng,dìng":"钉",
	"gào":"告",
	"wǒ":"我",
	"luàn":"乱",
	"tū":"秃突凸",
	"xiù":"秀袖绣锈嗅",
	"gū,gù":"估",
	"měi":"每美",
	"hé,hē,hè":"何",
	"tǐ,tī,bèn":"体",
	"bó,bǎi,bà":"伯",
	"zuò":"作坐座做",
	"líng":"伶灵铃陵零龄玲凌菱蛉翎",
	"dī":"低堤滴",
	"yōng,yòng":"佣",
	"nǐ":"你拟",
	"zhù":"住注驻柱祝铸贮蛀",
	"zào":"皂灶造燥躁噪",
	"fó,fú,bì,bó":"佛",
	"chè":"彻撤澈",
	"tuǒ":"妥椭",
	"lín":"邻林临琳磷鳞",
	"hán":"含寒函涵韩",
	"chà":"岔衩",
	"cháng":"肠尝常偿",
	"dù,dǔ":"肚",
	"guī,jūn,qiū":"龟",
	"miǎn":"免勉娩冕缅",
	"jiǎo,jué":"角",
	"kuáng":"狂",
	"tiáo,tiāo":"条",
	"luǎn":"卵",
	"yíng":"迎盈营蝇赢荧莹萤",
	"xì,jì":"系",
	"chuáng":"床",
	"kù":"库裤酷",
	"yīng,yìng":"应",
	"lěng":"冷",
	"zhè,zhèi":"这",
	"xù":"序叙绪续絮蓄旭恤酗婿",
	"xián":"闲贤弦咸衔嫌涎舷",
	"jiān,jiàn":"间监",
	"pàn":"判盼叛畔",
	"mèn,mēn":"闷",
	"wāng":"汪",
	"dì,tì,tuí":"弟",
	"shā,shà":"沙煞",
	"càn":"灿",
	"wò":"沃卧握",
	"méi,mò":"没",
	"gōu":"沟钩",
	"shěn,chén":"沈",
	"huái":"怀槐徊淮",
	"sòng":"宋送诵颂讼",
	"hóng":"宏虹洪鸿",
	"qióng":"穷琼",
	"zāi":"灾栽",
	"liáng":"良梁粮粱",
	"zhèng":"证郑政",
	"bǔ":"补捕哺",
	"sù":"诉肃素速塑粟溯",
	"shí,zhì":"识",
	"cí":"词辞慈磁祠瓷雌",
	"zhěn":"诊枕疹",
	"niào,suī":"尿",
	"céng":"层",
	"jú":"局菊橘",
	"wěi,yǐ":"尾",
	"zhāng":"张章彰樟",
	"gǎi":"改",
	"lù":"陆录鹿路赂",
	"ā,ē":"阿",
	"zǔ":"阻组祖诅",
	"miào":"妙庙",
	"yāo":"妖腰邀夭吆",
	"nǔ":"努",
	"jìn,jìng":"劲",
	"rěn":"忍",
	"qū":"驱屈岖蛆躯",
	"chún":"纯唇醇",
	"nà":"纳钠捺",
	"bó":"驳脖博搏膊舶渤",
	"zòng,zǒng":"纵",
	"wén,wèn":"纹",
	"lǘ":"驴",
	"huán":"环",
	"qīng":"青轻倾清蜻氢卿",
	"xiàn":"现限线宪陷馅羡献腺",
	"biǎo":"表",
	"mǒ,mò,mā":"抹",
	"lǒng":"拢垄",
	"dān,dàn,dǎn":"担",
	"bá":"拔跋",
	"jiǎn":"拣茧俭捡检减剪简柬碱",
	"tǎn":"坦毯袒",
	"chōu":"抽",
	"yā":"押鸦鸭",
	"guǎi":"拐",
	"pāi":"拍",
	"zhě":"者",
	"dǐng":"顶鼎",
	"yōng":"拥庸",
	"chāi,cā":"拆",
	"dǐ":"抵",
	"jū,gōu":"拘",
	"lā":"垃",
	"lā,lá":"拉",
	"bàn,pàn":"拌",
	"zhāo":"招昭",
	"pō":"坡泼颇",
	"bō":"拨波玻菠播",
	"zé,zhái":"择",
	"tái":"抬",
	"qí,jī":"其奇",
	"qǔ":"取娶",
	"kǔ":"苦",
	"mào":"茂贸帽貌",
	"ruò,rě":"若",
	"miáo":"苗描瞄",
	"píng,pēng":"苹",
	"yīng":"英樱鹰莺婴缨鹦",
	"qié":"茄",
	"jīng":"茎京经惊晶睛精荆兢鲸",
	"zhī,qí":"枝",
	"bēi":"杯悲碑卑",
	"guì,jǔ":"柜",
	"bǎn":"板版",
	"sōng":"松",
	"qiāng":"枪腔",
	"gòu":"构购够垢",
	"sāng,sàng":"丧",
	"huà":"画话桦",
	"huò":"或货获祸惑霍",
	"cì,cī":"刺",
	"yǔ,yù":"雨语",
	"bēn,bèn":"奔",
	"fèn":"奋粪愤忿",
	"hōng":"轰烘",
	"qī,qì":"妻",
	"ōu":"欧殴鸥",
	"qǐng":"顷请",
	"zhuǎn,zhuàn,zhuǎi":"转",
	"zhǎn":"斩盏展",
	"ruǎn":"软",
	"lún":"轮仑伦沦",
	"dào":"到盗悼道稻",
	"chǐ":"齿耻侈",
	"kěn":"肯垦恳啃",
	"hǔ":"虎",
	"xiē,suò":"些",
	"lǔ":"虏鲁卤",
	"shèn":"肾渗慎",
	"shàng":"尚",
	"guǒ":"果裹",
	"kūn":"昆坤",
	"guó":"国",
	"chāng":"昌猖",
	"chàng":"畅唱",
	"diǎn":"典点碘",
	"gù":"固故顾雇",
	"áng":"昂",
	"zhōng":"忠终钟盅衷",
	"ní,ne":"呢",
	"àn":"岸按案暗",
	"tiè,tiě,tiē":"帖",
	"luó":"罗萝锣箩骡螺逻",
	"kǎi":"凯慨",
	"lǐng,líng":"岭",
	"bài":"败拜",
	"tú":"图徒途涂屠",
	"chuí":"垂锤捶",
	"zhī,zhì":"知织",
	"guāi":"乖",
	"gǎn":"秆赶敢感橄",
	"hé,hè,huó,huò,hú":"和",
	"gōng,gòng":"供",
	"wěi,wēi":"委",
	"cè,zè,zhāi":"侧",
	"pèi":"佩配沛",
	"pò,pǎi":"迫",
	"dí,dì,de":"的",
	"pá":"爬",
	"suǒ":"所索锁琐",
	"jìng":"径竞竟敬静境镜靖",
	"mìng":"命",
	"cǎi,cài":"采",
	"niàn":"念",
	"tān":"贪摊滩瘫",
	"rǔ":"乳辱",
	"pín":"贫",
	"fū":"肤麸孵敷",
	"fèi":"肺废沸费吠",
	"zhǒng":"肿",
	"péng":"朋棚蓬膨硼鹏澎篷",
	"fú,fù":"服",
	"féi":"肥",
	"hūn":"昏婚荤",
	"tù":"兔",
	"hú":"狐胡壶湖蝴弧葫",
	"gǒu":"狗苟",
	"bǎo":"饱宝保",
	"xiǎng":"享响想",
	"biàn":"变遍辨辩辫",
	"dǐ,de":"底",
	"jìng,chēng":"净",
	"fàng":"放",
	"nào":"闹",
	"zhá":"闸铡",
	"juàn,juǎn":"卷",
	"quàn,xuàn":"券",
	"dān,shàn,chán":"单",
	"chǎo":"炒",
	"qiǎn,jiān":"浅",
	"fǎ":"法",
	"xiè,yì":"泄",
	"lèi":"泪类",
	"zhān":"沾粘毡瞻",
	"bó,pō":"泊",
	"pào,pāo":"泡",
	"xiè":"泻卸屑械谢懈蟹",
	"ní,nì":"泥",
	"zé,shì":"泽",
	"pà":"怕帕",
	"guài":"怪",
	"zōng":"宗棕踪",
	"shěn":"审婶",
	"zhòu":"宙昼皱骤咒",
	"kōng,kòng,kǒng":"空",
	"láng,làng":"郎",
	"chèn":"衬趁",
	"gāi":"该",
	"xiáng,yáng":"详",
	"lì,dài":"隶",
	"jū":"居鞠驹",
	"shuā,shuà":"刷",
	"mèng":"孟梦",
	"gū":"孤姑辜咕沽菇箍",
	"jiàng,xiáng":"降",
	"mèi":"妹昧媚",
	"jiě":"姐",
	"jià":"驾架嫁稼",
	"cān,shēn,cēn,sān":"参",
	"liàn":"练炼恋链",
	"xì":"细隙",
	"shào":"绍哨",
	"tuó":"驼驮鸵",
	"guàn":"贯惯灌罐",
	"zòu":"奏揍",
	"chūn":"春椿",
	"bāng":"帮邦梆",
	"dú,dài":"毒",
	"guà":"挂卦褂",
	"kuǎ":"垮",
	"kuà,kū":"挎",
	"náo":"挠",
	"dǎng,dàng":"挡",
	"shuān":"拴栓",
	"tǐng":"挺艇",
	"kuò,guā":"括",
	"shí,shè":"拾",
	"tiāo,tiǎo":"挑",
	"wā":"挖蛙洼",
	"pīn":"拼",
	"shèn,shén":"甚",
	"mǒu":"某",
	"nuó":"挪",
	"gé":"革阁格隔",
	"xiàng,hàng":"巷",
	"cǎo":"草",
	"chá":"茶察茬",
	"dàng":"荡档",
	"huāng":"荒慌",
	"róng":"荣绒容熔融茸蓉溶榕",
	"nán,nā":"南",
	"biāo":"标彪膘",
	"yào":"药耀",
	"kū":"枯哭窟",
	"xiāng,xiàng":"相",
	"chá,zhā":"查",
	"liǔ":"柳",
	"bǎi,bó,bò":"柏",
	"yào,yāo":"要",
	"wāi":"歪",
	"yán,yàn":"研",
	"lí":"厘狸离犁梨璃黎漓篱",
	"qì,qiè":"砌",
	"miàn":"面",
	"kǎn":"砍坎",
	"shuǎ":"耍",
	"nài":"耐奈",
	"cán":"残蚕惭",
	"zhàn":"战站栈绽蘸",
	"bèi,bēi":"背",
	"lǎn":"览懒揽缆榄",
	"shěng,xǐng":"省",
	"xiāo,xuē":"削",
	"zhǎ":"眨",
	"hōng,hǒng,hòng":"哄",
	"xiǎn":"显险",
	"mào,mò":"冒",
	"yǎ,yā":"哑",
	"yìng":"映硬",
	"zuó":"昨",
	"xīng":"星腥猩",
	"pā":"趴",
	"guì":"贵桂跪刽",
	"sī,sāi":"思",
	"xiā":"虾瞎",
	"mǎ,mā,mà":"蚂",
	"suī":"虽",
	"pǐn":"品",
	"mà":"骂",
	"huá,huā":"哗",
	"yān,yàn,yè":"咽",
	"zán,zǎ":"咱",
	"hā,hǎ,hà":"哈",
	"yǎo":"咬舀",
	"nǎ,něi,na,né":"哪",
	"ké,hāi":"咳",
	"xiá":"峡狭霞匣侠暇辖",
	"gǔ,gū":"骨",
	"gāng,gàng":"钢",
	"tiē":"贴",
	"yuè,yào":"钥",
	"kàn,kān":"看",
	"jǔ":"矩举",
	"zěn":"怎",
	"xuǎn":"选癣",
	"zhǒng,zhòng,chóng":"种",
	"miǎo":"秒渺藐",
	"kē":"科棵颗磕蝌",
	"biàn,pián":"便",
	"zhòng,chóng":"重",
	"liǎ":"俩",
	"duàn":"段断缎锻",
	"cù":"促醋簇",
	"shùn":"顺瞬",
	"xiū":"修羞",
	"sú":"俗",
	"qīn":"侵钦",
	"xìn,shēn":"信",
	"huáng":"皇黄煌凰惶蝗蟥",
	"zhuī,duī":"追",
	"jùn":"俊峻骏竣",
	"dài,dāi":"待",
	"xū":"须虚需",
	"hěn":"很狠",
	"dùn":"盾顿钝",
	"lǜ":"律虑滤氯",
	"pén":"盆",
	"shí,sì,yì":"食",
	"dǎn":"胆",
	"táo":"逃桃陶萄淘",
	"pàng":"胖",
	"mài,mò":"脉",
	"dú":"独牍",
	"jiǎo":"狡饺绞脚搅",
	"yuàn":"怨院愿",
	"ráo":"饶",
	"wān":"弯湾豌",
	"āi":"哀哎埃",
	"jiāng,jiàng":"将浆",
	"tíng":"亭庭停蜓廷",
	"liàng":"亮谅辆晾",
	"dù,duó":"度",
	"chuāng":"疮窗",
	"qīn,qìng":"亲",
	"zī":"姿资滋咨",
	"dì":"帝递第蒂缔",
	"chà,chā,chāi,cī":"差",
	"yǎng":"养氧痒",
	"qián":"前钱钳潜黔",
	"mí":"迷谜靡",
	"nì":"逆昵匿腻",
	"zhà,zhá":"炸",
	"zǒng":"总",
	"làn":"烂滥",
	"páo,bāo,pào":"炮",
	"tì":"剃惕替屉涕",
	"sǎ,xǐ":"洒",
	"zhuó":"浊啄灼茁卓酌",
	"xǐ,xiǎn":"洗",
	"qià":"洽恰",
	"pài":"派湃",
	"huó":"活",
	"rǎn":"染",
	"héng":"恒衡",
	"hún":"浑魂",
	"nǎo":"恼脑",
	"jué,jiào":"觉",
	"hèn":"恨",
	"xuān":"宣轩喧",
	"qiè":"窃怯",
	"biǎn,piān":"扁",
	"ǎo":"袄",
	"shén":"神",
	"shuō,shuì,yuè":"说",
	"tuì":"退蜕",
	"chú":"除厨锄雏橱",
	"méi":"眉梅煤霉玫枚媒楣",
	"hái":"孩",
	"wá":"娃",
	"mǔ,lǎo":"姥",
	"nù":"怒",
	"hè":"贺赫褐鹤",
	"róu":"柔揉蹂",
	"bǎng":"绑膀",
	"lěi":"垒蕾儡",
	"rào":"绕",
	"gěi,jǐ":"给",
	"luò":"骆洛",
	"luò,lào":"络",
	"tǒng":"统桶筒捅",
	"gēng":"耕羹",
	"hào":"耗浩",
	"bān":"班般斑搬扳颁",
	"zhū":"珠株诸猪蛛",
	"lāo":"捞",
	"fěi":"匪诽",
	"zǎi,zài":"载",
	"mái,mán":"埋",
	"shāo,shào":"捎稍",
	"zhuō":"捉桌拙",
	"niē":"捏",
	"kǔn":"捆",
	"dū,dōu":"都",
	"sǔn":"损笋",
	"juān":"捐鹃",
	"zhé":"哲辙",
	"rè":"热",
	"wǎn":"挽晚碗惋婉",
	"āi,ái":"挨",
	"mò,mù":"莫",
	"è,wù,ě,wū":"恶",
	"tóng":"桐铜童彤瞳",
	"xiào,jiào":"校",
	"hé,hú":"核",
	"yàng":"样漾",
	"gēn":"根跟",
	"gē":"哥鸽割歌戈",
	"chǔ":"础储楚",
	"pò":"破魄",
	"tào":"套",
	"chái":"柴豺",
	"dǎng":"党",
	"mián":"眠绵棉",
	"shài":"晒",
	"jǐn":"紧锦谨",
	"yùn,yūn":"晕",
	"huǎng,huàng":"晃",
	"shǎng":"晌赏",
	"ēn":"恩",
	"āi,ài":"唉",
	"ā,á,ǎ,à,a":"啊",
	"bà,ba,pí":"罢",
	"zéi":"贼",
	"tiě":"铁",
	"zuān,zuàn":"钻",
	"qiān,yán":"铅",
	"quē":"缺",
	"tè":"特",
	"chéng,shèng":"乘",
	"dí":"敌笛涤嘀嫡",
	"zū":"租",
	"chèng":"秤",
	"mì,bì":"秘泌",
	"chēng,chèn,chèng":"称",
	"tòu":"透",
	"zhài":"债寨",
	"dǎo,dào":"倒",
	"tǎng,cháng":"倘",
	"chàng,chāng":"倡",
	"juàn":"倦绢眷",
	"chòu,xiù":"臭",
	"shè,yè,yì":"射",
	"xú":"徐",
	"háng":"航杭",
	"ná":"拿",
	"wēng":"翁嗡",
	"diē":"爹跌",
	"ài":"爱碍艾隘",
	"gē,gé":"胳搁",
	"cuì":"脆翠悴粹",
	"zàng":"脏葬",
	"láng":"狼廊琅榔",
	"féng":"逢",
	"è":"饿扼遏愕噩鳄",
	"shuāi,cuī":"衰",
	"gāo":"高糕羔篙",
	"zhǔn":"准",
	"bìng":"病",
	"téng":"疼腾誊藤",
	"liáng,liàng":"凉量",
	"táng":"唐堂塘膛糖棠搪",
	"pōu":"剖",
	"xù,chù":"畜",
	"páng,bàng":"旁",
	"lǚ":"旅屡吕侣铝缕履",
	"fěn":"粉",
	"liào":"料镣",
	"shāo":"烧",
	"yān":"烟淹",
	"tāo":"涛掏滔",
	"lào":"涝酪",
	"zhè":"浙蔗",
	"xiāo":"消宵销萧硝箫嚣",
	"hǎi":"海",
	"zhǎng,zhàng":"涨",
	"làng":"浪",
	"rùn":"润闰",
	"tàng":"烫",
	"yǒng,chōng":"涌",
	"huǐ":"悔毁",
	"qiǎo,qiāo":"悄",
	"hài":"害亥骇",
	"jiā,jia,jie":"家",
	"kuān":"宽",
	"bīn":"宾滨彬缤濒",
	"zhǎi":"窄",
	"lǎng":"朗",
	"dú,dòu":"读",
	"zǎi":"宰",
	"shàn,shān":"扇",
	"wà":"袜",
	"xiáng":"祥翔",
	"shuí":"谁",
	"páo":"袍咆",
	"bèi,pī":"被",
	"tiáo,diào,zhōu":"调",
	"yuān":"冤鸳渊",
	"bāo,bō":"剥",
	"ruò":"弱",
	"péi":"陪培赔",
	"niáng":"娘",
	"tōng":"通",
	"néng,nài":"能",
	"nán,nàn,nuó":"难",
	"sāng":"桑",
	"pěng":"捧",
	"dǔ":"堵赌睹",
	"yǎn":"掩眼演衍",
	"duī":"堆",
	"pái,pǎi":"排",
	"tuī":"推",
	"jiào,jiāo":"教",
	"lüè":"掠略",
	"jù,jū":"据",
	"kòng":"控",
	"zhù,zhuó,zhe":"著",
	"jūn,jùn":"菌",
	"lè,lēi":"勒",
	"méng":"萌盟檬朦",
	"cài":"菜",
	"tī":"梯踢剔",
	"shāo,sào":"梢",
	"fù,pì":"副",
	"piào,piāo":"票",
	"shuǎng":"爽",
	"shèng,chéng":"盛",
	"què,qiāo,qiǎo":"雀",
	"xuě":"雪",
	"chí,shi":"匙",
	"xuán":"悬玄漩",
	"mī,mí":"眯",
	"lā,la":"啦",
	"shé,yí":"蛇",
	"léi,lěi,lèi":"累",
	"zhǎn,chán":"崭",
	"quān,juàn,juān":"圈",
	"yín":"银吟淫",
	"bèn":"笨",
	"lóng,lǒng":"笼",
	"mǐn":"敏皿闽悯",
	"nín":"您",
	"ǒu":"偶藕",
	"tōu":"偷",
	"piān":"偏篇翩",
	"dé,děi,de":"得",
	"jiǎ,jià":"假",
	"pán":"盘",
	"chuán":"船",
	"cǎi":"彩睬踩",
	"lǐng":"领",
	"liǎn":"脸敛",
	"māo,máo":"猫",
	"měng":"猛锰",
	"cāi":"猜",
	"háo":"毫豪壕嚎",
	"má":"麻",
	"guǎn":"馆管",
	"còu":"凑",
	"hén":"痕",
	"kāng":"康糠慷",
	"xuán,xuàn":"旋",
	"zhuó,zháo,zhāo,zhe":"着",
	"shuài,lǜ":"率",
	"gài,gě,hé":"盖",
	"cū":"粗",
	"lín,lìn":"淋",
	"qú,jù":"渠",
	"jiàn,jiān":"渐溅",
	"hùn,hún":"混",
	"pó":"婆",
	"qíng":"情晴擎",
	"cǎn":"惨",
	"sù,xiǔ,xiù":"宿",
	"yáo":"窑谣摇遥肴姚",
	"móu":"谋",
	"mì":"密蜜觅",
	"huǎng":"谎恍幌",
	"dàn,tán":"弹",
	"suí":"随",
	"yǐn,yìn":"隐",
	"jǐng,gěng":"颈",
	"shéng":"绳",
	"qí":"骑棋旗歧祈脐畦崎鳍",
	"chóu":"绸酬筹稠愁畴",
	"lǜ,lù":"绿",
	"dā":"搭",
	"kuǎn":"款",
	"tǎ":"塔",
	"qū,cù":"趋",
	"tí,dī,dǐ":"提",
	"jiē,qì":"揭",
	"xǐ":"喜徙",
	"sōu":"搜艘",
	"chā":"插",
	"lǒu,lōu":"搂",
	"qī,jī":"期",
	"rě":"惹",
	"sàn,sǎn":"散",
	"dǒng":"董懂",
	"gé,gě":"葛",
	"pú":"葡菩蒲",
	"zhāo,cháo":"朝",
	"là,luò,lào":"落",
	"kuí":"葵魁",
	"bàng":"棒傍谤",
	"yǐ,yī":"椅",
	"sēn":"森",
	"gùn,hùn":"棍",
	"bī":"逼",
	"zhí,shi":"殖",
	"shà,xià":"厦",
	"liè,liě":"裂",
	"xióng":"雄熊",
	"zàn":"暂赞",
	"yǎ":"雅",
	"chǎng":"敞",
	"zhǎng":"掌",
	"shǔ":"暑鼠薯黍蜀署曙",
	"zuì":"最罪醉",
	"hǎn":"喊罕",
	"jǐng,yǐng":"景",
	"lǎ":"喇",
	"pēn,pèn":"喷",
	"pǎo,páo":"跑",
	"chuǎn":"喘",
	"hē,hè,yè":"喝",
	"hóu":"喉猴",
	"pū,pù":"铺",
	"hēi":"黑",
	"guō":"锅郭",
	"ruì":"锐瑞",
	"duǎn":"短",
	"é":"鹅额讹俄",
	"děng":"等",
	"kuāng":"筐",
	"shuì":"税睡",
	"zhù,zhú":"筑",
	"shāi":"筛",
	"dá,dā":"答",
	"ào":"傲澳懊",
	"pái":"牌徘",
	"bǎo,bǔ,pù":"堡",
	"ào,yù":"奥",
	"fān,pān":"番",
	"là,xī":"腊",
	"huá":"猾滑",
	"rán":"然燃",
	"chán":"馋缠蝉",
	"mán":"蛮馒",
	"tòng":"痛",
	"shàn":"善擅膳赡",
	"zūn":"尊遵",
	"pǔ":"普谱圃浦",
	"gǎng,jiǎng":"港",
	"zēng,céng":"曾",
	"wēn":"温瘟",
	"kě":"渴",
	"zhā":"渣",
	"duò":"惰舵跺",
	"gài":"溉概丐钙",
	"kuì":"愧",
	"yú,tōu":"愉",
	"wō":"窝蜗",
	"cuàn":"窜篡",
	"qún":"裙群",
	"qiáng,qiǎng,jiàng":"强",
	"shǔ,zhǔ":"属",
	"zhōu,yù":"粥",
	"sǎo":"嫂",
	"huǎn":"缓",
	"piàn":"骗",
	"mō":"摸",
	"shè,niè":"摄",
	"tián,zhèn":"填",
	"gǎo":"搞稿镐",
	"suàn":"蒜算",
	"mēng,méng,měng":"蒙",
	"jīn,jìn":"禁",
	"lóu":"楼娄",
	"lài":"赖癞",
	"lù,liù":"碌",
	"pèng":"碰",
	"léi":"雷",
	"báo":"雹",
	"dū":"督",
	"nuǎn":"暖",
	"xiē":"歇楔蝎",
	"kuà":"跨胯",
	"tiào,táo":"跳",
	"é,yǐ":"蛾",
	"sǎng":"嗓",
	"qiǎn":"遣谴",
	"cuò":"错挫措锉",
	"ǎi":"矮蔼",
	"shǎ":"傻",
	"cuī":"催摧崔",
	"tuǐ":"腿",
	"chù":"触矗",
	"jiě,jiè,xiè":"解",
	"shù,shǔ,shuò":"数",
	"mǎn":"满",
	"liū,liù":"溜",
	"gǔn":"滚",
	"sāi,sài,sè":"塞",
	"bì,pì":"辟",
	"dié":"叠蝶谍碟",
	"féng,fèng":"缝",
	"qiáng":"墙",
	"piē,piě":"撇",
	"zhāi":"摘斋",
	"shuāi":"摔",
	"mó,mú":"模",
	"bǎng,bàng":"榜",
	"zhà":"榨乍诈",
	"niàng":"酿",
	"zāo":"遭糟",
	"suān":"酸",
	"cháng,shang":"裳",
	"sòu":"嗽",
	"là":"蜡辣",
	"qiāo":"锹敲跷",
	"zhuàn":"赚撰",
	"wěn":"稳吻紊",
	"bí":"鼻荸",
	"mó":"膜魔馍摹蘑",
	"xiān,xiǎn":"鲜",
	"yí,nǐ":"疑",
	"gāo,gào":"膏",
	"zhē":"遮",
	"duān":"端",
	"màn":"漫慢曼幔",
	"piāo,piǎo,piào":"漂",
	"lòu":"漏陋",
	"sài":"赛",
	"nèn":"嫩",
	"dèng":"凳邓瞪",
	"suō,sù":"缩",
	"qù,cù":"趣",
	"sā,sǎ":"撒",
	"tàng,tāng":"趟",
	"chēng":"撑",
	"zēng":"增憎",
	"cáo":"槽曹",
	"héng,hèng":"横",
	"piāo":"飘",
	"mán,mén":"瞒",
	"tí":"题蹄啼",
	"yǐng":"影颖",
	"bào,pù":"暴",
	"tà":"踏蹋",
	"kào":"靠铐",
	"pì":"僻屁譬",
	"tǎng":"躺",
	"dé":"德",
	"mó,mā":"摩",
	"shú":"熟秫赎",
	"hū,hú,hù":"糊",
	"pī,pǐ":"劈",
	"cháo":"潮巢",
	"cāo":"操糙",
	"yàn,yān":"燕",
	"diān":"颠掂",
	"báo,bó,bò":"薄",
	"cān":"餐",
	"xǐng":"醒",
	"zhěng":"整拯",
	"zuǐ":"嘴",
	"zèng":"赠",
	"mó,mò":"磨",
	"níng":"凝狞柠",
	"jiǎo,zhuó":"缴",
	"cā":"擦",
	"cáng,zàng":"藏",
	"fán,pó":"繁",
	"bì,bei":"臂",
	"bèng":"蹦泵",
	"pān":"攀潘",
	"chàn,zhàn":"颤",
	"jiāng,qiáng":"疆",
	"rǎng":"壤攘",
	"jiáo,jué,jiào":"嚼",
	"rǎng,rāng":"嚷",
	"chǔn":"蠢",
	"lòu,lù":"露",
	"náng,nāng":"囊",
	"dǎi":"歹",
	"rǒng":"冗",
	"hāng,bèn":"夯",
	"āo,wā":"凹",
	"féng,píng":"冯",
	"yū":"迂淤",
	"xū,yù":"吁",
	"lèi,lē":"肋",
	"kōu":"抠",
	"lūn,lún":"抡",
	"jiè,gài":"芥",
	"xīn,xìn":"芯",
	"chā,chà":"杈",
	"xiāo,xiào":"肖",
	"zhī,zī":"吱",
	"ǒu,ōu,òu":"呕",
	"nà,nè":"呐",
	"qiāng,qiàng":"呛",
	"dùn,tún":"囤",
	"háng,kēng":"吭",
	"shǔn":"吮",
	"diàn,tián":"佃",
	"sì,cì":"伺",
	"zhǒu":"肘帚",
	"diàn,tián,shèng":"甸",
	"páo,bào":"刨",
	"lìn":"吝赁躏",
	"duì,ruì,yuè":"兑",
	"zhuì":"坠缀赘",
	"kē,kě":"坷",
	"tuò,tà,zhí":"拓",
	"fú,bì":"拂",
	"níng,nǐng,nìng":"拧",
	"ǎo,ào,niù":"拗",
	"kē,hē":"苛",
	"shān,shàn":"苫",
	"yǎn,yān":"奄",
	"hē,a,kē":"呵",
	"kā,gā":"咖",
	"biǎn":"贬匾",
	"jiǎo,yáo":"侥",
	"chà,shā":"刹",
	"āng":"肮",
	"wèng":"瓮",
	"nüè,yào":"疟",
	"páng":"庞螃",
	"méng,máng":"氓",
	"gē,yì":"疙",
	"jǔ,jù":"沮",
	"zú,cù":"卒",
	"nìng":"泞",
	"chǒng":"宠",
	"wǎn,yuān":"宛",
	"mí,mǐ":"弥",
	"qì,qiè,xiè":"契",
	"xié,jiā":"挟",
	"duǒ,duò":"垛",
	"jiá":"荚颊",
	"zhà,shān,shi,cè":"栅",
	"bó,bèi":"勃",
	"zhóu,zhòu":"轴",
	"nüè":"虐",
	"liě,liē,lié,lie":"咧",
	"dǔn":"盹",
	"xūn":"勋",
	"yō,yo":"哟",
	"mī":"咪",
	"qiào,xiào":"俏",
	"hóu,hòu":"侯",
	"pēi":"胚",
	"tāi":"胎",
	"luán":"峦",
	"sà":"飒萨",
	"shuò":"烁",
	"xuàn":"炫",
	"píng,bǐng":"屏",
	"nà,nuó":"娜",
	"bà,pá":"耙",
	"gěng":"埂耿梗",
	"niè":"聂镊孽",
	"mǎng":"莽",
	"qī,xī":"栖",
	"gǔ,jiǎ":"贾",
	"chěng":"逞",
	"pēng":"砰烹",
	"lào,láo":"唠",
	"bàng,bèng":"蚌",
	"gōng,zhōng":"蚣",
	"li,lǐ,lī":"哩",
	"suō":"唆梭嗦",
	"hēng":"哼",
	"zāng":"赃",
	"qiào":"峭窍撬",
	"mǎo":"铆",
	"ǎn":"俺",
	"sǒng":"耸",
	"jué,juè":"倔",
	"yīn,yān,yǐn":"殷",
	"guàng":"逛",
	"něi":"馁",
	"wō,guō":"涡",
	"lào,luò":"烙",
	"nuò":"诺懦糯",
	"zhūn":"谆",
	"niǎn,niē":"捻",
	"qiā":"掐",
	"yè,yē":"掖",
	"chān,xiān,càn,shǎn":"掺",
	"dǎn,shàn":"掸",
	"fēi,fěi":"菲",
	"qián,gān":"乾",
	"shē":"奢赊",
	"shuò,shí":"硕",
	"luō,luó,luo":"啰",
	"shá":"啥",
	"hǔ,xià":"唬",
	"tuò":"唾",
	"bēng":"崩",
	"dāng,chēng":"铛",
	"xiǎn,xǐ":"铣",
	"jiǎo,jiáo":"矫",
	"tiáo":"笤",
	"kuǐ,guī":"傀",
	"xìn":"衅",
	"dōu":"兜",
	"jì,zhài":"祭",
	"xiáo":"淆",
	"tǎng,chǎng":"淌",
	"chún,zhūn":"淳",
	"shuàn":"涮",
	"dāng":"裆",
	"wèi,yù":"尉",
	"duò,huī":"堕",
	"chuò,chāo":"绰",
	"bēng,běng,bèng":"绷",
	"zōng,zèng":"综",
	"zhuó,zuó":"琢",
	"chuǎi,chuài,chuāi,tuán,zhuī":"揣",
	"péng,bāng":"彭",
	"chān":"搀",
	"cuō":"搓",
	"sāo":"搔",
	"yē":"椰",
	"zhuī,chuí":"椎",
	"léng,lēng,líng":"棱",
	"hān":"酣憨",
	"sū":"酥",
	"záo":"凿",
	"qiáo,qiào":"翘",
	"zhā,chā":"喳",
	"bǒ":"跛",
	"gé,há":"蛤",
	"qiàn,kàn":"嵌",
	"bāi":"掰",
	"ā,yān":"腌",
	"wàn":"腕",
	"dūn,duì":"敦",
	"kuì,huì":"溃",
	"jiǒng":"窘",
	"sāo,sǎo":"骚",
	"pìn":"聘",
	"bǎ":"靶",
	"xuē":"靴薛",
	"hāo":"蒿",
	"léng":"楞",
	"kǎi,jiē":"楷",
	"pín,bīn":"频",
	"zhuī":"锥",
	"tuí":"颓",
	"sāi":"腮",
	"liù,liú":"馏",
	"nì,niào":"溺",
	"qǐn":"寝",
	"luǒ":"裸",
	"miù":"谬",
	"jiǎo,chāo":"剿",
	"āo,áo":"熬",
	"niān":"蔫",
	"màn,wàn":"蔓",
	"chá,chā":"碴",
	"xūn,xùn":"熏",
	"tiǎn":"舔",
	"sēng":"僧",
	"dá,da":"瘩",
	"guǎ":"寡",
	"tuì,tùn":"褪",
	"niǎn":"撵碾",
	"liāo,liáo":"撩",
	"cuō,zuǒ":"撮",
	"ruǐ":"蕊",
	"bàng,páng":"磅",
	"cháo,zhāo":"嘲",
	"biē":"憋鳖",
	"hēi,mò":"嘿",
	"chuáng,zhuàng":"幢",
	"jī,qǐ":"稽",
	"lǒu":"篓",
	"lǐn":"凛檩",
	"biē,biě":"瘪",
	"lǎo,lào,liáo":"潦",
	"chéng,dèng":"澄",
	"léi,lèi":"擂",
	"piáo":"瓢",
	"shà":"霎",
	"má,mò":"蟆",
	"qué":"瘸",
	"liáo,liǎo":"燎",
	"liǎo,liào":"瞭",
	"sāo,sào":"臊",
	"mí,méi":"糜",
	"ái":"癌",
	"tún":"臀",
	"huō,huò,huá":"豁",
	"pù,bào":"瀑",
	"chuō":"戳",
	"zǎn,cuán":"攒",
	"cèng":"蹭",
	"bò,bǒ":"簸",
	"bù,bó":"簿",
	"bìn":"鬓",
	"suǐ":"髓",
	"ráng":"瓤"
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	// 带音标字符。
	module.exports = {
	  "ā": "a1",
	  "á": "a2",
	  "ǎ": "a3",
	  "à": "a4",
	  "ē": "e1",
	  "é": "e2",
	  "ě": "e3",
	  "è": "e4",
	  "ō": "o1",
	  "ó": "o2",
	  "ǒ": "o3",
	  "ò": "o4",
	  "ī": "i1",
	  "í": "i2",
	  "ǐ": "i3",
	  "ì": "i4",
	  "ū": "u1",
	  "ú": "u2",
	  "ǔ": "u3",
	  "ù": "u4",
	  "ü": "v0",
	  "ǘ": "v2",
	  "ǚ": "v3",
	  "ǜ": "v4",
	  "ń": "n2",
	  "ň": "n3",
	  "": "m2"
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = [
		{
			"city": "南京",
			"province": "江苏",
			"name": "康瑜",
			"college": "东南大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "李沁怡",
			"college": "复旦大学"
		},
		{
			"city": "杭州",
			"province": "浙江",
			"name": "韩熠星",
			"college": "浙江大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "刘非迟",
			"college": "同济大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "戴汉宸",
			"college": "中央财经大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "李明翰",
			"college": "中央民族大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "雒洛",
			"college": "上海交通大学"
		},
		{
			"city": "广州",
			"province": "广东",
			"name": "梅逸云",
			"college": "中山大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "马旭骋",
			"college": "上海交通大学"
		},
		{
			"city": "厦门",
			"province": "福建",
			"name": "杨逸凡",
			"college": "厦门大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "柴沛霖",
			"college": "清华大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "刘雷",
			"college": "北京航空航天大学"
		},
		{
			"city": "武汉",
			"province": "湖北",
			"name": "骆浩毅",
			"college": "武汉大学"
		},
		{
			"city": "武汉",
			"province": "湖北",
			"name": "李昊",
			"college": "武汉大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "金子天",
			"college": "北京航空航天大学"
		},
		{
			"city": "香港",
			"province": "香港",
			"name": "董昕瑜",
			"college": "香港大学"
		},
		{
			"city": "厦门",
			"province": "福建",
			"name": "刘舜威",
			"college": "厦门大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "周清原",
			"college": "清华大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "魏乐颖",
			"college": "北京邮电大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "孙柏扬",
			"college": "北京理工大学"
		},
		{
			"city": "杭州",
			"province": "浙江",
			"name": "王冠杰",
			"college": "浙江大学"
		},
		{
			"city": "北京",
			"province": "河北",
			"name": "任诗雨",
			"college": "对外经济贸易大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "李金洋",
			"college": "同济大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "蔺立萱",
			"college": "北京航空航天大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "古丽娜",
			"college": "清华大学"
		},
		{
			"city": "武汉",
			"province": "湖北",
			"name": "张钊",
			"college": "武汉大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "李哲昀",
			"college": "复旦大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "刘浩然",
			"college": "清华大学"
		},
		{
			"city": "成都",
			"province": "四川",
			"name": "陈卓文",
			"college": "四川大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "陈颖婕",
			"college": "北京大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "郑瑜",
			"college": "清华大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "闫婷钰",
			"college": "同济大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "郝亦雯",
			"college": "同济大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "胡焘",
			"college": "同济大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "靳健",
			"college": "同济大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "聂昭颖",
			"college": "清华大学"
		},
		{
			"city": "合肥",
			"province": "安徽",
			"name": "邓琮之",
			"college": "中国科学技术大学"
		},
		{
			"city": "南京",
			"province": "江苏",
			"name": "孙浩",
			"college": "南京航空航天大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "陈亚舟",
			"college": "清华大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "杨晓睿",
			"college": "上海财经大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "田桑榆",
			"college": "同济大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "陈成",
			"college": "同济大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "王雅清",
			"college": "上海财经大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "黄宇秋",
			"college": "上海交通大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "赵泽宇",
			"college": "中央财经大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "金泽宇",
			"college": "北京交通大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "刘霄旸",
			"college": "北京师范大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "胡翊",
			"college": "对外经济贸易大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "周春晖",
			"college": "北京第二外国语学院"
		},
		{
			"city": "哈尔滨",
			"province": "黑龙江",
			"name": "李聪",
			"college": "哈尔滨工业大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "张志远",
			"college": "华东政法大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "徐新鑫",
			"college": "同济大学"
		},
		{
			"city": "上海",
			"province": "上海",
			"name": "田桑瑜",
			"college": "同济大学"
		},
		{
			"city": "成都",
			"province": "四川",
			"name": "孟菀芸",
			"college": "四川大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "王子烈",
			"college": "北京航空航天大学"
		},
		{
			"city": "南京",
			"province": "江苏",
			"name": "许宜臻",
			"college": "南京大学"
		},
		{
			"city": "广州",
			"province": "广东",
			"name": "严梓夫",
			"college": "华南理工大学"
		},
		{
			"city": "北京",
			"province": "北京",
			"name": "杨松涛",
			"college": "中国石油大学"
		},
		{
			"city": "亚特兰大",
			"province": "美国",
			"name": "方德治",
			"college": "佐治亚理工学院"
		},
		{
			"city": "波士顿",
			"province": "美国",
			"name": "吕梦帆",
			"college": "布兰迪斯大学"
		}
	]

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map