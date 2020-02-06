import React, { Component } from 'react'

class ErrorBound extends Component {
  state = {
    error: null
  }
  static getDerivedStateFromError(error) {
    console.error(error)
    return error
  }
  render() {
    if (this.state.error) {
      return (
        <div className="error-page"> 
          <h1>Something seems to have gone wrong</h1> 
          <p>Try refreshing the page</p> 
        </div>
      )
    }
    return (
      this.props.children
    )
  }
}

export default ErrorBound
