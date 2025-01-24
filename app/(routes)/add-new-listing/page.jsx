"use client"
import React, { useState } from "react";
import GoogleAddressSearch from "../../_components/GoogleAddressSearch";
import { Button } from "../../../components/ui/button";
import { supabase } from "../../../utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner"
import { Loader, LocateIcon } from "lucide-react";
import { useRouter } from "next/navigation";



function AddNewListing() {
  const [selectedAddress, setSelectedAddress] = useState();
  const [coordinates, setCoordinates] = useState();
  const { user } = useUser();
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const nextHandler = async () => {
    setLoader(true);
    const { data, error } = await supabase
      .from('listing')
      .insert([
        { Address: selectedAddress, Coordinates: coordinates, createdBy: user?.primaryEmailAddress.emailAddress },
      ])
      .select();

    if (data) {
      setLoader(false);

      toast("New Address Added for Listing", "success");
      router.push("/edit-listing/" + data[0].id);
    }
    if (error) {
      setLoader(false);

      toast("Error while adding new address", "error");
    }
  };

  return (
    <div className="mt-10 md:mx-56 lg:mx-80">
      <div className="p-10 flex flex-col gap-5 items-center justify-center">
        <h2 className="font-bold text-2xl">Add New Listing</h2>
        <div className="p-10 rounded-lg border w-full shadow-md flex flex-col gap-5">
          <h2 className="text-gray-500">Enter Address Which You Want To List</h2>
          <GoogleAddressSearch
            selectedAddress={(value) => setSelectedAddress(value)}
            setCoordinates={(value) => setCoordinates(value)}
          />
          <Button
            disabled={!selectedAddress || !coordinates || loader}
            onClick={nextHandler}
          >
            {loader ? <Loader className="
            animate-spin" /> : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddNewListing;