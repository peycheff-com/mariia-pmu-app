
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950/50">
      <div className="container mx-auto py-4 px-4 text-center text-stone-500 text-sm">
        &copy; {new Date().getFullYear()} BM Beauty Studio. All Rights Reserved.
        <p>Healed-First PMU Mockups by @maribo003</p>
      </div>
    </footer>
  );
};

export default Footer;
