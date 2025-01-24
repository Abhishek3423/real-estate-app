"use client"

import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../utils/supabase/client'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import FileUpload from '../_components/FileUpload'
import { Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const validationSchema = Yup.object({
  bedroom: Yup.number().required('Required'),
  bathroom: Yup.number().required('Required'),
  builtin: Yup.number().required('Required'),
  parking: Yup.number().required('Required'),
  lotSize: Yup.number().required('Required'),
  area: Yup.number().required('Required'),
  price: Yup.number().required('Required'),
  hoa: Yup.number().required('Required'),
  description: Yup.string().required('Required'),
})

function EditListing({ params }) {
  const { user } = useUser();
  const router = useRouter();
  const [listingData, setListingData] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const verifyUser = async () => {
    try {
      console.log('Verifying user with email:', user?.primaryEmailAddress.emailAddress);
      console.log('Verifying listing with id:', params.id);

      const { data, error } = await supabase
        .from('listing')
        .select('*, listingImages(listing_id, url)')
        .eq('createdBy', user?.primaryEmailAddress.emailAddress)
        .eq('id', params.id.toString());

      if (error) {
        console.error('Error fetching listing:', error);
        router.push('/');
        return;
      }

      console.log('Supabase response data:', data);

      if (!data || data.length === 0) {
        console.log('No listing found for the given id');
        router.push('/');
      } else {
        console.log('Listing found:', data);
        setListingData(data[0]);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      router.push('/');
    }
  };

  useEffect(() => {
    if (user && params.id) {
      verifyUser();
    }
  }, [user, params.id]);

  const onSubmitHandler = async (formValues, publish = false) => {
    setLoading(true);
    console.log('Form values:', formValues); // Log form values

    const updateValues = { ...formValues };
    if (publish) {
      updateValues.Active = true;
    }

    const { data, error } = await supabase
      .from('listing')
      .update(updateValues)
      .eq('id', params.id)
      .select();

    if (error) {
      console.error('Error updating listing:', error); // Log error
      toast('Error updating listing');
      setLoading(false);
      return;
    }

    if (data) {
      console.log('Listing updated:', data); // Log updated data
      toast(publish ? 'Listing updated and Published' : 'Listing updated');
      setListingData(formValues);
      setLoading(false);
    }

    for (const image of images) {
      const file = image;
      const fileName = Date.now().toString();
      const fileExt = file.name.split('.').pop();
      const { data: uploadData, error: uploadError } = await supabase.storage.from('listingImages').upload(`${fileName}.${fileExt}`, file, {
        contentType: `image/${fileExt}`,
        upsert: false
      });

      if (uploadError) {
        console.error('Error uploading images:', uploadError); // Log error
        setLoading(false);
        toast('Error uploading images');
        return;
      }

      const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName + '.' + fileExt;
      const { data: insertData, error: insertError } = await supabase
        .from('listingImages')
        .insert([{ url: imageUrl, listing_id: params.id }])
        .select();

      if (insertError) {
        console.error('Error inserting image URL:', insertError); // Log error
        setLoading(false);
        return;
      }

      console.log('Image uploaded and URL inserted:', insertData); // Log inserted data
    }
  };

  return (
    <div className='px-10 md:px-36 my-10'>
      <h2 className='font-bold text-2xl'>Enter some more details about your listing</h2>
      <Formik
        initialValues={{
          Type: listingData?.Type || '',
          propertyType: listingData?.propertyType || '',
          bedroom: listingData?.bedroom || '',
          bathroom: listingData?.bathroom || '',
          builtin: listingData?.builtin || '',
          parking: listingData?.parking || '',
          lotSize: listingData?.lotSize || '',
          area: listingData?.area || '',
          price: listingData?.price || '',
          hoa: listingData?.hoa || '',
          description: listingData?.description || '',
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmitHandler(values);
        }}
      >
        {({ values, handleChange, handleSubmit, isSubmitting, dirty, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <div className='p-8 rounded-lg shadow-md'>
              <div className='grid grid-cols-1 md:grid-cols-3'>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-lg text-slate-500'>Rent or Sell?</h2>
                  <RadioGroup defaultValue={listingData?.Type || "Sell"}>
                    <div className="flex items-center space-x-2">
                      <Field type="radio" name="Type" value="Rent" id="Rent" className="border border-gray-300" />
                      <Label htmlFor="Rent">Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Field type="radio" name="Type" value="Sell" id="Sell" className="border border-gray-300" />
                      <Label htmlFor="Sell">Sell</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-lg text-slate-500'>Property Type</h2>
                  <Field as="select" name="propertyType" className="w-[180px] border border-gray-300">
                    <option value="" label="Select Property Type" />
                    <option value="Single Family House" label="Single Family House" />
                    <option value="Town House" label="Town House" />
                    <option value="Condo" label="Condo" />
                  </Field>
                  <ErrorMessage name="propertyType" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-gray-500'>Bedroom</h2>
                  <Field type="number" name="bedroom" placeholder="Ex.2" className="border border-gray-300 rounded-lg" />
                  <ErrorMessage name="bedroom" component="div" className="text-red-500 text-sm" />
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-gray-500'>Bathroom</h2>
                  <Field type="number" name="bathroom" placeholder="Ex.2" className="border border-gray-300 rounded-lg" />
                  <ErrorMessage name="bathroom" component="div" className="text-red-500 text-sm" />
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-gray-500'>Built In</h2>
                  <Field type="number" name="builtin" placeholder="Ex.1900 sq.ft" className="border border-gray-300 rounded-lg" />
                  <ErrorMessage name="builtin" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-gray-500'>Parking</h2>
                  <Field type="number" name="parking" placeholder="Ex.2" className="border border-gray-300 rounded-lg" />
                  <ErrorMessage name="parking" component="div" className="text-red-500 text-sm" />
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-gray-500'>Lot Size (Sq.Ft)</h2>
                  <Field type="number" name="lotSize" placeholder="" className="border border-gray-300 rounded-lg" />
                  <ErrorMessage name="lotSize" component="div" className="text-red-500 text-sm" />
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-gray-500'>Area(Sq.Ft)</h2>
                  <Field type="number" name="area" placeholder="EX.1900" className="border border-gray-300 rounded-lg" />
                  <ErrorMessage name="area" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-gray-500'>Selling Price($)</h2>
                  <Field type="number" name="price" placeholder="400000" className="border border-gray-300 rounded-lg" />
                  <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                </div>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>HOA(Per Month)($)</h2>
                  <Field type="number" name="hoa" placeholder="100" className="border border-gray-300 rounded-lg" />
                  <ErrorMessage name="hoa" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <div className='grid grid-cols-1 gap-10'>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>Description</h2>
                  <Field as={Textarea} name="description" placeholder="" className="border border-gray-300" />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <div className='mt-3'>
                <h2 className='font-lg text-gray-500 my-2'>Upload Property Image's</h2>
                <FileUpload setImage={(value) => setImages(value)}
                  imageList={listingData.listingImages}
                />
              </div>
              <div className='flex justify-end gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                <button type="submit" disabled={isSubmitting || (!dirty && images.length === 0) || !isValid || loading} className='text-primary outline-primary outline px-4 py-2 rounded-lg mt-4'>
                  {loading ? <Loader className='animate-spin' /> : 'Save'}
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button type="button" disabled={isSubmitting || (!dirty && images.length === 0) || !isValid || loading} className='bg-primary text-white px-4 py-2 rounded-lg mt-4'>
                      {loading ? <Loader className='animate-spin' /> : 'Save & Publish'}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ready to publish?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Do you want to publish this listing?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onSubmitHandler(values, true)}>
                        {loading ? <Loader className='animate-spin' /> : 'Continue'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditListing;