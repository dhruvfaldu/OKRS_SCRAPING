import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getJobs as fetchJobsApi, createJob as createJobApi, deleteJob as deleteJobApi, retryJob as retryJobApi, getJobResults } from "../../api/jobApi";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const data = await fetchJobsApi();
  return data;
});

export const createJob = createAsyncThunk("jobs/createJob", async (jobData) => {
  const data = await createJobApi(jobData);
  return data;
});

export const retryJob = createAsyncThunk("jobs/retryJob", async (id, { rejectWithValue }) => {
  try {
    return await retryJobApi(id);
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to retry job"
    );
  }
});

export const fetchJobResults = createAsyncThunk("jobs/fetchJobResults", async (id, { rejectWithValue }) => {
  try {
    return await getJobResults(id);
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Failed to fetch job results"
    );
  }
}
);

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
  selectedJob: null,
  isResultsLoading: false,
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
      //mare je job create thai first ma avu joi
      state.items.unshift(action.payload);
      console.log("Created job:", action.payload);
    });
    builder.addCase(createJob.rejected, (state, action) => {
      state.error = action.error.message;
    });

    // retryJob
    // builder.addCase(retryJob.pending, (state) => {
    //   state.error = null;
    // })
    // builder.addCase(retryJob.fulfilled, (state, action) => {
    //   state.items.unshift(action.payload);
    // });
    // builder.addCase(retryJob.rejected, (state, action) => {
    //   state.error = action.error.message;
    // });
    builder.addCase(retryJob.pending, (state) => {
      state.error = null;
    })
      .addCase(retryJob.fulfilled, (state, action) => {
        const updatedJob = action.payload?.data;
        if (!updatedJob) return;
        const index = state.items.findIndex((job) => job.id === updatedJob.id);
        if (index !== -1) {
          state.items[index] = updatedJob;
        }
      })
      .addCase(retryJob.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

    // fetchJobResults
    builder.addCase(fetchJobResults.pending, (state) => {
      state.isResultsLoading = true;
      state.error = null;
      state.selectedJob = null;
    })
    builder.addCase(fetchJobResults.fulfilled, (state, action) => {
      state.selectedJob = action.payload?.data || null;
      console.log("Fetched job results:", state.selectedJob);
      state.isResultsLoading = false;
    })
    builder.addCase(fetchJobResults.rejected, (state, action) => {
      state.isResultsLoading = false;
      state.error = action.payload || action.error.message;
      state.selectedJob = null;
    })

    // deleteJob
    builder.addCase(deleteJob.pending, (state) => {
      state.error = null;
    })
    builder.addCase(deleteJob.fulfilled, (state, action) => {
      state.items = state.items.filter((job) => job.id !== action.payload);
      console.log(`Deleted job with id: ${action.payload}`);
    });
    builder.addCase(deleteJob.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export default jobSlice.reducer;
