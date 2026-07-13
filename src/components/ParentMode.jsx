import { useState, useSyncExternalStore } from 'react'
import {
  isParentMode,
  lockParentMode,
  setParentPin,
  subscribeParentMode,
  unlockParentMode,
} from '../utils/parentMode'

export function useParentMode() {
  return useSyncExternalStore(subscribeParentMode, isParentMode, () => false)
}

/** Контент только для родителя — ребёнку не рендерится. */
export function ParentOnly({ children }) {
  const unlocked = useParentMode()
  if (!unlocked) return null
  return children
}

export function ParentModeToggle() {
  const unlocked = useParentMode()
  const [open, setOpen] = useState(false)
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [message, setMessage] = useState(null)

  function handleUnlock(event) {
    event.preventDefault()
    setMessage(null)
    const result = unlockParentMode(pin)
    if (!result.ok) {
      setMessage(result.error)
      return
    }
    setPin('')
    setOpen(false)
  }

  function handleChangePin(event) {
    event.preventDefault()
    setMessage(null)
    const result = setParentPin(newPin)
    if (!result.ok) {
      setMessage(result.error)
      return
    }
    setMessage('PIN обновлён')
    setNewPin('')
  }

  if (unlocked) {
    return (
      <div className="parent-mode-bar parent-mode-bar--on">
        <span>Режим родителя включён</span>
        <button type="button" className="text-button" onClick={() => lockParentMode()}>
          Выйти
        </button>
        <details className="parent-pin-change">
          <summary>Сменить PIN</summary>
          <form onSubmit={handleChangePin}>
            <input
              type="password"
              inputMode="numeric"
              value={newPin}
              onChange={(event) => setNewPin(event.target.value)}
              placeholder="Новый PIN"
              autoComplete="new-password"
            />
            <button type="submit" className="secondary-button">
              Сохранить
            </button>
          </form>
          {message && <p className="hint">{message}</p>}
        </details>
      </div>
    )
  }

  return (
    <div className="parent-mode-bar">
      {!open ? (
        <button
          type="button"
          className="parent-secret-entry"
          onClick={() => setOpen(true)}
          aria-label="Вход для родителя"
          title="Родителям"
        >
          ···
        </button>
      ) : (
        <form className="parent-unlock-form" onSubmit={handleUnlock}>
          <p className="hint">Код родителя</p>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="PIN"
            autoComplete="off"
            autoFocus
          />
          <div className="button-row">
            <button type="submit" className="secondary-button">
              Войти
            </button>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setOpen(false)
                setPin('')
                setMessage(null)
              }}
            >
              Отмена
            </button>
          </div>
          {message && <p className="gate-error">{message}</p>}
        </form>
      )}
    </div>
  )
}
