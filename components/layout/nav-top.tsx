"use client"

import { useState, useEffect } from "react"
import { User, Menu, X } from "lucide-react"

interface NavTopProps {
  currentPage: string
  isOpen: boolean
  onToggle: () => void
  onPageChange?: (page: string) => void
}

export default function NavTop({ currentPage, isOpen, onToggle, onPageChange }: NavTopProps) {
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    setUserName(user.name || "Usuário")
  }, [])

  const getPageTitle = () => {
    switch (currentPage) {
      case "home":
        return "Tire sua dúvida"
      case "faq":
        return "Perguntas Frequentes"
      case "settings":
        return "Configurações"
      default:
        return "IFBA Assistant"
    }
  }

  const handleUserClick = () => {
    onPageChange?.("settings")
  }

  return (
    <header className="bg-card border-b border-border px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="flex items-center justify-center p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          title="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleUserClick}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:rounded-lg cursor-pointer"
          title="Ir para configurações"
        >
          <User size={18} />
          <span className="hidden sm:inline font-medium">{userName}</span>
        </button>
      </div>
    </header>
  )
}
