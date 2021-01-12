import { createSlice } from "@reduxjs/toolkit";
import { put, call, takeEvery } from "redux-saga/effects";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Color from "color";
import Axios from "axios";

// reducer with initial state
const initialState = {
  data: undefined,
  responses: [],
  fetchinsg: false,
  error: null,
};

const data = createSlice({
  name: "data",
  initialState: initialState,
  reducers: {
    fetch(state) {
      state.loading = true;
      state.error = false;
    },
    fetchSuccess(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchFailure(state, action) {
      state.error = action.payload;
      //state.data = undefined;
      state.loading = false;
    },
  },
});

export const getData = (state) => {
  return state.data.data;
};
export const getDeviceData = (state) => {
  return state.data?.data?.deviceKind?.[0];
};

export const getDetailById = (state, id) => {
  return state.data?.data?.deviceKind?.[0].bewegung.find((e) => e.id == id);
};

export const getQuestionsArray = (state, filter) => {
  return Object.entries(state.data.questions).map((e) => {
    return { id: e[0], ...e[1] };
  });
};

export function* dataSaga() {
  yield takeEvery(data.actions.fetch, workerSaga);
}

function fetchSaga({ search }) {
  return Axios({
    method: "GET",
    url: `${
      window.balenaEnv?.DATA_URL
        ? window.balenaEnv.DATA_URL
        : process.env.REACT_APP_DATA_URL
    }`,
  });
}

function* workerSaga({ payload }) {
  try {
    const response = yield call(fetchSaga, { search: payload });
    yield put(data.actions.fetchSuccess(response.data));
  } catch (error) {
    yield put(data.actions.fetchFailure(error));
  }
}

export default data;

export function DataLoader(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(data.actions.fetch());
    const interval = setInterval(() => {
      dispatch(data.actions.fetch());
    }, 1000 * 60 * 0.5);
    return () => clearInterval(interval);
  }, []);

  const dataContent = useSelector(getData);
  const deviceData = useSelector(getDeviceData);

  useEffect(() => {
    if (deviceData?.json?.color) {
      document
        .getElementById("root")
        .style.setProperty("--interactive-01", deviceData.json.color);
      document
        .getElementById("root")
        .style.setProperty(
          "--text-01",
          deviceData.json?.textColor
            ? deviceData.json.textColor
            : "#fff" /*deviceData.color*/
        );
      document
        .getElementById("root")
        .style.setProperty(
          "--interactive-02",
          Color(deviceData.color).darken(0.1)
        );
    }
  }, [dataContent]);

  if (deviceData) return props.children;
  return null;
}
