const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function createFolder(folderName) {
    const fileMetadata = {
        'name': folderName,
        'mimeType': 'application/vnd.google-apps.folder'
    };
    const res = await drive.files.create({
        resource: fileMetadata,
        fields: 'id'
    });
    return res.data.id;
}

async function findOrCreateFolder(folderName) {
    const res = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
        fields: 'files(id, name)',
        spaces: 'drive'
    });
    const folder = res.data.files.find(folder => folder.name === folderName);
    if (folder) {
        return folder.id;
    } else {
        return await createFolder(folderName);
    }
}

async function setFilePublic(fileId) {
    await drive.permissions.create({
        fileId,
        requestBody: {
            role: 'reader',
            type: 'anyone'
        }
    });

    return fileId;
}

async function uploadFileToDrive(base64Data, fileName, folderId) {
    const buffer = Buffer.from(base64Data, 'base64');
    const uploadsDir = path.join(__dirname, 'uploads');
    const filePath = path.join(uploadsDir, fileName);
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    const createFile = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [folderId],
            mimeType: 'image/jpeg'
        },
        media: {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(filePath)
        }
    });

    fs.unlinkSync(filePath);

    const fileId = createFile.data.id;
    const publicFileId = await setFilePublic(fileId);

    return `https://drive.google.com/thumbnail?id=${publicFileId}`; 
}

module.exports = {
    findOrCreateFolder,
    uploadFileToDrive
};
