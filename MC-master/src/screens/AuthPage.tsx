import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AnimatedLogo from '../components/auth/AnimatedLogo'
import BackgroundAnimation from '../components/auth/BackgroundAnimation'
import AuthForm from '../components/auth/AuthForm'
import { useAuth } from '../contexts/AuthContext' // Import useAuth

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const navigate = useNavigate()
  const { user } = useAuth() // Get user from auth context

  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true })
    }
  }, [user, navigate])

  const toggleAuthMode = () => {
    setAuthMode(prev => {
      const next = prev === 'login' ? 'signup' : 'login';
      if (next === 'signup') {
        localStorage.setItem("selectedAvatar", "/characters/Intern1.png");
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
      <BackgroundAnimation />
      
      <div className={`relative z-10 min-h-screen flex items-center justify-center ${window.innerWidth > window.innerHeight ? 'p-1' : 'p-4'}`}>
        <div className="w-full max-w-md">
          <AnimatedLogo />
          <AuthForm mode={authMode} onToggleMode={toggleAuthMode} />
          
          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              <span className="block md:inline-block text-xs sm:text-sm">
                © 2025 Rareminds. All rights reserved.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage