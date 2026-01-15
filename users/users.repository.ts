import { CreateUser, UpdateUser, User } from "../entities/dto/user.dto";
import { UserModel } from "../entities/mongodb/user.module";
import { handleDuplicateKeyException } from "../exceptions/mongoException";

export const getAllUsers = async (): Promise<User[]> =>
  await UserModel.find({});

export const getUserById = async (id: User["_id"]): Promise<User | null> =>
  await UserModel.findById(id);

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

export const usersRepository = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
