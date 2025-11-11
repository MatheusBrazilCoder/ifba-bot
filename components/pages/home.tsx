"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import NavTop from "@/components/layout/nav-top";
import SearchInput from "@/components/common/search-input";
import { Card } from "@/components/ui/card";
import { FAQ } from "./faq";
import Settings from "./settings";
import QuestionDetail from "./question-detail";

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

export function Home() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<FAQItem | null>(
    null
  );
  const [questions, setQuestions] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/questions");
        const data = await response.json();
        // Show only first 6 questions on home page
        setQuestions(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentPage === "home") {
      fetchQuestions();
    }
  }, [currentPage]);

  const handleQuestionClick = (question: FAQItem) => {
    setSelectedQuestion(question);
    setCurrentPage("question-detail");
  };

  const handleBackToHome = () => {
    setSelectedQuestion(null);
    setCurrentPage("home");
  };

  const handleToggle = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsMobileSheetOpen(!isMobileSheetOpen);
    } else {
      setIsNavbarOpen(!isNavbarOpen);
    }
  };

  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      <Navbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={isNavbarOpen}
        onToggle={() => setIsNavbarOpen(!isNavbarOpen)}
        isMobileSheetOpen={isMobileSheetOpen}
        onMobileSheetChange={setIsMobileSheetOpen}
      />

      <div className="flex-1 flex flex-col">
        <NavTop
          currentPage={currentPage}
          isOpen={isNavbarOpen}
          onToggle={handleToggle}
          onPageChange={setCurrentPage}
        />

        <main className="flex-1 overflow-auto p-6 md:p-8">
          {currentPage === "home" && (
            <div className="max-w-4xl mx-auto min-h-screen pt-[10%]">
              <h1 className="text-4xl font-bold text-center mb-4 text-foreground">
                Como eu posso te ajudar?
              </h1>

              <div className="mt-12 mb-12">
                <SearchInput onQuestionClick={handleQuestionClick} />
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Carregando perguntas...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {questions.slice(0, 3).map((item) => (
                    <Card
                      key={item.id}
                      onClick={() => handleQuestionClick(item)}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-border"
                    >
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {item.question}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.body || item.answer}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentPage === "question-detail" && selectedQuestion && (
            <QuestionDetail
              question={selectedQuestion}
              onBack={handleBackToHome}
            />
          )}

          {currentPage === "faq" && (
            <FAQ onQuestionClick={handleQuestionClick} />
          )}

          {currentPage === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
}
