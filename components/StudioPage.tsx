
import React from 'react';

const StudioPage: React.FC = () => {
  return (
    <div className="text-center p-8 bg-stone-800/50 rounded-lg">
      <h1 className="text-4xl font-serif text-amber-200">Studio Dashboard</h1>
      <p className="mt-4 text-stone-300">
        This is a protected area for studio staff.
      </p>
      <div className="mt-8">
        <p className="text-stone-400">Features to be implemented:</p>
        <ul className="list-disc list-inside text-left max-w-md mx-auto mt-2 text-stone-300">
          <li>Supabase Auth (Magic Links)</li>
          <li>Grid of client sessions</li>
          <li>Approve & Copy DM functionality</li>
          <li>Send Payment Link</li>
          <li>Add to Portfolio toggle</li>
        </ul>
      </div>
    </div>
  );
};

export default StudioPage;
