import * as z from "zod"

export const UserValidation = z.object({
  profilePhoto: z.string().url().nonempty(),
  name: z.string().min(3).max(33),
  username: z.string().min(3).max(33),
  bio: z.string().min(3).max(1111),
})
