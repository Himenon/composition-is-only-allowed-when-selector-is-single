import * as React from "react";
import * as ReactDOM from "react-dom";

const className = require("./index.scss");

const App = () => {
  return (
    <div>
      <h1 className={className.app}>Hello world</h1>
      <p className={className.description}>description</p>
      <p className={className.description2}>description2</p>
      <label className={className.label}>Label</label>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
