import React, { Component } from 'react'
import authService from '../../services/AuthService'
import { withAuthConsumer } from '../../contexts/AuthStore.js';

class EditProfile extends Component {
  state = {
    user: {
      username: '',
      email: '',
      password: '',
      portfolio: '',
      avatarUrl: 'http://ecuciencia.utc.edu.ec/media/foto/default-user_x5fGYax.png',
      avatar: ''
    },
    errors: {},
    touch: {}
  }

  handleChange = (event) => {
    const { name, value, files } = event.target;
    this.setState({
      user: {
        ...this.state.user,
        [name]: files && files[0] ? files[0] : value
      },
      errors: {
        ...this.state.errors
      }
    })
  }

  handleBlur = (event) => {
    const { name } = event.target;
    this.setState({
      touch: {
        ...this.state.touch,
        [name]: true
      }
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isValid()) {
      authService.updateProfile(this.state.user)
        .then(
          (user) => this.setState({ user: {...this.state.user, ...user} }),
          (error) => {
            const { message, errors } = error.response.data;
            this.setState({
              errors: {
                ...this.state.errors,
                ...errors,
                email: !errors && message
              }
            })
          }
        )
    }
  }

  isValid = () => {
    return !Object.keys(this.state.user)
      .some(attr => this.state.errors[attr])
  }

  handleLogout = () => {
    authService.logout()
      .then(() => this.props.onUserChange(null))
  }

  componentDidMount() {
    authService.getProfile()
      .then(
          (user) => this.setState({ user: {...this.state.user, ...user} }),
          (error) => console.error(error)
        )
  }

  isValidPortfolio = (touch, errors) => touch.portfolio && errors.portfolio ? 'is-invalid' : ''

  render() {
    const { errors, user, touch } =  this.state;

    return (
      <div className="login">
      <div className="left-login"></div>
      <div className="right-login">

      <div className="box mx-auto">
        <div className="row">
          <i className="fa fa-sign-out btn-logout" onClick={this.handleLogout}></i>
          <div className="col-6">
            <h3> Edit your profile</h3>
            <form id="profile-form" className="mt-4" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" className="form-control" value={user.email} disabled/>
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" className="form-control" onChange={this.handleChange} onBlur={this.handleBlur} value={user.username}/>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" className={`form-control ${touch.password && errors.password ? 'is-invalid' : ''}`} onChange={this.handleChange} onBlur={this.handleBlur} value={user.password} />
                <div className="invalid-feedback">{ errors.password }</div>
              </div>
            </form>
          </div>
          <div className="col-6 pt-4">
            <label htmlFor="avatar" className="avatar"><img src={user.avatar ? URL.createObjectURL(user.avatar) : user.avatarUrl} className="rounded mb-3 edit-pic" alt="Cinque Terre" /></label>
            <input type="file" id="avatar"  name="avatar" onChange={this.handleChange} />
            <button className="btn btn-white" form="profile-form" type="submit" disabled={!this.isValid()}>Update profile</button>
          </div>
        </div>
      </div>
      </div>
      </div>
    );
  }
}

export default withAuthConsumer(EditProfile)