// 'use client';

// import React from 'react';
// import { ThemeProvider } from './ThemeProvider';
// import ThemeToggle from './ThemeToggle';

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ThemeProvider>
//       <div className="min-h-screen">
//         <header className="flex justify-between items-center p-4 border-b">
//           <h1 className="text-xl font-bold">My Next.js App</h1>
//           <ThemeToggle />
//         </header>
//         <main>{children}</main>
//       </div>
//     </ThemeProvider>
//   );
// }









// 'use client';

// import React from 'react';
// import { useTheme } from './ThemeProvider';

// const HomePage: React.FC = () => {
//   const { theme } = useTheme();
  
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Welcome to My Themed App</h1>
      
//       <div className="mb-6">
//         <p>Current theme: <span className="font-bold">{theme.mode}</span></p>
//       </div>
      
//       <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div className="card">
//           <h2 className="text-xl font-semibold mb-2">Theme Components</h2>
//           <p className="mb-4">This card uses the theme's background color and border radius.</p>
//           <button className="btn-primary mr-2">Primary Button</button>
//           <button className="btn-secondary">Secondary Button</button>
//         </div>
        
//         <div className="card">
//           <h2 className="text-xl font-semibold mb-2">Theme Colors</h2>
//           <div className="flex flex-col gap-2">
//             <div className="flex items-center">
//               <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: theme.colors.primary }}></div>
//               <span>Primary Color</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: theme.colors.secondary }}></div>
//               <span>Secondary Color</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: theme.colors.accent }}></div>
//               <span>Accent Color</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-6 h-6 rounded mr-2 border" style={{ backgroundColor: theme.colors.background }}></div>
//               <span>Background Color</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: theme.colors.text }}></div>
//               <span>Text Color</span>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       <section className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Typography</h2>
//         <p style={{ fontSize: theme.values.fontSizes.small }}>Small text size</p>
//         <p style={{ fontSize: theme.values.fontSizes.medium }}>Medium text size</p>
//         <p style={{ fontSize: theme.values.fontSizes.large }}>Large text size</p>
//         <p className="accent-text">This text uses the accent color</p>
//       </section>
//     </div>
//   );
// };

// export default HomePage;