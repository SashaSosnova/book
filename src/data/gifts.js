/**
 * Секреты-подарки в книге.
 *
 * Как пометить:
 * 1. Купите 5 маленьких наклеек-звёздочек (или нарисуйте ★1 … ★5 карандашом на полях).
 * 2. Поставьте метку у указанного места (см. parentWhere).
 * 3. Ребёнок ищет звёздочки по ходу чтения, вводит кодовое слово из этой строки — и открывает подарок.
 *
 * Кодовое слово — яркое слово рядом с меткой (сверьте с вашим Махаоном).
 *
 * Финал без звёздочки: после главы 36 (Заключение) вручите диплом «прочитал Тома Сойера».
 */

export const gifts = [
  {
    id: 'pinch-bug',
    mark: '★1',
    title: 'Жук удачи',
    hint: 'Звёздочка прячется на самой смешной церковной службе.',
    chapterId: 5,
    chapterTitle: 'Жук-кусака и его жертва',
    secret: 'жук',
    parentWhere:
      'Глава 5, сцена с жуком-кусакой в церкви — на поле у слова «жук» / «жук-кусака».',
    rewardIdea: 'игрушка-жук',
  },
  {
    id: 'painkiller-pills',
    mark: '★2',
    title: 'Сладкие пилюли',
    hint: 'Ищи звёздочку там, где тётя Полли лечит Тома странным «лекарством».',
    chapterId: 12,
    chapterTitle: 'Кот и «болеутолитель»',
    secret: 'болеутолитель',
    parentWhere:
      'Глава 12, сцена с «болеутолителем» и котом — у слова «болеутолитель».',
    rewardIdea: 'конфеты в виде пилюль',
  },
  {
    id: 'lost-knife',
    mark: '★3',
    title: 'Пиратский ножик',
    hint: 'Звёздочка ждёт рядом с отговоркой «я потерял ножик».',
    chapterId: 16,
    chapterTitle: 'Первые трубки: —«Я потерял ножик»',
    secret: 'ножик',
    parentWhere:
      'Глава 16 — у фразы «я потерял ножик» / у слова «ножик».',
    rewardIdea: 'походный детский ножик',
  },
  {
    id: 'court-hammer',
    mark: '★4',
    title: 'Молоток правды',
    hint: 'Найди звёздочку на суде, где Том спасает невинного.',
    chapterId: 23,
    chapterTitle: 'Спасение Меффа Поттера',
    secret: 'суд',
    parentWhere:
      'Глава 23, сцена суда — на поле у слова «суд».',
    rewardIdea: 'игрушечный молоток судьи',
  },
  {
    id: 'cave-light',
    mark: '★5',
    title: 'Пещерный свет',
    hint: 'Последняя звёздочка — в самом тёмном приключении Тома и Бекки.',
    chapterId: 30,
    chapterTitle: 'Том и Бекки в пещере',
    secret: 'пещера',
    parentWhere:
      'Глава 30 — у слова «пещера», когда Том и Бекки оказываются внутри.',
    rewardIdea: 'ночник',
  },
]

/** Напоминание родителю: приз после всей книги, без звёздочки в тексте. */
export const finaleReward = {
  chapterId: 36,
  chapterTitle: 'Заключение',
  rewardIdea: 'диплом «прочитал Тома Сойера» (вручить после прочтения)',
}

export function normalizeSecret(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replaceAll('ё', 'е')
}

export function checkGiftSecret(gift, value) {
  const answer = normalizeSecret(value)
  const secret = normalizeSecret(gift.secret)
  return answer === secret || answer.includes(secret)
}

export function getGiftById(id) {
  return gifts.find((gift) => gift.id === id) ?? null
}

export function getGiftByChapterId(chapterId) {
  return gifts.find((gift) => gift.chapterId === Number(chapterId)) ?? null
}
