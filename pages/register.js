import React from 'react'
import Layout from '../components/Layout';
import Link from 'next/link';

const Register = () => {
  const onSubmit = e => {
    e.preventDefault();
    console.log('submit!');
  }

  return (
    <Layout>
      <div className="container my-5">
        <div className="grid">
          <div style={{margin: '0 auto'}} className="grid-item col-md-6">
            <h2 className="mb-5">Register for Vibuco</h2>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label for="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                />
              </div>

              <div className="form-group">
                <label for="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </form>

            <div className="mt-5">
              <Link href="/login"><a>Login</a></Link>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Register
