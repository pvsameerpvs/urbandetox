export function seedDemoBookings() {
  if (typeof window === "undefined") return;
  const key = "urbandetox-booking-KAS3-JUN20";
  if (localStorage.getItem(key)) return;

  const demo = {
    departureCode: "KAS3-JUN20",
    travelers: [
      {
        id: "t-1",
        type: "primary" as const,
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        email: "rahul@email.com",
        dateOfBirth: "1990-05-15",
        gender: "Male",
        foodPreference: "vegetarian",
        allergies: "None",
        medicalConditions: "None",
        bloodGroup: "O+",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        idUrl: "",
        idType: "Aadhaar",
        emergencyName: "Priya Sharma",
        emergencyPhone: "+91 98765 43211",
        emergencyRelation: "Spouse",
      },
      {
        id: "t-2",
        type: "companion" as const,
        name: "Priya Sharma",
        phone: "+91 98765 43211",
        email: "priya@email.com",
        dateOfBirth: "1992-08-22",
        gender: "Female",
        foodPreference: "vegetarian",
        allergies: "Peanuts",
        medicalConditions: "None",
        bloodGroup: "A+",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
        idUrl: "",
        idType: "Aadhaar",
        emergencyName: "Rahul Sharma",
        emergencyPhone: "+91 98765 43210",
        emergencyRelation: "Spouse",
      },
    ],
    common: {
      groupNote: "Celebrating our 5th anniversary. Would love a quiet lake-facing room if possible.",
      modeOfArrival: "Train (Jammu Tawi)",
      needsTravelHelp: true,
    },
    onboardingComplete: true,
    paymentStatus: "paid" as const,
    paymentMethod: "razorpay" as const,
  };
  localStorage.setItem(key, JSON.stringify(demo));

  const demo2 = {
    departureCode: "KOD5-APR18",
    travelers: [
      {
        id: "t-3",
        type: "primary" as const,
        name: "Arun Kumar",
        phone: "+91 99887 76655",
        email: "arun@email.com",
        dateOfBirth: "1985-03-10",
        gender: "Male",
        foodPreference: "non-vegetarian",
        allergies: "None",
        medicalConditions: "Mild asthma",
        bloodGroup: "B+",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
        idUrl: "",
        idType: "Passport",
        emergencyName: "Meera Kumar",
        emergencyPhone: "+91 99887 76656",
        emergencyRelation: "Sister",
      },
    ],
    common: {
      groupNote: "First solo trip. Excited!",
      modeOfArrival: "Flight (Madurai)",
      needsTravelHelp: false,
    },
    onboardingComplete: false,
    paymentStatus: "cod" as const,
    paymentMethod: "cod" as const,
  };
  localStorage.setItem("urbandetox-booking-KOD5-APR18", JSON.stringify(demo2));
}
