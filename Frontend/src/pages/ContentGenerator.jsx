import { useState } from "react";
import { Sparkles, Linkedin, Twitter } from "lucide-react";

const PLATFORMS = [
  { name: "LinkedIn", icon: Linkedin },
  { name: "Twitter/X", icon: Twitter },
];

const ContentGenerator = () => {
  const [platform, setPlatform] = useState("LinkedIn");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! What would you like to write about today?" },
  ]);
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setAiTyping(true);
    // Simulate AI response
    setTimeout(() => {
      const aiDraft = `Here's a draft for ${platform}: "${userMsg.text}"
\n[Your AI-powered post goes here...]`;
      setMessages((msgs) => [...msgs, { sender: "ai", text: aiDraft }]);
      setDraft(aiDraft);
      setEditing(true);
      setAiTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-2">
        <div className="w-full max-w-2xl">
          {/* Platform Selector */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-xl bg-white/80 dark:bg-gray-800/80 shadow p-1 gap-1">
              {PLATFORMS.map((p) => (
                <button
                  key={p.name}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 text-base ${
                    platform === p.name
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setPlatform(p.name)}
                >
                  <p.icon className="w-5 h-5" /> {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="relative h-[400px] md:h-[500px] overflow-y-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col gap-3 mb-6 border border-gray-200 dark:border-gray-700">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "ai" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl shadow text-base whitespace-pre-line transition-all duration-200 ${
                    msg.sender === "ai"
                      ? "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-900 dark:text-indigo-100 border border-indigo-200 dark:border-indigo-700"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <b className="block mb-1 text-xs opacity-60">
                    {msg.sender === "ai" ? "AI" : "You"}
                  </b>
                  {msg.text}
                </div>
              </div>
            ))}
            {aiTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl shadow bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-900 dark:text-indigo-100 border border-indigo-200 dark:border-indigo-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="animate-pulse">AI is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Floating Draft Card */}
          {editing && (
            <div className="w-full mb-8">
              <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 relative z-10">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Your Draft (editable):
                </label>
                <textarea
                  className="input w-full min-h-[100px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-base mb-2"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(draft)}
                  >
                    Copy Draft
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Sticky Input Bar */}
      <div className="w-full max-w-2xl mx-auto px-2 sticky bottom-0 z-20">
        <form
          className="flex gap-2 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            className="input flex-1 text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your idea or prompt..."
            disabled={aiTyping}
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!input || aiTyping}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContentGenerator;
