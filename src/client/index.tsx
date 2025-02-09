import React from "react";
//import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import ReactDOMClient from "react-dom/client";

import EventCard from "./components/EventCard";
import App from "./components/App";
import HomePage from "./components/HomePage";
import SubscriptionsPage from "./components/SubscriptionsPage";
import OrdersPage from "./components/OrdersPage";
import EventsPage from "./components/EventsPage";
import ProfilePage from "./components/ProfilePage";
import Login from "./components/Login";

const element = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="home-page" element={<HomePage />} />
      <Route path="subscriptions-page" element={<SubscriptionsPage />} />
      <Route path="orders-page" element={<OrdersPage />} />
      <Route path="events-page" element={<EventsPage />} />
      <Route path="profile-page" element={<ProfilePage />} />
      <Route path="event-card" element={<EventCard />} />
      <Route path="login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const id: any = document.getElementById("app");
const root = ReactDOMClient.createRoot(id);
root.render(element);
