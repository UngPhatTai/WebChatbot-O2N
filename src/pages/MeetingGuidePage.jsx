import React, { useState } from 'react'
import { Button, IconButton } from '@mui/material'
import {
  MicNoneOutlined,
  PsychologyOutlined,
  DescriptionOutlined,
  GetAppOutlined,
  LanguageOutlined,
  ShareOutlined,
  RocketLaunchOutlined,
  CloseOutlined,
  PlayArrowRounded,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

import logoImg from '../assets/transperant.png'
import '../css/MeetingGuidePage.css'

export default function MeetingGuidePage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  const handleDownloadAPK = () => {
    alert('Đang bắt đầu tải xuống gói ứng dụng Android APK (v2.4.1)...')
  }

  return (
    <div className="meeting-page-container">
      {/* WATERMARK BRAND LOGO FLUID BACKGROUND */}
      <img src={logoImg} alt="Watermark Brand Logo" className="watermark-bg-logo" />

      <div className="meeting-content-wrapper">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-section"
        >
          <div className="version-badge">
            <span className="version-dot"></span>
            PHIÊN BẢN MỚI 2.4 ĐÃ CÓ SẴN
          </div>

          <h1 className="hero-title">Trợ lý AI tóm tắt cuộc họp</h1>

          <p className="hero-description">
            Ghi âm, nhận diện giọng nói và tự động tóm tắt mọi quyết định trong cuộc họp của bạn với độ chính xác cao. Giải phóng tư duy sáng tạo, để AI lo phần ghi chép.
          </p>

          <div className="hero-cta-group">
            <Button
              className="btn-cyan-start"
              startIcon={<RocketLaunchOutlined />}
              onClick={() => alert('Bắt đầu dùng thử ghi âm cuộc họp miễn phí!')}
            >
              Bắt đầu miễn phí
            </Button>
            {/* ✅ KÍCH HOẠT MỞ MODAL YOUTUBE DEMO KHI CLICK */}
            <Button
              className="btn-ghost-demo"
              startIcon={<PlayArrowRounded />}
              onClick={() => setIsDemoModalOpen(true)}
            >
              Xem bản demo
            </Button>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 2. WORKFLOW CARDS SECTION                                                 */}
        {/* ========================================================================= */}
        <div className="workflow-section">
          <h2 className="section-heading-cyan">Quy trình thông minh</h2>

          <div className="workflow-cards-grid">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="workflow-card"
            >
              <div>
                <div className="card-icon-wrapper cyan">
                  <MicNoneOutlined fontSize="medium" />
                </div>
                <div className="card-title">Bước 1: Khởi động & Ghi âm</div>
                <div className="card-desc">
                  Chỉ với một lần chạm, hệ thống sẽ bắt đầu lắng nghe và ghi âm cuộc hội thoại nhờ công nghệ lọc nhiễu môi trường tiên tiến, đảm bảo âm thanh trong trẻo nhất.
                </div>
              </div>
              <div className="card-step-number">01 / 03</div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="workflow-card"
            >
              <div>
                <div className="card-icon-wrapper orange">
                  <PsychologyOutlined fontSize="medium" />
                </div>
                <div className="card-title">Bước 2: Xử lý & Phân tích bằng Trí tuệ nhân tạo</div>
                <div className="card-desc">
                  Hệ thống One To Nine sử dụng các mô hình ngôn ngữ lớn (LLM) để nhận diện giọng nói, phân biệt từng người nói và phân loại các ý chính quan trọng.
                </div>
              </div>
              <div className="card-step-number">02 / 03</div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="workflow-card"
            >
              <div>
                <div className="card-icon-wrapper cyan">
                  <DescriptionOutlined fontSize="medium" />
                </div>
                <div className="card-title">Bước 3: Nhận bản Tóm tắt</div>
                <div className="card-desc">
                  Nhận ngay báo cáo chi tiết bao gồm: mục tiêu cuộc họp, danh sách các quyết định, và các công việc cần thực hiện (Action Items) được gửi trực tiếp đến email của bạn.
                </div>
              </div>
              <div className="card-step-number">03 / 03</div>
            </motion.div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DOWNLOAD CLIENT BANNER                                                 */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="download-banner-card"
        >
          <div className="banner-left-info">
            <h3 className="banner-title">Trải nghiệm sức mạnh của AI mọi lúc, mọi nơi</h3>
            <p className="banner-desc">
              Hãy mang theo trợ lý thông minh nhất trong túi của bạn. Phiên bản APK được tối ưu hóa cho Android giúp bạn ghi âm và tóm tắt ngay cả khi không có máy tính.
            </p>

            <div className="banner-stats-row">
              <div>
                <div className="stat-item-number">4,9/5</div>
                <div className="stat-item-label">Đánh giá của người dùng</div>
              </div>
              <div>
                <div className="stat-item-number">&gt; 1000</div>
                <div className="stat-item-label">Sử dụng</div>
              </div>
            </div>
          </div>

          <div className="banner-right-action">
            <Button
              className="btn-apk-download"
              startIcon={<GetAppOutlined fontSize="medium" />}
              onClick={handleDownloadAPK}
            >
              Tải xuống APK (Android)
            </Button>
            <div className="file-meta-info">Phiên bản 2.4.1 (Ổn định) • 42,5 MB</div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 4. FOOTER SECTION                                                         */}
        {/* ========================================================================= */}
        <footer className="meeting-footer">
          <div className="footer-brand">
            <div className="footer-brand-title">One To Nine</div>
            <div className="footer-copyright">© 2026 AI Creative Suite. Mọi quyền được bảo lưu.</div>
          </div>

          <div className="footer-links-group">
            <a href="#privacy" className="footer-link">Chính sách bảo mật</a>
            <a href="#terms" className="footer-link">Điều khoản dịch vụ</a>
            <a href="#changelog" className="footer-link">Nhật ký thay đổi</a>

            <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
              <IconButton className="btn-icon-footer" size="small">
                <LanguageOutlined fontSize="small" />
              </IconButton>
              
            </div>
          </div>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* 5. YOUTUBE DEMO VIDEO LIGHTBOX MODAL                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isDemoModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(4, 7, 10, 0.9)',
              backdropFilter: 'blur(16px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setIsDemoModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              style={{
                width: '100%',
                maxWidth: '880px',
                background: '#0C1218',
                border: '1px solid rgba(0, 242, 255, 0.3)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.9), 0 0 40px rgba(0, 242, 255, 0.2)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(18, 25, 33, 0.8)',
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFF' }}>
                  Xem trước Trợ lý AI Tóm tắt Cuộc họp (Demo)
                </div>
                <IconButton
                  onClick={() => setIsDemoModalOpen(false)}
                  sx={{ color: '#FFF', '&:hover': { color: '#00F2FF' } }}
                >
                  <CloseOutlined fontSize="small" />
                </IconButton>
              </div>

              {/* YouTube Responsive Embed Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%' /* Tỷ lệ khung hình chuẩn 16:9 */,
                  background: '#000',
                }}
              >
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="YouTube video player"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}