import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <div className="heading-display text-7xl font-bold text-brand-600">404</div>
      <p className="text-gray-500 mt-3">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary inline-flex mt-6">Back to Home</Link>
    </div>
  );
}
