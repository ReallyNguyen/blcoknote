"use client";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig"; // Adjust the path as needed
import { doc, getDoc, setDoc } from "firebase/firestore";

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

// Function to render content
function renderContent(content) {
    return content.map((block) => {
        console.log("Rendering block:", block); // Debugging output

        if (block.type === "heading") {
            const textContent = block.content.map((item, index) => (
                <span key={index} style={{ color: block.props.textColor || 'black' }}>
                    {item.text}
                </span>
            ));

            // Determine the Tailwind class based on the heading level
            let headingClass;
            switch (block.props.level) {
                case 1:
                    headingClass = 'text-4xl font-bold'; // Tailwind classes for h1
                    break;
                case 2:
                    headingClass = 'text-3xl font-semibold'; // Tailwind classes for h2
                    break;
                case 3:
                    headingClass = 'text-2xl font-medium'; // Tailwind classes for h3
                    break;
                default:
                    headingClass = 'text-xl'; // Default class if level is not recognized
            }

            return (
                <div
                    key={block.id}
                    className={`my-4 ${headingClass} ${block.props.textAlignment ? `text-${block.props.textAlignment}` : ''}`}
                    style={{ backgroundColor: block.props.backgroundColor || 'transparent' }}
                >
                    {textContent}
                </div>
            );
        }

        if (block.type === "paragraph") {
            const textContent = block.content.map((item, index) => (
                <span key={index} style={{ color: block.props.textColor || 'black' }}>
                    {item.text}
                </span>
            ));

            return (
                <p
                    key={block.id}
                    className={`my-4 ${block.props.textAlignment ? `text-${block.props.textAlignment}` : ''}`}
                >
                    {textContent}
                </p>
            );
        }

        // Render null if block type is not recognized
        return null;
    });
}

export default function Read() {
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
            <div>
                <h3>Formatted Content:</h3>
                <div>
                    {renderContent(displayContent)} {/* Display the formatted content */}
                </div>
                <h3>Raw JSON Content:</h3>
                <pre>{JSON.stringify(displayContent, null, 2)}</pre> {/* Display the raw JSON */}
            </div>
        </div>
    );
}