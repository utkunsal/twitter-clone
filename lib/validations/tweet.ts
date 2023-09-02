import * as z from "zod"

export const TweetValidation = z.object({
  tweet: z.string().nonempty().min(2, { message: "A tweet cannot be shorter than 2 characters." }),
  image: z.string().refine((value) => value === "" || /^(https?:\/\/)?\S+/.test(value)),
  userId: z.string(),
})
