import emailjs from '@emailjs/browser'

function PlaceOrder() {
    function sendEmail(e) {
        e.preventDefault();

        emailjs.sendForm(
            import.meta.env.VITE_EMAIL_SERVICE_ID,
            import.meta.env.VITE_EMAIL_TEMPLATE_ID,
            e.target,
            import.meta.env.VITE_EMAIL_USER_ID
        )
            .then((result) => {
                console.log("Email sent successfully!", result);
            })
            .catch((error) => {
                console.log("Error sending email:", error);
            });
    }

    return (
        <>
            <form
                action=""
                onSubmit={sendEmail}
                className="flex flex-col gap-2 align-middle"
            >
                <label className="flex flex-col">
                    Name:
                    <input type="text" name="user_name" className="border-3" />
                </label>

                <label className="flex flex-col">
                    Email:
                    <input type="email" name="user_email" className="border-3" />
                </label>

                <label className="flex flex-col">
                    Message:
                    <textarea
                        name="message"
                        cols={"20"}
                        rows={"5"}
                        className="border-3"
                    ></textarea>
                </label>

                <button
                    type="submit"
                    className="rounded border-2 hover:bg-amber-700 hover:text-white"
                >
                    Submit
                </button>
            </form>
        </>
    );
}

export default PlaceOrder;
