import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles.css';

const JsonPreviewCard = ({ jsonPreview }) => {
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

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      className="json-card"
    >
        <div
        className="gradient-overlay"
        style={{
          background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className="json-card-content">
        <h3>Here’s a JSON extract of this record from the MongoDB:</h3>
        <pre>{jsonPreview}</pre>
      </div>
    </motion.div>
  );
};

JsonPreviewCard.propTypes = {
  jsonPreview: PropTypes.string.isRequired,
};

export default JsonPreviewCard;