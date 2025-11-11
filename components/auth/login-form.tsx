"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface LoginFormProps {
  onSuccess: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`)

      if (response.ok) {
        const user = await response.json()

        if (password.length >= 6) {
          localStorage.setItem("authToken", "mock-token-" + Date.now())
          localStorage.setItem("user", JSON.stringify(user))
          onSuccess()
        } else {
          setError("Senha deve ter pelo menos 6 caracteres")
        }
      } else {
        setError("Usuário não encontrado. Use: student@ifba.edu.br")
      }
    } catch (err) {
      setError("Erro ao fazer login")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md p-8 border border-border">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            IA
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">IFBA Assistant</h1>
          <p className="text-muted-foreground">Faça login com seu email institucional</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input
              type="email"
              placeholder="seu.email@ifba.edu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-input border border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-input border border-border"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <button type="button" className="w-full text-sm text-primary hover:text-primary/80 mt-4">
            Esqueceu sua senha?
          </button>
        </form>
      </Card>
    </div>
  )
}
