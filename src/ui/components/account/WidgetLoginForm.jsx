import React from "react";
import { withRouter } from "react-router";

class WidgetLoginForm extends React.Component {
  render() {
    return (
      <form method="post" action="/widget/login" className="WidgetLoginForm">
        <ul className="WidgetLoginForm__fields">
          <li>
            <div>
              <label htmlFor="username" className="WidgetLoginForm__label">
                Username
              </label>
            </div>
            <div>
              <input
                type="text"
                placeholder="Username"
                name="username"
                className="WidgetLoginForm__input"
              />
            </div>
          </li>
          <li>
            <div>
              <label htmlFor="password" className="WidgetLoginForm__label">
                Password
              </label>
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="WidgetLoginForm__input"
              />
            </div>
          </li>
          <li>
            <input
              type="submit"
              value="Login"
              className="WidgetLoginForm__submit"
            />
          </li>
        </ul>
      </form>
    );
  }
}

export default withRouter(WidgetLoginForm);
