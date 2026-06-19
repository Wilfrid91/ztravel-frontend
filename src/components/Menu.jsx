import '../menu.css'
export default function Menu({ items, activeId, onSelect }) {
  return (
    <nav>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={`menu-item ${activeId === item.id ? 'active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <div>
              <strong>{item.title}</strong>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  )
}
