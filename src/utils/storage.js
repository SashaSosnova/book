import { Preferences } from '@capacitor/preferences'

const BALANCE_KEY = 'tom-sawyer-balance'
const COMPLETED_KEY = 'tom-sawyer-completed'
const REFLECTION_KEY = 'tom-sawyer-reflection'
const PAYOUTS_KEY = 'tom-sawyer-payouts'
const GIFTS_KEY = 'tom-sawyer-gifts'
const BACKUP_VERSION = 1

const ALL_KEYS = [
  BALANCE_KEY,
  COMPLETED_KEY,
  REFLECTION_KEY,
  PAYOUTS_KEY,
  GIFTS_KEY,
]

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, value)
}

/** Дублируем в Capacitor Preferences — надёжнее при обновлении APK. */
async function mirrorToNative(key, value) {
  try {
    await Preferences.set({ key, value })
  } catch {
    // Браузер без Capacitor — ок
  }
}

function persist(key, value) {
  writeLocal(key, value)
  void mirrorToNative(key, value)
}

export function getBalance() {
  const value = Number(localStorage.getItem(BALANCE_KEY))
  return Number.isFinite(value) ? value : 0
}

export function setBalance(amount) {
  const next = Math.max(0, Number(amount) || 0)
  persist(BALANCE_KEY, String(next))
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
  persist(PAYOUTS_KEY, JSON.stringify(history))

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
  persist(GIFTS_KEY, JSON.stringify(collected))
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
    persist(COMPLETED_KEY, JSON.stringify(completed))
  }
  return completed
}

export function getReflectionAnswers() {
  return readJson(REFLECTION_KEY, {})
}

export function saveReflectionAnswer(index, value) {
  const answers = getReflectionAnswers()
  answers[index] = value
  persist(REFLECTION_KEY, JSON.stringify(answers))
  return answers
}

export function exportBackup() {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      [BALANCE_KEY]: localStorage.getItem(BALANCE_KEY),
      [COMPLETED_KEY]: localStorage.getItem(COMPLETED_KEY),
      [REFLECTION_KEY]: localStorage.getItem(REFLECTION_KEY),
      [PAYOUTS_KEY]: localStorage.getItem(PAYOUTS_KEY),
      [GIFTS_KEY]: localStorage.getItem(GIFTS_KEY),
    },
  }
}

export function importBackup(backup) {
  if (!backup || typeof backup !== 'object' || !backup.data) {
    return { ok: false, error: 'Неверный файл бэкапа' }
  }

  for (const key of ALL_KEYS) {
    const value = backup.data[key]
    if (value == null) continue
    persist(key, String(value))
  }

  window.dispatchEvent(new Event('tom-sawyer-balance'))
  window.dispatchEvent(new Event('tom-sawyer-gifts'))
  return { ok: true }
}

/**
 * При старте: если localStorage пуст, а в Preferences есть данные — восстанавливаем.
 * Если localStorage есть — копируем в Preferences (на случай первого запуска на устройстве).
 */
export async function hydrateStorage() {
  try {
    for (const key of ALL_KEYS) {
      const localValue = localStorage.getItem(key)
      const native = await Preferences.get({ key })

      if ((localValue == null || localValue === '') && native.value) {
        writeLocal(key, native.value)
      } else if (localValue != null && localValue !== '') {
        await Preferences.set({ key, value: localValue })
      }
    }
  } catch {
    // Web / без плагина
  }

  window.dispatchEvent(new Event('tom-sawyer-balance'))
  window.dispatchEvent(new Event('tom-sawyer-gifts'))
}
