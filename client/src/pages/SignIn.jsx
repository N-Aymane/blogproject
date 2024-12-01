import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.email || !formData.password) {
      dispatch(signInFailure('Please fill all the fields'));
      return;
    }

    try {
      dispatch(signInStart()); // Set loading state
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        dispatch(signInFailure(data.message || 'Sign-in failed'));
        return;
      }

      // Success: Update state and redirect
      dispatch(signInSuccess(data));
      navigate('/'); // Redirect to home page
    } catch (error) {
      // Handle unexpected errors
      dispatch(signInFailure(error.message || 'An unexpected error occurred'));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left Section */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
          <span className='px-2 py-1 bg-gradient-to-r from-blue-900  to-sky-700 rounded-lg text-white'>
        DevHaven
        </span>
        Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <Label value="Your email" htmlFor="email" />
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {/* Password Input */}
            <div>
              <Label value="Your password" htmlFor="password" />
              <TextInput
                id="password"
                type="password"
                placeholder="**********"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {/* Submit Button */}
            <Button
              gradientDuoTone="cyanToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            {/* <OAuth /> */}
          </form>
          {/* Sign-up Link */}
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {/* Error Alert */}
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
