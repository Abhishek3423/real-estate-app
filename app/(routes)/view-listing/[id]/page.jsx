"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../utils/supabase/client'
import { toast } from 'sonner';
import Slider from '../_components/slider'

function viewListing({ params }) {
  const [listingDetail, setListingDetail] = useState();
  useEffect(() => {
    GetListingDetail()
  }, [])
  const GetListingDetail = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select('*,listingImages(url,listing_id)')
      .eq('id', params.id)
      .eq('Active', true);

    if (data) {
      setListingDetail(data[0])
      // console.log(data)
    }
    if (error) {
      toast.error("server side error")
    }
  };
  return (
    <div>
      <Slider imageList={listingDetail?.listingImages} />
    </div >
  )
}

export default viewListing