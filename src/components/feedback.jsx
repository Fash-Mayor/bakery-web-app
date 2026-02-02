import { useState } from 'react';
import { sendFeedbackEmail } from '../utils/emailService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Feedback = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '', rating: '5' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.message.trim()) {
            toast.error('Please write your feedback.');
            return;
        }
        setLoading(true);
        try {
            await sendFeedbackEmail(form);
            toast.success('Thanks — feedback submitted!');
            setForm({ name: '', email: '', message: '', rating: '5' });
        } catch (err) {
            console.error(err);
            toast.error('Failed to submit feedback. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">Send Feedback</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name (optional)"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email (optional)"
                    type="email"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {/* <select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="w-36 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="5">⭐️⭐️⭐️⭐️⭐️</option>
                    <option value="4">⭐️⭐️⭐️⭐️</option>
                    <option value="3">⭐️⭐️⭐️</option>
                    <option value="2">⭐️⭐️</option>
                    <option value="1">⭐️</option>
                </select> */}
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your feedback..."
                    rows="5"
                    required
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-orange-500 text-white font-semibold px-6 py-2 rounded shadow hover:bg-orange-600 transition"
                    >
                        {loading ? 'Sending...' : 'Send Feedback'}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Feedback;