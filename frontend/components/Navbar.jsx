'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, UserIcon, CogIcon, LogoutIcon } from '@heroicons/react/outline';
import Image from 'next/image';

const Navbar = () => {
  const [selectedOption, setSelectedOption] = useState('Home');

  const dropdownOptions = [
    { label: 'Base Case', link: '/base-case' },
    { label: 'Home', link: '/' },
    { label: 'HealthCare', link: '/healthcare' },
    { label: 'Autonomous Vehicles', link: '/autonomous-vehicles' },
    { label: 'Military', link: '/military' },
  ];

  return (
    <div className="fixed top-4 left-4 right-4 bg-[#0A0A0F] rounded-full shadow-lg flex justify-between items-center px-6 py-3 z-50 border border-black">
      <div className="flex items-center space-x-4">
        <Image
            src="/logos/logo_red.png"
            alt="Brand Logo"
            className="w-10 h-10 rounded-full"
            width={40}
            height={40} 
        />
        <span className="text-2xl font-bold text-[#ffffff] space_grotesk">SentinelAI</span>
        </div>
      <div className="flex items-center space-x-6 poppins">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#FB0000] hover:bg-[#FF4D4D] text-[#ffffff] text-sm rounded-md px-4 py-2 flex items-center space-x-2">
              <span>{selectedOption}</span>
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-white rounded-md shadow-md border border-gray-200"
            disableOutsidePointerEvents={false}
          >
            {dropdownOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onSelect={() => setSelectedOption(option.label)}
              >
                <Link href={option.link} className="block w-full text-[#0a0a0f]">
                  {option.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-10 h-10 bg-[#FB0000] hover:bg-[#FF4D4D] rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#ffffff]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-white rounded-md shadow-md border border-gray-200 max-h-60 overflow-auto"
            align="end"
            sideOffset={8}
            >
            <DropdownMenuItem className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                <Link href="/settings" className="flex items-center text-[#0a0a0f]">
                <CogIcon className="w-5 h-5 text-gray-500 mr-2" />
                Settings
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                <Link href="/profile" className="flex items-center text-[#0a0a0f]">
                <UserIcon className="w-5 h-5 text-gray-500 mr-2" />
                Profile
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                <Link href="/logout" className="flex items-center text-[#0a0a0f]">
                <LogoutIcon className="w-5 h-5 text-gray-500 mr-2" />
                Logout
                </Link>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
