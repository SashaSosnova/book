const BALANCE_KEY = 'tom-sawyer-balance'
const COMPLETED_KEY = 'tom-sawyer-completed'
const REFLECTION_KEY = 'tom-sawyer-reflection'
const PAYOUTS_KEY = 'tom-sawyer-payouts'
const GIFTS_KEY = 'tom-sawyer-gifts'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function getBalance() {
  const value = Number(localStorage.getItem(BALANCE_KEY))
  return Number.isFinite(value) ? value : 0
}

export function setBalance(amount) {
  const next = Math.max(0, Number(amount) || 0)
  localStorage.setItem(BALANCE_KEY, String(next))
  return next
}

export function addToBalance(amount) {
  return setBalance(getBalance() + amount)
}

export function getPayoutHistory() {
  return readJson(PAYOUTS_KEY, [])
}

export function getTotalPaid() {
  return getPayoutHistory().reduce((sum, item) => sum + item.amount, 0)
}

/**
 * Уменьшает счёт на сумму выплаты и пишет запись в историю.
 * @returns {{ ok: true, paid: number, balance: number } | { ok: false, error: string }}
 */
export function payout(amount) {
  const balance = getBalance()
  const paid = Math.floor(Number(amount))

  if (!Number.isFinite(paid) || paid <= 0) {
    return { ok: false, error: 'Введи сумму больше 0' }
  }
  if (paid > balance) {
    return { ok: false, error: 'Нельзя выплатить больше, чем на счёте' }
  }

  const nextBalance = setBalance(balance - paid)
  const history = getPayoutHistory()
  history.unshift({
    id: Date.now(),
    amount: paid,
    date: new Date().toISOString(),
    balanceAfter: nextBalance,
  })
  localStorage.setItem(PAYOUTS_KEY, JSON.stringify(history))

  return { ok: true, paid, balance: nextBalance }
}

export function getCollectedGifts() {
  return readJson(GIFTS_KEY, [])
}

export function isGiftCollected(giftId) {
  return getCollectedGifts().includes(giftId)
}

export function collectGift(giftId) {
  const collected = getCollectedGifts()
  if (collected.includes(giftId)) {
    return { ok: false, error: 'Этот подарок уже собран' }
  }
  collected.push(giftId)
  localStorage.setItem(GIFTS_KEY, JSON.stringify(collected))
  return { ok: true, collected }
}

export function getCompletedChapters() {
  return readJson(COMPLETED_KEY, [])
}

export function isChapterCompleted(chapterId) {
  return getCompletedChapters().includes(Number(chapterId))
}

export function markChapterCompleted(chapterId) {
  const id = Number(chapterId)
  const completed = getCompletedChapters()
  if (!completed.includes(id)) {
    completed.push(id)
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed))
  }
  return completed
}

export function getReflectionAnswers() {
  return readJson(REFLECTION_KEY, {})
}

export function saveReflectionAnswer(index, value) {
  const answers = getReflectionAnswers()
  answers[index] = value
  localStorage.setItem(REFLECTION_KEY, JSON.stringify(answers))
  return answers
}
