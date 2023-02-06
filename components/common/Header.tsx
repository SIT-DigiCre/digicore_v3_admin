import { Container, Nav, Navbar } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">デジコアAdmin</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#users">ユーザー管理</Nav.Link>
          <Nav.Link href="#serverinfo">サーバー情報</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
