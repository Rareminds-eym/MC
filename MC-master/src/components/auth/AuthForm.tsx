import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useDeviceLayout } from '../../hooks/useOrientation' // Add this import

interface AuthFormProps {
  mode: 'login' | 'signup'
  onToggleMode: () => void
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signIn, signUp } = useAuth()
  const { isHorizontal, isMobile } = useDeviceLayout(); // Add this line
  const isMobileLandscape = isMobile && isHorizontal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return false
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (mode === 'signup') {
      if (!formData.fullName.trim()) {
        setError('Please enter your full name')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          setError(error.message)
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.fullName)
        if (error) {
          setError(error.message)
        } else {
          setSuccess('Account created successfully! Please check your email to verify your account.')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`w-full mx-auto ${
      isMobileLandscape && mode === 'signup'
        ? 'max-w-lg flex justify-center items-center'
        : isMobileLandscape
          ? 'max-w-xs'
          : 'max-w-md'
    }`}>
      <div
        className={`bg-gray-800/60 rounded-lg shadow-2xl relative z-10 w-full mx-auto
        ${
          isMobileLandscape && mode === 'signup'
            ? 'p-6 max-w-lg flex flex-col justify-center items-center'
            : isMobileLandscape
              ? 'p-4 max-w-xs'
              : 'p-8 max-w-md'
        }`}
      >
        {/* Form Header */}
        <div className={`text-center ${isMobileLandscape ? 'mb-6' : 'mb-8'}`}>
          <h2 className={`${isMobileLandscape ? 'text-base' : 'text-3xl'} font-bold text-white mb-1`}>
            {mode === 'login' ? 'Welcome Back' : 'Join GMP Quest'}
          </h2>
          <p className={`${isMobileLandscape ? 'text-xs text-white' : (mode === 'login' ? 'text-gray-300' : 'text-white')}`}>
            {mode === 'login' 
              ? 'Sign in to continue your quality journey' 
              : 'Start your manufacturing excellence adventure'
            }
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 animate-shake`}>
            <AlertCircle className={`${isMobileLandscape ? 'h-4 w-4' : 'h-5 w-5'} text-red-500 flex-shrink-0`} />
            <p className={`${isMobileLandscape ? 'text-xs' : 'text-sm'} text-red-700`}>{error}</p>
          </div>
        )}

        {success && (
          <div className={`mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 animate-bounce-in`}>
            <CheckCircle className={`${isMobileLandscape ? 'h-4 w-4' : 'h-5 w-5'} text-green-500 flex-shrink-0`} />
            <p className={`${isMobileLandscape ? 'text-xs' : 'text-sm'} text-green-700`}>{success}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-2 ${
            isMobileLandscape && mode === 'signup'
              ? 'grid grid-cols-2 gap-4'
              : ''
          }`}
          style={
            isMobileLandscape && mode === 'signup'
              ? { width: '100%' }
              : undefined
          }
        >
          {/* Full Name (Signup only) */}
          {mode === 'signup' && (
            <div className={`${isMobileLandscape ? 'col-span-1 flex flex-col justify-end' : ''} space-y-2`}>
              {!isMobileLandscape && (
                <label className="block font-medium text-white mb-1 text-sm">
                  Full Name
                </label>
              )}
              <div className={`relative w-full ${isMobileLandscape ? '' : 'flex justify-center'}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`${isMobileLandscape ? 'h-4 w-4' : 'h-5 w-5'} text-blue-300`} />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 bg-white/10 border border-slate-700/50 rounded-md shadow-sm placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white pl-10 ${isMobileLandscape ? 'text-xs' : ''}`}
                  placeholder="Enter your full name"
                  style={
                    isMobileLandscape && mode === 'signup'
                      ? { minWidth: 0, width: '100%', alignSelf: 'flex-end' }
                      : undefined
                  }
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className={`${isMobileLandscape && mode === 'signup' ? 'col-span-1' : ''} space-y-2`}>
            {!isMobileLandscape && (
              <label className="block font-medium text-white mb-1 text-sm">
                Email Address
              </label>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={`${isMobileLandscape ? 'h-4 w-4' : 'h-5 w-5'} text-blue-300`} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 bg-white/10 border border-slate-700/50 rounded-md shadow-sm placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white pl-10 ${isMobileLandscape ? 'text-xs' : ''}`}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div className={`${isMobileLandscape && mode === 'signup' ? 'col-span-1' : ''} space-y-2`}>
            {!isMobileLandscape && (
              <label className="block font-medium text-white mb-1 text-sm">
                Password
              </label>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`${isMobileLandscape ? 'h-4 w-4' : 'h-5 w-5'} text-blue-300`} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 bg-white/10 border border-slate-700/50 rounded-md shadow-sm placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white pl-10 pr-10 ${isMobileLandscape ? 'text-xs' : ''}`}
                placeholder="Enter Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className={`${isMobileLandscape ? 'h-4 w-4' : 'h-5 w-5'} text-blue-300 hover:text-blue-400`} />
                ) : (
                  <Eye className={`${isMobileLandscape ? 'h-4 w-4' : 'h-5 w-5'} text-blue-300 hover:text-blue-400`} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password (Signup only) */}
          {mode === 'signup' && (
            <div className={`${isMobileLandscape && mode === 'signup' ? 'col-span-1' : ''} space-y-2`}>
              {!isMobileLandscape && (
                <label className="block font-medium text-white mb-1 text-sm">
                  Confirm Password
                </label>
              )}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`${isMobileLandscape ? 'h-5 w-5' : 'h-5 w-5'} text-blue-300`} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 bg-white/10 border border-slate-700/50 rounded-md shadow-sm placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white pl-8 pr-8 ${isMobileLandscape ? 'text-xs' : ''}`}
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className={`${isMobileLandscape ? 'h-3 w-3' : 'h-5 w-5'} text-blue-300 hover:text-blue-400`} />
                  ) : (
                    <Eye className={`${isMobileLandscape ? 'h-3 w-3' : 'h-5 w-5'} text-blue-300 hover:text-blue-400`} />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className={`${isMobileLandscape && mode === 'signup' ? 'col-span-2 flex justify-center' : ''}`}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center rounded-lg shadow-sm font-medium text-white bg-gradient-to-r from-green-400 via-cyan-600 to-emerald-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200
                ${isMobileLandscape ? 'py-2 px-3 text-xs' : 'py-3 px-4 text-sm'}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          <p className={`${isMobileLandscape ? 'text-xs' : 'text-sm'} text-gray-600`}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={onToggleMode}
              className="ml-1 font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthForm