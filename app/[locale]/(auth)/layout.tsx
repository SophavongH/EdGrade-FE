import { ReactNode } from 'react';
import Image from 'next/image';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-[#EDF1F1]">
      {/* left side logo Card */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 px-8">
        <div className="flex flex-col items-center">
          <Image
            priority
            src="/logo-login.svg"
            alt="EdGrade Logo"
            width={220}
            height={120}
          />
          <p className="text-gray-600 text-xl text-center max-w-sm">
            Digital Academic Information System
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back to EdGrade
            </h1>
            <p className="text-sm text-gray-600">
              Login to your EdGrade Account
            </p>
          </div>

          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
