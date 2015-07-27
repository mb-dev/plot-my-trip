import React, { PropTypes } from 'react';

class MousetrapMixin {
  constructor() {
    this.mousetrapBindings = [];
  }
  bindShortcut(key, callback) {
      Mousetrap.bind(key, callback);

      this.mousetrapBindings.push(key);
  }
  unbindShortcut(key) {
      var index = this.mousetrapBindings.indexOf(key);

      if (index > -1) {
          this.mousetrapBindings.splice(index, 1);
      }

      Mousetrap.unbind(binding);
  }
  unbindAllShortcuts() {
      if (this.mousetrapBindings.length < 1) {
          return;
      }

      this.mousetrapBindings.forEach(function (binding) {
          Mousetrap.unbind(binding);
      });
  }
}

class OptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
    this.mouseTrap = new MousetrapMixin();
  }
  onKeyUp(e) {
    this.setState({selectedIndex: this.state.selectedIndex - 1});
  }
  onKeyDown(e) {
    this.setState({selectedIndex: this.state.selectedIndex + 1});
  }
  componentDidMount() {
    this.mouseTrap.bindShortcut('up', this.onKeyUp);
    this.mouseTrap.bindShortcut('down', this.onKeyDown);
  }
  componentWillUnmount() {
    this.mouseTrap.unbindAllShortcuts();
  }
  render() {
    var options = [{id: 1, title: 'Option 1'}, {id: 2, title: 'Option 2'}];
    var selectedIndex = this.state.selectedIndex;
    var optionNodes = options.map(function(option, index) {
      var className = index == selectedIndex ? 'selected' : '';
      return (<li key={option.id} className={className}>{option.title}</li>);
    });
    return (
      <ul onClick={this.handleClick}>
        {optionNodes}
      </ul>
    );
  }
}

OptionList.defaultProps = {selectedIndex: 0};

export default OptionList;
