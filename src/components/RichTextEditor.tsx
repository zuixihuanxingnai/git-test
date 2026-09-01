import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import '@/styles/admin/richtexteditor.scss'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  maxCharCount?: number
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = '请输入内容...',
  maxCharCount = 2000,
}: Props) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [charCount, setCharCount] = useState(0)

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: [
      'bold', 'italic', 'underline', 'color', 'bgColor', '|',
      'fontSize', 'fontFamily', '|',
      'header1', 'header2', 'header3', '|',
      'bulletedList', 'numberedList', 'blockquote', '|',
      'insertLink', '|',
      'undo', 'redo',
    ],
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder,
    MENU_CONF: {},
  }

  // 计数
  useEffect(() => {
    if (editor) {
      const text = editor.getText()
      setCharCount(text.length)
    }
  }, [value, editor])

  // 销毁
  useEffect(() => {
    return () => {
      if (editor) editor.destroy()
    }
  }, [editor])

  return (
    <div className="rich-text-editor">
      <div className="editor-container">
        <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" />
        <Editor
          defaultConfig={editorConfig}
          value={value}
          onCreated={setEditor}
          onChange={(e) => {
            onChange(e.getHtml())
            setCharCount(e.getText().length)
          }}
          mode="default"
        />
      </div>
      <div className="editor-footer">
        <span>{charCount} / {maxCharCount}</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min((charCount / maxCharCount) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default RichTextEditor