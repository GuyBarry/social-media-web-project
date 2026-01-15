import { CreateUser, UpdateUser, User } from "../entities/dto/user.dto";
import { usersRepository } from "./users.repository";

export const getAllUsers = async (): Promise<User[]> =>
  await usersRepository.getAllUsers();

export const getUserById = async (id: User["_id"]): Promise<User | null> =>
  await usersRepository.getUserById(id);

export const createUser = async (userData: CreateUser): Promise<User> =>
  await usersRepository.createUser(userData);

export const updateUser = async (
  id: User["_id"],
  userData: UpdateUser
): Promise<User | null> => await usersRepository.updateUser(id, userData);

export const deleteUser = async (id: User["_id"]): Promise<boolean> =>
  await usersRepository.deleteUser(id);

export const usersService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};