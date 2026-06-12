import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import GlobalSidebar from "@/components/GlobalSidebar";
import { Providers } from "@/components/Providers";
import AuthWidget from "@/components/AuthWidget";
import WelcomeLoginModal from "@/components/WelcomeLoginModal";
import AIChatWidget from "@/components/AIChatWidget";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Pokefun - Cobblemon SMP",
  description: "Pokefun is a premier Cobblemon SMP server. Join our community for a unique Pokemon adventure in Minecraft!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <meta name="HandheldFriendly" content="True" />
        <meta name="viewport" content="width=1200" />
        <link rel="stylesheet" href="/css/screen.css" />
        <link rel="stylesheet" href="/css/custom.css" />
        <link rel="stylesheet" type="text/css" href="/css/style.css" />
        <link rel="stylesheet" type="text/css" href="/css/cards.min.css" />
        <link rel="stylesheet" type="text/css" href="/css/animate.min.css" />
        <link rel="stylesheet" type="text/css" href="/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Righteous&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --ghost-accent-color: #1cc6db;
          }
          /* Custom CSS to fix up Fakemons grid in this theme */
          .fakemons-grid {
             display: grid;
             grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
             gap: 20px;
          }
          .fakemon-card {
             background: var(--content-bg, #fff);
             border-radius: var(--border-radius, 12px);
             box-shadow: var(--shadow-lg);
             padding: 20px;
             text-align: center;
             transition: transform 0.2s, background 0.2s, color 0.2s;
             color: #000;
          }
          .fakemon-card:hover {
             transform: translateY(-5px);
          }
          html.dark-mode .fakemon-card {
             background: #1c1f21;
             color: #fff;
             box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          }
          html.dark-mode .fakemon-card span {
             background: #2a2e33 !important;
             color: #ddd !important;
          }
          .fakemon-img {
             width: 120px;
             height: 120px;
             object-fit: contain;
             margin: 0 auto 15px;
          }
        `}</style>
        <style>{`
          .gh-head-menu .nav a { font-size: 2.5rem !important; }
          .desktop-sidebar-container a, .desktop-sidebar-container span { font-size: 2.5rem !important; }
          .desktop-sidebar-container h2 { font-size: 1.8rem !important; }
        `}</style>
      </head>
      <body>
        <Providers>
          <div className="viewport">
            <div id="gh-header">
            <div id="nav" style={{ padding: '0 20px', paddingRight: '200px' }}>
                <div className="container" style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 20px", maxWidth: "1200px", margin: "0 auto" }}>
                    <a href="/">Home</a>
                    <a href="/community">Community</a>
                    <a href="/community/reels">Reels</a>
                    <a href="/messages" id="desktop-nav-messages" style={{ position: 'relative' }}>Messages</a>
                    <a href="/leaderboard" style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                        <i className="fa-solid fa-trophy"></i> Leaderboards
                    </a>
                    <a href="/wiki">Wiki</a>
                    <a href="/modpacks">Modpacks</a>
                    <a href="/rules">Rules</a>
                    <a href="/vote">Vote</a>
                    <a href="https://store.pokefun.in" target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24', fontWeight: 'bold', textShadow: '0 0 10px rgba(251,191,36,0.5)' }}>
                        <i className="fa-solid fa-cart-shopping"></i> Store
                    </a>
                    <a href="/showcase">Showcase</a>
                    <a href="/team">Team</a>
                    <a href="/changelogs">Changelogs</a>
                    <a href="https://discord.gg/pokefun" target="_blank" rel="noopener noreferrer" className="discord-btn">
                        <i className="fa-brands fa-discord"></i> Discord
                    </a>
                </div>
            </div>
            <header id="gh-head" className="gh-head has-cover">
                <nav className="gh-head-inner inner gh-container">
                    <div className="gh-head-brand hidden-desktop">
                        <a className="gh-burger" role="button">
                            <div className="gh-burger-box">
                                <div className="gh-burger-inner"></div>
                            </div>
                        </a>
                    </div>
                    <div className="gh-head-menu">
                        <ul className="nav">
                            <li><a href="/">Home</a></li>
                            <li><a href="/community">Community</a></li>
                            <li><a href="/community/reels">Reels</a></li>
                            <li><a href="/messages" id="mobile-nav-messages">Messages</a></li>
                            <li><a href="/wiki">Wiki</a></li>
                            <li><a href="/modpacks">Modpacks</a></li>
                            <li><a href="/rules">Rules</a></li>
                            <li><a href="/vote">Vote</a></li>
                            <li><a href="https://store.pokefun.in" target="_blank" rel="noopener noreferrer">Shop</a></li>
                            <li><a href="/showcase">Showcase</a></li>
                            <li><a href="/team">Team</a></li>
                            <li><a href="/changelogs">Changelogs</a></li>
                            <li><a href="https://discord.com/invite/NtE8QBkmwR" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2' }}><i className="fa-brands fa-discord"></i> Discord</a></li>
                        </ul>
                    </div>
                </nav>
            </header>
          </div>
          
          <main style={{ maxWidth: "1400px", margin: "-250px auto 0", width: "100%", padding: "0 20px", boxSizing: "border-box", position: "relative", zIndex: 10 }}>
             <div style={{ display: "flex", gap: "30px", position: "relative", alignItems: "stretch" }}>
                 <div className="desktop-sidebar-container" style={{ flexShrink: 0, zIndex: 50, marginTop: "280px" }}>
                     <GlobalSidebar />
                 </div>
                 <div style={{ flexGrow: 1, minWidth: 0, position: "relative", zIndex: 10 }}>
                     {children}
                 </div>
             </div>
          </main>

          <section id="footer">
              <div className="inner">
                  <div className="footer-col">
                      <div className="left">
                          <h1>2026 © <strong>Pokefun</strong></h1>
                          <p>
                              We are not affiliated with or endorsed by Mojang, AB or Pokemon.<br/>
                              <small>Updated for Pokefun | <a href="/rules">Rules</a> | <a href="/team">Staff Team</a></small>
                          </p>
                          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                              New videos, guides, and features come fast on Discord and YouTube! Must join!
                          </p>
                      </div>
                      <div className="right">
                          <ul style={{ display: 'flex', gap: '15px', listStyle: 'none', padding: 0 }}>
                              <li><a href="https://discord.com/invite/NtE8QBkmwR" target="_blank" rel="noopener noreferrer" style={{ fontSize: '24px', color: '#5865F2' }}><i className="fa-brands fa-discord"></i></a></li>
                              <li><a href="https://www.youtube.com/@Pokefunsmp" target="_blank" rel="noopener noreferrer" style={{ fontSize: '24px', color: '#FF0000' }}><i className="fa-brands fa-youtube"></i></a></li>
                              <li><a href="https://www.instagram.com/pokefunsmp/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '24px', color: '#E1306C' }}><i className="fa-brands fa-instagram"></i></a></li>
                              <li><a href="#" className="back-to-top" style={{ fontSize: '24px' }}><i className="fa-solid fa-arrow-turn-up"></i></a></li>
                          </ul>
                      </div>
                  </div>
              </div>
          </section>
        </div>

        <Script src="/js/jquery-3.5.1.min.js" strategy="beforeInteractive" />
        <Script src="/js/jquery-ui.js" strategy="lazyOnload" />
        <Script src="/js/casper.js" strategy="lazyOnload" />
        <Script src="/js/tsparticles.preset.stars.bundle.min.js" strategy="lazyOnload" />
        <Script id="init-scripts" strategy="lazyOnload">{`
          if (typeof tsParticles !== 'undefined') {
            tsParticles.load("tsparticles", { preset: "stars" });
          }
          
          // Set active navigation link
          const path = window.location.pathname;
          document.querySelectorAll('#nav a, .nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href === path || (href !== '/' && path.startsWith(href)))) {
              link.classList.add('active-pill');
              if (link.parentElement.tagName === 'LI') {
                link.parentElement.classList.add('nav-current');
              }
            } else {
              link.classList.remove('active-pill');
              if (link.parentElement.tagName === 'LI') {
                link.parentElement.classList.remove('nav-current');
              }
            }
          });

          const initBurger = () => {
            const burger = document.querySelector('.gh-burger');
            if (burger && !burger.dataset.initialized) {
              burger.addEventListener('click', () => {
                document.body.classList.toggle('gh-head-open');
              });
              burger.dataset.initialized = "true";
            }
          };
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initBurger);
          } else {
            initBurger();
          }

          // Unread messages notification poll
          setInterval(async () => {
            try {
              const res = await fetch('/api/messages/unread');
              const data = await res.json();
              
              if (data.count !== undefined) {
                 const prevCount = parseInt(window.sessionStorage.getItem('lastUnreadCount') || '0');
                 if (data.count > prevCount && localStorage.getItem('muteMsgSound') !== 'true') {
                    try {
                      const ctx = new (window.AudioContext || window.webkitAudioContext)();
                      const osc = ctx.createOscillator();
                      const gain = ctx.createGain();
                      osc.connect(gain);
                      gain.connect(ctx.destination);
                      osc.type = "sine";
                      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
                      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // A6
                      gain.gain.setValueAtTime(0.1, ctx.currentTime);
                      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                      osc.start(ctx.currentTime);
                      osc.stop(ctx.currentTime + 0.1);
                    } catch(e) {}
                 }
                 window.sessionStorage.setItem('lastUnreadCount', data.count.toString());
              }

              ['desktop-nav-messages', 'mobile-nav-messages'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                  let badge = el.querySelector('.unread-badge');
                  if (data.count > 0 && window.location.pathname !== '/messages') {
                    if (!badge) {
                      badge = document.createElement('span');
                      badge.className = 'unread-badge';
                      badge.style.cssText = 'position: absolute; top: -5px; right: -24px; background: red; color: white; border-radius: 12px; padding: 3px 7px; font-size: 0.75rem; font-weight: bold; line-height: 1; text-align: center; min-width: 18px; box-sizing: border-box;';
                      el.appendChild(badge);
                    }
                    badge.textContent = data.count > 9 ? '9+' : data.count;
                  } else if (badge) {
                    badge.remove();
                  }
                }
              });
            } catch (e) {}
          }, 10000); // Check every 10 seconds
        `}</Script>
        <WelcomeLoginModal />
        <AuthWidget />
        <AIChatWidget />
        <Analytics />
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1109532875069224" 
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        </Providers>
      </body>
    </html>
  );
}
