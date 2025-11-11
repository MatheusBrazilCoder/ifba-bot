"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, BarChart3, Lock } from "lucide-react"

interface UserInfo {
  id: number
  name: string
  email: string
  course: string
  enrollment: string
  joinDate: string
}

interface SearchHistory {
  id: number
  userId: number
  query: string
  response: string
  date: string
  rating?: "helpful" | "not-helpful"
}

export default function Settings() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        // Get current user email from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        const email = user.email || "student@ifba.edu.br"

        // Fetch user info from API
        const userResponse = await fetch(`/api/users?email=${email}`)
        const userData = await userResponse.json()
        setUserInfo(userData)

        // Fetch search history from API
        const historyResponse = await fetch(`/api/search-history?userId=${userData.id}`)
        const historyData = await historyResponse.json()
        setSearchHistory(historyData)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const rateAnswer = async (id: number, rating: "helpful" | "not-helpful") => {
    try {
      await fetch("/api/search-history", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, rating }),
      })

      setSearchHistory(searchHistory.map((item) => (item.id === id ? { ...item, rating } : item)))
    } catch (error) {
      console.error("Error updating rating:", error)
    }
  }

  const deleteHistory = async (id: number) => {
    try {
      await fetch(`/api/search-history?id=${id}`, {
        method: "DELETE",
      })

      setSearchHistory(searchHistory.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting history:", error)
    }
  }

  if (isLoading || !userInfo) {
    return <div className="text-center text-muted-foreground">Carregando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Minha Conta</h1>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} /> Perfil
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <BarChart3 size={16} /> Histórico
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock size={16} /> Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Informações Pessoais</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="text-foreground font-medium break-words">{userInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium break-words">{userInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Curso</p>
                  <p className="text-foreground font-medium break-words">{userInfo.course}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Matrícula</p>
                  <p className="text-foreground font-medium break-words">{userInfo.enrollment}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membro desde</p>
                <p className="text-foreground font-medium">{userInfo.joinDate}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {searchHistory.length > 0 ? (
              searchHistory.map((item) => (
                <Card key={item.id} className="p-6 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm text-muted-foreground mb-1">{item.date}</p>
                      <h3 className="font-semibold text-foreground mb-2 break-words">{item.query}</h3>
                    </div>
                    <button
                      onClick={() => deleteHistory(item.id)}
                      className="text-muted-foreground hover:text-destructive text-sm ml-2 flex-shrink-0"
                    >
                      Deletar
                    </button>
                  </div>

                  <div className="bg-muted p-3 rounded mb-3 overflow-hidden">
                    <p className="text-foreground text-sm break-words">{item.response}</p>
                  </div>

                  <div className="flex gap-3 items-center">
                    <span className="text-xs text-muted-foreground">Útil?</span>
                    <button
                      onClick={() => rateAnswer(item.id, "helpful")}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        item.rating === "helpful"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => rateAnswer(item.id, "not-helpful")}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        item.rating === "not-helpful"
                          ? "bg-destructive text-destructive-foreground"
                          : "border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      Não
                    </button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 border border-border text-center text-muted-foreground">
                Nenhum histórico de perguntas ainda
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Segurança</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Alterar Senha</h3>
                <p className="text-sm text-muted-foreground mb-4">Para sua segurança, altere sua senha regularmente</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Senha Atual</label>
                    <input
                      type="password"
                      placeholder="Digite sua senha atual"
                      className="w-full px-3 py-2 border border-border bg-input rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nova Senha</label>
                    <input
                      type="password"
                      placeholder="Digite sua nova senha"
                      className="w-full px-3 py-2 border border-border bg-input rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirmar Senha</label>
                    <input
                      type="password"
                      placeholder="Confirme sua nova senha"
                      className="w-full px-3 py-2 border border-border bg-input rounded-lg text-foreground"
                    />
                  </div>
                </div>
                <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Atualizar Senha</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
