var Stage = function(){
	var Wide = High = document.documentElement.clientWidth,
		scene, camera, renderer, dLight, pLight, aLight;
	var cubeList = [];
	window.cubeRotate = new THREE.Object3D;

	var initThree = function(){
		renderer = new THREE.WebGLRenderer({ antialias: true });
	    renderer.setSize(Wide, High);
	    document.getElementById('frame').appendChild(renderer.domElement);
		renderer.setClearColor(0x000000, 1.0);
		renderer.shadowMapEnabled = true;
		scene = new THREE.Scene();
		scene.add(cubeRotate);
	},
	setCamera = function(){
		camera = new THREE.PerspectiveCamera( 45 , Wide / High , 1 , 10000 );
		camera.position.set(400, 400,400);
		camera.up.x = 0;
		camera.up.y = 0;
		camera.up.z = 1;
		scene.add(camera);
		camera.lookAt( {x:0, y:0, z:0 } );
  	},
  	setLight = function(){
  		dLight = new THREE.DirectionalLight(0xffffff, .5);
  		dLight.position.set(400, 400, 500);
  		scene.add(dLight);

  		var d = 10;
  		dLight.castShadow = true;
		dLight.shadowCameraLeft = -d;
		dLight.shadowCameraRight = d;
		dLight.shadowCameraTop = d;
		dLight.shadowCameraBottom = -d;

		dLight.shadowCameraFar = 3500;
		dLight.shadowBias = -0.001;
		dLight.shadowDarkness = 0.35;

		var spLight = new THREE.PointLight(0xffffff, 2, 500);
    	scene.add(spLight);
    	spLight.position.set(200,200,300);

		pLight = new THREE.PointLight('gold', 3, 300);
    	scene.add(pLight);
    	pLight.position.set(-200,-200,200)
  	},
  	addCoord = function(){
  		var op = new THREE.Vector3(0, 0, 0),
  			xp = new THREE.Vector3(400, 0, 0),
  			yp = new THREE.Vector3(0, 400, 0),
  			zp = new THREE.Vector3(0, 0, 400);
  		var xGeo = new THREE.Geometry(),
  			yGeo = new THREE.Geometry(),
  			zGeo = new THREE.Geometry();

  		xGeo.vertices.push(op, xp);
  		xGeo.colors.push(new THREE.Color(0xffffff));
  		yGeo.vertices.push(op, yp);
  		yGeo.colors.push(new THREE.Color(0xffffff));
  		zGeo.vertices.push(op, zp);
  		zGeo.colors.push(new THREE.Color(0xffffff));

  		var material = new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors});

  		var xLine = new THREE.Line(xGeo, material),
  			yLine = new THREE.Line(yGeo, material),
  			zLine = new THREE.Line(zGeo, material);
  		scene.add(xLine);
  		scene.add(yLine);
  		scene.add(zLine);
  	},
  	cube = function(p, h){
		var geo = new THREE.CubeGeometry(10,10,h);
		var mat = new THREE.MeshPhongMaterial({
				ambient: '#fa753b',
				specular: '#a9fcff',
				color: '#00abb1',
				emissive: '#006063',
				shininess: 100
			});
		var cube = new THREE.Mesh(geo, mat);
		cube.castShadow = true;
		cube.visible = false;

		scene.add(cube);
		cube.position.set(p.x, p.y, h/2);
		cubeList.push(cube);
  	},
  	addCube = function(h){
		var H = h || 10;
  		for(var x = -8; x < 8; x++){
  			for(var y = -8; y < 8; y++){
  				cube({'x':20*x,'y':20*y}, H);
  			}
  		}
  		cubeList.sort(sortCube);
  		cubeRotate.add(cubeList);
  	},
  	addObj = function(){
  		addCoord();

  		var groundGeo = new THREE.PlaneGeometry(320, 320);
  		var groundMat = new THREE.MeshPhongMaterial({ambient: 0x0000ff/*蓝*/, color: 0xffffff});
  		var ground = new THREE.Mesh(groundGeo, groundMat);
  		scene.add(ground);
  		ground.receiveShadow = true;
  		ground.position.set(0,0,0);

  		addCube();
  	},
  	animate = function(){
  		var time = Date.now() * 0.0005;
  		pLight.position.x = Math.cos(time) * 200;
  		pLight.position.y = Math.sin(time * 0.5) * 200;

		renderer.render(scene, camera);
		requestAnimationFrame(animate);
  	},
  	onWindowResize = function(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	},
	letDance = function(data){
		var d = Array.prototype.slice.call(data);
		d = d.sort(function(a,b){
			if(a > b)
				return 1;
			else
				return -1;
		});
		for(var i in cubeList){
			var cube = cubeList[i];
			var z = Math.abs(d[i]);
			if(z > 100){
				var del = Math.ceil(z-100) / 10;
				z = Math.pow(del,2)/2;
				cube.visible = true;
				cube.scale.setZ(z);
				cube.position.z = z*5;
			}else
				cube.visible = false;
		}
	},
	sortCube = function(a,b){
		var pa = a.position,
			pb = b.position;

		if((Math.abs(pa.x) + Math.abs(pa.y)) > (Math.abs(pb.x) + Math.abs(pb.y)))
			return 1;
		else
			return -1;
	}
	return {
		init: function(){
			initThree();
			setCamera();
			setLight();
			addObj();

			renderer.clear();
			renderer.render(scene, camera);

			animate();

			window.addEventListener('resize', onWindowResize, false);
			document.getElementById('frame').onmousewheel = function(e){e.preventDefault();camera.position.x += e.wheelDelta * 0.1;}
		},
		dance: letDance
	};
}();