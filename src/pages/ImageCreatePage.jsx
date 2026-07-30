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
  VisibilityOutlined,
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
  AddOutlined,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

import '../css/ImageCreatePage.css'

const IMAGE_MODELS = [
  {
    id: 'im-1',
    name: 'Banana Flux.1 Ultra',
    version: 'Flux Pro 2026',
    description: 'Khả năng tạo chi tiết da, ánh sáng chân thực và tuân thủ lời nhắc chi tiết xuất sắc nhất thế giới.',
    tags: ['HD Ultra', 'ControlNet'],
    isNew: true,
  },
  {
    id: 'im-2',
    name: 'Midjourney V6.1',
    version: 'Cinematic Render',
    description: 'Chuyên gia tạo ảnh mang phong cách điện ảnh, nghệ thuật số và màu sắc độ tương phản cao.',
    tags: ['Cinematic', 'Artistic'],
    isNew: true,
  },
  {
    id: 'im-3',
    name: 'DALL-E 3 HD',
    version: 'OpenAI Studio',
    description: 'Mô hình hiểu ngữ nghĩa Tiếng Việt cực tốt, thể hiện chính xác từng chi tiết câu chữ.',
    tags: ['Văn bản chính xác', 'Nhiều phong cách'],
    isNew: false,
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

const INITIAL_IMAGES = [
  {
    id: 'img-1',
    title: 'Tác phẩm đang tạo...',
    status: 'generating',
    progress: 42,
    timeRemaining: 'Còn khoảng 12 giây',
    model: 'Banana Flux.1 Ultra',
  },
  {
    id: 'img-2',
    title: 'Chim ruồi Cyber-Iris',
    status: 'completed',
    quality: 'HD ULTRA',
    date: 'Ngày 24 tháng 10 năm 2026',
    model: 'Banana Flux.1 Ultra',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    prompt: 'Cảnh quay cận cảnh một con chim ruồi robot với đôi cánh bằng thủy tinh trong mờ, đang hút năng lượng sống từ một cụm hoa phát quang sinh học rực rỡ.',
    seed: '88294105',
    aspectRatio: '16:9',
    author: '@AuraNexus',
  },
  {
    id: 'img-3',
    title: 'Thành phố Cyberpunk Ban Đêm',
    status: 'completed',
    quality: 'HD ULTRA',
    date: 'Ngày 23 tháng 10 năm 2026',
    model: 'Midjourney V6.1',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    prompt: 'Góc quay toàn cảnh thành phố tương lai rực rỡ đèn neon dưới mưa, xe bay lưu thông mượt mà.',
    seed: '94201823',
    aspectRatio: '16:9',
    author: '@UngPhatTai',
  },
]

export default function ImageCreatePage() {
  const theme = useTheme()
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md')) // < 900px

  const [userBalance, setUserBalance] = useState(1250)
  const [selectedModel, setSelectedModel] = useState(IMAGE_MODELS[0])
  
  const [atmosphere, setAtmosphere] = useState({ label: 'Mặc định', img: '' })
  const [lighting, setLighting] = useState({ label: 'Mặc định', img: '' })
  const [colorStyle, setColorStyle] = useState({ label: 'Mặc định', img: '' })

  const [quality, setQuality] = useState('hd')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [referenceImages, setReferenceImages] = useState([])

  const [promptDraft, setPromptDraft] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [generatedImages, setGeneratedImages] = useState(INITIAL_IMAGES)

  const [isModelModalOpen, setIsModelModalOpen] = useState(false)
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false)
  const [styleActiveTab, setStyleActiveTab] = useState('color')
  const [activeImageDetail, setActiveImageDetail] = useState(null)

  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false)

  const refFileInputRef = useRef(null)
  const currentCost = quality === 'hd' ? 2 : 1

  useEffect(() => {
    const handleToggleTools = () => {
      setIsMobileToolsOpen((prev) => !prev)
    }

    window.addEventListener('app-trigger-toggle-tools', handleToggleTools)
    return () => window.removeEventListener('app-trigger-toggle-tools', handleToggleTools)
  }, [])

  const handleAddReferenceImage = (e) => {
    const file = e.target.files[0]
    if (file && referenceImages.length < 3) {
      const imageUrl = URL.createObjectURL(file)
      setReferenceImages((prev) => [...prev, { id: `ref-${Date.now()}`, url: imageUrl }])
    }
    if (e.target) e.target.value = ''
  }

  const handleRemoveReferenceImage = (idToRemove) => {
    setReferenceImages((prev) => prev.filter((img) => img.id !== idToRemove))
  }

  const handleOptimizePrompt = () => {
    if (!promptDraft.trim()) return
    setIsOptimizing(true)

    setTimeout(() => {
      const enhanced = `[IMAGE AI PROMPT]: Bức ảnh độ nét cao 8K, ${promptDraft.trim()}, chi tiết cực kỳ phong phú, ánh sáng ${lighting.label}, phong cách nghệ thuật ${atmosphere.label}, tone màu ${colorStyle.label}, render bằng Octane Engine HDR10+.`
      setPromptDraft(enhanced)
      setIsOptimizing(false)
    }, 800)
  }

  const handleGenerateImage = () => {
    if (!promptDraft.trim() || userBalance < currentCost) return

    setUserBalance((prev) => prev - currentCost)

    const newImage = {
      id: `img-${Date.now()}`,
      title: promptDraft.slice(0, 24) + '...',
      status: 'generating',
      progress: 15,
      timeRemaining: 'Còn khoảng 10 giây',
      model: selectedModel.name,
    }

    setGeneratedImages((prev) => [newImage, ...prev])
    setPromptDraft('')
  }

  const handleClearAllStyles = () => {
    setAtmosphere({ label: 'Mặc định', img: '' })
    setLighting({ label: 'Mặc định', img: '' })
    setColorStyle({ label: 'Mặc định', img: '' })
  }

  const renderControlSidebarContent = () => (
    <aside className="image-controls-sidebar">
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
              <div style={{ fontSize: '10px', color: '#64748B' }}>Không khí</div>
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
              <div style={{ fontSize: '10px', color: '#64748B' }}>Chiếu sáng</div>
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
        <div className="quality-toggle-box">
          <button
            className={`quality-btn ${quality === 'hd' ? 'active' : ''}`}
            onClick={() => setQuality('hd')}
          >
            <span>HD Ultra</span>
            <span className="badge-credit">(2<DiamondOutlined className="gem-icon" />)</span>
          </button>
          <button
            className={`quality-btn ${quality === 'standard' ? 'active' : ''}`}
            onClick={() => setQuality('standard')}
          >
            <span>Tiêu chuẩn</span>
            <span className="badge-credit">(1<DiamondOutlined className="gem-icon" />)</span>
          </button>
        </div>
      </div>

      <div>
        <div className="control-group-title">KÍCH THƯỚC</div>
        <div className="aspect-ratio-grid">
          <Tooltip title="Phù hợp đăng bài Facebook, Instagram Post, Ảnh đại diện, Ảnh sản phẩm Shopee/Lazada." arrow placement="top">
            <div className={`aspect-btn ${aspectRatio === '1:1' ? 'active' : ''}`} onClick={() => setAspectRatio('1:1')}>
              <div className="aspect-box-icon" style={{ width: 16, height: 16 }}></div>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>1:1</span>
            </div>
          </Tooltip>

          <Tooltip title="Phù hợp làm Ảnh bìa (Cover), Thumbnail YouTube, Banner website, Presentation (Slide)." arrow placement="top">
            <div className={`aspect-btn ${aspectRatio === '16:9' ? 'active' : ''}`} onClick={() => setAspectRatio('16:9')}>
              <div className="aspect-box-icon" style={{ width: 22, height: 14 }}></div>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>16:9</span>
            </div>
          </Tooltip>

          <Tooltip title="Phù hợp đăng TikTok, Facebook Story, Instagram Story/Reels." arrow placement="top">
            <div className={`aspect-btn ${aspectRatio === '9:16' ? 'active' : ''}`} onClick={() => setAspectRatio('9:16')}>
              <div className="aspect-box-icon" style={{ width: 14, height: 22 }}></div>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>9:16</span>
            </div>
          </Tooltip>
        </div>
      </div>

      <div>
        <div className="control-group-title">
          <span>THAM KHẢO HÌNH ẢNH ({referenceImages.length}/3)</span>
          {referenceImages.length > 0 && (
            <span className="clear-link" onClick={() => setReferenceImages([])}>Xóa tất cả</span>
          )}
        </div>

        {referenceImages.length === 0 ? (
          <div className="reference-empty-large" onClick={() => refFileInputRef.current?.click()}>
            <AddPhotoAlternateOutlined style={{ color: '#00F2FF', fontSize: 22 }} />
            <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 600 }}>
              TẢI LÊN ẢNH THAM KHẢO (TỐI ĐA 3)
            </span>
          </div>
        ) : (
          <div className="reference-multi-grid">
            <AnimatePresence>
              {referenceImages.map((img) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="reference-item-box"
                >
                  <img src={img.url} alt="Reference" className="reference-thumb-img" />
                  <div className="reference-delete-overlay">
                    <button
                      className="btn-delete-reference"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveReferenceImage(img.id)
                      }}
                    >
                      <DeleteOutlined fontSize="small" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {referenceImages.length < 3 && (
              <div className="reference-upload-btn" onClick={() => refFileInputRef.current?.click()}>
                <AddOutlined style={{ color: '#00F2FF', fontSize: 20 }} />
                <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 600 }}>THÊM</span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )

  return (
    <div className="image-page-container">
      <input
        type="file"
        ref={refFileInputRef}
        onChange={handleAddReferenceImage}
        accept="image/*"
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
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFF' }}>Công cụ tạo ảnh AI</span>
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
      <main className="image-main-workspace">
        <div className="workspace-header">
          <div>
            <h1 className="workspace-title">Thư viện ảnh AI</h1>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
              Xem lại và quản lý các tác phẩm nghệ thuật hình ảnh đã khởi tạo
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="image-gallery-grid">
          {generatedImages.map((img) => (
            <React.Fragment key={img.id}>
              {img.status === 'generating' ? (
                <div className="image-card-generating">
                  <CircularProgress size={40} sx={{ color: '#00F2FF', mb: 2 }} />
                  <div style={{ fontSize: '13px', color: '#00F2FF', fontWeight: 700 }}>
                    ĐANG KHỞI TẠO {img.progress}%
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF', marginTop: 8 }}>
                    {img.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: 4 }}>
                    {img.timeRemaining}
                  </div>
                </div>
              ) : (
                <div className="image-card-item" onClick={() => setActiveImageDetail(img)}>
                  <div className="image-thumbnail-wrapper">
                    <img src={img.imageUrl} alt={img.title} className="image-thumb-img" />
                    <span className="image-badge-tag">HÌNH ẢNH</span>
                    <div className="view-overlay-btn">
                      <div className="view-icon-circle">
                        <VisibilityOutlined fontSize="medium" />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>{img.title}</div>
                      <MoreVertOutlined style={{ color: '#64748B', fontSize: 18 }} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>
                      {img.model} • {img.date}
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
            placeholder="Hãy mô tả bức ảnh nghệ thuật do AI tạo ra mà bạn muốn..."
          />

          <Button
            className="btn-generate-orange"
            onClick={handleGenerateImage}
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
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', margin: 0 }}>Mẫu tạo ảnh</h3>
                <IconButton onClick={() => setIsModelModalOpen(false)} sx={{ color: '#FFF' }}>
                  <CloseOutlined fontSize="small" />
                </IconButton>
              </div>

              <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 8, marginBottom: 20 }}>
                <button style={{ background: '#00F2FF', color: '#000', fontWeight: 700, padding: '6px 20px', borderRadius: 6, border: 'none', fontSize: '12px' }}>
                  Hình ảnh
                </button>
              </div>

              <div>
                {IMAGE_MODELS.map((m) => (
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
                        {m.isNew && <span style={{ fontSize: '10px', background: '#F47D20', color: '#FFF', padding: '2px 6px', borderRadius: 4 }}>MỚI</span>}
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

              <div className="quality-toggle-box" style={{ marginBottom: 16 }}>
                <button
                  className={`quality-btn ${styleActiveTab === 'atmosphere' ? 'active' : ''}`}
                  onClick={() => setStyleActiveTab('atmosphere')}
                >
                  Không khí
                </button>
                <button
                  className={`quality-btn ${styleActiveTab === 'lighting' ? 'active' : ''}`}
                  onClick={() => setStyleActiveTab('lighting')}
                >
                  Chiếu sáng
                </button>
                <button
                  className={`quality-btn ${styleActiveTab === 'color' ? 'active' : ''}`}
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

      {/* MODAL 3: LIGHTBOX (ĐÃ ĐỔI NHÃN THÀNH "DÙNG LẠI PROMPT NÀY") */}
      <AnimatePresence>
        {activeImageDetail && (
          <div className="modal-overlay-backdrop" onClick={() => setActiveImageDetail(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="lightbox-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close-btn" onClick={() => setActiveImageDetail(null)}>
                <CloseOutlined fontSize="small" />
              </button>

              <div className="lightbox-left-media">
                <img
                  src={activeImageDetail.imageUrl}
                  alt={activeImageDetail.title}
                  className="lightbox-full-img"
                />
              </div>

              <div className="lightbox-right-info">
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFF', margin: 0 }}>
                    {activeImageDetail.title}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Tác giả: <span style={{ color: '#00F2FF' }}>{activeImageDetail.author || '@AuraNexus'}</span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#00F2FF', fontWeight: 700, letterSpacing: '0.8px', marginTop: '20px', textTransform: 'uppercase' }}>
                    Lời gợi ý tạo nội dung
                  </div>

                  <div className="lightbox-prompt-box">
                    "{activeImageDetail.prompt || 'Mô tả chi tiết tác phẩm...'}"
                  </div>

                  <div className="lightbox-metadata-grid">
                    <div className="metadata-item">
                      <div className="metadata-label">Mẫu</div>
                      <div className="metadata-value">{activeImageDetail.model}</div>
                    </div>
                    <div className="metadata-item">
                      <div className="metadata-label">Hạt giống</div>
                      <div className="metadata-value">{activeImageDetail.seed || '88294105'}</div>
                    </div>
                    <div className="metadata-item">
                      <div className="metadata-label">Chất lượng</div>
                      <div className="metadata-value">{activeImageDetail.quality || 'HD ULTRA'}</div>
                    </div>
                    <div className="metadata-item">
                      <div className="metadata-label">Tỷ lệ khung hình</div>
                      <div className="metadata-value">{activeImageDetail.aspectRatio || '16:9'}</div>
                    </div>
                  </div>
                </div>

                {/* ĐẢM BẢO ĐỔI TÊN NÚT THÀNH "DÙNG LẠI PROMPT NÀY" */}
                <button
                  className="btn-remix-cyan"
                  onClick={() => {
                    setPromptDraft(activeImageDetail.prompt || '')
                    setActiveImageDetail(null)
                  }}
                >
                  <AutoFixHighOutlined fontSize="small" />
                  Dùng lại prompt này
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}