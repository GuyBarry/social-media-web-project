import { hash } from "bcrypt";
import {
  CreateGoogleUser,
  CreateUser,
  UpdateUser,
  User,
  UserPreview,
} from "../entities/dto/user.dto";
import { NotFoundException } from "../exceptions/notFoundException";
import { usersRepository } from "./users.repository";

export const PASSWORD_SALT_ROUNDS = 10;

export const getAllUsers = async (): Promise<UserPreview[]> =>
  await usersRepository.getAllUsers();

export const getUserById = async (id: User["_id"]): Promise<UserPreview> => {
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

export const createUser = async (
  userData: CreateUser | CreateGoogleUser
): Promise<UserPreview> => {
  if (isGoogleUserDTO(userData)) {
    return await usersRepository.createUser(userData);
  }

  userData.password = await hash(userData.password, PASSWORD_SALT_ROUNDS);
  return await usersRepository.createUser(userData);
};

export const isGoogleUserDTO = (
  user: CreateUser | CreateGoogleUser
): user is CreateGoogleUser => {
  return user.hasOwnProperty("googleId");
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
