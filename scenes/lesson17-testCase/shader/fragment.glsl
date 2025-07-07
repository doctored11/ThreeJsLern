precision mediump float;

uniform vec3 uLightDir;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying float vHeight;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightDir);
    float light = max(dot(normal, lightDir), 0.0);

    vec3 shallow = vec3(0.03, 0.87, 0.98);
    vec3 deep = vec3(0.02, 0.09, 0.28);

    float h = smoothstep(-0.15, 0.15, vHeight);
    vec3 color = mix(deep, shallow, h);

    gl_FragColor = vec4(color * light, 1.0);
}
