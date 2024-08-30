import fs from 'fs';
import path from 'path';

async function saveBase64Image(base64Image: string, fileName: string): Promise<string> {
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
    
    const filePath = path.join(__dirname, 'public', 'uploads', fileName);
    
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    fs.writeFileSync(filePath, base64Data, 'base64');
    return filePath;
}

export default saveBase64Image;