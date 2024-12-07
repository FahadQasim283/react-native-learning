import React from "react";
import {CounterProvider } from "./lib/counter/countercontext";
import Counter from "./lib/counter/counter";

const App = () => {
  return (
    <CounterProvider>
        <Counter />
    </CounterProvider>
  );
};
export default App;
