export interface AvatarGraphic {
  id: string;
  name: string;
  category: '3D & Tech' | 'Characters' | 'Robots' | 'Retro & Pixel' | 'Emoji & Fun';
  url: string;
}

export const AVATAR_GRAPHICS: AvatarGraphic[] = [
  // 1. 3D & Tech Graphics
  {
    id: 'tech-hologram',
    name: 'Cyber Hologram',
    category: '3D & Tech',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tech-neon-matrix',
    name: 'Neon Matrix',
    category: '3D & Tech',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tech-abstract-flow',
    name: 'Quantum Flow',
    category: '3D & Tech',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tech-synthwave',
    name: 'Synth Grid',
    category: '3D & Tech',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400'
  },

  // 2. Robots & Cyber Bots (DiceBear Bottts)
  {
    id: 'bot-cyber',
    name: 'Cyber Bot',
    category: 'Robots',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberBot&backgroundColor=b6e3f4'
  },
  {
    id: 'bot-sparky',
    name: 'Sparky 3000',
    category: 'Robots',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky&backgroundColor=ffd5dc'
  },
  {
    id: 'bot-neon',
    name: 'Neon Gear',
    category: 'Robots',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeonGear&backgroundColor=d1d4f9'
  },
  {
    id: 'bot-quantum',
    name: 'Quantum Unit',
    category: 'Robots',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Quantum&backgroundColor=c0aede'
  },
  {
    id: 'bot-hacker',
    name: 'Robo Hacker',
    category: 'Robots',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoboHacker&backgroundColor=ffdfbf'
  },
  {
    id: 'bot-titan',
    name: 'Titan Core',
    category: 'Robots',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TitanCore&backgroundColor=b6e3f4'
  },

  // 3. Characters & Illustrative Portraits (DiceBear Adventurer & Lorelei)
  {
    id: 'char-adventurer-alex',
    name: 'Alex Coder',
    category: 'Characters',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AlexCoder&backgroundColor=ffd5dc'
  },
  {
    id: 'char-adventurer-neo',
    name: 'Neo Builder',
    category: 'Characters',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=NeoBuilder&backgroundColor=b6e3f4'
  },
  {
    id: 'char-adventurer-nova',
    name: 'Nova Scout',
    category: 'Characters',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=NovaScout&backgroundColor=d1d4f9'
  },
  {
    id: 'char-lorelei-aria',
    name: 'Aria Tech',
    category: 'Characters',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=AriaTech&backgroundColor=c0aede'
  },
  {
    id: 'char-lorelei-kai',
    name: 'Kai Vision',
    category: 'Characters',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=KaiVision&backgroundColor=ffdfbf'
  },
  {
    id: 'char-lorelei-maya',
    name: 'Maya Cloud',
    category: 'Characters',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=MayaCloud&backgroundColor=ffd5dc'
  },
  {
    id: 'char-notion-architect',
    name: 'System Architect',
    category: 'Characters',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Architect&backgroundColor=ffd5dc'
  },
  {
    id: 'char-notion-maker',
    name: 'Minimal Maker',
    category: 'Characters',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Maker&backgroundColor=b6e3f4'
  },

  // 4. Retro & Pixel Art
  {
    id: 'pixel-hero',
    name: '8-Bit Hero',
    category: 'Retro & Pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelHero&backgroundColor=ffd5dc'
  },
  {
    id: 'pixel-coder',
    name: 'Arcade Dev',
    category: 'Retro & Pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ArcadeDev&backgroundColor=b6e3f4'
  },
  {
    id: 'pixel-wizard',
    name: 'Cyber Mage',
    category: 'Retro & Pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CyberMage&backgroundColor=d1d4f9'
  },
  {
    id: 'pixel-quest',
    name: 'Retro Quest',
    category: 'Retro & Pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=RetroQuest&backgroundColor=ffdfbf'
  },

  // 5. Fun & Expressive Emoji
  {
    id: 'fun-cool-shades',
    name: 'Cool Shades',
    category: 'Emoji & Fun',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=CoolShades&backgroundColor=ffd5dc'
  },
  {
    id: 'fun-star-eyes',
    name: 'Star Gazer',
    category: 'Emoji & Fun',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=StarGazer&backgroundColor=b6e3f4'
  },
  {
    id: 'fun-brain',
    name: 'Galaxy Brain',
    category: 'Emoji & Fun',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=GalaxyBrain&backgroundColor=c0aede'
  },
  {
    id: 'fun-joy',
    name: 'Joyful Creator',
    category: 'Emoji & Fun',
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=JoyfulCreator&backgroundColor=ffdfbf'
  }
];

export const AVATAR_CATEGORIES = [
  'All',
  '3D & Tech',
  'Characters',
  'Robots',
  'Retro & Pixel',
  'Emoji & Fun'
] as const;

export type AvatarCategory = (typeof AVATAR_CATEGORIES)[number];
