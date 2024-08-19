"use client";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig"; // Adjust the path as needed
import { doc, getDoc, setDoc } from "firebase/firestore";

// Function to remove undefined values recursively from an object or array
function removeUndefined(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeUndefined);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => [k, removeUndefined(v)])
        );
    }
    return obj;
}

// Function to save content to Firestore
async function saveToFirestore(jsonBlocks) {
    try {
        // Remove undefined values
        const cleanedContent = removeUndefined(jsonBlocks);

        const docRef = doc(db, "editorContent", "contentDoc");
        await setDoc(docRef, { content: cleanedContent });
        console.log("Content saved to Firestore:", cleanedContent);
    } catch (error) {
        console.error("Error saving content to Firestore:", error);
    }
}


// Function to load content from Firestore
async function loadFromFirestore() {
    try {
        const docRef = doc(db, "editorContent", "contentDoc");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const content = docSnap.data().content;
            console.log("Content loaded from Firestore:", content);
            return content;
        } else {
            console.log("No content found in Firestore.");
            return [];
        }
    } catch (error) {
        console.error("Error loading content from Firestore:", error);
        return [];
    }
}

// Function to upload the file and save its URL to Firestore
async function uploadFile(file) {
    try {
        // Upload the file
        const body = new FormData();
        body.append("file", file);

        const response = await fetch("https://tmpfiles.org/api/v1/upload", {
            method: "POST",
            body: body,
        });

        const result = await response.json();
        const fileUrl = result.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");

        // Save the URL to Firestore (or include it in the document content)
        return fileUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
}

export default function Post() {
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        async function initializeEditor() {
            const content = await loadFromFirestore();
            const editorInstance = BlockNoteEditor.create({
                initialContent: content,
                uploadFile
            });
            setEditor(editorInstance);
        }
        initializeEditor();
    }, []);

    if (!editor) {
        return <div>Loading content...</div>;
    }

    return (
        <div>
            <BlockNoteView
                editor={editor}
                onChange={() => {
                    console.log("Editor content changed:", editor.document);
                    saveToFirestore(editor.document);
                }}
            />
        </div>
    );
}
