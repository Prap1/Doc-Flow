import { useState, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Download, Trash2, Calendar, CheckSquare, Square, Share2, Search, Plus, Paperclip, Video, Mic, Play, Book, PenTool, Pencil, Eraser, Palette, Type } from 'lucide-react';
import { showToast } from './Toast';

export default function WhatsAppSection() {
  const [sessions, setSessions] = useState([
    {
      id: 1, name: 'John Doe', avatar: '🧑', unread: 2, chats: [
        { id: 1, sender: 'Me', text: 'Hello! How are you?', date: new Date().toISOString() },
        { id: 2, sender: 'John', text: 'I am good, thanks!', date: new Date().toISOString() }
      ]
    },
    {
      id: 2, name: 'Project Group', avatar: '👥', unread: 0, chats: [
        { id: 1, sender: 'Alice', text: 'Did we finish the docs?', date: new Date().toISOString() },
        { id: 2, sender: 'Me', text: 'Yes, almost done.', date: new Date().toISOString() }
      ]
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(1);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const chats = activeSession.chats;

  const [selectedChats, setSelectedChats] = useState([]);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showSavePopup, setShowSavePopup] = useState(false);

  const [newSender, setNewSender] = useState('Me');
  const [newText, setNewText] = useState('');

  const addChat = (type = 'text', mediaUrl = null) => {
    if (type === 'text' && !newText.trim()) return;

    let textContent = newText;
    if (type === 'video') textContent = '📷 Video Message';
    if (type === 'voice') textContent = '🎤 Voice Message (0:05)';

    const newChat = {
      id: Date.now(),
      sender: newSender,
      text: textContent,
      type: type,
      mediaUrl: mediaUrl,
      date: new Date().toISOString()
    };
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, chats: [...s.chats, newChat] };
      }
      return s;
    }));
    setNewText('');
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addChat('video', url);
    }
  };

  const handleVoiceRecord = () => {
    // Simulate recording and sending a voice message
    showToast('Recording voice message...', 'success');
    setTimeout(() => {
      addChat('voice');
    }, 1000);
  };

  const toggleSelect = (id) => {
    if (selectedChats.includes(id)) {
      setSelectedChats(selectedChats.filter(x => x !== id));
    } else {
      setSelectedChats([...selectedChats, id]);
    }
  };

  const handleGeneratePDF = () => {
    if (selectedChats.length > 0) {
      setShowSavePopup(true);
    } else {
      setShowDatePopup(true);
    }
  };

  const processDateSelection = () => {
    setShowDatePopup(false);
    setShowSavePopup(true);
  };

  const getChatsToExport = () => {
    let chatsToExport = chats;
    if (selectedChats.length > 0) {
      chatsToExport = chats.filter(c => selectedChats.includes(c.id));
    } else if (fromDate && toDate) {
      chatsToExport = chats.filter(c => {
        const d = new Date(c.date).getTime();
        return d >= new Date(fromDate).getTime() && d <= new Date(toDate).getTime();
      });
    }
    return chatsToExport;
  };

  const exportPDF = async (action) => {
    try {
      const chatsToExport = getChatsToExport();

      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([600, 800]);
      let y = 750;

      page.drawText(`WhatsApp Chat Export: ${activeSession.name}`, { x: 50, y, size: 20, color: rgb(0.2, 0.2, 0.2) });
      y -= 40;

      for (const chat of chatsToExport) {
        if (y < 50) {
          page = pdfDoc.addPage([600, 800]);
          y = 750;
        }
        page.drawText(`${new Date(chat.date).toLocaleString()} - ${chat.sender}:`, { x: 50, y, size: 10, color: rgb(0.4, 0.4, 0.4) });
        y -= 15;
        page.drawText(chat.text, { x: 50, y, size: 12, color: rgb(0, 0, 0) });
        y -= 25;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      if (action === 'download') {
        saveAs(blob, `WhatsApp_${activeSession.name.replace(/\s+/g, '_')}.pdf`);
        showToast('PDF Downloaded!', 'success');
        setShowSavePopup(false);
      } else {
        // Prepare file for sharing if Web Share API is available
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'share.pdf', { type: 'application/pdf' })] })) {
          const file = new File([blob], `WhatsApp_${activeSession.name.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });
          navigator.share({
            files: [file],
            title: 'WhatsApp Chat Export',
            text: 'Check out this exported chat.'
          }).catch(console.error);
        } else {
          // If unsupported, just show the custom share options UI
          setShowSavePopup('shareOptions');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error generating PDF', 'error');
    }
  };

  const handleCustomShare = (platform) => {
    showToast(`Sharing to ${platform}... (Mock)`, 'success');
    setShowSavePopup(false);
  };

  return (
    <div className="whatsapp-container">

      {/* Sidebar - Sessions List */}
      <div className="whatsapp-sidebar">
        {/* <div style={{ padding: '12px 16px', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ fontWeight: 600, color: '#333' }}>Chats</div>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#54656f' }}><Plus size={20} /></button>
        </div> */}

        <div style={{ padding: '8px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: 8, padding: '6px 12px', border: '1px solid #ddd' }}>
            <Search size={16} color="#888" style={{ marginRight: 8 }} />
            <input placeholder="Search or start new chat" style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14 }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => { setActiveSessionId(s.id); setSelectedChats([]); }}
              style={{
                display: 'flex', alignItems: 'center', padding: '12px 16px', cursor: 'pointer',
                background: activeSessionId === s.id ? '#f0f2f5' : 'white',
                borderBottom: '1px solid #f2f2f2'
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginRight: 12 }}>
                {s.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#111', fontSize: 15 }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: '#667781' }}>
                    {s.chats.length > 0 ? new Date(s.chats[s.chats.length - 1].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#667781', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.chats.length > 0 ? s.chats[s.chats.length - 1].text : 'No messages'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="whatsapp-main">
        {/* Header */}
        <div style={{ background: '#f0f2f5', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#111', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {activeSession.avatar}
            </div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{activeSession.name}</div>
          </div>
          <button className="btn" style={{ background: '#00a884', color: 'white', border: 'none', borderRadius: 20, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }} onClick={handleGeneratePDF}>
            <Download size={16} /> Generate PDF
          </button>
        </div>

        {/* Chat List */}
        <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {chats.map(chat => (
            <div key={chat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, alignSelf: chat.sender === 'Me' ? 'flex-end' : 'flex-start' }}>
              <div onClick={() => toggleSelect(chat.id)} style={{ cursor: 'pointer', color: '#00a884' }}>
                {selectedChats.includes(chat.id) ? <CheckSquare size={20} /> : <Square size={20} />}
              </div>
              <div style={{
                background: chat.sender === 'Me' ? '#d9fdd3' : 'white',
                padding: '8px 12px',
                borderRadius: 8,
                maxWidth: 400,
                boxShadow: '0 1px 2px rgba(11,20,26,0.1)',
                color: '#111'
              }}>
                {chat.sender !== 'Me' && <div style={{ fontSize: 11, fontWeight: 600, color: '#075E54', marginBottom: 4 }}>{chat.sender}</div>}

                {chat.type === 'video' && (
                  <div style={{ marginBottom: 4 }}>
                    <video src={chat.mediaUrl} controls style={{ maxWidth: 200, borderRadius: 8, background: 'black' }} />
                  </div>
                )}

                {chat.type === 'voice' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, background: chat.sender === 'Me' ? '#ccf4c2' : '#f0f0f0', padding: '6px 12px', borderRadius: 99 }}>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Play size={16} color={chat.sender === 'Me' ? '#00a884' : '#54656f'} /></button>
                    <div style={{ width: 100, height: 4, background: '#ccc', borderRadius: 2 }}>
                      <div style={{ width: '30%', height: '100%', background: chat.sender === 'Me' ? '#00a884' : '#54656f', borderRadius: 2 }}></div>
                    </div>
                    <span style={{ fontSize: 11, color: '#54656f' }}>0:05</span>
                  </div>
                )}

                {chat.type === 'text' && (
                  <div style={{ fontSize: 14 }}>{chat.text}</div>
                )}

                <div style={{ fontSize: 10, color: '#667781', textAlign: 'right', marginTop: 4 }}>
                  {new Date(chat.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div style={{ padding: '12px 16px', background: '#f0f2f5', display: 'flex', gap: 10, alignItems: 'center' }}>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#54656f', padding: 8 }}>
            <Paperclip size={20} />
            <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} />
          </label>
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addChat('text')}
            placeholder="Type a message"
            style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: 'none', outline: 'none', fontSize: 15 }}
          />
          {newText.trim() ? (
            <button onClick={() => addChat('text')} style={{ background: '#00a884', color: 'white', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ➤
            </button>
          ) : (
            <button onClick={handleVoiceRecord} style={{ background: '#00a884', color: 'white', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Date Popup */}
      {showDatePopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 30, borderRadius: 16, width: 400, color: '#111', border: '1px solid #ddd' }}>
            <h3 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={20} /> Select Date Range</h3>
            <p style={{ color: '#666', fontSize: 13, marginBottom: 12, background: '#f0f2f5', padding: '8px 12px', borderRadius: 8 }}>
              {fromDate && toDate ? `${getChatsToExport().length} messages in selected range` : `${chats.length} total messages`}
            </p>
            
            <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 8, padding: '10px', marginBottom: 16, maxHeight: 120, overflowY: 'auto', textAlign: 'left' }}>
              {getChatsToExport().map(chat => (
                <div key={chat.id} style={{ fontSize: 12, marginBottom: 6, color: '#444', borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>
                  <strong>{chat.sender}:</strong> {chat.text}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#666' }}>From Date</label>
              <input type="datetime-local" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, background: '#f0f2f5', color: '#111', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#666' }}>To Date</label>
              <input type="datetime-local" value={toDate} onChange={e => setToDate(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, background: '#f0f2f5', color: '#111', border: '1px solid #ddd' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn" style={{ flex: 1, justifyContent: 'center', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 500 }} onClick={() => setShowDatePopup(false)}>Cancel</button>
              <button className="btn" style={{ flex: 1, justifyContent: 'center', background: '#00a884', color: 'white', border: 'none', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 500 }} onClick={processDateSelection}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Save Popup */}
      {showSavePopup === true && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 30, borderRadius: 16, width: 400, color: '#111', border: '1px solid #ddd', textAlign: 'center', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: 20 }}>Save & Export PDF</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 12 }}>{getChatsToExport().length} messages selected. Choose an option below.</p>
            
            <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 8, padding: '10px', marginBottom: 24, maxHeight: 150, overflowY: 'auto', textAlign: 'left', flexShrink: 1 }}>
              {getChatsToExport().map(chat => (
                <div key={chat.id} style={{ fontSize: 12, marginBottom: 6, color: '#444', borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>
                  <strong>{chat.sender}:</strong> {chat.text}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              <button className="btn" onClick={() => exportPDF('download')} style={{ padding: '12px', display: 'flex', justifyContent: 'center', background: '#00a884', color: 'white' }}>
                <Download size={18} /> Download PDF
              </button>
              <button className="btn" onClick={() => exportPDF('share')} style={{ padding: '12px', display: 'flex', justifyContent: 'center', background: '#f5f5f5', color: '#333', border: '1px solid #ddd' }}>
                <Share2 size={18} /> Share PDF
              </button>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn" onClick={() => { setShowSavePopup(false); setShowDatePopup(true); }} style={{ flex: 1, justifyContent: 'center', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 500 }}>Previous</button>
                <button className="btn" onClick={() => setShowSavePopup(false)} style={{ flex: 1, justifyContent: 'center', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 500 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Options Popup */}
      {showSavePopup === 'shareOptions' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 30, borderRadius: 16, width: 400, color: '#111', border: '1px solid #ddd', textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20 }}>Share to Social Media</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Select a platform to share your PDF directly.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {['WhatsApp', 'Twitter / X', 'LinkedIn', 'Facebook', 'Email'].map(platform => (
                <button key={platform} className="btn" onClick={() => handleCustomShare(platform)} style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '12px', display: 'flex', justifyContent: 'center', fontSize: 14 }}>
                  {platform}
                </button>
              ))}
            </div>
            <button className="btn" onClick={() => setShowSavePopup(true)} style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 500, width: '100%', justifyContent: 'center' }}>Previous</button>
          </div>
        </div>
      )}
    </div>
  );
}
