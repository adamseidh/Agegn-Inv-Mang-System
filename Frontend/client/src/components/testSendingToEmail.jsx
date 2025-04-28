import { useState } from "react";

export default function SendMailTest() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:test@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}%0A%0AFrom: ${encodeURIComponent(
      email
    )}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        required
      />
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        required
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Your Message"
        required
      />
      <button type="submit">Send via Email Client</button>
    </form>
  );
}
