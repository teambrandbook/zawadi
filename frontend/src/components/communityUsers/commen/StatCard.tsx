import React from 'react';
import { LucideIcon } from 'lucide-react';

// 1. Added iconColor to the type definition
type StatCardProps = {
  Icon: LucideIcon;
  value: string | number;
  label?: string ;
  trend?: string;
  trendColor?: string;
  iconBgColor?: string;
  iconColor?: string; // New prop
};

// 2. Destructure iconColor here
function StatCard({ Icon, value, label, trend, trendColor, iconBgColor, iconColor }: StatCardProps) {
  return (
    <div className="flex-1 rounded-lg border border-[#D1D5DB] bg-white p-4 min-w-0">
      
      {/* Top Section */}
      <div className="mb-3 flex items-start justify-between">
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${iconBgColor || 'bg-gray-100'}`}>
          {/* 3. Use the iconColor prop here with a default fallback */}
          <Icon className={`h-4 w-4 ${iconColor || 'text-[#0A4834]'}`} strokeWidth={2.5} />
        </div>

        {trend && (
          <span className={`pt-1 text-[10px] font-medium ${trendColor || 'text-gray-600'}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Bottom Section */}
      <div className="space-y-2">
        <h3 className="text-[28px] font-bold leading-none text-[#0A4834]">
          {value}
        </h3>
        <p className="text-xs font-medium text-[#4B5563]">
          {label}
        </p>
      </div>
    </div>
  );
}

export default StatCard;
