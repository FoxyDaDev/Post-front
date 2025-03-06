import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Input from '../components/Input';

function Signup() {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(['auth']);

  const onSignUpClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (!name || !username || !email || !password) return;

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setCookie('auth', data.token, { path: '/' });
        form.reset();
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to sign up');
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-6 py-48 mx-auto md-h-screen lg-py-0">
        <h2 className="flex items-center mb-6 text-2xl font-semibold">Sign Up</h2>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create your account
            </h1>
            <form onSubmit={onSignUpClicked} className="space-y-3 md:space-y-5">
              <Input
                inputText=""
                type="text"
                minLength={3}
                maxLength={20}
                required={true}
                name="name"
                id="name"
                label="Name"
              />
              <Input
                inputText=""
                type="text"
                minLength={3}
                maxLength={20}
                required={true}
                name="username"
                id="username"
                label="Username"
              />
              <Input
                inputText=""
                type="email"
                minLength={5}
                maxLength={50}
                required={true}
                name="email"
                id="email"
                label="Email"
              />
              <Input
                inputText=""
                type="password"
                minLength={6}
                maxLength={20}
                required={true}
                name="password"
                id="password"
                label="Password"
              />
              <button
                type="submit"
                className="w-full text-white bg-greenish hover:bg-greenish-hold focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign Up
              </button>
            </form>
            <p className="text-sm font-light text-gray-700">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium text-greenish hover:underline"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;