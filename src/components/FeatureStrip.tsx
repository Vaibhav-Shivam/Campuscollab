import React from 'react';
import Link from 'next/link';
import { Search, FolderPlus, Calendar, Users, ArrowUpRight } from 'lucide-react';

export default function FeatureStrip() {
  const features = [
    {
      icon: Search,
      title: 'Find Talent',
      description: 'Search students by verified skills, real project proofs, and portfolio links.',
      href: '/students',
      badgeColor: 'bg-[#A3C9AB]/20 text-[#A3C9AB]',
      iconColor: 'text-[#A3C9AB]'
    },
    {
      icon: FolderPlus,
      title: 'Post Projects',
      description: 'Share your ideas, set required roles, and discover students ready to build.',
      href: '/projects?new=true',
      badgeColor: 'bg-[#D9C3A5]/20 text-[#D9C3A5]',
      iconColor: 'text-[#D9C3A5]'
    },
    {
      icon: Calendar,
      title: 'Join Opportunities',
      description: 'Explore campus hackathons, workshops, and team-formation meetups.',
      href: '/events',
      badgeColor: 'bg-[#A3C9AB]/20 text-[#A3C9AB]',
      iconColor: 'text-[#A3C9AB]'
    },
    {
      icon: Users,
      title: 'Grow Together',
      description: 'Turn ideas into working MVPs through mutual skills, proof, and collaboration.',
      href: '/dashboard',
      badgeColor: 'bg-[#D9C3A5]/20 text-[#D9C3A5]',
      iconColor: 'text-[#D9C3A5]'
    }
  ];

  return (
    <div className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
      <div className="bg-[#0F3D2E] text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#2E7058] shadow-[0_16px_40px_rgba(15,61,46,0.3)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#2E7058]/60">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.title}
                href={feat.href}
                className={`group block pt-6 md:pt-0 ${
                  idx > 0 ? 'md:pl-6 lg:pl-8' : ''
                } cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.badgeColor} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-[#A3C9AB] transition-colors mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
