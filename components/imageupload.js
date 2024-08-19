import { useState } from 'react';
import { db } from '@/firebaseConfig'; // Adjust the path as needed
import { doc, setDoc } from 'firebase/firestore';

// Function to upload the file and save its URL to Firestore
async function uploadFile(file) {
    try {
        const body = new FormData();
        body.append('file', file);

        const response = await fetch('https://tmpfiles.org/api/v1/upload', {
            method: 'POST',
            body: body,
        });

        const result = await response.json();
        const fileUrl = result.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

        // Save the URL to Firestore
        const docRef = doc(db, 'editorContent', 'image'); // Adjust collection and document ID as needed
        await setDoc(docRef, { url: fileUrl });
        console.log('Image URL saved to Firestore:', fileUrl);

        return fileUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}

export default function ImageUpload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const fileUrl = await uploadFile(file);
        if (fileUrl) {
            console.log('File successfully uploaded and URL saved to Firestore:', fileUrl);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Upload an Image</h2>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
                <div className="mt-4">
                    <img src={preview} alt="Preview" className="rounded-lg" />
                </div>
            )}
            <button
                onClick={handleUpload}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
                Upload Image
            </button>
        </div>
    );
}
