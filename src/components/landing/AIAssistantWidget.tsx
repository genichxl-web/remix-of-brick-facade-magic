import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Здравствуйте! Я AI-ассистент БРИК. Давайте рассчитаем стоимость забора для вашего участка. Подскажите, какова ширина участка в метрах?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!message.trim() || isLoading || leadSubmitted) return;

    const userMessage = message.trim();
    setMessage("");
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { messages: newMessages.map(m => ({ role: m.role, content: m.content })) }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Ошибка",
          description: data.error,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // If lead data is extracted, submit it to AMO CRM
      if (data?.leadData) {
        console.log("Lead data detected, submitting to AMO CRM:", data.leadData);
        
        const { data: submitData, error: submitError } = await supabase.functions.invoke("ai-assistant", {
          body: { submitLead: data.leadData }
        });

        if (submitError) {
          console.error("Failed to submit lead:", submitError);
        } else if (submitData?.leadSubmitted) {
          setLeadSubmitted(true);
          toast({
            title: "Заявка отправлена!",
            description: "Наш менеджер свяжется с вами в ближайшее время.",
          });
        }

        setMessages(prev => [...prev, { role: "assistant", content: submitData?.reply || data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (error) {
      console.error("AI Assistant error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить ответ. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">AI-Ассистент БРИК</h3>
                <p className="text-xs text-primary-foreground/70">Онлайн</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            {leadSubmitted ? (
              <p className="text-sm text-center text-muted-foreground">
                Заявка отправлена. Ожидайте звонка менеджера!
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-16 h-16 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isOpen ? "" : "animate-pulse"
        }`}
      >
        {/* Ripple Effect */}
        {!isOpen && (
          <>
            <span className="absolute w-full h-full rounded-full bg-primary/50 animate-ping" />
            <span className="absolute w-20 h-20 rounded-full border-2 border-primary/30 animate-[ping_2s_ease-in-out_infinite]" />
          </>
        )}
        
        {isOpen ? (
          <X className="w-7 h-7 text-primary-foreground transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
        )}

        {/* Notification Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs text-destructive-foreground font-bold animate-bounce">
            1
          </span>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-card border border-border rounded-lg px-3 py-2 shadow-lg animate-fade-in whitespace-nowrap">
          <p className="text-sm font-medium text-foreground">Задайте вопрос AI-ассистенту</p>
          <div className="absolute bottom-0 right-6 translate-y-1/2 rotate-45 w-2 h-2 bg-card border-r border-b border-border" />
        </div>
      )}
    </div>
  );
};

export default AIAssistantWidget;
