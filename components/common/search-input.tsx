"use client"

import { useState, useEffect } from "react"
import { Search, Sparkles, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchInputProps {
  onQuestionClick?: (question: { id: number; question: string; answer: string; category: string }) => void
}

export default function SearchInput({ onQuestionClick }: SearchInputProps) {
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("search")
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])

  useEffect(() => {
    const fetchResults = async () => {
      if (activeTab === "search" && query.trim()) {
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          const data = await response.json()
          setResults(data)
          setShowResults(true)
        } catch (error) {
          console.error("Error searching:", error)
        }
      } else {
        setShowResults(false)
      }
    }

    const debounce = setTimeout(fetchResults, 300)
    return () => clearTimeout(debounce)
  }, [query, activeTab])

  const handleSearch = async () => {
    if (!query.trim()) {
      setShowResults(false)
      return
    }

    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const data = await response.json()

    setResults(data)
    setShowResults(true)
  }

  const handleAIQuestion = () => {
    if (!query.trim()) return

    const userMessage = query
    setAiMessages([...aiMessages, { role: "user", content: userMessage }])
    setQuery("")

    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Respondendo sua pergunta sobre: "${userMessage}". Esta é uma resposta mockada da IA. Em produção, conectar com a API real de IA.`,
        },
      ])
    }, 500)
  }

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    if (newTab === "search" && aiMessages.length > 0) {
      setAiMessages([])
    }
  }

  const handleResultClick = (result: any) => {
    setShowResults(false)
    setQuery("")
    onQuestionClick?.(result)
  }

  const showChatInterface = activeTab === "ai" && aiMessages.length > 0

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search size={16} />
            Pesquisar
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles size={16} />
            Perguntar à IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="relative">
          <div className="flex gap-2 bg-card border border-border rounded-lg p-2 w-full shadow-sm">
            <Input
              type="text"
              placeholder="Digite sua pergunta aqui..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleSearch}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              title="Pesquisar"
            >
              <Search size={20} />
            </Button>
          </div>

          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {results.map((result) => (
                  <Card
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="p-3 hover:bg-muted cursor-pointer transition-colors"
                  >
                    <h4 className="font-semibold text-foreground mb-1">{result.question}</h4>
                    <p className="text-sm text-muted-foreground">{result.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai" className="flex flex-col gap-4">
          {showChatInterface && (
            <div className="bg-card border border-border rounded-lg p-4 h-96 overflow-y-auto flex flex-col gap-3">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-muted-foreground rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 bg-card border border-border rounded-lg p-2 shadow-sm">
            <Input
              type="text"
              placeholder={showChatInterface ? "Digite sua pergunta..." : "Digite sua pergunta para a IA..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAIQuestion()}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleAIQuestion}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              title="Enviar"
            >
              <Send size={20} />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
