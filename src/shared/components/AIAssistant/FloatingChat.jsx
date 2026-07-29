import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Loader2, Menu, Plus, MessageSquare } from 'lucide-react';
import { sendChatMessage, getChatHistory, getChatById } from '../../../shared/api';
import { useAuthStore } from '../../../features/auth/store/authStore';
import LogoImg from '../../../assets/smartGrowGt_Logo - copia.png';

export const FloatingChat = () => {
  const { user } = useAuthStore();
  const userId = user?._id || user?.uid || user?.id;

  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [chatList, setChatList] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (userId) {
        fetchChatList();
      }
    }
  }, [isOpen, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatList = async () => {
    try {
      const res = await getChatHistory(userId);
      if (res.success) {
        setChatList(res.chats);
      }
    } catch (error) {
      console.error("Error al obtener historial", error);
    }
  };

  const loadChat = async (id) => {
    try {
      setIsLoading(true);
      const res = await getChatById(id, userId);
      if (res.success) {
        setCurrentChatId(res.chat._id);
        setMessages(res.chat.messages);
      }
      setIsSidebarOpen(false); // Close sidebar on mobile after selecting
    } catch (error) {
      console.error("Error al cargar chat", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = () => {
    setCurrentChatId(null);
    setMessages([
      {
        role: 'model',
        text: '¡Hola! Soy tu Ingeniero Agrónomo virtual. ¿En qué te puedo ayudar hoy con tus cultivos?'
      }
    ]);
    setIsSidebarOpen(false);
  };

  // Cargar saludo inicial si no hay mensajes
  useEffect(() => {
    if (messages.length === 0) {
      createNewChat();
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !userId) return;

    const userText = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await sendChatMessage(userText, currentChatId, userId);
      
      if (res.success) {
        setMessages([...newMessages, { role: 'model', text: res.reply }]);
        
        // If it was a new chat, set the ID and refresh list to get the new title
        if (!currentChatId) {
          setCurrentChatId(res.chatId);
          fetchChatList();
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages([...newMessages, { role: 'model', text: 'Hubo un error de conexión. Por favor, intenta de nuevo más tarde.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-3rem)] sm:w-[600px] h-[75vh] max-h-[600px] sm:h-[550px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex overflow-hidden transition-all duration-300">
          
          {/* Sidebar - Historial de Chats */}
          <div className={`${isSidebarOpen ? 'w-full sm:w-[240px]' : 'w-0'} transition-all duration-300 bg-slate-50 dark:bg-slate-950/80 border-r border-slate-200 dark:border-white/10 flex flex-col overflow-hidden absolute sm:relative z-20 h-full`}>
            
            <div className="p-4 bg-emerald-600/10 dark:bg-emerald-500/5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">Historial de Chats</span>
              <button onClick={() => setIsSidebarOpen(false)} className="sm:hidden text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-3">
              <button 
                onClick={createNewChat}
                className="w-full flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus size={18} /> Nuevo Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {chatList.length === 0 ? (
                <p className="text-xs text-center text-slate-400 mt-4">No hay conversaciones previas</p>
              ) : (
                chatList.map((chat) => (
                  <button 
                    key={chat._id}
                    onClick={() => loadChat(chat._id)}
                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 text-sm transition-colors ${currentChatId === chat._id ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium' : 'hover:bg-slate-200 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                  >
                    <MessageSquare size={16} className="shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex justify-between items-center text-white shadow-md z-10 relative">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors mr-1"
                >
                  <Menu size={20} />
                </button>
                <div className="bg-white p-1 rounded-full w-10 h-10 flex items-center justify-center shadow-inner overflow-hidden">
                  <img src={LogoImg} alt="SmartGrow" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">SmartGrow Assistant</h3>
                  <p className="text-[10px] text-emerald-100 font-medium">Agrónomo Experto IA</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50 relative">
              {/* Logo Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                 <img src={LogoImg} alt="Watermark" className="w-64 grayscale" />
              </div>

              <div className="relative z-10 space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[90%] sm:max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      <div className={`shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shadow-sm overflow-hidden ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-white border-2 border-emerald-500'}`}>
                        {msg.role === 'user' ? <User size={18} /> : <img src={LogoImg} alt="AI" className="w-full h-full object-cover" />}
                      </div>
                      
                      <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-blue-500 text-white rounded-tr-none' 
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                      }`}>
                        {msg.text.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </div>

                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[85%] gap-3 flex-row">
                      <div className="shrink-0 h-10 w-10 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center overflow-hidden shadow-sm">
                         <img src={LogoImg} alt="AI" className="w-full h-full object-cover animate-pulse" />
                      </div>
                      <div className="p-4 rounded-2xl text-sm bg-white dark:bg-slate-800 text-slate-500 rounded-tl-none flex items-center gap-2 border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Loader2 size={16} className="animate-spin text-emerald-500" /> Analizando tu consulta...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 relative z-10">
              <div className="flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu consulta agrónomica..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none h-[50px] custom-scrollbar text-slate-700 dark:text-slate-200"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || !userId}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg shrink-0 flex items-center justify-center h-[50px] w-[50px] active:scale-95"
                >
                  <Send size={20} className={input.trim() ? 'ml-1' : ''} />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">Respuestas generadas por IA de SmartGrow. Consulta un experto si tienes dudas graves.</p>
            </div>

          </div>
        </div>
      )}

      {/* Botón Flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-full shadow-[0_10px_40px_rgba(16,185,129,0.4)] hover:shadow-[0_10px_50px_rgba(16,185,129,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center group relative border-2 border-white/20"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 p-0.5">
             <img src={LogoImg} alt="Chat" className="w-full h-full object-contain filter drop-shadow-md brightness-0 invert" />
          </div>
          {/* Tooltip */}
          <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium shadow-xl">
            Chat con Experto IA
          </span>
        </button>
      )}
    </div>
  );
};
