import "@/styles/globals.css"
import { useState, useEffect } from 'react'
import type { AppProps } from "next/app"

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent">
      <div className="relative bg-black/95 border border-[#1a1a1a] rounded-lg shadow-2xl p-8 w-96 overflow-hidden">
        <div className="space-y-8">
          {/* Logo and spinner */}
          <div className="relative w-24 h-24 mx-auto animate-blip">
            <div className="absolute w-24 h-24 rounded-full bg-[#5865f2] flex items-center justify-center">
              <div className="w-16 h-12 bg-white mask-broom"></div>
            </div>
            <div className="absolute inset-0">
              <div className="w-24 h-24 border-4 border-[#5865f2] rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-semibold text-white">
              Loading...
            </div>
            <div className="text-sm text-gray-400">
              Brad is sweeping things up...
            </div>
          </div>
        </div>

        {/* Bottom section with broom animation */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <div className="sweeping-broom">
            <svg width="60" height="60" viewBox="0 0 100 100">
              <line 
                x1="50" y1="20" 
                x2="50" y2="80" 
                stroke="#5865f2" 
                strokeWidth="6" 
                strokeLinecap="round"
              />
              <path 
                d="M30 80 C30 80, 50 85, 70 80 L75 95 C75 95, 50 100, 25 95 Z" 
                fill="#5865f2"
              />
            </svg>
          </div>

          <div className="dust-container">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="dust" 
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sweeping-broom {
          position: absolute;
          bottom: 10px;
          left: -60px;
          z-index: 50;
          animation: sweep 3s infinite linear;
          will-change: transform;
        }

        .dust-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
          overflow: hidden;
        }

        .dust {
          position: absolute;
          bottom: 0;
          width: 3px;
          height: 3px;
          background: rgba(88, 101, 242, 0.5);
          border-radius: 50%;
          animation: fall linear infinite;
        }

        @keyframes sweep {
          0% {
            transform: translateX(0) rotate(-10deg);
          }
          25% {
            transform: translateX(200px) rotate(5deg);
          }
          50% {
            transform: translateX(400px) rotate(-10deg);
          }
          50.1% {
            transform: translateX(-60px) rotate(-10deg);
          }
          75% {
            transform: translateX(200px) rotate(5deg);
          }
          100% {
            transform: translateX(400px) rotate(-10deg);
          }
        }

        @keyframes fall {
          0% {
            transform: translateY(-10px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(40px);
            opacity: 0;
          }
        }

        @keyframes blip {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          45% {
            transform: scale(0.95) rotate(180deg);
            opacity: 0.8;
          }
          50% {
            transform: scale(0.95) rotate(180deg);
            opacity: 0.8;
          }
          95% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        .animate-blip {
          animation: blip 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .mask-broom {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cline x1='50' y1='20' x2='50' y2='80' stroke='white' stroke-width='6' stroke-linecap='round'/%3E%3Cpath d='M30 80 C30 80, 50 85, 70 80 L75 95 C75 95, 50 100, 25 95 Z' fill='white'/%3E%3C/svg%3E");
          mask-size: 75% 75%;
          mask-repeat: no-repeat;
          mask-position: center;
        }
      `}</style>
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setTimeout(() => {
        setShowContent(true)
      }, 100)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading && <LoadingScreen />}
      <div 
        className={`min-h-screen transition-all duration-500 ease-out ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {!loading && <Component {...pageProps} />}
      </div>

      <style jsx global>{`
        body {
          background: transparent;
        }
      `}</style>
    </>
  )
}

export default MyApp