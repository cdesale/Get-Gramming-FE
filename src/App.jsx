import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./header";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./homePage";
import ProfilePage from "./profilePage";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { RestaurantContainer } from "../components/RestaurantContainer";
import { RestaurantForm } from "../components/RestaurantForm";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<RestaurantContainer />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/form" element={<RestaurantForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
