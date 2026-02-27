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
  id: User["_id"]
): Promise<UserPreview | null> =>
  await UserModel.findById(id).select(USER_FIELDS_EXCEPT_AUTH);

export const getUserByUsername = async (
  username: User["username"]
): Promise<User | null> => await UserModel.findOne({ username });

export const getUserByEmail = async (
  email: User["email"]
): Promise<User | null> => await UserModel.findOne({ email });

export const createUser = async (
  userData: CreateUser | CreateGoogleUser
): Promise<UserPreview> => {
  const user = new UserModel(userData);
  const { password, googleId, ...newUser } = (
    await user.save().catch((err) => handleDuplicateKeyException(err))
  ).toObject();

  return newUser;
};

export const updateUser = async (
  id: User["_id"],
  userData: UpdateUser
): Promise<User | null> =>
  await UserModel.findByIdAndUpdate(id, userData, { new: true }).catch((err) =>
    handleDuplicateKeyException(err)
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
