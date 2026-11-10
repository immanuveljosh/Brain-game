import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  Play,
  Grid,
  ListOrdered,
  Layers,
  Binary,
  Volume2,
  Shapes,
  BrainCircuit,
  ScanSearch,
  Search as SearchIcon,
  LayoutGrid,
  Calculator,
  Hash,
  HelpCircle,
  Percent,
  Zap,
  Palette,
  Target,
  RefreshCw,
  RotateCw,
  Sparkles,
  BookOpen,
  Shuffle,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import { GAMES_DATA, CATEGORIES_DATA } from '../utils/gamesData';
import { useAppStore } from '../store/useAppStore';

export const GameLibraryScreen: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    startPlayingGame,
    goBack,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const iconComponents: Record<string, React.FC<{ className?: string }>> = {
    Grid,
    ListOrdered,
    Layers,
    Binary,
    Volume2,
    Shapes,
    BrainCircuit,
    ScanSearch,
    Search: SearchIcon,
    LayoutGrid,
    Calculator,
    Hash,
    HelpCircle,
    Percent,
    Zap,
    Palette,
    Target,
    RefreshCw,
    RotateCw,
    Sparkles,
    Inspect: ScanSearch,
    Compass: Target,
    BookOpen,
    Shuffle,
    SpellCheck: BookOpen,
    Link: LinkIcon,
  };

  const currentCategoryObj = CATEGORIES_DATA.find((c) => c.category === selectedCategory);

  const filteredGames = GAMES_DATA.filter((game) => {
    const matchesCategory = !selectedCategory || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff =
      selectedDifficulty === 'All' || game.difficulty === selectedDifficulty;
    return matchesCategory && matchesSearch && matchesDiff;
  });

  const handlePlayGame = (gameId: string) => {
    if (gameId === 'card-matching' || gameId === 'number-recall' || gameId === 'sound-memory') {
      startPlayingGame('memory-tiles');
    } else if (gameId === 'logic-master' || gameId === 'odd-one-out' || gameId === 'brain-detective' || gameId === 'sudoku') {
      startPlayingGame('pattern-master');
    } else if (gameId === 'number-challenge' || gameId === 'missing-numbers' || gameId === 'calculation-race') {
      startPlayingGame('math-sprint');
    } else if (gameId === 'focus-finder' || gameId === 'attention-switch') {
      startPlayingGame('reaction-test');
    } else if (gameId === 'shape-rotation' || gameId === 'visual-patterns' || gameId === 'image-differences' || gameId === 'brain-maze') {
      startPlayingGame('pattern-master');
    } else if (gameId === 'word-master' || gameId === 'anagram' || gameId === 'vocabulary-quiz' || gameId === 'word-connections') {
      startPlayingGame('color-confusion');
    } else {
      startPlayingGame(gameId);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedDifficulty('All');
  };

  return (
    <div className="p-4 max-w-md md:max-w-5xl mx-auto space-y-4 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-emerald-950/[0.08]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className="p-2 rounded-xl bg-white border border-emerald-950/[0.08] text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/40 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {selectedCategory && currentCategoryObj
                ? `${currentCategoryObj.name} Training`
                : 'Cognitive Game Library'}
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              {selectedCategory && currentCategoryObj
                ? `Specialized ${currentCategoryObj.name.toLowerCase()} exercises (${filteredGames.length})`
                : `${filteredGames.length} of 26 cognitive training exercises`}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Difficulty Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search games, cognitive skills, or categories..."
            aria-label="Search games"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-emerald-950/[0.1] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Difficulty Segmented Control */}
        <div className="flex items-center gap-1 bg-emerald-50/70 border border-emerald-200/70 p-1 rounded-xl shrink-0">
          <span className="text-emerald-700 text-[11px] font-medium flex items-center gap-1 px-2">
            <Filter className="w-3 h-3" />
          </span>
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all tabular-nums ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_3px_10px_rgba(5,150,105,0.22)]'
              : 'bg-white border border-emerald-950/[0.08] text-slate-600 hover:text-emerald-700 hover:border-emerald-200'
          }`}
        >
          All (26)
        </button>
        {CATEGORIES_DATA.map((cat) => (
          <button
            key={cat.category}
            type="button"
            onClick={() => setSelectedCategory(cat.category)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all tabular-nums ${
              selectedCategory === cat.category
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_3px_10px_rgba(5,150,105,0.22)]'
                : 'bg-white border border-emerald-950/[0.08] text-slate-600 hover:text-emerald-700 hover:border-emerald-200'
            }`}
          >
            {cat.name} ({cat.gamesCount})
          </button>
        ))}
      </div>

      {/* Game Cards Grid */}
      {filteredGames.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-emerald-950/[0.08] text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">No matching games found</div>
            <p className="text-xs text-slate-500 mt-0.5">
              No exercises matched &ldquo;{searchTerm}&rdquo; with {selectedDifficulty} difficulty.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredGames.map((game) => {
            const Icon = iconComponents[game.iconName] || Grid;
            const categoryArtMap: Record<string, { src: string; filter: string; badge: string }> = {
              memory: { src: '/images/memory-art.jpg', filter: '', badge: 'text-orange-600 border-orange-200' },
              logic: { src: '/images/logic-art.jpg', filter: '', badge: 'text-blue-600 border-blue-200' },
              math: { src: '/images/math-art.jpg', filter: '', badge: 'text-emerald-600 border-emerald-200' },
              focus: { src: '/images/focus-art.jpg', filter: 'hue-rotate-[110deg] saturate-150', badge: 'text-violet-600 border-violet-200' },
              visual: { src: '/images/visual-art.jpg', filter: '', badge: 'text-pink-600 border-pink-200' },
              language: { src: '/images/language-art.jpg', filter: 'hue-rotate-[-95deg] saturate-150', badge: 'text-amber-600 border-amber-200' },
            };
            const thumb = categoryArtMap[game.category] || categoryArtMap.math;

            const diffColor =
              game.difficulty === 'Easy'
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200/80'
                : game.difficulty === 'Medium'
                ? 'text-blue-700 bg-blue-50 border-blue-200/80'
                : 'text-orange-700 bg-orange-50 border-orange-200/80';

            return (
              <div
                key={game.id}
                onClick={() => handlePlayGame(game.id)}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/15 border border-emerald-950/[0.08] hover:border-emerald-300 shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] hover:shadow-[0_10px_24px_-4px_rgba(5,150,105,0.12)] transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer"
              >
                {/* Left: 3D Artwork Thumbnail & Info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-2xs bg-slate-50">
                    <img
                      src={thumb.src}
                      alt={game.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${thumb.filter}`}
                    />
                    <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-md bg-white/95 border flex items-center justify-center shadow-2xs ${thumb.badge}`}>
                      <Icon className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                        {game.title}
                      </h3>
                      {game.isPlayable && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                          Interactive
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {game.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 tabular-nums">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${diffColor}`}>
                        {game.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Best: {game.highScore} pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Play Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayGame(game.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-[0_4px_12px_rgba(5,150,105,0.22)] flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
