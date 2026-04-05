'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createBookingOrder,
  createWaitlistEntry,
  recordParticipantDocument,
  saveParticipantDocument,
  submitParticipantOnboarding,
} from 'urbandetox-backend';

function required(value: FormDataEntryValue | null, message: string) {
  if (!value || typeof value !== 'string' || !value.trim()) {
    throw new Error(message);
  }

  return value.trim();
}

export async function reserveDepartureAction(formData: FormData) {
  const departureCode = required(formData.get('departureCode'), 'Departure code missing.');
  const customerName = required(formData.get('customerName'), 'Name is required.');
  const phone = required(formData.get('phone'), 'Phone is required.');
  const emailValue = formData.get('email');
  const seatsRequested = Number(formData.get('seatsRequested') ?? 1);
  const companions = required(formData.get('companions'), 'Companion list can be empty, but the field must exist.');

  const booking = createBookingOrder({
    departureCode,
    customerName,
    phone,
    email: typeof emailValue === 'string' && emailValue ? emailValue : undefined,
    seatsRequested,
    companionNames: companions
      ? companions
          .split(',')
          .map((name) => name.trim())
          .filter(Boolean)
      : [],
  });

  revalidatePath('/trips');
  revalidatePath('/booking/' + departureCode);
  redirect('/booking/' + departureCode + '/success?order=' + booking.orderId);
}

export async function joinWaitlistAction(formData: FormData) {
  const departureId = required(formData.get('departureId'), 'Departure is required.');
  const departureCode = required(formData.get('departureCode'), 'Departure code is required.');

  createWaitlistEntry({
    departureId,
    name: required(formData.get('name'), 'Name is required.'),
    phone: required(formData.get('phone'), 'Phone is required.'),
    email: typeof formData.get('email') === 'string' ? (formData.get('email') as string) : undefined,
    seatsRequested: Number(formData.get('seatsRequested') ?? 1),
    note: typeof formData.get('note') === 'string' ? (formData.get('note') as string) : undefined,
  });

  revalidatePath('/booking/' + departureCode);
  redirect('/booking/' + departureCode + '?waitlist=joined');
}

export async function submitOnboardingAction(formData: FormData) {
  const participantId = required(formData.get('participantId'), 'Participant is required.');
  const departureCode = required(formData.get('departureCode'), 'Departure code is required.');

  submitParticipantOnboarding({
    participantId,
    fullName: required(formData.get('fullName'), 'Full name is required.'),
    phone: required(formData.get('phone'), 'Phone is required.'),
    email: typeof formData.get('email') === 'string' ? (formData.get('email') as string) : undefined,
    gender: typeof formData.get('gender') === 'string' ? (formData.get('gender') as string) : undefined,
    dateOfBirth: typeof formData.get('dateOfBirth') === 'string' ? (formData.get('dateOfBirth') as string) : undefined,
    nationality: typeof formData.get('nationality') === 'string' ? (formData.get('nationality') as string) : undefined,
    city: typeof formData.get('city') === 'string' ? (formData.get('city') as string) : undefined,
    bloodGroup: typeof formData.get('bloodGroup') === 'string' ? (formData.get('bloodGroup') as string) : undefined,
    travelCompanionMode: typeof formData.get('travelCompanionMode') === 'string' ? (formData.get('travelCompanionMode') as string) : undefined,
    companionNamesText: typeof formData.get('companionNamesText') === 'string' ? (formData.get('companionNamesText') as string) : undefined,
    foodPreferences: typeof formData.get('foodPreferences') === 'string' ? (formData.get('foodPreferences') as string) : undefined,
    medicalConditionsOrAllergies:
      typeof formData.get('medicalConditionsOrAllergies') === 'string'
        ? (formData.get('medicalConditionsOrAllergies') as string)
        : undefined,
    motionSickness: typeof formData.get('motionSickness') === 'string' ? (formData.get('motionSickness') as string) : undefined,
    swimmingSkillLevel: typeof formData.get('swimmingSkillLevel') === 'string' ? (formData.get('swimmingSkillLevel') as string) : undefined,
    trekkingComfortLevel: typeof formData.get('trekkingComfortLevel') === 'string' ? (formData.get('trekkingComfortLevel') as string) : undefined,
    accessibilityNotes: typeof formData.get('accessibilityNotes') === 'string' ? (formData.get('accessibilityNotes') as string) : undefined,
    emergencyContactName: typeof formData.get('emergencyContactName') === 'string' ? (formData.get('emergencyContactName') as string) : undefined,
    emergencyContactNumber: typeof formData.get('emergencyContactNumber') === 'string' ? (formData.get('emergencyContactNumber') as string) : undefined,
    emergencyContactAlternateNumber:
      typeof formData.get('emergencyContactAlternateNumber') === 'string'
        ? (formData.get('emergencyContactAlternateNumber') as string)
        : undefined,
    emergencyContactRelationship:
      typeof formData.get('emergencyContactRelationship') === 'string'
        ? (formData.get('emergencyContactRelationship') as string)
        : undefined,
    medicalUpdateConsent: formData.get('medicalUpdateConsent') === 'on',
    arrivalMode: typeof formData.get('arrivalMode') === 'string' ? (formData.get('arrivalMode') as string) : undefined,
    needsTravelAssistance: formData.get('needsTravelAssistance') === 'on',
    paymentCompletedAnswer:
      typeof formData.get('paymentCompletedAnswer') === 'string'
        ? (formData.get('paymentCompletedAnswer') as string)
        : undefined,
    waiverAccepted: formData.get('waiverAccepted') === 'on',
    termsAccepted: formData.get('termsAccepted') === 'on',
    privacyAccepted: formData.get('privacyAccepted') === 'on',
  });

  const governmentId = formData.get('governmentId');
  if (governmentId instanceof File && governmentId.size > 0) {
    const saved = await saveParticipantDocument(participantId, 'government_id', governmentId);
    recordParticipantDocument(participantId, 'government_id', saved.storagePath, saved.mimeType);
  }

  const recentPhoto = formData.get('recentPhoto');
  if (recentPhoto instanceof File && recentPhoto.size > 0) {
    const saved = await saveParticipantDocument(participantId, 'recent_photo', recentPhoto);
    recordParticipantDocument(participantId, 'recent_photo', saved.storagePath, saved.mimeType);
  }

  revalidatePath('/booking/' + departureCode + '/onboarding');
  redirect('/booking/' + departureCode + '/onboarding?participant=' + participantId + '&submitted=1');
}
