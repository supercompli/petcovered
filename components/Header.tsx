
import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { PET_PLANS } from '../constants';
import { PetPlan } from '../types';

type HeaderView = 'home' | 'about' | 'claims' | 'plans' | 'quote';

interface HeaderProps {
  onViewChange: (view: HeaderView) => void;
  onPlanSelect: (planId: string) => void;
  currentView: HeaderView;
}

// Cats are cheaper on some plans, so the "from" price is the lower of the two.
const fromPrice = (plan: PetPlan) => Math.round(Math.min(plan.priceDog, plan.priceCat));

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onViewChange, onPlanSelect, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [mobilePlansOpen, setMobilePlansOpen] = useState(false);
  const plansRef = useRef<HTMLDivElement>(null);
  const plansToggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isQuotePage = currentView === 'quote';

  const closeMenus = () => {
    setIsOpen(false);
    setPlansOpen(false);
  };

  const handleNav = (view: HeaderView) => {
    onViewChange(view);
    closeMenus();
  };

  // Plain left-click runs the SPA navigation; modified clicks keep the browser's default (new tab etc.)
  const linkClick = (go: () => void) => (e: React.MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go();
    closeMenus();
  };

  const planLinkProps = (plan: PetPlan) => ({
    href: `/quote?plan=${encodeURIComponent(plan.id)}`,
    onClick: linkClick(() => onPlanSelect(plan.id)),
  });

  // Hover intent is mouse-only: touch fires emulated mouse events that would open the menu and
  // then immediately close it again when the toggle's own click lands.
  const openOnHover = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    setPlansOpen(true);
  };
  const closeOnLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPlansOpen(false), 120);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!plansOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!plansRef.current?.contains(e.target as Node)) setPlansOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setPlansOpen(false);
      if (plansRef.current?.contains(document.activeElement)) plansToggleRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [plansOpen]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {!isQuotePage && (
        <div className="bg-primary text-white text-xs py-2 px-4 flex justify-end gap-6 font-medium">
          <a href="mailto:hello@petcovered.co.za" className="hover:underline flex items-center gap-1 text-[10px] md:text-xs">
            <span className="opacity-80">hello@petcovered.co.za</span>
          </a>
          <a href="tel:0101094015" className="hover:underline text-[10px] md:text-xs">Call us 087 655 0525</a>
        </div>
      )}

      <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center ${isQuotePage ? 'py-3' : 'py-4'}`}>
        <button
          onClick={() => handleNav('home')}
          className="transition-transform hover:scale-105 active:scale-95"
        >
          <Logo />
        </button>

        {!isQuotePage ? (
          <>
            <div className="hidden md:flex items-center gap-6 lg:gap-8 font-semibold text-gray-700">
              <button
                onClick={() => handleNav('home')}
                className={`transition-colors ${currentView === 'home' ? 'text-primary' : 'hover:text-primary'}`}
              >
                Home
              </button>

              {/* Plans mega menu */}
              <div
                ref={plansRef}
                className="relative"
                onPointerEnter={openOnHover}
                onPointerLeave={closeOnLeave}
                onBlur={e => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPlansOpen(false);
                }}
              >
                <div className={`flex items-center gap-1 transition-colors ${currentView === 'plans' || plansOpen ? 'text-primary' : ''}`}>
                  <button
                    onClick={() => handleNav('plans')}
                    className="hover:text-primary transition-colors"
                  >
                    Plans
                  </button>
                  <button
                    ref={plansToggleRef}
                    type="button"
                    aria-label="Toggle plans menu"
                    aria-expanded={plansOpen}
                    aria-controls="plans-menu"
                    onClick={() => setPlansOpen(o => !o)}
                    className="p-0.5 -mr-0.5 rounded text-gray-400 hover:text-primary focus-visible:text-primary transition-colors"
                  >
                    <Chevron open={plansOpen} />
                  </button>
                </div>

                <div
                  id="plans-menu"
                  // Transitions use the destination state's property list: visibility is left out when opening
                  // so links are focusable immediately, and included when closing so the fade-out still plays.
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[36rem] lg:w-[40rem] duration-150 ${
                    plansOpen
                      ? 'opacity-100 visible translate-y-0 transition-[opacity,transform]'
                      : 'opacity-0 invisible -translate-y-1 transition-[opacity,transform,visibility]'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
                    <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-gray-400">Medical insurance plans</p>
                    <div className="grid grid-cols-2 gap-1">
                      {PET_PLANS.map(plan => (
                        <a
                          key={plan.id}
                          {...planLinkProps(plan)}
                          className="group flex flex-col gap-1 rounded-xl p-3 outline-none hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{plan.name}</span>
                            {plan.featured && (
                              <span className="shrink-0 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Most popular</span>
                            )}
                          </span>
                          <span className="text-xs font-medium text-gray-500 leading-snug">{plan.caption}</span>
                          <span className="text-xs font-bold text-gray-900 tabular-nums">
                            From R{fromPrice(plan)}<span className="font-medium text-gray-400">/mo</span>
                          </span>
                        </a>
                      ))}

                      <a
                        href="/plans"
                        onClick={linkClick(() => onViewChange('plans'))}
                        className="flex flex-col justify-center gap-1 rounded-xl p-3 bg-primary text-white outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 transition-opacity"
                      >
                        <span className="text-sm font-bold">Compare all plans →</span>
                        <span className="text-xs font-medium text-white/80 leading-snug">See every benefit side by side</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleNav('about')}
                className={`transition-colors ${currentView === 'about' ? 'text-primary' : 'hover:text-primary'}`}
              >
                About
              </button>
              <button
                onClick={() => handleNav('claims')}
                className={`transition-colors ${currentView === 'claims' ? 'text-primary' : 'hover:text-primary'}`}
              >
                How to Claim
              </button>
              <button
                onClick={() => handleNav('quote')}
                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-md"
              >
                Get Started
              </button>
            </div>

            <button
              className="md:hidden text-gray-500"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('plans')}
              className="text-gray-400 font-bold hover:text-primary transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              Exit Quote
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {isOpen && !isQuotePage && (
        <div id="mobile-menu" className="md:hidden bg-white border-t px-4 py-4 space-y-4 font-semibold shadow-xl">
          <button onClick={() => handleNav('home')} className={`block w-full text-left py-2 ${currentView === 'home' ? 'text-primary' : 'text-gray-700'}`}>Home</button>

          <div>
            <div className="flex items-center justify-between">
              <button onClick={() => handleNav('plans')} className={`block flex-1 text-left py-2 ${currentView === 'plans' ? 'text-primary' : 'text-gray-700'}`}>Plans</button>
              <button
                type="button"
                aria-label="Toggle plans list"
                aria-expanded={mobilePlansOpen}
                aria-controls="plans-menu-mobile"
                onClick={() => setMobilePlansOpen(o => !o)}
                className="p-2 -mr-2 text-gray-400"
              >
                <Chevron open={mobilePlansOpen} />
              </button>
            </div>
            {mobilePlansOpen && (
              <div id="plans-menu-mobile" className="ml-1 pl-3 border-l-2 border-primary/20">
                {PET_PLANS.map(plan => (
                  <a
                    key={plan.id}
                    {...planLinkProps(plan)}
                    className="flex items-center justify-between gap-3 py-2 text-sm font-medium text-gray-600"
                  >
                    <span>{plan.name}{plan.featured && <span className="ml-2 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Most popular</span>}</span>
                    <span className="text-xs text-gray-400 tabular-nums shrink-0">From R{fromPrice(plan)}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => handleNav('about')} className={`block w-full text-left py-2 ${currentView === 'about' ? 'text-primary' : 'text-gray-700'}`}>About Petcovered®</button>
          <button onClick={() => handleNav('claims')} className={`block w-full text-left py-2 ${currentView === 'claims' ? 'text-primary' : 'text-gray-700'}`}>How to Claim</button>
          <button onClick={() => handleNav('quote')} className="w-full bg-primary text-white px-6 py-3 rounded-xl shadow-lg">
            Get Started
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
