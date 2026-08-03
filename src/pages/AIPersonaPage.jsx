import React, { useState, useRef } from 'react'
import {
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material'
import {
  PsychologyOutlined,
  StorageOutlined,
  AutoFixHighOutlined,
  FileUploadOutlined,
  CloseOutlined,
  DescriptionOutlined,
  SaveOutlined,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

import logoImg from '../assets/transperant.png'
import '../css/AIPersonaPage.css'

const AI_MODELS = [
  { id: 'm1', label: 'GPT-4o / Claude 3.5 Sonnet (Recomended)' },
  { id: 'm2', label: 'Gemini Omni Flash 2.3 Pro' },
  { id: 'm3', label: 'WanX 2.7 Ultra (4K Native)' },
  { id: 'm4', label: 'Seedance 2.0 Sora Core' },
]

const INITIAL_KNOWLEDGE_FILES = [
  { id: 'f1', name: 'CV_UngPhatTai.pdf', size: '1.2 MB' },
  { id: 'f2', name: 'Brand_Guidelines.docx', size: '3.4 MB' },
]

export default function AIPersonaPage() {
  // Agent Profile States
  const [agentName, setAgentName] = useState('ONE Agent - Ung Phát Tài')
  const [agentPrompt, setAgentPrompt] = useState(
    'Hãy đóng vai một chuyên gia tư vấn chiến lược Marketing & UX/UI Designer. Luôn trả lời ngắn gọn, đi thẳng vào vấn đề. Ưu tiên các giải pháp sáng tạo nhưng vẫn đảm bảo tính khả thi về mặt kỹ thuật và ngân sách. Sử dụng văn phong chuyên nghiệp nhưng cởi mở.'
  )

  // Model & Knowledge Base States
  const [selectedModel, setSelectedModel] = useState('m1')
  const [knowledgeFiles, setKnowledgeFiles] = useState(INITIAL_KNOWLEDGE_FILES)
  const [isDragOver, setIsDragOver] = useState(false)

  // Action States
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const fileInputRef = useRef(null)

  // Tối ưu Tóm tắt Kiến thức bằng AI Magic
  const handleOptimizePrompt = () => {
    if (!agentPrompt.trim()) return
    setIsOptimizing(true)

    setTimeout(() => {
      const optimized = `[CHUYÊN GIA TƯ VẤN CAO CẤP]: ${agentPrompt.trim()}\n\nNâng cấp quy chuẩn: Đảm bảo độ chính xác 100% dựa trên dữ liệu RAG đính kèm, định dạng câu trả lời cấu trúc rõ ràng, sử dụng bullet points ngắn gọn.`
      setAgentPrompt(optimized)
      setIsOptimizing(false)
    }, 900)
  }

  // Tải tệp mới lên Knowledge Base
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newFiles = files.map((file) => ({
      id: `f-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    }))

    setKnowledgeFiles((prev) => [...prev, ...newFiles])
  }

  const handleRemoveFile = (fileId) => {
    setKnowledgeFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleSavePersona = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Đã lưu cấu hình Cá nhân hóa Trợ lý AI thành công!')
    }, 1200)
  }

  return (
    <div className="persona-page-container">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept=".pdf,.docx,.txt,.csv"
        style={{ display: 'none' }}
      />

      {/* Watermark Logo Background Chìm */}
      <img src={logoImg} alt="Brand Watermark Logo" className="persona-watermark-bg" />

      <div className="persona-content-wrapper">
        {/* ========================================================================= */}
        {/* HEADER SECTION                                                            */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="persona-header-title">Cá nhân hóa Trợ lý AI</h1>
          <p className="persona-header-subtitle">
            Thiết lập tính cách, kiến thức và mục tiêu riêng để AI hiểu bạn rõ nhất trong mọi cuộc trò chuyện.
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* CARD 1: AGENT PROFILE                                                     */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="persona-card"
        >
          <div className="card-badge-header">
            <div className="icon-badge-box cyan">
              <PsychologyOutlined fontSize="small" />
            </div>
            <h2 className="card-title-text">Agent Profile</h2>
          </div>

          <div className="field-group">
            <label className="field-label">TÊN TRỢ LÝ AI / BIỆT DANH</label>
            <input
              type="text"
              className="field-input-box"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Nhập tên trợ lý AI..."
            />
          </div>

          <div className="field-group">
            <label className="field-label">MỤC TIÊU & MIÊU TẢ NGẮN</label>
            
            {/* Khung nhập văn bản độc lập */}
            <textarea
              className="field-textarea-box"
              value={agentPrompt}
              onChange={(e) => setAgentPrompt(e.target.value)}
              placeholder="Mô tả vai trò, phong cách trả lời và mục tiêu của trợ lý AI..."
            />

            {/* Nút Tối ưu Tóm tắt Kiến thức nằm riêng bên dưới */}
            <div className="textarea-action-row">
              <button
                className="btn-magic-optimize"
                onClick={handleOptimizePrompt}
                disabled={isOptimizing || !agentPrompt.trim()}
              >
                {isOptimizing ? (
                  <CircularProgress size={14} sx={{ color: '#F57F1F' }} />
                ) : (
                  <AutoFixHighOutlined style={{ fontSize: 15 }} />
                )}
                <span>Tối ưu Tóm tắt Kiến thức</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* CARD 2: MODEL & KNOWLEDGE                                                 */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="persona-card"
        >
          <div className="card-badge-header">
            <div className="icon-badge-box orange">
              <StorageOutlined fontSize="small" />
            </div>
            <h2 className="card-title-text">Model & Knowledge</h2>
          </div>

          {/* Model Selector */}
          <div className="field-group">
            <label className="field-label">MÔ HÌNH AI CHỦ ĐẠO</label>
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              size="small"
              sx={{
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 242, 255, 0.4)' },
                fontSize: '13.5px',
                height: '46px',
              }}
            >
              {AI_MODELS.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Knowledge Base Drag & Drop */}
          <div className="field-group">
            <label className="field-label">KNOWLEDGE BASE (TỆP ĐỊNH KÈM)</label>

            <div
              className={`dropzone-container ${isDragOver ? 'is-dragover' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragOver(false)
                if (e.dataTransfer.files) {
                  handleFileUpload({ target: { files: e.dataTransfer.files } })
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropzone-icon-circle">
                <FileUploadOutlined fontSize="small" />
              </div>
              <div className="dropzone-text-main">
                Kéo thả file vào đây hoặc <span className="dropzone-highlight-orange">Chọn tệp</span>
              </div>
              <div className="dropzone-text-sub">Hỗ trợ PDF, DOCX, TXT, CSV (Tối đa 50MB/file)</div>
            </div>

            {/* Attached File Badges */}
            <div className="attached-files-row">
              <AnimatePresence>
                {knowledgeFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="file-tag-badge"
                  >
                    <DescriptionOutlined className="file-tag-icon" />
                    <span>{file.name}</span>
                    <button
                      className="btn-remove-file"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile(file.id)
                      }}
                    >
                      <CloseOutlined style={{ fontSize: 14 }} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* SAVE BUTTON BAR                                                           */}
        {/* ========================================================================= */}
        <div className="persona-save-bar">
          <Button
            className="btn-save-persona"
            startIcon={
              isSaving ? (
                <CircularProgress size={16} sx={{ color: '#000' }} />
              ) : (
                <SaveOutlined />
              )
            }
            onClick={handleSavePersona}
            disabled={isSaving}
          >
            {isSaving ? 'Đang lưu cấu hình...' : 'Lưu cấu hình Cá nhân hóa'}
          </Button>
        </div>
      </div>
    </div>
  )
}