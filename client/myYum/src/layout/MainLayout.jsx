// MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <Outlet /> {/* Where nested routes render */}
    </div>
  );
};

export default MainLayout;
