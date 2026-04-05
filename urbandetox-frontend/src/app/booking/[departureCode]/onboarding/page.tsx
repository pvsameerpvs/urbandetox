export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getParticipantForOnboarding } from 'urbandetox-backend';
import { submitOnboardingAction } from '../../actions';

export default async function OnboardingPage({
  params,
  searchParams,
}: {
  params: Promise<{ departureCode: string }>;
  searchParams: Promise<{ participant?: string; submitted?: string }>;
}) {
  const { departureCode } = await params;
  const { participant, submitted } = await searchParams;
  const profile = participant ? getParticipantForOnboarding(participant) : null;

  if (!profile || profile.tripCode !== departureCode) {
    notFound();
  }

  return (
    <div className="page-shell grid gap-8 py-16 pb-24 lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="spotlight-card space-y-5">
        <p className="pill">4-step onboarding</p>
        <div>
          <h1 className="font-display text-4xl text-white">Finish your traveler profile.</h1>
          <p className="mt-3 text-sm leading-7 text-white/70">
            This form writes directly into the participant record already created during booking, so ops sees clean completion status and document presence in the admin view.
          </p>
        </div>
        <div className="grid gap-4 text-sm text-white/72">
          <div className="surface-card">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Trip</p>
            <p className="mt-2 text-white">{profile.packageName}</p>
          </div>
          <div className="surface-card">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Departure</p>
            <p className="mt-2 text-white">{profile.tripCode}</p>
          </div>
          <div className="surface-card">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Reporting</p>
            <p className="mt-2 text-white">{profile.meetingPoint} · {profile.reportingTime ?? 'TBA'}</p>
          </div>
        </div>
      </aside>

      <section className="surface-card space-y-6">
        {submitted === '1' ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">Onboarding submitted. Your participant record and document references were updated.</p> : null}
        <form action={submitOnboardingAction} className="grid gap-8">
          <input type="hidden" name="participantId" value={profile.id} />
          <input type="hidden" name="departureCode" value={profile.tripCode} />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/75">
              Full name
              <input name="fullName" defaultValue={profile.fullName} required />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Phone
              <input name="phone" defaultValue={profile.phone ?? ''} required />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Email
              <input name="email" type="email" defaultValue={profile.email ?? ''} />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Date of birth
              <input name="dateOfBirth" type="date" defaultValue={profile.dateOfBirth ?? ''} />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Gender
              <select name="gender" defaultValue={profile.gender ?? ''}>
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Nationality
              <input name="nationality" placeholder="Indian" />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              City
              <input name="city" placeholder="Bengaluru" />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Blood group
              <input name="bloodGroup" placeholder="O+" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/75">
              Travel mode
              <select name="travelCompanionMode" defaultValue="solo">
                <option value="solo">Solo</option>
                <option value="group">Group</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Food preferences
              <input name="foodPreferences" placeholder="Vegetarian / Non-vegetarian" />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Motion sickness
              <select name="motionSickness" defaultValue="No">
                <option value="No">No</option>
                <option value="Sometimes">Sometimes</option>
                <option value="Yes">Yes</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Swimming skill level
              <input name="swimmingSkillLevel" placeholder="Basic / None" />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Trekking comfort level
              <input name="trekkingComfortLevel" placeholder="Easy only / Moderate" />
            </label>
            <label className="grid gap-2 text-sm text-white/75 md:col-span-2">
              Companion names
              <textarea name="companionNamesText" rows={3} placeholder="Friend 1, Friend 2" />
            </label>
            <label className="grid gap-2 text-sm text-white/75 md:col-span-2">
              Medical conditions or allergies
              <textarea name="medicalConditionsOrAllergies" rows={3} placeholder="Anything the trip lead should know" />
            </label>
            <label className="grid gap-2 text-sm text-white/75 md:col-span-2">
              Accessibility notes
              <textarea name="accessibilityNotes" rows={3} placeholder="Fears, accessibility needs, or mobility notes" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/75">
              Emergency contact name
              <input name="emergencyContactName" required />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Emergency contact number
              <input name="emergencyContactNumber" required />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Alternate emergency number
              <input name="emergencyContactAlternateNumber" />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Relationship
              <input name="emergencyContactRelationship" placeholder="Brother / Mother / Friend" />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Arrival mode
              <input name="arrivalMode" placeholder="UrbanDetox coach" />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Payment note
              <input name="paymentCompletedAnswer" placeholder="Paid in full" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/75">
              Government ID upload
              <input name="governmentId" type="file" accept="image/*,.pdf" />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              Recent photo upload
              <input name="recentPhoto" type="file" accept="image/*" />
            </label>
          </div>

          <div className="grid gap-3 text-sm text-white/75">
            <label className="flex items-center gap-3"><input type="checkbox" name="medicalUpdateConsent" className="w-auto" />Share urgent medical updates with my emergency contact</label>
            <label className="flex items-center gap-3"><input type="checkbox" name="needsTravelAssistance" className="w-auto" />I need travel assistance or extra support</label>
            <label className="flex items-center gap-3"><input type="checkbox" name="waiverAccepted" className="w-auto" required />I confirm the details are correct</label>
            <label className="flex items-center gap-3"><input type="checkbox" name="termsAccepted" className="w-auto" required />I accept the trip terms and cancellation rules</label>
            <label className="flex items-center gap-3"><input type="checkbox" name="privacyAccepted" className="w-auto" required />I understand document handling and privacy access</label>
          </div>

          <button className="rounded-full bg-[var(--brand-sand)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white" type="submit">
            Submit onboarding
          </button>
        </form>
      </section>
    </div>
  );
}
