import React, { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';

const SearchBar = ({ handleSearch }) => {
  const [city, setCity] = useState('');

  const handleButtonClick = () => {
    handleSearch(city);
  };

  const handleChange = (e) => {
    const inputCity = e.target.value;
    setCity(inputCity);
    if (inputCity === '') {
      handleSearch('');
    }
  };

  return (
    <Col md={{ span: 6, offset: 3 }}>
      <Form className="mb-3 d-flex">
        <Form.Control
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleChange}
          className="me-2"
        />
        <Button
          variant="primary"
          onClick={handleButtonClick}
          style={{ backgroundColor: '#1982DE', borderRadius: '20px' }}
        >
          Search
        </Button>
      </Form>
    </Col>
  );
};

export default SearchBar;





