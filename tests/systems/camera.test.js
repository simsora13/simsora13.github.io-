/* global assert, process, setup, suite, test */
var entityFactory = require('../helpers').entityFactory;

suite('camera system', function () {
  setup(function (done) {
    var el = this.el = entityFactory();
    el.addEventListener('loaded', function () {
      done();
    });
  });

  suite('setActiveCamera', function () {
    test('sets new active camera on scene', function () {
      var el = this.el;
      el.setAttribute('camera', '');
      assert.equal(el.sceneEl.camera, el.components.camera.camera);
    });

    test('switches active camera', function (done) {
      var sceneEl = this.el.sceneEl;
      var camera1El = document.createElement('a-entity');
      var camera2El = document.createElement('a-entity');
      camera1El.setAttribute('camera', 'active: false');
      sceneEl.appendChild(camera1El);
      camera2El.setAttribute('camera', 'active: true');
      sceneEl.appendChild(camera2El);
      process.nextTick(function () {
        assert.notOk(camera1El.getAttribute('camera').active);
        sceneEl.systems.camera.setActiveCamera(camera1El, camera1El.components.camera.camera);
        assert.ok(camera1El.getAttribute('camera').active);
        assert.notOk(camera2El.getAttribute('camera').active);
        done();
      });
    });

    test('disable inactive cameras', function (done) {
      var sceneEl = this.el.sceneEl;
      var cameraEl = document.createElement('a-entity');
      cameraEl.setAttribute('camera', 'active: false');
      sceneEl.appendChild(cameraEl);

      var camera2El = document.createElement('a-entity');
      camera2El.setAttribute('camera', 'active: false');
      sceneEl.appendChild(camera2El);

      process.nextTick(function () {
        cameraEl.setAttribute('camera', 'active: true');
        camera2El.setAttribute('camera', 'active: true');
        assert.notOk(cameraEl.getAttribute('camera').active);
        assert.ok(camera2El.getAttribute('camera').active, true);
        assert.equal(camera2El.components.camera.camera, sceneEl.camera);
        done();
      });
    });

    test('removes the default camera', function (done) {
      var cameraEl2 = document.createElement('a-entity');
      var sceneEl = this.el.sceneEl;
      cameraEl2.setAttribute('camera', 'active: true');
      process.nextTick(function () {
        assert.ok(sceneEl.querySelector('[data-aframe-default-camera]'));
        sceneEl.appendChild(cameraEl2);
        // Need to setTimeout to wait for scene to remove element.
        setTimeout(function () {
          assert.notOk(sceneEl.querySelector('[data-aframe-default-camera]'));
          done();
        });
      });
    });
  });
});
