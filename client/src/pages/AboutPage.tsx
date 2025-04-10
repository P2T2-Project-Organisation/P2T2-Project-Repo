import vusalImage from '../assets/vusal.png';
import phoebeImage from '../assets/phoebe.png';
import chrisImage from '../assets/chris.png';
import sheikhImage from '../assets/sheikh.png';

const AboutPage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="text-center mb-5">
        <h1 className="display-4">About Us</h1>
        <p className="lead">
          Welcome to MyOpus! Our team is dedicated to providing the best possible experience for art enthusiasts.
        </p>
      </div>

      <section className="mb-5 text-center">
        <h2 className="text-primary">Our Mission</h2>
        <p>
          Our mission is to create a platform that connects art enthusiasts with a diverse range of artworks, 
          fostering appreciation and understanding of art in all its forms.
        </p>
      </section>

      <section className="mb-5 text-center">
        <h2 className="text-primary">Meet the Team</h2>
        <div className="row justify-content-center">
          <div className="col-md-3 text-center">
            <img
              src={vusalImage}
              alt="Vusal Shahverdiyev"
              className="rounded-circle mb-3 img-thumbnail"
            />
            <h5>Vusal Shahverdiyev</h5>
            <p>Project Lead with a passion for innovation and team collaboration.</p>
          </div>
          <div className="col-md-3 text-center">
            <img
              src={phoebeImage}
              alt="Phoebe Ferguson"
              className="rounded-circle mb-3 img-thumbnail"
            />
            <h5>Phoebe Ferguson</h5>
            <p>Full-Stack Developer specializing in backend systems and APIs.</p>
          </div>
          <div className="col-md-3 text-center">
            <img
              src={chrisImage}
              alt="Christopher Lin"
              className="rounded-circle mb-3 img-thumbnail"
            />
            <h5>Christopher Lin</h5>
            <p>Full-Stack Developer focused on building intuitive user interfaces.</p>
          </div>
          <div className="col-md-3 text-center">
            <img
              src={sheikhImage}
              alt="Sheikh Iftekhar"
              className="rounded-circle mb-3 img-thumbnail"
            />
            <h5>Sheikh Iftekhar</h5>
            <p>UI/UX Designer dedicated to creating seamless user experiences.</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-primary">Contact Us</h2>
        <p>
          If you have any questions or feedback, feel free to reach out to us at 
          <a href="mailto:info@example.com" className="text-decoration-none"> info@example.com</a>.
        </p>
      </section>
      <footer>
        <div className="text-center mt-5">
          <p>&copy; 2025 MyOpus. All rights reserved.</p>
        </div>
    </footer>  
    </div>
  );
};

export default AboutPage;