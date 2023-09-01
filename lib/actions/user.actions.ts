"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDb } from "../mongoose"

interface Params {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string,
}

export const getUser = async (userId: string) => {
  try {
    await connectToDb()
    return await User.findOne({ id: userId })
  } catch (err: any) {
    throw new Error(`Failed to get user: ${err.message}`);
  }
}

export const updateUser = async ({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> => {
  try {
    await connectToDb()
    await User.findOneAndUpdate({ id: userId }, 
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    };
  } catch (err: any) {
    throw new Error(`Failed to create/update user: ${err.message}`);
  }
}