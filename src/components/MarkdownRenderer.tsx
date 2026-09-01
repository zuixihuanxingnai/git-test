import { useMemo } from 'react'
import '@/styles/front/mark.scss'

const MarkdownRenderer = ({ content, isAiMessage = false }: { content: string; isAiMessage?: boolean }) => {
  const html = useMemo(() => {
    if (!content) return ''
    let html = content
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (_, lang, code) =>
        `<pre class="code-block"><code>${code.trim()}</code></pre>`)
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*)$/gm, '<li>$1</li>')
      .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^---$/gm, '<hr>')
      .replace(/\n/g, '<br>')
    return html
  }, [content])

  return (
    <div className={`markdown-content${isAiMessage ? ' ai-markdown' : ''}`} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default MarkdownRenderer