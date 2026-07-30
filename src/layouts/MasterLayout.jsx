import React, { useState, useEffect } from 'react'
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import {
  MenuRounded,
  MoreHoriz,
  ChatBubbleOutlineRounded, // ✅ Icon Chat Message Mới
  CloseOutlined,
} from '@mui/icons-material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import Sidebar from '../components/Sidebar'
import logoImg from '../assets/transperant.png'

export default function MasterLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) // < 900px
  const navigate = useNavigate()
  const location = useLocation()

  // State Toggle Desktop Collapsed & Mobile Drawer
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Tự động đóng Navigation Drawer khi chuyển route
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false)
    }
  }, [location.pathname, isMobile])

  // Hàm phát event tạo chat mới hoặc mở tool panel trên Mobile
  const handleMobileNewChat = () => {
    window.dispatchEvent(new CustomEvent('app-trigger-new-chat'))
    if (location.pathname !== '/') {
      navigate('/')
    }
  }

  const handleMobileToggleTools = () => {
    window.dispatchEvent(new CustomEvent('app-trigger-toggle-tools'))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#070A0D',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. MOBILE / TABLET TOPBAR (CẬP NHẬT ICON CHAT MESSAGE TẠO CHAT MỚI)     */}
      {/* ========================================================================= */}
      {isMobile && (
        <header className="mobile-topbar">
          {/* Nút BÊN TRÁI: Mở Navigation Drawer */}
          <IconButton
            onClick={() => setIsMobileOpen(true)}
            sx={{
              color: '#E2E8F0',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              width: 38,
              height: 38,
            }}
          >
            <MenuRounded fontSize="small" />
          </IconButton>

          {/* Cụm Nút BÊN PHẢI: [Nút ... Mở Công Cụ] và [Nút Chat Message Tạo Chat Mới] */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Nút Ba Chấm (...) Mở Tool/Library Panel */}
            <IconButton
              onClick={handleMobileToggleTools}
              sx={{
                color: '#94A3B8',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                width: 38,
                height: 38,
                '&:hover': { color: '#00F2FF', background: 'rgba(0,242,255,0.1)' },
              }}
            >
              <MoreHoriz fontSize="small" />
            </IconButton>

            {/* Nút HÌNH CHAT MESSAGE (Thay thế dấu cộng +) để Tạo Chat Mới */}
            <motion.div whileTap={{ scale: 0.92 }}>
              <IconButton
                onClick={handleMobileNewChat}
                sx={{
                  color: '#000000',
                  background: '#00F2FF',
                  borderRadius: '10px',
                  width: 38,
                  height: 38,
                  boxShadow: '0 0 16px rgba(0, 242, 255, 0.4)',
                  '&:hover': { background: '#33F5FF' },
                }}
              >
                <ChatBubbleOutlineRounded fontSize="small" />
              </IconButton>
            </motion.div>
          </Box>
        </header>
      )}

      {/* ========================================================================= */}
      {/* 2. SIDEBAR NAVIGATION SYSTEM                                              */}
      {/* ========================================================================= */}
      {!isMobile ? (
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      ) : (
        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mobile-drawer-backdrop"
                onClick={() => setIsMobileOpen(false)}
              />

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                style={{ position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 130 }}
              >
                <Sidebar
                  isMobileDrawer={true}
                  onCloseMobileDrawer={() => setIsMobileOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE CANVAS                                                  */}
      {/* ========================================================================= */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#070A0D',
          position: 'relative',
          paddingTop: isMobile ? '60px' : 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}