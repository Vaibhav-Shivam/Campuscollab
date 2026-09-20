'use client';

import React, { useState, useRef } from 'react';
import {
  AVATAR_GRAPHICS,
  AVATAR_CATEGORIES,
  AvatarCategory,
  AvatarGraphic
} from '@/data/avatarPresets';
import {
  Upload,
  Sparkles,
  Shuffle,
  Check,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Camera,
  AlertCircle
} from 'lucide-react';

interface AvatarPickerProps {
  currentAvatar: string;
  onSelectAvatar: (avatarUrl: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  mode?: 'modal' | 'inline';
}

export default function AvatarPicker({
  currentAvatar,
  onSelectAvatar,
  isOpen = true,
  onClose,
  mode = 'modal'
}: AvatarPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<AvatarCategory>('All');
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'generate'>('presets');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [customSeed, setCustomSeed] = useState('');
  const [dicebearStyle, setDicebearStyle] = useState<'bottts' | 'adventurer' | 'lorelei' | 'pixel-art' | 'fun-emoji'>('bottts');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(currentAvatar);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (mode === 'modal' && !isOpen) return null;

  const filteredGraphics = AVATAR_GRAPHICS.filter((graphic) =>
    selectedCategory === 'All' ? true : graphic.category === selectedCategory
  );

  const handlePickGraphic = (url: string) => {
    setPreviewAvatar(url);
    onSelectAvatar(url);
  };

  // Client-side image resize and center-crop to 400x400 JPEG
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, etc.).');
      return;
    }

    setIsProcessingFile(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const SIZE = 400;
          canvas.width = SIZE;
          canvas.height = SIZE;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // Draw clean background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, SIZE, SIZE);

            // Center square crop
            const minDim = Math.min(img.width, img.height);
            const srcX = (img.width - minDim) / 2;
            const srcY = (img.height - minDim) / 2;

            ctx.drawImage(img, srcX, srcY, minDim, minDim, 0, 0, SIZE, SIZE);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);

            setPreviewAvatar(compressed);
            onSelectAvatar(compressed);
          }
        } catch (err) {
          console.error('Image processing error:', err);
        } finally {
          setIsProcessingFile(false);
        }
      };
      img.onerror = () => {
        setIsProcessingFile(false);
        alert('Could not load the selected image.');
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');
    const trimmed = customUrlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setUrlError('Please enter a valid URL starting with https://');
      return;
    }

    // Verify image loads
    const testImg = new Image();
    testImg.onload = () => {
      setPreviewAvatar(trimmed);
      onSelectAvatar(trimmed);
      setCustomUrlInput('');
    };
    testImg.onerror = () => {
      setUrlError('Could not load image from this URL. Please check the link.');
    };
    testImg.src = trimmed;
  };

  const handleGenerateDicebear = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const seed = customSeed.trim() || `Avatar_${Date.now().toString(36)}`;
    const colors = ['b6e3f4', 'ffd5dc', 'd1d4f9', 'c0aede', 'ffdfbf'];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];
    const generatedUrl = `https://api.dicebear.com/7.x/${dicebearStyle}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${randomBg}`;
    setPreviewAvatar(generatedUrl);
    onSelectAvatar(generatedUrl);
  };

  const handleRandomize = () => {
    const randomWords = ['Cosmic', 'Pixel', 'Rocket', 'Quantum', 'Glitch', 'Sonic', 'Ninja', 'Cyber', 'Neon', 'Astro', 'Volt', 'Nova'];
    const randomStyleList: ('bottts' | 'adventurer' | 'lorelei' | 'pixel-art' | 'fun-emoji')[] = [
      'bottts',
      'adventurer',
      'lorelei',
      'pixel-art',
      'fun-emoji'
    ];
    const pickedStyle = randomStyleList[Math.floor(Math.random() * randomStyleList.length)];
    const pickedWord = randomWords[Math.floor(Math.random() * randomWords.length)] + Math.floor(Math.random() * 999);
    setDicebearStyle(pickedStyle);
    setCustomSeed(pickedWord);

    const colors = ['b6e3f4', 'ffd5dc', 'd1d4f9', 'c0aede', 'ffdfbf'];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];
    const url = `https://api.dicebear.com/7.x/${pickedStyle}/svg?seed=${pickedWord}&backgroundColor=${randomBg}`;
    setPreviewAvatar(url);
    onSelectAvatar(url);
  };

  const content = (
    <div className="space-y-6">
      {/* Current Preview Strip */}
      <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={previewAvatar || currentAvatar}
              alt="Selected avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000] bg-stone-100"
            />
            <span className="absolute -bottom-1 -right-1 bg-[#38E54D] border border-black text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
              Active
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-stone-500">
              Selected Profile Pic
            </div>
            <div className="text-xs font-black uppercase text-black">
              {previewAvatar.startsWith('data:')
                ? 'Custom Uploaded Photo'
                : previewAvatar.includes('unsplash')
                ? 'High-Res Tech Graphic'
                : 'Graphic Avatar'}
            </div>
            <p className="text-[11px] font-semibold text-stone-600">
              Visible on your student card, project posts, and search results.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRandomize}
          className="inline-flex items-center gap-1.5 bg-[#FFDE59] hover:bg-[#FF70A6] text-black font-black text-xs uppercase px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Surprise Me 🎲</span>
        </button>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b-2 border-black gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider transition-all border-t-2 border-x-2 border-black rounded-t-xl cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-[#4FD1C5] text-black shadow-[0_-2px_0px_0px_#000]'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          🎨 Choose Graphic ({AVATAR_GRAPHICS.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider transition-all border-t-2 border-x-2 border-black rounded-t-xl cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-[#FF70A6] text-black shadow-[0_-2px_0px_0px_#000]'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          📸 Upload Photo
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider transition-all border-t-2 border-x-2 border-black rounded-t-xl cursor-pointer ${
            activeTab === 'generate'
              ? 'bg-[#9B87F5] text-black shadow-[0_-2px_0px_0px_#000]'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          ✨ Custom Generator
        </button>
      </div>

      {/* TAB 1: PRESET GRAPHICS GALLERY */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            {AVATAR_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border-2 border-black ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-[#FFDE59] shadow-[1.5px_1.5px_0px_0px_#000]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Graphics Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[340px] overflow-y-auto p-1">
            {filteredGraphics.map((graphic) => {
              const isSelected = previewAvatar === graphic.url;
              return (
                <button
                  key={graphic.id}
                  type="button"
                  onClick={() => handlePickGraphic(graphic.url)}
                  className={`group relative p-2 rounded-2xl border-2 border-black transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#FFDE59] shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                      : 'bg-white hover:bg-stone-50 hover:shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                    <img
                      src={graphic.url}
                      alt={graphic.name}
                      className="w-full h-full rounded-xl object-cover border border-black bg-stone-100"
                    />
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center border border-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight text-black text-center truncate max-w-full">
                    {graphic.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: UPLOAD OWN PHOTO */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* File Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-[2.5px] border-dashed border-black rounded-2xl p-8 text-center bg-white hover:bg-stone-50 transition-colors cursor-pointer shadow-[3px_3px_0px_0px_#000] space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="w-14 h-14 bg-[#FF70A6] border-2 border-black rounded-2xl flex items-center justify-center mx-auto text-black shadow-[2px_2px_0px_0px_#000]">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-black uppercase text-black">
                {isProcessingFile ? 'Optimizing Image...' : 'Click to Upload Your Photo'}
              </div>
              <p className="text-xs font-semibold text-stone-600">
                Supports PNG, JPG, WebP, GIF. Automatically cropped & resized to high-resolution square.
              </p>
            </div>
            <button
              type="button"
              disabled={isProcessingFile}
              className="inline-flex items-center gap-2 bg-black text-white font-black text-xs uppercase px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_#FFF] cursor-pointer hover:bg-stone-800"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Choose Photo</span>
            </button>
          </div>

          {/* Web Image URL Alternative */}
          <form onSubmit={handleApplyCustomUrl} className="bg-white border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_0px_#000] space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              Or Link From Web (GitHub, Unsplash, etc.)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => {
                  setCustomUrlInput(e.target.value);
                  setUrlError('');
                }}
                placeholder="https://images.unsplash.com/... or https://github.com/username.png"
                className="flex-1 bg-[#FAF8F5] border-2 border-black rounded-xl px-3.5 py-2 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]"
              />
              <button
                type="submit"
                className="bg-[#4FD1C5] hover:bg-[#38b2ac] text-black font-black text-xs uppercase px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
              >
                Apply Link
              </button>
            </div>
            {urlError && (
              <div className="text-[11px] font-black text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{urlError}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 3: CUSTOM DICEBEAR GENERATOR */}
      {activeTab === 'generate' && (
        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000] space-y-5">
          <div className="space-y-1">
            <h4 className="text-sm font-black uppercase text-black flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#9B87F5]" />
              <span>Generate Unique Avatar Graphic</span>
            </h4>
            <p className="text-xs font-semibold text-stone-600">
              Type any name, nickname, or word to procedurally generate a one-of-a-kind vector avatar.
            </p>
          </div>

          {/* Style Selector */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-wider text-black">
              Graphic Art Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { key: 'bottts', label: '🤖 Cyber Bots' },
                { key: 'adventurer', label: '⚔️ Adventurer' },
                { key: 'lorelei', label: '🎨 Lorelei' },
                { key: 'pixel-art', label: '👾 8-Bit Pixel' },
                { key: 'fun-emoji', label: '😎 3D Emoji' }
              ].map((style) => (
                <button
                  key={style.key}
                  type="button"
                  onClick={() => {
                    setDicebearStyle(style.key as any);
                  }}
                  className={`p-2 rounded-xl text-xs font-black uppercase border-2 border-black text-center transition-all cursor-pointer ${
                    dicebearStyle === style.key
                      ? 'bg-[#9B87F5] text-black shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white hover:bg-stone-100'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Keyword Input & Action */}
          <form onSubmit={handleGenerateDicebear} className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-wider text-black">
              Seed Keyword / Persona Tag
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSeed}
                onChange={(e) => setCustomSeed(e.target.value)}
                placeholder="e.g. CyberNinja, RocketDev, Vaibhav, Luna"
                className="flex-1 bg-[#FAF8F5] border-2 border-black rounded-xl px-3.5 py-2 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#9B87F5]"
              />
              <button
                type="submit"
                className="bg-[#9B87F5] hover:bg-[#8570ec] text-black font-black text-xs uppercase px-5 py-2 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
              >
                Generate ✨
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Done / Close Bar if Modal */}
      {mode === 'modal' && onClose && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-black hover:bg-stone-800 text-white font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Done Selecting
          </button>
        </div>
      )}
    </div>
  );

  if (mode === 'inline') {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-3xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#FFDE59] border-2 border-black flex items-center justify-center font-black text-sm shadow-[1.5px_1.5px_0px_0px_#000]">
              🎭
            </span>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                Customize Profile Picture
              </h3>
              <p className="text-xs font-semibold text-stone-600">
                Upload your own photo or choose from our graphic collection.
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-white hover:bg-[#FF6B6B] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <X className="w-4 h-4 text-black" />
            </button>
          )}
        </div>

        {content}
      </div>
    </div>
  );
}
