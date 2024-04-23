<template>
  <div>
    <button @click="createEntry">Create Entry</button>
    <button @click="uploadFile">Upload File</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const apiKey = "OmM0MzU1ZmY1Zjg3YzY0NzYwYmIxZGZiODJjNWZmNGNm";
const environmentId = 'c79d5047-2211-4509-96f7-46950492cd70';
const bucketId = '6de10904-631b-4eeb-9d84-5c295c16f2a4';
let entryId = '';
let signedUrl = '';

const createEntry = async () => {
  const entryData = {
    path: "samplefile.txt",
    content_hash: "e19d5cd5af0378da05f63f891c7467af",
    content_size: 8,
    content_type: "application/octet-stream",
    signed_url: true
  };

  try {
    const response = await fetch(`https://content-api.cloud.unity3d.com/api/v1/environments/${environmentId}/buckets/${bucketId}/entries/`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entryData)
    });

    const responseData = await response.json();
    entryId = responseData.entry_id;
    signedUrl = responseData.signed_url;
    console.log('Entry created:', responseData);
  } catch (error) {
    console.error('Error creating entry:', error);
  }
};

const uploadFile = async () => {
  const contentType = "image/jpeg";
  const fileData = new FormData();
  fileData.append('file', 'FOLDER/PATH/TO/YOUR/FILE/samplefile.txt');

  try {
    const response = await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType
      },
      body: fileData
    });

    console.log('File uploaded successfully:', response);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};
</script>
