"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MarkdownRenderer from "./markdown-renderer"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Digite em Markdown...\n\n# Título\n**negrito** e *itálico*\n- Lista\n- De\n- Itens",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "editor" | "preview")}>
        <TabsList className="w-full rounded-none bg-muted border-b border-border">
          <TabsTrigger value="editor" className="rounded-none">
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="rounded-none">
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="p-0 m-0">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-64 p-4 bg-input border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="p-0 m-0">
          <div className="min-h-64 p-4 bg-card overflow-auto">
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-muted-foreground italic">Nada para visualizar</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
