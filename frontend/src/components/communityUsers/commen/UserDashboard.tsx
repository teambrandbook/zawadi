import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingBag, 
  UserRound, 
  Calendar, 
  MessageSquareDiff, 
  Settings 
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: Home, href: '/communityDashBorde', active: true },
  { name: 'My Recipes', icon: UtensilsCrossed, href: '/communityDashBorde/myrecipy' },
  { name: 'My Orders', icon: ShoppingBag, href: '/communityDashBorde/myorders' },
  { name: 'Consultation', icon: UserRound, href: '/communityDashBorde/consultation' },
  { name: 'My Events', icon: Calendar, href: '/communityDashBorde/events' },
  { name: 'Add Blog', icon: MessageSquareDiff, href: '/communityDashBorde/add-blog' },
  { name: 'Settings', icon: Settings, href: '/communityDashBorde/settings' },
];

const UserDashboard = () => {
  return (
    <aside className="w-64 h-screen bg-white p-6 flex flex-col space-y-4 pt-20">
      {menuItems.map((item) => {
        const Icon = item.icon;
        
        return (
          <Link key={item.name} href={item.href} className="group flex items-center space-x-3">
            {/* Icon Circle */}
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-full transition-all
              ${item.active 
                ? 'bg-[#06402B] text-white' 
                : 'bg-[#EBE3D1] text-[#06402B] group-hover:bg-[#d8cfb8]'}
            `}>
              <Icon size={20} strokeWidth={2.5} />
            </div>

            {/* Label Pill */}
            <div className={`
              flex-1 py-3 px-6 rounded-full font-semibold text-sm transition-all
              ${item.active 
                ? 'bg-[#06402B] text-white' 
                : 'bg-[#EBE3D1] text-[#06402B] group-hover:bg-[#d8cfb8]'}
            `}>
              {item.name}
            </div>
          </Link>
        );
      })}
    </aside>
  );
};

export default UserDashboard;