"use client";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo, useState } from "react";

async function saveToStorage(jsonBlocks) {
    console.log("Saving to storage:", jsonBlocks);
    localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
}

async function loadFromStorage() {
    const storageString = localStorage.getItem("editorContent");
    console.log("Loaded from storage:", storageString);
    return storageString
        ? JSON.parse(storageString)
        : undefined;
}

export default function App() {
    const [initialContent, setInitialContent] = useState("loading");

    // Loads the previously stored editor contents.
    useEffect(() => {
        loadFromStorage().then((content) => {
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
                saveToStorage(editor.document);
            }}
        />
    );
}
