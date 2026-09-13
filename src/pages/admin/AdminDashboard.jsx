export default function AdminDashboard() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        padding: '40px 24px',
        background: '#f8fafc',
        color: '#111827',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          background: '#ffffff',
          border: '2px solid #2563eb',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '8px 14px',
            borderRadius: '999px',
            background: '#dcfce7',
            color: '#166534',
            fontWeight: '700',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          ADMIN DIAGNOSTIC — ACTIVE
        </div>

        <h1
          style={{
            fontSize: '36px',
            margin: '0 0 12px',
            color: '#111827',
          }}
        >
          FCF Admin Dashboard
        </h1>

        <p
          style={{
            fontSize: '18px',
            margin: '0 0 30px',
            color: '#4b5563',
          }}
        >
          If you can see this screen, the /admin route and React rendering
          are working.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '24px',
              borderRadius: '16px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
            }}
          >
            <div style={{ fontSize: '32px', fontWeight: '800' }}>01</div>
            <div style={{ marginTop: '6px', fontWeight: '600' }}>
              Route Working
            </div>
          </div>

          <div
            style={{
              padding: '24px',
              borderRadius: '16px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
            }}
          >
            <div style={{ fontSize: '32px', fontWeight: '800' }}>02</div>
            <div style={{ marginTop: '6px', fontWeight: '600' }}>
              React Working
            </div>
          </div>

          <div
            style={{
              padding: '24px',
              borderRadius: '16px',
              background: '#faf5ff',
              border: '1px solid #e9d5ff',
            }}
          >
            <div style={{ fontSize: '32px', fontWeight: '800' }}>03</div>
            <div style={{ marginTop: '6px', fontWeight: '600' }}>
              Component Working
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '30px',
            padding: '18px',
            borderRadius: '12px',
            background: '#111827',
            color: '#ffffff',
            fontSize: '14px',
          }}
        >
          <strong>DIAGNOSTIC:</strong> This page contains no Supabase,
          no AuthContext, no AdminLayout, no database queries, and no
          external dependencies.
        </div>
      </div>
    </div>
  )
}