import React, {PropTypes} from 'react';

export default class Locations extends React.Component {
  constructor() {
    super();
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}
