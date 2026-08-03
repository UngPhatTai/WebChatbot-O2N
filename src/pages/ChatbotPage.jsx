import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  IconButton,
  InputBase,
  LinearProgress,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// Import Sub-path Direct Icons chống crash Vite
import AttachFile from '@mui/icons-material/AttachFile'
import AutoAwesome from '@mui/icons-material/AutoAwesome'
import BarChart from '@mui/icons-material/BarChart'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import ImageOutlined from '@mui/icons-material/ImageOutlined'
import VideocamOutlined from '@mui/icons-material/VideocamOutlined'
import FolderZipOutlined from '@mui/icons-material/FolderZipOutlined'
import SendRounded from '@mui/icons-material/SendRounded'
import CheckCircle from '@mui/icons-material/CheckCircle'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import AutoFixHighOutlined from '@mui/icons-material/AutoFixHighOutlined'
import DiamondOutlined from '@mui/icons-material/DiamondOutlined'
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import CodeOutlined from '@mui/icons-material/CodeOutlined'
import CampaignOutlined from '@mui/icons-material/CampaignOutlined'
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined'
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined'

import { motion, AnimatePresence } from 'framer-motion'

import logoImg from '../assets/transperant.png'
import '../css/Chatbotpage.css'

const PRESETS = [
  {
    id: 'p1',
    title: 'Phân tích dữ liệu',
    subtitle: 'Tải lên tệp CSV hoặc JSON',
    prompt: 'Phân tích dữ liệu này và tóm tắt các xu hướng chính.',
    accent: '#06A8D9',
    icon: <BarChart fontSize="small" />,
  },
  {
    id: 'p2',
    title: 'Bản nháp nội dung',
    subtitle: 'Bài viết, email, mã nguồn',
    prompt: 'Viết bản nháp nội dung theo phong cách chuyên nghiệp và ngắn gọn.',
    accent: '#F57F1F',
    icon: <DescriptionOutlined fontSize="small" />,
  },
]

const MY_CUSTOM_GEMS = [
  {
    id: 'g1',
    name: 'Trợ lý Viết Code React & MUI',
    description: 'Tự động tối ưu CSS & Fix lỗi Flexbox.',
    prompt: 'Tôi là Trợ lý Viết Code React & MUI. Hãy gửi đoạn mã hoặc lỗi bạn cần sửa!',
    icon: CodeOutlined,
  },
  {
    id: 'g2',
    name: 'Chuyên gia Content Marketing',
    description: 'Tạo kịch bản TikTok & Bài viết SEO viral.',
    prompt: 'Tôi là Chuyên gia Content Marketing. Bạn muốn lên ý tưởng cho chiến dịch nào?',
    icon: CampaignOutlined,
  },
]

const LIBRARY_ITEMS = [
  { id: 'img', label: 'Thư viện hình ảnh', icon: <ImageOutlined sx={{ color: '#06A8D9' }} />, to: '/library' },
  { id: 'doc', label: 'Thư viện tài liệu', icon: <DescriptionOutlined sx={{ color: '#F57F1F' }} />, to: '/library' },
  { id: 'video', label: 'Thư viện video', icon: <VideocamOutlined sx={{ color: '#F57F1F' }} />, to: '/library' },
  { id: 'upload', label: 'Tài liệu đã tải lên', icon: <FolderZipOutlined sx={{ color: '#06A8D9' }} />, to: '/library' },
]

const RECENT_CHATS = [
  { id: 'c1', title: 'Phân tích dữ liệu tiếp thị quý 3', time: '2 giờ trước' },
  { id: 'c2', title: 'Tạo hình đại diện phong cách Cyberpunk', time: 'Hôm qua' },
  { id: 'c3', title: 'Tóm tắt cuộc họp hàng tuần', time: 'Ngày 24 tháng 10 năm 2023' },
]

export default function ChatbotPage() {
  const theme = useTheme()
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()

  const [activeAgent, setActiveAgent] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [modelMode, setModelMode] = useState('pro')
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeImageDetail, setActiveImageDetail] = useState(null)
  
  // State điều khiển mở Off-Canvas bộ công cụ bên phải cho Mobile/Tablet
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    const passedAgent = location.state?.customAgent
    if (passedAgent) {
      handleSelectGem(passedAgent)
    } else {
      initDefaultChat()
    }
  }, [location.state])

  // Lắng nghe Event Custom nếu bấm từ Navbar chung
  useEffect(() => {
    const handleToggleToolsEvent = () => {
      setIsRightPanelOpen((prev) => !prev)
    }

    window.addEventListener('app-trigger-toggle-tools', handleToggleToolsEvent)
    return () => window.removeEventListener('app-trigger-toggle-tools', handleToggleToolsEvent)
  }, [])

  const initDefaultChat = () => {
    setActiveAgent(null)
    setMessages([
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'Xin chào Alex! Tôi là ONE NINE, trợ lý AI tiên tiến của bạn. Tôi sẵn sàng hỗ trợ bạn trong việc phân tích dữ liệu, tạo nội dung hoặc tự động hóa quy trình làm việc ngay hôm nay.',
        timestamp: '10:00 AM',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Dưới đây là một vài điều chúng ta có thể bắt đầu từ:',
        hasPresets: true,
        timestamp: '10:01 AM',
      },
    ])
  }

  const handleSelectGem = (gem) => {
    setActiveAgent(gem)
    setMessages([
      {
        id: `gem-start-${Date.now()}`,
        role: 'assistant',
        content: `[TRỢ LÝ AI: ${gem.name.toUpperCase()}]: ${gem.prompt || 'Tôi đã sẵn sàng hỗ trợ bạn! Hãy gửi câu hỏi đầu tiên.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    if (isTabletOrMobile) setIsRightPanelOpen(false)
  }

  const handleSendMessage = async (textToSend = draft) => {
    const trimmed = textToSend.trim()
    if (!trimmed && !selectedFile) return

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: trimmed,
      attachment: selectedFile ? {
        id: `att-${Date.now()}`,
        name: selectedFile.name,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'Đã tải lên',
      } : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setSelectedFile(null)
    setIsTyping(true)

    setTimeout(() => {
      const isImageRequest = trimmed.toLowerCase().includes('tạo ảnh') || trimmed.toLowerCase().includes('vẽ')
      
      let botResponse = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: activeAgent
          ? `[${activeAgent.name}]: Tôi đã tiếp nhận yêu cầu "${trimmed}" và phản hồi theo đúng chuyên môn tối ưu.`
          : `Tôi đã nhận được yêu cầu: "${trimmed}". Tôi đang xử lý thông tin...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      if (isImageRequest) {
        botResponse = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: 'Hình ảnh nghệ thuật của bạn đã được khởi tạo thành công:',
          generatedImage: {
            title: 'Thành phố Cyberpunk Ban Đêm',
            author: '@UngPhatTai',
            imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop',
            prompt: trimmed,
            model: 'Cinematix-V3 Pro',
            seed: Math.floor(Math.random() * 100000000).toString(),
            aspectRatio: '16:9',
            motionScale: '9.0 / 10',
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1200)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) setSelectedFile(file)
  }

  const handleOptimizePrompt = () => {
    if (!draft.trim()) return
    setIsOptimizing(true)
    setTimeout(() => {
      setDraft((prev) => `[PROMPT NÂNG CẤP CHUYÊN NGHIỆP]: ${prev.trim()}, chi tiết cao, phong cách Octane Render 8K.`)
      setIsOptimizing(false)
    }, 800)
  }

  const renderRightPanelContent = () => (
    <>
      {/* KHỐI CHỌN GEM NHANH */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Agent của tôi (Gems)</div>
          <Link
            to="/persona"
            style={{
              fontSize: '11.5px',
              color: '#06A8D9',
              textDecoration: 'none',
              fontWeight: 800,
              background: 'rgba(6,168,217,0.12)',
              padding: '3px 10px',
              borderRadius: '12px',
              border: '1px solid rgba(6,168,217,0.3)',
            }}
          >
            + Quản lý
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {MY_CUSTOM_GEMS.map((gem) => {
            const IconComp = gem.icon || SmartToyOutlined
            const isSelected = activeAgent?.name === gem.name
            return (
              <div
                key={gem.id}
                onClick={() => handleSelectGem(gem)}
                style={{
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(6,168,217,0.15)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid #06A8D9' : '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <IconComp style={{ fontSize: 18, color: isSelected ? '#06A8D9' : '#8E9BAE' }} />
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: isSelected ? '#FFF' : '#CBD5E1' }}>{gem.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* MÔ HÌNH HOẠT ĐỘNG */}
      <div>
        <div className="section-label">Mô hình hoạt động</div>
        <div className="toggle-mode-container">
          <button className={`toggle-btn ${modelMode === 'saving' ? 'active' : ''}`} onClick={() => setModelMode('saving')}>Tốc độ / Tiết kiệm</button>
          <button className={`toggle-btn ${modelMode === 'pro' ? 'active' : ''}`} onClick={() => setModelMode('pro')}>Pro / Advanced</button>
        </div>
        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '8px' }}>Chi phí: {modelMode === 'pro' ? '5' : '1'} kim cương/tin nhắn</div>
      </div>

      {/* SỐ DƯ KHẢ DỤNG */}
      <div className="credit-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>Số dư khả dụng</span>
          <span className="credit-value-badge"><DiamondOutlined style={{ fontSize: 13 }} />1.250</span>
        </div>
        <LinearProgress variant="determinate" value={75} sx={{ height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #06A8D9, #F57F1F)' } }} />
      </div>

      {/* THƯ VIỆN CỦA TÔI */}
      <div>
        <div className="section-label">Thư viện của tôi</div>
        <div className="library-grid-2x2">
          {LIBRARY_ITEMS.map((item) => (
            <Link key={item.id} to={item.to} className="library-card-item" onClick={() => setIsRightPanelOpen(false)}>
              {item.icon}
              <span className="library-card-text">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* LỊCH SỬ CHAT */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Các cuộc trò chuyện gần đây</div>
          <span style={{ fontSize: '11px', color: '#06A8D9', cursor: 'pointer', fontWeight: 600 }}>Xem tất cả</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {RECENT_CHATS.map((chat) => (
            <div key={chat.id} className="history-item" onClick={() => setIsRightPanelOpen(false)}>
              <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(6,168,217,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06A8D9' }}><BarChart style={{ fontSize: 16 }} /></div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.title}</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>{chat.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <div className="chatbot-container">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />

      <div className="chat-main-panel">
        <img src={logoImg} alt="Brand Watermark Logo" className="chat-watermark-logo" />

        {/* HEADER HIỂN THỊ TRÊN CẢ PC VÀ MOBILE */}
        <div className="chat-header">
          <div className="chat-title-group">
            <span className="chat-title">
              {activeAgent ? `Trợ lý AI: ${activeAgent.name}` : 'Trợ lý AI'}
            </span>
            <div className="status-badge">
              <span className="status-dot"></span>
              Trực tuyến
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* 🟢 NÚT 3 CHẤM CỐ ĐỊNH DUY NHẤT BẤM BẬT/TẮT BỘ CÔNG CỤ ON MOBILE */}
            {isTabletOrMobile && (
              <Tooltip title="Mở bộ công cụ & Gems">
                <IconButton
                  className="btn-icon-ghost"
                  size="small"
                  onClick={() => setIsRightPanelOpen((prev) => !prev)}
                  sx={{
                    color: isRightPanelOpen ? '#06A8D9' : '#94A3B8',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: isRightPanelOpen ? 'rgba(6,168,217,0.15)' : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <MoreHorizOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {!isTabletOrMobile && (
              <button className="btn-new-chat" onClick={initDefaultChat}>
                + Trò chuyện mới
              </button>
            )}
          </div>
        </div>

        <div className="messages-list">
          <div className="date-divider">HÔM NAY</div>

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`msg-row ${msg.role}`}
              >
                {msg.role === 'assistant' && (
                  <div className="bot-avatar"><AutoAwesome fontSize="small" /></div>
                )}
                <div className={`msg-bubble ${msg.role}`}>
                  <div>{msg.content}</div>

                  {msg.hasPresets && (
                    <div className="presets-grid">
                      {PRESETS.map((p) => (
                        <div key={p.id} className="preset-card" onClick={() => handleSendMessage(p.prompt)}>
                          <div className="preset-icon-box" style={{ background: `${p.accent}18`, color: p.accent }}>{p.icon}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#FFF', fontSize: '13px' }}>{p.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{p.subtitle}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.attachment && (
                    <div className="attachment-card">
                      <InsertDriveFileOutlined sx={{ color: '#06A8D9' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#FFF', fontSize: '13px' }}>{msg.attachment.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{msg.attachment.size} • {msg.attachment.status}</div>
                      </div>
                      <CheckCircle sx={{ color: '#06A8D9', fontSize: 18 }} />
                    </div>
                  )}

                  {msg.generatedImage && (
                    <div className="chat-image-card" onClick={() => setActiveImageDetail(msg.generatedImage)}>
                      <img src={msg.generatedImage.imageUrl} alt={msg.generatedImage.title} className="chat-image-preview" />
                      <div className="chat-image-overlay">
                        <button className="btn-glass-action"><VisibilityOutlined fontSize="small" /> Xem chi tiết</button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="msg-row assistant">
              <div className="bot-avatar"><AutoAwesome fontSize="small" /></div>
              <div className="msg-bubble assistant">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-wrapper">
          {selectedFile && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 8, background: 'rgba(6, 168, 217, 0.1)', border: '1px solid rgba(6, 168, 217, 0.3)', marginBottom: 8, fontSize: '12px', color: '#06A8D9' }}>
              <InsertDriveFileOutlined fontSize="small" />
              <span>{selectedFile.name}</span>
              <CloseOutlined fontSize="small" style={{ cursor: 'pointer' }} onClick={() => setSelectedFile(null)} />
            </div>
          )}

          <div className="chat-input-box">
            <div className="input-actions-left">
              <Tooltip title="Đính kèm tệp">
                <IconButton className="btn-icon-ghost" size="small" onClick={() => fileInputRef.current?.click()}>
                  <AttachFile fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Tải ảnh">
                <IconButton className="btn-icon-ghost" size="small" onClick={() => fileInputRef.current?.click()}>
                  <ImageOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>

            <InputBase
              className="custom-input"
              multiline
              maxRows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeAgent ? `Nhập tin nhắn gửi cho ${activeAgent.name}...` : "Thông báo ONE NINE..."}
            />

            <button className="btn-optimize" onClick={handleOptimizePrompt} disabled={isOptimizing || !draft.trim()} style={{ opacity: !draft.trim() ? 0.5 : 1 }}>
              {isOptimizing ? 'Đang tối ưu...' : 'Tối ưu'}
            </button>

            <IconButton className="btn-send-cyan" disabled={!draft.trim() && !selectedFile} onClick={() => handleSendMessage()}>
              <SendRounded fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL CHO PC */}
      {!isTabletOrMobile ? (
        <div className="right-panel desktop-panel">
          {renderRightPanelContent()}
        </div>
      ) : (
        /* OFF-CANVAS DRAWER CHO MOBILE/TABLET MỞ BẰNG NÚT 3 CHẤM */
        <AnimatePresence>
          {isRightPanelOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mobile-drawer-backdrop"
                onClick={() => setIsRightPanelOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="mobile-right-panel-drawer"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFF' }}>Thông tin & Thư viện</span>
                  <IconButton onClick={() => setIsRightPanelOpen(false)} sx={{ color: '#FFF' }}>
                    <CloseOutlined fontSize="small" />
                  </IconButton>
                </div>
                {renderRightPanelContent()}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* MODAL LIGHTBOX */}
      <AnimatePresence>
        {activeImageDetail && (
          <div className="modal-overlay-backdrop" onClick={() => setActiveImageDetail(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ duration: 0.25 }} className="modal-detail-card" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setActiveImageDetail(null)}><CloseOutlined fontSize="small" /></button>
              <div className="modal-left-media">
                <img src={activeImageDetail.imageUrl} alt={activeImageDetail.title} className="modal-full-img" />
              </div>
              <div className="modal-right-info">
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{activeImageDetail.title}</h2>
                  <div className="modal-prompt-box">"{activeImageDetail.prompt}"</div>
                </div>
                <button className="btn-remix-cyan" onClick={() => { setDraft(activeImageDetail.prompt); setActiveImageDetail(null); }}>
                  <AutoFixHighOutlined fontSize="small" /> Gợi ý Remix / Sử dụng Prompt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}