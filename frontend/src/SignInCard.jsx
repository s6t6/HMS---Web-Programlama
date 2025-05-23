import React, { useState } from "react";
import "./SignInCard.css"; // Import the CSS

export default function SignInCard() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signin-wrapper">
      <div className="signin-card">
        <h2 className="signin-title">Sign In</h2>
        <form className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
