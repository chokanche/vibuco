import Layout from "../../components/Layout";
import Link from 'next/link';
import NotLoggedIn from '../../components/auth/NotLoggedIn';
import { useAuthControls } from '../../auth';

const Login = () => {
  const { login } = useAuthControls();
  const onSubmit = () => {
    // This remains the functional rollback entry for the existing hosted UI.
    // Its configured callback owns the legacy post-login destination.
    login();
  };

  const showForm = () => (
    <div>
      <p>Continue to the secure sign-in service.</p>
      <button type="button" onClick={onSubmit} className="btn btn-primary">
        Log in
      </button>
    </div>
  )

  return (
    <NotLoggedIn>
      <Layout>
        <div className="container my-5">
          <div className="grid">
            <div style={{margin: '0 auto'}} className="grid-item col-md-6">
              
              {showForm()}

              <div className="mt-5">
                <Link href="/register"><a>Register</a></Link>
              </div>

            </div>
          </div>
        </div>
      </Layout>
    </NotLoggedIn>
  );
};

export default Login;
