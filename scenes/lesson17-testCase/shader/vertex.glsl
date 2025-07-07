uniform float uTime;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying float vHeight;


float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123) * 2.0 - 1.0;
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}


float fractalNoise(vec2 p, float time) {
  float total = 0.0;
  float frequency = 1.0;
  float amplitude = 1.0;
  float maxAmplitude = 0.0;

  for(int i = 0; i < 4; i++) {
    vec2 np = p * frequency + vec2(time * 0.3 * float(i), -time * 0.2 * float(i));
    total += noise(np) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return total / maxAmplitude;
}


float oceanWave(vec2 pos, float time) {
  float height = 0.0;

  for(int i = 0; i < 5; i++) {
    float amp, freq, speed;
    vec2 dir;

    if(i == 0) {
      amp = 0.1;
      freq = 1.0;
      speed = 1.0;
      dir = normalize(vec2(1.0, 0.3));
    } else if(i == 1) {
      amp = 0.05;
      freq = 1.8;
      speed = 0.8;
      dir = normalize(vec2(-0.7, 0.5));
    } else if(i == 2) {
      amp = 0.07;
      freq = 2.5;
      speed = 1.2;
      dir = normalize(vec2(0.2, -1.0));
    } else if(i == 3) {
      amp = 0.03;
      freq = 3.5;
      speed = 0.5;
      dir = normalize(vec2(-1.0, -0.2));
    } else if(i == 4) {
      amp = 0.04;
      freq = 2.0;
      speed = 0.7;
      dir = normalize(vec2(0.4, 0.9));
    }

    float phase = dot(pos, dir) * freq * 2. - time * speed;
    height += sin(phase) * amp;
  }

  return height;
}


void main() {
  vec3 pos = position;
  float mainWave = oceanWave(pos.xy, uTime);

  float smallRipples = fractalNoise(pos.xy * 10.0, uTime) * 0.02;

  float dist = length(pos.xy);
  float centerFreq = 8.0;
  float centerSpeed = 2.0;
  float centerScale = 0.05;
  float ring = sin(log(1.0 + dist * 3.0) * centerFreq - uTime * centerSpeed);
  float ringWave = ring * smoothstep(0.2, 1.5, dist) * centerScale * dist;

  pos.z += mainWave + smallRipples + ringWave;

  vHeight = pos.z;

  vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
  vNormal = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
