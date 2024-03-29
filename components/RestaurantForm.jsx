import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { storage } from "../config/firebaseConfig";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Error from "./Error";
import "../assets/RestaurantForm.css";
import cities from '../Data/mock_city_DB.json'
import cuisines from '../Data/mocl_cuisine_DB.json'
import { loadGoogleMapsScript, initAutocomplete, getPlaceDetails } from '../utils/mapApi';
import { postRestaurant, getRestaurantsByRestaurantId, patchRestaurant } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../components/UserContext";
import { useLocation } from 'react-router-dom';

export const RestaurantForm = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { postedRestaurantId } = location.state || {};
  const [userId, setUserId] = useState(user.userId);
  const defaultFormData = {
    city: "",
    cuisine: "",
    name: "",
    description: "",
    address: "",
    photosUrl: [],
    longitude: 0,
    latitude: 0,
    userId: userId,
    votes: 0,
    createAt: new Date().toISOString()
  };
  let navigate = useNavigate();
  const [formData, setFormData] = useState(defaultFormData);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    if (postedRestaurantId) {
      getRestaurantsByRestaurantId(postedRestaurantId)
        .then(response => {
          const { id, ...dataWithoutId } = response.data;
          setFormData({ ...defaultFormData, ...dataWithoutId });
        })
        .catch(error => {
          console.error('Error fetching posted restaurant data:', error);
        });
    }
  }, [postedRestaurantId]);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      initAutocomplete('autocomplete', (autocomplete) => {
        const placeDetails = getPlaceDetails(autocomplete);
        if (placeDetails) {
          setFormData(prevFormData => ({
            ...prevFormData,
            address: placeDetails.address,
            latitude: placeDetails.latitude,
            longitude: placeDetails.longitude,
          }));
        }
      });
    }, 'AIzaSyCseWSb0T4rbAKc_as_DuULSjybA_D3X3U');
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      if (file) {
        setUploadedFileNames(prevFileNames => [...prevFileNames, file.name]);
        handleUpload(file);
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errorMessages = [];
    if (uploading) {
      errorMessages.push("Please wait until the file upload is completed");
    }
    if (!formData.photosUrl) {
      errorMessages.push("File has not been uploaded yet");
    }
    setError(errorMessages);
    if (errorMessages.length === 0) {
      const updatedFormData = { ...formData, userId: userId };
      if (postedRestaurantId) {
        // If restaurant id exists, call patchRestaurant
        const changes = Object.keys(updatedFormData).map(key => ({
          path: `/${key}`,
          value: updatedFormData[key]
        }));
        patchRestaurant(postedRestaurantId, changes, user.token)
          .then(() => {
            alert('Update successful!');
            navigate('/profile');
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        postRestaurant(updatedFormData, user.token)
          .then(() => {
            alert('Submission successful!');
            navigate('/profile');
          })
          .catch(error => {
            console.log(error)
          });
      }
    }
  };

  const handleUpload = (file) => {
    if (!file) {
      console.error("No file to upload");
      return;
    }
    setUploading(true);
    const storageRef = ref(storage, `restaurant_photos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((photoUrl) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            photosUrl: [...prevFormData.photosUrl, photoUrl]
          }));
          console.log("Upload succeeded");
          setUploading(false);
        });
      }
    );
  };

  return (
    <Container>
      <Row className='form-row'>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCity" className="form-group">
              <Form.Label className="form-label">City</Form.Label>
              <Form.Control
                as="select"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              > <option value="">Select a city</option>
                {cities.map((city, index) => (
                  <option key={index}>
                    {city}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formCuisine" className="form-group">
              <Form.Label className="form-label">Cuisine</Form.Label>
              <Form.Control as="select" name="cuisine" value={formData.cuisine} onChange={handleChange} required>
                <option value="">Select a cuisine</option>
                {cuisines.map((cuisine, index) => (
                  <option key={index}>{cuisine}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formName" className="form-group">
              <Form.Label className="form-label">Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescription" className="form-group">
              <Form.Label className="form-label">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label className="form-label">Address</Form.Label>
              <Form.Control
                type="text"
                id="autocomplete"
                name="address"
                value={formData.address}
                onFocus={initAutocomplete}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formAddress" className="form-group">
              <Form.Label className="form-label">Upload restaurant photos:</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={handleChange}
                disabled={uploading}
                required={formData.photosUrl.length === 0}
              />
            </Form.Group>
            <div className="existing-photos">
              {postedRestaurantId && formData.photosUrl.map((url) => (
                <img src={url} style={{ maxWidth: '100px', margin: '5px' }} />
              ))}
            </div>
            {uploading && (
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${uploadProgress}%` }}
                >
                  Uploading... {Math.round(uploadProgress)}%
                </div>
              </div>
            )}
            <div style={{ whiteSpace: 'nowrap', overflow: 'auto', maxWidth: '100%' }}>
              {uploadedFileNames.join(',   ')}
            </div>
            {error.length > 0 && <Error errors={error} />}
            <Button variant="primary" type="submit" className="button" style={{ backgroundColor: '#1982DE', color: 'white', borderRadius: '70px' }} >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
