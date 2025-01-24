"use client";
import React, { useEffect, useState } from 'react';
import Listing from './Listing';
import { supabase } from '/utils/supabase/client';
import { toast } from 'sonner';
import GoogleMapSection from './GoogleMapSection';

function ListingMapView({ Type }) {
  const [listing, setListing] = useState([]);
  const [searchedAddress, setSearchedAddress] = useState('');
  const [bedCount, setBedCount] = useState('0');
  const [bathCount, setBathCount] = useState('0');
  const [parkingCount, setParkingCount] = useState('0');
  const [homeType, setHomeType] = useState('');
  const [coordinates, setCoordinates] = useState();

  useEffect(() => {
    getLatestListing();
  }, [Type]);

  const getLatestListing = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select(`*,listingImages(url,listing_id)`)
      .eq('Active', true)
      .eq('Type', Type)
      .order('id', { ascending: false });

    if (data) {
      setListing(data);
    }
    if (error) {
      toast('Server Side Error');
    }
  };

  const handleSearchClick = async () => {
    const searchTerm = searchedAddress;

    if (!searchTerm) {
      toast('Please enter a valid search term');
      return;
    }

    let query = supabase
      .from('listing')
      .select(`*,listingImages(url,listing_id)`)
      .eq('Active', true)
      .eq('Type', Type)
      .gte('bedroom', bedCount)
      .gte('bathroom', bathCount)
      .gte('parking', parkingCount)
      .ilike('Address', `%${searchTerm}%`)
      .order('id', { ascending: false });
    if (homeType) {
      query = query.eq('propertyType', homeType);
    }

    const { data, error } = await query;
    if (data) {
      setListing(data);
    }
    if (data.length === 0) {
      toast('No results found');
    }
    if (error) {
      toast('Server Side Error');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Listing
          listing={listing}
          handleSearchClick={handleSearchClick}
          setSearchedAddress={setSearchedAddress}
          setBedCount={setBedCount}
          setBathCount={setBathCount}
          setParkingCount={setParkingCount}
          setHomeType={setHomeType}
          setCoordinates={setCoordinates}
        />
      </div>
      <div className="fixed right-10 h-full md:w-[350px] lg:w-[450px] xl:w-[600px]">
        <GoogleMapSection
          listing={listing}
          coordinates={coordinates}
        />
      </div>
    </div>
  );
}

export default ListingMapView;
