import { getToken } from "../lib/authenticate";
import { Container, Nav, Navbar, Form, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { useState } from "react";
import { searchHistoryAtom } from "../store";
import NavDropdown from "react-bootstrap/NavDropdown";
import Router from "next/router";
import { removeToken } from "../lib/authenticate";
import Link from "next/link";

export default function MainNav() {
  let token = getToken();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      q: "",
    },
  });
  const router = useRouter();
  const [isExpanded, setExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  function submitForm(data) {
    setExpanded(false);
    router.push("/artwork?title=true&q=" + data.q);
    setSearchHistory((current) => [...current, "title=true&q=" + data.q]);
  }

  function logout() {
    setExpanded(false);
    removeToken();
    router.push("/login");
  }

  return (
    <>
      <Navbar
        className="fixed-top"
        bg="dark"
        variant="dark"
        expand="lg"
        expanded={isExpanded}
      >
        <Container>
          <Navbar.Brand>Jacob Downarowicz</Navbar.Brand>
          <Navbar.Toggle
            onClick={() => setExpanded(!isExpanded)}
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              <Nav.Link
                active={router.pathname === "/"}
                onClick={() => {
                  Router.push("/");
                  setExpanded(false);
                }}
              >
                Home
              </Nav.Link>
              {!!token && (
                <Nav.Link
                  active={router.pathname === "/search"}
                  onClick={() => {
                    Router.push("/search");
                    setExpanded(false);
                  }}
                >
                  Advanced Search
                </Nav.Link>
              )}
            </Nav>
            &nbsp;
            {!!token && (
              <Form className="d-flex" onSubmit={handleSubmit(submitForm)}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  name="q"
                  {...register("q", { required: true })}
                  required
                />
                <Button variant="outline-success" type="submit">
                  Search
                </Button>
              </Form>
            )}
            &nbsp;
            {!token && (
              <div>
                <Link href="/register" passHref>
                  <Nav.Link
                    onClick={() => setExpanded(false)}
                    active={router.pathname === "/register"}
                  >
                    Register
                  </Nav.Link>
                </Link>
                <Link href="/login" passHref>
                  <Nav.Link
                    onClick={() => setExpanded(false)}
                    active={router.pathname === "/login"}
                  >
                    Login
                  </Nav.Link>
                </Link>
              </div>
            )}
            &nbsp;
            {!!token && (
              <Nav>
                <NavDropdown
                  title="User Name"
                  id="basic-nav-dropdown"
                  active={
                    router.pathname === "/favourites" ||
                    router.pathname === "/history"
                  }
                >
                  <Nav.Link
                    active={router.pathname === "/favourites"}
                    onClick={() => {
                      Router.push("/favourites");
                      setExpanded(false);
                    }}
                  >
                    <NavDropdown.Item>Favorites</NavDropdown.Item>
                  </Nav.Link>
                  <Nav.Link
                    active={router.pathname === "/history"}
                    onClick={() => {
                      Router.push("/history");
                      setExpanded(false);
                    }}
                  >
                    <NavDropdown.Item>Search History</NavDropdown.Item>
                  </Nav.Link>

                  <Nav.Link
                    active={router.pathname === "/login"}
                    onClick={() => {
                      logout();
                    }}
                  >
                    <NavDropdown.Item>Logout</NavDropdown.Item>
                  </Nav.Link>
                </NavDropdown>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}
