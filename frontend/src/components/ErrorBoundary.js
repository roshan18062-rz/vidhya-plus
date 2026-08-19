import React from 'react';
import { motion } from 'motion/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-primary)', padding: '1.5rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: 'center', maxWidth: '400px',
              perspective: '1200px', transformStyle: 'preserve-3d'
            }}
          >
            <motion.div
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(124,58,237,0.2))',
                border: '2px solid rgba(244,63,94,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', fontSize: '2rem',
              }}
              animate={{ rotateZ: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              !
            </motion.div>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-white)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <motion.button
              className="btn-primary"
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Refresh Page
            </motion.button>
          </motion.div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
