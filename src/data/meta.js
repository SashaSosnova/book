/** Тест провален, если ошибок больше этого числа (3+ ошибок = перечитать главу). */
export const MAX_WRONG_ANSWERS = 2

/** Базовая награда за главу по тиру сложности. */
export const CHAPTER_REWARD = {
  easy: 100, // 3 вопроса
  medium: 120, // 4 вопроса
  hard: 150, // 5+ вопросов или rewardTier: 'hard'
  finale: 250,
}

/** Бонус за 0 ошибок в тесте главы. */
export const PERFECT_BONUS = 15

/**
 * Ступени серии дней подряд (календарные дни с ≥1 успешным тестом).
 * Бонус начисляется один раз за ступень в рамках текущей серии.
 */
export const STREAK_MILESTONES = [
  { days: 3, bonus: 100 },
  { days: 7, bonus: 150 },
  { days: 14, bonus: 200 },
]

/** Разовая награда за прохождение всех глав книги. */
export const BOOK_COMPLETE_BONUS = 500

export const TIER_LABELS = {
  easy: 'обычная',
  medium: 'средняя',
  hard: 'сложная',
  finale: 'финал',
}

export const bookMeta = {
  title: 'Приключения Тома Сойера',
  author: 'Марк Твен',
  translator: 'Корней Чуковский',
  publisher: 'Махаон',
}

export const markKinds = {
  funny: 'Смешное',
  thought: 'Подумать',
}
