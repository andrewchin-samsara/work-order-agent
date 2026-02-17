import React from 'react';
import { 
  Map, 
  Users, 
  ShieldCheck, 
  ClipboardList, 
  Wrench, 
  Waypoints, 
  Settings, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-16 h-screen bg-[#eff2f6] flex flex-col items-center py-4 space-y-2 flex-shrink-0 z-20 border-r border-[#dbe2ea]">
      {/* Logo */}
      <div className="mb-4 text-[#1e1e2f] hover:opacity-80 cursor-pointer">
        <SamsaraLogo />
      </div>
      
      {/* Main Nav */}
      <div className="flex flex-col space-y-2 w-full px-2">
        <NavItem icon={<Map size={22} />} />
        <NavItem icon={<Users size={22} />} />
        <NavItem icon={<ShieldCheck size={22} />} />
        <NavItem icon={<ClipboardList size={22} />} />
        <NavItem icon={<Wrench size={22} />} active />
        <NavItem icon={<Waypoints size={22} />} />
      </div>
      
      <div className="flex-grow" />
      
      {/* Footer Nav */}
      <div className="flex flex-col space-y-2 w-full px-2 pb-2">
        <NavItem icon={<Settings size={22} />} />
        <NavItem icon={<HelpCircle size={22} />} />
        <div className="flex justify-center py-2 text-[#53657d] hover:text-[#1e1e2f] cursor-pointer">
           <ChevronRight size={22} />
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, active?: boolean }> = ({ icon, active }) => (
  <div className={`
    p-2 rounded-md cursor-pointer transition-colors flex justify-center
    ${active 
      ? 'bg-[#dce3eb] text-[#1e1e2f]' 
      : 'text-[#6b778c] hover:bg-[#e2e7ec] hover:text-[#1e1e2f]'
    }
  `}>
    {icon}
  </div>
);

const SamsaraLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2ZM16 7C13 7 10.5 9.5 10.5 12.5C10.5 15.5 13 18 16 18C19 18 21.5 15.5 21.5 12.5C21.5 9.5 19 7 16 7ZM14 12.5C14 13.6046 14.8954 14.5 16 14.5C17.1046 14.5 18 13.6046 18 12.5C18 11.3954 17.1046 10.5 16 10.5C14.8954 10.5 14 11.3954 14 12.5Z" fill="#111827"/>
    <path d="M12.5 20.5C12.5 19.3954 13.3954 18.5 14.5 18.5H17.5C18.6046 18.5 19.5 19.3954 19.5 20.5C19.5 21.6046 18.6046 22.5 17.5 22.5H14.5C13.3954 22.5 12.5 21.6046 12.5 20.5Z" fill="#111827"/>
  </svg>
);