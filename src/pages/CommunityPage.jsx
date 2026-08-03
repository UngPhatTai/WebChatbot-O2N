import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconButton,
  Select,
  MenuItem,
  Button,
} from '@mui/material'
import {
  PublicRounded,
  LockOutlined,
  ImageOutlined,
  VideocamOutlined,
  DescriptionOutlined,
  MoreHoriz,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  DownloadOutlined,
  ContentCopyOutlined,
  CloseOutlined,
  ChevronLeftRounded,
  ChevronRightRounded,
  AutoFixHighOutlined,
  CheckCircleRounded,
  FullscreenOutlined,
  ShareOutlined,
  PlayArrowRounded,
  FolderZipOutlined,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

import logoImg from '../assets/transperant.png'
import '../css/CommunityPage.css'

// ============================================================================
// BỘ DỮ LIỆU CHUẨN (20 MỤC PHONG PHÚ ĐẦY ĐỦ CỘNG ĐỒNG VÀ NỘI BỘ)
// ============================================================================
const INITIAL_COMMUNITY_ITEMS = [
  // --- TÁC PHẨM CỘNG ĐỒNG (PUBLIC SCOPE) ---
  {
    id: 'c-1',
    title: 'Vũ Điệu Cò Trắng',
    type: 'image',
    fileExt: 'png',
    scope: 'public',
    author: '@HaLong_Future',
    avatarLetter: 'HL',
    date: '20 Th10, 2026',
    likes: 1200,
    downloads: 450,
    isLiked: false,
    isTrending: true,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    prompt: 'A cinematic wide shot of a solitary white stork in flight over Mu Cang Chai rice terraces during sunset.',
    refFileName: 'reference_sketch_composition_v1.png',
    refSize: '2.4 MB • Image-to-Image',
    refUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300',
    model: 'Omni Flash v3',
    aspectRatio: '16:9',
    quality: '4K Ultra HD',
    style: 'Cinematic Autumn',
    seed: '88294105',
    sampler: 'DPM++',
  },
  {
    id: 'c-2',
    title: 'Quận Mưa Neon',
    type: 'video',
    fileExt: 'mp4',
    scope: 'public',
    author: '@HaLong_Future',
    avatarLetter: 'HL',
    date: '20 Th10, 2026',
    likes: 890,
    downloads: 310,
    isLiked: false,
    isTrending: false,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    prompt: 'Cảnh quay quận phố neon mưa rơi ban đêm, góc máy quay quét mượt mà phong cách điện ảnh 60fps.',
    refFileName: 'cyber_map_ref.json',
    refSize: '1.1 MB • Config Data',
    refUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300',
    model: 'Cinematix-V3 Pro',
    aspectRatio: '16:9',
    quality: '1080P 60fps',
    duration: '00:15s',
    seed: '94201823',
    sampler: 'Euler a',
  },
  {
    id: 'c-3',
    title: 'Phượng Hoàng Tơ Lụa',
    type: 'image',
    fileExt: 'jpg',
    scope: 'public',
    author: '@HaLong_Future',
    avatarLetter: 'HL',
    date: '20 Th10, 2026',
    likes: 2400,
    downloads: 1100,
    isLiked: false,
    isTrending: true,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    prompt: 'Biểu tượng phượng hoàng lửa được dệt từ những sợi tơ lụa phát sáng truyền thống Việt Nam, render Octane Engine 8K.',
    refFileName: 'phoenix_texture.png',
    refSize: '3.8 MB • Texture Map',
    refUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=300',
    model: 'Banana Flux.1 Ultra',
    aspectRatio: '16:9',
    quality: '8K UHD',
    style: 'Neon Cyber Lụa',
    seed: '10928374',
    sampler: 'DPM++ 2M',
  },

  // --- TÁC PHẨM NỘI BỘ (PRIVATE SCOPE) ---
  {
    id: 'p-1',
    title: 'Báo Cáo Tiếp Thị AI Q3',
    type: 'document',
    fileExt: 'pdf',
    scope: 'private',
    author: '@UngPhatTai',
    avatarLetter: 'PT',
    date: '24 Th10, 2026',
    likes: 1540,
    downloads: 820,
    isLiked: true,
    isTrending: true,
    docSummary: 'Bản phân tích chi tiết hiệu suất chiến dịch tiếp thị tự động hóa bằng AI trong Q3 năm 2026. Bao gồm các chỉ số ROI, tỷ lệ chuyển đổi và lộ trình tối ưu hóa ngân sách.',
    model: 'Chatbot GPT-4o RAG',
    aspectRatio: 'Document',
    seed: '10928374',
    sampler: 'Text-Gen-v2',
  },
  {
    id: 'p-2',
    title: 'Dự Án Xe Bay Cyber-Iris',
    type: 'image',
    fileExt: 'png',
    scope: 'private',
    author: '@UngPhatTai',
    avatarLetter: 'PT',
    date: '22 Th10, 2026',
    likes: 310,
    downloads: 95,
    isLiked: false,
    isTrending: false,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    prompt: 'Bản phác thảo xe bay Cyberpunk công nghệ động cơ Ion trong mờ.',
    refFileName: 'cyber_iris_concept.png',
    refSize: '5.1 MB • Sketch Ref',
    refUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300',
    model: 'Banana Flux.1 Ultra',
    aspectRatio: '16:9',
    quality: '4K Ultra',
    style: 'Concept Art',
    seed: '88294105',
    sampler: 'DPM++',
  },
  {
    id: 'p-3',
    title: 'Trailer Giới Thiệu Sản Phẩm',
    type: 'video',
    fileExt: 'mp4',
    scope: 'private',
    author: '@UngPhatTai',
    avatarLetter: 'PT',
    date: '18 Th10, 2026',
    likes: 620,
    downloads: 240,
    isLiked: true,
    isTrending: true,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    prompt: 'Video trailer ngắn 10 giây thể hiện sức mạnh xử lý ngôn ngữ tự nhiên AI.',
    refFileName: 'storyboard_v2.pdf',
    refSize: '1.8 MB • Storyboard',
    refUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300',
    model: 'Cinematix-V3 Pro',
    aspectRatio: '16:9',
    quality: '4K 60fps',
    duration: '00:10s',
    seed: '99201823',
    sampler: 'Euler',
  },
]

export default function CommunityPage() {
  const navigate = useNavigate()

  // State
  const [items, setItems] = useState(INITIAL_COMMUNITY_ITEMS)
  const [scope, setScope] = useState('public')
  const [mediaTab, setMediaTab] = useState('all')
  const [sortOption, setSortOption] = useState('trending')
  
  // Modals
  const [activeItemDetail, setActiveItemDetail] = useState(null)
  const [activeDocDetail, setActiveDocDetail] = useState(null)
  const [previewRefImage, setPreviewRefImage] = useState(null)
  const [isFullViewMedia, setIsFullViewMedia] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDownloadAsset = (itemId, title) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, downloads: item.downloads + 1 } : item
      )
    )

    if (activeItemDetail && activeItemDetail.id === itemId) {
      setActiveItemDetail((prev) => ({
        ...prev,
        downloads: prev.downloads + 1,
      }))
    }

    alert(`Đang tiến hành tải tác phẩm: ${title}`)
  }

  const handleToggleLike = (itemId, e) => {
    if (e) e.stopPropagation()

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const newLiked = !item.isLiked
          return {
            ...item,
            isLiked: newLiked,
            likes: newLiked ? item.likes + 1 : item.likes - 1,
          }
        }
        return item
      })
    )

    if (activeItemDetail && activeItemDetail.id === itemId) {
      setActiveItemDetail((prev) => {
        const newLiked = !prev.isLiked
        return {
          ...prev,
          isLiked: newLiked,
          likes: newLiked ? prev.likes + 1 : prev.likes - 1,
        }
      })
    }
  }

  const filteredItems = useMemo(() => {
    let result = [...items]

    result = result.filter((item) => item.scope === scope)

    if (mediaTab !== 'all') {
      result = result.filter((item) => item.type === mediaTab)
    }

    if (sortOption === 'trending') {
      result.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0))
    } else if (sortOption === 'likes') {
      result.sort((a, b) => b.likes - a.likes)
    } else if (sortOption === 'downloads') {
      result.sort((a, b) => b.downloads - a.downloads)
    }

    return result
  }, [items, scope, mediaTab, sortOption])

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRemixPrompt = (item) => {
    setActiveItemDetail(null)
    if (item.type === 'video') navigate('/video')
    else navigate('/image')
  }

  const handleCardClick = (item) => {
    if (item.type === 'document') {
      setActiveDocDetail(item)
    } else {
      setActiveItemDetail(item)
    }
  }

  return (
    <div className="community-page-container">
      {/* Watermark Logo Background */}
      <img src={logoImg} alt="Watermark Brand Logo" className="community-watermark-bg" />

      {/* STICKY GLASSMORPHISM HEADER */}
      <div className="community-sticky-header-container">
        <div className="header-inner-flex">
          <div className="header-top-row">
            <h1 className="community-header-title">
              Cộng đồng Sáng tạo <span className="brand-gradient-text">ONE TO NINE</span>
            </h1>

            <div className="scope-toggle-box">
              <button
                className={`scope-btn ${scope === 'public' ? 'active' : ''}`}
                onClick={() => setScope('public')}
              >
                <PublicRounded style={{ fontSize: 14 }} />
                Cộng đồng
              </button>
              <button
                className={`scope-btn ${scope === 'private' ? 'active' : ''}`}
                onClick={() => setScope('private')}
              >
                <LockOutlined style={{ fontSize: 14 }} />
                Nội bộ của tôi
              </button>
            </div>
          </div>

          <p className="community-header-subtitle">
            Khám phá và chia sẻ những tác phẩm nghệ thuật AI đỉnh cao từ các nhà sáng tạo Việt Nam.
          </p>

          <div className="community-filters-row">
            <div className="media-type-pills">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'image', label: 'Hình ảnh', icon: <ImageOutlined style={{ fontSize: 14 }} /> },
                { id: 'video', label: 'Video', icon: <VideocamOutlined style={{ fontSize: 14 }} /> },
                { id: 'document', label: 'Tài liệu', icon: <DescriptionOutlined style={{ fontSize: 14 }} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`pill-filter-btn ${mediaTab === tab.id ? 'active' : ''}`}
                  onClick={() => setMediaTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              size="small"
              className="sort-select-box"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                height: 32,
              }}
            >
              <MenuItem value="trending">🔥 Xu hướng (Trending)</MenuItem>
              <MenuItem value="newest">🕒 Mới nhất</MenuItem>
              <MenuItem value="likes">❤️ Lượt tim nhiều nhất</MenuItem>
              <MenuItem value="downloads">📥 Lượt tải về nhiều nhất</MenuItem>
            </Select>
          </div>
        </div>
      </div>

      <div className="community-content-wrapper">
        {/* GALLERY GRID */}
        <div className="community-gallery-grid">
          {filteredItems.length === 0 ? (
            <div className="empty-state-box">
              <FolderZipOutlined sx={{ fontSize: 44, color: '#06A8D9' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>Chưa có nội dung nội bộ nào</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Các tác phẩm cá nhân bạn tạo ra hoặc lưu từ Chatbot sẽ xuất hiện tại đây.</div>
            </div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="community-card"
                onClick={() => handleCardClick(item)}
              >
                <div className="card-media-wrapper">
                  {item.type === 'document' ? (
                    <div style={{ width: '100%', height: '100%', background: 'rgba(6,168,217,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                      <DescriptionOutlined sx={{ fontSize: 44, color: '#06A8D9' }} />
                      <span style={{ fontSize: '11px', color: '#8E9BAE', fontWeight: 600 }}>TÀI LIỆU CHATBOT</span>
                    </div>
                  ) : (
                    <>
                      <img src={item.imageUrl} alt={item.title} className="card-media-img" />
                      {item.type === 'video' && (
                        <div className="video-overlay-layer">
                          <div className="video-play-btn-circle">
                            <PlayArrowRounded fontSize="small" />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <span className={`badge-scope-tag ${item.scope}`}>
                    {item.scope === 'public' ? 'CỘNG ĐỒNG' : 'NỘI BỘ'}
                  </span>

                  <span className="badge-file-extension">.{item.fileExt}</span>
                </div>

                <div className="card-info-content">
                  <div className="card-title-row">
                    <h3 className="card-asset-title">{item.title}</h3>
                    <IconButton size="small" sx={{ color: '#64748B' }}>
                      <MoreHoriz fontSize="small" />
                    </IconButton>
                  </div>

                  <div className="card-author-row">
                    <div className="author-avatar-circle">{item.avatarLetter}</div>
                    <div>
                      <div className="author-name-text">{item.author}</div>
                      <div className="author-date-text">• {item.date}</div>
                    </div>
                  </div>

                  <div className="card-footer-stats">
                    <button
                      className={`btn-card-like ${item.isLiked ? 'liked' : ''}`}
                      onClick={(e) => handleToggleLike(item.id, e)}
                    >
                      {item.isLiked ? (
                        <FavoriteOutlined style={{ fontSize: 14, color: '#F57F1F' }} />
                      ) : (
                        <FavoriteBorderOutlined style={{ fontSize: 14 }} />
                      )}
                      <span>{item.likes >= 1000 ? `${(item.likes / 1000).toFixed(1)}k` : item.likes}</span>
                    </button>

                    <span className="badge-media-type">
                      {item.type === 'video' ? 'Video' : item.type === 'document' ? 'Tài liệu' : 'Image'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* STICKY PAGINATION BAR */}
      <div className="sticky-pagination-bar">
        <button className="page-btn"><ChevronLeftRounded /></button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <span style={{ color: '#64748B', fontSize: 11 }}>...</span>
        <button className="page-btn">12</button>
        <button className="page-btn"><ChevronRightRounded /></button>
      </div>

      {/* MODAL LIGHTBOX */}
      <AnimatePresence>
        {activeItemDetail && (
          <div
            className="community-modal-backdrop"
            onClick={() => setActiveItemDetail(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              className="community-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn-fixed"
                onClick={() => setActiveItemDetail(null)}
              >
                <CloseOutlined fontSize="small" />
              </button>

              <div className="modal-left-media-wrapper">
                <img
                  src={activeItemDetail.imageUrl}
                  alt={activeItemDetail.title}
                  className="modal-media-img"
                />
                <span className="modal-badge-4k">4K ULTRA HD</span>

                <button
                  className="btn-full-view-media"
                  onClick={() => setIsFullViewMedia(true)}
                >
                  <FullscreenOutlined style={{ fontSize: 16 }} />
                  Xem toàn ảnh
                </button>
              </div>

              <div className="modal-right-info-panel">
                <div>
                  <div className="modal-right-header">
                    <h2 className="modal-item-title">{activeItemDetail.title}</h2>

                    <button
                      className={`btn-modal-like-pill ${activeItemDetail.isLiked ? 'liked' : ''}`}
                      onClick={() => handleToggleLike(activeItemDetail.id)}
                    >
                      {activeItemDetail.isLiked ? (
                        <FavoriteOutlined style={{ fontSize: 15 }} />
                      ) : (
                        <FavoriteBorderOutlined style={{ fontSize: 15 }} />
                      )}
                      <span>
                        {activeItemDetail.likes >= 1000
                          ? `${(activeItemDetail.likes / 1000).toFixed(1)}k`
                          : activeItemDetail.likes}{' '}
                        Lượt thích
                      </span>
                    </button>
                  </div>

                  <div className="modal-author-block">
                    <div className="author-avatar-circle" style={{ width: 32, height: 32, fontSize: 12 }}>
                      {activeItemDetail.avatarLetter}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {activeItemDetail.author}
                        <CheckCircleRounded sx={{ color: '#06A8D9', fontSize: 14 }} />
                      </div>
                      <div style={{ fontSize: '10px', color: '#06A8D9', fontWeight: 700 }}>NHÀ SÁNG TẠO XUẤT SẮC</div>
                    </div>
                  </div>

                  <div className="modal-prompt-box-container">
                    <div className="prompt-box-header">
                      <span>PROMPT</span>
                      <button
                        style={{ background: 'transparent', border: 'none', color: '#06A8D9', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        onClick={() => handleCopyPrompt(activeItemDetail.prompt)}
                      >
                        <ContentCopyOutlined style={{ fontSize: 12 }} />
                        {copied ? 'Đã chép!' : 'Sao chép'}
                      </button>
                    </div>
                    <p className="prompt-text-content">"{activeItemDetail.prompt}"</p>
                  </div>

                  {/* KHUNG ẢNH THAM CHIẾU */}
                  {activeItemDetail.refFileName && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                        ẢNH THAM CHIẾU (IMAGE REF)
                      </div>
                      <div
                        className="image-ref-card-figma"
                        onClick={() => setPreviewRefImage(activeItemDetail.refUrl || activeItemDetail.imageUrl)}
                      >
                        <div className="ref-thumb-box">
                          <img src={activeItemDetail.refUrl || activeItemDetail.imageUrl} alt="Ref Thumb" className="ref-thumb-img" />
                        </div>
                        <div className="ref-info-text">
                          <div className="ref-filename-title">{activeItemDetail.refFileName}</div>
                          <div className="ref-filesize-sub">{activeItemDetail.refSize || '2.4 MB • Image-to-Image'}</div>
                        </div>
                        <IconButton size="small" sx={{ color: '#06A8D9' }}>
                          <DownloadOutlined fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  )}

                  <div className="modal-metadata-grid-2x2">
                    <div className="meta-info-card">
                      <div className="meta-info-label">MẪU</div>
                      <div className="meta-info-value">{activeItemDetail.model}</div>
                    </div>
                    <div className="meta-info-card">
                      <div className="meta-info-label">TỶ LỆ</div>
                      <div className="meta-info-value">{activeItemDetail.aspectRatio}</div>
                    </div>
                    <div className="meta-info-card">
                      <div className="meta-info-label">CHẤT LƯỢNG</div>
                      <div className="meta-info-value">{activeItemDetail.quality || '4K Ultra'}</div>
                    </div>
                    <div className="meta-info-card">
                      <div className="meta-info-label">
                        {activeItemDetail.type === 'video' ? 'THỜI LƯỢNG' : 'PHONG CÁCH'}
                      </div>
                      <div className="meta-info-value">
                        {activeItemDetail.type === 'video'
                          ? activeItemDetail.duration || '00:15s'
                          : activeItemDetail.style || 'Cinematic'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions-stack">
                  <button
                    className="btn-remix-orange"
                    onClick={() => handleRemixPrompt(activeItemDetail)}
                  >
                    <AutoFixHighOutlined style={{ fontSize: 16 }} />
                    Dùng lại prompt & Ảnh gốc
                  </button>

                  <button
                    className="btn-download-cyan"
                    onClick={() => handleDownloadAsset(activeItemDetail.id, activeItemDetail.title)}
                  >
                    <DownloadOutlined style={{ fontSize: 16 }} />
                    Tải về 4K ({activeItemDetail.downloads} lượt tải)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL TÀI LIỆU CHATBOT */}
      <AnimatePresence>
        {activeDocDetail && (
          <div className="community-modal-backdrop" onClick={() => setActiveDocDetail(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="document-reader-box"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="doc-reader-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <DescriptionOutlined sx={{ color: '#06A8D9' }} />
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#FFF' }}>{activeDocDetail.title}</span>
                </div>
                <IconButton onClick={() => setActiveDocDetail(null)} sx={{ color: '#FFF' }}>
                  <CloseOutlined fontSize="small" />
                </IconButton>
              </div>

              <div className="doc-content-body">
                {activeDocDetail.docSummary}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <Button
                  startIcon={<ShareOutlined />}
                  sx={{ color: '#06A8D9', textTransform: 'none', fontWeight: 600 }}
                  onClick={() => alert('Đã sao chép liên kết chia sẻ tài liệu Chatbot!')}
                >
                  Chia sẻ tài liệu này
                </Button>
                <Button
                  className="btn-remix-orange"
                  style={{ width: 'auto', padding: '10px 24px' }}
                  onClick={() => handleDownloadAsset(activeDocDetail.id, activeDocDetail.title)}
                >
                  Tải bản PDF ({activeDocDetail.downloads} lượt tải)
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL FULLSCREEN MEDIA PREVIEW */}
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
              src={previewRefImage || activeItemDetail?.imageUrl}
              alt="Full Preview"
              style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain', borderRadius: '12px' }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}