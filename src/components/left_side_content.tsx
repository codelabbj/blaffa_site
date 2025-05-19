// import {useState, useEffect} from 'react';
// import { Shield, CreditCard, Smartphone } from 'lucide-react';



// export default function LeftSideContent() {
//     const [animationFrames, setAnimationFrames] = useState(0);
//     useEffect(() => {
//         const interval = setInterval(() => {
//           setAnimationFrames(prev => (prev + 1) % 120);
//         }, 50);
//         return () => clearInterval(interval);
//       }, []);

//   return (
  
//     <div className="w-full md:w-1/2 lg:w-5/12">
//      <div className="w-full h-64 md:h-96 relative overflow-hidden bg-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-700/50 shadow-lg">
//        {/* Text Overlay */}
//        <div className="absolute top-0 left-0 w-full p-6 z-10">
//          <h3 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
//            Secure Global Payments
//          </h3>
//          <p className="text-gray-300 mt-2 max-w-xs">
//            Fast, secure transactions across 150+ countries with real-time tracking and zero hidden fees
//          </p>
//        </div>
       
//        {/* Animated Features */}
//        <div className="absolute bottom-4 left-4 right-4 flex justify-between z-10">
//          {[
//            { icon: <Shield className="mb-2 mx-auto text-orange-400" />, text: "Bank-level Security" },
//            { icon: <CreditCard className="mb-2 mx-auto text-orange-400" />, text: "Multiple Payment Methods" },
//            { icon: <Smartphone className="mb-2 mx-auto text-orange-400" />, text: "Mobile Integration" }
//          ].map((feature, i) => (
//            <div 
//              key={i} 
//              className="text-center p-2 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50"
//              style={{
//                transform: `translateY(${Math.sin((animationFrames + i * 40) / 20) * 5}px)`,
//                transition: 'transform 0.2s ease-in-out'
//              }}
//            >
//              {feature.icon}
//              <p className="text-xs md:text-sm text-gray-300">{feature.text}</p>
//            </div>
//          ))}
//        </div>
       
//        <svg 
//          viewBox="0 0 800 500" 
//          xmlns="http://www.w3.org/2000/svg"
//          className="w-full h-full absolute"
//        >
//          {/* Enhanced background gradient */}
//          <defs>
//            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//              <stop offset="0%" stopColor="#1a202c" />
//              <stop offset="50%" stopColor="#111827" />
//              <stop offset="100%" stopColor="#0f172a" />
//            </linearGradient>
//            <radialGradient id="glowGrad" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
//              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.35)" />
//              <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
//            </radialGradient>
//            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
//              <feGaussianBlur stdDeviation="5" result="blur" />
//              <feComposite in="SourceGraphic" in2="blur" operator="over" />
//            </filter>
           
//            {/* Grid pattern */}
//            <pattern id="grid" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform={`rotate(${animationFrames/60})`}>
//              <rect width="40" height="40" fill="none" />
//              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
//            </pattern>
//          </defs>
         
//          {/* Base layers */}
//          <rect width="800" height="500" fill="url(#bgGrad)" />
//          <rect width="800" height="500" fill="url(#glowGrad)" />
//          <rect width="800" height="500" fill="url(#grid)" opacity="0.5" />
         
//          {/* Animated geometric elements */}
//          {[...Array(12)].map((_, i) => {
//            const size = 20 + (i % 3) * 15;
//            const angle = (animationFrames / 30) + (i * Math.PI / 6);
//            const radius = 150 + (i % 4) * 25;
//            const x = 400 + Math.cos(angle) * radius;
//            const y = 250 + Math.sin(angle) * radius * 0.6;
//            const opacity = 0.1 + 0.2 * Math.sin((animationFrames / 30) + i);
           
//            return (
//              <g key={`geo-${i}`} transform={`rotate(${angle * 30}, ${x}, ${y})`}>
//                {i % 3 === 0 ? (
//                  <rect 
//                    x={x - size/2} 
//                    y={y - size/2} 
//                    width={size} 
//                    height={size}
//                    fill="none"
//                    stroke={`rgba(239, 68, 68, ${opacity})`}
//                    strokeWidth="1.5"
//                  />
//                ) : i % 3 === 1 ? (
//                  <circle 
//                    cx={x} 
//                    cy={y} 
//                    r={size/2}
//                    fill="none"
//                    stroke={`rgba(255, 255, 255, ${opacity})`}
//                    strokeWidth="1"
//                  />
//                ) : (
//                  <polygon
//                    points={`${x},${y-size/2} ${x+size/2},${y+size/2} ${x-size/2},${y+size/2}`}
//                    fill="none"
//                    stroke={`rgba(239, 68, 68, ${opacity})`}
//                    strokeWidth="1"
//                  />
//                )}
//              </g>
//            );
//          })}
         
//          {/* Digital world map in the background */}
//          <g opacity="0.2">
//            <path d="M220,200 Q300,180 400,220 T580,250" stroke="rgba(255,255,255,0.3)" fill="none" strokeDasharray="4,4" />
//            <path d="M180,280 Q350,250 500,270 T600,230" stroke="rgba(255,255,255,0.3)" fill="none" strokeDasharray="4,4" />
//            <path d="M250,320 Q350,290 450,310 T550,300" stroke="rgba(255,255,255,0.3)" fill="none" strokeDasharray="4,4" />
           
//            {[...Array(15)].map((_, i) => {
//              const x = 150 + Math.random() * 500;
//              const y = 150 + Math.random() * 200;
//              const size = 2 + Math.random() * 4;
//              const opacity = 0.3 + Math.sin((animationFrames / 20) + i) * 0.3;
             
//              return (
//                <circle key={`node-${i}`} cx={x} cy={y} r={size} fill={`rgba(239, 68, 68, ${opacity})`} />
//              );
//            })}
//          </g>
         
//          {/* Transaction flow lines - enhanced */}
//          {[...Array(12)].map((_, i) => {
//            const progress = ((animationFrames + i * 10) % 120) / 120;
//            const startX = 150 + Math.sin(i * 0.7) * 100;
//            const startY = 350 - i * 15;
//            const controlX1 = 270 + Math.sin(i * 0.4) * 80;
//            const controlY1 = 250 - Math.cos(i * 0.5) * 60;
//            const controlX2 = 530 + Math.cos(i * 0.3) * 80;
//            const controlY2 = 230 + Math.sin(i * 0.6) * 60;
//            const endX = 650 - Math.cos(i * 0.7) * 100;
//            const endY = 150 + i * 15;
           
//            // Calculate the current position along the cubic bezier curve
//            const t = progress;
//            const mt = 1 - t;
//            const currentX = 
//              startX * mt * mt * mt +
//              3 * controlX1 * mt * mt * t +
//              3 * controlX2 * mt * t * t +
//              endX * t * t * t;
//            const currentY = 
//              startY * mt * mt * mt +
//              3 * controlY1 * mt * mt * t +
//              3 * controlY2 * mt * t * t +
//              endY * t * t * t;
           
//            return (
//              <g key={`transaction-${i}`}>
//                <path 
//                  d={`M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
//                  stroke="rgba(255,255,255,0.1)"
//                  strokeWidth={1}
//                  strokeDasharray="4,4"
//                  fill="none"
//                />
               
//                {/* Moving transaction dot with trail effect */}
//                <circle 
//                  cx={currentX}
//                  cy={currentY}
//                  r={3}
//                  fill={i % 3 === 0 ? "#ef4444" : "#ffffff"}
//                  filter="url(#glow)"
//                />
               
//                {/* Transaction pulse */}
//                {progress > 0.1 && progress < 0.9 && (
//                  <circle 
//                    cx={currentX}
//                    cy={currentY}
//                    r={5 + Math.sin(animationFrames/5) * 2}
//                    fill="none"
//                    stroke={i % 3 === 0 ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.3)"}
//                    strokeWidth="1"
//                  />
//                )}
//              </g>
//            );
//          })}
         
//          {/* Digital wallet on the left */}
//          <g transform="translate(150, 230) scale(0.7)">
//            <rect 
//              x="-40" 
//              y="-25" 
//              width="80" 
//              height="50" 
//              rx="5" 
//              fill="#ef4444" 
//              filter="url(#glow)"
//            />
//            <rect 
//              x="-35" 
//              y="-10" 
//              width="70" 
//              height="10" 
//              fill="#111827" 
//            />
//            <rect 
//              x="-25" 
//              y="10" 
//              width="40" 
//              height="5" 
//              fill="#ffffff" 
//              fillOpacity="0.6" 
//            />
           
//            {/* Animated signal waves */}
//            {[...Array(3)].map((_, i) => {
//              const delay = i * 5;
//              const progress = ((animationFrames + delay) % 30) / 30;
//              if (progress < 0.5) {
//                return (
//                  <path 
//                    key={`signal-${i}`}
//                    d={`M 0,0 a ${15 + i * 8},${15 + i * 8} 0 0,1 ${progress * 40},0`}
//                    fill="none"
//                    stroke="rgba(255,255,255,0.6)"
//                    strokeWidth="1.5"
//                    strokeDasharray="3,3"
//                    transform="translate(0, -30)"
//                  />
//                );
//              }
//              return null;
//            })}
//          </g>
         
//          {/* Payment terminal on the right */}
//          <g transform="translate(650, 270) scale(0.7)">
//            <rect 
//              x="-35" 
//              y="-50" 
//              width="70" 
//              height="100" 
//              rx="7" 
//              fill="#374151" 
//              filter="url(#glow)"
//            />
//            <rect 
//              x="-30" 
//              y="-45" 
//              width="60" 
//              height="30" 
//              rx="3" 
//              fill="#111827" 
//            />
//            <rect 
//              x="-20" 
//              y="-5" 
//              width="40" 
//              height="5" 
//              fill="#ffffff" 
//              fillOpacity="0.4" 
//            />
//            <rect 
//              x="-20" 
//              y="5" 
//              width="40" 
//              height="5" 
//              fill="#ffffff" 
//              fillOpacity="0.4" 
//            />
//            <rect 
//              x="-20" 
//              y="15" 
//              width="40" 
//              height="5" 
//              fill="#ffffff" 
//              fillOpacity="0.4" 
//            />
//            <circle 
//              cx="0" 
//              cy="35" 
//              r="10" 
//              fill="#ef4444" 
//              stroke="#ffffff" 
//              strokeWidth="2" 
//              filter="url(#glow)"
//            />
           
//            {/* Activity indicator */}
//            <circle 
//              cx="25" 
//              cy="-40" 
//              r="3" 
//              fill={animationFrames % 40 < 20 ? "#4ade80" : "rgba(74, 222, 128, 0.3)"}
//            />
//          </g>
         
//          {/* Currency symbols with enhanced animation */}
//          {['$', '€', '£', '¥', '₹', '₿'].map((symbol, i) => {
//            const baseAngle = (animationFrames / 40) + (i * Math.PI / 3);
//            const radius = 110 + Math.sin(animationFrames/30 + i) * 10;
//            const x = 400 + Math.cos(baseAngle) * radius;
//            const y = 250 + Math.sin(baseAngle) * radius * 0.7;
//            const opacity = 0.5 + 0.5 * Math.sin((animationFrames / 20) + i);
//            const scale = 0.8 + 0.2 * Math.sin((animationFrames / 15) + i * 2);
           
//            return (
//              <text 
//                key={`currency-${i}`}
//                x={x} 
//                y={y} 
//                fontSize="22"
//                fontWeight="bold"
//                fill={i % 2 === 0 ? `rgba(239, 68, 68, ${opacity})` : `rgba(255, 255, 255, ${opacity * 0.8})`}
//                textAnchor="middle"
//                dominantBaseline="middle"
//                transform={`scale(${scale})`}
//                style={{transformOrigin: `${x}px ${y}px`}}
//                filter="url(#glow)"
//              >
//                {symbol}
//              </text>
//            );
//          })}
         
//          {/* Connected network visualization in the center */}
//          <g transform="translate(400, 250)">
//            <circle 
//              cx="0" 
//              cy="0" 
//              r={30 + Math.sin(animationFrames/10) * 5} 
//              fill="rgba(239, 68, 68, 0.1)" 
//              stroke="rgba(239, 68, 68, 0.5)"
//              strokeWidth="1"
//            />
           
//            {/* Network nodes */}
//            {[...Array(6)].map((_, i) => {
//              const angle = (Math.PI * 2 / 6) * i + (animationFrames / 100);
//              const x = Math.cos(angle) * 30;
//              const y = Math.sin(angle) * 30;
             
//              return (
//                <g key={`node-${i}`}>
//                  <circle 
//                    cx={x} 
//                    cy={y} 
//                    r="4" 
//                    fill={i % 2 === 0 ? "#ef4444" : "#ffffff"}
//                  />
                 
//                  {/* Connecting lines */}
//                  {i < 5 && [...Array(2)].map((_, j) => {
//                    const nextIdx = (i + j + 1) % 6;
//                    const nextAngle = (Math.PI * 2 / 6) * nextIdx + (animationFrames / 100);
//                    const nextX = Math.cos(nextAngle) * 30;
//                    const nextY = Math.sin(nextAngle) * 30;
                   
//                    return (
//                      <line 
//                        key={`connection-${i}-${j}`}
//                        x1={x}
//                        y1={y}
//                        x2={nextX}
//                        y2={nextY}
//                        stroke="rgba(255, 255, 255, 0.3)"
//                        strokeWidth="1"
//                        strokeDasharray="3,3"
//                      />
//                    );
//                  })}
//                </g>
//              );
//            })}
//          </g>
         
//          {/* Animated success indicators */}
//          {[...Array(3)].map((_, i) => {
//            const delay = i * 40;
//            const progress = ((animationFrames + delay) % 120) / 120;
//            const opacity = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
//            const size = 20 + progress * 60;
           
//            return (
//              <circle 
//                key={`pulse-${i}`}
//                cx={400}
//                cy={250}
//                r={size}
//                fill="none"
//                stroke={`rgba(239, 68, 68, ${opacity * 0.3})`}
//                strokeWidth="1.5"
//              />
//            );
//          })}
//        </svg>
//      </div>
     
//      {/* Additional info badges under the animation */}
//      <div className="mt-4 grid grid-cols-3 gap-2">
//        {[
//          { text: "24/7 Support", value: "Available" },
//          { text: "Transaction Fee", value: "0%" },
//          { text: "Processing Time", value: "<1s" }
//        ].map((item, i) => (
//          <div key={i} className="bg-gray-800/50 p-2 rounded-lg text-center border border-gray-700/50">
//            <p className="text-xs text-gray-400">{item.text}</p>
//            <p className="text-sm font-bold text-orange-500">{item.value}</p>
//          </div>
//        ))}
//      </div>
//    </div>

//   );
// }
    





import { useState, useEffect } from 'react';
import { Shield, CreditCard, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';


export default function LeftSideContent() {
  const [animationFrames, setAnimationFrames] = useState(0);
  const { theme } = useTheme();
  const isDarkMode = theme.mode === 'dark'; // Check if theme is dark
  const { t } = useTranslation();

  // Animation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrames(prev => (prev + 1) % 120);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Theme detector
  // (No need for additional effect, theme is provided by useTheme)

  return (
    <div className="w-full md:w-1/2 lg:w-5/12">
      <div className={`w-full h-64 md:h-96 relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gray-800/30 border-gray-700/50' 
          : 'bg-white/90 border-gray-200'
        } rounded-2xl backdrop-blur-sm border shadow-lg transition-colors duration-300`}
      >
        {/* Text Overlay */}
        <div className="absolute top-0 left-0 w-full p-6 z-10">
          <h3 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
            {t("Secure Global Payments")}
          </h3>
          <p className={`mt-2 max-w-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
           {t("Fast, secure transactions with real-time tracking")}
          </p>
        </div>
        
        {/* Animated Features */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between z-10">
          {[
            { icon: <Shield className="mb-2 mx-auto text-orange-500" />, text: t("Bank-level Security") },
            { icon: <CreditCard className="mb-2 mx-auto text-orange-500" />, text: t("Simple Payment") },
            { icon: <Smartphone className="mb-2 mx-auto text-orange-500" />, text: t("Mobile Integration") }
          ].map((feature, i) => (
            <div 
              key={i} 
              className={`text-center p-2 ${
                isDarkMode 
                  ? 'bg-gray-800/60 border-gray-700/50' 
                  : 'bg-white/80 border-gray-200'
                } backdrop-blur-sm rounded-lg border transition-colors duration-300`}
              style={{
                transform: `translateY(${Math.sin((animationFrames + i * 40) / 20) * 5}px)`,
                transition: 'transform 0.2s ease-in-out, background-color 0.3s, border-color 0.3s'
              }}
            >
              {feature.icon}
              <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                {feature.text}
              </p>
            </div>
          ))}
        </div>
        
        <svg 
          viewBox="0 0 800 500" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full absolute"
          aria-hidden="true"
        >
          {/* Enhanced background gradient and patterns with theme-awareness */}
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              {isDarkMode ? (
                <>
                  <stop offset="0%" stopColor="#1a202c" />
                  <stop offset="50%" stopColor="#111827" />
                  <stop offset="100%" stopColor="#0f172a" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="50%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </>
              )}
            </linearGradient>
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
              <stop offset="0%" stopColor={isDarkMode ? "rgba(239, 68, 68, 0.35)" : "rgba(249, 115, 22, 0.25)"} />
              <stop offset="100%" stopColor={isDarkMode ? "rgba(239, 68, 68, 0)" : "rgba(249, 115, 22, 0)"} />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Grid pattern */}
            <pattern id="grid" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform={`rotate(${animationFrames/60})`}>
              <rect width="40" height="40" fill="none" />
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 
                strokeWidth="0.5" 
              />
            </pattern>
          </defs>
          
          {/* Base layers */}
          <rect width="800" height="500" fill="url(#bgGrad)" />
          <rect width="800" height="500" fill="url(#glowGrad)" />
          <rect width="800" height="500" fill="url(#grid)" opacity="0.5" />
          
          {/* Animated geometric elements */}
          {[...Array(12)].map((_, i) => {
            const size = 20 + (i % 3) * 15;
            const angle = (animationFrames / 30) + (i * Math.PI / 6);
            const radius = 150 + (i % 4) * 25;
            const x = 400 + Math.cos(angle) * radius;
            const y = 250 + Math.sin(angle) * radius * 0.6;
            const opacity = 0.1 + 0.2 * Math.sin((animationFrames / 30) + i);
            const themeColor = isDarkMode ? "239, 68, 68" : "249, 115, 22"; // rgb values for red vs orange
            
            return (
              <g key={`geo-${i}`} transform={`rotate(${angle * 30}, ${x}, ${y})`}>
                {i % 3 === 0 ? (
                  <rect 
                    x={x - size/2} 
                    y={y - size/2} 
                    width={size} 
                    height={size}
                    fill="none"
                    stroke={`rgba(${themeColor}, ${opacity})`}
                    strokeWidth="1.5"
                  />
                ) : i % 3 === 1 ? (
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={size/2}
                    fill="none"
                    stroke={isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(15, 23, 42, ${opacity})`}
                    strokeWidth="1"
                  />
                ) : (
                  <polygon
                    points={`${x},${y-size/2} ${x+size/2},${y+size/2} ${x-size/2},${y+size/2}`}
                    fill="none"
                    stroke={`rgba(${themeColor}, ${opacity})`}
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}
          
          {/* Digital world map in the background */}
          <g opacity="0.2">
            <path 
              d="M220,200 Q300,180 400,220 T580,250" 
              stroke={isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.2)"} 
              fill="none" 
              strokeDasharray="4,4" 
            />
            <path 
              d="M180,280 Q350,250 500,270 T600,230" 
              stroke={isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.2)"} 
              fill="none" 
              strokeDasharray="4,4" 
            />
            <path 
              d="M250,320 Q350,290 450,310 T550,300" 
              stroke={isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.2)"} 
              fill="none" 
              strokeDasharray="4,4" 
            />
            
            {[...Array(15)].map((_, i) => {
              const x = 150 + Math.random() * 500;
              const y = 150 + Math.random() * 200;
              const size = 2 + Math.random() * 4;
              const opacity = 0.3 + Math.sin((animationFrames / 20) + i) * 0.3;
              const themeColor = isDarkMode ? "239, 68, 68" : "249, 115, 22";
              
              return (
                <circle 
                  key={`node-${i}`} 
                  cx={x} 
                  cy={y} 
                  r={size} 
                  fill={`rgba(${themeColor}, ${opacity})`} 
                />
              );
            })}
          </g>
          
          {/* Transaction flow lines - enhanced */}
          {[...Array(12)].map((_, i) => {
            const progress = ((animationFrames + i * 10) % 120) / 120;
            const startX = 150 + Math.sin(i * 0.7) * 100;
            const startY = 350 - i * 15;
            const controlX1 = 270 + Math.sin(i * 0.4) * 80;
            const controlY1 = 250 - Math.cos(i * 0.5) * 60;
            const controlX2 = 530 + Math.cos(i * 0.3) * 80;
            const controlY2 = 230 + Math.sin(i * 0.6) * 60;
            const endX = 650 - Math.cos(i * 0.7) * 100;
            const endY = 150 + i * 15;
            
            // Calculate the current position along the cubic bezier curve
            const t = progress;
            const mt = 1 - t;
            const currentX = 
              startX * mt * mt * mt +
              3 * controlX1 * mt * mt * t +
              3 * controlX2 * mt * t * t +
              endX * t * t * t;
            const currentY = 
              startY * mt * mt * mt +
              3 * controlY1 * mt * mt * t +
              3 * controlY2 * mt * t * t +
              endY * t * t * t;
            
            const lineColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)";
            const dotColor1 = isDarkMode ? "#ef4444" : "#f97316"; // Red in dark mode, orange in light mode
            const dotColor2 = isDarkMode ? "#ffffff" : "#0f172a"; // White in dark mode, navy in light mode
            
            return (
              <g key={`transaction-${i}`}>
                <path 
                  d={`M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
                  stroke={lineColor}
                  strokeWidth={1}
                  strokeDasharray="4,4"
                  fill="none"
                />
                
                {/* Moving transaction dot with trail effect */}
                <circle 
                  cx={currentX}
                  cy={currentY}
                  r={3}
                  fill={i % 3 === 0 ? dotColor1 : dotColor2}
                  filter="url(#glow)"
                />
                
                {/* Transaction pulse */}
                {progress > 0.1 && progress < 0.9 && (
                  <circle 
                    cx={currentX}
                    cy={currentY}
                    r={5 + Math.sin(animationFrames/5) * 2}
                    fill="none"
                    stroke={i % 3 === 0 
                      ? isDarkMode ? "rgba(239, 68, 68, 0.3)" : "rgba(249, 115, 22, 0.3)" 
                      : isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(15, 23, 42, 0.2)"
                    }
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}
          
          {/* Digital wallet on the left */}
          <g transform="translate(150, 230) scale(0.7)">
            <rect 
              x="-40" 
              y="-25" 
              width="80" 
              height="50" 
              rx="5" 
              fill={isDarkMode ? "#ef4444" : "#f97316"} 
              filter="url(#glow)"
            />
            <rect 
              x="-35" 
              y="-10" 
              width="70" 
              height="10" 
              fill={isDarkMode ? "#111827" : "#f1f5f9"} 
            />
            <rect 
              x="-25" 
              y="10" 
              width="40" 
              height="5" 
              fill={isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(15, 23, 42, 0.6)"} 
            />
            
            {/* Animated signal waves */}
            {[...Array(3)].map((_, i) => {
              const delay = i * 5;
              const progress = ((animationFrames + delay) % 30) / 30;
              if (progress < 0.5) {
                return (
                  <path 
                    key={`signal-${i}`}
                    d={`M 0,0 a ${15 + i * 8},${15 + i * 8} 0 0,1 ${progress * 40},0`}
                    fill="none"
                    stroke={isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)"}
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    transform="translate(0, -30)"
                  />
                );
              }
              return null;
            })}
          </g>
          
          {/* Payment terminal on the right */}
          <g transform="translate(650, 270) scale(0.7)">
            <rect 
              x="-35" 
              y="-50" 
              width="70" 
              height="100" 
              rx="7" 
              fill={isDarkMode ? "#374151" : "#cbd5e1"} 
              filter="url(#glow)"
            />
            <rect 
              x="-30" 
              y="-45" 
              width="60" 
              height="30" 
              rx="3" 
              fill={isDarkMode ? "#111827" : "#f1f5f9"} 
            />
            <rect 
              x="-20" 
              y="-5" 
              width="40" 
              height="5" 
              fill={isDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(15, 23, 42, 0.4)"} 
            />
            <rect 
              x="-20" 
              y="5" 
              width="40" 
              height="5" 
              fill={isDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(15, 23, 42, 0.4)"} 
            />
            <rect 
              x="-20" 
              y="15" 
              width="40" 
              height="5" 
              fill={isDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(15, 23, 42, 0.4)"} 
            />
            <circle 
              cx="0" 
              cy="35" 
              r="10" 
              fill={isDarkMode ? "#ef4444" : "#f97316"} 
              stroke={isDarkMode ? "#ffffff" : "#0f172a"} 
              strokeWidth="2" 
              filter="url(#glow)"
            />
            
            {/* Activity indicator */}
            <circle 
              cx="25" 
              cy="-40" 
              r="3" 
              fill={animationFrames % 40 < 20 ? "#4ade80" : "rgba(74, 222, 128, 0.3)"}
            />
          </g>
          
          {/* Currency symbols with enhanced animation */}
          {['$', '€', '£', '¥', '₹', '₿'].map((symbol, i) => {
            const baseAngle = (animationFrames / 40) + (i * Math.PI / 3);
            const radius = 110 + Math.sin(animationFrames/30 + i) * 10;
            const x = 400 + Math.cos(baseAngle) * radius;
            const y = 250 + Math.sin(baseAngle) * radius * 0.7;
            const opacity = 0.5 + 0.5 * Math.sin((animationFrames / 20) + i);
            const scale = 0.8 + 0.2 * Math.sin((animationFrames / 15) + i * 2);
            
            const primaryColor = isDarkMode 
              ? `rgba(239, 68, 68, ${opacity})` 
              : `rgba(249, 115, 22, ${opacity})`;
              
            const secondaryColor = isDarkMode 
              ? `rgba(255, 255, 255, ${opacity * 0.8})` 
              : `rgba(15, 23, 42, ${opacity * 0.8})`;
            
            return (
              <text 
                key={`currency-${i}`}
                x={x} 
                y={y} 
                fontSize="22"
                fontWeight="bold"
                fill={i % 2 === 0 ? primaryColor : secondaryColor}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`scale(${scale})`}
                style={{transformOrigin: `${x}px ${y}px`}}
                filter="url(#glow)"
              >
                {symbol}
              </text>
            );
          })}
          
          {/* Connected network visualization in the center */}
          <g transform="translate(400, 250)">
            <circle 
              cx="0" 
              cy="0" 
              r={30 + Math.sin(animationFrames/10) * 5} 
              fill={isDarkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(249, 115, 22, 0.1)"} 
              stroke={isDarkMode ? "rgba(239, 68, 68, 0.5)" : "rgba(249, 115, 22, 0.5)"}
              strokeWidth="1"
            />
            
            {/* Network nodes */}
            {[...Array(6)].map((_, i) => {
              const angle = (Math.PI * 2 / 6) * i + (animationFrames / 100);
              const x = Math.cos(angle) * 30;
              const y = Math.sin(angle) * 30;
              
              const primaryColor = isDarkMode ? "#ef4444" : "#f97316";
              const secondaryColor = isDarkMode ? "#ffffff" : "#0f172a";
              
              return (
                <g key={`node-${i}`}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="4" 
                    fill={i % 2 === 0 ? primaryColor : secondaryColor}
                  />
                  
                  {/* Connecting lines */}
                  {i < 5 && [...Array(2)].map((_, j) => {
                    const nextIdx = (i + j + 1) % 6;
                    const nextAngle = (Math.PI * 2 / 6) * nextIdx + (animationFrames / 100);
                    const nextX = Math.cos(nextAngle) * 30;
                    const nextY = Math.sin(nextAngle) * 30;
                    
                    return (
                      <line 
                        key={`connection-${i}-${j}`}
                        x1={x}
                        y1={y}
                        x2={nextX}
                        y2={nextY}
                        stroke={isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(15, 23, 42, 0.2)"}
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />
                    );
                  })}
                </g>
              );
            })}
          </g>
          
          {/* Animated success indicators */}
          {[...Array(3)].map((_, i) => {
            const delay = i * 40;
            const progress = ((animationFrames + delay) % 120) / 120;
            const opacity = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
            const size = 20 + progress * 60;
            
            return (
              <circle 
                key={`pulse-${i}`}
                cx={400}
                cy={250}
                r={size}
                fill="none"
                stroke={isDarkMode 
                  ? `rgba(239, 68, 68, ${opacity * 0.3})` 
                  : `rgba(249, 115, 22, ${opacity * 0.3})`
                }
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Additional info badges under the animation */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { text: t("24/7 Support"), value: t("Available") },
          { text: t("Transaction Smoothness"), value: "100%" },
          { text: t("Processing Time"), value: "<1s" }
        ].map((item, i) => (
          <div 
            key={i} 
            className={`${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/90 border-gray-200'
              } p-2 rounded-lg text-center border transition-colors duration-300`}
          >
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
              {item.text}
            </p>
            <p className="text-sm font-bold text-orange-500">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}