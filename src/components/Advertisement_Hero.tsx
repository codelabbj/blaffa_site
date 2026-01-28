

import React, { useState, useEffect, useCallback } from 'react';
//import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image'; // Import Next.js Image component
//import { useTranslation } from 'react-i18next';
import api from '../lib/axios';

// Define the type for a single slide object
interface Slide {
  id: string;
  image: string; // Assuming image is a URL string
  content?: string; // content might be optional
  created_at: string;
  enable: boolean;
  // Add any other properties your API returns
}

interface Ad {
  enable: boolean;
 
}


const SlidingHero = ({ baseUrl = 'https://api.blaffa.net' }) => {
  // Use the Slide type for the slides state
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  // Explicitly type the error state
  const [error, setError] = useState<string | null>(null);
  // Type imageLoaded as a record mapping string IDs to boolean
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  //const { t } = useTranslation();

  // Fetch advertisements from API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        // Use fetch instead of axios to avoid sending auth token
        const response = await fetch(`${baseUrl}/blaffa/advertisement`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure data.results is an array and contains objects matching Slide interface
        if (Array.isArray(data.results)) {
          const enabledAds: Slide[] = data.results.filter((ad: Ad) => ad.enable); // Use 'any' temporarily if structure is uncertain, or refine filter type
          setSlides(enabledAds);
          // Save to localStorage for offline/fallback use
          localStorage.setItem('advertisementCache', JSON.stringify(enabledAds));
        } else {
            console.error('API response results is not an array:', data);
            setSlides([]); // Set to empty array if results is not as expected
        }

      } catch (err: unknown) { // Catch error as unknown
        console.error('Error fetching advertisements:', err);
        // Try to load from localStorage cache
        const cachedAds = localStorage.getItem('advertisementCache');
        if (cachedAds) {
          try {
            const parsedAds = JSON.parse(cachedAds) as Slide[];
            setSlides(parsedAds);
            console.log('Loaded advertisements from cache');
          } catch (parseErr) {
            console.error('Failed to parse cached advertisements:', parseErr);
            setSlides([]); // Empty array if no valid cache
          }
        } else {
          setSlides([]); // Empty array if no cache available
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [baseUrl]);

  // Auto-slide functionality
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

 

  const handleImageLoad = useCallback((slideId: string) => { // Explicitly type slideId
    setImageLoaded(prev => ({ ...prev, [slideId]: true }));
  }, []);

  // Handle image error - use Next.js Image onError signature
  const handleImageError = useCallback((slideId: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error(`Failed to load image for slide ${slideId}:`, e);
      // Optionally set a fallback image source here if needed, though Next/Image handles some fallbacks
      // e.currentTarget.src = 'fallback-image-url.jpg'; // Example fallback
      setImageLoaded(prev => ({ ...prev, [slideId]: true })); // Mark as loaded even on error to show fallback/broken image
  }, []);


  if (loading) {
    return (
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null; // Show nothing if no slides available
  }

  return (
    <div className="w-full h-64 md:h-96 lg:h-[500px] overflow-hidden bg-black rounded-2xl shadow-lg">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* Explicitly type the slide parameter */}
        {slides.map((slide: Slide, index: number) => (
          <div
            key={slide.id}
            className="relative flex-shrink-0 w-full h-full"
          >
            {/* Background Image using Next.js Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.content || `Slide ${index + 1}`}
                fill // Use fill to make the image cover the parent div
                className={`object-cover transition-opacity duration-500 ${
                  imageLoaded[slide.id] ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(slide.id)}
                onError={(e) => handleImageError(slide.id, e)} // Use the new error handler
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Define appropriate sizes
                priority={index === 0} // Prioritize loading the first image
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
                  {slide.content}
                </h1>
                {/* <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          {/* <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 z-10" // Added z-10 to ensure arrows are above images
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 z-10" // Added z-10
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button> */}
        </>
      )}

      {/* Dots Indicator */}
      {/* {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10"> 
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )} */}

      {/* Progress Bar */}
      {/* {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10"> 
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-600 transition-all duration-700 ease-in-out"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      )} */}
    </div>
  );
};

export default SlidingHero;
