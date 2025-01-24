import { Bath, BedDouble, MapPin, Ruler, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Button } from '../../components/ui/button';


function MarkerListingItem({ item, closeHandler }) {
  const listingImage = item?.listingImages?.[0]?.url || '/default-image.jpg';
  return (
    <div>

      <div className=" cursor-pointer rounded-lg w-fit">
        <X onClick={() => closeHandler()} />
        <Image
          src={listingImage}
          width={800}
          height={170}
          className="rounded-lg object-cover w-[160px] h-[70px]"
          alt={`Image of listing ${item?.Address || 'Unknown'}`} // 
        />
        <div className="flex mt-2 flex-col gap-2 p-2 bg-white">
          <h2 className="font-bold text-xl">NPR.{item?.price || 'N/A'}</h2>
          <h2 className="flex gap-2 text-sm text-gray-400">
            <MapPin className="h-4 w-4" />
            {item?.Address || 'Unknown'}
          </h2>
        </div>
        <div className="flex gap-2 mt-2 justify-between ">
          <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center items-center">
            <BedDouble className="h-4 w-4" />
            {item?.bedroom || 'N/A'}
          </h2>
          <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center items-center">
            <Bath className="h-4 w-4" />
            {item?.bathroom || 'N/A'}
          </h2>


        </div>
        <Button className="mt-2 w-full">View Details</Button>

      </div>
    </div>
  );
}

export default MarkerListingItem;