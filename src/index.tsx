import * as React from "react";
import * as ReactDOM from "react-dom";

const className = require("./index.scss");

const App = () => {
  return <h1 className={className.app}>Hello world</h1>
}

ReactDOM.render(<App />, document.getElementById("root"));
