import Image from "next/image";
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from "./LanguageToggle";
export default function Nav() {
    return(
        <nav className="p-6 flex justify-between items-center border-b">
            <div className="flex items-center">
            {/* <svg className="h-10 w-10 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="currentColor" fillOpacity="0.2" />
                <path d="M7 14c0-2.21 2.239-4 5-4s5 1.79 5 4-2.239 4-5 4-5-1.79-5-4z" fill="currentColor" />
                <path d="M14 9a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />
            </svg> */}
            <Image src="/logo.png" alt="blaffa Logo" width={60} height={60} />
            <span className="ml-0 text-xl font-bold text-orange-500">blaffa</span>
            </div>
            <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
                 <ThemeToggle /> 
        
            {/* Language Toggle Button */}
                <LanguageToggle />

        
            </div>
    
        </nav>

  );
}