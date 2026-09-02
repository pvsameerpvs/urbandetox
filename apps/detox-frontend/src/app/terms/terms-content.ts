/**
 * Legal copy for /terms.
 *
 * This is the exact text submitted to Razorpay and reviewed by legal, mirrored
 * from the live page at https://www.urbandetox.in/terms. Treat it as a
 * controlled document: do not reword, trim, or "improve" any of it. If the
 * policy changes, update LAST_UPDATED in the same commit.
 */

export const LAST_UPDATED = "September 1, 2026";

export const COMPANY = {
  legalName: "UD GLOBAL PRIVATE LIMITED",
  registeredOffice:
    "648/A, 4th Floor, OM CHAMBERS, INDIRA NAGAR, Bengaluru, Bengaluru Urban, Karnataka, 560038",
  website: "https://www.urbandetox.in/",
  email: "hello@urbandetox.in",
  phone: "+919886639393",
} as const;

export const INTRO = [
  `This website, ${COMPANY.website}, is owned and operated by ${COMPANY.legalName}, having its registered office at ${COMPANY.registeredOffice}.`,
  "By accessing this website, browsing our trip details, making a booking, or using any service offered by Urban Detox, you agree to the following Terms & Conditions. If you do not agree with these terms, please do not use the website or book any trip through Urban Detox.",
] as const;

export interface TermsSectionData {
  id: string;
  title: string;
  body: string[];
  /** Rendered as a bulleted list after `body`. */
  list?: string[];
  /** Rendered after `list`. */
  bodyAfterList?: string[];
}

export const TERMS_SECTIONS: TermsSectionData[] = [
  {
    id: "use-of-website-and-services",
    title: "Use of Website and Services",
    body: [
      "Urban Detox provides curated travel experiences, offbeat trips, detox-style travel packages, group departures, and related travel services within India.",
      "You agree to provide true, accurate, and complete information while making an enquiry, booking a trip, or completing a payment. You are responsible for ensuring that all details shared by you, including name, contact number, email address, traveller details, and payment information, are correct.",
      "Urban Detox reserves the right to accept, reject, cancel, or modify bookings in case of incorrect information, non-payment, operational issues, safety concerns, weather conditions, force majeure events, or any other reason that may affect the trip experience.",
    ],
  },
  {
    id: "booking-and-payment",
    title: "Booking and Payment",
    body: [
      "Bookings are confirmed only after successful payment of the required advance amount or full trip amount, as communicated for the respective trip.",
      "Payments made through the website may be processed using third-party payment gateways such as PhonePe or other payment partners. By making a payment, you also agree to the applicable terms and policies of the payment gateway provider.",
      "Urban Detox does not store your card PIN, UPI PIN, net banking password, CVV, or any sensitive payment authentication details.",
    ],
  },
  {
    id: "trip-details-and-changes",
    title: "Trip Details and Changes",
    body: [
      "Trip itineraries, activities, stays, routes, timings, and inclusions are planned carefully. However, they may change due to weather, road conditions, local restrictions, safety reasons, availability, or operational needs.",
      "Urban Detox will try to provide the best possible alternative if any planned activity or route has to be changed.",
      "Travellers are expected to follow the instructions of the trip guide or coordinator during the trip. Urban Detox will not be responsible for issues caused by negligence, unsafe behaviour, violation of instructions, or personal actions of travellers.",
    ],
  },
  {
    id: "meals-and-food-arrangements",
    title: "Meals and Food Arrangements",
    body: [
      "For most Urban Detox trips, breakfast, lunch and dinner will be arranged at selected local restaurants or local food spots as per the itinerary. Dinner and other meals may vary depending on the trip plan, stay location, activity schedule, and package inclusions.",
      "Specific meal inclusions will be mentioned on the respective trip/package page. Any extra food orders, snacks, beverages, or personal food expenses not mentioned in the package inclusions will be paid by the traveller.",
    ],
  },
  {
    id: "traveller-responsibility",
    title: "Traveller Responsibility",
    body: [
      "By joining an Urban Detox trip, you agree to travel responsibly and respectfully with the group.",
      "You are responsible for your personal belongings, health condition, fitness suitability, medicines, valid ID proof, and any personal expenses not included in the trip package.",
      "Urban Detox reserves the right to remove a participant from a trip without refund if their behaviour affects the safety, comfort, or experience of other travellers.",
    ],
  },
  {
    id: "inclusions-and-exclusions",
    title: "Inclusions and Exclusions",
    body: [
      "Each trip page or itinerary will mention what is included and not included in the package.",
      "Unless specifically mentioned, personal expenses, shopping, extra food orders, alcohol, personal insurance, medical expenses, and optional paid activities are not included.",
    ],
  },
  {
    id: "cancellation-and-refund-policy",
    title: "Cancellation and Refund Policy",
    body: [
      "At Urban Detox, every trip involves advance planning and confirmed arrangements with our travel partners. Our cancellation policy is designed to ensure clarity for every guest while allowing us to manage these commitments responsibly.",
      "Cancellations made on or before Monday of the week of departure are eligible for a 100% refund of the amount paid.",
      "Cancellations made on Tuesday of the week of departure are eligible for a 40% refund of the amount paid.",
      "Cancellations made from Wednesday onwards, including cancellations on the day of departure, are non-refundable.",
    ],
    list: [
      "The cancellation timeline is based on the departure date of the respective trip. For example, for trips departing on Thursday night: Monday or earlier is a 100% refund, Tuesday is a 40% refund, and Wednesday onwards is no refund.",
      "Refunds, where applicable, are processed to the original payment method. Processing time may vary depending on the payment gateway and banking partner.",
      "Payment gateway charges, transaction fees, and non-refundable vendor costs may be deducted where applicable.",
      "By confirming a booking with Urban Detox, the guest acknowledges and agrees to the cancellation and refund policy.",
    ],
    bodyAfterList: [
      "Urban Detox may cancel or postpone a trip due to low participation, unsafe weather, local restrictions, transport issues, or other operational reasons. In such cases, travellers may be offered an alternative date, credit adjustment, or refund based on the situation.",
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    body: [
      `This Privacy Policy explains how ${COMPANY.legalName}, operating through ${COMPANY.website}, collects, uses, stores, shares, and protects your personal information.`,
      "By using our website, submitting your details, making an enquiry, or booking a trip, you consent to the collection and use of your information as described in this policy.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: [
      "We may collect personal information such as your name, phone number, email address, age, gender, city, traveller details, ID proof details where required, emergency contact details, payment status, booking history, and any information you voluntarily share with us through forms, WhatsApp, calls, emails, or the website.",
      "We may also collect technical information such as browser type, device information, IP address, pages visited, and interaction data to improve website performance, marketing, and user experience.",
    ],
  },
  {
    id: "how-we-use-your-information",
    title: "How We Use Your Information",
    body: ["We use your information to:"],
    list: [
      "Process enquiries and bookings",
      "Share trip details, itineraries, payment links, and updates",
      "Confirm traveller details and manage trip operations",
      "Coordinate pickup, stay, food, activities, and safety arrangements",
      "Provide customer support",
      "Improve our website, services, and marketing",
      "Send relevant trip updates, offers, and announcements",
      "Comply with legal, regulatory, or security requirements",
    ],
    bodyAfterList: [
      "You may choose not to provide certain information, but this may limit your ability to use some services or complete a booking.",
    ],
  },
  {
    id: "sharing-of-information",
    title: "Sharing of Information",
    body: [
      "We may share necessary information with trusted third parties such as payment gateway providers, transport partners, stay partners, activity vendors, trip coordinators, customer support tools, marketing tools, or legal authorities where required.",
      "We do not sell your personal information to third parties.",
      "Third-party service providers, including payment gateways, may collect and process your data according to their own privacy policies. We recommend reviewing their policies before using their services.",
    ],
  },
  {
    id: "payment-security",
    title: "Payment Security",
    body: [
      "Payments made through our website are processed by secure third-party payment gateways. Urban Detox does not ask for or store your UPI PIN, card PIN, CVV, net banking password, or OTP.",
      "If anyone claims to represent Urban Detox and asks for such sensitive information, do not share it. Please report it to us immediately.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    body: [
      "We follow reasonable security practices to protect your personal information from unauthorised access, misuse, loss, or disclosure.",
      "However, no internet-based service can be guaranteed to be completely secure. By using the website, you understand and accept the risks associated with online data transmission.",
    ],
  },
  {
    id: "data-retention-and-deletion",
    title: "Data Retention and Deletion",
    body: [
      "We retain your personal information only as long as required for booking, customer support, legal compliance, accounting, fraud prevention, and legitimate business purposes.",
      "You may request correction or deletion of your personal data by contacting us. We may delay or refuse deletion where data is required for legal, accounting, dispute resolution, refund, or fraud prevention purposes.",
    ],
  },
  {
    id: "your-rights-and-consent",
    title: "Your Rights and Consent",
    body: [
      "You may contact us to access, correct, update, or request deletion of your personal information.",
      "By using the website or sharing your information with Urban Detox, you consent to being contacted through phone, WhatsApp, SMS, email, or other communication channels for trip-related updates, bookings, support, and relevant offers.",
      "You may withdraw consent for marketing communication by contacting us. However, we may still contact you for active bookings, payments, legal requirements, or essential service communication.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    body: [
      "All website content, design, layout, text, graphics, images, videos, branding, logos, and other materials are owned by or licensed to Urban Detox.",
      "You may not copy, reproduce, modify, distribute, or use our content without written permission.",
    ],
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    body: [
      "Our website may contain links to third-party websites, payment gateways, social media platforms, or external services. We are not responsible for the content, privacy practices, or terms of these third-party websites.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    body: [
      "Urban Detox will make reasonable efforts to provide safe, enjoyable, and well-managed travel experiences. However, travel involves inherent risks such as weather changes, road conditions, delays, personal injury, illness, loss of belongings, or changes in local conditions.",
      "Urban Detox shall not be liable for losses, damages, delays, injuries, or expenses caused by circumstances beyond our reasonable control or by the traveller’s own actions.",
    ],
  },
  {
    id: "force-majeure",
    title: "Force Majeure",
    body: [
      "Urban Detox shall not be liable for failure or delay in performing services due to events beyond reasonable control, including but not limited to natural disasters, heavy rain, landslides, strikes, government restrictions, road closures, accidents, pandemics, transport failure, or other force majeure events.",
    ],
  },
  {
    id: "governing-law-and-jurisdiction",
    title: "Governing Law and Jurisdiction",
    body: [
      "These Terms & Conditions shall be governed by the laws of India.",
      "Any disputes arising from the use of this website or Urban Detox services shall be subject to the jurisdiction of courts in Bengaluru, Karnataka, India.",
    ],
  },
  {
    id: "service-delivery-policy",
    title: "Service Delivery Policy",
    body: [
      "Urban Detox provides travel experiences and trip packages. Once a booking is confirmed, the traveller will receive trip details, itinerary information, payment confirmation, and joining instructions through WhatsApp, email, phone call, or the website.",
      "The actual service is delivered on the scheduled trip dates mentioned on the respective package or departure page. Pickup point, timings, inclusions, and other trip-related instructions will be shared before the trip.",
      "No physical product is shipped. Therefore, shipping charges and physical delivery timelines are not applicable.",
    ],
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to This Policy",
    body: [
      "Urban Detox may update these Terms & Conditions, Privacy Policy, and Refund Policy from time to time. Updated versions will be posted on this page. Continued use of the website after updates means you accept the revised terms.",
    ],
  },
];

export const CONTACT_INTRO =
  "For bookings, support, privacy requests, refund queries, or any concerns related to these terms, please contact:";
