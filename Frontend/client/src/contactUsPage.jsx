import React from "react";
import ShardBanner from "./components/shared/sharedBanner";
import ContactUs from "./components/contactUs";

export default function ContactUsPage() {
  return (
    <div className="font-sans">
      <ShardBanner title={"Contact Us"} />
      <ContactUs />
    </div>
  );
}
