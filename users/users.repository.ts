import { CreateUser, UpdateUser, User } from "../entities/dto/user.dto";
import { UserModel } from "../entities/mongodb/user.module";

export const getAllUsers = async (): Promise<User[]> =>
  await UserModel.find({}).exec();

export const getUserById = async (id: User["_id"]): Promise<User | null> =>
  await UserModel.findById(id).exec();

export const createUser = async (userData: CreateUser): Promise<User> => {
  const user = new UserModel(userData);
  return await user.save();
};

export const updateUser = async (
  id: User["_id"],
  userData: UpdateUser
): Promise<User | null> =>
  await UserModel.findByIdAndUpdate(id, userData, { new: true }).exec();

export const deleteUser = async (id: User["_id"]): Promise<boolean> =>
  (await UserModel.deleteOne({ _id: id }).exec()).deletedCount > 0;

export const usersRepository = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};