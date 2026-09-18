import React from 'react';
import { AvailabilityStatus } from '@/types';
import { Sparkles, Users } from 'lucide-react';

interface StatusBadgeProps {
  status: AvailabilityStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const isAvailable = status === 'available';

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs font-black px-3 py-1 gap-1.5',
    lg: 'text-sm font-black px-4 py-1.5 gap-2'
  }[size];

  if (isAvailable) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-[#4FD1C5] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] ${sizeClasses} uppercase tracking-wider`}
        title="Open to joining new projects, hackathons, and team collaborations"
      >
        {showIcon && (
          <span className="w-2.5 h-2.5 rounded-full bg-black border border-white shrink-0"></span>
        )}
        <span>Available for Projects</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-[#FF6B6B] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] ${sizeClasses} uppercase tracking-wider`}
      title="Currently building a project and seeking teammates with specific skills"
    >
      {showIcon && <Users className="w-3.5 h-3.5 text-black shrink-0" />}
      <span>Looking for Teammates</span>
    </span>
  );
}
