import React from 'react';
import { Button } from '../components/ui/button';
import { List } from 'lucide-react';
import ListingMapView from './_components/ListingMapView';

export default function Home() {
  return (
    <div className='p-10'>
      <ListingMapView Type='Sell' />
    </div>

  );

}
