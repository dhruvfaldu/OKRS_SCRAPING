import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "../../api/authApi";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const data = await registerUser(userData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const data = await loginUser(userData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

let storedUser = null;
try {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    storedUser = JSON.parse(userStr);
  }
} catch (e) {
  console.error("Failed to parse user from localStorage", e);
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("User logged out");
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        console.log("REGISTER SUCCESS:", action.payload);
        // Token handle (if API returns)
        const token = action.payload?.token || action.payload?.data?.token;
        if (token) {
          state.token = token;
          const userObj = action.payload?.user || action.payload?.data?.user || null;
          state.user = userObj;
          state.isAuthenticated = true;
          localStorage.setItem("token", token);
          if (userObj) {
            localStorage.setItem("user", JSON.stringify(userObj));
          }
        } else {
          state.error = "Token not received from API";
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        console.log("LOGIN SUCCESS:", action.payload);
        const token = action.payload?.token || action.payload?.data?.token;
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          const userObj = action.payload?.user || action.payload?.data?.user || null;
          state.user = userObj;
          localStorage.setItem("token", token);
          if (userObj) {
            localStorage.setItem("user", JSON.stringify(userObj));
          }
        } else {
          state.error = "Token not received from API";
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;