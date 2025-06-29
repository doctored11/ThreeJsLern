import fs from 'fs';
import path from 'path';

const lessonName = process.argv[2];

if (!lessonName) {
  console.error('❌ Нужно имя!: npm run new lesson99');
  process.exit(1);
}

const templateDir = path.resolve('scene-template');
const newSceneDir = path.resolve('scenes', lessonName);

if (fs.existsSync(newSceneDir)) {
  console.error(`❌ Папка ${lessonName} уже существует`);
  process.exit(1);
}

fs.mkdirSync(newSceneDir, { recursive: true });

for (const file of fs.readdirSync(templateDir)) {
  const src = path.join(templateDir, file);
  const dest = path.join(newSceneDir, file);
  fs.copyFileSync(src, dest);
}

console.log(`✅ Урок ${lessonName} создан в scenes/${lessonName}`);
