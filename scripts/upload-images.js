const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

const API_URL = 'http://127.0.0.1:1337';
const API_TOKEN = '7e95f178ddb549b24187d4cc9237ce7e3e08b6b322b515e3743ec6b2d281aa5b7c36fb06c1c4ade05922a1ccaab70b60e7fe8babd3eebb731498ce6fac178427f2e0aade1414a93bfe46dae4e79ce0f1174c3087bf9a9e628e400c4b10dc27941fdea7618d64dfb6d50cdb1c8d3d454a02c48cb2323c88d7e3b8e86a76186f85'; // Replace with your actual API token

const uploadImage = async (filePath, risk1, risk2, schema) => {
  const form = new FormData();
  
  // Rename the file without the hash
  const fileName = path.basename(filePath).replace(/_[a-f0-9]+(\.\w+)$/, '$1');
  
  form.append('files', fs.createReadStream(filePath), { filename: fileName });

  const uploadResponse = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: form,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const uploadedFiles = await uploadResponse.json();
  if (uploadResponse.status !== 200) {
    console.error(`Failed to upload image: ${filePath}`, uploadedFiles);
    return null;
  }

  const imageEntry = {
    data: {
      risk1,
      risk2,
      schema,
      picture: uploadedFiles[0].id,
    },
  };

  const createEntryResponse = await fetch(`${API_URL}/api/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify(imageEntry),
  });

  const createdEntry = await createEntryResponse.json();
  if (createEntryResponse.status !== 200) {
    console.error(`Failed to create image entry for: ${filePath}`, createdEntry);
    return null;
  }

  console.log(`Successfully uploaded and created entry for: ${filePath}`);
  return createdEntry;
};

const main = async () => {
  const imagesDirectory = path.join(__dirname, 'images');
  const files = fs.readdirSync(imagesDirectory);

  for (const file of files) {
    const [risk1, risk2, schemaWithExtension] = file.split('_');
    const schema = schemaWithExtension.split('.')[0] === 'true';

    const filePath = path.join(imagesDirectory, file);
    await uploadImage(filePath, parseInt(risk1, 10), parseInt(risk2, 10), schema);
  }
};

main().catch(err => console.error('Script failed with error:', err));