import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  IconButton,
  Switch,
  Select,
  MenuItem,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  EditOutlined,
  CheckCircle,
  CancelOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  LockOutlined,
  LanguageOutlined,
  ShareOutlined,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

import logoImg from '../assets/transperant.png'
import defaultAvatar from '../assets/batcat.webp'
import '../css/SettingsPage.css'

const INITIAL_TRANSACTIONS = [
  { id: 't1', date: '28/10/2026', desc: 'Tạo 4 bức ảnh phong cách điện ảnh', change: '-20 tín chỉ', type: 'minus' },
  { id: 't2', date: '28/10/2026', desc: 'Tóm tắt cuộc họp Marketing', change: '-5 tín chỉ', type: 'minus' },
  { id: 't3', date: '27/10/2026', desc: 'Nạp thêm gói Pro Plan', change: '+1.000 Điểm', type: 'plus' },
  { id: 't4', date: '25/10/2026', desc: 'Xử lý video ngắn bằng trí tuệ nhân tạo (AI)', change: '-50 điểm', type: 'minus' },
  { id: 't5', date: '20/10/2026', desc: 'Thưởng giới thiệu thành viên mới', change: '+100 Điểm', type: 'plus' },
]

export default function SettingsPage() {
  const theme = useTheme()
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md')) // < 900px

  const containerRef = useRef(null)
  const isManualClickRef = useRef(false)
  const manualClickTimerRef = useRef(null)

  const [activeTab, setActiveTab] = useState('profile')

  // User Profile States
  const [avatar, setAvatar] = useState(defaultAvatar)
  const [displayName, setDisplayName] = useState('Ung Phát Tài')
  const [email, setEmail] = useState('phattai.ung@onetone.ai')

  // Security Password States
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  // Preferences
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState('vi')

  // History
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)
  const [showAllHistory, setShowAllHistory] = useState(false)

  const avatarInputRef = useRef(null)

  // ============================================================================
  // SCROLLSPY ALGORITHM
  // ============================================================================
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (isManualClickRef.current) return

      const scrollPosition = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight

      if (scrollPosition + clientHeight >= scrollHeight - 40) {
        setActiveTab('history')
        return
      }

      const sections = [
        { id: 'profile', element: document.getElementById('section-profile') },
        { id: 'preferences', element: document.getElementById('section-preferences') },
        { id: 'plans', element: document.getElementById('section-plans') },
        { id: 'history', element: document.getElementById('section-history') },
      ]

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i]
        if (sec.element && sec.element.offsetTop - 150 <= scrollPosition) {
          setActiveTab(sec.id)
          break
        }
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const handleTabClick = (tabId, elementId) => {
    setActiveTab(tabId)
    isManualClickRef.current = true

    if (manualClickTimerRef.current) clearTimeout(manualClickTimerRef.current)

    const element = document.getElementById(elementId)
    if (element && containerRef.current) {
      const topOffset = element.offsetTop - 130
      containerRef.current.scrollTo({
        top: topOffset,
        behavior: 'smooth',
      })
    }

    manualClickTimerRef.current = setTimeout(() => {
      isManualClickRef.current = false
    }, 800)
  }

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', color: 'transparent' }
    let score = 0
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 1) return { score: 25, text: 'Yếu', color: '#EF4444' }
    if (score <= 3) return { score: 65, text: 'Trung bình', color: '#F59E0B' }
    return { score: 100, text: 'Mạnh', color: '#10B981' }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  const handleSaveProfile = (e) => {
    e.preventDefault()

    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        alert('Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi!')
        return
      }
      if (newPassword !== confirmPassword) {
        alert('Mật khẩu mới và Xác nhận mật khẩu không trùng khớp!')
        return
      }
      if (newPassword.length < 8) {
        alert('Mật khẩu mới phải có ít nhất 8 ký tự!')
        return
      }
    }

    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Cập nhật thông tin hồ sơ và mật khẩu thành công!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 1200)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(URL.createObjectURL(file))
    }
  }

  const tabsConfig = [
    { id: 'profile', label: 'Hồ sơ của tôi', shortLabel: 'Hồ sơ', target: 'section-profile' },
    { id: 'preferences', label: 'Tùy chọn', shortLabel: 'Tùy chọn', target: 'section-preferences' },
    { id: 'plans', label: 'Gói cước & Tín dụng', shortLabel: 'Gói cước', target: 'section-plans' },
    { id: 'history', label: 'Lịch sử giao dịch', shortLabel: 'Lịch sử', target: 'section-history' },
  ]

  return (
    <div className="settings-page-container" ref={containerRef}>
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <img src={logoImg} alt="Brand Watermark Logo" className="settings-watermark-bg" />

      <div className="settings-content-wrapper">
        <div className="settings-header-sticky-wrapper">
          <div className="settings-header-box">
            <h1 className="settings-main-title">Cài đặt & Tài khoản</h1>

            <div className="settings-nav-tabs">
              {tabsConfig.map((t) => {
                const isActive = activeTab === t.id
                return (
                  <button
                    key={t.id}
                    className={`settings-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleTabClick(t.id, t.target)}
                  >
                    {isTabletOrMobile ? t.shortLabel : t.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeSettingTabIndicator"
                        className="active-tab-indicator"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 1. HỒ SƠ & MẬT KHẨU */}
        <motion.div
          id="section-profile"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="settings-card settings-section-scroll"
        >
          <div className="profile-avatar-row">
            <div className="avatar-upload-wrapper" onClick={() => avatarInputRef.current?.click()}>
              <img src={avatar} alt="User Avatar" className="profile-avatar-img" />
              <div className="avatar-edit-badge">
                <EditOutlined style={{ fontSize: 12 }} />
              </div>
            </div>

            <div className="user-id-tag">ID #1902-88-ONE</div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="form-grid-2col">
              <div className="form-group-item">
                <label className="input-label">Tên hiển thị</label>
                <input
                  type="text"
                  className="input-field-box"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-item">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  className="input-field-box"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Đổi Mật Khẩu Nâng Cấp */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#00F2FF', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <LockOutlined fontSize="small" /> Đổi mật khẩu tài khoản
              </div>

              {/* ✅ FORM ĐỔI MẬT KHẨU TÁCH DỌC ĐỘC LẬP TRÊN MOBILE */}
              <div className="form-grid-2col" style={{ marginBottom: 16 }}>
                <div className="form-group-item" style={{ gridColumn: isTabletOrMobile ? 'span 1' : 'span 2' }}>
                  <label className="input-label">Mật khẩu hiện tại</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      className="input-field-box"
                      placeholder="Nhập mật khẩu hiện tại..."
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                    >
                      {showCurrentPass ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
                    </IconButton>
                  </div>
                </div>

                <div className="form-group-item">
                  <label className="input-label">Mật khẩu mới</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      className="input-field-box"
                      placeholder="Nhập mật khẩu mới..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                    >
                      {showNewPass ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
                    </IconButton>
                  </div>

                  {newPassword && (
                    <div className="password-strength-container">
                      <div className="strength-bar-track">
                        <div
                          className="strength-bar-fill"
                          style={{ width: `${passwordStrength.score}%`, backgroundColor: passwordStrength.color }}
                        />
                      </div>
                      <span className="strength-text" style={{ color: passwordStrength.color }}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group-item">
                  <label className="input-label">Xác nhận mật khẩu mới</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      className="input-field-box"
                      placeholder="Nhập lại mật khẩu mới..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                    >
                      {showConfirmPass ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <Button type="submit" className="btn-save-cyan" disabled={isSaving}>
                {isSaving ? <CircularProgress size={20} sx={{ color: '#000' }} /> : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* 2. TÙY CHỌN */}
        <motion.div
          id="section-preferences"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="settings-card settings-section-scroll"
        >
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFF', marginBottom: 20 }}>Tùy chọn hiển thị</div>

          <div className="pref-row-item">
            <div>
              <div className="pref-title">Giao diện (Sáng / Tối)</div>
              <div className="pref-desc">Chuyển đổi giữa chế độ nền tối và chế độ nền sáng</div>
            </div>
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#00F2FF' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00F2FF' }
              }}
            />
          </div>

          <div className="pref-row-item">
            <div>
              <div className="pref-title">Ngôn ngữ</div>
              <div className="pref-desc">Chọn ngôn ngữ hiển thị của ứng dụng</div>
            </div>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              size="small"
              sx={{
                color: '#FFF',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 242, 255, 0.4)' },
                fontSize: '13px',
                minWidth: 130
              }}
            >
              <MenuItem value="vi">Tiếng Việt</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </div>
        </motion.div>

        {/* 3. GÓI CƯỚC */}
        <div id="section-plans" className="settings-section-scroll">
          <div className="pricing-section-header">
            <h2 className="pricing-title">Nâng cao trải nghiệm AI của bạn</h2>
            <div className="pricing-subtitle">Khám phá sức mạnh sáng tạo vô hạn</div>
          </div>

          <div className="pricing-cards-grid">
            <motion.div whileHover={{ y: -6 }} className="pricing-card">
              <div>
                <div className="plan-name">Miễn phí</div>
                <div className="plan-subtitle">Dành cho người mới bắt đầu</div>
                <div className="plan-price-box">0đ <span className="plan-period">/tháng</span></div>

                <div className="plan-features-list">
                  <div className="feature-item-row"><CheckCircle sx={{ color: '#00F2FF', fontSize: 16 }} /> 50 tin nhắn/tháng</div>
                  <div className="feature-item-row"><CheckCircle sx={{ color: '#00F2FF', fontSize: 16 }} /> Chất lượng 720p</div>
                  <div className="feature-item-row" style={{ opacity: 0.5 }}><CancelOutlined sx={{ fontSize: 16 }} /> Không có ưu tiên xử lý</div>
                </div>
              </div>

              <button className="btn-plan-action current" disabled>Gói hiện tại</button>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="pricing-card popular">
              <div className="popular-badge-tag">PHỔ BIẾN NHẤT</div>
              <div>
                <div className="plan-name">Gói Pro Plan</div>
                <div className="plan-subtitle">Sáng tạo nội dung chuyên nghiệp</div>
                <div className="plan-price-box orange">399.000đ <span className="plan-period">/tháng</span></div>

                <div className="plan-features-list">
                  <div className="feature-item-row"><CheckCircle sx={{ color: '#F47D20', fontSize: 16 }} /> 1.000 điểm/tháng</div>
                  <div className="feature-item-row"><CheckCircle sx={{ color: '#F47D20', fontSize: 16 }} /> Chất lượng 4K Ultra HD</div>
                  <div className="feature-item-row"><CheckCircle sx={{ color: '#F47D20', fontSize: 16 }} /> Ưu tiên xử lý bằng GPU</div>
                  <div className="feature-item-row"><CheckCircle sx={{ color: '#F47D20', fontSize: 16 }} /> Thư viện hiệu ứng Pro</div>
                </div>
              </div>

              <button
                className="btn-plan-action upgrade-orange"
                onClick={() => alert('Đang mở cổng thanh toán nâng cấp Pro Plan (399.000đ)...')}
              >
                Nâng cấp lên phiên bản Pro
              </button>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="pricing-card">
              <div>
                <div className="plan-name">Ultra</div>
                <div className="plan-subtitle">Không có giới hạn</div>
                <div className="plan-price-box">999.000đ <span className="plan-period">/tháng</span></div>

                <div className="plan-features-list">
                  <div className="feature-item-row"><CheckCircle sx={{ color: '#00F2FF', fontSize: 16 }} /> Không giới hạn Credits</div>
                  <div className="feature-item-row"><CheckCircle sx={{ color: '#00F2FF', fontSize: 16 }} /> Hỗ trợ VIP 24/7</div>
                  <div className="feature-item-row"><CheckCircle sx={{ color: '#00F2FF', fontSize: 16 }} /> Tích hợp API</div>
                </div>
              </div>

              <button
                className="btn-plan-action contact"
                onClick={() => alert('Liên hệ bộ phận chăm sóc khách hàng Doanh nghiệp VIP!')}
              >
                Liên hệ bộ phận bán hàng
              </button>
            </motion.div>
          </div>
        </div>

        {/* 4. LỊCH SỬ GIAO DỊCH */}
        <div id="section-history" className="table-container-card settings-section-scroll">
          <div style={{ padding: '20px 24px 12px', fontSize: '15px', fontWeight: 700, color: '#FFF' }}>
            Lịch sử giao dịch & Biến động tín dụng
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>NGÀY</th>
                <th>MÔ TẢ</th>
                <th style={{ textAlign: 'right' }}>BIẾN ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {(showAllHistory ? transactions : transactions.slice(0, 4)).map((t) => (
                <tr key={t.id}>
                  <td style={{ color: '#64748B' }}>{t.date}</td>
                  <td style={{ fontWeight: 500 }}>{t.desc}</td>
                  <td style={{ textAlign: 'right' }} className={`table-credit-change ${t.type}`}>
                    {t.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-footer-action">
            <button
              className="btn-view-all-history"
              onClick={() => setShowAllHistory(!showAllHistory)}
            >
              {showAllHistory ? 'Thu gọn lịch sử' : 'Xem toàn bộ lịch sử'}
            </button>
          </div>
        </div>

        {/* 5. FOOTER */}
        <footer className="settings-footer">
          <div className="footer-brand">
            <div className="footer-brand-title">ONE TO NINE</div>
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
    </div>
  )
}