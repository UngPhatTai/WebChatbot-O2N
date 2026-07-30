import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import MasterLayout from './layouts/MasterLayout'
import ChatbotPage from './pages/ChatbotPage'
import VideoCreatePage from './pages/VideoCreatePage' // Import trang mới
import ImageCreatePage from './pages/ImageCreatePage' 
import MeetingGuidePage from './pages/MeetingGuidePage' // ✅ Import trang mới
import SettingsPage from './pages/SettingsPage' // Import trang mới
import LibraryPage from './pages/LibraryPage' // ✅ Import trang Kho lưu trữ mới

function PageFrame({ title }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '24px',
        fontWeight: 600,
      }}
    >
      {title}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MasterLayout />}>
          <Route path="/" element={<ChatbotPage />} />
          <Route path="/image" element={<ImageCreatePage />} />
          <Route path="/video" element={<VideoCreatePage />} />
          <Route path="/guide" element={<MeetingGuidePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
