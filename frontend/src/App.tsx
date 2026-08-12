import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { TenderDetails } from './pages/TenderDetails';
import { CompanyProfile } from './pages/CompanyProfile';
import { AnalyticsDashboard } from './pages/Analytics';
import { TeamCollaboration } from './pages/Team';
import { SettingsPanel } from './pages/HelperPages';
import { api, type Tender } from './services/api';
import { Search, Bell, Monitor, Keyboard, User, Plus, PenTool, ChevronDown, Check } from 'lucide-react';

type PageState = 'landing' | 'login' | 'register' | 'app';

export interface PresetColors {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  hover: string;
  success: string;
  warning: string;
  danger: string;
}

export const THEME_PRESETS: Record<string, PresetColors> = {
  'executive-blue': {
    primary: '#2563EB', secondary: '#475569', accent: '#3B82F6',
    bg: '#0F172A', surface: '#111827', card: '#1E293B', border: '#334155',
    text: '#F8FAFC', muted: '#94A3B8', hover: '#1D4ED8',
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  },
  'midnight-black': {
    primary: '#FAFAFA', secondary: '#27272A', accent: '#E4E4E7',
    bg: '#09090B', surface: '#121214', card: '#18181B', border: '#27272A',
    text: '#F4F4F5', muted: '#A1A1AA', hover: '#FFFFFF',
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  },
  'forest-green': {
    primary: '#10B981', secondary: '#047857', accent: '#34D399',
    bg: '#022C22', surface: '#064E3B', card: '#064E3B', border: '#115E59',
    text: '#F0FDF4', muted: '#A7F3D0', hover: '#059669',
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  },
  'graphite-gray': {
    primary: '#E4E4E7', secondary: '#52525B', accent: '#D4D4D8',
    bg: '#18181B', surface: '#202023', card: '#27272A', border: '#3F3F46',
    text: '#FAFAFA', muted: '#A1A1AA', hover: '#FFFFFF',
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  },
  'royal-purple': {
    primary: '#8B5CF6', secondary: '#6D28D9', accent: '#A78BFA',
    bg: '#1E1B4B', surface: '#2D2654', card: '#2D2654', border: '#4C1D95',
    text: '#F5F3FF', muted: '#DDD6FE', hover: '#7C3AED',
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  },
  'carbon-dark': {
    primary: '#FFFFFF', secondary: '#262626', accent: '#D4D4D8',
    bg: '#0A0A0A', surface: '#141414', card: '#1C1C1C', border: '#262626',
    text: '#F5F5F5', muted: '#A3A3A3', hover: '#E5E5E5',
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  },
  'arctic-white': {
    primary: '#1F2937', secondary: '#E5E7EB', accent: '#4B5563',
    bg: '#F9FAFB', surface: '#FFFFFF', card: '#FFFFFF', border: '#E5E7EB',
    text: '#111827', muted: '#6B7280', hover: '#374151',
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  },
  'azure-enterprise': {
    primary: '#0052CC', secondary: '#DFE1E6', accent: '#0065FF',
    bg: '#FAFBFC', surface: '#FFFFFF', card: '#FFFFFF', border: '#DFE1E6',
    text: '#172B4D', muted: '#5E6C84', hover: '#0047B3',
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  },
  'emerald-pro': {
    primary: '#059669', secondary: '#D1FAE5', accent: '#10B981',
    bg: '#F0FDF4', surface: '#FFFFFF', card: '#FFFFFF', border: '#D1FAE5',
    text: '#065F46', muted: '#047857', hover: '#047857',
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  },
  'crimson-executive': {
    primary: '#DC2626', secondary: '#FEE2E2', accent: '#EF4444',
    bg: '#FEF2F2', surface: '#FFFFFF', card: '#FFFFFF', border: '#FEE2E2',
    text: '#991B1B', muted: '#B91C1C', hover: '#B91C1C',
    success: '#10B981', warning: '#F59E0B', danger: '#EF4444'
  }
};

function App() {
  const [page, setPage] = useState<PageState>('landing');
  const [tab, setTab] = useState<string>('dashboard');
  const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);
  const [pinnedTenders, setPinnedTenders] = useState<Tender[]>([]);

  // Design Tokens States
  const [preset, setPreset] = useState<string>(localStorage.getItem('ds-preset') || 'executive-blue');
  const [themeMode, setThemeMode] = useState<string>(localStorage.getItem('ds-mode') || 'dark-pro');
  const [fontFamily, setFontFamily] = useState<string>(localStorage.getItem('ds-font') || 'Inter');
  const [fontWeight, setFontWeight] = useState<string>(localStorage.getItem('ds-weight') || '500');
  const [letterSpacing, setLetterSpacing] = useState<string>(localStorage.getItem('ds-spacing') || 'normal');
  const [lineHeight, setLineHeight] = useState<string>(localStorage.getItem('ds-lineheight') || 'normal');
  const [componentStyle, setComponentStyle] = useState<string>(localStorage.getItem('ds-comp-style') || 'soft');
  const [animationSpeed, setAnimationSpeed] = useState<string>(localStorage.getItem('ds-anim-speed') || 'balanced');
  const [sidebarStyle, setSidebarStyle] = useState<string>(localStorage.getItem('ds-sidebar-style') || 'classic');
  const [cardStyle, setCardStyle] = useState<string>(localStorage.getItem('ds-card-style') || 'glass');
  const [buttonStyle, setButtonStyle] = useState<string>(localStorage.getItem('ds-btn-style') || 'soft');
  const [iconStyle, setIconStyle] = useState<string>(localStorage.getItem('ds-icon-style') || 'outlined');
  const [density, setDensity] = useState<string>(localStorage.getItem('ds-density') || 'comfortable');

  // Custom Color overrides
  const [customPrimary, setCustomPrimary] = useState<string>(localStorage.getItem('ds-c-primary') || '#3B82F6');
  const [customBg, setCustomBg] = useState<string>(localStorage.getItem('ds-c-bg') || '#0F172A');
  const [customSurface, setCustomSurface] = useState<string>(localStorage.getItem('ds-c-surface') || '#111827');
  const [customText, setCustomText] = useState<string>(localStorage.getItem('ds-c-text') || '#F8FAFC');

  const [activeWorkspace, setActiveWorkspace] = useState('BuildCorp Main Suite');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const [showPalette, setShowPalette] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // Shade generator helper
  const generateShades = (hexColor: string) => {
    const c = hexColor.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;

    const blend = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, ratio: number) => {
      const nr = Math.round(r1 + (r2 - r1) * ratio);
      const ng = Math.round(g1 + (g2 - g1) * ratio);
      const nb = Math.round(b1 + (b2 - b1) * ratio);
      return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
    };

    return {
      100: blend(r, g, b, 255, 255, 255, 0.8),
      200: blend(r, g, b, 255, 255, 255, 0.6),
      300: blend(r, g, b, 255, 255, 255, 0.4),
      400: blend(r, g, b, 255, 255, 255, 0.2),
      500: hexColor,
      600: blend(r, g, b, 0, 0, 0, 0.2),
      700: blend(r, g, b, 0, 0, 0, 0.4),
      800: blend(r, g, b, 0, 0, 0, 0.6),
      900: blend(r, g, b, 0, 0, 0, 0.8)
    };
  };

  useEffect(() => {
    const root = document.documentElement;
    const activePreset = THEME_PRESETS[preset] || THEME_PRESETS['executive-blue'];

    root.style.setProperty('--bg-color', activePreset.bg);
    root.style.setProperty('--surface-color', activePreset.surface);
    root.style.setProperty('--card-color', activePreset.card);
    root.style.setProperty('--border-color', activePreset.border);
    root.style.setProperty('--text-color', activePreset.text);
    root.style.setProperty('--text-secondary', activePreset.muted);
    root.style.setProperty('--accent-color', activePreset.accent);
    root.style.setProperty('--success-color', activePreset.success);
    root.style.setProperty('--warning-color', activePreset.warning);
    root.style.setProperty('--danger-color', activePreset.danger);

    const shades = generateShades(activePreset.accent);
    Object.entries(shades).forEach(([sh, hex]) => {
      root.style.setProperty(`--accent-${sh}`, hex);
    });

    root.style.setProperty('--font-family', fontFamily === 'SF Pro' ? '-apple-system, BlinkMacSystemFont' : fontFamily);
    root.style.setProperty('--font-weight', fontWeight);
    
    const letterSp = letterSpacing === 'tight' ? '-0.02em' : letterSpacing === 'wide' ? '0.04em' : 'normal';
    root.style.setProperty('--letter-spacing', letterSp);

    const lineHt = lineHeight === 'relaxed' ? '1.6' : lineHeight === 'snug' ? '1.3' : '1.5';
    root.style.setProperty('--line-height', lineHt);

    let rad = '12px';
    if (componentStyle === 'square') rad = '0px';
    else if (componentStyle === 'minimal') rad = '6px';
    else if (componentStyle === 'corporate') rad = '8px';
    else if (componentStyle === 'modern') rad = '16px';
    root.style.setProperty('--border-radius', rad);

    let spd = '250ms';
    if (animationSpeed === 'none') spd = '0ms';
    else if (animationSpeed === 'fast') spd = '120ms';
    else if (animationSpeed === 'smooth') spd = '400ms';
    else if (animationSpeed === 'luxury') spd = '650ms';
    root.style.setProperty('--transition-speed', spd);

    let pad = '20px';
    if (density === 'compact') pad = '12px';
    else if (density === 'ultra-compact') pad = '8px';
    else if (density === 'large') pad = '28px';
    root.style.setProperty('--density-padding', pad);

    localStorage.setItem('ds-preset', preset);
    localStorage.setItem('ds-mode', themeMode);
    localStorage.setItem('ds-font', fontFamily);
    localStorage.setItem('ds-weight', fontWeight);
    localStorage.setItem('ds-spacing', letterSpacing);
    localStorage.setItem('ds-lineheight', lineHeight);
    localStorage.setItem('ds-comp-style', componentStyle);
    localStorage.setItem('ds-anim-speed', animationSpeed);
    localStorage.setItem('ds-sidebar-style', sidebarStyle);
    localStorage.setItem('ds-card-style', cardStyle);
    localStorage.setItem('ds-btn-style', buttonStyle);
    localStorage.setItem('ds-icon-style', iconStyle);
    localStorage.setItem('ds-density', density);
    localStorage.setItem('ds-c-primary', customPrimary);
    localStorage.setItem('ds-c-bg', customBg);
    localStorage.setItem('ds-c-surface', customSurface);
    localStorage.setItem('ds-c-text', customText);
  }, [
    preset, themeMode, fontFamily, fontWeight, letterSpacing, lineHeight,
    componentStyle, animationSpeed, sidebarStyle, cardStyle, buttonStyle,
    iconStyle, density, customPrimary, customBg, customSurface, customText
  ]);

  const fetchPinnedTenders = async () => {
    try {
      const data = await api.getSavedTenders();
      setPinnedTenders(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setPage('app');
      fetchPinnedTenders();
    } else {
      setPage('landing');
    }
  }, []);

  // Sync Pinned list on transitions
  useEffect(() => {
    if (page === 'app') {
      fetchPinnedTenders();
    }
  }, [tab, selectedTenderId]);

  // Global keydown listeners for shortcuts including Ctrl+Shift+P, Ctrl+P, Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowPalette(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (selectedTenderId) {
          api.toggleBookmark(selectedTenderId).then(() => {
            fetchPinnedTenders();
          });
        }
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setTab('settings');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTenderId]);

  const handleLoginSuccess = () => {
    setPage('app');
    setTab('dashboard');
    setSelectedTenderId(null);
    fetchPinnedTenders();
  };

  const handleLogout = () => {
    setPage('landing');
    setSelectedTenderId(null);
  };

  const handleSelectTender = (id: number) => {
    setSelectedTenderId(id);
    setTab('tenders');
  };

  const handleBackToTendersList = () => {
    setSelectedTenderId(null);
    setTab('tenders');
  };

  const handlePinToggle = async (id: number) => {
    await api.toggleBookmark(id);
    fetchPinnedTenders();
  };

  const renderAppContent = () => {
    switch (tab) {
      case 'dashboard':
        return <Dashboard onSelectTender={handleSelectTender} forceSubTab="dashboard" onPinToggle={handlePinToggle} />;
      case 'tenders':
        return selectedTenderId ? (
          <TenderDetails tenderId={selectedTenderId} onBack={handleBackToTendersList} onPinToggle={handlePinToggle} />
        ) : (
          <Dashboard onSelectTender={handleSelectTender} forceSubTab="catalog" onPinToggle={handlePinToggle} />
        );
      case 'company':
        return <CompanyProfile />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'team':
        return <TeamCollaboration />;
      case 'settings':
        return (
          <SettingsPanel
            preset={preset}
            setPreset={setPreset}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontWeight={fontWeight}
            setFontWeight={setFontWeight}
            letterSpacing={letterSpacing}
            setLetterSpacing={setLetterSpacing}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            componentStyle={componentStyle}
            setComponentStyle={setComponentStyle}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
            sidebarStyle={sidebarStyle}
            setSidebarStyle={setSidebarStyle}
            cardStyle={cardStyle}
            setCardStyle={setCardStyle}
            buttonStyle={buttonStyle}
            setButtonStyle={setButtonStyle}
            iconStyle={iconStyle}
            setIconStyle={setIconStyle}
            density={density}
            setDensity={setDensity}
            customPrimary={customPrimary}
            setCustomPrimary={setCustomPrimary}
            customBg={customBg}
            setCustomBg={setCustomBg}
            customSurface={customSurface}
            setCustomSurface={setCustomSurface}
            customText={customText}
            setCustomText={setCustomText}
          />
        );
      default:
        return <Dashboard onSelectTender={handleSelectTender} forceSubTab="dashboard" onPinToggle={handlePinToggle} />;
    }
  };

  const notifications = [
    { id: 1, text: 'Corrigendum detected: deadline revised to 2026-09-15.', time: '10m' },
    { id: 2, text: 'Contractor license Class-A expires in 30 days.', time: '2h' },
    { id: 3, text: 'Specifications parsed for Elevated Viaduct.', time: '1d' }
  ];

  if (page === 'landing') {
    return <Landing onEnter={() => setPage('login')} />;
  }

  if (page === 'login') {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => setPage('register')}
        onGoToLanding={() => setPage('landing')}
      />
    );
  }

  if (page === 'register') {
    return (
      <Register
        onRegisterSuccess={() => setPage('login')}
        onGoToLogin={() => setPage('login')}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans relative">
      <Sidebar
        currentTab={tab}
        setCurrentTab={(newTab) => {
          setTab(newTab);
          if (newTab !== 'tenders') {
            setSelectedTenderId(null);
          }
        }}
        onLogout={handleLogout}
        pinnedTenders={pinnedTenders}
        onSelectTender={handleSelectTender}
        selectedTenderId={selectedTenderId}
        onPinToggle={handlePinToggle}
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-dark-bg">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-surface border-b border-slate-border flex items-center justify-between px-8 shrink-0 select-none">
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                className="flex items-center gap-2 text-xs font-bold text-[#F8FAFC] hover:opacity-80 transition-all"
              >
                <span>{activeWorkspace}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>
              {showWorkspaceMenu && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-surface border border-slate-border rounded-lg p-1.5 shadow-premium space-y-0.5 z-40">
                  {['BuildCorp Main Suite', 'West Zone Infrastructure Project', 'Delhi Metro JV Syndicate'].map((w) => (
                    <button
                      key={w}
                      onClick={() => { setActiveWorkspace(w); setShowWorkspaceMenu(false); }}
                      className="w-full text-left text-xs px-2.5 py-2 rounded-md hover:bg-slate-800 text-[#F8FAFC] flex justify-between items-center"
                    >
                      <span>{w}</span>
                      {activeWorkspace === w && <Check size={12} className="text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div onClick={() => setShowPalette(true)} className="relative w-64 hidden md:block cursor-pointer">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#94A3B8]">
                <Search size={14} />
              </span>
              <input
                type="text"
                readOnly
                placeholder="Search index (Ctrl+K)..."
                className="w-full bg-dark-bg border border-slate-border rounded-lg py-1.5 pl-9 pr-4 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick theme preset dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 text-slate-400 hover:text-[#F8FAFC] transition-colors"
                title="Select Theme Preset"
              >
                <Monitor size={15} />
              </button>
              {showThemeMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-slate-border rounded-lg p-1.5 shadow-premium space-y-0.5 z-40 max-h-60 overflow-y-auto">
                  {Object.keys(THEME_PRESETS).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPreset(p); setShowThemeMenu(false); }}
                      className="w-full text-left text-xs px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-[#F8FAFC] flex justify-between items-center capitalize"
                    >
                      <span>{p.replace('-', ' ')}</span>
                      {preset === p && <Check size={12} className="text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowShortcutsModal(true)}
              className="p-2 text-slate-400 hover:text-[#F8FAFC] transition-colors"
              title="Keyboard Shortcuts Map"
            >
              <Keyboard size={15} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="p-2 text-slate-400 hover:text-[#F8FAFC] transition-colors relative"
              >
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full"></span>
              </button>
              {showNotificationMenu && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-surface border border-slate-border rounded-lg p-3 shadow-premium z-40 text-xs text-left space-y-2.5">
                  <h4 className="font-bold text-[#F8FAFC] border-b border-slate-border pb-1.5">Notifications Alert</h4>
                  {notifications.map(n => (
                    <div key={n.id} className="flex justify-between items-start gap-2 border-b border-slate-border/40 pb-2 last:border-0 last:pb-0">
                      <span className="text-[#94A3B8] text-[11px] leading-relaxed">{n.text}</span>
                      <span className="text-[9px] text-slate-500 font-mono shrink-0">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[10px] font-bold text-success-custom bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/25 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-success-custom rounded-full animate-pulse"></span>
              Sync
            </span>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400 cursor-pointer"
              >
                <User size={13} />
              </button>
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-slate-border rounded-lg p-1.5 shadow-premium space-y-0.5 z-40 text-xs text-left">
                  <span className="block px-2.5 py-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Account Action</span>
                  <button onClick={() => { setTab('company'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-md hover:bg-slate-800 text-[#F8FAFC]">My Profile</button>
                  <button onClick={() => { setTab('settings'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-md hover:bg-slate-800 text-[#F8FAFC]">Appearance</button>
                  <button onClick={() => { setShowShortcutsModal(true); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-md hover:bg-slate-800 text-[#F8FAFC]">Keyboard Shortcuts</button>
                  <button onClick={handleLogout} className="w-full text-left px-2.5 py-2 rounded-md hover:bg-rose-950/20 text-rose-400 border-t border-slate-border/50 mt-1">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-dark-bg">
          <div className="max-w-[1600px] mx-auto p-8 w-full">
            {renderAppContent()}
          </div>
        </main>
      </div>

      {/* COMMAND PALETTE MODAL (Ctrl+K) */}
      {showPalette && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 select-none">
          <div className="w-full max-w-xl bg-surface border border-slate-border rounded-xl shadow-premium overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-border flex items-center gap-3">
              <Search className="text-slate-400" size={16} />
              <input
                type="text"
                autoFocus
                placeholder="Search workspaces actions..."
                className="w-full bg-transparent border-0 outline-none text-[#F8FAFC] placeholder-slate-550"
              />
              <button onClick={() => setShowPalette(false)} className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-400">ESC</button>
            </div>
            
            <div className="p-2 space-y-0.5 text-left">
              {[
                { label: 'Jump to Dashboard', action: () => { setTab('dashboard'); setShowPalette(false); }, icon: Monitor },
                { label: 'Ingest Tender Specifications PDF', action: () => { setTab('tenders'); setSelectedTenderId(null); setShowPalette(false); }, icon: Plus },
                { label: 'Audit Company Profile parameters', action: () => { setTab('company'); setShowPalette(false); }, icon: User },
                { label: 'Clarify with AI Procurement Copilot', action: () => { setTab('tenders'); if (selectedTenderId === null) handleSelectTender(1); setShowPalette(false); }, icon: Sparkles }
              ].map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.label}
                    onClick={opt.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-850 text-indigo-400 transition-colors"
                  >
                    <Icon size={14} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* KEYBOARD SHORTCUTS INSTRUCTIONS MODAL */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center select-none">
          <div className="bg-surface border border-slate-border rounded-xl p-6 w-full max-w-sm shadow-premium text-left text-xs space-y-4">
            <h3 className="font-bold text-[#F8FAFC] border-b border-slate-border pb-2 flex items-center gap-2">
              <Keyboard size={16} className="text-[#6366F1]" /> Keyboard Shortcuts Map
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Toggle Command Palette</span>
                <kbd className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">Ctrl + K</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Pin/Unpin Current Tender</span>
                <kbd className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">Ctrl + Shift + P</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Go to Appearance Settings</span>
                <kbd className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">Ctrl + P</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Back to catalog List</span>
                <kbd className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">ESC</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcutsModal(false)}
              className="w-full bg-[#6366F1] hover:bg-indigo-650 text-white rounded-lg py-2 font-bold text-center text-xs transition-all"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* FLOATING ACTION TOOL HUB */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        {showFloatingMenu && (
          <div className="bg-surface border border-slate-border rounded-xl p-2.5 shadow-premium mb-3 flex flex-col gap-2 text-xs text-left animate-fade-in w-48 bg-card-bg">
            <button onClick={() => { setTab('tenders'); setSelectedTenderId(null); setShowFloatingMenu(false); }} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-md text-[#F8FAFC]">
              <Plus size={13} className="text-indigo-400" />
              <span>Create Tender</span>
            </button>
            <button onClick={() => { setTab('tenders'); if (selectedTenderId === null) handleSelectTender(1); setShowFloatingMenu(false); }} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-md text-[#F8FAFC]">
              <PenTool size={13} className="text-indigo-400" />
              <span>Draft Proposal</span>
            </button>
          </div>
        )}
        <button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-premium hover:opacity-90 transition-all font-bold text-lg"
          title="Quick Actions Command Hub"
        >
          {showFloatingMenu ? '×' : '+'}
        </button>
      </div>

    </div>
  );
}

const Sparkles = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5 5 3Z"/>
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z"/>
  </svg>
);

export default App;
