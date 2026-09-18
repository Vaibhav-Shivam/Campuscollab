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
      bgColor: 'bg-[#FFDE59]', // Electric Yellow
      iconBg: 'bg-white'
    },
    {
      icon: FolderPlus,
      title: 'Post Projects',
      description: 'Share your ideas, set required roles, and discover students ready to build.',
      href: '/projects?new=true',
      bgColor: 'bg-[#FF70A6]', // Bubblegum Pink
      iconBg: 'bg-white'
    },
    {
      icon: Calendar,
      title: 'Opportunities',
      description: 'Explore campus hackathons, workshops, and team-formation meetups.',
      href: '/events',
      bgColor: 'bg-[#4FD1C5]', // Neo Mint
      iconBg: 'bg-white'
    },
    {
      icon: Users,
      title: 'Grow Together',
      description: 'Turn ideas into working MVPs through mutual skills, proof, and collaboration.',
      href: '/dashboard',
      bgColor: 'bg-[#9B87F5]', // Electric Lavender
      iconBg: 'bg-white'
    }
  ];

  return (
    <div className="relative -mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <Link
              key={feat.title}
              href={feat.href}
              className={`group block p-6 rounded-2xl ${feat.bgColor} border-[2.5px] border-black shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${feat.iconBg} border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-bold group-hover:bg-black group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-black text-xl text-black uppercase tracking-tight mb-1.5">
                {feat.title}
              </h3>
              <p className="text-xs text-black font-semibold leading-relaxed">
                {feat.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
