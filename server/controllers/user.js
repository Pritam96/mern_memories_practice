import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { OAuth2Client } from "google-auth-library";

const verifyClient = async (clientId, token) => {
  try {
    const client = new OAuth2Client(clientId);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    return ticket.getPayload();
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw new Error("Invalid Google token");
  }
};

export const signin = async (req, res) => {
  const { email, password, clientId, credential } = req.body;

  try {
    if (clientId && credential) {
      // Handle Google OAuth login
      const clientInfo = await verifyClient(clientId, credential);
      const existingUser = await User.findOne({ email: clientInfo.email });

      if (!existingUser) {
        // Register new user if not found
        const newUser = await User.create({
          name: clientInfo.name,
          email: clientInfo.email,
          password: "", // No password for Google OAuth users
        });

        const token = jwt.sign(
          { email: newUser.email, id: newUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          picture: clientInfo?.picture,
          token,
        });
      }

      // User exists, generate token
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        _id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        picture: clientInfo?.picture,
        token,
      });
    } else {
      // Handle custom email/password login
      const existingUser = await User.findOne({ email });

      if (!existingUser)
        return res.status(404).json({ message: "User doesn't exist." });

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordCorrect)
        return res.status(401).json({ message: "Invalid credentials." });

      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        email: existingUser.email,
        name: existingUser.name,
        _id: existingUser._id,
        token,
      });
    }
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      email: newUser.email,
      name: newUser.name,
      _id: newUser._id,
      token,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
