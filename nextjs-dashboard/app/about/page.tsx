export default function About() {
  return (
    <div>
      <div className="card">
        <h1>About Us</h1>
        <p>
          Welcome to MyApp! We are a passionate team dedicated to creating 
          innovative solutions that make a difference in people's lives.
        </p>
      </div>
      
      <div className="card">
        <h2>Our Mission</h2>
        <p>
          To build exceptional digital experiences that empower businesses 
          and individuals to achieve their goals through cutting-edge technology.
        </p>
      </div>
      
      <div className="card">
        <h2>Our Vision</h2>
        <p>
          To be the leading provider of innovative web solutions that transform 
          how people interact with technology in their daily lives.
        </p>
      </div>
      
      <div className="card">
        <h2>Our Values</h2>
        <ul style={{ paddingLeft: '20px', marginTop: '15px' }}>
          <li>Innovation and creativity in everything we do</li>
          <li>Quality and excellence in our products and services</li>
          <li>Transparency and honesty in all our relationships</li>
          <li>Continuous learning and improvement</li>
        </ul>
      </div>
    </div>
  )
}