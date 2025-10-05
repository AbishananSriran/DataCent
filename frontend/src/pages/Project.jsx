import React from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/Button";

const projects = [
  { title: "AI Chatbot" },
  { title: "Weather App" },
  { title: "Todo List" },
];

export default function Project() {
  return (
    <div>
      <Navbar />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6">Projects</h2>
        <div className="flex flex-col gap-4">
          {projects.map((p, index) => (
            <Button key={index} onClick={() => alert(`Clicked ${p.title}`)}>
              {p.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
