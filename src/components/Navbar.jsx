import { useState, useEffect, useRef } from 'react'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Close menu on Escape
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen])

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <img src="/logo.png" alt="FCF logo" />
        <span>FCF — Mountain of Possibilities</span>
      </Link>
      <nav className="navbar-desktop">
        {links.map(([href, label]) => (
          <Link key={href} to={href}>{label}</Link>
        ))}
      </nav>
      <button
        className="navbar-mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={mobileMenuOpen}
      >
        ☰
      </button>
      {mobileMenuOpen && <div className="navbar-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}
      <nav ref={menuRef} className={`navbar-mobile ${mobileMenuOpen ? 'open' : ''}`}>
        {links.map(([href, label]) => (
          <Link key={href} to={href} onClick={handleLinkClick}>{label}</Link>
        ))}
      </nav>
    </header>
  )
}
