import { useMemo, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { finaleReward, gifts } from '../data/gifts'
import {
  getBalance,
  getCollectedGifts,
  getPayoutHistory,
  getTotalPaid,
  payout,
} from '../utils/storage'
import { notifyBalanceChanged } from '../components/BalanceBadge'
import GiftClaimCard, { isGiftAvailable } from '../components/GiftClaimCard'
import { ParentOnly } from '../components/ParentMode'

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

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function RewardsPage() {
  const balance = useSyncExternalStore(subscribe, getBalance, () => 0)
  const collectedCount = useSyncExternalStore(
    subscribe,
    () => getCollectedGifts().length,
    () => 0,
  )
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState(null)
  const [historyVersion, setHistoryVersion] = useState(0)

  const history = useMemo(() => getPayoutHistory(), [historyVersion, balance])
  const totalPaid = useMemo(() => getTotalPaid(), [historyVersion, balance])

  function refreshAfterPayout(result) {
    notifyBalanceChanged()
    setHistoryVersion((value) => value + 1)
    setAmount('')
    setMessage(`Выплачено ${result.paid} ₽. Осталось ${result.balance} ₽.`)
  }

  function handlePayout(rawAmount) {
    setMessage(null)
    const result = payout(rawAmount)
    if (!result.ok) {
      setMessage(result.error)
      return
    }
    refreshAfterPayout(result)
  }

  function handleSubmit(event) {
    event.preventDefault()
    handlePayout(amount)
  }

  return (
    <div className="page rewards-page">
      <header className="page-header">
        <div>
          <Link className="back-link" to="/">
            ← Оглавление
          </Link>
          <h1>Награды</h1>
          <p className="hint">
            Здесь копится заработок за тесты и секреты-подарки из книги.
          </p>
        </div>
      </header>

      <section className="panel result-panel">
        <p className="eyebrow">Итоговый счёт</p>
        <p className="rewards-balance">{balance} ₽</p>
        <p className="rewards-gifts-summary">
          Собранные подарки: <strong>{collectedCount}/{gifts.length}</strong>
        </p>
        {totalPaid > 0 && (
          <p className="hint">Уже выплачено всего: {totalPaid} ₽</p>
        )}
      </section>

      <section className="panel">
        <h2>Собранные подарки</h2>
        <p className="hint">
          Подарки открываются только в своих главах. Нельзя найти все звёздочки заранее —
          сначала дочитай до нужной главы.
        </p>

        <div className="gift-list">
          {gifts.map((gift) => (
            <GiftClaimCard key={gift.id} gift={gift} />
          ))}
        </div>

        <ParentOnly>
          <details className="parent-panel gift-parent" open>
            <summary>Для родителя: куда клеить ★ и какие подарки готовить</summary>
            <ul className="highlight-list">
              {gifts.map((gift) => (
                <li key={gift.id}>
                  <strong>{gift.mark}</strong> — {gift.parentWhere}
                  <br />
                  Код: «{gift.secret}». Идея подарка: {gift.rewardIdea}
                  <br />
                  Сейчас для ребёнка:{' '}
                  {isGiftAvailable(gift) ? 'доступен' : 'ещё закрыт'}
                </li>
              ))}
              <li>
                <strong>Финал</strong> — глава {finaleReward.chapterId}.{' '}
                {finaleReward.chapterTitle}: без звёздочки в книге.
                <br />
                {finaleReward.rewardIdea}
              </li>
            </ul>
          </details>
        </ParentOnly>
      </section>

      <ParentOnly>
        <section className="panel">
          <h2>Выплатить</h2>
          <p className="hint">
            Когда деньги отданы — спиши сумму со счёта. Можно выплатить всё или только часть.
          </p>

          <form className="payout-form" onSubmit={handleSubmit}>
            <label className="payout-field">
              <span>Сумма, ₽</span>
              <input
                type="number"
                min="1"
                max={balance || undefined}
                step="1"
                inputMode="numeric"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder={balance > 0 ? String(balance) : '0'}
                disabled={balance <= 0}
              />
            </label>

            <div className="button-row">
              <button
                type="submit"
                className="primary-button"
                disabled={balance <= 0}
              >
                Выплатить
              </button>
              <button
                type="button"
                className="secondary-button"
                disabled={balance <= 0}
                onClick={() => handlePayout(balance)}
              >
                Выплатить всё
              </button>
            </div>
          </form>

          {message && <p className="payout-message">{message}</p>}
        </section>

        {history.length > 0 && (
          <section className="panel">
            <h2>История выплат</h2>
            <ul className="payout-history">
              {history.map((item) => (
                <li key={item.id}>
                  <strong>−{item.amount} ₽</strong>
                  <span>{formatDate(item.date)}</span>
                  <span className="hint">осталось {item.balanceAfter} ₽</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </ParentOnly>
    </div>
  )
}
