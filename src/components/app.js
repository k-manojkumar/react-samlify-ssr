import React, { Component } from "react";
import { connect } from "react-redux";

class App extends Component {
  render() {
    const { isAuth, data } = this.props;

    return (
      <>
        <p>Authentication status is {isAuth}</p>
        <p>{data.name}</p>
        <p>{data.id}</p>
      </>
    );
  }
}
function mapStateToProps({ isAuth, data }) {
  return {
    isAuth,
    data,
  };
}
export default connect(mapStateToProps)(App);
