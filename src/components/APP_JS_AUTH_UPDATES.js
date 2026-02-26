/**
 * 📋 APP.JS UPDATES
 * Add these snippets to your existing App.js
 */

// ==========================================
// 1. ADD TO IMPORTS (top of file)
// ==========================================
import { useEffect } from 'react'; // Make sure this is imported

// ==========================================
// 2. ADD INSIDE AppContent FUNCTION
// (After your existing state declarations)
// ==========================================

function AppContent() {
  const { user, signOut } = useAuth();
  const { isPremium, isLoading, source, daysRemaining } = useSubscription(user?.id);
  
  // ... your existing state ...

  // ✅ NEW: Listen for signup/login events from pricing modal
  useEffect(() => {
    const handleOpenSignup = () => {
      setShowSignup(true);
    };

    const handleOpenLogin = () => {
      setShowLogin(true);
    };

    window.addEventListener('openSignup', handleOpenSignup);
    window.addEventListener('openLogin', handleOpenLogin);

    return () => {
      window.removeEventListener('openSignup', handleOpenSignup);
      window.removeEventListener('openLogin', handleOpenLogin);
    };
  }, []);

  // ✅ NEW: Resume payment flow after login/signup
  useEffect(() => {
    if (user) {
      // Check if user was trying to purchase before logging in
      const pendingPlan = localStorage.getItem('pending_plan');
      const returnToPricing = localStorage.getItem('return_to_pricing');

      if (pendingPlan && returnToPricing === 'true') {
        console.log('✅ User logged in - resuming payment for:', pendingPlan);
        
        // Clear flags
        localStorage.removeItem('pending_plan');
        localStorage.removeItem('return_to_pricing');

        // Show pricing modal with selected plan
        setTimeout(() => {
          setShowPricing(true);
          alert('Welcome! Click your plan again to continue to payment.');
        }, 1000);
      }
    }
  }, [user]);

  // ... rest of your existing code ...
}

// ==========================================
// 3. COMPLETE EXAMPLE WITH CONTEXT
// ==========================================

/*
function AppContent() {
  const { user, signOut } = useAuth();
  const { isPremium } = useSubscription(user?.id);
  
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  // Listen for auth modal triggers from pricing
  useEffect(() => {
    const handleOpenSignup = () => setShowSignup(true);
    const handleOpenLogin = () => setShowLogin(true);

    window.addEventListener('openSignup', handleOpenSignup);
    window.addEventListener('openLogin', handleOpenLogin);

    return () => {
      window.removeEventListener('openSignup', handleOpenSignup);
      window.removeEventListener('openLogin', handleOpenLogin);
    };
  }, []);

  // Resume payment flow after login
  useEffect(() => {
    if (user) {
      const pendingPlan = localStorage.getItem('pending_plan');
      const returnToPricing = localStorage.getItem('return_to_pricing');

      if (pendingPlan && returnToPricing === 'true') {
        localStorage.removeItem('pending_plan');
        localStorage.removeItem('return_to_pricing');
        
        setTimeout(() => {
          setShowPricing(true);
          alert('Welcome! Click your plan again to continue.');
        }, 1000);
      }
    }
  }, [user]);

  return (
    <div className="App">
      // ... your existing JSX ...
      
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onSwitchToSignup={() => { 
            setShowLogin(false); 
            setShowSignup(true); 
          }} 
        />
      )}
      
      {showSignup && (
        <Signup 
          onClose={() => setShowSignup(false)} 
          onSwitchToLogin={() => { 
            setShowSignup(false); 
            setShowLogin(true); 
          }} 
        />
      )}

      {showPricing && (
        <PricingPage 
          onClose={() => setShowPricing(false)}
        />
      )}
    </div>
  );
}
*/
