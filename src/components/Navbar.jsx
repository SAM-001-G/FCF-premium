import { Link } from 'react-router-dom'

const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/events', 'Events'],
  ['/sermons', 'Sermons'],
  ['/ministries', 'Ministries'],
  ['/testimonies', 'Testimonies'],
  ['/prayer', 'Prayer'],
  ['/gallery', 'Gallery'],
  ['/give', 'Give'],
  ['/visit', 'Plan Your Visit'],
  ['/contact', 'Contact'],
]

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <img src="/logo.png" alt="FCF logo" />
        <span>FCF — Mountain of Possibilities</span>
      </Link>
      <nav>
        {links.map(([href, label]) => (
          <Link key={href} to={href}>{label}</Link>
        ))}
      </nav>
    </header>
  )
}
