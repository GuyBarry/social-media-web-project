import { CreateUser, UpdateUser, User } from "../entities/dto/user.dto";
import { NotFoundException } from "../exceptions/notFoundException";
import { usersRepository } from "./users.repository";
import { hash } from "bcrypt";

export const PASSWORD_SALT_ROUNDS = 10;

export const getAllUsers = async (): Promise<User[]> =>
  await usersRepository.getAllUsers();

export const getUserById = async (id: User["_id"]): Promise<User> => {
  const user = await usersRepository.getUserById(id);

  if (!user) {
    throw new NotFoundException("User", { userId: id });
  }
  return user;
};

export const getUserByUsername = async (
  username: User["username"]
): Promise<User | null> => await usersRepository.getUserByUsername(username);

export const getUserByEmail = async (
  email: User["email"]
): Promise<User | null> => await usersRepository.getUserByEmail(email);

export const createUser = async (userData: CreateUser): Promise<User> => {
  userData.password = await hash(userData.password, PASSWORD_SALT_ROUNDS);
  return await usersRepository.createUser(userData);
};

export const updateUser = async (
  id: User["_id"],
  userData: UpdateUser
): Promise<User | null> => {
  const user = await usersRepository.updateUser(id, userData);

  if (!user) {
    throw new NotFoundException("User", { userId: id });
  }
  return user;
};

export const deleteUser = async (id: User["_id"]): Promise<void> => {
  const isDeleted = await usersRepository.deleteUser(id);

  if (!isDeleted) {
    throw new NotFoundException("User", { userId: id });
  }
};

export const doesUserExist = async (id: User["_id"]): Promise<boolean> =>
  await usersRepository.doesUserExist(id);

export const usersService = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  doesUserExist,
};
