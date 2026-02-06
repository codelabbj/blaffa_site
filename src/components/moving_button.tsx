import { useState, useEffect } from 'react';

export default function MovingDownloadButton() {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [direction, setDirection] = useState({ x: 1, y: 1 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [downloadApkLink, setDownloadApkLink] = useState('https://blaffa.net/blaffa.apk');

  // Fetch settings to get dynamic download link
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('https://api.blaffa.net/blaffa/setting/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const settingsData = await response.json();
          const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData;
          if (settings?.download_apk_link) {
            setDownloadApkLink(settings.download_apk_link);
          }
        }
      } catch (error) {
        console.error('Error fetching settings in MovingDownloadButton:', error);
      }
    };

    fetchSettings();
  }, []);

  // Set initial window size and update on resize
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial size
    updateWindowSize();

    // Add event listener
    window.addEventListener('resize', updateWindowSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Button movement logic
  useEffect(() => {
    const moveButton = () => {
      setPosition(prevPos => {
        // Calculate new position
        let newX = prevPos.x + direction.x * 2;
        let newY = prevPos.y + direction.y * 2;

        // Check boundaries and change direction if needed
        const newDirection = { ...direction };

        // Button dimensions (approximate)
        const buttonWidth = 150;
        const buttonHeight = 50;

        if (newX <= 0 || newX >= windowSize.width - buttonWidth) {
          newDirection.x = -direction.x;
        }

        if (newY <= 0 || newY >= windowSize.height - buttonHeight) {
          newDirection.y = -direction.y;
        }

        // Update direction if it changed
        if (newDirection.x !== direction.x || newDirection.y !== direction.y) {
          setDirection(newDirection);
        }

        // Ensure button stays within bounds
        newX = Math.max(0, Math.min(windowSize.width - buttonWidth, newX));
        newY = Math.max(0, Math.min(windowSize.height - buttonHeight, newY));

        return { x: newX, y: newY };
      });
    };

    // Set interval for movement
    const interval = setInterval(moveButton, 50);

    // Cleanup interval
    return () => clearInterval(interval);
  }, [direction, windowSize]);

  const handleClick = () => {
    window.open(downloadApkLink, '_blank');
  };

  return (
    <div
      className="fixed rounded-lg shadow-lg cursor-pointer z-50"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transition: 'top 0.1s linear, left 0.1s linear'
      }}
    >
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 transform hover:scale-105 transition-all"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>Download Mobile</span>
      </button>
    </div>
  );
}