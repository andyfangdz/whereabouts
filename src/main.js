var THREE = require('../vendor_build/three');
var TWEEN = require('tween.js');
var d3 = require('d3');
var $ = require('jquery');
 
var _sort = require('./sortbykey');

var students = require('../data/data.json');

require('./main.css');

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
    function renderScene(data, entrance) {
        count = data.length;
        _sort(data, "name");
        var entry = d3.select("#container")
        .selectAll("div")
            .data(data)
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
        if (entrance)
            entry.each(awayObjectify);
        else
            entry.each(objectify);
        console.log(entrance);
        transform('helix');
    }
    function clearScene() {
        if (controls) {
            controls.reset();
        }
        d3.select("#container").selectAll("div").remove();
        for( var i = scene.children.length - 1; i >= 0; i--) {
            obj = scene.children[i];
            scene.remove(obj);
        }
    }
    
    function filterData(property, value) {
        function crit(data) {
            return data[property] == value;
        }
        transform('away');
        function stepTwo(entrance) {
        clearScene();
        $('#container').css('visibility', 'hidden');
        if (property && value) {
            renderScene(students.filter(crit), entrance);
        }
        
        else {
            renderScene(students, entrance);
        }
        $('#container').css('visibility', 'visible');
        renderer = new THREE.CSS3DRenderer();
        renderer.setSize(width, height);
        renderer.domElement.style.position = 'absolute';

        document.getElementById('container').appendChild(renderer.domElement);
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.rotateSpeed = 0.5;
        controls.minDistance = 100;
        controls.maxDistance = 6000;
        controls.addEventListener('change', render);

        }
        if (property == 'initial') {
            stepTwo();
        }
        else {
            setTimeout(stepTwo.bind(this, 'away'), 3000);
        }
    }


    function setData(d, i) {
        var vector, phi, theta;

        var random = new THREE.Object3D();
        //random.position.x = 0;
        //random.position.y = 0;
        //random.position.z = 0;
        random.position.x = Math.random() * 4000 - 2000;
        random.position.y = Math.random() * 4000 - 2000;
        random.position.z = Math.random() * 4000 - 2000;
        d['random'] = random;

        var sphere = new THREE.Object3D();
        vector = new THREE.Vector3();
        console.log(count);
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
        phi = (i + 6) * 0.50 + Math.PI;
        helix.position.x = 400 * Math.sin(phi);
        helix.position.y = - (i * 32) + 200 * count / 12 ;
        helix.position.z = 400 * Math.cos(phi);
        vector.x = helix.position.x * 2;
        vector.y = helix.position.y;
        vector.z = helix.position.z * 2;
        helix.lookAt(vector);
        d['helix'] = helix;

        var grid = new THREE.Object3D();
        grid.position.x = (( i % 5 ) * 200) - 400;
        grid.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 200 ) + 400;
        grid.position.z = - ((Math.floor( i / 25 )) * 500 - ((Math.floor( count / 25 )) * 250));
        d['grid'] = grid;

        var away = new THREE.Object3D();
        away.position.x = 0;
        away.position.y = 0;
        away.position.z = 0;
        d['away'] = away;
    }

    function objectify(d) {
        var object = new THREE.CSS3DObject(this);
        var entrance = 'random';
        object.position.set(d[entrance].position.x, d[entrance].position.y, d[entrance].position.z)
        //console.log(object.position);
        scene.add(object);
    }

    function awayObjectify(d) {
        var object = new THREE.CSS3DObject(this);
        var entrance = 'away';
        object.position.set(d[entrance].position.x, d[entrance].position.y, d[entrance].position.z)
        //console.log(object.position);
        scene.add(object);
    }

    filterData('initial');
    
    
    window.filterData = filterData;

    
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

window.render = render;
window.animate = animate;

$('.province').click(function(){
    window.filterData("province", $(this).data('province'));
})
