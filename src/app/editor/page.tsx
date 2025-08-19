"use client";
import { useEffect } from 'react';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

const ydoc = new Y.Doc();
const ytext = new Y.Text();

export default function Editor() {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        ytext.insert(0, newText);
    };

    useEffect(() => {
        const persistence = new IndexeddbPersistence('my-yjs-doc', ydoc);
    }, []);
    return (
        <><div>黑子的编辑器</div>
        <textarea
            rows={30}
            onChange={handleChange}
            /></>
    )
}