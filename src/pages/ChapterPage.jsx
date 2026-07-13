import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getChapter, getChapterLabel, markKinds } from '../data/chapters'
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
import { checkQuizGate, getQuizGate } from '../utils/quizGates'
import BalanceBadge from '../components/BalanceBadge'
import GiftClaimCard from '../components/GiftClaimCard'
import { ParentOnly, useParentMode } from '../components/ParentMode'

export default function ChapterPage() {
  const { id } = useParams()
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

  function handleUnlockQuiz(event) {
    event.preventDefault()
    setGateError(null)
    if (!checkQuizGate(chapter.id, gateInput)) {
      setGateError('Не то слово. Найди в книге метку 🔑 и посмотри слово рядом.')
      return
    }
    grantQuizAccess(chapter.id)
    setQuizReady(true)
  }

  return (
    <div className="page chapter-page">
      <header className="page-header">
        <div>
          <Link className="back-link" to="/">
            ← Оглавление
          </Link>
          <p className="eyebrow">{getChapterLabel(chapter)}</p>
          <h1>{chapter.title}</h1>
        </div>
        <BalanceBadge />
      </header>

      {completed && (
        <section className="panel panel--muted">
          <p>
            <strong>Тест уже пройден.</strong> Монеты за эту главу больше не начисляются.
          </p>
        </section>
      )}

      {chapter.previousChapterSummary && (
        <section className="panel panel--muted">
          <h2>Коротко о прошлой главе</h2>
          <p>{chapter.previousChapterSummary}</p>
        </section>
      )}

      <section className="panel">
        <h2>Главная мысль</h2>
        <p>{chapter.mainIdea}</p>
      </section>

      <section className="panel">
        <h2>Интересные факты</h2>
        <ul className="fact-list">
          {chapter.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </section>

      {chapter.vocabulary?.length > 0 && (
        <section className="panel">
          <h2>Слова из главы</h2>
          <p className="hint">Их можно отметить маркером в книге — и запомнить значение.</p>
          <dl className="vocab-list">
            {chapter.vocabulary.map((item) => (
              <div className="vocab-item" key={item.word}>
                <dt>{item.word}</dt>
                <dd>{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {chapterGift && (
        <section className="panel">
          <h2>Секретный подарок этой главы</h2>
          <p className="hint">
            В этой главе спрятана метка {chapterGift.mark}. Найди её в книге и открой подарок.
          </p>
          <GiftClaimCard gift={chapterGift} compact />
        </section>
      )}

      {isFinale && chapter.reflectionQuestions?.length > 0 && (
        <section className="panel reflection-panel">
          <h2>Подумай и ответь</h2>
          <p className="hint">
            Тут нет «правильного» ответа. Напиши своими словами — можно обсудить с мамой или папой.
          </p>
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
                  placeholder="Напиши свой ответ…"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {chapter.markInBook?.length > 0 && (
        <ParentOnly>
          <details className="panel parent-panel" open>
            <summary>Для родителя: что отметить маркером</summary>
            <div className="mark-groups">
              {chapter.vocabulary?.length > 0 && (
                <div>
                  <h3>Слова</h3>
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
                const items = chapter.markInBook.filter((item) => item.kind === kind)
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
          <details className="panel parent-panel" open>
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
          <details className="panel parent-panel" open>
            <summary>Для родителя: ключ к тесту 🔑</summary>
            <p>
              Поставь в книге метку <strong>🔑</strong>: {gate.where}.
              <br />
              Кодовое слово (ребёнку в приложении не показываем):{' '}
              <strong>«{gate.secret}»</strong>
            </p>
          </details>
        </ParentOnly>
      )}

      {completed ? (
        <p className="hint locked-hint">Повторно пройти тест за монеты нельзя.</p>
      ) : quizReady ? (
        <Link className="primary-button" to={`/chapter/${chapter.id}/quiz`}>
          {isFinale ? 'Пройти итоговый тест' : 'Пройти тест'}
        </Link>
      ) : (
        <section className="panel">
          <h2>Открыть тест</h2>
          <p className="hint">
            Найди в книге метку <strong>🔑</strong> и введи слово рядом с ней. Так мы знаем, что глава правда прочитана.
          </p>
          <form className="gate-form" onSubmit={handleUnlockQuiz}>
            <input
              type="text"
              value={gateInput}
              onChange={(event) => setGateInput(event.target.value)}
              placeholder="Ключевое слово из книги"
              autoComplete="off"
            />
            <button type="submit" className="primary-button">
              Открыть тест
            </button>
          </form>
          {gateError && <p className="gate-error">{gateError}</p>}
        </section>
      )}

      {!canEarn && !completed && (
        <p className="hint">Сначала нужно открыть эту главу по порядку.</p>
      )}
    </div>
  )
}
