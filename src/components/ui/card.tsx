import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`shadow-lg bg-castled-secondary p-6 rounded-lg  ${className}`}>
      {children}
    </div>
  );
};

export { Card };