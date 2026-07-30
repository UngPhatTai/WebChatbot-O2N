import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IconButton,
  InputBase,
  LinearProgress,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  AttachFile,
  AutoAwesome,
  BarChart,
  DescriptionOutlined,
  ImageOutlined,
  VideocamOutlined, // ✅ Icon cho Thư viện video
  FolderZipOutlined, // ✅ Icon cho Tài liệu đã tải lên
  MoreHoriz,
  SendRounded,
  CheckCircle,
  ShareOutlined,
  CloseOutlined,
  VisibilityOutlined,
  AutoFixHighOutlined,
  DiamondOutlined, // ✅ Icon Kim Cương
  HistoryOutlined,
  InsertDriveFileOutlined,
} from '@mui/icons-material'
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

const INITIAL_MESSAGES = [
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
  {
    id: 'msg-3',
    role: 'user',
    content: 'Tôi cần một bản tóm tắt nhanh về hiệu quả chiến dịch tiếp thị gần đây của chúng ta. Tôi đã có bộ dữ liệu sẵn sàng rồi.',
    timestamp: '10:02 AM',
  },
  {
    id: 'msg-4',
    role: 'assistant',
    content: 'Tôi đã nhận được tệp dữ liệu của bạn. Hãy để tôi phân tích các chỉ số chính và đưa ra một bản tóm tắt nhanh.',
    attachment: {
      id: 'att-1',
      name: 'campaign_q3_metrics.csv',
      size: '2,4 MB',
      status: 'Vừa được tải lên',
    },
    timestamp: '10:03 AM',
  },
  {
    id: 'msg-5',
    role: 'user',
    content: 'Tạo giúp tôi hình ảnh một con chim ruồi Cyberpunk hút mật hoa phát sáng trong rừng sâu.',
    timestamp: '10:04 AM',
  },
  {
    id: 'msg-6',
    role: 'assistant',
    content: 'Dưới đây là bức ảnh AI nghệ thuật được tạo từ yêu cầu của bạn:',
    generatedImage: {
      title: 'Chim ruồi Cyber-Iris',
      author: '@AuraNexus',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
      prompt: 'Cảnh quay cận cảnh một con chim ruồi robot với đôi cánh bằng thủy tinh trong mờ, đang hút năng lượng sống từ một cụm hoa phát quang sinh học rực rỡ, ánh sáng mang phong cách điện ảnh, độ phân giải 8K, công nghệ đố tia, bầu không khí vũ trụ sâu thẳm.',
      model: 'Cinematix-V3 Pro',
      seed: '88294105',
      aspectRatio: '16:9',
      motionScale: '8.5 / 10',
    },
    timestamp: '10:05 AM',
  },
]

// ✅ ĐÃ ĐỔI TÊN & ICON THƯ VIỆN CỦA TÔI
const LIBRARY_ITEMS = [
  { id: 'img', label: 'Thư viện hình ảnh', icon: <ImageOutlined sx={{ color: '#06A8D9' }} />, to: '/library' },
  { id: 'doc', label: 'Thư viện tài liệu', icon: <DescriptionOutlined sx={{ color: '#F57F1F' }} />, to: '/library' },
  { id: 'video', label: 'Thư viện video', icon: <VideocamOutlined sx={{ color: '#F57F1F' }} />, to: '/library' }, // ✅ Đổi thành Thư viện video
  { id: 'upload', label: 'Tài liệu đã tải lên', icon: <FolderZipOutlined sx={{ color: '#06A8D9' }} />, to: '/library' }, // ✅ Đổi thành Tài liệu đã tải lên
]

const RECENT_CHATS = [
  { id: 'c1', title: 'Phân tích dữ liệu tiếp thị quý 3', time: '2 giờ trước' },
  { id: 'c2', title: 'Tạo hình đại diện phong cách Cyberpunk', time: 'Hôm qua' },
  { id: 'c3', title: 'Tóm tắt cuộc họp hàng tuần', time: 'Ngày 24 tháng 10 năm 2023' },
]

export default function ChatbotPage() {
  const theme = useTheme()
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md')) // < 900px

  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [modelMode, setModelMode] = useState('pro') // 'saving' | 'pro'
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeImageDetail, setActiveImageDetail] = useState(null)
  
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
    const handleNewChatEvent = () => {
      setMessages(INITIAL_MESSAGES)
      setIsRightPanelOpen(false)
    }

    const handleToggleToolsEvent = () => {
      setIsRightPanelOpen((prev) => !prev)
    }

    window.addEventListener('app-trigger-new-chat', handleNewChatEvent)
    window.addEventListener('app-trigger-toggle-tools', handleToggleToolsEvent)

    return () => {
      window.removeEventListener('app-trigger-new-chat', handleNewChatEvent)
      window.removeEventListener('app-trigger-toggle-tools', handleToggleToolsEvent)
    }
  }, [])

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
      const isImageRequest = trimmed.toLowerCase().includes('tạo ảnh') || trimmed.toLowerCase().includes('vẽ') || trimmed.toLowerCase().includes('hình ảnh')
      
      let botResponse = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `Tôi đã nhận được yêu cầu: "${trimmed}". Tôi đang xử lý thông tin...`,
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
    }, 1600)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleOptimizePrompt = () => {
    if (!draft.trim()) return
    setIsOptimizing(true)

    setTimeout(() => {
      const optimizedText = `[PROMPT NÂNG CẤP CHUYÊN NGHIỆP]: Cảnh quay điện ảnh góc siêu rộng, ${draft.trim()}, chi tiết cực cao, hiệu ứng ánh sáng Volumetric Lighting, phong cách Octane Render 8K, chất lượng HDR10+, nghệ thuật số sống động.`
      setDraft(optimizedText)
      setIsOptimizing(false)
    }, 800)
  }

  // Component render Right Panel
  const renderRightPanelContent = () => (
    <>
      <div>
        <div className="section-label">Mô hình hoạt động</div>
        <div className="toggle-mode-container">
          <button
            className={`toggle-btn ${modelMode === 'saving' ? 'active' : ''}`}
            onClick={() => setModelMode('saving')}
          >
            Tốc độ / Tiết kiệm
          </button>
          <button
            className={`toggle-btn ${modelMode === 'pro' ? 'active' : ''}`}
            onClick={() => setModelMode('pro')}
          >
            Pro / Advanced
          </button>
        </div>
        {/* ✅ ĐỔI THÀNH KIM CƯƠNG */}
        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '8px' }}>
          Chi phí: {modelMode === 'pro' ? '5' : '1'} kim cương/tin nhắn
        </div>
      </div>

      {/* ✅ CREDIT CARD ĐỔI THÀNH PILL BADGE KIM CƯƠNG */}
      <div className="credit-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>Số dư khả dụng</span>
          <span className="credit-value-badge">
            <DiamondOutlined style={{ fontSize: 13 }} />
            1.250
          </span>
        </div>
        <LinearProgress
          variant="determinate"
          value={75}
          sx={{
            height: 5,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.08)',
            '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #06A8D9, #F57F1F)' }
          }}
        />
      </div>

      {/* Thư viện của tôi */}
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

      {/* Lịch sử trò chuyện */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Các cuộc trò chuyện gần đây</div>
          <span style={{ fontSize: '11px', color: '#06A8D9', cursor: 'pointer', fontWeight: 600 }}>Xem tất cả</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {RECENT_CHATS.map((chat) => (
            <div key={chat.id} className="history-item" onClick={() => setIsRightPanelOpen(false)}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                background: 'rgba(6,168,217,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#06A8D9',
                flexShrink: 0
              }}>
                <BarChart style={{ fontSize: 16 }} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {chat.title}
                </div>
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <div className="chat-main-panel">
        <img src={logoImg} alt="Brand Watermark" className="chat-watermark-logo" />

        {!isTabletOrMobile && (
          <div className="chat-header">
            <div className="chat-title-group">
              <span className="chat-title">Trợ lý AI</span>
              <div className="status-badge">
                <span className="status-dot"></span>
                Trực tuyến
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button className="btn-new-chat" onClick={() => setMessages(INITIAL_MESSAGES)}>
                + Trò chuyện mới
              </button>
            </div>
          </div>
        )}

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
                  <div className="bot-avatar">
                    <AutoAwesome fontSize="small" />
                  </div>
                )}

                <div className={`msg-bubble ${msg.role}`}>
                  <div>{msg.content}</div>

                  {msg.hasPresets && (
                    <div className="presets-grid">
                      {PRESETS.map((p) => (
                        <div
                          key={p.id}
                          className="preset-card"
                          onClick={() => handleSendMessage(p.prompt)}
                        >
                          <div className="preset-icon-box" style={{ background: `${p.accent}18`, color: p.accent }}>
                            {p.icon}
                          </div>
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
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          {msg.attachment.size} • {msg.attachment.status}
                        </div>
                      </div>
                      <CheckCircle sx={{ color: '#06A8D9', fontSize: 18 }} />
                    </div>
                  )}

                  {msg.generatedImage && (
                    <div className="chat-image-card" onClick={() => setActiveImageDetail(msg.generatedImage)}>
                      <img
                        src={msg.generatedImage.imageUrl}
                        alt={msg.generatedImage.title}
                        className="chat-image-preview"
                      />
                      <div className="chat-image-overlay">
                        <button className="btn-glass-action">
                          <VisibilityOutlined fontSize="small" /> Xem chi tiết
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="msg-row assistant"
            >
              <div className="bot-avatar"><AutoAwesome fontSize="small" /></div>
              <div className="msg-bubble assistant">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-wrapper">
          {selectedFile && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 8,
              background: 'rgba(6, 168, 217, 0.1)',
              border: '1px solid rgba(6, 168, 217, 0.3)',
              marginBottom: 8,
              fontSize: '12px',
              color: '#06A8D9',
            }}>
              <InsertDriveFileOutlined fontSize="small" />
              <span>{selectedFile.name}</span>
              <CloseOutlined
                fontSize="small"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedFile(null)}
              />
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
              placeholder="Thông báo ONE NINE... Nhập '/' để xem các lệnh"
            />

            <button
              className="btn-optimize"
              onClick={handleOptimizePrompt}
              disabled={isOptimizing || !draft.trim()}
              style={{ opacity: !draft.trim() ? 0.5 : 1 }}
            >
              {isOptimizing ? 'Đang tối ưu...' : 'Tối ưu'}
            </button>

            <IconButton
              className="btn-send-cyan"
              disabled={!draft.trim() && !selectedFile}
              onClick={() => handleSendMessage()}
            >
              <SendRounded fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>

      {!isTabletOrMobile ? (
        <div className="right-panel desktop-panel">
          {renderRightPanelContent()}
        </div>
      ) : (
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
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              className="modal-detail-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setActiveImageDetail(null)}>
                <CloseOutlined fontSize="small" />
              </button>

              <div className="modal-left-media">
                <img
                  src={activeImageDetail.imageUrl}
                  alt={activeImageDetail.title}
                  className="modal-full-img"
                />
                <div className="modal-media-badges">
                  <span className="badge-tag">4K UHD</span>
                  <span className="badge-tag">60 khung hình/giây</span>
                </div>
              </div>

              <div className="modal-right-info">
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    {activeImageDetail.title}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Tác giả: <span style={{ color: '#06A8D9' }}>{activeImageDetail.author}</span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#06A8D9', fontWeight: 700, letterSpacing: '0.8px', marginTop: '24px', textTransform: 'uppercase' }}>
                    Lời gợi ý tạo nội dung
                  </div>

                  <div className="modal-prompt-box">
                    "{activeImageDetail.prompt}"
                  </div>

                  <div className="modal-metadata-grid">
                    <div className="metadata-item">
                      <div className="metadata-label">Mẫu</div>
                      <div className="metadata-value">{activeImageDetail.model}</div>
                    </div>
                    <div className="metadata-item">
                      <div className="metadata-label">Hạt giống</div>
                      <div className="metadata-value">{activeImageDetail.seed}</div>
                    </div>
                    <div className="metadata-item">
                      <div className="metadata-label">Thang đo chuyển động</div>
                      <div className="metadata-value">{activeImageDetail.motionScale}</div>
                    </div>
                    <div className="metadata-item">
                      <div className="metadata-label">Tỷ lệ khung hình</div>
                      <div className="metadata-value">{activeImageDetail.aspectRatio}</div>
                    </div>
                  </div>
                </div>

                <button
                  className="btn-remix-cyan"
                  onClick={() => {
                    setDraft(activeImageDetail.prompt)
                    setActiveImageDetail(null)
                  }}
                >
                  <AutoFixHighOutlined fontSize="small" />
                  Gợi ý Remix / Sử dụng Prompt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}