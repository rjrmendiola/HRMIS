import React, { useState } from 'react';
import { NavTab, User } from '../types';
import { LogOut, User as UserIcon, Menu, X, Shield, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenPortal: () => void;
  isPortalOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenPortal,
  isPortalOpen = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { label: string; tab: NavTab }[] = [
    { label: 'HOME', tab: 'HOME' },
    { label: 'ABOUT US', tab: 'ABOUT US' },
    { label: 'CONTACT', tab: 'CONTACT' },
  ];

  return (
    <header className="relative z-30 w-full pt-8 px-8 sm:px-14 lg:px-20 max-w-7xl mx-auto flex items-center justify-between">
      {/* Brand Logo */}
      <div 
        onClick={() => onSelectTab('HOME')}
        className="cursor-pointer group flex items-center gap-3 select-none"
      >
        <span className="text-2xl sm:text-3xl font-semibold tracking-wider text-white transition-transform group-hover:scale-[1.02]">
          HRMIS
        </span>
        {currentUser && (
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30">
            <Shield className="w-3 h-3 text-blue-400" />
            {currentUser.role}
          </span>
        )}
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center space-x-10 lg:space-x-12">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab && !isPortalOpen;
          return (
            <button
              key={item.tab}
              onClick={() => {
                onSelectTab(item.tab);
                setUserDropdownOpen(false);
              }}
              className={`relative text-[14px] lg:text-[15px] font-medium tracking-wide transition-colors py-1 ${
                isActive ? 'text-white' : 'text-slate-200 hover:text-white'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>
          );
        })}

        {/* Auth CTA / User Account state */}
        {!currentUser ? (
          <div className="flex items-center space-x-6 pl-2">
            <button
              onClick={() => onSelectTab('LOG IN')}
              className={`relative text-[14px] lg:text-[15px] font-medium tracking-wide transition-colors py-1 ${
                activeTab === 'LOG IN' ? 'text-white font-semibold' : 'text-slate-200 hover:text-white'
              }`}
            >
              LOG IN
              {activeTab === 'LOG IN' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('SIGN UP')}
              className={`relative text-[14px] lg:text-[15px] font-medium tracking-wide transition-colors py-1 ${
                activeTab === 'SIGN UP' ? 'text-white font-semibold' : 'text-slate-200 hover:text-white'
              }`}
            >
              SIGN UP
              {activeTab === 'SIGN UP' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>
          </div>
        ) : (
          <div className="relative flex items-center gap-4 pl-4 border-l border-blue-400/20">
            <button
              onClick={onOpenPortal}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                isPortalOpen
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'bg-blue-950/60 text-blue-200 hover:bg-blue-900/70 border border-blue-500/30'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              HR PORTAL
            </button>

            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-blue-400/40 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-sky-400 p-[1.5px] shadow-md">
                  <div className="w-full h-full rounded-full bg-[#081226] flex items-center justify-center overflow-hidden">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-blue-300" />
                    )}
                  </div>
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs font-medium text-white truncate max-w-[130px]">{currentUser.name}</p>
                  <p className="text-[10px] text-blue-300 truncate">{currentUser.username}</p>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#091224] border border-blue-500/30 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-blue-900/40 mb-1">
                    <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-blue-400 mt-0.5">{currentUser.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      onOpenPortal();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    Open HR Management Portal
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-blue-950/60 border border-blue-500/30 text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-6 right-6 p-5 rounded-2xl bg-[#091326] border border-blue-500/40 shadow-2xl z-50 flex flex-col space-y-4 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                onSelectTab(item.tab);
                setMobileMenuOpen(false);
              }}
              className={`text-left text-sm font-medium py-1.5 px-3 rounded-lg ${
                activeTab === item.tab ? 'bg-blue-600/30 text-white font-semibold' : 'text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-blue-900/50 flex flex-col space-y-2">
            {!currentUser ? (
              <>
                <button
                  onClick={() => {
                    onSelectTab('LOG IN');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm py-1.5 px-3 rounded-lg ${
                    activeTab === 'LOG IN' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300'
                  }`}
                >
                  LOG IN
                </button>
                <button
                  onClick={() => {
                    onSelectTab('SIGN UP');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm py-1.5 px-3 rounded-lg ${
                    activeTab === 'SIGN UP' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300'
                  }`}
                >
                  SIGN UP
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenPortal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-2 px-3 rounded-lg bg-blue-600 text-white text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  HR Portal Dashboard
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-2 px-3 rounded-lg text-rose-300 text-sm font-medium hover:bg-rose-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out ({currentUser.name})
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
