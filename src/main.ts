import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createSlice, getDefaultMiddleware } from "@reduxjs/toolkit";
import { from } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";

const options = {
  name: `Redux rx`,
  maxAge: 36,
  instanceId: "redux rx",
  trace: false,
};
const composeEnhancers = composeWithDevTools(options);

let valueSlice = createSlice({
  name: "value",
  initialState: { num: 0 },
  reducers: {
    incremented: (state) => {
      state.num = state.num + 1;
    },
    decremented: (state) => {
      state.num = state.num - 1;
    },
  },
});

let store = createStore(
  combineReducers({ value: valueSlice.reducer }),
  composeEnhancers(
    applyMiddleware(
      ...getDefaultMiddleware({
        thunk: true,
        immutableCheck: false,
        serializableCheck: false,
      })
    )
  )
);

export const store$ = from(store as any);
store$
  .pipe(
    map((st: any) => st.value),
    distinctUntilChanged()
  )
  .subscribe((st: any) => console.log(st.num));

store.dispatch(valueSlice.actions.incremented());
store.dispatch(valueSlice.actions.incremented());
store.dispatch(valueSlice.actions.decremented());
