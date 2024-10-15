import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


export default function NavbarOfCampaign() {
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#" style={{fontSize: '2rem', fontWeight: 550}}>Campaign Portal</Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}
