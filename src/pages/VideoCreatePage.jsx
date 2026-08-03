import React, { useState, useRef, useEffect } from 'react'
import {
  IconButton,
  InputBase,
  Tooltip,
  Button,
  CircularProgress,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  AutoAwesome,
  PlayArrowRounded,
  CloseOutlined,
  AddPhotoAlternateOutlined,
  MoreVertOutlined,
  AutoFixHighOutlined,
  TuneOutlined,
  ColorLensOutlined,
  NightlightOutlined,
  DeleteOutlined,
  NotInterestedOutlined,
  DiamondOutlined,
  DownloadOutlined,
  ContentCopyOutlined,
  FullscreenOutlined,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

import '../css/VideoCreatePage.css'
import '../css/CommunityPage.css'

const AI_MODELS = [
  {
    id: 'm1',
    name: 'Gemini Omni Flash',
    version: 'Cinematic phiên bản 2.3',
    description: 'Các cảnh quay mạch lạc, vật lý thực tế và chuyển động tự nhiên. Dựa trên lời nhắc hoặc hình ảnh tham khảo.',
    tags: ['Tham chiếu hình ảnh', 'Video tham khảo'],
    isNew: true,
  },
  {
    id: 'm2',
    name: 'Seedance 2.0 Mini',
    version: 'Sora Core 1.5',
    description: 'Video tiết kiệm chi phí được tạo từ ảnh tĩnh với độ mượt mà của chuyển động được cải thiện.',
    tags: ['Khung hình đầu tiên', 'Khung cuối'],
    isNew: true,
  },
  {
    id: 'm3',
    name: 'Wan 2.7 Ultra',
    version: 'WanX Pro 2026',
    description: 'Mô hình video AI thế hệ mới nhất, mang lại chuyển động mượt mà hơn và tính nhất quán hình ảnh cao.',
    tags: ['Gợi ý', '4K Native'],
    isNew: true,
  },
]

const STYLE_PRESETS = {
  atmosphere: [
    { id: 'a0', label: 'Không có', isNone: true },
    { id: 'a1', label: 'Đất sét', img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300' },
    { id: 'a2', label: 'Mùa thu', img: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=300' },
    { id: 'a3', label: 'Điện ảnh Cyber', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300' },
    { id: 'a4', label: 'Phim 35mm', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300' },
    { id: 'a5', label: 'Anime Nhật', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300' },
  ],
  lighting: [
    { id: 'l0', label: 'Không có', isNone: true },
    { id: 'l1', label: 'Đèn nền', img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300' },
    { id: 'l2', label: 'Ánh sáng Neon', img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300' },
    { id: 'l3', label: 'Kịch tính', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300' },
    { id: 'l4', label: 'Hoàng hôn', img: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=300' },
    { id: 'l5', label: 'Studio Mềm', img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300' },
  ],
  color: [
    { id: 'c0', label: 'Không có', isNone: true },
    { id: 'c1', label: 'Miễn phí', img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300' },
    { id: 'c2', label: 'Tia cực tím', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300' },
    { id: 'c3', label: 'Mộc mạc', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300' },
    { id: 'c4', label: 'Trắng đen', img: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300' },
    { id: 'c5', label: 'Vintage Ấm', img: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=300' },
  ]
}

const INITIAL_VIDEOS = [
  {
    id: 'v1',
    title: 'Tốc độ Desert Horizon',
    status: 'generating',
    progress: 64,
    timeRemaining: 'Còn khoảng 2 phút',
    model: 'Cinematix phiên bản 2.3',
  },
  {
    id: 'v2',
    title: 'Quận Mưa Neon',
    status: 'completed',
    quality: '1080P 60fps',
    duration: '00:15s',
    date: '24 Th10, 2026',
    model: 'Cinematix phiên bản 2.3',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    prompt: 'Cảnh quay quận phố neon mưa rơi ban đêm, góc máy quay quét mượt mà phong cách điện ảnh 60fps.',
    refFileName: 'cyber_map_ref.json',
    refSize: '1.1 MB • Config Data',
    refUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300',
    seed: '88294105',
    aspectRatio: '16:9',
  },
  {
    id: 'v3',
    title: 'Giai Điệu Điện Tử',
    status: 'completed',
    quality: '1080P HD',
    duration: '00:08s',
    date: '23 Th10, 2026',
    model: 'Seedance 2.0 Mini',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    prompt: 'Nghệ sĩ nhạc điện tử trình diễn nhạc cụ dân tộc phát sáng trong không gian Cyberpunk.',
    refFileName: 'audio_wave.wav',
    refSize: '2.5 MB • Audio Ref',
    refUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300',
    seed: '94201823',
    aspectRatio: '16:9',
  },
]

export default function VideoCreatePage() {
  const theme = useTheme()
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [userBalance, setUserBalance] = useState(1250)
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0])
  
  const [atmosphere, setAtmosphere] = useState({ label: 'Mặc định', img: '' })
  const [lighting, setLighting] = useState({ label: 'Mặc định', img: '' })
  const [colorStyle, setColorStyle] = useState({ label: 'Mặc định', img: '' })

  const [duration, setDuration] = useState(6)
  const [quality, setQuality] = useState('1080p')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  
  const [startKeyframe, setStartKeyframe] = useState(null)
  const [endKeyframe, setEndKeyframe] = useState(null)

  const [promptDraft, setPromptDraft] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [generatedVideos, setGeneratedVideos] = useState(INITIAL_VIDEOS)

  const [isModelModalOpen, setIsModelModalOpen] = useState(false)
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false)
  const [styleActiveTab, setStyleActiveTab] = useState('color')
  
  // Modals & Lightbox States
  const [activeVideoDetail, setActiveVideoDetail] = useState(null)
  const [previewRefImage, setPreviewRefImage] = useState(null)
  const [isFullViewMedia, setIsFullViewMedia] = useState(false)
  const [copied, setCopied] = useState(false)

  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false)

  const startFileRef = useRef(null)
  const endFileRef = useRef(null)
  const currentCost = quality === '1080p' ? 5 : 3

  useEffect(() => {
    const handleToggleTools = () => {
      setIsMobileToolsOpen((prev) => !prev)
    }

    window.addEventListener('app-trigger-toggle-tools', handleToggleTools)
    return () => window.removeEventListener('app-trigger-toggle-tools', handleToggleTools)
  }, [])

  const handleOptimizePrompt = () => {
    if (!promptDraft.trim()) return
    setIsOptimizing(true)

    setTimeout(() => {
      const enhanced = `[VIDEO AI PROMPT]: Cảnh quay chuyển động mượt mà 60fps, ${promptDraft.trim()}, góc máy Cinematic Pan, hiệu ứng ánh sáng ${lighting.label}, phong cách ${atmosphere.label}, màu sắc ${colorStyle.label}, độ phân giải ${quality.toUpperCase()}.`
      setPromptDraft(enhanced)
      setIsOptimizing(false)
    }, 800)
  }

  const handleGenerateVideo = () => {
    if (!promptDraft.trim() || userBalance < currentCost) return

    setUserBalance((prev) => prev - currentCost)

    const newVideo = {
      id: `v-${Date.now()}`,
      title: promptDraft.slice(0, 24) + '...',
      status: 'generating',
      progress: 10,
      timeRemaining: 'Còn khoảng 3 phút',
      model: selectedModel.name,
    }

    setGeneratedVideos((prev) => [newVideo, ...prev])
    setPromptDraft('')
  }

  const handleClearAllStyles = () => {
    setAtmosphere({ label: 'Mặc định', img: '' })
    setLighting({ label: 'Mặc định', img: '' })
    setColorStyle({ label: 'Mặc định', img: '' })
  }

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderControlSidebarContent = () => (
    <aside className="video-controls-sidebar">
      <div className="credit-balance-card">
        <div className="credit-balance-header">
          <span>Số dư khả dụng</span>
          <span className="credit-value-badge">
            <DiamondOutlined style={{ fontSize: 13 }} />
            {userBalance}
          </span>
        </div>
        <LinearProgress
          variant="determinate"
          value={Math.min(100, (userBalance / 1500) * 100)}
          sx={{
            height: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.08)',
            '& .MuiLinearProgress-bar': { background: '#00F2FF' }
          }}
        />
      </div>

      <div>
        <div className="control-group-title">MẪU</div>
        <div className="model-select-card" onClick={() => setIsModelModalOpen(true)}>
          <div className="model-icon-box">
            <AutoAwesome fontSize="small" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>{selectedModel.name}</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>{selectedModel.version}</div>
          </div>
          <TuneOutlined style={{ color: '#8E9BAE', fontSize: 18 }} />
        </div>
      </div>

      <div>
        <div className="control-group-title">
          <span>PHONG CÁCH</span>
          <span className="clear-link" onClick={handleClearAllStyles}>Xóa tất cả</span>
        </div>

        <div className="style-select-stack">
          <div className="style-select-item" onClick={() => { setStyleActiveTab('atmosphere'); setIsStyleModalOpen(true); }}>
            <div className="style-thumb-box">
              {atmosphere.img ? (
                <img src={atmosphere.img} alt={atmosphere.label} className="style-thumb-img" />
              ) : (
                <TuneOutlined style={{ color: '#00F2FF', fontSize: 18 }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Phong cách</div>
              <div style={{ fontSize: '12px', color: '#FFF', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {atmosphere.label}
              </div>
            </div>
          </div>

          <div className="style-select-item" onClick={() => { setStyleActiveTab('lighting'); setIsStyleModalOpen(true); }}>
            <div className="style-thumb-box">
              {lighting.img ? (
                <img src={lighting.img} alt={lighting.label} className="style-thumb-img" />
              ) : (
                <NightlightOutlined style={{ color: '#8E9BAE', fontSize: 18 }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Ánh sáng</div>
              <div style={{ fontSize: '12px', color: '#FFF', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {lighting.label}
              </div>
            </div>
          </div>

          <div className="style-select-item" onClick={() => { setStyleActiveTab('color'); setIsStyleModalOpen(true); }}>
            <div className="style-thumb-box">
              {colorStyle.img ? (
                <img src={colorStyle.img} alt={colorStyle.label} className="style-thumb-img" />
              ) : (
                <ColorLensOutlined style={{ color: '#8E9BAE', fontSize: 18 }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Màu sắc</div>
              <div style={{ fontSize: '12px', color: '#FFF', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {colorStyle.label}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="control-group-title">CHẤT LƯỢNG (KIM CƯƠNG)</div>
        <div className="duration-toggle-box">
          <button
            className={`duration-btn ${quality === '1080p' ? 'active' : ''}`}
            onClick={() => setQuality('1080p')}
          >
            <span>1080p</span>
            <span className="badge-credit">(5<DiamondOutlined className="gem-icon" />)</span>
          </button>
          <button
            className={`duration-btn ${quality === '720p' ? 'active' : ''}`}
            onClick={() => setQuality('720p')}
          >
            <span>720p</span>
            <span className="badge-credit">(3<DiamondOutlined className="gem-icon" />)</span>
          </button>
        </div>
      </div>

      <div>
        <div className="control-group-title">THỜI LƯỢNG</div>
        <div className="duration-toggle-box">
          <button
            className={`duration-btn ${duration === 6 ? 'active' : ''}`}
            onClick={() => setDuration(6)}
          >
            6 giây
          </button>
          <button
            className={`duration-btn ${duration === 8 ? 'active' : ''}`}
            onClick={() => setDuration(8)}
          >
            8 giây
          </button>
        </div>
      </div>

      <div>
        <div className="control-group-title">KÍCH THƯỚC</div>
        <div className="aspect-ratio-grid">
          <Tooltip title="Phù hợp Video ngắn Feed." arrow placement="top">
            <div className={`aspect-btn ${aspectRatio === '1:1' ? 'active' : ''}`} onClick={() => setAspectRatio('1:1')}>
              <div className="aspect-box-icon" style={{ width: 16, height: 16 }}></div>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>1:1</span>
            </div>
          </Tooltip>

          <Tooltip title="Phù hợp đăng YouTube chuẩn, TV." arrow placement="top">
            <div className={`aspect-btn ${aspectRatio === '16:9' ? 'active' : ''}`} onClick={() => setAspectRatio('16:9')}>
              <div className="aspect-box-icon" style={{ width: 22, height: 14 }}></div>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>16:9</span>
            </div>
          </Tooltip>

          <Tooltip title="Phù hợp TikTok, Story." arrow placement="top">
            <div className={`aspect-btn ${aspectRatio === '9:16' ? 'active' : ''}`} onClick={() => setAspectRatio('9:16')}>
              <div className="aspect-box-icon" style={{ width: 14, height: 22 }}></div>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>9:16</span>
            </div>
          </Tooltip>
        </div>
      </div>

      <div>
        <div className="control-group-title">ĐIỂM MỐC KHUNG HÌNH CHÍNH</div>
        <div className="keyframe-grid">
          <div className="keyframe-box" onClick={() => !startKeyframe && startFileRef.current?.click()}>
            {startKeyframe ? (
              <>
                <img src={startKeyframe} alt="Start" className="keyframe-preview-img" />
                <div className="keyframe-delete-overlay">
                  <button
                    className="btn-delete-keyframe"
                    onClick={(e) => {
                      e.stopPropagation()
                      setStartKeyframe(null)
                    }}
                  >
                    <DeleteOutlined fontSize="small" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <AddPhotoAlternateOutlined style={{ color: '#00F2FF', fontSize: 20 }} />
                <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 600 }}>KHUNG BẮT ĐẦU</span>
              </>
            )}
          </div>

          <div className="keyframe-box" onClick={() => !endKeyframe && endFileRef.current?.click()}>
            {endKeyframe ? (
              <>
                <img src={endKeyframe} alt="End" className="keyframe-preview-img" />
                <div className="keyframe-delete-overlay">
                  <button
                    className="btn-delete-keyframe"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEndKeyframe(null)
                    }}
                  >
                    <DeleteOutlined fontSize="small" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <AddPhotoAlternateOutlined style={{ color: '#8E9BAE', fontSize: 20 }} />
                <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 600 }}>KẾT THÚC KHUNG HÌNH</span>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="video-page-container">
      <input
        type="file"
        ref={startFileRef}
        onChange={(e) => e.target.files[0] && setStartKeyframe(URL.createObjectURL(e.target.files[0]))}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={endFileRef}
        onChange={(e) => e.target.files[0] && setEndKeyframe(URL.createObjectURL(e.target.files[0]))}
        style={{ display: 'none' }}
      />

      {!isTabletOrMobile ? (
        renderControlSidebarContent()
      ) : (
        <AnimatePresence>
          {isMobileToolsOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mobile-drawer-backdrop"
                onClick={() => setIsMobileToolsOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="mobile-tools-drawer"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFF' }}>Công cụ tạo video AI</span>
                  <IconButton onClick={() => setIsMobileToolsOpen(false)} sx={{ color: '#FFF' }}>
                    <CloseOutlined fontSize="small" />
                  </IconButton>
                </div>
                {renderControlSidebarContent()}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* CỘT PHẢI - WORKSPACE CANVAS */}
      <main className="video-main-workspace">
        <div className="workspace-header">
          <div>
            <h1 className="workspace-title">Thư viện Video</h1>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
              Xem lại và quản lý các tài nguyên hiệu ứng điện ảnh đã tạo
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="video-gallery-grid">
          {generatedVideos.map((video) => (
            <React.Fragment key={video.id}>
              {video.status === 'generating' ? (
                <div className="video-card-generating">
                  <CircularProgress size={40} sx={{ color: '#00F2FF', mb: 2 }} />
                  <div style={{ fontSize: '13px', color: '#00F2FF', fontWeight: 700 }}>
                    SẢN XUẤT {video.progress}%
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF', marginTop: 8 }}>
                    {video.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: 4 }}>
                    {video.timeRemaining}
                  </div>
                </div>
              ) : (
                <div className="video-card-item" onClick={() => setActiveVideoDetail(video)}>
                  <div className="video-thumbnail-wrapper">
                    <img src={video.imageUrl} alt={video.title} className="video-thumb-img" />
                    <div className="play-overlay-btn">
                      <div className="play-icon-circle">
                        <PlayArrowRounded fontSize="medium" />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>{video.title}</div>
                      <MoreVertOutlined style={{ color: '#64748B', fontSize: 18 }} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>
                      {video.model} • {video.date}
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </main>

      {/* BOTTOM FLOATING PROMPT BAR */}
      <div className="bottom-prompt-container">
        <div className="prompt-glass-box">
          <button
            className="btn-magic-cyan"
            onClick={handleOptimizePrompt}
            disabled={isOptimizing}
          >
            {isOptimizing ? <CircularProgress size={18} sx={{ color: '#000' }} /> : <AutoFixHighOutlined fontSize="small" />}
          </button>

          <InputBase
            sx={{ flex: 1, color: '#FFF', fontSize: '14px' }}
            multiline
            maxRows={2}
            value={promptDraft}
            onChange={(e) => setPromptDraft(e.target.value)}
            placeholder="Hãy mô tả kiệt tác điện ảnh mà bạn muốn tạo ra..."
          />

          <Button
            className="btn-generate-orange"
            onClick={handleGenerateVideo}
            disabled={!promptDraft.trim() || userBalance < currentCost}
          >
            Tạo ⚡ ({currentCost} <DiamondOutlined style={{ fontSize: 14, marginLeft: 2 }} />)
          </Button>
        </div>
      </div>

      {/* MODAL 1: MODEL SELECTOR */}
      <AnimatePresence>
        {isModelModalOpen && (
          <div className="modal-overlay-backdrop" onClick={() => setIsModelModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-dialog-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', margin: 0 }}>Các mẫu</h3>
                <IconButton onClick={() => setIsModelModalOpen(false)} sx={{ color: '#FFF' }}>
                  <CloseOutlined fontSize="small" />
                </IconButton>
              </div>

              <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 8, marginBottom: 20 }}>
                <button style={{ background: '#00F2FF', color: '#000', fontWeight: 700, padding: '6px 20px', borderRadius: 6, border: 'none', fontSize: '12px' }}>
                  Video
                </button>
              </div>

              <div>
                {AI_MODELS.map((m) => (
                  <div
                    key={m.id}
                    className={`model-option-item ${selectedModel.id === m.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedModel(m)
                      setIsModelModalOpen(false)
                    }}
                  >
                    <div className="model-icon-box">
                      <AutoAwesome />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {m.name}
                        <span style={{ fontSize: '10px', background: '#F47D20', color: '#FFF', padding: '2px 6px', borderRadius: 4 }}>MỚI</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#8E9BAE', marginTop: 4 }}>{m.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: STYLES PALETTE SELECTOR */}
      <AnimatePresence>
        {isStyleModalOpen && (
          <div className="modal-overlay-backdrop" onClick={() => setIsStyleModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-dialog-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', margin: 0 }}>Bảng màu phong cách</h3>
                <IconButton onClick={() => setIsStyleModalOpen(false)} sx={{ color: '#FFF' }}>
                  <CloseOutlined fontSize="small" />
                </IconButton>
              </div>

              <div className="duration-toggle-box" style={{ marginBottom: 16 }}>
                <button
                  className={`duration-btn ${styleActiveTab === 'atmosphere' ? 'active' : ''}`}
                  onClick={() => setStyleActiveTab('atmosphere')}
                >
                  Phong cách
                </button>
                <button
                  className={`duration-btn ${styleActiveTab === 'lighting' ? 'active' : ''}`}
                  onClick={() => setStyleActiveTab('lighting')}
                >
                  Ánh sáng
                </button>
                <button
                  className={`duration-btn ${styleActiveTab === 'color' ? 'active' : ''}`}
                  onClick={() => setStyleActiveTab('color')}
                >
                  Màu sắc
                </button>
              </div>

              <div className="style-preset-grid">
                {STYLE_PRESETS[styleActiveTab]?.map((p) => {
                  const isSelected =
                    (styleActiveTab === 'atmosphere' && (p.isNone ? atmosphere.label === 'Mặc định' : atmosphere.label === p.label)) ||
                    (styleActiveTab === 'lighting' && (p.isNone ? lighting.label === 'Mặc định' : lighting.label === p.label)) ||
                    (styleActiveTab === 'color' && (p.isNone ? colorStyle.label === 'Mặc định' : colorStyle.label === p.label))

                  return (
                    <div
                      key={p.id}
                      className={`style-preset-card ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        if (p.isNone) {
                          if (styleActiveTab === 'atmosphere') setAtmosphere({ label: 'Mặc định', img: '' })
                          if (styleActiveTab === 'lighting') setLighting({ label: 'Mặc định', img: '' })
                          if (styleActiveTab === 'color') setColorStyle({ label: 'Mặc định', img: '' })
                        } else {
                          if (styleActiveTab === 'atmosphere') setAtmosphere({ label: p.label, img: p.img })
                          if (styleActiveTab === 'lighting') setLighting({ label: p.label, img: p.img })
                          if (styleActiveTab === 'color') setColorStyle({ label: p.label, img: p.img })
                        }
                      }}
                    >
                      {p.isNone ? (
                        <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#64748B' }}>
                          <NotInterestedOutlined fontSize="small" />
                          <span style={{ fontSize: '11px' }}>Không có</span>
                        </div>
                      ) : (
                        <>
                          <img src={p.img} alt={p.label} className="style-preset-img" />
                          <div className="style-preset-label">{p.label}</div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <Button sx={{ color: '#8E9BAE' }} onClick={() => setIsStyleModalOpen(false)}>
                  Hủy
                </Button>
                <Button className="btn-generate-orange" onClick={() => setIsStyleModalOpen(false)}>
                  Áp dụng kiểu
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ✅ MODAL LIGHTBOX CẢI TIẾN DÙNG CHUNG THEO CHUẨN COMMUNITY DÀNH CHO VIDEO */}
      <AnimatePresence>
        {activeVideoDetail && (
          <div
            className="community-modal-backdrop"
            onClick={() => setActiveVideoDetail(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              className="community-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Nút CLOSE 'X' Cố định */}
              <button
                className="modal-close-btn-fixed"
                onClick={() => setActiveVideoDetail(null)}
              >
                <CloseOutlined fontSize="small" />
              </button>

              {/* Cột Trái: Media chính */}
              <div className="modal-left-media-wrapper">
                <img
                  src={activeVideoDetail.imageUrl}
                  alt={activeVideoDetail.title}
                  className="modal-media-img"
                />
                <span className="modal-badge-4k">4K ULTRA HD</span>

                {/* Nút Xem Toàn Video/Ảnh */}
                <button
                  className="btn-full-view-media"
                  onClick={() => setIsFullViewMedia(true)}
                >
                  <FullscreenOutlined style={{ fontSize: 16 }} />
                  Xem toàn video
                </button>
              </div>

              {/* Cột Phải: Thông tin & Prompt */}
              <div className="modal-right-info-panel">
                <div>
                  <div className="modal-right-header" style={{ paddingRight: 36 }}>
                    <h2 className="modal-item-title">{activeVideoDetail.title}</h2>
                  </div>

                  {/* Khung Prompt */}
                  <div className="modal-prompt-box-container">
                    <div className="prompt-box-header">
                      <span>PROMPT</span>
                      <button
                        style={{ background: 'transparent', border: 'none', color: '#06A8D9', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        onClick={() => handleCopyPrompt(activeVideoDetail.prompt || '')}
                      >
                        <ContentCopyOutlined style={{ fontSize: 12 }} />
                        {copied ? 'Đã chép!' : 'Sao chép'}
                      </button>
                    </div>
                    <p className="prompt-text-content">"{activeVideoDetail.prompt || 'Mô tả chi tiết tác phẩm...'}"</p>
                  </div>

                  {/* Khung Tham Chiếu */}
                  {activeVideoDetail.refFileName && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                        TỆP THAM CHIẾU (MEDIA REF)
                      </div>
                      <div
                        className="image-ref-card-figma"
                        onClick={() => setPreviewRefImage(activeVideoDetail.refUrl || activeVideoDetail.imageUrl)}
                      >
                        <div className="ref-thumb-box">
                          <img src={activeVideoDetail.refUrl || activeVideoDetail.imageUrl} alt="Ref Thumb" className="ref-thumb-img" />
                        </div>
                        <div className="ref-info-text">
                          <div className="ref-filename-title">{activeVideoDetail.refFileName}</div>
                          <div className="ref-filesize-sub">{activeVideoDetail.refSize || '1.1 MB • Config Data'}</div>
                        </div>
                        <IconButton size="small" sx={{ color: '#06A8D9' }}>
                          <DownloadOutlined fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  )}

                  {/* 4 Thẻ Metadata dành riêng cho Video */}
                  <div className="modal-metadata-grid-2x2">
                    <div className="meta-info-card">
                      <div className="meta-info-label">MẪU</div>
                      <div className="meta-info-value">{activeVideoDetail.model}</div>
                    </div>
                    <div className="meta-info-card">
                      <div className="meta-info-label">TỶ LỆ</div>
                      <div className="meta-info-value">{activeVideoDetail.aspectRatio || '16:9'}</div>
                    </div>
                    <div className="meta-info-card">
                      <div className="meta-info-label">CHẤT LƯỢNG</div>
                      <div className="meta-info-value">{activeVideoDetail.quality || '1080P 60fps'}</div>
                    </div>
                    <div className="meta-info-card">
                      <div className="meta-info-label">THỜI LƯỢNG</div>
                      <div className="meta-info-value">{activeVideoDetail.duration || '00:15s'}</div>
                    </div>
                  </div>
                </div>

                {/* Stack Nút Thao Tác */}
                <div className="modal-actions-stack">
                  <button
                    className="btn-remix-orange"
                    onClick={() => {
                      setPromptDraft(activeVideoDetail.prompt || '')
                      setActiveVideoDetail(null)
                    }}
                  >
                    <AutoFixHighOutlined style={{ fontSize: 16 }} />
                    Dùng lại prompt & Ảnh gốc
                  </button>

                  <button
                    className="btn-download-cyan"
                    onClick={() => alert(`Đang tải video 4K: ${activeVideoDetail.title}`)}
                  >
                    <DownloadOutlined style={{ fontSize: 16 }} />
                    Tải về 4K
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL FULLSCREEN PREVIEW */}
      <AnimatePresence>
        {(isFullViewMedia || previewRefImage) && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.95)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => {
              setIsFullViewMedia(false)
              setPreviewRefImage(null)
            }}
          >
            <IconButton
              style={{ position: 'absolute', top: 20, right: 20, color: '#FFF', background: 'rgba(255,255,255,0.1)' }}
              onClick={() => {
                setIsFullViewMedia(false)
                setPreviewRefImage(null)
              }}
            >
              <CloseOutlined />
            </IconButton>
            <img
              src={previewRefImage || activeVideoDetail?.imageUrl}
              alt="Full Preview"
              style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain', borderRadius: '12px' }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}