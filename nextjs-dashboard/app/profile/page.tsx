export default function Profile() {
  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: '#000',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '24px',
            fontWeight: 'bold',
            marginRight: '20px'
          }}>
            JD
          </div>
          <div>
            <h1>Mohammad Iqbal Jaffar</h1>
            <p style={{ color: '#555', margin: 0 }}>Full Stack Developer</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <h3>Contact Information</h3>
            <p>📧 iqbaljaffar1108@gmail.com</p>
            <p>📱 +62 813 886 70054</p>
            <p>📍 Bandung, Indonesia</p>
          </div>
          
          <div>
            <h3>Skills</h3>
            <p>• React & Next.js</p>
            <p>• TypeScript & JavaScript</p>
            <p>• Node.js & Express</p>
            <p>• PostgreSQL & MongoDB</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2>About Me</h2>
        <p>
          I'm a passionate full-stack developer with over 5 years of experience 
          in building modern web applications. I love working with React, Next.js, 
          and TypeScript to create amazing user experiences.
        </p>
      </div>
      
      <div className="card">
        <h2>Experience</h2>
        <div style={{ marginBottom: '20px' }}>
          <h3>Senior Frontend Developer</h3>
          <p style={{ color: '#555', margin: '5px 0' }}>Tech Company • 2022 - Present</p>
          <p>Leading frontend development team and architecting scalable React applications.</p>
        </div>
        
        <div>
          <h3>Full Stack Developer</h3>
          <p style={{ color: '#555', margin: '5px 0' }}>Startup Inc • 2020 - 2022</p>
          <p>Developed end-to-end web applications using modern JavaScript frameworks.</p>
        </div>
      </div>
    </div>
  )
}