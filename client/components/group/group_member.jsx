import React from 'react';

export default class GroupMember extends React.Component {
  render() {
    return (
      <li>
        <span>Sydney Opera House</span>
        <span className="controls">
          <a><i className="fa fa-caret-up"></i></a>
          <a><i className="fa fa-caret-down"></i></a>
          <a><i className="fa fa-times text-danger"></i></a>
        </span>
      </li>
    );
  }
}

GroupMember.propTypes = { location: React.PropTypes.object };
