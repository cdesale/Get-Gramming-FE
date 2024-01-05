import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../assets/RestaurantForm.css";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

export const LogInRegister = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showLoginError, setShowLoginError] = useState(false);
  const [showRegistrationError, setShowRegistrationError] = useState(false);
  const [username, setUsername] = useState("");
  const [emailID, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const toggleForm = () => {
    setShowLogin(!showLogin);
    setShowLoginError(false);
    setShowRegistrationError(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setShowLoginError(true);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log(password, "true");
      console.log(confirmPassword, "confirm");
      setRegisterError(
        "Confirm password does not match with the entered password "
      );
      setShowRegistrationError(true);
      return;
    } else if (!validateUsername(username)) {
      setRegisterError("Username should contain minimum 5 characters");
      setShowRegistrationError(true);
      return;
    } else if (!validatePassword(password)) {
      setRegisterError(
        "Password should contain minimum 8 characters, should have atleast one alphanumeric character, atleast one numeric character and atleast one capital letter"
      );
      setShowRegistrationError(true);
      return;
    }
    setShowRegistrationError(false);
    setRegisterError("");
  };
  const validatePassword = (password) => {
    const minLength = 8;
    const hasAlphanumeric = /[a-zA-Z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasCapitalLetter = /[A-Z]/.test(password);

    return (
      password.length >= minLength &&
      hasAlphanumeric &&
      hasNumeric &&
      hasCapitalLetter
    );
  };

  const validateUsername = (username) => {
    const minLength = 5;
    return username.length >= minLength;
  };

  return (
    <Container
      className="mt-4 px-4 py-3"
      style={{ maxWidth: "400px", borderRadius: "5px", background: "#f8f9fa" }}
    >
      <Card className="custom-border">
        <Card.Body>
          {showLogin ? (
            <>
              <Card.Title>Login</Card.Title>
              {showLoginError && (
                <Alert
                  variant="danger"
                  onClose={() => setShowLoginError(false)}
                  dismissible
                >
                  Invalid credentials. Please try again.
                </Alert>
              )}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="email">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmailId(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) => setEmailId(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Login
                </Button>
                <p className="mt-3 mb-0">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    onClick={toggleForm}
                    className="p-0 mb-1"
                  >
                    Register
                  </Button>
                </p>
              </Form>
            </>
          ) : (
            <>
              <Card.Title>Register</Card.Title>
              {showRegistrationError && (
                <Alert
                  variant="danger"
                  onClose={() => setShowRegistrationError(false)}
                  dismissible
                >
                  {registerError}
                </Alert>
              )}
              <Form onSubmit={handleRegistration}>
                <Form.Group controlId="email">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="username"
                    placeholder="Enter Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="registerEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmailId(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="registerPassword">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Register
                </Button>
                <p className="mt-3 mb-0">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    onClick={toggleForm}
                    className="p-0 mb-1"
                  >
                    Login
                  </Button>
                </p>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
      <p className="mt-2 mb-0">
        <Link to="/restaurants">Skip login/register</Link>
      </p>
      ;
    </Container>
  );
};
