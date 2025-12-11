const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'about.json');
console.log('Resolved Path:', DATA_FILE);

try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    console.log('File read successfully.');
    JSON.parse(data);
    console.log('JSON parsed successfully.');
} catch (error) {
    console.error('Error:', error);
}
