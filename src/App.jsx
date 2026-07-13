import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ChapterPage from './pages/ChapterPage'
import QuizPage from './pages/QuizPage'
import RewardsPage from './pages/RewardsPage'
import { ParentModeToggle } from './components/ParentMode'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/chapter/:id" element={<ChapterPage />} />
          <Route path="/chapter/:id/quiz" element={<QuizPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ParentModeToggle />
      </div>
    </BrowserRouter>
  )
}
