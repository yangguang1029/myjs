'use strict';

// import React from 'react';

// class MyRemoteComponent extends React.Component {

//   render() {
//     return <div>Hello, World! {this.props.name} </div>;
//   }
// }

function MyRemoteComponent(props) {
  return /*#__PURE__*/React.createElement("p", null, "hello ", props.name);
}
window.MyRemoteComponent = MyRemoteComponent;
//# sourceMappingURL=index.js.map
