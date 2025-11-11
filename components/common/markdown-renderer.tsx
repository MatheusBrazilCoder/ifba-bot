"use client"

import type React from "react"

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // Headers
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-2xl font-bold my-3 text-foreground">
            {parseInline(line.substring(2))}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-xl font-bold my-2 text-foreground">
            {parseInline(line.substring(3))}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg font-bold my-2 text-foreground">
            {parseInline(line.substring(4))}
          </h3>,
        )
      }
      // Lists
      else if (line.startsWith("- ")) {
        const listItems: string[] = []
        while (i < lines.length && lines[i].startsWith("- ")) {
          listItems.push(lines[i].substring(2))
          i++
        }
        elements.push(
          <ul key={`ul-${i}`} className="list-disc list-inside my-2 text-foreground space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx}>{parseInline(item)}</li>
            ))}
          </ul>,
        )
        i--
      }
      // Blockquote
      else if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={`bq-${i}`} className="border-l-4 border-primary pl-4 my-2 italic text-muted-foreground">
            {parseInline(line.substring(2))}
          </blockquote>,
        )
      }
      // Code block
      else if (line.startsWith("```")) {
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i])
          i++
        }
        elements.push(
          <pre key={`code-${i}`} className="bg-muted p-3 rounded my-2 overflow-x-auto">
            <code className="text-sm text-foreground font-mono">{codeLines.join("\n")}</code>
          </pre>,
        )
      }
      // Paragraph
      else if (line.trim()) {
        elements.push(
          <p key={`p-${i}`} className="my-1 text-foreground leading-relaxed">
            {parseInline(line)}
          </p>,
        )
      }
      // Empty line
      else {
        elements.push(<div key={`empty-${i}`} className="my-2" />)
      }

      i++
    }

    return elements
  }

  const parseInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    let currentText = ""
    let i = 0

    while (i < text.length) {
      // Bold
      if (text.substring(i, i + 2) === "**") {
        if (currentText) {
          parts.push(currentText)
          currentText = ""
        }
        let boldText = ""
        i += 2
        while (i < text.length && text.substring(i, i + 2) !== "**") {
          boldText += text[i]
          i++
        }
        parts.push(
          <strong key={`b-${i}`} className="font-bold text-foreground">
            {boldText}
          </strong>,
        )
        i += 2
      }
      // Italic
      else if (text[i] === "*" && (i === 0 || text[i - 1] !== "*")) {
        if (currentText) {
          parts.push(currentText)
          currentText = ""
        }
        let italicText = ""
        i++
        while (i < text.length && text[i] !== "*") {
          italicText += text[i]
          i++
        }
        parts.push(
          <em key={`i-${i}`} className="italic text-foreground">
            {italicText}
          </em>,
        )
        i++
      }
      // Link
      else if (text[i] === "[") {
        if (currentText) {
          parts.push(currentText)
          currentText = ""
        }
        let linkText = ""
        i++
        while (i < text.length && text[i] !== "]") {
          linkText += text[i]
          i++
        }
        i++ // skip ]
        if (text[i] === "(") {
          let url = ""
          i++
          while (i < text.length && text[i] !== ")") {
            url += text[i]
            i++
          }
          parts.push(
            <a
              key={`a-${i}`}
              href={url}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkText}
            </a>,
          )
          i++
        }
      }
      // Code inline
      else if (text[i] === "`") {
        if (currentText) {
          parts.push(currentText)
          currentText = ""
        }
        let codeText = ""
        i++
        while (i < text.length && text[i] !== "`") {
          codeText += text[i]
          i++
        }
        parts.push(
          <code key={`c-${i}`} className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">
            {codeText}
          </code>,
        )
        i++
      } else {
        currentText += text[i]
        i++
      }
    }

    if (currentText) {
      parts.push(currentText)
    }

    return parts.length === 0 ? [text] : parts
  }

  return <div className="space-y-2">{parseMarkdown(content)}</div>
}
