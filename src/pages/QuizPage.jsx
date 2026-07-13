import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getChapter,
  getChapterLabel,
  getQuestionExplanation,
  getQuizQuestions,
  MAX_WRONG_ANSWERS,
  REWARD_PER_ANSWER,
} from '../data/chapters'
import {
  addToBalance,
  isChapterCompleted,
  markChapterCompleted,
} from '../utils/storage'
import {
  canEarnQuizReward,
  getPreviousChapter,
  hasQuizAccess,
  isChapterUnlocked,
  revokeQuizAccess,
} from '../utils/progress'
import { notifyBalanceChanged } from '../components/BalanceBadge'
import BalanceBadge from '../components/BalanceBadge'

export default function QuizPage() {
  const { id } = useParams()
  const chapter = getChapter(id)
  const questions = useMemo(
    () => (chapter ? getQuizQuestions(chapter) : []),
    [chapter],
  )
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([]) // boolean per answered question
  const [finished, setFinished] = useState(false)
  const [passed, setPassed] = useState(false)
  const [earned, setEarned] = useState(0)

  const question = questions[current] ?? null
  const isFinale = Boolean(chapter?.isFinale)
  const unlocked = chapter ? isChapterUnlocked(chapter.id) : false
  const completed = chapter ? isChapterCompleted(chapter.id) : false
  const accessGranted = chapter ? hasQuizAccess(chapter.id) : false
  const previous = chapter ? getPreviousChapter(chapter.id) : null
  const answered = selected !== null
  const answeredCorrectly = answered && selected === question?.correctIndex
  const correctCount = results.filter(Boolean).length
  const wrongCount = results.length - correctCount

  if (!chapter || questions.length === 0) {
    return (
      <div className="page">
        <p>Тест не найден.</p>
        <Link to="/">← К оглавлению</Link>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1>Тест закрыт</h1>
            <p className="hint">
              Сначала пройди предыдущую главу
              {previous ? `: ${getChapterLabel(previous)}` : ''}.
            </p>
          </div>
          <BalanceBadge />
        </header>
        <Link className="primary-button" to="/">
          К оглавлению
        </Link>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">{getChapterLabel(chapter)}</p>
            <h1>Тест уже пройден</h1>
          </div>
          <BalanceBadge />
        </header>
        <section className="panel">
          <p>Монеты за эту главу уже были начислены. Повторно заработать здесь нельзя.</p>
        </section>
        <div className="button-row">
          <Link className="primary-button" to="/">
            К оглавлению
          </Link>
          <Link className="secondary-button" to={`/chapter/${chapter.id}`}>
            К главе
          </Link>
        </div>
      </div>
    )
  }

  if (!accessGranted && !finished) {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1>Нужен ключ из книги</h1>
            <p className="hint">Вернись к главе и введи слово рядом с меткой 🔑.</p>
          </div>
          <BalanceBadge />
        </header>
        <Link className="primary-button" to={`/chapter/${chapter.id}`}>
          К главе
        </Link>
      </div>
    )
  }

  function finishWithResults(finalResults) {
    const finalCorrect = finalResults.filter(Boolean).length
    const finalWrong = finalResults.length - finalCorrect
    const didPass = finalWrong <= MAX_WRONG_ANSWERS

    setPassed(didPass)
    setFinished(true)

    if (!didPass) {
      revokeQuizAccess(chapter.id)
      setEarned(0)
      return
    }

    if (!canEarnQuizReward(chapter.id)) {
      setEarned(0)
      return
    }

    markChapterCompleted(chapter.id)
    const totalEarned = finalCorrect * REWARD_PER_ANSWER
    addToBalance(totalEarned)
    notifyBalanceChanged()
    setEarned(totalEarned)
  }

  function handleAnswer(optionIndex) {
    if (selected !== null) return
    setSelected(optionIndex)
  }

  function handleContinue() {
    if (selected === null) return

    const isCorrect = selected === question.correctIndex
    const nextResults = [...results, isCorrect]
    setResults(nextResults)

    const isLast = current >= questions.length - 1
    if (isLast) {
      finishWithResults(nextResults)
      return
    }

    setCurrent((value) => value + 1)
    setSelected(null)
  }

  if (finished) {
    if (!passed) {
      return (
        <div className="page quiz-page">
          <header className="page-header">
            <div>
              <p className="eyebrow">{getChapterLabel(chapter)}</p>
              <h1>Нужно перечитать главу</h1>
            </div>
            <BalanceBadge />
          </header>

          <section className="panel result-panel">
            <p>
              Ошибок: <strong>{wrongCount}</strong> (можно не больше {MAX_WRONG_ANSWERS})
            </p>
            <p>
              Верных ответов:{' '}
              <strong>
                {correctCount} из {questions.length}
              </strong>
            </p>
            <p className="result-earned result-earned--fail">+0 ₽</p>
            <p className="hint">
              Монеты не начислены. Перечитай главу в книге, снова найди ключ 🔑 и попробуй тест ещё раз.
            </p>
          </section>

          <div className="button-row">
            <Link className="primary-button" to={`/chapter/${chapter.id}`}>
              Перечитать главу
            </Link>
            <Link className="secondary-button" to="/">
              К оглавлению
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="page quiz-page">
        <header className="page-header">
          <div>
            <p className="eyebrow">{getChapterLabel(chapter)}</p>
            <h1>{isFinale ? 'Итоговый тест пройден!' : 'Тест пройден!'}</h1>
          </div>
          <BalanceBadge />
        </header>

        <section className="panel result-panel">
          <p>
            Правильных ответов:{' '}
            <strong>
              {correctCount} из {questions.length}
            </strong>
          </p>
          {wrongCount > 0 && (
            <p className="hint">Ошибок: {wrongCount} (это ещё нормально)</p>
          )}
          <p className="result-earned">
            Заработано сейчас: <strong>+{earned} ₽</strong>
          </p>
          <p className="hint">За каждый верный ответ — {REWARD_PER_ANSWER} ₽.</p>
          <p className="hint">Эту главу больше нельзя пройти за монеты.</p>
          {isFinale && (
            <p className="hint">Ты прошёл большой тест по всей книге — отличная работа!</p>
          )}
        </section>

        <div className="button-row">
          <Link className="primary-button" to="/">
            К оглавлению
          </Link>
          <Link className="secondary-button" to={`/chapter/${chapter.id}`}>
            {isFinale ? 'Назад к заключению' : 'К фактам главы'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page quiz-page">
      <header className="page-header">
        <div>
          <Link className="back-link" to={`/chapter/${chapter.id}`}>
            ← Назад
          </Link>
          <p className="eyebrow">
            Вопрос {current + 1} из {questions.length}
          </p>
          <h1>{isFinale ? 'Итоговый тест' : 'Тест'}</h1>
          <p className="hint">Можно ошибиться не больше {MAX_WRONG_ANSWERS} раз.</p>
        </div>
        <BalanceBadge />
      </header>

      <section className="panel">
        <h2 className="question-text">{question.question}</h2>
        <div className="options">
          {question.options.map((option, index) => {
            let className = 'option-button'
            if (answered) {
              if (index === question.correctIndex) className += ' option-button--correct'
              else if (index === selected) className += ' option-button--wrong'
            }

            return (
              <button
                key={option}
                type="button"
                className={className}
                onClick={() => handleAnswer(index)}
                disabled={answered}
              >
                {option}
              </button>
            )
          })}
        </div>

        {answered && (
          <div
            className={`answer-feedback ${
              answeredCorrectly ? 'answer-feedback--ok' : 'answer-feedback--bad'
            }`}
          >
            <p className="answer-feedback__title">
              {answeredCorrectly ? 'Верно!' : 'Неверно'}
            </p>
            {!answeredCorrectly && (
              <p className="answer-feedback__text">
                {getQuestionExplanation(question)}
              </p>
            )}
            {answeredCorrectly && (
              <p className="answer-feedback__text">
                {question.explanation ??
                  `Да: «${question.options[question.correctIndex]}».`}
              </p>
            )}
            <button type="button" className="primary-button" onClick={handleContinue}>
              {current >= questions.length - 1 ? 'Завершить' : 'Дальше'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
