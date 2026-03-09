import {
  CreateGoogleUser,
  CreateUser,
  UpdateUser,
  User,
  UserPreview,
} from "../entities/dto/user.dto";
import {
  USER_FIELDS_EXCEPT_AUTH,
  UserModel,
} from "../entities/mongodb/user.module";
import { handleDuplicateKeyException } from "../exceptions/mongoException";

export const getAllUsers = async (): Promise<UserPreview[]> =>
  await UserModel.find({}).select(USER_FIELDS_EXCEPT_AUTH);

export const getUserById = async (
  id: User["_id"],
): Promise<UserPreview | null> => {
  const result = await UserModel.aggregate([
    { $match: { _id: id } },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "sender",
        as: "userPosts",
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { postIds: "$userPosts._id" },
        pipeline: [{ $match: { $expr: { $in: ["$postId", "$$postIds"] } } }],
        as: "allLikes",
      },
    },
    {
      $addFields: {
        postsCount: { $size: "$userPosts" },
        likesCount: { $size: "$allLikes" },
      },
    },
    {
      $project: {
        password: 0,
        googleId: 0,
        userPosts: 0,
        allLikes: 0,
      },
    },
  ]);

  return result[0] ?? null;
};

export const getUserByUsername = async (
  username: User["username"],
): Promise<User | null> => await UserModel.findOne({ username });

export const getUserByEmail = async (
  email: User["email"],
): Promise<User | null> => await UserModel.findOne({ email });

export const createUser = async (
  userData: CreateUser | CreateGoogleUser,
): Promise<UserPreview> => {
  const user = new UserModel(userData);
  const { password, googleId, ...newUser } = (
    await user.save().catch((err) => handleDuplicateKeyException(err))
  ).toObject();

  return newUser;
};

export const updateUser = async (
  id: User["_id"],
  userData: UpdateUser,
): Promise<User | null> =>
  await UserModel.findByIdAndUpdate(id, userData, { new: true }).catch((err) =>
    handleDuplicateKeyException(err),
  );

export const deleteUser = async (id: User["_id"]): Promise<boolean> =>
  (await UserModel.deleteOne({ _id: id }).exec()).deletedCount > 0;

export const doesUserExist = async (id: User["_id"]): Promise<boolean> =>
  !!(await UserModel.exists({ _id: id }));

export const usersRepository = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  doesUserExist,
};
