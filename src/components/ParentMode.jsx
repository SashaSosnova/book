import { useState, useSyncExternalStore } from 'react'
import {
  isParentMode,
  lockParentMode,
  setParentPin,
  subscribeParentMode,
  unlockParentMode,
} from '../utils/parentMode'
import { exportBackup, importBackup, resetProgress } from '../utils/storage'

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

  function handleExportBackup() {
    const backup = exportBackup()
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tom-sawyer-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setMessage('Бэкап скачан. Сохраните файл в надёжном месте.')
  }

  function handleImportBackup(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const backup = JSON.parse(String(reader.result))
        const result = importBackup(backup)
        setMessage(result.ok ? 'Прогресс восстановлен из бэкапа.' : result.error)
      } catch {
        setMessage('Не удалось прочитать файл бэкапа')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  async function handleResetProgress() {
    const ok = window.confirm(
      'Сбросить весь прогресс? Монеты, пройденные главы, подарки и выплаты обнулятся. PIN родителя сохранится.',
    )
    if (!ok) return
    await resetProgress()
    setMessage('Прогресс сброшен. Можно начинать с чистого листа.')
  }

  if (unlocked) {
    return (
      <div className="parent-mode-bar parent-mode-bar--on">
        <span>Режим родителя: все главы открыты</span>
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
        </details>
        <details className="parent-pin-change">
          <summary>Бэкап и сброс</summary>
          <p className="hint">
            Монеты и главы хранятся на этом устройстве. После тестов можно сбросить прогресс для ребёнка.
          </p>
          <div className="button-row">
            <button type="button" className="secondary-button" onClick={handleExportBackup}>
              Скачать бэкап
            </button>
            <label className="secondary-button" style={{ cursor: 'pointer' }}>
              Восстановить
              <input
                type="file"
                accept="application/json,.json"
                hidden
                onChange={handleImportBackup}
              />
            </label>
            <button type="button" className="secondary-button" onClick={handleResetProgress}>
              Сбросить прогресс
            </button>
          </div>
        </details>
        {message && <p className="hint">{message}</p>}
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
