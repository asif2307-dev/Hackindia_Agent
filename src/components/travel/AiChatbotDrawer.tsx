import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AiChatbotDrawer: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; action?: string; link?: string }>>([
    {
      sender: 'ai',
      text: 'Namaste! I am your Agent Travel AI Assistant. How can I help with your booking or refund claim today?',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickQuestions = [
    'Check refund status for AT-9842',
    'What is DGCA rule for flight cancellation?',
    'How do I file train TDR for delayed train?',
    'Find cheap flights from Delhi to Mumbai',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let action = '';
      let link = '';

      if (lower.includes('at-9842') || lower.includes('refund status')) {
        reply = 'Case AT-9842 (Flight AI-805, Delhi → Mumbai) has been verified by the AI Engine. Statutory restitution of ₹9,450 ($120 USD) is approved under DGCA CAR Sec 3.';
        action = 'View Case Dossier';
        link = '/refund-investigations/AT-9842';
      } else if (lower.includes('dgca') || lower.includes('cancellation rule')) {
        reply = 'Under DGCA Civil Aviation Requirements (CAR) Section 3, Series M, Part IV: If an airline cancels a flight informed <24h prior, the passenger is entitled to a 100% full ticket refund PLUS compensation up to ₹10,000 depending on block time.';
      } else if (lower.includes('tdr') || lower.includes('train')) {
        reply = 'For trains delayed over 3 hours, IRCTC TDR must be filed before the actual departure of the train from the boarding station to claim a 100% fare refund. Our AI Engine files this automatically.';
      } else if (lower.includes('flight') || lower.includes('mumbai') || lower.includes('delhi')) {
        reply = 'We found 14 daily non-stop flights between Delhi and Mumbai starting at ₹4,420 (IndiGo & Air India). All tickets include autonomous disruption protection.';
      } else {
        reply = `Thank you for your inquiry about "${text}". Our autonomous arbitration system is tracking live carrier networks across India. You can launch the refund console anytime.`;
        action = 'Open Refund Console';
        link = '/dashboard';
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply, action, link }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom Right */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-3 sm:px-4 sm:py-3.5 rounded-full bg-gradient-to-r from-[#006D77] via-[#00818d] to-[#17324D] text-white shadow-[0_8px_30px_rgba(0,109,119,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#20B8B0]/40 select-none"
        aria-label="Open AI Travel Assistant"
      >
        <span className="material-symbols-outlined text-[24px] text-[#E8B86D] animate-pulse">auto_awesome</span>
        <span className="hidden sm:inline font-extrabold text-xs tracking-wider font-['Plus_Jakarta_Sans']">
          AI Assistant
        </span>
      </button>

      {/* Slide-in Chat Drawer / Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-96 max-w-[calc(100vw-2rem)] h-[480px] bg-white rounded-3xl shadow-2xl border border-[#C2EAE7] z-50 flex flex-col overflow-hidden animate-fade-in text-left">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0d283e] via-[#006D77] to-[#0a1e2e] text-white p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E8B86D] text-[#0d283e] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm font-['Plus_Jakarta_Sans']">Agent Travel AI Assistant</h4>
                <span className="text-[10px] text-[#20B8B0] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20B8B0]"></span>
                  Active Aviation & Rail Radar
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fbfa]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#006D77] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-[#C2EAE7]/60 rounded-bl-sm font-medium'
                  }`}
                >
                  {m.text}

                  {m.action && m.link && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate(m.link!);
                      }}
                      className="mt-2 block w-full py-1.5 px-3 rounded-xl bg-[#E8B86D] hover:bg-[#d9a552] text-[#0d283e] font-bold text-[11px] text-center shadow-sm cursor-pointer"
                    >
                      {m.action} &rarr;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions Strip */}
          <div className="p-2 border-t border-gray-100 bg-white flex gap-1.5 overflow-x-auto text-[11px]">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-[#EAF8F7] hover:bg-[#006D77] hover:text-white text-[#006D77] whitespace-nowrap text-[10px] font-semibold transition-colors shrink-0 cursor-pointer border border-[#C2EAE7]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about flights, trains, or refunds..."
              className="flex-1 px-3 py-2 bg-[#f8fbfa] border border-[#C2EAE7] rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#006D77] font-medium"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-xl bg-[#006D77] hover:bg-[#00565E] text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
