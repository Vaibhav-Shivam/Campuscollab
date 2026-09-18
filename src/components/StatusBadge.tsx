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
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-xs font-semibold px-3 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-4 py-1.5 gap-2'
  }[size];

  if (isAvailable) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/30 ${sizeClasses} shadow-sm`}
        title="Open to joining new projects, hackathons, and team collaborations"
      >
        {showIcon && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
        )}
        <span>Available for Projects</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-[#F59E0B]/15 text-[#92400E] border border-[#F59E0B]/30 ${sizeClasses} shadow-sm`}
      title="Currently building a project and seeking teammates with specific skills"
    >
      {showIcon && <Users className="w-3.5 h-3.5 text-[#D97706]" />}
      <span>Looking for Teammates</span>
    </span>
  );
}
