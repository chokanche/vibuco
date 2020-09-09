import Layout from "../components/Layout";
import Link from 'next/link';
import { getServerSideAuth, useAuth } from './_auth';
import { useAuthFunctions } from 'aws-cognito-next';
import { useEffect } from "react";
import Router from "next/router";

const Login = ({ initialAuth }) => {
  const auth = useAuth(initialAuth);
  const { login } = useAuthFunctions();

  useEffect(() => {
    if (auth) {
      Router.replace('/');
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submit!");
  };

  const showForm = () => (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          className="form-control"
          id="email"
          aria-describedby="emailHelp"
          placeholder="Enter email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Log in
      </button>
    </form>
  )

  return (
    <Layout>
      <div className="container my-5">
        <div className="grid">
          <div style={{margin: '0 auto'}} className="grid-item col-md-6">
            
            {/* {showForm()} */}

            {auth ? <pre>{JSON.stringify(auth, null, true)}</pre> : null}

            {!auth ? <button onClick={login} className="btn btn-primary">Login</button> : null }

            <div className="mt-5">
              <Link href="/register"><a>Register</a></Link>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const initialAuth = getServerSideAuth(context.req);

  return { props: { initialAuth } };
};

export default Login;
