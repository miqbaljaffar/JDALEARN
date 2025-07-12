export default function Profile() {
  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ 
            position: 'relative',
            width: '100px', 
            height: '100px',
            marginRight: '30px'
          }}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              background: '#e0e0e0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#555'
            }}>
              MI
            </div>
            <button 
              className="btn"
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                padding: '6px 10px',
                fontSize: '12px',
                borderRadius: '20px'
              }}
            >
              Edit Foto
            </button>
          </div>
          <div>
            <h1 style={{ marginBottom: '10px' }}>Mohammad Iqbal Jaffar</h1>
            <button className="btn">Edit Identitas</button>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div>
            <h3>Informasi Pribadi</h3>
            <div style={{ marginTop: '15px' }}>
              <p><strong>Tanggal Lahir:</strong> 08 November 1998</p>
              <p style={{ margin: '10px 0' }}><strong>Nomor Telepon:</strong> +62 813 886 70054</p>
              <p style={{ margin: '10px 0' }}><strong>Alamat Rumah:</strong> Jl. Raya Bojongsoang No. 123, Kab. Bandung</p>
              <p><strong>Alamat Email:</strong> iqbaljaffar1108@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}