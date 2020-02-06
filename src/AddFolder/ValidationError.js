import React, { Component } from 'react';

class ValidationError extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: true
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div className="error">{this.props.message}</div>;
    }
    return <></>
  }
}

export default ValidationError;
