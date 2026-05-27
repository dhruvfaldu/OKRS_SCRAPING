import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser, logoutUser } from "../../services/sacrperAuth";

export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
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

export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
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

//logout
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const data = await logoutUser();
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Logout failed"
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
    user: storedUser || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
  },

  reducers: {
    // logout: (state) => {
    //   state.user = null;
    //   state.token = null;
    //   state.isAuthenticated = false;
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("user");
    //   console.log("User logged out");
    // },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // Register
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
          state.user = action.payload?.user || action.payload?.data?.user || null;
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

      // Login
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
          state.user = action.payload?.user || action.payload?.data?.user || null;
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

    // Logout
    // builder.addCase(logout.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(logout.fulfilled, (state) => {
    //   state.loading = false;
    //   state.user = null;
    //   state.token = null;
    //   state.isAuthenticated = false;
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("user");
    //   console.log("User logged out successfully");
    // })
    // .addCase(logout.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // });

    builder.addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        // localStorage.removeItem("user");
        console.log("User logged out successfully");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Also clear local state on logout error so user is not stuck
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;