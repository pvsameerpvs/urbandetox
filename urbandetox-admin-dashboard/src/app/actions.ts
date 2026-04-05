'use server';

import { revalidatePath } from 'next/cache';
import {
  addManualParticipant,
  createBlogPost,
  createDeparture,
  createDestination,
  createFaq,
  createHomeBanner,
  createTripPackage,
  createTravelGuide,
  markParticipantCheckin,
  recordManualPayment,
  recordRefund,
} from 'urbandetox-backend';

function required(value: FormDataEntryValue | null, message: string) {
  if (!value || typeof value !== 'string' || !value.trim()) {
    throw new Error(message);
  }

  return value.trim();
}

export async function createBannerAction(formData: FormData) {
  createHomeBanner(
    required(formData.get('title'), 'Title is required.'),
    required(formData.get('subtitle'), 'Subtitle is required.'),
    required(formData.get('ctaLabel'), 'CTA label is required.'),
    required(formData.get('ctaLink'), 'CTA link is required.')
  );

  revalidatePath('/content/banners');
  revalidatePath('/');
}

export async function createDestinationAction(formData: FormData) {
  createDestination(
    required(formData.get('name'), 'Destination name is required.'),
    required(formData.get('region'), 'Region is required.'),
    required(formData.get('shortDescription'), 'Description is required.')
  );

  revalidatePath('/content/destinations');
  revalidatePath('/trips');
}

export async function createPackageAction(formData: FormData) {
  createTripPackage({
    destinationId: required(formData.get('destinationId'), 'Destination is required.'),
    defaultName: required(formData.get('defaultName'), 'Package name is required.'),
    durationDays: Number(formData.get('durationDays') ?? 2),
    category: required(formData.get('category'), 'Category is required.'),
  });

  revalidatePath('/content/packages');
  revalidatePath('/trips');
}

export async function createDepartureAction(formData: FormData) {
  createDeparture({
    packageId: required(formData.get('packageId'), 'Package is required.'),
    marketingTitle: required(formData.get('marketingTitle'), 'Marketing title is required.'),
    startDate: required(formData.get('startDate'), 'Start date is required.'),
    endDate: required(formData.get('endDate'), 'End date is required.'),
    price: Number(formData.get('price') ?? 0),
    groupSizeMax: Number(formData.get('groupSizeMax') ?? 12),
    visibilityStatus:
      typeof formData.get('visibilityStatus') === 'string'
        ? (formData.get('visibilityStatus') as string)
        : undefined,
    isFeatured: formData.get('isFeatured') === 'on',
  });

  revalidatePath('/trips/departures');
  revalidatePath('/trips');
}

export async function addManualParticipantAction(formData: FormData) {
  addManualParticipant({
    departureId: required(formData.get('departureId'), 'Departure is required.'),
    fullName: required(formData.get('fullName'), 'Participant name is required.'),
    phone: required(formData.get('phone'), 'Phone is required.'),
  });

  revalidatePath('/trips/participants');
}

export async function createBlogPostAction(formData: FormData) {
  createBlogPost({
    title: required(formData.get('title'), 'Title is required.'),
    excerpt: required(formData.get('excerpt'), 'Excerpt is required.'),
    content: required(formData.get('content'), 'Content is required.'),
    status:
      typeof formData.get('status') === 'string' ? (formData.get('status') as string) : undefined,
  });

  revalidatePath('/content/blog');
}

export async function createTravelGuideAction(formData: FormData) {
  createTravelGuide({
    destinationId:
      typeof formData.get('destinationId') === 'string' && formData.get('destinationId')
        ? (formData.get('destinationId') as string)
        : undefined,
    title: required(formData.get('title'), 'Title is required.'),
    excerpt: required(formData.get('excerpt'), 'Excerpt is required.'),
    content: required(formData.get('content'), 'Content is required.'),
    status:
      typeof formData.get('status') === 'string' ? (formData.get('status') as string) : undefined,
  });

  revalidatePath('/content/travel-guides');
}

export async function createFaqAction(formData: FormData) {
  createFaq({
    category: required(formData.get('category'), 'Category is required.'),
    question: required(formData.get('question'), 'Question is required.'),
    answer: required(formData.get('answer'), 'Answer is required.'),
  });

  revalidatePath('/content/faqs');
}

export async function recordCheckinAction(formData: FormData) {
  markParticipantCheckin({
    participantId: required(formData.get('participantId'), 'Participant is required.'),
    status: required(formData.get('status'), 'Status is required.'),
  });

  revalidatePath('/trips/checkin');
}

export async function recordPaymentAction(formData: FormData) {
  recordManualPayment({
    departureId: required(formData.get('departureId'), 'Departure is required.'),
    participantId:
      typeof formData.get('participantId') === 'string' && formData.get('participantId')
        ? (formData.get('participantId') as string)
        : undefined,
    amount: Number(formData.get('amount') ?? 0),
    source: typeof formData.get('source') === 'string' ? (formData.get('source') as string) : undefined,
    paymentType:
      typeof formData.get('paymentType') === 'string'
        ? (formData.get('paymentType') as string)
        : undefined,
    note: typeof formData.get('note') === 'string' ? (formData.get('note') as string) : undefined,
  });

  revalidatePath('/finance/payments');
  revalidatePath('/trips/participants');
}

export async function recordRefundAction(formData: FormData) {
  recordRefund({
    departureId: required(formData.get('departureId'), 'Departure is required.'),
    participantId:
      typeof formData.get('participantId') === 'string' && formData.get('participantId')
        ? (formData.get('participantId') as string)
        : undefined,
    amount: Number(formData.get('amount') ?? 0),
    note: typeof formData.get('note') === 'string' ? (formData.get('note') as string) : undefined,
  });

  revalidatePath('/finance/refunds');
  revalidatePath('/finance/payments');
  revalidatePath('/trips/participants');
}
