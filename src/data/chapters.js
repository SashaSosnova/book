import { chaptersPart1 } from './chaptersPart1'
import { chaptersPart2 } from './chaptersPart2'
import { chaptersPart3 } from './chaptersPart3'
import { chaptersPart4 } from './chaptersPart4'
import { finalQuiz } from './finalQuiz'

export { REWARD_PER_ANSWER, MAX_WRONG_ANSWERS, bookMeta, markKinds } from './meta'
export { finalQuiz } from './finalQuiz'

export const chapters = [
  ...chaptersPart1,
  ...chaptersPart2,
  ...chaptersPart3,
  ...chaptersPart4,
]

export function getChapter(id) {
  return chapters.find((chapter) => chapter.id === Number(id)) ?? null
}

export function getChapterLabel(chapter) {
  if (chapter.id === 36) return 'Заключение'
  return `Глава ${chapter.id}`
}

export function getQuizQuestions(chapter) {
  if (chapter?.isFinale) return finalQuiz
  return chapter?.questions ?? []
}

export function getQuestionExplanation(question) {
  if (!question) return ''
  const correct = question.options[question.correctIndex]
  if (question.explanation) return question.explanation
  return `Правильный ответ: «${correct}». Перечитай этот момент в главе — так лучше запомнится.`
}
