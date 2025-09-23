import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import image1 from '../assets/Image-1.jpg';
import image2 from '../assets/Image-2.jpg';
import image3 from '../assets/Image-3.jpg';

const slides = [
  {
    image: image1,
    title: "Look Fresh, Anytime",
    text: "Book your favourite barbers and stylists with just a tap, no waiting, no stress."
  },
  {
    image: image2,
    title: "Your Time, Your Glow✨",
    text: "Stay on top of your beauty schedule, with reminders to keep you right on time."
  },
  {
    image: image3,
    title: "Style That Fits You",
    text: "Discover salons and stylists near you, offering the perfect look for every ocassion."
  }
];

const Intro = ({ onEnter }) => {
  const [slide, setSlide] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => setSlide(s => Math.min(s + 1, slides.length - 1)),
    onSwipedRight: () => setSlide(s => Math.max(s - 1, 0)),
    trackMouse: true
  });
  

  return (
    <div {...handlers} className="intro-slider max-w-7xl mx-auto px-4 flex flex-col items-center justify-center h-screen">
      <div className="slider1 max-w-90 flex flex-col justify-center mb-34">
        <img src={slides[slide].image} alt={slides[slide].title} />
        <p className='text-xl sm:text-3xl font-semibold flex justify-center my-5'>{slides[slide].title}</p>
        <p className='mx-auto max-w-85 text-lg text-gray-700 flex justify-center text-center'>{slides[slide].text}</p>
        
        {/* Show buttons only on last slide */}
        {slide === slides.length - 1 && (
          <div style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)' }}>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded"
            onClick={onEnter}
          >
            Enter Bakery
          </button>
            </div>
        )}
      </div>
      {/* Dots navigation */}
      <div className="flex flex-row gap-2 mt-6">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSlide(idx)}
            className={`w-3 h-3 rounded-full ${slide === idx ? 'bg-purple-800' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Intro;