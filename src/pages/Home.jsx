import { Link } from 'react-router-dom'
import { bookMeta, chapters, getChapterLabel } from '../data/chapters'
import { isChapterCompleted } from '../utils/storage'
import { isChapterUnlocked } from '../utils/progress'
import BalanceBadge from '../components/BalanceBadge'
import { useParentMode } from '../components/ParentMode'

export default function Home() {
  const parentMode = useParentMode()

  return (
    <div className="page home-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{bookMeta.author}</p>
          <h1>{bookMeta.title}</h1>
          <p className="subtitle">
            Перевод {bookMeta.translator} · {bookMeta.publisher}
          </p>
        </div>
        <BalanceBadge />
      </header>

      <section className="panel">
        <h2>Оглавление</h2>
        <p className="hint">
          {parentMode
            ? 'Режим родителя: все главы открыты — можно подготовить книгу. Для ребёнка снова будет порядок по тестам.'
            : 'Главы открываются по порядку: прочитал → нашёл ключ 🔑 → прошёл тест → открылась следующая.'}
        </p>
        <ol className="chapter-list">
          {chapters.map((chapter) => {
            const done = isChapterCompleted(chapter.id)
            const unlocked = isChapterUnlocked(chapter.id)

            if (!unlocked) {
              return (
                <li key={chapter.id}>
                  <div className="chapter-link chapter-link--locked" aria-disabled="true">
                    <span className="chapter-link__num">{getChapterLabel(chapter)}</span>
                    <span className="chapter-link__title">{chapter.title}</span>
                    <span className="chapter-link__badge">🔒</span>
                  </div>
                </li>
              )
            }

            return (
              <li key={chapter.id}>
                <Link
                  className={`chapter-link ${done ? 'chapter-link--done' : ''}`}
                  to={`/chapter/${chapter.id}`}
                >
                  <span className="chapter-link__num">{getChapterLabel(chapter)}</span>
                  <span className="chapter-link__title">{chapter.title}</span>
                  {done && <span className="chapter-link__badge">✓</span>}
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
