////////////////////////////////////////////////////////////////////////////////
// OrbitControls class //
////////////////////////////////////////////////////////////////////////////////
var rotateStart = new THREE.Vector2();

////////////////////////////////////////////////////////////////////////////////
// OrbitControls constructor
// camera: THREE.Camera
// display: RotationDisplay
// domElement: to add mouse listener events
//
// during update, the camera position will be set at [0, 0, dollyDistance] and lookAt [0, 0, 0]
// use the mouse to rotate the target
////////////////////////////////////////////////////////////////////////////////
THREE.OrbitControls = function (camera, display, domElement){
  this.camera = camera;
  this.display = display;
  this.domElement = domElement;
  this.dollyDistance = this.dollyDistance || this.camera.position.z;
  this.target = new THREE.Vector3(0, 0, 0);
  this.enabled = true;

  var rotateStart = new THREE.Vector2();
  var scope = this;
  
  THREE.OrbitControls.prototype.update = function(delta){
    if (this.maxDollyDistance)
      this.dollyDistance = Math.min(this.maxDollyDistance, this.dollyDistance);
    this.camera.position.set(0, 0, this.dollyDistance);
  }
  
  var DOLLY_FACTOR = 1.05;
  THREE.OrbitControls.prototype.dollyOut = function(){
    this.dollyDistance *= DOLLY_FACTOR;
  }
  
  THREE.OrbitControls.prototype.dollyIn = function(){
    this.dollyDistance /= DOLLY_FACTOR;
  }

  function onMouseDown( event ) {
    rotateStart.set( event.clientX, event.clientY );
    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mouseup', onMouseUp, false );
  }

  var ROTATE_FACTOR = 360; // how many degrees to rotate for each screen travelled
  function onMouseMove( event ) {
    if (!scope.enabled)
      return;
    var rotateEnd = new THREE.Vector2( event.clientX, event.clientY );
    var rotateDelta = new THREE.Vector2().subVectors(rotateEnd, rotateStart);
    rotateStart.copy(rotateEnd);
    rotateDelta.x /= canvasWidth;
    rotateDelta.y /= canvasHeight;
    rotateDelta.multiplyScalar(ROTATE_FACTOR * Math.PI / 180);
    scope.display.rotateXY(rotateDelta);
  }


  function onMouseUp( event ) {
      document.removeEventListener( 'mousemove', onMouseMove, false );
      document.removeEventListener( 'mouseup', onMouseUp, false );
  }

  function onMouseWheel( event ) {
		// this is needed when the program is inside an iframe
		// to prevent scrolling the whole page
		event.preventDefault();
    if (!scope.enabled)
      return;
		var delta = 0;
		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
			delta = event.wheelDelta;
		} else if ( event.detail ) { // Firefox
			delta = - event.detail;
		}
		if ( delta > 0 ) {
			scope.dollyIn();
		} else {
			scope.dollyOut();
		}
	}

  // camera move control
	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false ); // prevent menu from showing
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox



}