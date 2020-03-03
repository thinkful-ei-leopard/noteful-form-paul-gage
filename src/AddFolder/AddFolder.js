import React, { Component } from 'react';
import ValidationError from './ValidationError';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddFolder.css';
// import PropTypes from 'prop-types';

class AddFolder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      folder_name: '',
      touched: false
    };
  }

  static contextType = ApiContext;

  handleSubmit(event) {
    event.preventDefault();
    const { folder_name } = this.state;
    const data = {
      folder_name
    };

    fetch(`${config.API_ENDPOINT}/api/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('there was an error');
        }
        return res.json();
      })
      .then(data => {
        this.context.addFolder(data);
        this.props.history.push('/');
      })
      .catch(err => {
        
      });
  }

  validateTitle() {
    const title = this.state.folder_name.trim();
    if (title.length === 0) {
      return 'please enter a title';
    } else if (title.length > 20) {
      return 'please keep title under 20 characters';
    }
  }

  updateName(folder_name) {
    this.setState({ folder_name: folder_name, touched: true });
  }

  render() {
    const titleError = this.validateTitle();

    return (
      <>
        <form className="add-folder-form" onSubmit={e => this.handleSubmit(e)}>
          <h2 className="addFolderHeader">Add New Folder</h2>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="add-folder-title"
              name="folder_name"
              id="title"
              value={this.state.folder_name}
              onChange={e => this.updateName(e.target.value)}
              required
            />
            {this.state.touched && <ValidationError message={titleError} />}
          </div>

          <div className="submit-button-group">
            <button type="reset" className="submit-button">
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={this.validateTitle()}>
              Save
            </button>
          </div>
        </form>
      </>
    );
  }
}

export default AddFolder;
