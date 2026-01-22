import { CreateUser, UpdateUser, User } from "../entities/dto/user.dto";
import {
  USER_FIELDS_EXCEPT_PASSWORD,
  UserModel,
} from "../entities/mongodb/user.module";
import { handleDuplicateKeyException } from "../exceptions/mongoException";

export const getAllUsers = async (): Promise<User[]> =>
  await UserModel.find({}).select(USER_FIELDS_EXCEPT_PASSWORD);

export const getUserById = async (id: User["_id"]): Promise<User | null> =>
  await UserModel.findById(id).select(USER_FIELDS_EXCEPT_PASSWORD);

export const getUserByUsername = async (
  username: User["username"]
): Promise<User | null> => await UserModel.findOne({ username });

export const getUserByEmail = async (
  email: User["email"]
): Promise<User | null> => await UserModel.findOne({ email });

export const createUser = async (userData: CreateUser): Promise<User> => {
  const user = new UserModel(userData);
  return await user.save().catch((err) => handleDuplicateKeyException(err));
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
