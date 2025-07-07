vec3 coords = normal;
coords.y += uTime;
vec3 noisePattern = vec3(noise3D(coords));

float pattern = wave(noisePattern);
// 
float rnd = random(position);
float pulse = sin(uTime * 200. + rnd * 10.);
float dopDisplacement = (rnd + pulse) * .1;

    // 
    // vPosition = position;
    // vNormal = normal;
    // vUv = uv;
vDisplaysment = pattern;

    //
float displacement = vDisplaysment * 0.3 + dopDisplacement;
transformed += normalize(objectNormal) * displacement;