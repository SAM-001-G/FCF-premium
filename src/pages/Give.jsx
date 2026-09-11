import PublicLayout from '../components/PublicLayout.jsx'

export default function Give() {
  return (
    <PublicLayout>
      <section className="container">
        <h2 className="section-title">Give</h2>
        <p>Your giving supports the work of FCF — The Mountain of Possibilities.</p>
        <div className="grid grid-2">
          <div className="card">
            <div className="card-body">
              <h3>M-PESA</h3>
              <p><strong>Paybill:</strong> 4063671</p>
              <p><strong>Account:</strong> Tithe / Offering / Sacrifice / Thanksgiving<br />
              <span style={{ fontSize: '0.85rem', color: '#6b7789' }}>(enter whichever applies to your giving)</span></p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3>Bank Transfer</h3>
              <p>Bank details: <em>to be added by admin</em></p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
