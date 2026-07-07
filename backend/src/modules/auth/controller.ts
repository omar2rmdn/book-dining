import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "./model";
import { loginValidation, registerValidation } from "./validation";
import { generateToken, verifyRefreshToken } from "../../utils/auth";
import { HttpError } from "../../utils/http-error";

async function login(req: Request, res: Response) {
  const { error, value } = loginValidation.validate(req.body);

  if (error) {
    throw new HttpError(400, error.details[0].message);
  }

  const { email, password } = value;

  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = generateToken({
    _id: user._id,
    email: user.email,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 24 * 60 * 60 * 1000,
  });

  const { password: _, ...safeUser } = user.toObject();

  return res.status(200).json({
    message: "Login successful",
    accessToken,
    user: safeUser,
  });
}

async function register(req: Request, res: Response) {
  const { error, value } = registerValidation.validate(req.body);

  if (error) {
    throw new HttpError(400, error.details[0].message);
  }

  const { fullName, email, password, phone, role } = value;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, "Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    fullName,
    email,
    password: hashedPassword,
    phone,
    role,
  });
  await user.save();

  const { accessToken, refreshToken } = generateToken({
    _id: user._id,
    email: user.email,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 24 * 60 * 60 * 1000,
  });

  const { password: _, ...safeUser } = user.toObject();

  return res.status(201).json({
    message: "Registration successful",
    accessToken,
    user: safeUser,
  });
}

async function logout(req: Request, res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logout successful" });
}

async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new HttpError(401, "Refresh token not found");
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new HttpError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken: newRefreshToken } = generateToken({
    _id: user._id,
    email: user.email,
    role: user.role,
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ accessToken });
}

async function profile(req: Request, res: Response) {
  const user = await User.findById(req.user?._id).select("-password");

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return res.status(200).json({ user });
}

export { login, register, logout, refresh, profile };
