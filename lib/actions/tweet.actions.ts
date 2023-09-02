"use server"

import { revalidatePath } from "next/cache"
import { connectToDb } from "../mongoose"
import Tweet from "../models/tweet.model"
import User from "../models/user.model"

interface Params {
  text: string,
  author: string,
  image: string | null,
  communityId: string | null,
  path: string,
}

export const createTweet = async ({
  text,
  image,
  author,
  communityId,
  path,
}: Params): Promise<void> => {
  try {
    await connectToDb()
    
    const createdTweet = await Tweet.create({
      text,
      image,
      author,
      community: null, // TODO
    })

    await User.findByIdAndUpdate(author, {
      $push: { tweets: createdTweet._id }
    })

    revalidatePath(path)

  } catch (err: any) {
    throw new Error(`Failed to create tweet: ${err.message}`);
  }
}