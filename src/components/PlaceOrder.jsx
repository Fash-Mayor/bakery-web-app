import emailjs from '@emailjs/browser'

function PlaceOrder() {
  const sendEmail = (e) => {
    e.preventDefault();

    const serviceId = 'service_o1olw8u';
    const templateId = 'template_dz8b0i5';
    const publicKey = 'jCkT0_4UDOFBoK2iy';

    emailjs
      .sendForm(serviceId, templateId, e.target, publicKey)
      .then((result) => {
        console.log("✅ Email sent successfully!", result.text);

      })
      .catch((error) => {
        console.error("❌ Error sending email:", error);
      });
  };

  return (
    <form onSubmit={sendEmail} className="flex flex-col gap-2 align-middle">
      <label className="flex flex-col">
        Name:
        <input type="text" name="user_name" className="border-3" required />
      </label>

      <label className="flex flex-col">
        Email:
        <input type="email" name="user_email" className="border-3" required />
      </label>

      <label className="flex flex-col">
        Message:
        <textarea
          name="message"
          cols="20"
          rows="5"
          className="border-3"
          required
        ></textarea>
      </label>

      <button
        type="submit"
        className="rounded border-2 hover:bg-amber-700 hover:text-white"
      >
        Submit
      </button>
    </form>
  );
}

export default PlaceOrder;

