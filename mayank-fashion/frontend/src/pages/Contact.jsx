import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const submit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We will get back soon.');
    e.target.reset();
  };

  return (
    <div className="container-x py-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="heading-display text-4xl font-bold">Get in Touch</h1>
        <p className="text-gray-500 mt-3">We'd love to hear from you. Send us a message.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {[
          { i: <Mail />, t: 'Email Us', v: 'hello@mayankfashion.com' },
          { i: <Phone />, t: 'Call Us', v: '+91 98765 43210' },
          { i: <MapPin />, t: 'Visit', v: '123 Fashion St, Mumbai, India' },
        ].map((c) => (
          <div key={c.t} className="card p-6 text-center">
            <div className="inline-flex bg-brand-50 dark:bg-ink-700 text-brand-600 p-3 rounded-2xl mb-3">{c.i}</div>
            <div className="font-semibold">{c.t}</div>
            <div className="text-sm text-gray-500 mt-1">{c.v}</div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="card p-8 mt-6 max-w-2xl mx-auto">
        <h3 className="font-semibold text-lg mb-5">Send a Message</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Your Name" required />
          <input className="input" type="email" placeholder="Email" required />
          <input className="input sm:col-span-2" placeholder="Subject" />
          <textarea className="input sm:col-span-2" rows="5" placeholder="Message..." required />
        </div>
        <button className="btn-primary mt-5">
          <Send size={16} /> Send Message
        </button>
      </form>
    </div>
  );
}
