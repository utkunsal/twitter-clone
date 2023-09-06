"use server"

import { revalidatePath } from "next/cache"
import { connectToDb } from "../mongoose"
import Tweet from "../models/tweet.model"
import User from "../models/user.model"

interface Params {
  text: string,
  author: string,
  image: string | null,
  repostId?: string | null,
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
  repostId,
  path,
}: Params): Promise<void> => {
  try {
    await connectToDb()
    
    const createdTweet = await Tweet.create(!repostId ? {
      text,
      image,
      author,
    } : {
      text,
      image,
      author,
      repost: repostId,
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
      parent: parentTweet._id,
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
 * @param pageNumber:     number of the requested page
 * @param pageSize:       tweet count in a single page
 * @returns               tweets[] and hasNext:boolean(true if next page exists)
 */
export const getTweets = async ( pageNumber=1, pageSize=15 ) => {
  try {
    await connectToDb()
    //const { _id } = await User.findOne({ id: currentUserId }, "_id")

    const offset = (pageNumber - 1) * pageSize

    const query = Tweet
                    .find({ parent: { $in: [null, undefined] } }, "_id text image author parent children createdAt likeCount repost")
                    .sort({ createdAt: "desc" })
                    .skip(offset)
                    .limit(pageSize)
                    .populate({ 
                      path: "author", 
                      model: User, 
                      select: "id name username image",
                    })
                    .populate({ 
                      path: "children", 
                      model: Tweet,
                      select: "_id text image author parent children createdAt likeCount",
                      populate: [
                        {
                          path: "author",
                          model: User,
                          select: "id name username image",
                        },
                        {
                          path: "children",
                          model: Tweet,
                          select: "_id text image author parent children createdAt likeCount",
                          populate: {
                            path: "author",
                            model: User,
                            select: "id name username image"
                          }
                        }
                      ],
                    })
                    .populate({ 
                      path: "repost", 
                      model: Tweet,
                      select: "_id text image author parent createdAt likeCount",
                      populate:  {
                        path: "author",
                        model: User,
                        select: "id name username image",
                      },
                    })
  
  const tweets = await query.exec();

  const totalTweetCount = await Tweet.countDocuments({ parent: { $in: [null, undefined] } });
  const hasNext = totalTweetCount > offset + tweets.length;

  return { tweets, hasNext }

  } catch (err: any) {
    throw new Error(`Failed to get tweets: ${err.message}`);
  }
}


/**
 * Gets tweet with children, children of children and parent if exists, both populated with authors
 * @param id: id of the requsted tweet
 * @returns   requested tweet with parent(if exists) and children[]
 */
export const getTweetById = async ( id: string ) => {
  try {
    await connectToDb()
    
    const tweet = await Tweet
                            .findById(id, "_id text image author parent repost children createdAt likeCount")
                            .populate({
                              path: "author",
                              model: User,
                              select: "id name username image"
                            })
                            .populate({
                              path: "parent",
                              model: Tweet,
                              select: "_id text image author parent repost children createdAt likeCount",
                              populate: [
                                {
                                  path: "author",
                                  model: User,
                                  select: "id name username image"
                                },
                                {
                                  path: "repost",
                                  model: Tweet,
                                  select: "_id text image author parent createdAt likeCount",
                                  populate: {
                                    path: "author",
                                    model: User,
                                    select: "name username image id", 
                                  },
                                }
                              ]
                            })
                            .populate({
                              path: "children",
                              model: Tweet,
                              select: "_id text image author parent children createdAt likeCount",
                              populate: [
                                {
                                  path: "author",
                                  model: User,
                                  select: "id name username image"
                                },
                                {
                                  path: "children",
                                  model: Tweet,
                                  select: "_id text image author parent children createdAt likeCount",
                                  populate: {
                                    path: "author",
                                    model: User,
                                    select: "id name username image"
                                  }
                                }
                              ]
                            })
                            .populate({ 
                              path: "repost", 
                              model: Tweet,
                              select: "_id text image author parent createdAt likeCount",
                              populate:  {
                                path: "author",
                                model: User,
                                select: "id name username image",
                              },
                            })
                            .exec();

      return tweet;

  } catch (err: any) {
    throw new Error(`Failed to get tweet with id: ${id}: ${err.message}`);
  }
}


/**
 * Populates all parent tweets of the given tweet with tweetId
 * @returns Parent tweet with all of its parents populated
 */
export async function getAllParentTweets(tweetId: string) {
  await connectToDb()

  const parents = await Tweet
    .findById(tweetId, "parent")
    .populate({
      path: "author",
      model: User,
      select: "id name username image"
    })
    .populate({
      path: "parent",
      select: "_id text image author parent repost createdAt likeCount",
      populate: [
        {
          path: "author",
          model: User,
          select: "id name username image"
        },
        {
          path: "parent",
          model: Tweet,
          select: "_id text image author parent repost createdAt likeCount",
          populate: [
            {
            path: "author",
            model: User,
            select: "id username image"
            },
            {
              path: "repost",
              model: Tweet,
              select: "_id text image author parent createdAt likeCount",
              populate: {
                path: "author",
                model: User,
                select: "name username image id", 
              },
            }
          ]
        },
        {
          path: "repost",
          model: Tweet,
          select: "_id text image author parent createdAt likeCount",
          populate: {
            path: "author",
            model: User,
            select: "name username image id", 
          },
        }
      ]
    })
    .exec()

  if (!parents) {
    return null;
  }
  if (!parents.parent || !parents.parent?.parent) {
    return parents.parent;
  }
  // Expected depth is mostly small, so recursion wont affect performance a lot.
  parents.parent.parent.parent = await getAllParentTweets(parents.parent.parent);                          

  return parents.parent;
}


export const likeTweet = async ({ tweetId, currentUserId, path }: { tweetId: string, currentUserId: string, path: string }) => {
  try {
    await connectToDb()
    if(!currentUserId) return

    const { _id } = await User.findOne({ id: currentUserId }, "_id")

    await Tweet.updateOne({ 
      "_id": tweetId, 
      "likes": { "$ne": _id }
    },
    {
      "$inc": { "likeCount": 1 },
      "$push": { "likes": _id }
    })
    
    revalidatePath(path)

  } catch (err: any) {
    throw new Error(`Failed to like tweet: ${err.message}`);
  }
}


export const removeLikeTweet = async ({ tweetId, currentUserId, path }: { tweetId: string, currentUserId: string, path: string }) => {
  try {
    await connectToDb()
    if(!currentUserId) return

    const { _id } = await User.findOne({ id: currentUserId }, "_id")

    await Tweet.updateOne({ 
      "_id": tweetId, 
      "likes": _id
    },
    {
      "$inc": { "likeCount": -1 },
      "$pull": { "likes": _id }
    })
    
    revalidatePath(path)

  } catch (err: any) {
    throw new Error(`Failed to remove like tweet: ${err.message}`);
  }
}


/**
 * @returns true if the given tweet is liked by given user
 */
export const isLiked = async ({ tweetId, currentUserId }: { tweetId: string, currentUserId: string }) => {
  try {
    await connectToDb()
    if(!currentUserId) return
    
    const { _id } = await User.findOne({ id: currentUserId }, "_id")

    const result = await Tweet.findOne({ 
      "_id": tweetId,
      "likes": _id,
    })

    return result?.likes ? true : false

  } catch (err: any) {
    throw new Error(`Failed to get isLiked: ${err.message}`);
  }
}