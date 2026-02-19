/**
 * 🔧 MINIMAL WORKING AUTH EXAMPLE
 * Copy this EXACT code to test if modals work
 * 
 * INSTRUCTIONS:
 * 1. Save this as TestAuth.js in src/
 * 2. In index.js, import TestAuth instead of App
 * 3. Test if modals work
 * 4. If yes, we know the issue is in your App.js
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';

function TestAuthContent() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  console.log('🔍 Render - showLogin:', showLogin, 'showSignup:', showSignup);

  return (
    <div style={styles.container}>
      <h1>🧪 Auth Test Page</h1>
      
      <div style={styles.info}>
        <p><strong>User Status:</strong> {user ? `✅ Logged in as ${user.email}` : '❌ Not logged in'}</p>
        <p><strong>showLogin:</strong> {showLogin ? 'true' : 'false'}</p>
        <p><strong>showSignup:</strong> {showSignup ? 'true' : 'false'}</p>
      </div>

      <div style={styles.buttons}>
        <button
          style={styles.button}
          onClick={() => {
            console.log('🔵 Sign In button clicked!');
            setShowLogin(true);
            console.log('🔵 setShowLogin(true) called');
          }}
        >
          🔑 OPEN SIGN IN
        </button>

        <button
          style={{ ...styles.button, background: '#27ae60' }}
          onClick={() => {
            console.log('🟢 Sign Up button clicked!');
            setShowSignup(true);
            console.log('🟢 setShowSignup(true) called');
          }}
        >
          📝 OPEN SIGN UP
        </button>

        <button
          style={{ ...styles.button, background: '#e74c3c' }}
          onClick={() => {
            setShowLogin(false);
            setShowSignup(false);
          }}
        >
          ❌ CLOSE ALL
        </button>
      </div>

      <div style={styles.debug}>
        <h3>Debug Info:</h3>
        <pre>{JSON.stringify({ 
          showLogin, 
          showSignup, 
          hasUser: !!user,
          userEmail: user?.email 
        }, null, 2)}</pre>
      </div>

      {/* ✅ LOGIN MODAL */}
      {showLogin && (
        <>
          {console.log('✅ RENDERING LOGIN MODAL')}
          <Login
            onClose={() => {
              console.log('🚪 Login modal closed');
              setShowLogin(false);
            }}
            onSwitchToSignup={() => {
              console.log('🔄 Switching to signup');
              setShowLogin(false);
              setShowSignup(true);
            }}
            onSwitchToReset={() => {
              setShowLogin(false);
            }}
          />
        </>
      )}

      {/* ✅ SIGNUP MODAL */}
      {showSignup && (
        <>
          {console.log('✅ RENDERING SIGNUP MODAL')}
          <Signup
            onClose={() => {
              console.log('🚪 Signup modal closed');
              setShowSignup(false);
            }}
            onSwitchToLogin={() => {
              console.log('🔄 Switching to login');
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
        </>
      )}
    </div>
  );
}

function TestAuth() {
  return (
    <AuthProvider>
      <TestAuthContent />
    </AuthProvider>
  );
}

const styles = {
  container: {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'sans-serif'
  },
  info: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  button: {
    flex: 1,
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    background: '#0d7377',
    color: 'white'
  },
  debug: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    fontSize: '14px'
  }
};

export default TestAuth;