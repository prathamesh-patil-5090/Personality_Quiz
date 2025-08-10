import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Question from "./components/Question";
import Results from "./components/Results";
import UserForm from "./components/UserForm";
import DelayedFeature from "./components/DelayedFeature";
import AntiFingerprint from "./components/AntiFingerprint";
import { UserProvider } from "./components/UserContext";

// Constants moved outside component to avoid dependency issues
const questions = [
  {
    question: "What's your favorite color?",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
  },
  {
    question: "What's your ideal vacation?",
    options: ["Beach 🏖️", "Mountains 🏔️", "City 🏙️", "Forest 🌲"],
  },
  {
    question: "What's your favorite season?",
    options: ["Summer ☀️", "Winter ❄️", "Spring 🌸", "Autumn 🍂"],
  },
  {
    question: "What's your ideal pet?",
    options: ["Dog 🐕", "Cat 🐱", "Bird 🐦", "Fish 🐠"],
  },
  {
    question: "What's your favorite time of day?",
    options: ["Morning 🌅", "Afternoon ☀️", "Evening 🌇", "Night 🌙"],
  },
];

const keywords = {
  Fire: "fire",
  Water: "water",
  Earth: "earth",
  Air: "air",
};

const elements = {
  "Red 🔴": "Fire",
  "Blue 🔵": "Water",
  "Green 🟢": "Earth",
  "Yellow 🟡": "Air",
  "Beach 🏖️": "Water",
  "Mountains 🏔️": "Earth",
  "City 🏙️": "Fire",
  "Forest 🌲": "Air",
  "Summer ☀️": "Fire",
  "Winter ❄️": "Water",
  "Spring 🌸": "Air",
  "Autumn 🍂": "Earth",
  "Dog 🐕": "Fire",
  "Cat 🐱": "Earth",
  "Bird 🐦": "Air",
  "Fish 🐠": "Water",
  "Morning 🌅": "Air",
  "Afternoon ☀️": "Fire",
  "Evening 🌇": "Water",
  "Night 🌙": "Earth",
};

// Helper function moved outside component
function determineElement(answers) {
  const counts = {};
  answers.forEach(function (answer) {
    const element = elements[answer];
    counts[element] = (counts[element] || 0) + 1;
  });
  return Object.keys(counts).reduce(function (a, b) {
    return counts[a] > counts[b] ? a : b;
  });
}

function App() {
  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);

  // Handler functions
  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleUserFormSubmit(name) {
    // The name is handled by the UserContext, so this function can be simplified
    console.log(`User submitted name: ${name}`);
  }

  // Fetch artwork from Met Museum API
  async function fetchArtwork(keyword) {
    try {
      // Search for objects related to the keyword
      const searchResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyword}`
      );
      const searchData = await searchResponse.json();
      
      if (searchData.objectIDs && searchData.objectIDs.length > 0) {
        // Get a random object from the search results
        const randomIndex = Math.floor(Math.random() * Math.min(20, searchData.objectIDs.length));
        const objectID = searchData.objectIDs[randomIndex];
        
        // Fetch details for the selected object
        const objectResponse = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
        );
        const objectData = await objectResponse.json();
        
        // Only set artwork if it has a valid image
        if (objectData.primaryImage) {
          setArtwork(objectData);
        } else {
          // Try another object if this one doesn't have an image
          const fallbackIndex = Math.floor(Math.random() * Math.min(10, searchData.objectIDs.length));
          const fallbackID = searchData.objectIDs[fallbackIndex];
          const fallbackResponse = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${fallbackID}`
          );
          const fallbackData = await fallbackResponse.json();
          setArtwork(fallbackData.primaryImage ? fallbackData : null);
        }
      }
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setArtwork(null);
    }
  }

  // useEffect to handle quiz completion
  useEffect(
    function () {
      if (currentQuestionIndex === questions.length) {
        const selectedElement = determineElement(answers);
        setElement(selectedElement);
        fetchArtwork(keywords[selectedElement]);
      }
    },
    [currentQuestionIndex, answers]
  );

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <AntiFingerprint />
          <Header />
          <DelayedFeature />
          <Routes>
            <Route
              path="/"
              element={<UserForm onSubmit={handleUserFormSubmit} />}
            />
            <Route
              path="/quiz"
              element={
                currentQuestionIndex < questions.length ? (
                  <Question
                    question={questions[currentQuestionIndex].question}
                    options={questions[currentQuestionIndex].options}
                    onAnswer={handleAnswer}
                  />
                ) : (
                  <Results element={element} artwork={artwork} />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
