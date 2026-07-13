import { writeFileSync, readFileSync } from 'fs'
import { chaptersPart1 } from '../src/data/chaptersPart1.js'
import { chaptersPart2 } from '../src/data/chaptersPart2.js'
import { chaptersPart3 } from '../src/data/chaptersPart3.js'
import { chaptersPart4 } from '../src/data/chaptersPart4.js'

const extras = {
  1: [
    {
      question: 'Чем Том провинился перед тётей в начале главы?',
      options: [
        'Разбил окно в школе',
        'Съел варенье и спрятался',
        'Убежал на остров',
        'Испортил Библию Сида',
      ],
      correctIndex: 1,
    },
  ],
  4: [
    {
      question: 'Чем Том расплатился за чужие билетики?',
      options: [
        'Деньгами тёти Полли',
        'Оценками в школе',
        'Своими «сокровищами»',
        'Обещанием побелить забор',
      ],
      correctIndex: 2,
    },
  ],
  6: [
    {
      question: 'Чем Том притворяется больным, чтобы не идти в школу?',
      options: [
        'Гангреной на пальце',
        'Слепотой на один глаз',
        'Переломом ноги',
        'Насморком навсегда',
      ],
      correctIndex: 0,
    },
    {
      question: 'Что несёт Гек, когда Том встречается с ним по дороге?',
      options: [
        'Новую Библию',
        'Корзину с яблоками',
        'Живого котёнка',
        'Дохлую кошку',
      ],
      correctIndex: 3,
    },
  ],
  7: [
    {
      question: 'Из‑за чего Бекки обижается на Тома в этой главе?',
      options: [
        'Он опоздал на урок',
        'Он проговорился про Эмми Лоренс',
        'Он спрятал её учебник',
        'Он позвал на помощь Сида',
      ],
      correctIndex: 1,
    },
  ],
  16: [
    {
      question: 'Кто из пиратов курит спокойнее остальных?',
      options: ['Том', 'Джо Харпер', 'Гек', 'Сид'],
      correctIndex: 2,
    },
    {
      question: 'Что делают мальчики, когда им становится дурно?',
      options: [
        'Уходят «искать потерянный ножик»',
        'Зовут тётю Полли',
        'Ложатся спать на виду у всех',
        'Сразу признаются, что заболели',
      ],
      correctIndex: 0,
    },
  ],
  18: [
    {
      question: 'Кому Том в первую очередь рассказывает про «вещий сон»?',
      options: [
        'Учителю в школе',
        'Судье Тэчеру',
        'Только Геку на улице',
        'Тёте Полли и домашним',
      ],
      correctIndex: 3,
    },
    {
      question: 'Кто сильнее всех сомневается в рассказе Тома?',
      options: ['Мэри', 'Сид', 'Тётя Полли', 'Бекки'],
      correctIndex: 1,
    },
  ],
  21: [
    {
      question: 'Что кот срывает с головы учителя на экзамене?',
      options: ['Шляпу судьи', 'Шарф', 'Парик', 'Очки'],
      correctIndex: 2,
    },
  ],
  23: [
    {
      question: 'О чём Том говорит на суде?',
      options: [
        'Что убийца — индеец Джо',
        'Что Мефф сам во всём признался',
        'Что он ничего не видел',
        'Что виноват Гек',
      ],
      correctIndex: 0,
    },
  ],
  25: [
    {
      question: 'Где по приметам мальчики ждут найти клад?',
      options: [
        'В школьной парте',
        'Под особым деревом и в «страшных» местах',
        'В шкафу у тёти Полли',
        'На дне реки средь бела дня',
      ],
      correctIndex: 1,
    },
  ],
  26: [
    {
      question: 'Где мальчики прячутся, когда появляются разбойники?',
      options: [
        'В погребе у вдовы',
        'За забором школы',
        'Наверху в заброшенном доме',
        'В лодке на реке',
      ],
      correctIndex: 2,
    },
    {
      question: 'Что происходит с сундуком с золотом?',
      options: [
        'Его забирают разбойники',
        'Его сразу делят Том и Гек',
        'Его сжигают в печи',
        'Его отдают судье в этой же главе',
      ],
      correctIndex: 0,
    },
  ],
  29: [
    {
      question: 'К кому Гек бежит за помощью, чтобы спасти вдову?',
      options: ['К учителю', 'К старому валлийцу', 'К Сиду', 'К Бену Роджерсу'],
      correctIndex: 1,
    },
    {
      question: 'Что делает Гек, хотя ему очень страшно?',
      options: [
        'Прячется и молчит до утра',
        'Убегает из города навсегда',
        'Просит Тома всё сделать за него',
        'Предупреждает взрослых о злодеях',
      ],
      correctIndex: 3,
    },
  ],
  30: [
    {
      question: 'Чей праздник приводит детей к пещере?',
      options: [
        'Пикник / день рождения Бекки',
        'Свадьба тёти Полли',
        'Похороны Меффа',
        'Экзамен в школе',
      ],
      correctIndex: 0,
    },
    {
      question: 'Чем Том и Бекки освещают путь в пещере?',
      options: ['Фонарём учителя', 'Луной через щели', 'Свечами', 'Костром'],
      correctIndex: 2,
    },
  ],
  31: [
    {
      question: 'Как долго длятся поиски Тома и Бекки?',
      options: [
        'Их находят через час',
        'Никто их не ищет',
        'Несколько тревожных дней',
        'Один короткий вечер',
      ],
      correctIndex: 2,
    },
    {
      question: 'Что чувствуют жители, когда поиски не дают результата?',
      options: ['Радость и смех', 'Отчаяние и страх', 'Скуку по школе', 'Злость на забор'],
      correctIndex: 1,
    },
  ],
  33: [
    {
      question: 'Почему индеец Джо оказался заперт в пещере?',
      options: [
        'Том запер его ключом',
        'Он сам замуровал вход',
        'Его усыпил Мефф',
        'Выход закрыли после спасения детей',
      ],
      correctIndex: 3,
    },
    {
      question: 'Как Том относится к гибели индейца Джо?',
      options: [
        'Ему только весело',
        'Ему жалко, хотя Джо был злодеем',
        'Он совсем забывает о нём',
        'Он радуется награде за поимку',
      ],
      correctIndex: 1,
    },
  ],
  35: [
    {
      question: 'Что особенно тяжело Геку в доме вдовы?',
      options: [
        'Чистая одежда, правила и «правильная» жизнь',
        'Нехватка еды',
        'Слишком много игр',
        'Уроки фехтования',
      ],
      correctIndex: 0,
    },
  ],
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function formatQuestions(questions) {
  const lines = ['    questions: [']
  for (const q of questions) {
    lines.push('      {')
    lines.push(`        question: '${esc(q.question)}',`)
    const opts = q.options.map((o) => `'${esc(o)}'`)
    const joined = opts.join(', ')
    if (joined.length > 70) {
      lines.push('        options: [')
      for (const o of opts) lines.push(`          ${o},`)
      lines.push('        ],')
    } else {
      lines.push(`        options: [${joined}],`)
    }
    lines.push(`        correctIndex: ${q.correctIndex},`)
    lines.push('      },')
  }
  lines.push('    ],')
  return `${lines.join('\n')}\n`
}

function replaceQuestionsInFile(path, chapters) {
  let src = readFileSync(path, 'utf8')
  for (const ch of chapters) {
    if (!extras[ch.id]) continue
    const merged = [...(ch.questions || []), ...extras[ch.id]]
    const idRe = new RegExp(`id: ${ch.id}\\b`)
    const idMatch = idRe.exec(src)
    if (!idMatch) throw new Error(`id not found ${ch.id} in ${path}`)
    const from = idMatch.index
    const qStart = src.indexOf('questions:', from)
    if (qStart < 0 || qStart - from > 8000) throw new Error(`questions not near ${ch.id}`)
    const bracket = src.indexOf('[', qStart)
    let depth = 0
    let end = -1
    for (let i = bracket; i < src.length; i++) {
      if (src[i] === '[') depth++
      else if (src[i] === ']') {
        depth--
        if (depth === 0) {
          end = i + 1
          break
        }
      }
    }
    let replaceEnd = end
    if (src[replaceEnd] === ',') replaceEnd++
    while (src[replaceEnd] === '\r' || src[replaceEnd] === '\n') replaceEnd++
    src = src.slice(0, qStart) + formatQuestions(merged) + src.slice(replaceEnd)
    console.log(`ch ${ch.id}: ${ch.questions?.length || 0} -> ${merged.length}`)
  }
  writeFileSync(path, src)
}

replaceQuestionsInFile('./src/data/chaptersPart1.js', chaptersPart1)
replaceQuestionsInFile('./src/data/chaptersPart2.js', chaptersPart2)
replaceQuestionsInFile('./src/data/chaptersPart3.js', chaptersPart3)
replaceQuestionsInFile('./src/data/chaptersPart4.js', chaptersPart4)
