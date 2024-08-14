"use client";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/firebaseConfig"; // Adjust the path as needed
import { doc, getDoc, setDoc } from "firebase/firestore";

async function saveToFirestore(jsonBlocks) {
    try {
        const docRef = doc(db, "editorContent", "contentDoc");
        await setDoc(docRef, { content: jsonBlocks });
        console.log("Content saved to Firestore:", jsonBlocks);
    } catch (error) {
        console.error("Error saving content to Firestore:", error);
    }
}

async function loadFromFirestore() {
    try {
        const docRef = doc(db, "editorContent", "contentDoc");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Content loaded from Firestore:", docSnap.data().content);
            return docSnap.data().content;
        } else {
            console.log("No content found in Firestore.");
            return undefined;
        }
    } catch (error) {
        console.error("Error loading content from Firestore:", error);
        return undefined;
    }
}

export default function App() {
    const [initialContent, setInitialContent] = useState("loading");

    // Loads the previously stored editor contents.
    useEffect(() => {
        loadFromFirestore().then((content) => {
            console.log("Content loaded:", content);
            setInitialContent(content);
        });
    }, []);

    // Creates a new editor instance.
    const editor = useMemo(() => {
        if (initialContent === "loading") {
            return undefined;
        }
        console.log("Creating editor with initial content:", initialContent);
        return BlockNoteEditor.create({ initialContent });
    }, [initialContent]);

    if (editor === undefined) {
        return "Loading content...";
    }

    // Renders the editor instance.
    return (
        <BlockNoteView
            editor={editor}
            onChange={() => {
                console.log("Editor content changed:", editor.document);
                saveToFirestore(editor.document);
            }}
        />
    );
}
