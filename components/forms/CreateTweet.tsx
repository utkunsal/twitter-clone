"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ChangeEvent, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useUploadThing } from "@/lib/uploadthing"
import { usePathname, useRouter } from "next/navigation"
import { TweetValidation } from "@/lib/validations/tweet"
import { createTweet } from "@/lib/actions/tweet.actions"
import Image from "next/image"


export default function CreateTweet({ userId }: {userId: string}){
  const [file, setFile] = useState<File | null>()
  const { startUpload } = useUploadThing("media")
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(TweetValidation),
    defaultValues: {
      tweet: "",
      image: "",
      userId: userId,
    }
  });

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void ) => {
    e.preventDefault()

    const fileReader = new FileReader()
    if (e.target.files?.length){
      const file = e.target.files[0]
      if (!file.type.includes("image"))
        return
      setFile(file)

      fileReader.onload = async (e) => {
        const imageDataUrl = e.target?.result?.toString() || ""
        fieldChange(imageDataUrl)
      }

      fileReader.readAsDataURL(file)
    }
  }

  const onSubmit = async (values: z.infer<typeof TweetValidation>) => {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator?.classList.remove('hidden');

    let imageUrl = null
    if (file){
      const response = await startUpload([file])
      if (response && response[0].url){
        imageUrl = response[0].url
      }
    }

    await createTweet({
      text: values.tweet,
      image: imageUrl,
      author: values.userId,
      communityId: null, // TODO
      path: pathname,
    })

    router.push("/")
  }

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="gap-10 mt-10 flex flex-col justify-start">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormLabel className="tweet-card_image">
                {field.value ? 
                  <div className="relative">
                    <Image 
                      src={field.value}
                      alt="image"
                      width={96}
                      height={96}
                      priority
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        field.onChange("");
                        setFile(null);
                        const fileInput = document.getElementById("image-input") as HTMLInputElement;
                        if (fileInput) {
                          fileInput.value = ""; 
                        }
                      }}
                      className="absolute top-0 right-0 px-1.5 pb-1 m-1 bg-gray-600 bg-opacity-60 text-light-2 rounded-md"
                    >
                      x
                    </button>
                  </div>
                  :
                  <Image 
                    src="/assets/image.svg"
                    alt="image"
                    width={25}
                    height={25}
                    className="object-contain"
                  />
                }
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input 
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="form-input_image"
                  id="image-input"
                  onChange={e => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tweet"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
              Content
              </FormLabel>
              <FormControl className="no-focus border bg-dark-3 text-light-1 border-dark-4">
              <Textarea 
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit"
          className="bg-primary-500"
        >
          Post 
          <span id="loadingIndicator" className="hidden animate-spin rounded-full border-opacity-70 ml-3.5 h-5 w-5 border-t-2 border-r-2 border-gray-300"></span>
        </Button>
      </form>
    </Form>
  )
}