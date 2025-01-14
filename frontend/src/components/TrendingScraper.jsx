// 

import { useRef, useState } from 'react';
import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import '../styles.css';
import JsonPreviewCard from './jsonpreview';

const AnimatedCard = ({ trend, timestamp, ipAddress }) => {
  const ref = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(event) {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setMousePosition({ x, y });
    }
  }

  // Extract the location from ProxyMesh endpoint (e.g., "us-wa" from "us-wa.proxymesh.com:31280")
  const getProxyLocation = (proxyAddress) => {
    const match = proxyAddress.match(/^([^.]+)/);
    return match ? match[0].toUpperCase() : proxyAddress;
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      className="trend-card"
    >
      <div
        className="gradient-overlay"
        style={{
          background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className="card-content">
        <div className="trend-info">
          <p className="trend-title">{trend}</p>
          <p className="trend-timestamp">Fetched at: {new Date(timestamp).toLocaleString()}</p>
          <p className="trend-ip">ProxyMesh Region: {getProxyLocation(ipAddress)}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TrendingScraper = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/scrape', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trends');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Twitter Trends Scraper</h1>

      <button
        className={`scrape-button ${loading ? 'loading' : ''}`}
        onClick={handleScrape}
        disabled={loading}
      >
        {loading ? 'Fetching trends...' : 'Click here to run the script'}
      </button>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}



      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="trends-container"
        >

          <h2>These are the most happening topics as on {new Date(result.timestamp).toLocaleString()}</h2>

          <div className="trends-grid">
            {[
              result.nameoftrend1,
              result.nameoftrend2,
              result.nameoftrend3,
              result.nameoftrend4,
              result.nameoftrend5
            ].map((trend, index) => (
              <AnimatedCard
                key={index}
                trend={trend}
                timestamp={result.timestamp}
                ipAddress={result.ipAddress}
              />
            ))}
          </div>

          <h3>The IP address used for this query was {result.ipAddress}</h3>

          <div className="trends">
            <JsonPreviewCard
              jsonPreview={JSON.stringify(result, null, 2)}
            />
          </div>

          <button
            className="scrape-button"
            onClick={handleScrape}
          >
            Click here to run the query again
          </button>
        </motion.div>
      )}
    </div>
  );
};

AnimatedCard.propTypes = {
  trend: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  ipAddress: PropTypes.string.isRequired,
};

export default TrendingScraper;