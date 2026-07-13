import { chapters } from '../data/chapters'
import { isParentMode } from './parentMode'
import { isChapterCompleted } from './storage'

export function getPreviousChapter(chapterId) {
  const id = Number(chapterId)
  const index = chapters.findIndex((chapter) => chapter.id === id)
  if (index <= 0) return null
  return chapters[index - 1]
}

/**
 * Глава 1 всегда открыта; каждая следующая — после теста предыдущей.
 * В режиме родителя все главы открыты (подготовка книги), прогресс ребёнка не меняется.
 */
export function isChapterUnlocked(chapterId) {
  if (isParentMode()) return true
  const previous = getPreviousChapter(chapterId)
  if (!previous) return true
  return isChapterCompleted(previous.id)
}

export function canEarnQuizReward(chapterId) {
  // Родитель готовит книгу — тесты не начисляют монеты и не отмечают главы
  if (isParentMode()) return false
  return isChapterUnlocked(chapterId) && !isChapterCompleted(chapterId)
}

const QUIZ_ACCESS_KEY = 'tom-sawyer-quiz-access'

function readAccessMap() {
  try {
    const raw = sessionStorage.getItem(QUIZ_ACCESS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function hasQuizAccess(chapterId) {
  const map = readAccessMap()
  return Boolean(map[Number(chapterId)])
}

export function grantQuizAccess(chapterId) {
  const map = readAccessMap()
  map[Number(chapterId)] = true
  sessionStorage.setItem(QUIZ_ACCESS_KEY, JSON.stringify(map))
}

export function revokeQuizAccess(chapterId) {
  const map = readAccessMap()
  delete map[Number(chapterId)]
  sessionStorage.setItem(QUIZ_ACCESS_KEY, JSON.stringify(map))
}
