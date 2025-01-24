import React from 'react';
import { Carousel, CarouselContent, CarouselPrevious, CarouselNext } from 'some-carousel-library'; // Replace with actual carousel library

function Slider({ imageList }) {
  console.log('Image list:', imageList); // Log the image list to verify the prop

  return (
    <div>
      {imageList && imageList.length > 0 ? (
        <Carousel>
          <CarouselContent>
            {imageList.map((url, index) => (
              <div key={index} className="carousel-item">
                <img src={url} alt={`Slide ${index + 1}`} className="w-full h-auto" />
              </div>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
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