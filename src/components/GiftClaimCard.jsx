import { useState, useSyncExternalStore } from 'react'
import { checkGiftSecret } from '../data/gifts'
import {
  collectGift,
  getCollectedGifts,
  isGiftCollected,
} from '../utils/storage'
import { isChapterUnlocked } from '../utils/progress'
import { notifyGiftsChanged } from './BalanceBadge'

function subscribe(onStoreChange) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener('tom-sawyer-gifts', onStoreChange)
  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener('tom-sawyer-gifts', onStoreChange)
  }
}

export function isGiftAvailable(gift) {
  return isChapterUnlocked(gift.chapterId)
}

export default function GiftClaimCard({ gift, compact = false }) {
  useSyncExternalStore(subscribe, () => getCollectedGifts().length, () => 0)
  const [secret, setSecret] = useState('')
  const [message, setMessage] = useState(null)

  const collected = isGiftCollected(gift.id)
  const available = isGiftAvailable(gift)

  function handleCollect() {
    setMessage(null)

    if (!available) {
      setMessage('Сначала дочитай до этой главы по порядку.')
      return
    }
    if (!checkGiftSecret(gift, secret)) {
      setMessage(`Не то слово. Посмотри ещё раз в книге рядом с ${gift.mark}.`)
      return
    }

    const result = collectGift(gift.id)
    if (!result.ok) {
      setMessage(result.error)
      return
    }

    notifyGiftsChanged()
    setSecret('')
    setMessage(`Ура! Открыт подарок «${gift.title}». Можно получить: ${gift.rewardIdea}.`)
  }

  if (!available && !collected) {
    return (
      <article className="gift-card gift-card--locked">
        <div className="gift-card__head">
          <span className="gift-card__mark">🔒</span>
          <div>
            <h3>Секретный подарок</h3>
            <p className="hint">Откроется в главе {gift.chapterId}</p>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className={`gift-card ${collected ? 'gift-card--collected' : ''}`}>
      <div className="gift-card__head">
        <span className="gift-card__mark">{gift.mark}</span>
        <div>
          <h3>{gift.title}</h3>
          {!compact && (
            <p className="hint">
              Глава {gift.chapterId}. {gift.chapterTitle}
            </p>
          )}
        </div>
        {collected && <span className="gift-card__badge">✓</span>}
      </div>

      {collected ? (
        <p className="gift-card__reward">Подарок: {gift.rewardIdea}</p>
      ) : (
        <>
          <p>{gift.hint}</p>
          <div className="gift-claim">
            <input
              type="text"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder="Кодовое слово из книги"
              aria-label={`Код для ${gift.title}`}
              autoComplete="off"
            />
            <button type="button" className="secondary-button" onClick={handleCollect}>
              Нашёл!
            </button>
          </div>
        </>
      )}

      {message && <p className="payout-message">{message}</p>}
    </article>
  )
}
