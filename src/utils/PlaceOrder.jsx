// import emailjs from '@emailjs/browser'
// import React, { useState } from 'react';

// function PlaceOrder() {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [message, setmessage] = useState('');


//     function sendEmail = (e) => {
//         e.preventDefault();

//         const serviceId = 'service_o1olw8u';
//         const templateId = 'template_dz8b0i5';
//         const publicKey = 'jCkT0_4UDOFBoK2iy';

//         emailjs.sendForm(
//             import.meta.env.VITE_EMAIL_SERVICE_ID,
//             import.meta.env.VITE_EMAIL_TEMPLATE_ID,
//             e.target,
//             import.meta.env.VITE_EMAIL_USER_ID
//         )
//             .then((result) => {
//                 console.log("Email sent successfully!", result);
//             })
//             .catch((error) => {
//                 console.log("Error sending email:", error);
//                 console.log(error);
//             });
//     }

//     return (
//         <>
//             <form
//                 action=""
//                 onSubmit={sendEmail}
//                 className="flex flex-col gap-2 align-middle"
//             >
//                 <label className="flex flex-col">
//                     Name:
//                     <input type="text" name="user_name" className="border-3" />
//                 </label>

//                 <label className="flex flex-col">
//                     Email:
//                     <input type="email" name="user_email" className="border-3" />
//                 </label>

//                 <label className="flex flex-col">
//                     Message:
//                     <textarea
//                         name="message"
//                         cols={"20"}
//                         rows={"5"}
//                         className="border-3"
//                     ></textarea>
//                 </label>

//                 <button
//                     type="submit"
//                     className="rounded border-2 hover:bg-amber-700 hover:text-white"
//                 >
//                     Submit
//                 </button>
//             </form>
//         </>
//     );
// }

// export default PlaceOrder;


import emailjs from '@emailjs/browser'
import React from 'react';

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
        // console.log("Service ID:", import.meta.env.VITE_EMAIL_SERVICE_ID);
        // console.log("Template ID:", import.meta.env.VITE_EMAIL_TEMPLATE_ID);
        // console.log("Public Key:", import.meta.env.VITE_EMAIL_PUBLIC_KEY);

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

