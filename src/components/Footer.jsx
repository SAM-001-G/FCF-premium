import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="brand-line">FCF — THE MOUNTAIN OF POSSIBILITIES</div>
      <div>Where Faith Meets Possibility</div>
      <div style={{ marginTop: 10 }}>
        <a href="https://maps.app.goo.gl/SgSV8Esy7FKuQdni7" target="_blank" rel="noreferrer" style={{ color: 'var(--sky)' }}>
          📍 Find us on Google Maps
        </a>
      </div>
      <div style={{ marginTop: 12, opacity: 0.7 }}>
        &copy; {new Date().getFullYear()} Faith in Christ Fellowship. All rights reserved.
        {' · '}
        <Link to="/admin" style={{ opacity: 0.7 }}>Admin</Link>
      </div>
    </footer>
  )
}
