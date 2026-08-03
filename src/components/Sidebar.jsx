import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Tooltip } from '@mui/material'
import {
  ChatBubbleOutlineRounded,
  ImageOutlined,
  VideocamOutlined,
  MicNoneOutlined,
  PeopleOutlineRounded, // ✅ Icon Cộng đồng mới
  SettingsOutlined,
  MenuOpenRounded,
  MenuRounded,
  FolderZipOutlined,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

import logoImg from '../assets/transperant.png'
import defaultAvatar from '../assets/batcat.webp'
import './Sidebar.css'

const mainNavItems = [
  { label: 'Chatbot', path: '/', icon: ChatBubbleOutlineRounded },
  { label: 'Tạo ảnh', path: '/image', icon: ImageOutlined },
  { label: 'Tạo video', path: '/video', icon: VideocamOutlined },
  { label: 'Ghi âm cuộc họp', path: '/guide', icon: MicNoneOutlined },
  { label: 'Kho lưu trữ', path: '/library', icon: FolderZipOutlined },
  { label: 'Cộng đồng', path: '/community', icon: PeopleOutlineRounded }, // ✅ Mục Cộng đồng mới
]

const bottomNavItems = [
  { label: 'Cài đặt', path: '/settings', icon: SettingsOutlined },
]

export default function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (path) => {
    navigate(path)
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer()
    }
  }

  const isPersonaActive = location.pathname === '/persona'

  const renderNavItem = (item) => {
    const Icon = item.icon
    const isActive = location.pathname === item.path

    const buttonContent = (
      <motion.button
        key={item.path}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleNavClick(item.path)}
        className={`nav-item-btn ${isActive ? 'active' : ''}`}
      >
        <span className="nav-item-icon">
          <Icon fontSize="small" />
        </span>
        {(!isCollapsed || isMobileDrawer) && (
          <span className="nav-item-text">{item.label}</span>
        )}
      </motion.button>
    )

    if (isCollapsed && !isMobileDrawer) {
      return (
        <Tooltip key={item.path} title={item.label} placement="right" arrow>
          {buttonContent}
        </Tooltip>
      )
    }

    return buttonContent
  }

  const titleVariants = {
    open: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -15, transition: { duration: 0.15 } },
  }

  return (
    <aside
      className={`sidebar-container ${isCollapsed ? 'collapsed' : ''} ${
        isMobileDrawer ? 'mobile-drawer' : 'desktop-sidebar'
      }`}
    >
      <div>
        <div className="sidebar-brand-header">
          <motion.div
            layoutId="sidebarBrandLogoWrapper"
            className="sidebar-brand"
            onClick={() => handleNavClick('/')}
          >
            <motion.img
              layoutId="sidebarBrandLogoImg"
              src={logoImg}
              alt="ONE TO NINE Logo"
              className="brand-logo-img"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />

            <AnimatePresence>
              {(!isCollapsed || isMobileDrawer) && (
                <motion.span
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={titleVariants}
                  className="brand-title"
                >
                  ONE TO NINE
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {!isMobileDrawer && onToggleCollapse && (
            <Tooltip
              title={isCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}
              placement="right"
              arrow
            >
              <motion.button
                layoutId="sidebarToggleBtn"
                className="btn-toggle-sidebar"
                onClick={onToggleCollapse}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              >
                {isCollapsed ? (
                  <MenuRounded fontSize="small" />
                ) : (
                  <MenuOpenRounded fontSize="small" />
                )}
              </motion.button>
            </Tooltip>
          )}
        </div>

        <nav className="nav-list">{mainNavItems.map(renderNavItem)}</nav>
      </div>

      <div>
        <nav className="nav-list" style={{ marginBottom: '16px' }}>
          {bottomNavItems.map(renderNavItem)}
        </nav>

        {isCollapsed && !isMobileDrawer ? (
          <Tooltip title="Cá nhân hóa Trợ lý AI (Ung Phát Tài)" placement="right" arrow>
            <div
              className={`user-profile-card ${isPersonaActive ? 'active-persona' : ''}`}
              onClick={() => handleNavClick('/persona')}
              style={{ cursor: 'pointer' }}
            >
              <img src={defaultAvatar} alt="Ung Phát Tài" className="user-avatar" />
            </div>
          </Tooltip>
        ) : (
          <div
            className={`user-profile-card ${isPersonaActive ? 'active-persona' : ''}`}
            onClick={() => handleNavClick('/persona')}
            style={{ cursor: 'pointer' }}
          >
            <img src={defaultAvatar} alt="Ung Phát Tài" className="user-avatar" />
            <div className="user-info">
              <div className="user-name">Ung Phát Tài</div>
              <div className="user-plan">Pro Plan</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}