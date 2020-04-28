import React from "react";

class WaveLoader extends React.Component {
  constructor(props) {
    super();
  }

  componentDidMount() {}

  disappear() {}

  render() {
    return (
      <div className={"wave-wrapper " + this.props.className}>
        <div className="wave-container">
          <div className="wave-loader"></div>
        </div>
      </div>
    );
  }
}

export default WaveLoader;
