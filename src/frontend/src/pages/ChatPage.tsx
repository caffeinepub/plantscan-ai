import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Leaf, Send, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type ChatMessage,
  SUGGESTIONS,
  generateResponse,
} from "../utils/chatEngine";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground/50"
          style={{
            animation: "typing-dot 1.4s infinite ease-in-out",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  // Render simple markdown bold
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // biome-ignore lint/suspicious/noArrayIndexKey: static content from split, stable order
        return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
      }
      // biome-ignore lint/suspicious/noArrayIndexKey: static content from split, stable order
      return <span key={partIdx}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary border border-border text-primary"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser ? "chat-bubble-user" : "chat-bubble-bot"
        }`}
      >
        {(() => {
          const lines = message.content.split("\n");
          return lines.map((line, lineIdx) => (
            <p
              key={`${message.id}-line-${lineIdx}`}
              className={lineIdx < lines.length - 1 ? "mb-1.5" : ""}
            >
              {renderContent(line)}
            </p>
          ));
        })()}
      </div>
    </motion.div>
  );
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "bot",
  content:
    "Hi! I'm PlantBot 🌿 Ask me anything about plant diseases, symptoms, or treatments. I know about 12 common diseases and can help you identify, manage, and prevent them.",
  timestamp: Date.now(),
};

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [suggestionsShown, setSuggestionsShown] = useState(true);

  // Scroll to bottom on new messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll side effect intentionally triggered by message/typing state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setSuggestionsShown(false);
      setInput("");

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      // Simulate typing delay
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 400));

      const responseText = generateResponse(trimmed);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: responseText,
        timestamp: Date.now(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    },
    [isTyping],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 flex-shrink-0">
        <div className="container mx-auto px-4 py-5 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                PlantBot
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  Online · Plant Disease Expert
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 container mx-auto max-w-4xl w-full px-4 overflow-hidden flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto py-6 space-y-4 min-h-0"
          style={{ scrollBehavior: "smooth" }}
        >
          <AnimatePresence>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              data-ocid="chat.loading_state"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="chat-bubble-bot">
                <TypingIndicator />
              </div>
            </motion.div>
          )}

          {/* Quick suggestion chips */}
          {suggestionsShown && messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pl-11 space-y-2"
            >
              <p className="text-xs text-muted-foreground font-medium">
                Try asking:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: SUGGESTIONS is a static array with stable order
                    key={i}
                    type="button"
                    data-ocid={`chat.suggestion.item.${i + 1}`}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs px-3 py-1.5 bg-card border border-border rounded-full hover:bg-secondary hover:border-primary/30 transition-all text-foreground text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 py-4 border-t border-border">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              data-ocid="chat.message_input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about plant diseases... (Enter to send)"
              className="flex-1 resize-none min-h-[2.75rem] max-h-32 rounded-xl text-sm"
              rows={1}
              disabled={isTyping}
            />
            <Button
              data-ocid="chat.send_button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-11 w-11 rounded-xl flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </main>
  );
}
