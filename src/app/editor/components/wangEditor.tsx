import '@wangeditor/editor/dist/css/style.css'; // 引入 css 必须
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { useState } from 'react';
import type { IDomEditor } from '@wangeditor/editor';
import * as Y from 'yjs';

interface WangEditorProps {
    handleChange: (content: string) => void;
    ytext: Y.Text;
}

export default function WangEditor({ handleChange, ytext }: WangEditorProps) {
    const [editor, setEditor] = useState<IDomEditor | null>(null);

    const handleEditorChange = (editorInstance: any) => {
        const content = editorInstance.getHtml ? editorInstance.getHtml() : '';
        console.log('内容变化:', content);
        handleChange(content);
    };

    return (
        <div>
            <Toolbar editor={editor} />
            <Editor
                value={ytext.toString()}
                onChange={handleEditorChange}
                onCreated={setEditor}
            />
        </div>
    );
}