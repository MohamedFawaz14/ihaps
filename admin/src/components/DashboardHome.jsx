import React from "react";
import PropertyCarousel from "./PropertyCarousel";
import Gallery from "./Gallery";
import NavBar from "./NavBar";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 ">
      <NavBar />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 ml-0 md:ml-80 mt-10">
        <PropertyCarousel />
        <Gallery />
      </main>
    </div>
  );
}