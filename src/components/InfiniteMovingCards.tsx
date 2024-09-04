"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote: "Gnovistar has revolutionized my study routine. The AI features help me organize my research notes and PDFs effortlessly.",
    name: "Sophia Martinez",
    title: "University Student",
  },
  {
    quote: "As a researcher, the ability to handle and annotate complex PDFs with Gnovistar is invaluable. It’s become an essential tool for my work.",
    name: "Liam Thompson",
    title: "Research Scientist",
  },
  {
    quote: "Managing my lecture notes has never been easier. Gnovistar’s features streamline my note-taking process and enhance my productivity.",
    name: "Olivia White",
    title: "Graduate Student",
  },
  {
    quote: "Gnovistar’s advanced PDF handling and AI tools have been a game-changer for my academic projects. It’s incredibly intuitive and efficient.",
    name: "Ethan Harris",
    title: "PhD Candidate",
  },
  {
    quote: "The ease of organizing my notes and the powerful AI features make Gnovistar perfect for my daily academic needs.",
    name: "Emma Clark",
    title: "Undergraduate Student",
  },
];