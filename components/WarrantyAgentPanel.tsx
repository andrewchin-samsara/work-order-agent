import React, { useEffect, useRef, useState } from 'react';
import { X, Send, Bot, Loader2, CheckCircle2, AlertTriangle, FileText, Sparkles } from 'lucide-react';
import { WarrantyDraft, ChatMessage, WorkOrder, ClaimData } from '../types';
import { generateWarrantyDraft, updateClaimDraft } from '../services/geminiService';

interface WarrantyAgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder;
  onCreateDraft: (draft: WarrantyDraft) => void;
  // New props for Draft Mode
  isDraftMode?: boolean;
  currentClaim?: ClaimData | null;
  onUpdateClaim?: (updatedClaim: ClaimData) => void;
}

export const WarrantyAgentPanel: React.FC<WarrantyAgentPanelProps> = ({ 
  isOpen, 
  onClose, 
  workOrder, 
  onCreateDraft,
  isDraftMode = false,
  currentClaim,
  onUpdateClaim
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'agent', 
      content: `Hi! I'm your Warranty Agent. I can help you draft a claim for Work Order #${workOrder.id}. Would you like me to scan for covered items?` 
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when switching modes, or keep history? 
  // For this demo, let's reset if we enter draft mode to give context.
  useEffect(() => {
    if (isDraftMode) {
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                role: 'agent',
                content: "I've created the draft. You can review it on the left. If you need to make changes, just let me know here (e.g., 'Add more detail to the cause')."
            }
        ]);
    }
  }, [isDraftMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleStartScan = async () => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: 'Yes, scan this work order.' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const draft = await generateWarrantyDraft(workOrder);
      setIsTyping(false);
      
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: 'I\'ve analyzed the work order. Based on the VMRS codes and your warranty policy, I found some coverable items.',
        type: 'draft_preview',
        data: draft
      };
      setMessages(prev => [...prev, agentResponse]);

    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'agent', 
        content: 'Sorry, I encountered an error analyzing the warranty. Please try again.' 
      }]);
    }
  };

  const handleSendMessage = async (manualContent?: string) => {
    const contentToSend = typeof manualContent === 'string' ? manualContent : inputValue;
    if (!contentToSend.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: contentToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!manualContent) setInputValue("");
    setIsTyping(true);

    if (isDraftMode && currentClaim && onUpdateClaim) {
        // Handle Draft Update logic
        try {
            const result = await updateClaimDraft(currentClaim, contentToSend);
            
            // Update the claim data in parent
            const updatedClaim = {
                ...currentClaim,
                threeCs: result.threeCs
            };
            onUpdateClaim(updatedClaim);

            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'agent',
                content: `${result.explanation}`
            }]);
        } catch (e) {
             setIsTyping(false);
             setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'agent',
                content: "I'm sorry, I couldn't update the claim. Please try again."
            }]);
        }
    } else {
        // Fallback for non-draft mode chat (not implemented fully for this demo)
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'agent',
                content: "I'm focusing on analyzing the work order right now. Click 'Scan for Warranty Coverage' to get started."
            }]);
        }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleSendMessage();
      }
  }

  const DraftCard: React.FC<{ draft: WarrantyDraft }> = ({ draft }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-2 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Warranty Draft
        </h4>
        <span className="text-green-600 font-bold text-sm">${draft.totalClaimable.toFixed(2)} Est.</span>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">3Cs Generated</h5>
        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
            <div><span className="font-medium text-gray-700">Concern:</span> <span className="text-gray-600">{draft.threeCs.concern}</span></div>
            <div><span className="font-medium text-gray-700">Cause:</span> <span className="text-gray-600">{draft.threeCs.cause}</span></div>
            <div><span className="font-medium text-gray-700">Correction:</span> <span className="text-gray-600">{draft.threeCs.correction}</span></div>
        </div>
      </div>

      {draft.missedOpportunities.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-3 rounded">
            <h5 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Missed Opportunities
            </h5>
            <ul className="list-disc list-inside text-xs text-amber-700">
                {draft.missedOpportunities.map((mo, idx) => (
                    <li key={idx}>{mo.reason}</li>
                ))}
            </ul>
        </div>
      )}

      {draft.exclusionFlags.length > 0 && (
          <div>
             <h5 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">Potential Exclusions</h5>
             <div className="flex flex-wrap gap-1">
                 {draft.exclusionFlags.map((flag, i) => (
                     <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-100">{flag}</span>
                 ))}
             </div>
          </div>
      )}

      <button 
        onClick={() => onCreateDraft(draft)}
        className="w-full mt-2 bg-samsara-blue hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
      >
          View Claim Draft
      </button>
    </div>
  );

  return (
    <div 
      className={`fixed top-0 right-0 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out w-96 z-50 flex flex-col border-l border-gray-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Warranty Agent</h2>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Active
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-samsara-blue text-white' : 'bg-white border border-gray-200 text-gray-800'} rounded-2xl px-4 py-3 shadow-sm text-sm`}>
              {msg.type === 'draft_preview' ? (
                <>
                  <p className="mb-2">{msg.content}</p>
                  {msg.data && <DraftCard draft={msg.data} />}
                </>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span className="text-xs text-gray-500">{isDraftMode ? 'Updating claim...' : 'Analyzing Work Order coverage...'}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {messages.length === 1 && !isDraftMode && !isTyping && (
            <button 
                onClick={handleStartScan}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm mb-3"
            >
                <Sparkles size={16} />
                Scan for Warranty Coverage
            </button>
        )}

        {isDraftMode && !isTyping && (
           <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              <button onClick={() => handleSendMessage("Add more detail to the cause")} className="whitespace-nowrap bg-purple-50 text-purple-700 border border-purple-200 text-xs px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors">
                Add detail to cause
              </button>
              <button onClick={() => handleSendMessage("Make the tone more professional")} className="whitespace-nowrap bg-purple-50 text-purple-700 border border-purple-200 text-xs px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors">
                Make professional
              </button>
              <button onClick={() => handleSendMessage("Emphasize safety impact")} className="whitespace-nowrap bg-purple-50 text-purple-700 border border-purple-200 text-xs px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors">
                Emphasize safety
              </button>
           </div>
        )}

        <div className="relative">
          <input 
            type="text" 
            placeholder={isDraftMode ? "Ask to change details..." : "Type a message..."}
            className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-purple-500 text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={() => handleSendMessage()} 
            className="absolute right-2 top-1.5 p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};