import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Input from '../components/Input';

function Login() {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(['auth']);

  const onLoginClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const password = form.elements.namedItem('password') as HTMLInputElement;

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: email.value,
        password: password.value,
      });

      if (response.status === 200) {
        setCookie('auth', response.data.token, { path: '/' });
        form.reset();
        navigate('/');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-6 py-48 mx-auto md-h-screen lg-py-0">
        <h2 className="flex items-center mb-6 text-2xl font-semibold">Login</h2>
        <div className="w-full bg-white rounded-lg shadow md:mt sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Log in to your account
            </h1>
            <form onSubmit={onLoginClicked} className="space-y-3 md:space-y-5">
              <Input
                inputText=""
                type="email"
                minLength={5}
                maxLength={50}
                required={true}
                name="email"
                label="Email"
                id="email"
              />
              <Input
                inputText=""
                type="password"
                minLength={6}
                maxLength={20}
                required={true}
                name="password"
                label="Password"
                id="password"
              />
              <button
                type="submit"
                className="w-full text-white bg-greenish hover:bg-greenish-hold focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Login
              </button>
            </form>
            <p className="text-sm font-light text-gray-700">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="font-medium text-greenish hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;