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
import { UserValidation } from "@/lib/validations/user"
import Image from "next/image"
import * as z from "zod"
import { ChangeEvent, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { isBase64Image } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadthing"
import { updateUser } from "@/lib/actions/user.actions"
import { usePathname, useRouter } from "next/navigation"

interface Props {
  user: {
    id: string,
    username: string,
    name: string,
    bio: string,
    imageUrl: string,
  },
}

export default function AccountProfile({ user }: Props) {
  const [file, setFile] = useState<File>()
  const { startUpload } = useUploadThing("media")
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profilePhoto: user?.imageUrl || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
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

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator?.classList.remove('hidden');
    
    const image = values.profilePhoto

    const isNewImage = isBase64Image(image)
    if (isNewImage && file){
      const response = await startUpload([file])
      if (response && response[0].url){
        values.profilePhoto = response[0].url
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profilePhoto,
      path: pathname,
    })

    pathname === "/profile/edit" ? router.back() : router.push("/");
  }

  return(
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="gap-10 flex flex-col justify-start">
      <FormField
        control={form.control}
        name="profilePhoto"
        render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormLabel className="account-form_image-label">
              {field.value ? 
                <Image 
                  src={field.value}
                  alt="profile photo"
                  width={90}
                  height={90}
                  priority
                  className="rounded-full object-contain"
                />
                :
                <Image 
                  src="/assets/image.svg"
                  alt="profile photo"
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
                onChange={e => handleImage(e, field.onChange)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full gap-3">
            <FormLabel className="text-base-semibold text-light-2">
             Name
            </FormLabel>
            <FormControl>
              <Input 
                type="text"
                className="account-form_input no-focus"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full gap-3">
            <FormLabel className="text-base-semibold text-light-2">
             Username
            </FormLabel>
            <FormControl>
              <Input 
                type="text"
                className="account-form_input no-focus"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full gap-3">
            <FormLabel className="text-base-semibold text-light-2">
            Bio
            </FormLabel>
            <FormControl>
              <Textarea 
                rows={3}
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
        Continue
        <span id="loadingIndicator" className="hidden animate-spin rounded-full border-opacity-70 ml-3.5 h-5 w-5 border-t-2 border-r-2 border-gray-300"></span>
      </Button>
    </form>
  </Form>
  )
}