"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe, ChevronDown, ArrowRight, ShoppingCart, LogOut, LayoutDashboard, Lock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "@/lib/gsap";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchCartCount, clearCredentials } from "@/redux/userSlice";
import api from "@/services/api";

// i18n Imports
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

type NavItem = { name: string; href: string };
type NavLink = NavItem & { hasDropdown?: boolean; items?: NavItem[] };

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuBgVisible, setIsMenuBgVisible] = useState(false);
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const cartCount = useSelector((s: RootState) => s.user.cartCount);
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
  const role = useSelector((s: RootState) => s.user.role);
  const userType = useSelector((s: RootState) => s.user.userType);
  const fullName = useSelector((s: RootState) => s.user.fullName);
  const userEmail = useSelector((s: RootState) => s.user.email);
  const [profileOpen, setProfileOpen] = useState(false);

  // i18n Hook and Data Selection
  const { locale, changeLocale } = useLocale();
  const navData = translations[locale] as { navLinks: NavLink[]; footer: { innerPages: NavItem[] } };
  const { navLinks, footer } = navData;
  const innerPages = footer.innerPages;
  const loginLabel = translations[locale]?.loginPage?.navLogin || translations.en.loginPage.navLogin;
  const isRtl = locale === "ar";
  const profileLabels = {
    profile: isRtl ? "ملفي الشخصي" : "My Profile",
    orders: isRtl ? "طلباتي" : "My Orders",
    logout: isRtl ? "تسجيل الخروج" : "Logout",
    guest: isRtl ? "ضيف" : "Guest",
    communityDashboard: isRtl ? "لوحة المجتمع" : "Community Dashboard",
    membersOnly: isRtl ? "للأعضاء فقط" : "Members only",
  };
  const mobileLoginLabel = isRtl ? "دخول" : loginLabel;

  const isLinkActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Refresh cart count on every page navigation
  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCartCount());
  }, [pathname, isAuthenticated, dispatch]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const timer = setTimeout(() => setIsMenuBgVisible(true), 300);
      gsap.fromTo(
        ".mobile-link",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out", delay: 0.2 }
      );
      return () => clearTimeout(timer);
    } else {
      setIsMenuBgVisible(false);
      setExpandedLink(null);
    }
  }, [isMobileMenuOpen]);

  const handleCloseMenu = () => {
    setIsMenuBgVisible(false);
    setExpandedLink(null);
    setTimeout(() => setIsMobileMenuOpen(false), 400);
  };

  const toggleExpand = (name: string) => {
    setExpandedLink(expandedLink === name ? null : name);
  };

  const initials =
    fullName?.charAt(0)?.toUpperCase() ||
    userEmail?.charAt(0)?.toUpperCase() ||
    "U";

  function getProfileRoutes() {
    if (role === "admin" || role === "internal_staff") return { profile: "/admindashboard", orders: "/admindashboard/orders" };
    if (role === "consultant") return { profile: "/consultant/profile", orders: "/consultant/appointments" };
    return { profile: "/guestprofile", orders: "/guestprofile/history" };
  }

  async function handleLogout() {
    handleCloseMenu();
    await api.post("/account/logout/").catch(() => {});
    dispatch(clearCredentials());
    router.push("/login");
  }

  if (!mounted) return null;

  const routes = getProfileRoutes();

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-1000 transition-all duration-500",
          isMenuBgVisible || isScrolled || pathname !== "/"
            ? "bg-[#1A4331]/95 backdrop-blur-md shadow-lg"
            : "bg-[#1A4331]/95 backdrop-blur-md shadow-lg"
        )}
      >
        <div className="container relative mx-auto px-4 flex items-center justify-between h-14 md:h-20">
          {/* Mobile Login/Profile Icon */}
          <div className="relative flex w-25 items-center justify-start md:w-40 lg:hidden">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  if (isMobileMenuOpen) handleCloseMenu();
                  setProfileOpen((v) => !v);
                }}
                aria-label={profileLabels.profile}
                className="w-10 h-10 rounded-full bg-[#b47800] flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition"
              >
                {initials}
              </button>
            ) : (
              <Link
                href="/login"
                aria-label={mobileLoginLabel}
                className="flex h-10 min-w-22 items-center justify-center rounded-full border border-white/30 px-4 text-sm font-bold text-white hover:bg-white/10 transition whitespace-nowrap"
              >
                {mobileLoginLabel}
              </Link>
            )}

            {isAuthenticated && profileOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
            )}

            {isAuthenticated && profileOpen && (
              <div
                dir={isRtl ? "rtl" : "ltr"}
                className="absolute left-0 top-12 z-50 w-64 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-4 text-left rtl:text-right">
                  <div className="w-10 h-10 rounded-full bg-[#b47800] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {fullName || userEmail}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{userEmail}</p>
                    {userType === "guest" && (
                      <span className="inline-block mt-1 rounded-full bg-[#fef3c7] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#92400e]">
                        {profileLabels.guest}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 mx-1" />

                <div className="py-1.5">
                  <Link
                    href={routes.profile}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                  >
                    {profileLabels.profile}
                  </Link>
                  <Link
                    href={routes.orders}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                  >
                    {profileLabels.orders}
                  </Link>

                  {role === "community_user" && (
                    <Link
                      href="/communityDashBoard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                    >
                      {userType === "member" ? (
                        <>
                          <LayoutDashboard size={14} className="shrink-0 text-[#0a4833]" />
                          {profileLabels.communityDashboard}
                        </>
                      ) : (
                        <>
                          <Lock size={14} className="shrink-0 text-gray-400" />
                          <span>{profileLabels.communityDashboard}</span>
                          <span className="ms-auto rounded-full bg-[#fef3c7] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#92400e]">
                            {profileLabels.membersOnly}
                          </span>
                        </>
                      )}
                    </Link>
                  )}
                </div>

                <div className="border-t border-gray-100 mx-1" />

                <div className="py-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors"
                  >
                    <LogOut size={14} />
                    {profileLabels.logout}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hanging Logo */}
          <div className="absolute left-1/2 z-50 w-25 -translate-x-1/2 md:w-40 lg:relative lg:left-auto lg:ml-20 lg:translate-x-0">
            <Link href="/" className="block">
              <div className={cn(
                "absolute transition-all duration-500 overflow-hidden flex items-center justify-center p-2 md:p-3",
                "bg-[#1A4331] border-x border-b border-white/10 rounded-b-xl shadow-2xl",
                "w-21.25 h-21.25 md:w-26.25 md:h-26.25 lg:w-30 lg:h-30 xl:w-33.75 xl:h-33.75",
                "-top-10 translate-y-0 left-1/2 -translate-x-1/2 lg:left-1 lg:translate-x-0 xl:left-4 2xl:-left-8"
              )}>
                <div className="relative w-full h-full scale-100 transition-transform duration-500">
                  <Image
                    src="/logo/zewadi-logo.webp"
                    alt="Zewadi Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link: NavLink) => (
              <div key={link.name} className="relative group py-4">
                {link.hasDropdown ? (
                  <div className="flex items-center gap-1 text-[15px] font-semibold text-white/90 hover:text-brand-primary transition-all duration-300 cursor-pointer">
                    {link.name}
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                    <div className="absolute top-full left-0 mt-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-1100">
                      <div className="bg-[#1A4331] border border-white/10 rounded-xl shadow-2xl p-4 min-w-50 backdrop-blur-xl">
                        <div className="flex flex-col space-y-1">
                          {(link.items ?? innerPages).map((item: NavItem) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="text-white/70 hover:text-brand-primary hover:bg-white/5 px-4 py-2.5 rounded-lg transition-all text-sm font-medium whitespace-nowrap flex items-center justify-between group/item"
                            >
                              {item.name}
                              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[15px] font-semibold transition-all duration-300",
                      isLinkActive(link.href) ? "text-brand-primary" : "text-white/90 hover:text-brand-primary"
                    )}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 lg:space-x-6">
            {/* Dynamic Language Switcher (desktop) */}
            <button
              onClick={() => changeLocale(locale === "en" ? "ar" : "en")}
              className="hidden lg:flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 cursor-pointer hover:bg-white/20 transition-all text-white font-bold text-sm"
            >
              <Globe className="text-white" size={18} />
              <span>{locale === "en" ? "AR" : "EN"}</span>
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              className="relative flex items-center justify-center text-white cursor-pointer hover:text-brand-primary transition-colors p-2"
            >
              <ShoppingCart size={22} strokeWidth={1.5} className="lg:size-6" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b47800] px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Profile Icon — desktop */}
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="hidden lg:flex items-center text-white text-sm font-bold px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition"
              >
                {loginLabel}
              </Link>
            ) : (
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-label="Open profile menu"
                  className="w-10 h-10 rounded-full bg-[#b47800] flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition"
                >
                  {initials}
                </button>

                {profileOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                )}

                {profileOpen && (
                  <div
                    dir={isRtl ? "rtl" : "ltr"}
                    className="absolute top-12 z-50 w-64 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden ltr:right-0 rtl:left-0"
                  >
                    <div className="flex items-center gap-3 px-4 py-4 text-left rtl:text-right">
                      <div className="w-10 h-10 rounded-full bg-[#b47800] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {fullName || userEmail}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{userEmail}</p>
                        {userType === "guest" && (
                          <span className="inline-block mt-1 rounded-full bg-[#fef3c7] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#92400e]">
                            {profileLabels.guest}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 mx-1" />

                    <div className="py-1.5">
                      <Link
                        href={routes.profile}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                      >
                        {profileLabels.profile}
                      </Link>
                      <Link
                        href={routes.orders}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                      >
                        {profileLabels.orders}
                      </Link>

                      {role === "community_user" && (
                        <Link
                          href="/communityDashBoard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                        >
                          {userType === "member" ? (
                            <>
                              <LayoutDashboard size={14} className="shrink-0 text-[#0a4833]" />
                              {profileLabels.communityDashboard}
                            </>
                          ) : (
                            <>
                              <Lock size={14} className="shrink-0 text-gray-400" />
                              <span>{profileLabels.communityDashboard}</span>
                              <span className="ms-auto rounded-full bg-[#fef3c7] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#92400e]">
                                {profileLabels.membersOnly}
                              </span>
                            </>
                          )}
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 mx-1" />

                    <div className="py-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors"
                      >
                        <LogOut size={14} />
                        {profileLabels.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-white z-1001"
              onClick={() => isMobileMenuOpen ? handleCloseMenu() : setIsMobileMenuOpen(true)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-1050 transition-opacity duration-500 lg:hidden",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={handleCloseMenu}
      />

      {/* Mobile Menu Container */}
      <div
        id="mobile-navigation"
        className={cn(
          "fixed inset-y-0 w-[85%] md:w-[60%] bg-[#1A4331] z-1100 flex flex-col pt-24 px-8 md:px-10 transition-transform duration-700 lg:hidden shadow-2xl border-white/10 ltr:right-0 ltr:left-auto ltr:border-l rtl:left-0 rtl:right-auto rtl:border-r",
          isMobileMenuOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        )}
      >
        <button
          className="absolute top-6 right-6 text-white p-2.5 hover:bg-white/10 rounded-full transition-colors z-1200 cursor-pointer"
          onClick={handleCloseMenu}
        >
          <X size={28} />
        </button>

        {/* Links */}
        <div className="flex flex-col space-y-6 relative z-10 overflow-y-auto max-h-[65vh] pr-2">
          {navLinks.map((link: NavLink, idx: number) => (
            <div key={link.name} className="flex flex-col">
              {link.hasDropdown ? (
                <div className="flex flex-col">
                  <div
                    className="mobile-link text-2xl md:text-3xl font-playfair font-bold text-white/80 flex items-center justify-between py-2 cursor-pointer transition-colors hover:text-brand-primary"
                    onClick={() => toggleExpand(link.name)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-dm tracking-[0.3em] text-brand-primary/60 mt-2">
                        0{idx + 1}
                      </span>
                      {link.name}
                    </div>
                    <ChevronDown
                      size={20}
                      className={cn(
                        "text-brand-primary/40 transition-transform duration-300",
                        expandedLink === link.name && "rotate-180"
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "flex flex-col space-y-4 pl-8 overflow-hidden transition-all duration-500 ease-in-out opacity-0",
                      expandedLink === link.name ? "max-h-125 mt-4 opacity-100" : "max-h-0"
                    )}
                  >
                    {(link.items ?? innerPages).map((item: NavItem) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-lg font-inter text-white/60 hover:text-brand-primary transition-colors flex items-center justify-between"
                        onClick={handleCloseMenu}
                      >
                        {item.name}
                        <ArrowRight size={16} className="text-brand-primary/40 rtl:rotate-180" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className={cn(
                    "mobile-link text-2xl md:text-3xl font-playfair font-bold transition-colors flex items-center justify-between py-2",
                    isLinkActive(link.href) ? "text-brand-primary" : "text-white/80 hover:text-brand-primary"
                  )}
                  onClick={handleCloseMenu}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-dm tracking-[0.3em] text-brand-primary/60 mt-2">
                      0{idx + 1}
                    </span>
                    {link.name}
                  </div>
                  <ArrowRight size={20} className="text-brand-primary/40 rtl:rotate-180" />
                </Link>
              )}
            </div>
          ))}

        </div>

        {/* Dynamic Language Switcher (mobile bottom dock) */}
        <div className="mt-auto mb-10 mobile-link opacity-0 relative z-10">
          <button
            onClick={() => {
              changeLocale(locale === "en" ? "ar" : "en");
              handleCloseMenu();
            }}
            className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 cursor-pointer hover:bg-white/10 transition-all text-left rtl:text-right"
          >
            <Globe className="text-brand-primary" size={20} />
            <span className="text-white font-bold text-lg">
              {locale === "en" ? "AR - Arabic" : "EN - English"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
