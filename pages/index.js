import { useState } from "react";
import dynamic from "next/dynamic";
import TextareaAutoSize from "react-textarea-autosize";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function Home() {
  const [title, setTitle] = useState("");

  return (
    <main
    >
      <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
        <div className="flex flex-col px-24 py-10 w-full">
          <TextareaAutoSize
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <Editor />
        </div>
      </main>
    </main>
  );
}
