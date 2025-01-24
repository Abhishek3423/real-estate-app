import { MarkerF, OverlayView } from '@react-google-maps/api';
import React, { useState } from 'react';
import MarkerListingItem from './MarkerListingItem';

function MarkerItem({ item }) {
  const [selectedListing, setSelectedListing] = useState(null);
  const { Coordinates } = item;

  return (
    <div>
      <MarkerF
        position={Coordinates}
        onClick={() => {
          setSelectedListing(item);
        }}
        icon={{
          url: '/marker.png',
          scaledSize: {
            width: 40,
            height: 40,
          }
        }}
      >
        {selectedListing && (
          <OverlayView
            position={selectedListing.Coordinates}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div>
              <MarkerListingItem
                closeHandler={() => setSelectedListing(null)}
                item={selectedListing} />
            </div>
          </OverlayView>
        )}
      </MarkerF>
    </div>
  );
}

export default MarkerItem;