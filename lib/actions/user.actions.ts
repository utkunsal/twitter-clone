"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDb } from "../mongoose"
import Tweet from "../models/tweet.model"
import { FilterQuery, SortOrder } from "mongoose"

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


export const getRandomUsers = async (userId: string) => {
  try {
    await connectToDb()
    const users =  await User.aggregate([ 
      { $match : { id: { $ne: userId } } },
      { $sample: { size: 5 } },
      { $project : { _id: 0, id: 1, image: 1, username: 1, name: 1 } }
    ])
    return users;
  } catch (err: any) {
    console.error(`Failed to get random users: ${err.message}`)
    return [];
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


/**
 * To get all tweets of a user
 * @param userId  id of the user
 * @returns       parent tweets of the given user
 */
export const getUserTweets = async ( userId: string ) => {
  try {
    await connectToDb()

    const result = await User.findOne({ id: userId })
      .populate({
        path: "tweets",
        model: Tweet,
        select: "_id text image author parent repost children createdAt likeCount",
        options: {
          sort: { createdAt: "desc" }
        },
        match: {
          parent: {
            $in: [null, undefined]
          },
        },
        populate: [
          {
            path: "children",
            model: Tweet,
            select: "_id text image author parent children createdAt likeCount",
            populate: {
              path: "author",
              model: User,
              select: "name username image id", 
            },
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
        ],
      })
      
    return result;

  } catch (err: any) {
    throw new Error(`Failed to get user posts: ${err.message}`);
  }
}


/**
 * To get all replies of a user with parent tweets
 * @param userId  id of the user
 * @returns       user's replies with their parents
 */
export const getUserReplies = async ( userId: string ) => {
  try {
    await connectToDb()

    const result = await User.findOne({ id: userId })
      .populate({
        path: "tweets",
        model: Tweet,
        select: "_id text image author parent children createdAt likeCount",
        options: {
          sort: { createdAt: "desc" }
        },
        match: {
          parent: {
            $nin: [null, undefined]
          },
        },
        populate: {
          path: "parent",
          model: Tweet,
          select: "_id text image author parent repost children createdAt likeCount",
          populate: [
            {
              path: "author",
              model: User,
              select: "name username image id", 
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
        }
      })

    return result;

  } catch (err: any) {
    throw new Error(`Failed to get user replies: ${err.message}`);
  }
}


/**
 * To get a user's all liked posts
 * @param userId  id of the user
 * @returns       tweets with parent info if they have parents
 */
export const getUserLikes = async ( userId: string ) => {
  try {
    await connectToDb()
    const { _id } = await User.findOne({ id: userId }, "_id")

    const likes = await Tweet.find({ likes: _id }, "_id text image author parent repost children createdAt likeCount")
      .sort({ createdAt: "desc" })
      .populate("author")
      .populate({ 
        path: "parent", 
        populate: {
            path: "author",
            model: User,
            select: "id name username image",
          }
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

    return likes;

  } catch (err: any) {
    throw new Error(`Failed to get user likes: ${err.message}`);
  }
}


/**
 * To search users by username or name with pagination, case insensitive
 * @returns Users that match the search result and hasNext: boolean
 */
export const searchUsers = async ({
  userId,
  searchString = "",
  pageNumber=1,
  pageSize=20,
  sortBy="desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) => {
  try {
    await connectToDb();

    const offset = (pageNumber-1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = { id: { $ne: userId } }

    if (searchString.trim() !== ""){
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };
    const usersQuery = User.find(query)
                            .sort(sortOptions)
                            .skip(offset)
                            .limit(pageSize);

    const [users, totalUsersCount]  = await Promise.all([
      usersQuery.exec(),
      User.countDocuments(query)
    ])

    const hasNext = offset + users.length < totalUsersCount

    return { users, hasNext };

  } catch (err: any) {
    throw new Error(`Failed to get users: ${err.message}`);
  }
}


export const getUserActivity = async ( userId: string ) => {
  try {
    await connectToDb()

    const userTweets = await Tweet.find({ author: userId });

    const childTweetIds = userTweets.reduce((acc, tweet) => {
      return acc.concat(tweet.children);
    }, []);

    const replies = await Tweet.find({
      _id: { $in: childTweetIds },
      author: { $ne: userId },
    }, "_id text image author parent createdAt likeCount")
    .populate({
      path: "author",
      model: User,
      select: "name username image _id",
    });

    return replies;

  } catch (err: any) {
    throw new Error(`Failed to get user activity: ${err.message}`);
  }
}


export const followUser = async ({ targetUserObjectId, currentUserId, path }: { targetUserObjectId: string, currentUserId: string, path: string }) => {
  try {
    await connectToDb()
    const { _id } = await User.findOne({ id: currentUserId }, "_id")

    await Promise.all([
        User.updateOne({ 
        "_id": _id, 
        "following": { "$ne": targetUserObjectId }
      },
      {
        "$push": { "following": targetUserObjectId }
      }),
      User.updateOne({ 
        "_id": targetUserObjectId, 
        "followers": { "$ne": _id }
      },
      {
        "$push": { "followers": _id }
      })
    ])
    
    revalidatePath(path)

  } catch (err: any) {
    throw new Error(`Failed to follow user: ${err.message}`);
  }
}


export const unfollowUser = async ({ targetUserObjectId, currentUserId, path }: { targetUserObjectId: string, currentUserId: string, path: string }) => {
  try {
    await connectToDb()
    const { _id } = await User.findOne({ id: currentUserId }, "_id")
  
    await Promise.all([
        User.updateOne({ 
        "_id": _id, 
        "following": targetUserObjectId
      },
      {
        "$pull": { "following": targetUserObjectId }
      }),
      User.updateOne({ 
        "_id": targetUserObjectId, 
        "followers": _id
      },
      {
        "$pull": { "followers": _id }
      })
    ])
    
    revalidatePath(path)

  } catch (err: any) {
    throw new Error(`Failed to unfollow user: ${err.message}`);
  }
}


export const isFollowing = async ({ targetUserObjectId, currentUserId }: { targetUserObjectId: string, currentUserId: string }) => {
  try {
    await connectToDb()
    if(!currentUserId) return

    const result = await User.findOne({ 
      "id": currentUserId,
      "following": targetUserObjectId,
    })

    return result?.followers ? true : false

  } catch (err: any) {
    throw new Error(`Failed to get isFollowing: ${err.message}`);
  }
}