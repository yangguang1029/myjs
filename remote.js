import React from 'react';
class MyRemoteComponent extends React.Component {
  static propTypes = {
    name: React.PropTypes.string
  };
  render() {
    return /*#__PURE__*/React.createElement("div", null, "Hello, World! ", this.props.name, " ");
  }
}
window.MyRemoteComponent = MyRemoteComponent;