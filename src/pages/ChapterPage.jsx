import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getChapter, getChapterLabel, markKinds } from '../data/chapters'
import { getChapterIcon } from '../data/chapterIcons'
import { getGiftByChapterId } from '../data/gifts'
import {
  getReflectionAnswers,
  isChapterCompleted,
  saveReflectionAnswer,
} from '../utils/storage'
import {
  canEarnQuizReward,
  getPreviousChapter,
  grantQuizAccess,
  hasQuizAccess,
  isChapterUnlocked,
} from '../utils/progress'
import {
  getChapterHook,
  getCoolFact,
  getFunMarks,
  getWordLoot,
} from '../utils/chapterDisplay'
import { checkQuizGate, getQuizGate } from '../utils/quizGates'
import BalanceBadge from '../components/BalanceBadge'
import GiftClaimCard from '../components/GiftClaimCard'
import YourMoveCard from '../components/YourMoveCard'
import { ParentOnly, useParentMode } from '../components/ParentMode'

export default function ChapterPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const parentMode = useParentMode()
  const chapter = getChapter(id)
  const [reflectionAnswers, setReflectionAnswers] = useState(() =>
    getReflectionAnswers(),
  )
  const [gateInput, setGateInput] = useState('')
  const [gateError, setGateError] = useState(null)
  const [quizReady, setQuizReady] = useState(() => hasQuizAccess(id))

  if (!chapter) {
    return (
      <div className="page">
        <p>Глава не найдена.</p>
        <Link to="/">← К оглавлению</Link>
      </div>
    )
  }

  const unlocked = isChapterUnlocked(chapter.id) || parentMode
  const completed = isChapterCompleted(chapter.id)
  const canEarn = canEarnQuizReward(chapter.id)
  const isFinale = Boolean(chapter.isFinale)
  const previous = getPreviousChapter(chapter.id)
  const gate = getQuizGate(chapter.id)
  const chapterGift = getGiftByChapterId(chapter.id)
  const hook = getChapterHook(chapter)
  const coolFact = getCoolFact(chapter)
  const wordLoot = getWordLoot(chapter)
  const funMarks = getFunMarks(chapter)
  const icon = getChapterIcon(chapter)

  if (!unlocked) {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <Link className="back-link" to="/">
              ← Оглавление
            </Link>
            <h1>Глава пока закрыта</h1>
          </div>
          <BalanceBadge />
        </header>
        <section className="panel">
          <p>
            Сначала прочитай и пройди тест:{' '}
            <strong>
              {previous ? `${getChapterLabel(previous)}. ${previous.title}` : 'предыдущую главу'}
            </strong>
          </p>
          {previous && (
            <Link className="primary-button" to={`/chapter/${previous.id}`}>
              Перейти к предыдущей главе
            </Link>
          )}
        </section>
      </div>
    )
  }

  function handleReflectionChange(index, value) {
    saveReflectionAnswer(index, value)
    setReflectionAnswers(getReflectionAnswers())
  }

  function openQuiz() {
    grantQuizAccess(chapter.id)
    setQuizReady(true)
    navigate(`/chapter/${chapter.id}/quiz`)
  }

  function handleUnlockQuiz(event) {
    event.preventDefault()
    setGateError(null)
    if (!checkQuizGate(chapter.id, gateInput)) {
      setGateError('Не тот код. Найди в книге метку 🔑 и слово рядом с ней.')
      return
    }
    openQuiz()
  }

  function handleParentUnlock() {
    setGateError(null)
    openQuiz()
  }

  return (
    <div className="page chapter-page">
      <header className="page-header">
        <div>
          <Link className="back-link" to="/">
            ← Оглавление
          </Link>
          <p className="eyebrow">
            <span className="chapter-emoji" aria-hidden="true">
              {icon}
            </span>{' '}
            {getChapterLabel(chapter)}
          </p>
          <h1>{chapter.title}</h1>
        </div>
        <BalanceBadge />
      </header>

      {completed && (
        <section className="panel panel--muted">
          <p>
            <strong>Уровень пройден.</strong> Монеты за эту главу уже начислены.
          </p>
        </section>
      )}

      {chapter.previousChapterSummary && (
        <details className="panel panel--muted recap-details">
          <summary>Что было раньше</summary>
          <p>{chapter.previousChapterSummary}</p>
        </details>
      )}

      {hook && (
        <section className="panel chapter-hook">
          <p className="chapter-hook__text">{hook}</p>
        </section>
      )}

      {coolFact && (
        <section className="panel">
          <h2>Крутой факт</h2>
          <p>{coolFact}</p>
        </section>
      )}

      {wordLoot.length > 0 && (
        <section className="panel">
          <h2>Слова-лут</h2>
          <p className="hint">Крутые обороты из главы — можно отметить в книге.</p>
          <dl className="vocab-list">
            {wordLoot.map((item) => (
              <div className="vocab-item" key={item.word}>
                <dt>{item.word}</dt>
                <dd>{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {funMarks.length > 0 && (
        <section className="panel">
          <h2>Где искать приколы</h2>
          <ul className="fact-list">
            {funMarks.map((item) => (
              <li key={item.text}>
                {item.kind === 'funny' ? '😄' : '💡'} {item.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {chapterGift && (
        <section className="panel">
          <h2>Секретный подарок</h2>
          <p className="hint">
            В этой главе спрятана метка {chapterGift.mark}. Найди её в книге.
          </p>
          <GiftClaimCard gift={chapterGift} compact />
        </section>
      )}

      {!completed && gate && (
        <section className="panel quest-gate-panel">
          {quizReady ? (
            <>
              <h2>Код принят!</h2>
              <p className="hint">Можно запускать уровень.</p>
              <Link className="primary-button" to={`/chapter/${chapter.id}/quiz`}>
                {isFinale ? 'Итоговый тест' : 'В бой — к тесту!'}
              </Link>
            </>
          ) : (
            <>
              <h2>Код сокровища 🔑</h2>
              <p className="hint">
                Открой книгу → найди метку <strong>🔑</strong> в этой главе → введи слово
                рядом. Это твой лут за чтение!
              </p>
              <form className="gate-form" onSubmit={handleUnlockQuiz}>
                <input
                  type="text"
                  value={gateInput}
                  onChange={(event) => setGateInput(event.target.value)}
                  placeholder="Секретный код из книги"
                  autoComplete="off"
                />
                <button type="submit" className="primary-button">
                  Открыть тест
                </button>
              </form>
              {gateError && <p className="gate-error">{gateError}</p>}
              <ParentOnly>
                <button
                  type="button"
                  className="secondary-button parent-unlock-btn"
                  onClick={handleParentUnlock}
                >
                  Открыть тест без кода (родитель)
                </button>
              </ParentOnly>
            </>
          )}
        </section>
      )}

      <YourMoveCard chapter={chapter} />

      {isFinale && chapter.reflectionQuestions?.length > 0 && (
        <ParentOnly>
          <section className="panel reflection-panel">
            <h2>Для родителя: обсудить вслух</h2>
            <p className="hint">Можно спросить после книги — без оценки «правильно/нет».</p>
            <div className="reflection-list">
              {chapter.reflectionQuestions.map((question, index) => (
                <label className="reflection-item" key={question}>
                  <span className="reflection-item__q">
                    {index + 1}. {question}
                  </span>
                  <textarea
                    rows={3}
                    value={reflectionAnswers[index] ?? ''}
                    onChange={(event) =>
                      handleReflectionChange(index, event.target.value)
                    }
                    placeholder="Заметки родителя (по желанию)…"
                  />
                </label>
              ))}
            </div>
          </section>
        </ParentOnly>
      )}

      {(chapter.markInBook?.length > 0 || chapter.vocabulary?.length > 0) && (
        <ParentOnly>
          <details className="panel parent-panel">
            <summary>Для родителя: что отметить маркером</summary>
            <div className="mark-groups">
              {chapter.vocabulary?.length > 0 && (
                <div>
                  <h3>Словосочетания</h3>
                  <ul className="highlight-list">
                    {chapter.vocabulary.map((item) => (
                      <li key={item.word}>
                        <strong>«{item.word}»</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {['funny', 'thought'].map((kind) => {
                const items = (chapter.markInBook ?? []).filter(
                  (item) => item.kind === kind,
                )
                if (items.length === 0) return null
                return (
                  <div key={kind}>
                    <h3>{markKinds[kind]}</h3>
                    <ul className="highlight-list">
                      {items.map((item) => (
                        <li key={item.text}>{item.text}</li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </details>
        </ParentOnly>
      )}

      {chapterGift && (
        <ParentOnly>
          <details className="panel parent-panel">
            <summary>Для родителя: подарок {chapterGift.mark}</summary>
            <p>
              {chapterGift.parentWhere}
              <br />
              Код: <strong>«{chapterGift.secret}»</strong>
              <br />
              Идея подарка: {chapterGift.rewardIdea}
            </p>
          </details>
        </ParentOnly>
      )}

      {gate && !completed && (
        <ParentOnly>
          <details className="panel parent-panel">
            <summary>Для родителя: код 🔑</summary>
            <p>
              Поставь в книге метку <strong>🔑</strong>: {gate.where}.
              <br />
              Кодовое слово:{' '}
              <strong>«{gate.secret}»</strong>
            </p>
          </details>
        </ParentOnly>
      )}

      {completed && (
        <p className="hint locked-hint">Повторно пройти тест за монеты нельзя.</p>
      )}

      {!canEarn && !completed && (
        <p className="hint">Сначала нужно открыть эту главу по порядку.</p>
      )}
    </div>
  )
}
