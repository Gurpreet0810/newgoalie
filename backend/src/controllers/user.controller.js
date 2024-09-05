import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from 'bcrypt';
import generateAndSaveTokens from "../utils/refreshToken.js";
import { addTokenToBlacklist } from "../utils/blacklist.js";
import UserAddress from "../models/userAddress.model.js";
import mongoose from "mongoose";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const jwt = jsonwebtoken

const signInRouter = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body

  if (!userName || !email || !password) {
    return res.status(404)
      .json(new ApiError(404,
        [],
        "all fields are required"
      ))
  }

  const user = await User.findOne(
    {
      $or: [
        { email },
        {
          userName
        }
      ]
    }
  )

  if (user) {
    return res.status(409)
      .json(new ApiError(409,
        [],
        "this username or email is already exist"
      ))

  }

  const singUpUser = new User({
    userName,
    email,
    password
  })
  const newUser = await singUpUser.save()

  if (!newUser) {
    return res.status(500)
      .json(new ApiError(500,
        [],
        "something went wrong while creating user"
      ))

  }

  const existingUser = await User.findOne({ $and: [{ userName }, { email }] }).select('-password')
  const newToken = await generateAndSaveTokens({ _id: existingUser._id });

  if (existingUser) {
    res.status(201)
      .json(new ApiResponse(201,
        { existingUser, token: newToken.accessToken },
        "account create successfully"
      ))
  }


})


const loginUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(404).json(new ApiResponse(404, [], "All fields are required"));
  }

  // Query user
  const existingUser = await User.findOne({
    $or: [
      { userName },
      { email: userName }
    ]
  })

  if (!existingUser) {
    return res.status(404).json(new ApiResponse(404, [], "This user does not exist"));
  }

  if (!existingUser.password) {
    return res.status(401).json(new ApiResponse(401, [], "Password is not set. Please reset your password."));
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);
  console.log("Password match result:", isMatch); // Debugging

  if (!isMatch) {
    return res.status(401).json(new ApiResponse(401, [], "Incorrect password"));
  }

  // Fetch user addresses
  const [permanentAddress, billingAddress] = await Promise.all([
    UserAddress.findOne({ userId: existingUser._id, type: 'permanentAddress' }).lean(),
    UserAddress.findOne({ userId: existingUser._id, type: 'billingAddress' }).lean()
  ]);

  const newToken = await generateAndSaveTokens({ _id: existingUser._id });

  // Construct response
  const response = {
    statusCode: 200,
    data: {
      userDetails: existingUser,
      permanentAddress,
      billingAddress
    },
    token: newToken.accessToken,
    message: "Your addresses were successfully added",
    success: true
  };

  res.status(200).json(response);
});


const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiResponse(400, [], "Email is required"));
  }

  // Find the user by email to ensure it exists
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(404).json(new ApiResponse(404, [], "Invalid Email"));
  }

    // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

    // Save the reset token in the user's document in the database
  existingUser.resetPasswordToken = resetToken;
  existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await existingUser.save();

    // Create the password reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Configure the email transporter using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Send the password reset email
    const info = await transporter.sendMail({
      from: `"Gurpreet Singh" <${process.env.SMTP_USER}>`, // sender address
      to: existingUser.email, // send to the user's email
      subject: "Password Reset Request", // subject line
      text: `You requested a password reset. Please click the link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Please click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    });

    console.log("Message sent: %s", info.messageId);

    res.status(200).json(new ApiResponse(200, [], "Password reset email sent successfully"));
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).json(new ApiResponse(500, [], "Failed to send email"));
  }
});


const updatePassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json(new ApiResponse(400, [], "Token and new password are required"));
  }

  // Find the user by the reset token
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }, // Ensure the token hasn't expired
  });

  if (!user) {
    return res.status(400).json(new ApiResponse(400, [], "Invalid or expired token"));
  }

  // Hash the new password
  // const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user's password and clear the reset token fields
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  // Optionally, you can send a confirmation email that the password has been changed

  res.status(200).json(new ApiResponse(200, [], "Password updated successfully"));
});


const getUserdata = asyncHandler(async (req, res) => {
  try {
      const userId = req.query._id;
      const user = await User.findById(userId);
      if (user) {
          res.status(200).json({
              _id: user._id,
              userName: user.userName,
              email: user.email,
               phoneNumber: user.phoneNumber,
               photo: user.photo,
              // Include other fields you want to return
          });
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

const updateProfile = asyncHandler(async (req, res) => {
    try {
      const { _id } = req.decoded;
      // console.log("id is :", _id);
      // const userId = req.user._id;
      const { userName, email, phoneNumber, password } = req.body;
      const photo = req.image; 

      // Find the user by ID
      const user = await User.findById(_id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's profile
      user.userName = userName || user.userName;
      user.email = email || user.email;
      user.phoneNumber = phoneNumber || user.phoneNumber;

      // Only update the password if it's provided
      if (password) {
          user.password = password;
      }

      // If a photo is uploaded, handle the photo upload logic here
      if (photo) {
          user.photo = photo;
      }

      // Save the updated user to the database
      const updatedUser = await user.save();

      res.status(200).json({
          message: 'Profile updated successfully',
          user: {
              _id: updatedUser._id,
              userName: updatedUser.userName,
              email: updatedUser.email,
              phoneNumber: updatedUser.phoneNumber,
              photo: updatedUser.photo,
          }
      });
  } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


const logoutUser = asyncHandler(async (req, res) => {
  const { _id } = req.decoded;

  // Find the user by ID and update the refreshToken to null
  const existingUser = await User.findByIdAndUpdate(_id, { refreshToken: null });

  if (!existingUser) {
    return res.status(500).json(new ApiError(500, [], "Something went wrong while logging out"));
  }

  // Add the token to the blacklist
  addTokenToBlacklist(req.token);

  return res.status(200).json(new ApiResponse(200, [], "You have successfully logged out"));
});

const editSingleAddress = asyncHandler(async (req, res) => {
  const { _id } = req.decoded;
  const {
    userName,
    email,
    mobile,
    country,
    addressType,
    addressArea,
    landmark,
    pinCode,
    town_or_city,
    state
  } = req.body;

  // Check for required fields
  if (
    !userName ||
    !email ||
    !mobile ||
    !addressType ||
    !addressArea ||
    !landmark ||
    !pinCode ||
    !town_or_city ||
    !state ||
    !country
  ) {
    return res.status(400).json(
      new ApiError(400, [], "All fields are required")
    );
  }

  try {
    // Find and update the user by ID
    const isUserUpdate = await User.findByIdAndUpdate(
      _id,
      {
        userName,
        email,
        mobile,
        country,
        addressType,
        addressArea,
        landmark,
        pinCode,
        town_or_city,
        state,
      },
      { new: true }
    );

    if (!isUserUpdate) {
      return res.status(500).json(
        new ApiError(500, [], 'Something went wrong while updating address')
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { existingUser: isUserUpdate }, 'Your address was successfully updated')
    );

  } catch (error) {
    console.error('Error updating user address:', error);
    return res.status(500).json(
      new ApiError(500, [], 'Something went wrong while updating personal address')
    );
  }
});


const userAddress = asyncHandler(async (req, res) => {
  try {
    const { personal_address, billing_address } = req.body;
    const { _id } = req.decoded;

    if (!personal_address || !billing_address) {
      return res.status(400).json(
        new ApiResponse(400, [], "Both personal and billing addresses are required")
      );
    }

    const validateAddress = (address) => {
      return (
        address.country &&
        address.userName &&
        address.email &&
        address.mobile &&
        address.addressType &&
        address.addressArea &&
        address.landmark &&
        address.pinCode &&
        address.town_or_city &&
        address.state &&
        address.type
      );
    };

    if (!validateAddress(personal_address) || !validateAddress(billing_address)) {
      return res.status(400).json(
        new ApiError(400, [], "All fields are required")
      );
    }

    const isUserExist = await User.findById(_id)
    if (!isUserExist) {
      return res.status(404).json(
        new ApiResponse(404, [], "This user does not exist")
      );
    }

    try {
      const permanentAddress = new UserAddress({
        userId: isUserExist._id,
        country: personal_address.country,
        userName: personal_address.userName,
        email: personal_address.email,
        mobile: personal_address.mobile,
        addressType: personal_address.addressType,
        addressArea: personal_address.addressArea,
        landmark: personal_address.landmark,
        pinCode: personal_address.pinCode,
        town_or_city: personal_address.town_or_city,
        state: personal_address.state,
        type: personal_address.type
      });

      const billingAddressData = new UserAddress({
        userId: isUserExist._id,
        country: billing_address.country,
        userName: billing_address.userName,
        email: billing_address.email,
        mobile: billing_address.mobile,
        addressType: billing_address.addressType,
        addressArea: billing_address.addressArea,
        landmark: billing_address.landmark,
        pinCode: billing_address.pinCode,
        town_or_city: billing_address.town_or_city,
        state: billing_address.state,
        type: billing_address.type
      });

      const savedPermanentAddress = await permanentAddress.save();
      const savedBillingAddress = await billingAddressData.save();

      if (!savedPermanentAddress || !savedBillingAddress) {
        return res.status(500).json(
          new ApiError(500, [], "Something went wrong while saving customer address")
        );
      }

      const updatedUser = await User.findByIdAndUpdate(_id, {addressId:savedPermanentAddress._id }, {new: true}).lean();
  
      delete updatedUser.address;
      delete updatedUser.addressId;
      delete updatedUser.billingAddressId;
      delete updatedUser.personalAddressId;

      return res.status(200).json(
        new ApiResponse(200, {
          userDetails : updatedUser,
          permanentAddress: savedPermanentAddress,
          billingAddress: savedBillingAddress
        }, "Your addresses were successfully added")
      );
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiError(500, [], "Something went wrong while adding customer addresses")
    );
  }
});

const getUserAddress = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.decoded;

    const isUserExist = await User.findById(_id).lean();
    if (!isUserExist) {
      return res.status(404).json(
        new ApiResponse(404, [], "This user does not exist")
      );
    }


    const permanentAddress = await UserAddress.findOne({
      userId: _id,
      type: 'permanentAddress'
    }).lean();

    console.log('addd id get here', _id);


    const billingAddress = await UserAddress.findOne({
      userId: _id,
      type: 'billingAddress'
    }).lean();

    const userResponse = {
      ...isUserExist,
    };

    delete userResponse.address;
    delete userResponse.addressId;
    delete userResponse.billingAddressId;
    delete userResponse.personalAddressId;

    return res.status(200).json(
      new ApiResponse(200, {
        userDetails: userResponse,
        permanentAddress,
        billingAddress
      }, "User addresses retrieved successfully")
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiError(500, [], "Something went wrong while retrieving customer addresses")
    );
  }
});


const editUserAddress = asyncHandler(async (req, res) => {
  try {
    const { personal_address, billing_address } = req.body;
    const { _id } = req.decoded;
    console.log('reqnodu dor edit and update' , req.body);

    if (!personal_address || !billing_address) {
      return res.status(400).json(
        new ApiResponse(400, [], "Both personal and billing addresses are required")
      );
    }

    const validateAddress = (address) => {
      return (
        address.country &&
        address.userName &&
        address.email &&
        address.mobile &&
        address.addressType &&
        address.addressArea &&
        address.landmark &&
        address.pinCode &&
        address.town_or_city &&
        address.state &&
        address.type
      );
    };

    if (!validateAddress(personal_address) || !validateAddress(billing_address)) {
      return res.status(400).json(
        new ApiError(400, [], "All fields are required")
      );
    }

    const isUserExist = await User.findById(_id);
    if (!isUserExist) {
      return res.status(404).json(
        new ApiResponse(404, [], "This user does not exist")
      );
    }

    // Update personal address if exists
    let updatedPersonalAddress;
    if (isUserExist.personalAddressId) {
      updatedPersonalAddress = await UserAddress.findOneAndUpdate(
        { _id: isUserExist.personalAddressId },
        {
          country: personal_address.country,
          userName: personal_address.userName,
          email: personal_address.email,
          mobile: personal_address.mobile,
          addressType: personal_address.addressType,
          addressArea: personal_address.addressArea,
          landmark: personal_address.landmark,
          pinCode: personal_address.pinCode,
          town_or_city: personal_address.town_or_city,
          state: personal_address.state,
          type: personal_address.type
        },
        { new: true }
      );

      if (!updatedPersonalAddress) {
        return res.status(500).json(
          new ApiError(500, [], "Failed to update personal address")
        );
      }
    }

    // Update billing address if exists
    let updatedBillingAddress;
    if (isUserExist.billingAddressId) {
      updatedBillingAddress = await UserAddress.findOneAndUpdate(
        { _id: isUserExist.billingAddressId },
        {
          country: billing_address.country,
          userName: billing_address.userName,
          email: billing_address.email,
          mobile: billing_address.mobile,
          addressType: billing_address.addressType,
          addressArea: billing_address.addressArea,
          landmark: billing_address.landmark,
          pinCode: billing_address.pinCode,
          town_or_city: billing_address.town_or_city,
          state: billing_address.state,
          type: billing_address.type
        },
        { new: true }
      );

      if (!updatedBillingAddress) {
        return res.status(500).json(
          new ApiError(500, [], "Failed to update billing address")
        );
      }
    }

    const updatedUser = await User.findById(_id).lean();

    return res.status(200).json(
      new ApiResponse(200, {
        userDetails: updatedUser,
        permanentAddress: updatedPersonalAddress || personal_address,
        billingAddress: updatedBillingAddress || billing_address
      }, "Your addresses were successfully updated")
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiError(500, [], "Something went wrong while updating customer addresses")
    );
  }
});

const removeUserAddress = asyncHandler(async (req, res) => {
  const { customer_id } = req.query
  console.log('custome id', req.query);

  // Find the user by ID and update the refreshToken to null
  const isFindAddress = await UserAddress.findOneAndDelete({ _id: customer_id })

  if (!isFindAddress) {
    return res.status(500).json(new ApiError(500, [], "Something went wrong while remove address"));
  }

  return res.status(200).json(new ApiResponse(200, [], "Your Address Successfully Removed"));
});


export {
  signInRouter, loginUser, forgotPassword, updatePassword, getUserdata,
  updateProfile, logoutUser, userAddress, getUserAddress, editUserAddress,
  removeUserAddress, editSingleAddress
}
