import React from 'react';
import ad1Image from '../assets/ad1.png';
import ad2Image from '../assets/ad2.png';
import ad3Image from '../assets/ad3.png';
import ad4Image from '../assets/ad4.png';

const ImageDebug: React.FC = () => {
  const images = [
    { name: 'ad1', src: ad1Image },
    { name: 'ad2', src: ad2Image },
    { name: 'ad3', src: ad3Image },
    { name: 'ad4', src: ad4Image },
  ];

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Image Debug</h2>
      <div className="grid grid-cols-2 gap-4">
        {images.map((img, index) => (
          <div key={index} className="border p-2">
            <h3 className="font-semibold">{img.name}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Type: {typeof img.src}, Value: {JSON.stringify(img.src)}
            </p>
            <img 
              src={typeof img.src === 'string' ? img.src : img.src.src || img.src} 
              alt={img.name}
              className="w-full h-32 object-cover border"
              onLoad={() => console.log(`${img.name} loaded successfully`)}
              onError={(e) => console.error(`${img.name} failed to load:`, e)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDebug;