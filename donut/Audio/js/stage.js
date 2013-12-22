var Stage = function(){
	var Wide = High = 600,
		scene, camera, renderer, dLight;

	var initThree = function(){
		renderer = new THREE.WebGLRenderer({ antialias: true });
	    renderer.setSize(Wide, High);
	    document.getElementById('frame').appendChild(renderer.domElement);
		renderer.setClearColor(0xFFFFFF, 1.0);
		renderer.shadowMapEnabled = true;
		scene = new THREE.Scene();
	},
	setCamera = function(){
		camera = new THREE.PerspectiveCamera( 45 , Wide / High , 1 , 10000 );
		camera.position.x = 400;
		camera.position.y = 400;
		camera.position.z = 400;
		camera.up.x = 0;
		camera.up.y = 0;
		camera.up.z = 1;
		camera.lookAt( {x:0, y:0, z:0 } );
  	},
  	setLight = function(){
  		var pLight, aLight;
  		dLight = new THREE.DirectionalLight(0xffffff, 1, 0);
  		dLight.position.set(0, 0, 250);
  		dLight.position.multiplyScalar(50);
  		scene.add(dLight);

  		var d = 50;
  		dLight.castShadow = true;
		dLight.shadowCameraLeft = -d;
		dLight.shadowCameraRight = d;
		dLight.shadowCameraTop = d;
		dLight.shadowCameraBottom = -d;

		dLight.shadowCameraFar = 3500;
		dLight.shadowBias = -0.001;
		dLight.shadowDarkness = 0.35;

		pLight = new THREE.PointLight(0xffffff, 1, 0);
    	pLight.position.set(200, 100, 250);
    	scene.add(pLight);
  	},
  	addObj = function(){
  		var groundGeo = new THREE.PlaneGeometry(200, 200);
  		var groundMat = new THREE.MeshPhongMaterial({ambient: 0x0000ff/*蓝*/, color: 0x00ff00/*绿*/, specular: 0xff0000/*红*/});
		// groundMat.color.setHSL( 0.095, 1, 0.75 );
  		var ground = new THREE.Mesh(groundGeo, groundMat);
  		// ground.position.set(0,0,-150);
  		ground.rotation.x = -Math.PI/4;
  		ground.position.y = 0;
  		scene.add(ground);
  		ground.receiveShadow = true;
  	},
  	animate = function(){
  		renderer.clear();
		renderer.render(scene, camera);
		window.requestAnimationFrame(animate);
  	};
	return {
		init: function(){
			initThree();
			setCamera();
			setLight();
			addObj();

			renderer.clear();
			renderer.render(scene, camera);

			animate();
		}
	};
}();