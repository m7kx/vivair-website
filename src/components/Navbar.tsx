"use client"

import { useState, useEffect } from 'react'
import Logo from '@/components/Logo'

const LINKS = ['Início', 'Experiências', 'Sobre', 'Contato']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(20px)',
        background: scrolled ? 'rgba(10,31,68,0.97)' : 'rgba(10,31,68,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.3s',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 20px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}>

          {/* Logo — tamanho responsivo */}
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Logo size={48} />
          </a>

          {/* Desktop links */}
          <div style={{
            display: 'flex', gap: 28, alignItems: 'center',
          }} className="desktop-nav">
            {LINKS.map((l) => (
              <a key={l} href="#" style={{
                fontFamily: 'var(--nav-font)', fontSize: 14,
                fontWeight: 500, color: 'rgba(255,255,255,0.75)',
                textDecoration: 'none', transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = 'white' }}
                onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)' }}
              >{l}</a>
            ))}
            <a href="https://app.onertravel.com/vivairtraveldesign/home"
              target="_blank" rel="noopener noreferrer"
              style={{
                background: 'var(--grad-cta)', color: 'white',
                padding: '10px 22px', borderRadius: 'var(--btn-radius)',
                fontFamily: 'var(--btn-font)', fontSize: 14,
                fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
              Reserve Online
            </a>
          </div>

          {/* Hambúrguer — mobile only */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className="hamburger-btn"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px', display: 'flex', flexDirection: 'column',
              gap: 5, justifyContent: 'center', alignItems: 'center',
              width: 40, height: 40,
            }}>
            <span style={{
              display: 'block', width: 22, height: 2,
              background: 'white', borderRadius: 2,
              transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              transition: 'transform 0.25s',
            }} />
            <span style={{
              display: 'block', width: 22, height: 2,
              background: 'white', borderRadius: 2,
              opacity: open ? 0 : 1,
              transition: 'opacity 0.2s',
            }} />
            <span style={{
              display: 'block', width: 22, height: 2,
              background: 'white', borderRadius: 2,
              transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
              transition: 'transform 0.25s',
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
        background: 'rgba(10,31,68,0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: open ? '24px 24px 32px' : '0 24px',
        maxHeight: open ? 400 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.3s',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {LINKS.map((l) => (
            <a key={l} href="#"
              onClick={() => setOpen(false)}
              style={{
                fontFamily: 'var(--nav-font)', fontSize: 17,
                fontWeight: 500, color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none', padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'block',
              }}>
              {l}
            </a>
          ))}
          <a href="https://app.onertravel.com/vivairtraveldesign/home"
            target="_blank" rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{
              marginTop: 16, background: 'var(--grad-cta)', color: 'white',
              padding: '14px 24px', borderRadius: 'var(--btn-radius)',
              fontFamily: 'var(--btn-font)', fontSize: 15,
              fontWeight: 600, textDecoration: 'none',
              textAlign: 'center', display: 'block',
            }}>
            Reserve Online
          </a>
        </div>
      </div>

      {/* Backdrop overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 98,
            background: 'rgba(0,0,0,0.4)',
            top: 64,
          }}
        />
      )}

      <style>{`
        .desktop-nav { display: none !important; }
        .hamburger-btn { display: flex !important; }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .hamburger-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}
