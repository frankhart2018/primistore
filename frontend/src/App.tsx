// import { useState } from "react";
// import SinglePage from "./components/SinglePage/SinglePage";
// import { COLS, ROWS } from "./utils/constants";
// import { CHAR2CODE } from "./utils/charset";
// import { Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import passwordReducer from "./reducers/password-reducer";
import { Provider } from "react-redux";
import VERSION from "./utils/version";
import { RouterProvider } from "react-router-dom";
import router from "./configs/routes";

const store = configureStore({
  reducer: {
    password: passwordReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const App = () => {
  document.title = `PrimiStore v${VERSION}`;

  return (
    <div className="bg-white h-[100vh] w-[100vw]">
      <Provider store={store}>
        <RouterProvider router={router}/>
      </Provider>
    </div>
  );
};

export default App;
