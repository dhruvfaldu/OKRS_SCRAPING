import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getJobs as fetchJobsApi, createJob as createJobApi, deleteJob as deleteJobApi } from "../../api/jobApi";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const data = await fetchJobsApi();
  return data;
});

export const createJob = createAsyncThunk("jobs/createJob", async (jobData) => {
  const data = await createJobApi(jobData);
  return data;
});

export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id) => {
  const data = await deleteJobApi(id);
  // Returns the deleted job data from API, we return the id to remove it from state
  return id;
});

const initialState = {
  items: [],
  isLoading: false,
  isFetching: false, // Used for refresh state
  error: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchJobs
    builder.addCase(fetchJobs.pending, (state) => {
      if (state.items.length === 0) {
        state.isLoading = true;
      }
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      state.items = (action.payload.data || []).slice().reverse();
      state.isLoading = false;
      state.isFetching = false;
    });
    builder.addCase(fetchJobs.rejected, (state, action) => {
      state.isLoading = false;
      state.isFetching = false;
      state.error = action.error.message;
    });

    // createJob
    builder.addCase(createJob.pending, (state) => {
      state.error = null;
    })
    builder.addCase(createJob.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });
    builder.addCase(createJob.rejected, (state, action) => {
      state.error = action.error.message;
    });

    // deleteJob
    builder.addCase(deleteJob.pending, (state) => {
      state.error = null;
    })
    builder.addCase(deleteJob.fulfilled, (state, action) => {
      state.items = state.items.filter((job) => job.id !== action.payload);
    });
    builder.addCase(deleteJob.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export default jobSlice.reducer;
