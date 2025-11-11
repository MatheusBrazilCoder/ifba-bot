"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquarePlus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import MarkdownRenderer from "@/components/common/markdown-renderer"
import { useEffect, useState } from "react"

interface Answer {
  id: number
  content: string
  userName: string
  userStatus: string
  createdAt: string
}

interface QuestionDetailProps {
  question: {
    id: number
    question: string
    answer: string
    category: string
    body?: string
  }
  onBack: () => void
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "professor":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "coordenador":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "aluno":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "bibliotecária":
    case "bibliotecário":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "assistente social":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

export default function QuestionDetail({ question, onBack }: QuestionDetailProps) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchAnswers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/answers?questionId=${question.id}`)
        const data = await response.json()
        setAnswers(data)
      } catch (error) {
        console.error("Error fetching answers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnswers()
  }, [question.id])

  console.log("[v0] Question data:", question)
  console.log("[v0] Question body:", question.body)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.id,
          content: newComment,
          userName: "Matheus",
          userStatus: "Aluno",
        }),
      })

      if (response.ok) {
        const newAnswer = await response.json()
        setAnswers([...answers, newAnswer])
        setNewComment("")
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button
        onClick={onBack}
        variant="ghost"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={18} />
        Voltar
      </Button>

      {/* Pergunta */}
      <Card className="p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {question.category}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2 break-words">{question.question}</h1>
        {question.body && question.body.trim() && (
          <div className="mt-4 pt-4 border-t border-border prose prose-sm dark:prose-invert max-w-none break-words">
            <MarkdownRenderer content={question.body} />
          </div>
        )}
      </Card>

      {/* Adicionar Resposta */}
      <Card className="p-4 border border-border">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 mt-1">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">MO</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione uma resposta... (suporta Markdown)"
              className="min-h-[80px] resize-none text-sm font-mono overflow-hidden break-words"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
                maxWidth: "100%",
              }}
            />
            <div className="flex justify-end items-center">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
                className="flex items-center gap-2"
              >
                <MessageSquarePlus size={14} />
                {isSubmitting ? "Enviando..." : "Responder"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Respostas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          {answers.length} {answers.length === 1 ? "Resposta" : "Respostas"}
        </h2>

        {isLoading ? (
          <Card className="p-8 border border-border text-center">
            <p className="text-muted-foreground">Carregando respostas...</p>
          </Card>
        ) : answers.length === 0 ? (
          <Card className="p-8 border border-border text-center">
            <p className="text-muted-foreground">Ainda não há respostas para esta pergunta.</p>
          </Card>
        ) : (
          answers.map((answer) => (
            <Card key={answer.id} className="p-6 border border-border break-words">
              {/* Cabeçalho com informações do usuário */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {answer.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground break-words">{answer.userName}</p>
                    <Badge className={getStatusColor(answer.userStatus)}>{answer.userStatus}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(answer.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Conteúdo da resposta */}
              <div className="prose prose-sm dark:prose-invert max-w-none break-words overflow-hidden">
                <MarkdownRenderer content={answer.content} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
