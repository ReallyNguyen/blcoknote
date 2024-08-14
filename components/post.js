"use client";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig"; // Adjust the path as needed
import { doc, getDoc, setDoc } from "firebase/firestore";

// Function to save content to Firestore
async function saveToFirestore(jsonBlocks) {
    try {
        const docRef = doc(db, "editorContent", "contentDoc");
        await setDoc(docRef, { content: jsonBlocks });
        console.log("Content saved to Firestore:", jsonBlocks);
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

export default function Post() {
    const [editor, setEditor] = useState(null);
    const [displayContent, setDisplayContent] = useState([]);

    useEffect(() => {
        async function initializeEditor() {
            const content = await loadFromFirestore();
            const editorInstance = BlockNoteEditor.create({ initialContent: content });
            setEditor(editorInstance);
            setDisplayContent(content); // Set the content for display
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