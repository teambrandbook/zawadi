import React from 'react';
import { LucideIcon } from 'lucide-react';

// 1. Added iconColor to the type definition
type StatCardProps = {
  Icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
  trendColor?: string;
  iconBgColor?: string;
  iconColor?: string; // New prop
};

// 2. Destructure iconColor here
function StatCard({ Icon, value, label, trend, trendColor, iconBgColor, iconColor }: StatCardProps) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm min-w-[200px]">
      
      {/* Top Section */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgColor || 'bg-gray-100'}`}>
          {/* 3. Use the iconColor prop here with a default fallback */}
          <Icon className={`w-5 h-5 ${iconColor || 'text-[#0A4834]'}`} strokeWidth={2.5} />
        </div>

        {trend && (
          <span className={`text-xs font-bold ${trendColor || 'text-gray-600'}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Bottom Section */}
      <div className="space-y-1">
        <h3 className="text-3xl font-bold text-[#0A4834]">
          {value}
        </h3>
        <p className="text-sm text-gray-500 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
}

export default StatCard;