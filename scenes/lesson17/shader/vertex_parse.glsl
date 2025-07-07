uniform float uTime;
// varying vec3 vPosition;
// varying vec3 vNormal;
// varying vec2 vUv;
varying float vDisplaysment;

// #define PI  3.1415

float smoothMod(float axis, float amp, float rad) {
    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
}
float fit(float unscaled, float orMin, float orMax, float minAllowed, float maxAllowed) {
    return (maxAllowed - minAllowed) * (unscaled - orMin) / (orMax - orMin) + minAllowed;
}

float wave(vec3 position) {
    return fit(smoothMod(position.y * 10., 1., 1.5), 0.4, 0.6, 0.0, 1.);
}
float random(vec3 st) {
    return fract(sin(dot(st, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

// 1D Perlin noise function (https://www.iditect.com/program-example/shader--random--noise-functions-for-glsl.html)

// 3D Perlin noise function
float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 fractPart = fract(p);
    float a = random(i);
    float b = random(i + vec3(1.0, 0.0, 0.0));
    float c = random(i + vec3(0.0, 1.0, 0.0));
    float d = random(i + vec3(1.0, 1.0, 0.0));
    float e = random(i + vec3(0.0, 0.0, 1.0));
    float f1 = random(i + vec3(1.0, 0.0, 1.0));
    float g = random(i + vec3(0.0, 1.0, 1.0));
    float h = random(i + vec3(1.0, 1.0, 1.0));
    float u = fractPart.x * fractPart.x * (3.0 - 2.0 * fractPart.x);
    float v = fractPart.y * fractPart.y * (3.0 - 2.0 * fractPart.y);
    float w = fractPart.z * fractPart.z * (3.0 - 2.0 * fractPart.z);
    return mix(mix(mix(a, b, u), mix(c, d, u), v), mix(mix(e, f1, u), mix(g, h, u), v), w);
}
