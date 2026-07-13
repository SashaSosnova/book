import { useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { gifts } from '../data/gifts'
import { getBalance, getCollectedGifts } from '../utils/storage'

function subscribe(onStoreChange) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener('tom-sawyer-balance', onStoreChange)
  window.addEventListener('tom-sawyer-gifts', onStoreChange)
  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener('tom-sawyer-balance', onStoreChange)
    window.removeEventListener('tom-sawyer-gifts', onStoreChange)
  }
}

export function notifyBalanceChanged() {
  window.dispatchEvent(new Event('tom-sawyer-balance'))
}

export function notifyGiftsChanged() {
  window.dispatchEvent(new Event('tom-sawyer-gifts'))
}

export default function BalanceBadge() {
  const balance = useSyncExternalStore(subscribe, getBalance, () => 0)
  const collectedCount = useSyncExternalStore(
    subscribe,
    () => getCollectedGifts().length,
    () => 0,
  )

  return (
    <Link className="balance-badge" to="/rewards" aria-label="Открыть награды">
      <span className="balance-badge__label">Счёт</span>
      <strong className="balance-badge__value">{balance} ₽</strong>
      <span className="balance-badge__gifts">
        Подарки {collectedCount}/{gifts.length}
      </span>
    </Link>
  )
}
