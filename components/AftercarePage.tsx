
import React from 'react';

const AftercarePage: React.FC = () => {
  return (
    <div className="text-center p-8 bg-stone-800/50 rounded-lg">
      <h1 className="text-4xl font-serif text-amber-200">Aftercare Mini-App</h1>
      <p className="mt-4 text-stone-300">
        This view is designed to be used within the Telegram Mini-App.
      </p>
       <div className="mt-8">
        <p className="text-stone-400">Features to be implemented:</p>
        <ul className="list-disc list-inside text-left max-w-md mx-auto mt-2 text-stone-300">
          <li>Interface for uploading daily healing progress videos.</li>
          <li>Display HealScore and personalized advice.</li>
          <li>Show progress visualization.</li>
        </ul>
      </div>
    </div>
  );
};

export default AftercarePage;
