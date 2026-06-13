const fs = require('fs');

const data = fs.readFileSync('C:\\Users\\vaida\\.gemini\\antigravity-ide\\brain\\784d06fd-632f-4f08-ae01-bf90c50edaad\\.system_generated\\steps\\62\\output.txt', 'utf8');
const project = JSON.parse(data);

const metadata = {
  name: project.name,
  projectId: project.name.split('/')[1],
  title: project.title,
  visibility: project.visibility,
  createTime: project.createTime,
  updateTime: project.updateTime,
  projectType: project.projectType,
  origin: project.origin,
  deviceType: project.deviceType,
  designTheme: project.designTheme,
  screens: {
    "index": {
      "id": "adf479f3824940198eb6a5d738e5635d",
      "sourceScreen": `projects/9839437392775019931/screens/adf479f3824940198eb6a5d738e5635d`,
      "x": 9968,
      "y": 3650,
      "width": 1280,
      "height": 2050
    }
  },
  metadata: project.metadata
};

fs.mkdirSync('c:\\Users\\vaida\\Desktop\\hackon\\frontend\\.stitch', { recursive: true });
fs.writeFileSync('c:\\Users\\vaida\\Desktop\\hackon\\frontend\\.stitch\\metadata.json', JSON.stringify(metadata, null, 2));
console.log('metadata.json written successfully.');
