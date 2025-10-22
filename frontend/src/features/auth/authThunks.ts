import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

//register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: { name: string; email: string; password: string; role?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/auth/register", {
        ...data,
        role: data.role || "user",
      });
      return res.data;
    } catch (error: any) {
      console.error("Register error:", error.response || error);
      return rejectWithValue(
        error.response?.data?.message || "Registration Failed"
      );
    }
  }
);

//verify otp
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", data, {
        headers: { "Content-Type": "application/json" },
      });

      return res.data;
    } catch (error: any) {
      console.error("OTP verification error:", error);
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

//loginUser
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (
//     data: { email: string; password: string; recaptchaToken?: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       return res.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Login Failed");
//     }
//   }
// );
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    data: { email: string; password: string; recaptchaToken?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      if (res.data.requiresOtp) {
        return {
          requiresOtp: true,
          email: data.email,
          message: res.data.message,
        };
      }

      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login Failed");
    }
  }
);

//google login via firebase
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (idToken: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("auth/google", { idToken });
      return res.data;
    } catch (error: any) {
      return (
        rejectWithValue(error.response?.data?.message) || "Google login Failed"
      );
    }
  }
);

//resendotp if it is expired
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/resend-otp", {
        email,
      });
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);

//logout user and clear cookie
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("auth/logout");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout Failed");
    }
  }
);

//forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (
    { email, captchaToken }: { email: string; captchaToken: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", {
        email,
        captchaToken,
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

//reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    data: { email: string; otp: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);
