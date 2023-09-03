"use server"

import { revalidatePath } from "next/cache"
import { connectToDb } from "../mongoose"
import Tweet from "../models/tweet.model"
import User from "../models/user.model"

interface Params {
  text: string,
  author: string,
  image: string | null,
  communityId?: string | null,
  path: string,
  tweetId?: string,
}


/**
 * Creates a new tweet and adds it to user's tweets.
 */
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


/**
 * Creates a new child tweet as reply to the given parent tweet with tweetId.
 */
export const addReplyToTweet = async ({
  text,
  image,
  author,
  path,
  tweetId,
}: Params) => {
  try {
    await connectToDb()

    const parentTweet = await Tweet.findById(tweetId);
    if (!parentTweet)
      throw new Error(`Tweet not found with id: ${tweetId}.`)

    const newTweet = await Tweet.create({
      text,
      image,
      author,
      parentId: tweetId,
    })
  
    const savedNewTweet = await newTweet.save();

    parentTweet.children.push(savedNewTweet._id);

    await Promise.all([
      User.findByIdAndUpdate(author, { $push: { tweets: savedNewTweet._id } }),
      parentTweet.save()
    ])

    revalidatePath(path);

  } catch (err: any) {
    throw new Error(`Failed to create reply: ${err.message}`);
  }
}


/**
 * Gets recent tweets from all users
 * @param pageNumber: number of the requested page
 * @param pageSize:   tweet count in a single page
 * @returns           tweets[] and hasNext:boolean(true if next page exists)
 */
export const getTweets = async ( pageNumber=1, pageSize=15 ) => {
  try {
    await connectToDb()
    
    const offset = (pageNumber - 1) * pageSize

    const query = Tweet
                    .find({ parentId: { $in: [null, undefined] } })
                    .sort({ createdAt: "desc" })
                    .skip(offset)
                    .limit(pageSize)
                    .populate({ 
                      path: "author", 
                      model: User, 
                      select: "_id id name username image",
                    })
                    .populate({ 
                      path: "children", 
                      populate: ({
                        path: "author",
                        model: User,
                        select: "_id id name username image",
                      }),
                    })
  
  const tweets = await query.exec();

  const totalTweetCount = await Tweet.countDocuments({ parentId: { $in: [null, undefined] } });
  const hasNext = totalTweetCount > offset + tweets.length;

  return { tweets, hasNext }

  } catch (err: any) {
    throw new Error(`Failed to get tweets: ${err.message}`);
  }
}


/**
 * Gets tweet with children, both populated with authors
 * @param id: id of the requsted tweet
 * @returns   requested tweet with children[]
 */
export const getTweetById = async ( id: string ) => {
  try {
    await connectToDb()
    
    const tweet = await Tweet
                            .findById(id)
                            .populate({
                              path: "author",
                              model: User,
                              select: "_id id name username image"
                            })
                            .populate({
                              path: "children",
                              populate: [
                                {
                                  path: "author",
                                  model: User,
                                  select: "_id id name username image"
                                },
                                {
                                  path: "children",
                                  model: Tweet,
                                  populate: {
                                    path: "author",
                                    model: User,
                                    select: "_id id name username image"
                                  }
                                }
                              ]
                            })
                            .exec();

      return tweet;

  } catch (err: any) {
    throw new Error(`Failed to get tweet with id: ${id}: ${err.message}`);
  }
}