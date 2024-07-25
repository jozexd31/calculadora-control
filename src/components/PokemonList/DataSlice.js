import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../../services/dataService";
import { ACTIONS } from "../../utils/actionHelpers";

export const fetchPokemonList = createAsyncThunk(
  "fetch/pokemonList",
  async () => {
    const jsonData = await fetchData();
    const data = jsonData.results;
    return data;
  }
);

const extraReducers = (builder) => {
  builder.addCase(fetchPokemonList.fulfilled, ACTIONS.SET_DATA);
};

const initialState = {
  data: [],
  error: null,
  status: "idle",
};

const slice = createSlice({
  name: "data",
  initialState: initialState,
  reducers: ACTIONS,
  extraReducers: extraReducers,
});

export const { ADD_DATA, REMOVE_DATA, SET_DATA, SET_DATA_ERROR, DEFAULT_DATA } =
  slice.actions;
export default slice.reducer;
