import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

export default function NavbarOfCampaign() {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand
            onClick={handleNavigateHome}
            style={{ fontSize: '2rem', fontWeight: 550, cursor: 'pointer' }}
          >
            Campaign Portal
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}
