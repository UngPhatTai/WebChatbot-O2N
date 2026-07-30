import React, { useState, useMemo, useRef } from 'react'
import {
  IconButton,
  Select,
  MenuItem,
  Button,
} from '@mui/material'
import {
  CloudOutlined,
  PlayArrowRounded,
  DescriptionOutlined,
  GraphicEqOutlined,
  AddOutlined,
  FavoriteBorderOutlined,
  DeleteOutlined,
  Check,
  CloseOutlined,
  DownloadOutlined,
  InsertDriveFileOutlined,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

import '../css/LibraryPage.css'

// ============================================================================
// MOCK DATA ASSETS DÙNG CHUNG TOÀN HỆ THỐNG
// ============================================================================
const INITIAL_ASSETS = [
  {
    id: 'ast-1',
    type: 'image',
    title: 'Thành phố Cyberpunk Ban Đêm',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-07-28T10:00:00Z',
    isFavorite: false,
  },
  {
    id: 'ast-2',
    type: 'video',
    title: 'Cánh đồng lúa hoàng hôn',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
    videoMediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '00:12',
    createdAt: '2026-07-27T14:30:00Z',
    isFavorite: true,
  },
  {
    id: 'ast-3',
    type: 'document',
    title: 'Project_Specs.pdf',
    size: '1.2 MB',
    createdAt: '2026-07-25T09:15:00Z',
    isFavorite: false,
  },
  {
    id: 'ast-4',
    type: 'audio',
    title: 'Ambient_Flow.wav',
    size: '3.4 MB',
    audioMediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    createdAt: '2026-07-20T16:45:00Z',
    isFavorite: false,
  },
  {
    id: 'ast-5',
    type: 'image',
    title: 'Chim ruồi Cyber-Iris',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-07-15T11:20:00Z',
    isFavorite: true,
  },
]

export default function LibraryPage() {
  const [assets, setAssets] = useState(INITIAL_ASSETS)
  const [selectedAssetIds, setSelectedAssetIds] = useState([])

  // State Filters
  const [typeFilter, setTypeFilter] = useState('all') // 'all' | 'image' | 'video' | 'audio' | 'document'
  const [timeFilter, setTimeFilter] = useState('newest') // 'newest' | 'oldest' | '7days' | 'thisMonth'

  // State Mở Xem Trực Tiếp Video / Ảnh / Audio / Document
  const [activePreviewAsset, setActivePreviewAsset] = useState(null)

  const fileInputRef = useRef(null)

  // ============================================================================
  // FILTERING LOGIC (LỌC THEO DẠNG VÀ THỜI GIAN)
  // ============================================================================
  const filteredAssets = useMemo(() => {
    let result = [...assets]

    if (typeFilter !== 'all') {
      result = result.filter((item) => item.type === typeFilter)
    }

    const now = new Date('2026-07-30T15:00:00Z')
    if (timeFilter === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      result = result.filter((item) => new Date(item.createdAt) >= sevenDaysAgo)
    } else if (timeFilter === 'thisMonth') {
      result = result.filter((item) => {
        const itemDate = new Date(item.createdAt)
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
      })
    } else if (timeFilter === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return result
  }, [assets, typeFilter, timeFilter])

  // Click vào Card Media (Mở xem trực tiếp nếu click vào vùng giữa, hoặc chọn nếu click checkbox)
  const handleCardClick = (asset, e) => {
    e.stopPropagation()
    setActivePreviewAsset(asset)
  }

  // Toggle chọn Checkbox
  const handleToggleSelectCard = (id, e) => {
    e.stopPropagation()
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Tải lên tệp mới
  const handleUploadNewFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    let detectedType = 'document'
    if (file.type.startsWith('image/')) detectedType = 'image'
    else if (file.type.startsWith('video/')) detectedType = 'video'
    else if (file.type.startsWith('audio/')) detectedType = 'audio'

    const newAsset = {
      id: `ast-${Date.now()}`,
      type: detectedType,
      title: file.name,
      url: URL.createObjectURL(file),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    }

    setAssets((prev) => [newAsset, ...prev])
  }

  // Xóa các mục đã chọn
  const handleDeleteSelected = () => {
    if (selectedAssetIds.length === 0) return
    setAssets((prev) => prev.filter((item) => !selectedAssetIds.includes(item.id)))
    setSelectedAssetIds([])
  }

  const handleDownloadSelected = () => {
    alert(`Đang tải xuống gói Zip gồm ${selectedAssetIds.length} tệp đã chọn!`)
  }

  return (
    <div className="library-page-container">
      {/* Hidden File Input Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUploadNewFile}
        style={{ display: 'none' }}
      />

      <div className="library-content-wrapper">
        {/* ========================================================================= */}
        {/* HEADER WORKSPACE & STORAGE INDICATOR                                      */}
        {/* ========================================================================= */}
        <div className="library-header-row">
          <div>
            <h1 className="library-title">Kho lưu trữ của tôi</h1>
            <p className="library-subtitle">Quản lý và sắp xếp các tài sản kỹ thuật số của bạn.</p>
          </div>

          <div className="storage-widget-card">
            <span className="storage-info-text">
              Đã sử dụng: <strong>2,4 GB / 15 GB</strong>{' '}
              <span className="storage-percent-highlight">16%</span>
            </span>
            <CloudOutlined className="storage-cloud-icon" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILTER BARS (LỌC THEO DẠNG VÀ THỜI GIAN)                                   */}
        {/* ========================================================================= */}
        <div className="library-filters-wrapper">
          <div className="type-filter-tabs">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'image', label: 'Hình ảnh' },
              { id: 'video', label: 'Video' },
              { id: 'audio', label: 'Âm thanh' },
              { id: 'document', label: 'Tài liệu' },
            ].map((tab) => {
              const isActive = typeFilter === tab.id
              return (
                <button
                  key={tab.id}
                  className={`type-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setTypeFilter(tab.id)}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeLibraryTypeFilter"
                      className="active-tab-underline"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            size="small"
            className="time-filter-select"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              height: 36,
            }}
          >
            <MenuItem value="newest">Thời gian: Mới nhất</MenuItem>
            <MenuItem value="oldest">Thời gian: Cũ nhất</MenuItem>
            <MenuItem value="7days">Trong 7 ngày qua</MenuItem>
            <MenuItem value="thisMonth">Trong tháng này</MenuItem>
          </Select>
        </div>

        {/* ========================================================================= */}
        {/* MEDIA ASSETS GRID                                                         */}
        {/* ========================================================================= */}
        <div className="assets-grid">
          <AnimatePresence>
            {filteredAssets.map((asset) => {
              const isSelected = selectedAssetIds.includes(asset.id)

              return (
                <motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className={`asset-card ${isSelected ? 'selected' : ''}`}
                  onClick={(e) => handleCardClick(asset, e)}
                >
                  {/* Checkbox circle chọn item */}
                  <div
                    className="checkbox-circle"
                    onClick={(e) => handleToggleSelectCard(asset.id, e)}
                  >
                    {isSelected && <Check style={{ fontSize: 12, color: '#FFF' }} />}
                  </div>

                  {/* 1. RENDER ẢNH */}
                  {asset.type === 'image' && (
                    <img src={asset.url} alt={asset.title} className="card-image-bg" />
                  )}

                  {/* 2. RENDER VIDEO (CÓ LỚP PHỦ NÚT PLAY ĐĂNG CẤP) */}
                  {asset.type === 'video' && (
                    <>
                      <img src={asset.url} alt={asset.title} className="card-image-bg" />
                      <div className="video-overlay-layer">
                        <div className="video-play-btn-circle">
                          <PlayArrowRounded fontSize="medium" />
                        </div>
                      </div>
                      <span className="card-video-duration">{asset.duration}</span>
                    </>
                  )}

                  {/* 3. RENDER AUDIO */}
                  {asset.type === 'audio' && (
                    <div className="card-audio-bg">
                      <GraphicEqOutlined className="audio-waveform-icon" />
                      <span className="audio-filename">{asset.title}</span>
                      <span className="audio-size-tag">{asset.size}</span>
                    </div>
                  )}

                  {/* 4. RENDER TÀI LIỆU */}
                  {asset.type === 'document' && (
                    <div className="card-document-box">
                      <DescriptionOutlined className="doc-icon" />
                      <span className="doc-filename">{asset.title}</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          
          
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BATCH ACTION FLOATING BAR                                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedAssetIds.length > 0 && (
          <motion.div
            initial={{ y: 80, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: 80, x: '-50%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="batch-floating-bar"
          >
            <div className="batch-selected-count">
              Đã chọn {selectedAssetIds.length} mục
            </div>

            <div className="batch-actions-group">
              <button className="btn-batch-action">
                <FavoriteBorderOutlined style={{ fontSize: 16 }} />
                <span>Yêu thích</span>
              </button>

              <button className="btn-batch-action" onClick={handleDeleteSelected}>
                <DeleteOutlined style={{ fontSize: 16 }} />
                <span>Xóa</span>
              </button>

              <button className="btn-batch-download" onClick={handleDownloadSelected}>
                TẢI XUỐNG
              </button>

              <IconButton
                size="small"
                onClick={() => setSelectedAssetIds([])}
                sx={{ color: '#64748B', ml: 1 }}
              >
                <CloseOutlined fontSize="small" />
              </IconButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* LIGHTBOX PREVIEW MODAL (XEM VIDEO / ẢNH / AUDIO / DOCUMENT)              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activePreviewAsset && (
          <div
            className="preview-modal-backdrop"
            onClick={() => setActivePreviewAsset(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.2 }}
              className="preview-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="preview-modal-header">
                <h3 className="preview-modal-title">{activePreviewAsset.title}</h3>
                <IconButton
                  onClick={() => setActivePreviewAsset(null)}
                  sx={{ color: '#FFF' }}
                >
                  <CloseOutlined fontSize="small" />
                </IconButton>
              </div>

              {/* Body Media Preview Container */}
              <div className="preview-media-container">
                {/* 1. TRÌNH PHÁT VIDEO TRỰC TIẾP */}
                {activePreviewAsset.type === 'video' && (
                  <video
                    src={activePreviewAsset.videoMediaUrl || activePreviewAsset.url}
                    controls
                    autoPlay
                    className="preview-video-player"
                  />
                )}

                {/* 2. XEM HÌNH ẢNH PHÓNG TO */}
                {activePreviewAsset.type === 'image' && (
                  <img
                    src={activePreviewAsset.url}
                    alt={activePreviewAsset.title}
                    className="preview-image-view"
                  />
                )}

                {/* 3. TRÌNH PHÁT AUDIO PLAYER */}
                {activePreviewAsset.type === 'audio' && (
                  <div className="preview-audio-player-box">
                    <GraphicEqOutlined sx={{ fontSize: 60, color: '#F57F1F' }} />
                    <audio
                      src={activePreviewAsset.audioMediaUrl || activePreviewAsset.url}
                      controls
                      autoPlay
                      style={{ width: '100%', maxWidth: 480 }}
                    />
                  </div>
                )}

                {/* 4. XEM XIN VĂN BẢN TÀI LIỆU */}
                {activePreviewAsset.type === 'document' && (
                  <div className="preview-doc-box">
                    <InsertDriveFileOutlined sx={{ fontSize: 64, color: '#06A8D9' }} />
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFF' }}>
                      {activePreviewAsset.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Kích thước: {activePreviewAsset.size || '1.2 MB'}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="preview-modal-footer">
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Được tạo ngày: {new Date(activePreviewAsset.createdAt).toLocaleDateString('vi-VN')}
                </div>
                <Button
                  variant="contained"
                  startIcon={<DownloadOutlined />}
                  sx={{
                    background: '#06A8D9',
                    color: '#FFF',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': { background: '#25C4F5' },
                  }}
                  onClick={() => alert(`Đã bắt đầu tải xuống tệp: ${activePreviewAsset.title}`)}
                >
                  Tải tệp này
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}