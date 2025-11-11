"use client";

import { DialogDescription } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MessageCircle,
  CheckCircle2,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  body?: string;
  category: string;
  views: number;
  createdAt: string;
  status: "unanswered" | "answered" | "solved";
  answerCount: number;
}

const CATEGORIES = [
  { id: "all", label: "Todas", color: "bg-muted text-foreground" },
  { id: "admissao", label: "Admissão", color: "bg-blue-500/10 text-blue-600" },
  {
    id: "instalacoes",
    label: "Instalações",
    color: "bg-green-500/10 text-green-600",
  },
  {
    id: "financeiro",
    label: "Financeiro",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    id: "academico",
    label: "Acadêmico",
    color: "bg-orange-500/10 text-orange-600",
  },
];

interface FAQProps {
  onQuestionClick?: (question: FAQItem) => void;
}

export function FAQ({ onQuestionClick }: FAQProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "unanswered" | "solved"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionDescription, setNewQuestionDescription] = useState("");
  const [newQuestionCategory, setNewQuestionCategory] = useState("admissao");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "all")
          params.append("category", selectedCategory);
        if (selectedFilter !== "all") params.append("status", selectedFilter);

        const response = await fetch(`/api/questions?${params.toString()}`);
        const data = await response.json();
        setFaqs(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategory, selectedFilter]);

  const handleQuestionClick = (faq: FAQItem) => {
    if (onQuestionClick) {
      onQuestionClick(faq);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!newQuestionTitle.trim()) {
      alert("Por favor, preencha o título da pergunta.");
      return;
    }

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newQuestionTitle,
          body: newQuestionDescription,
          category: newQuestionCategory,
        }),
      });

      const newQuestion = await response.json();
      setFaqs((prev) => [newQuestion, ...prev]);

      setNewQuestionTitle("");
      setNewQuestionDescription("");
      setNewQuestionCategory("admissao");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating question:", error);
      alert("Erro ao criar pergunta. Tente novamente.");
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    const categoryMatch =
      selectedCategory === "all" || faq.category === selectedCategory;
    const filterMatch =
      selectedFilter === "all" ||
      (selectedFilter === "unanswered" && faq.status === "unanswered") ||
      (selectedFilter === "solved" && faq.status === "solved");
    return categoryMatch && filterMatch;
  });

  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFaqs = filteredFaqs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedFilter]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Perguntas Frequentes
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2">
              <Plus size={18} /> Nova Pergunta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4">
            <DialogHeader>
              <DialogTitle>Criar Nova Pergunta</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da sua pergunta. Você pode usar Markdown
                para formatar a descrição.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Pergunta</Label>
                <Input
                  id="title"
                  placeholder="Digite o título da sua pergunta..."
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  className="overflow-hidden break-words"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  value={newQuestionCategory}
                  onChange={(e) => setNewQuestionCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden"
                >
                  {CATEGORIES.filter((c) => c.id !== "all").map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Descrição (Opcional)</Label>
                  <span className="text-xs text-muted-foreground">
                    {newQuestionDescription.length}/200
                  </span>
                </div>
                <Textarea
                  id="description"
                  placeholder="Digite a descrição da sua pergunta em Markdown...&#10;&#10;Você pode usar:&#10;# Títulos&#10;**negrito** e *itálico*&#10;- Listas&#10;> Citações&#10;\`\`\`código\`\`\`"
                  value={newQuestionDescription}
                  onChange={(e) => setNewQuestionDescription(e.target.value)}
                  maxLength={200}
                  rows={6}
                  className="resize-none focus-visible:ring-2 focus-visible:ring-primary font-mono text-sm w-full overflow-hidden break-words"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    maxWidth: "100%",
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitQuestion}>Criar Pergunta</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 hidden md:block">
        <h2 className="text-lg font-semibold text-foreground">Categorias</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? category.color + " ring-2 ring-offset-2 ring-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:flex gap-3 items-center justify-between">
        <div className="flex gap-3 items-center">
          <span className="text-sm font-medium text-foreground">Filtros:</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedFilter("unanswered")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedFilter === "unanswered"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <MessageCircle size={14} />
              Sem Respostas
            </button>
            <button
              onClick={() => setSelectedFilter("solved")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedFilter === "solved"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <CheckCircle2 size={14} />
              Solucionados
            </button>
          </div>
        </div>

        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-all ${
              viewMode === "grid"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Visualização em grade"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-all ${
              viewMode === "list"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Visualização em lista"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-between">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter size={16} />
              Filtros
              {(selectedCategory !== "all" || selectedFilter !== "all") && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {(selectedCategory !== "all" ? 1 : 0) +
                    (selectedFilter !== "all" ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[85vh] overflow-y-auto p-4"
          >
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Selecione a categoria e o status das perguntas
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 pt-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Categorias
                </h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === category.id
                          ? category.color +
                            " ring-2 ring-offset-2 ring-primary"
                          : "bg-muted text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Status
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setSelectedFilter("all");
                    }}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                      selectedFilter === "all"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("unanswered");
                    }}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedFilter === "unanswered"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <MessageCircle size={16} />
                    Sem Respostas
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("solved");
                    }}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedFilter === "solved"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    Solucionados
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedFilter("all");
                  }}
                  className="flex-1"
                >
                  Limpar Filtros
                </Button>
                <Button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1"
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-all ${
              viewMode === "grid"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Visualização em grade"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-all ${
              viewMode === "list"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Visualização em lista"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Carregando perguntas...</p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedFaqs.map((faq) => {
                const categoryData = CATEGORIES.find(
                  (c) => c.id === faq.category
                );
                return (
                  <Card
                    key={faq.id}
                    onClick={() => handleQuestionClick(faq)}
                    className="p-5 hover:shadow-lg transition-all cursor-pointer border border-border group hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-semibold ${
                          categoryData?.color || "bg-muted text-foreground"
                        }`}
                      >
                        {categoryData?.label || faq.category}
                      </Badge>
                      {faq.status === "solved" && (
                        <CheckCircle2 size={16} className="text-green-600" />
                      )}
                      {faq.status === "unanswered" && (
                        <MessageCircle
                          size={16}
                          className="text-muted-foreground"
                        />
                      )}
                    </div>

                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {faq.question}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                      <span>{faq.views} visualizações</span>
                      <span>
                        {faq.answerCount}{" "}
                        {faq.answerCount === 1 ? "resposta" : "respostas"}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedFaqs.map((faq) => {
                const categoryData = CATEGORIES.find(
                  (c) => c.id === faq.category
                );
                return (
                  <Card
                    key={faq.id}
                    onClick={() => handleQuestionClick(faq)}
                    className="p-4 hover:shadow-md transition-all cursor-pointer border border-border group hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="secondary"
                            className={`text-xs font-semibold ${
                              categoryData?.color || "bg-muted text-foreground"
                            }`}
                          >
                            {categoryData?.label || faq.category}
                          </Badge>
                          {faq.status === "solved" && (
                            <CheckCircle2
                              size={14}
                              className="text-green-600"
                            />
                          )}
                          {faq.status === "unanswered" && (
                            <MessageCircle
                              size={14}
                              className="text-muted-foreground"
                            />
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                        <span>{faq.views} visualizações</span>
                        <span>
                          {faq.answerCount}{" "}
                          {faq.answerCount === 1 ? "resposta" : "respostas"}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft size={16} />
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-9 h-9 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Próxima
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </>
      )}

      {filteredFaqs.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhuma pergunta encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
}
