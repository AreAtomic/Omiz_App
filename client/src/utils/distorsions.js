const THREE = window.THREE

const mountainUniforms = {
  // x, y, z
  uFreq: new THREE.Uniform(new THREE.Vector3(3, 6, 10)),
  uAmp: new THREE.Uniform(new THREE.Vector3(30, 30, 20)),
};

let nsin = (val) => Math.sin(val) * 0.5 + 0.5;

export const mountainDistortion = {
  uniforms: mountainUniforms,
  getDistortion: `

      uniform vec3 uAmp;
      uniform vec3 uFreq;

      #define PI 3.14159265358979

          float nsin(float val){
          return sin(val) * 0.5+0.5;
          }

      vec3 getDistortion(float progress){

              float movementProgressFix = 0.02;
              return vec3(
                  cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
                  nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(movementProgressFix * PI * uFreq.y + uTime) * uAmp.y,
                  nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(movementProgressFix * PI * uFreq.z + uTime) * uAmp.z
              );
          }
  `,
  getJS: (progress, time) => {
    let movementProgressFix = 0.02;

    let uFreq = mountainUniforms.uFreq.value;
    let uAmp = mountainUniforms.uAmp.value;

    let distortion = new THREE.Vector3(
      Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
        Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
      nsin(progress * Math.PI * uFreq.y + time) * uAmp.y -
        nsin(movementProgressFix * Math.PI * uFreq.y + time) * uAmp.y,
      nsin(progress * Math.PI * uFreq.z + time) * uAmp.z -
        nsin(movementProgressFix * Math.PI * uFreq.z + time) * uAmp.z
    );

    let lookAtAmp = new THREE.Vector3(2, 2, 2);
    let lookAtOffset = new THREE.Vector3(0, 0, -5);
    return distortion.multiply(lookAtAmp).add(lookAtOffset);
  },
};
