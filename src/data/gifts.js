/**
 * Секреты-подарки в книге.
 *
 * Как пометить:
 * 1. Купите 5 маленьких наклеек-звёздочек (или нарисуйте ★1 … ★5 карандашом на полях).
 * 2. Поставьте метку у указанного места (см. parentWhere).
 * 3. Ребёнок ищет звёздочки по ходу чтения, вводит кодовое слово из этой строки — и открывает подарок.
 *
 * Кодовое слово — яркое слово рядом с меткой (сверьте с вашим Махаоном).
 */

export const gifts = [
  {
    id: 'fence-brush',
    mark: '★1',
    title: 'Кисть маляра',
    hint: 'Найди звёздочку там, где Том превращает скучную работу в игру.',
    chapterId: 2,
    chapterTitle: 'Великолепный маляр',
    secret: 'забор',
    parentWhere:
      'Глава 2, сцена побелки забора — на поле у слова «забор».',
    rewardIdea: 'маленький набор для рисования / кисточка + краски',
  },
  {
    id: 'pinch-bug',
    mark: '★2',
    title: 'Жук удачи',
    hint: 'Звёздочка прячется на самой смешной церковной службе.',
    chapterId: 5,
    chapterTitle: 'Жук-кусака и его жертва',
    secret: 'жук',
    parentWhere:
      'Глава 5, сцена с жуком-кусакой в церкви — метка у слова «жук» / «жук-кусака».',
    rewardIdea: 'смешная игрушка-насекомое или наклейки с жуками',
  },
  {
    id: 'pirate-talisman',
    mark: '★3',
    title: 'Пиратский талисман',
    hint: 'Ищи звёздочку там, где шайка поднимает паруса.',
    chapterId: 13,
    chapterTitle: 'Шайка пиратов поднимает паруса',
    secret: 'пират',
    parentWhere:
      'Глава 13, начало пиратского побега — у слова «пират» / «пираты».',
    rewardIdea: 'пиратская повязка на глаз, компас или флаг',
  },
  {
    id: 'cave-light',
    mark: '★4',
    title: 'Пещерный свет',
    hint: 'Звёздочка ждёт в самом тёмном приключении Тома и Бекки.',
    chapterId: 30,
    chapterTitle: 'Том и Бекки в пещере',
    secret: 'пещера',
    parentWhere:
      'Глава 30 — у слова «пещера», когда Том и Бекки оказываются внутри.',
    rewardIdea: 'фонарик / ночник',
  },
  {
    id: 'gold-coin',
    mark: '★5',
    title: 'Золотая монета',
    hint: 'Последняя звёздочка — рядом с настоящим сокровищем.',
    chapterId: 34,
    chapterTitle: 'Золотой поток',
    secret: 'золото',
    parentWhere:
      'Глава 34, находка клада — у слова «золото».',
    rewardIdea: 'шоколадные монеты / копилка / памятная монета',
  },
]

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
