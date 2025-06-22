
import React, { useState } from "react";
import InstitutionSlide from "..//components/institution/Slide"; 
import './styles/Institution.css'

export default function InstitutionPage() {
  const [index, setIndex] = useState(0);

  return (
    <div className="container-Institution-Page">
      <InstitutionSlide index={index} setIndex={setIndex} />
    </div>
  );
}