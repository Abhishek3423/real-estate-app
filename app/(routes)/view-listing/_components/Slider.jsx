import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function Slider({ imageList }) {
  console.log('Image list:', imageList); // Check the image list data

  return (
    <div>
      {imageList && imageList.length > 0 ? (
        <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
          {imageList.map((url, index) => (
            <div key={index}>
              <img src={url} alt={`Slide ${index + 1}`} className="w-full h-auto" />
            </div>
          ))}
        </Carousel>
      ) : (
        <div className='w-full h-[200px] bg-slate-200 animate-pulse rounded-lg'>
          {/* Placeholder for loading state */}
        </div>
      )}
    </div>
  );
}

export default Slider;