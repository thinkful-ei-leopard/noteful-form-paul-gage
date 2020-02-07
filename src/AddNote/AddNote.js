import React, { Component } from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import ValidationError from '../AddFolder/ValidationError';
import '../AddFolder/AddFolder.css';


export class AddNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: '',
      selectedFolder: '',
      folderId: 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1',
      titleTouched: false,
      contentTouched: false
    };
  }

  static contextType = ApiContext;

  updateName(title) {
    this.setState({
      title: title,
      titleTouched: true
    });
  }

  updateContent(content) {
    this.setState({
      content: content,
      contentTouched: true
    });
  }

  updateSelectedFolder(select) {
    const id = select[select.selectedIndex].id;
    const name = select[select.selectedIndex].value;
    console.log(id, name);
    this.setState({
      selectedFolder: name,
      folderId: id,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const date = new Date();
    const { title, content, folderId } = this.state;
 
    const data = {
      name: title,
      modified: date,
      content: content,
      folderId: folderId
    };

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => {
      if (!res.ok) {
        throw new Error('there was an error');
      }
      return res.json();
    })
    .then((data) => {
      this.context.addNote(data)
      this.props.history.push('/')
    })
    .catch(err => {
      console.log(err.message)
    });
  }

  validateTitle() {
    const title = this.state.title.trim();
    if (title.length === 0) {
      return 'please enter a title';
    } else if (title.length > 20) {
      return 'please keep title under 20 characters';
    }
  }

  validateContent() {
    const content = this.state.content;
    if (content.length === 0) {
      return 'please enter content';
    } else if (content.length > 200) {
      return 'please keep content under 200 characters';
    }
  }

  generateFolderOptions() {
    const { folders = [] } = this.context;
    return folders.map(folder => {
      return (
        <option key={folder.id} id={folder.id} value={folder.name}>
          {folder.name}
        </option>
      );
    });
  }

  render() {
    const titleError = this.validateTitle();
    const contentError = this.validateContent();
    return (
      <form className="add-note-form" onSubmit={e => this.handleSubmit(e)}>
        <h2>Add New Note</h2>
        <div className="form-group">
          <div>
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              className="registration__control"
              name="title"
              id="title"
              onChange={e => this.updateName(e.target.value)}
              required
            />
            {this.state.titleTouched && (
              <ValidationError message={titleError} />
            )}
          </div>
          <div>
            <label htmlFor="content">Content *</label>
            <input
              type="text"
              className="registration__control"
              name="content"
              id="content"
              onChange={e => this.updateContent(e.target.value)}
              required
            />
            {this.state.contentTouched && (
              <ValidationError message={contentError} />
            )}
          </div>
          <div>
            <label>Folder:</label>
            <select
              value={this.state.selectedFolder}
              onChange={e => this.updateSelectedFolder(e.target)}>
              {this.generateFolderOptions()}
            </select>
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={this.validateTitle()}
          >
            Save
          </button>
        </div>
      </form>
    );
  }
}

export default AddNote;
