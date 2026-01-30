'use client';

import RegisterForm from '../../components/RegisterForm';
import Image from 'next/image';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col pt-10 px-4 sm:px-6 lg:px-8">
            {/* Top Bar with Logo */}
            <div className="w-full mb-8 flex items-center px-4 sm:px-6 lg:px-8">
                <Image src="/logo.jpg" alt="Blaffa" width={40} height={40} className="object-contain" />
                <span className="ml-2 text-xl font-bold text-[#1e40af]">Blaffa</span>
            </div>

            {/* Main Content */}
            <div className="w-full flex-1 flex items-start justify-center">
                <RegisterForm />
            </div>
        </div>
    );
}
