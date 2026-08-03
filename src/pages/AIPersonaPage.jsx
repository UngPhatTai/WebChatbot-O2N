import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material'

import CodeOutlined from '@mui/icons-material/CodeOutlined'
import CampaignOutlined from '@mui/icons-material/CampaignOutlined'
import AddOutlined from '@mui/icons-material/AddOutlined'
import SettingsOutlined from '@mui/icons-material/SettingsOutlined'
import AutoAwesome from '@mui/icons-material/AutoAwesome'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import TranslateOutlined from '@mui/icons-material/TranslateOutlined'
import ShowChartOutlined from '@mui/icons-material/ShowChartOutlined'
import GavelOutlined from '@mui/icons-material/GavelOutlined'
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined'
import AutoFixHighOutlined from '@mui/icons-material/AutoFixHighOutlined'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined'
import PsychologyOutlined from '@mui/icons-material/PsychologyOutlined'
import ForestOutlined from '@mui/icons-material/ForestOutlined'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import WorkOutlineOutlined from '@mui/icons-material/WorkOutlineOutlined'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined'
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined'

import { motion, AnimatePresence } from 'framer-motion'

import logoImg from '../assets/transperant.png'
import '../css/AIPersonaPage.css'

// ============================================================================
// HẰNG SỐ CỦA CODER - LƯU MÃ BIỂU TƯỢNG VÀ TÙY CHỌN DỮ LIỆU
// ============================================================================
export const AVATAR_ICON_MAP = {
  sparkle: { id: 'sparkle', label: 'Lôi cuốn / Sáng tạo', component: AutoAwesome },
  bulb: { id: 'bulb', label: 'Ý tưởng / Tư duy', component: LightbulbOutlined },
  brain: { id: 'brain', label: 'Phân tích / Trí tuệ', component: PsychologyOutlined },
  leaf: { id: 'leaf', label: 'Thân thiện / Môi trường', component: ForestOutlined },
  support: { id: 'support', label: 'Chăm sóc / Bán hàng', component: SupportAgentOutlined },
}

const INITIAL_MY_GEMS = [
  {
    id: 'gem-1',
    name: 'Trợ lý Viết Code React & MUI',
    description: 'Tự động tối ưu CSS & Fix lỗi Flexbox cho các dự án web hiện đại.',
    iconType: 'code',
    isActive: true,
    prompt: 'Tôi là Trợ lý Viết Code React & MUI. Hãy gửi đoạn mã hoặc lỗi bạn cần sửa!',
  },
  {
    id: 'gem-2',
    name: 'Chuyên gia Content Marketing',
    description: 'Tạo kịch bản TikTok & Bài viết SEO chuẩn phong cách viral.',
    iconType: 'campaign',
    isActive: true,
    prompt: 'Tôi là Chuyên gia Content Marketing. Bạn muốn lên ý tưởng cho chiến dịch nào?',
  },
]

const SYSTEM_PRESETS = [
  { id: 'p-1', name: 'Tóm tắt Tài liệu PDF', desc: 'Phân tích nhanh file PDF dài thành ý chính.', prompt: 'Tôi là trợ lý Tóm tắt Tài liệu PDF. Hãy tải lên tài liệu để tôi phân tích ý chính.', icon: DescriptionOutlined },
  { id: 'p-2', name: 'Dịch thuật Đa ngôn ngữ', desc: 'Dịch văn bản chuyên ngành chính xác cao.', prompt: 'Tôi là chuyên gia Dịch thuật Đa ngôn ngữ. Bạn cần dịch văn bản sang ngôn ngữ nào?', icon: TranslateOutlined },
  { id: 'p-3', name: 'Phân tích Tài chính', desc: 'Đọc báo cáo tài chính và dự báo xu hướng.', prompt: 'Tôi là chuyên gia Phân tích Tài chính. Hãy cung cấp dữ liệu số liệu để tôi đánh giá.', icon: ShowChartOutlined },
  { id: 'p-4', name: 'Tư vấn Pháp lý', desc: 'Hỗ trợ tra cứu luật và soạn thảo hợp đồng.', prompt: 'Tôi là trợ lý Tư vấn Pháp lý. Bạn cần tra cứu điều khoản hoặc soạn thảo văn bản nào?', icon: GavelOutlined },
]

export default function AIPersonaPage() {
  const navigate = useNavigate()

  // viewMode: 'list' (Trang 1: Tổng quan) | 'create' (Trang 2: Tạo Agent mới)
  const [viewMode, setViewMode] = useState('list')

  // Form States
  const [myGems, setMyGems] = useState(INITIAL_MY_GEMS)
  const [agentName, setAgentName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('sparkle')
  const [selectedGoal, setSelectedGoal] = useState('content')
  const [customGoalText, setCustomGoalText] = useState('')
  const [personalityStyle, setPersonalityStyle] = useState('default')
  const [customPrompt, setCustomPrompt] = useState('')
  const [attachedFiles, setAttachedFiles] = useState([
    { id: 'f1', name: 'Tai_lieu_du_an.pdf', size: '1.2 MB' },
  ])

  const [isOptimizing, setIsOptimizing] = useState(false)
  const fileInputRef = useRef(null)

  // Bắt đầu chat với Agent
  const handleStartChatWithAgent = (gem) => {
    navigate('/', { state: { customAgent: gem } })
  }

  // Bấm "Lấy mẫu này" ở Preset -> Chuyển sang Trang Tạo Gem và Fill sẵn dữ liệu
  const handleTakePreset = (preset) => {
    setAgentName(preset.name)
    setCustomPrompt(preset.prompt)
    setSelectedGoal('content')
    setPersonalityStyle('default')
    setViewMode('create')
  }

  const handleOptimizePrompt = () => {
    if (!customPrompt.trim()) return
    setIsOptimizing(true)
    setTimeout(() => {
      setCustomPrompt((prev) => `[CHUYÊN GIA TỐI ƯU]: ${prev.trim()}\n\nQuy chuẩn trả lời: Cấu trúc rõ ràng, dùng bullet points ngắn gọn, đảm bảo chính xác.`)
      setIsOptimizing(false)
    }, 800)
  }

  const handleCreateAgentSubmit = () => {
    if (!agentName.trim()) {
      alert('Vui lòng nhập Tên Trợ lý AI của bạn!')
      return
    }

    const newGem = {
      id: `gem-${Date.now()}`,
      name: agentName,
      description: customPrompt.slice(0, 60) || 'Trợ lý AI cá nhân hóa riêng.',
      iconType: selectedIcon,
      isActive: true,
      prompt: customPrompt,
      goal: selectedGoal === 'custom' ? customGoalText : selectedGoal,
      personality: personalityStyle,
    }

    setMyGems((prev) => [newGem, ...prev])
    setViewMode('list')
    setAgentName('')
    setCustomPrompt('')
    alert('🎉 Đã khởi chạy Trợ lý AI mới thành công!')
  }

  return (
    <div className="persona-page-container">
      {/* File input ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setAttachedFiles((prev) => [
              ...prev,
              { id: `f-${Date.now()}`, name: e.target.files[0].name, size: '2.4 MB' },
            ])
          }
        }}
        style={{ display: 'none' }}
      />

      {/* Watermark Logo Background */}
      <img src={logoImg} alt="Brand Watermark Logo" className="persona-watermark-bg" />

      <div className="persona-content-wrapper">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            /* ========================================================================= */
            /* TRANG 1: TỔNG QUAN TRỢ LÝ AI (FIGMA ẢNH 8131D7.JPG)                         */
            /* ========================================================================= */
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="persona-header-row" style={{ marginBottom: 32 }}>
                <div>
                  <h1 className="persona-header-title">
                    Trợ lý AI Cá nhân <span className="brand-gradient-text">(Custom Agents)</span>
                  </h1>
                  <p className="persona-header-subtitle">
                    Tự tạo và tùy biến các con Bot chuyên biệt cho từng công việc của bạn.
                  </p>
                </div>

                <Button
                  className="btn-create-agent-orange"
                  startIcon={<AddOutlined />}
                  onClick={() => {
                    setAgentName('')
                    setCustomPrompt('')
                    setViewMode('create')
                  }}
                >
                  + Tạo Agent mới
                </Button>
              </div>

              {/* Khối Agent Của Tôi (My Gems) */}
              <div style={{ marginBottom: 40 }}>
                <div className="section-block-title">
                  <AutoAwesome style={{ color: '#06A8D9' }} />
                  <span>Agent của tôi (My Gems)</span>
                </div>

                <div className="gems-grid">
                  {myGems.map((gem) => (
                    <div key={gem.id} className="gem-card">
                      {gem.isActive && <span className="gem-badge-active">ACTIVE</span>}

                      <div>
                        <div className="gem-icon-circle">
                          {gem.iconType === 'campaign' ? <CampaignOutlined /> : <CodeOutlined />}
                        </div>
                        <h3 className="gem-title">{gem.name}</h3>
                        <p className="gem-desc">{gem.description}</p>
                      </div>

                      <div className="gem-actions-row">
                        <Button
                          className={gem.iconType === 'campaign' ? 'btn-chat-now-orange' : 'btn-chat-now-cyan'}
                          onClick={() => handleStartChatWithAgent(gem)}
                        >
                          Trò chuyện ngay
                        </Button>
                        <IconButton size="small" sx={{ color: '#64748B', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <SettingsOutlined fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  ))}

                  <div className="gem-card-create" onClick={() => { setAgentName(''); setCustomPrompt(''); setViewMode('create'); }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                      <AddOutlined />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#8E9BAE' }}>Thêm Agent tùy chỉnh</span>
                  </div>
                </div>
              </div>

              {/* Khối Agent Mẫu Gợi Ý (System Presets) */}
              <div>
                <div className="section-block-title">
                  <AutoAwesome style={{ color: '#F57F1F' }} />
                  <span>Agent Mẫu gợi ý (System Presets)</span>
                </div>

                <div className="gems-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  {SYSTEM_PRESETS.map((preset) => {
                    const IconComp = preset.icon
                    return (
                      <div key={preset.id} className="gem-card" style={{ minHeight: 180, padding: 18 }}>
                        <div>
                          <div className="gem-icon-circle" style={{ width: 36, height: 36 }}>
                            <IconComp fontSize="small" />
                          </div>
                          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFF', margin: '0 0 6px 0' }}>{preset.name}</h4>
                          <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>{preset.desc}</p>
                        </div>

                        <Button
                          sx={{ marginTop: 2, background: 'rgba(255,255,255,0.04)', color: '#8E9BAE', fontSize: '11px', textTransform: 'none', '&:hover': { color: '#FFF' } }}
                          onClick={() => handleTakePreset(preset)}
                        >
                          Lấy mẫu này
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* TRANG 2: TẠO AGENT TÙY CHỈNH (FIGMA ẢNH 8131C0.JPG - ĐÃ TỐI ƯU DỄ HIỂU)   */
            /* ========================================================================= */
            <motion.div
              key="create-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <IconButton onClick={() => setViewMode('list')} sx={{ color: '#FFF' }}>
                  <ArrowBackOutlined />
                </IconButton>
                <div>
                  <h1 className="persona-header-title">Tạo Trợ lý AI của riêng bạn</h1>
                  <p className="persona-header-subtitle">
                    Chỉ cần trả lời vài câu hỏi đơn giản, AI sẽ tự động hoàn thiện Trợ lý cho bạn.
                  </p>
                </div>
              </div>

              <div className="form-step-card">
                {/* 1. Đặt tên cho Trợ lý của bạn */}
                <div>
                  <div className="step-header-flex">
                    <span className="step-num-badge">1</span>
                    <span className="step-title">Đặt tên cho Trợ lý của bạn</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input
                      type="text"
                      className="field-input-box"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="Ví dụ: Chuyên gia Content TikTok, Trợ lý Bán hàng, Gia sư Tiếng Anh..."
                    />

                    {/* Dải Icon Chọn & Tùy biến */}
                    <div className="icon-selector-wrapper">
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>CHỌN BIỂU TƯỢNG (AVATAR)</span>
                      <div className="icon-selector-row">
                        <button className={`icon-choice-btn ${selectedIcon === 'sparkle' ? 'active' : ''}`} onClick={() => setSelectedIcon('sparkle')} title="Sáng tạo">
                          <AutoAwesome fontSize="small" />
                        </button>
                        <button className={`icon-choice-btn ${selectedIcon === 'bulb' ? 'active' : ''}`} onClick={() => setSelectedIcon('bulb')} title="Ý tưởng">
                          <LightbulbOutlined fontSize="small" />
                        </button>
                        <button className={`icon-choice-btn ${selectedIcon === 'brain' ? 'active' : ''}`} onClick={() => setSelectedIcon('brain')} title="Trí tuệ">
                          <PsychologyOutlined fontSize="small" />
                        </button>
                        <button className={`icon-choice-btn ${selectedIcon === 'leaf' ? 'active' : ''}`} onClick={() => setSelectedIcon('leaf')} title="Tự nhiên">
                          <ForestOutlined fontSize="small" />
                        </button>
                        <button className={`icon-choice-btn ${selectedIcon === 'support' ? 'active' : ''}`} onClick={() => setSelectedIcon('support')} title="Bán hàng">
                          <SupportAgentOutlined fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Bạn muốn Trợ lý này giúp gì nhất? */}
                <div>
                  <div className="step-header-flex">
                    <span className="step-num-badge">2</span>
                    <span className="step-title">Bạn muốn Trợ lý này giúp gì nhất?</span>
                  </div>

                  <div className="goal-grid">
                    <div className={`goal-choice-card ${selectedGoal === 'content' ? 'active' : ''}`} onClick={() => setSelectedGoal('content')}>
                      <div className="goal-icon-box"><DescriptionOutlined fontSize="small" /></div>
                      <div>
                        <div className="goal-title-text">Sáng tạo & Viết lách</div>
                        <div className="goal-desc-text">Viết bài Social, kịch bản, ý tưởng bán hàng.</div>
                      </div>
                    </div>

                    <div className={`goal-choice-card ${selectedGoal === 'consult' ? 'active' : ''}`} onClick={() => setSelectedGoal('consult')}>
                      <div className="goal-icon-box" style={{ color: '#F57F1F', background: 'rgba(245,127,31,0.1)' }}><WorkOutlineOutlined fontSize="small" /></div>
                      <div>
                        <div className="goal-title-text">Hỗ trợ Công việc</div>
                        <div className="goal-desc-text">Soạn Email, lập báo cáo, lên kế hoạch.</div>
                      </div>
                    </div>

                    <div className={`goal-choice-card ${selectedGoal === 'code' ? 'active' : ''}`} onClick={() => setSelectedGoal('code')}>
                      <div className="goal-icon-box"><CodeOutlined fontSize="small" /></div>
                      <div>
                        <div className="goal-title-text">Lập trình & Kỹ thuật</div>
                        <div className="goal-desc-text">Sửa lỗi code, tối ưu phần mềm, viết logic.</div>
                      </div>
                    </div>

                    <div className={`goal-choice-card ${selectedGoal === 'learn' ? 'active' : ''}`} onClick={() => setSelectedGoal('learn')}>
                      <div className="goal-icon-box" style={{ color: '#F57F1F', background: 'rgba(245,127,31,0.1)' }}><SchoolOutlined fontSize="small" /></div>
                      <div>
                        <div className="goal-title-text">Học tập & Ngôn ngữ</div>
                        <div className="goal-desc-text">Dịch thuật, giải bài tập, tóm tắt tài liệu.</div>
                      </div>
                    </div>

                    <div className={`goal-choice-card ${selectedGoal === 'sales' ? 'active' : ''}`} onClick={() => setSelectedGoal('sales')}>
                      <div className="goal-icon-box"><SupportAgentOutlined fontSize="small" /></div>
                      <div>
                        <div className="goal-title-text">CSKH & Bán hàng</div>
                        <div className="goal-desc-text">Trả lời inbox, tư vấn sản phẩm, chốt đơn.</div>
                      </div>
                    </div>

                    <div className={`goal-choice-card ${selectedGoal === 'custom' ? 'active' : ''}`} onClick={() => setSelectedGoal('custom')}>
                      <div className="goal-icon-box" style={{ color: '#F57F1F', background: 'rgba(245,127,31,0.1)' }}><MoreHorizOutlined fontSize="small" /></div>
                      <div>
                        <div className="goal-title-text">Lĩnh vực Khác...</div>
                        <div className="goal-desc-text">Tự nhập công việc theo nhu cầu riêng.</div>
                      </div>
                    </div>
                  </div>

                  {selectedGoal === 'custom' && (
                    <input
                      type="text"
                      className="field-input-box"
                      style={{ marginTop: 12 }}
                      value={customGoalText}
                      onChange={(e) => setCustomGoalText(e.target.value)}
                      placeholder="Mô tả ngắn lĩnh vực chuyên môn bạn mong muốn..."
                    />
                  )}
                </div>

                {/* 3. Phong cách & Yêu cầu riêng */}
                <div>
                  <div className="step-header-flex">
                    <span className="step-num-badge">3</span>
                    <span className="step-title">Phong cách & Yêu cầu riêng</span>
                  </div>

                  <div className="personality-pills">
                    <button className={`personality-pill-btn ${personalityStyle === 'default' ? 'active' : ''}`} onClick={() => setPersonalityStyle('default')}>
                      ⚙️ Mặc định (Tự động tối ưu)
                    </button>
                    <button className={`personality-pill-btn ${personalityStyle === 'concise' ? 'active' : ''}`} onClick={() => setPersonalityStyle('concise')}>
                      🎯 Ngắn gọn & Đúng trọng tâm
                    </button>
                    <button className={`personality-pill-btn ${personalityStyle === 'friendly' ? 'active' : ''}`} onClick={() => setPersonalityStyle('friendly')}>
                      🤝 Thân thiện & Chi tiết
                    </button>
                    <button className={`personality-pill-btn ${personalityStyle === 'professional' ? 'active' : ''}`} onClick={() => setPersonalityStyle('professional')}>
                      💼 Chuyên nghiệp & Chuẩn mực
                    </button>
                  </div>

                  <div className="textarea-wrapper">
                    <textarea
                      className="field-textarea-box"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Mô tả thêm mong muốn của bạn... (Ví dụ: 'Hãy viết giọng văn vui tươi, phù hợp với giới trẻ' hoặc 'Chỉ trả lời bằng Tiếng Việt')"
                    />
                    
                    {/* Nút tối ưu prompt nằm riêng bên dưới, không bị đè lên chữ */}
                    <div className="textarea-action-row">
                      <button className="btn-magic-optimize" onClick={handleOptimizePrompt} disabled={isOptimizing}>
                        {isOptimizing ? <CircularProgress size={14} sx={{ color: '#F57F1F' }} /> : <AutoFixHighOutlined fontSize="small" />}
                        <span>✨ Tối ưu câu trả lời</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Tải lên tài liệu tham khảo (Không bắt buộc) */}
                <div>
                  <div className="step-header-flex">
                    <span className="step-num-badge">4</span>
                    <span className="step-title">Tải lên tài liệu tham khảo (Không bắt buộc)</span>
                  </div>

                  <div className="dropzone-container" onClick={() => fileInputRef.current?.click()}>
                    <CloudUploadOutlined sx={{ fontSize: 32, color: '#06A8D9' }} />
                    <div className="dropzone-text-main">
                      Kéo thả file PDF, Word, Excel vào đây để AI hiểu rõ công việc của bạn hơn
                    </div>
                    <div className="dropzone-text-sub">Hỗ trợ file PDF, DOCX, XLSX (Tối đa 50MB/file)</div>
                  </div>

                  <div className="attached-files-row" style={{ marginTop: 12 }}>
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="file-tag-badge">
                        <DescriptionOutlined className="file-tag-icon" />
                        <span>{file.name} ({file.size})</span>
                        <button className="btn-remove-file" onClick={() => setAttachedFiles(prev => prev.filter(f => f.id !== file.id))}>
                          <CloseOutlined style={{ fontSize: 12 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <Button sx={{ color: '#8E9BAE', textTransform: 'none' }} onClick={() => setViewMode('list')}>
                    Hủy
                  </Button>
                  <Button className="btn-create-agent-orange" onClick={handleCreateAgentSubmit}>
                    ✨ Tạo Trợ Lý Ngay
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}