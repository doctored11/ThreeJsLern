// тренировочный - в финальной нет его. код перенесен в main и parse для добавления в классические материалы

precision mediump float;

//принимаемые значения из js:
uniform float uTime;

//принимаемые из вершинного шейдера:
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplaysment;
void main() {
    // vec3 coords = vNormal;
    // coords.y += uTime;
    // vec3 noisePattern = vec3(noise3D(coords));

    // float pattern = wave(noisePattern);
    gl_FragColor = vec4(vec3(0.9, 0.25, 0.05), 1);
}
