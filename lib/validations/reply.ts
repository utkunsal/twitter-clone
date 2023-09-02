import * as z from "zod"

export const ReplyValidation = z.object({
  tweet: z.string().nonempty().min(2, { message: "Your reply cannot be shorter than 2 characters." }),
  image: z.string().refine((value) => value === "" || /^(https?:\/\/)?\S+/.test(value)),
  userId: z.string(),
})