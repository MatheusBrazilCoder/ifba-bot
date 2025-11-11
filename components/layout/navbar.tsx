"use client"
import { MessageSquare, HelpCircle, Settings, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

interface NavbarProps {
  currentPage: string
  onPageChange: (page: string) => void
  isOpen: boolean
  onToggle: () => void
  isMobileSheetOpen: boolean
  onMobileSheetChange: (open: boolean) => void
}

export default function Navbar({
  currentPage,
  onPageChange,
  isOpen,
  onToggle,
  isMobileSheetOpen,
  onMobileSheetChange,
}: NavbarProps) {
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    window.location.reload()
  }

  const navItems = [
    { id: "home", label: "Chat com IA", icon: MessageSquare },
    { id: "faq", label: "Perguntas Frequentes", icon: HelpCircle },
    { id: "settings", label: "Configurações", icon: Settings },
  ]

  const handleItemClickMobile = (itemId: string) => {
    onPageChange(itemId)
    onMobileSheetChange(false)
  }

  const handleItemClickDesktop = (itemId: string) => {
    onPageChange(itemId)
  }

  const sidebarContent = (isMobile = false) => (
    <>
      <div className="bg-card p-4 border-b border-sidebar-border flex items-center">
        <div
          className={`w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold ${!isOpen && !isMobile && "mx-auto"}`}
        >
          IA
        </div>
        {(isOpen || isMobile) && <span className="text-lg font-bold text-sidebar-foreground ml-2">IFBA</span>}
      </div>

      <nav className="bg-card flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => (isMobile ? handleItemClickMobile(item.id) : handleItemClickDesktop(item.id))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
              title={item.label}
            >
              <Icon size={20} />
              {(isOpen || isMobile) && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="bg-card p-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          title="Sair"
        >
          <LogOut size={20} />
          {(isOpen || isMobile) && <span className="text-sm font-medium">Sair</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      <Sheet open={isMobileSheetOpen} onOpenChange={onMobileSheetChange}>
        <SheetContent side="left" className="w-64 p-0 md:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de Navegação</SheetTitle>
            <SheetDescription>Menu principal do sistema</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col h-full">{sidebarContent(true)}</div>
        </SheetContent>
      </Sheet>

      <aside
        className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 flex-col ${
          isOpen ? "w-64" : "w-20"
        } hidden md:flex h-screen z-50`}
      >
        {sidebarContent(false)}
      </aside>
    </>
  )
}
