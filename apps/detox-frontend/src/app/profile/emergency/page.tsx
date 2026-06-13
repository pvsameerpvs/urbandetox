"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import { IconInput } from "../components/IconInput";
import { SaveButton } from "../components/SaveButton";
import { useUserProfile } from "@/lib/user-profile";
import { emergencyContactItemSchema } from "@/lib/profile-schema";
import { PhoneCall, User, Heart, AlertCircle, Phone, Mail, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, Button, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@urbandetox/ui"

const relationOptions = [
  { value: "spouse", label: "Spouse / Partner" },
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
  { value: "friend", label: "Friend" },
  { value: "colleague", label: "Colleague" },
  { value: "other", label: "Other" },
];

export default function EmergencyContactPage() {
  const { profile, updateEmergencyContact, addEmergencyContact, removeEmergencyContact } = useUserProfile();
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const savingRef = useRef(false);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const contacts = profile.emergencyContacts;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (savingRef.current) return;

    const fieldErrors: Record<string, string> = {};
    contacts.forEach((contact, i) => {
      const result = emergencyContactItemSchema.safeParse(contact);
      if (!result.success) {
          result.error.issues.forEach((issue) => {
          const key = `${i}.${String(issue.path[0])}`;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        });
      }
    });

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => setErrors({}), 5000);
      return;
    }

    savingRef.current = true;
    setErrors({});
    setSaved(true);
    setTimeout(() => { setSaved(false); savingRef.current = false; }, 3000);
  };

  const errorClass = (key: string) => errors[key] ? "ring-2 ring-red-400" : "";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6 sm:p-8">
          <ProfileSectionHeader
            icon={PhoneCall}
            title="Emergency Contacts"
            description="Who we contact in case of an emergency. Saved here and auto-filled during trip onboarding."
          />

          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 mb-6">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              These contacts will be automatically added to every trip onboarding form. You can add, edit, or remove them at any time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {contacts.map((contact, index) => (
              <div key={index} className="space-y-4 rounded-2xl bg-secondary/20 p-4 sm:p-5 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold">Emergency Contact {index + 1}</h4>
                    {index === 0 && (
                      <Badge className="bg-brand/10 text-brand border-0 text-[10px] font-medium">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Primary
                      </Badge>
                    )}
                  </div>
                  {contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmergencyContact(index)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <IconInput
                      label="Full Name"
                      icon={User}
                      id={`eName-${index}`}
                      value={contact.name}
                      onChange={(v) => updateEmergencyContact(index, { name: v })}
                      placeholder="Contact name"
                      className={errorClass(`${index}.name`)}
                    />
                    {errors[`${index}.name`] && <p className="text-red-500 text-xs mt-1">{errors[`${index}.name`]}</p>}
                  </div>
                  <div>
                    <IconInput
                      label="Phone Number"
                      icon={Phone}
                      id={`ePhone-${index}`}
                      value={contact.phone}
                      onChange={(v) => updateEmergencyContact(index, { phone: v })}
                      placeholder="+91 98765 43210"
                      className={errorClass(`${index}.phone`)}
                    />
                    {errors[`${index}.phone`] && <p className="text-red-500 text-xs mt-1">{errors[`${index}.phone`]}</p>}
                  </div>
                  <IconInput
                    label="Email"
                    icon={Mail}
                    id={`eEmail-${index}`}
                    type="email"
                    value={contact.email}
                    onChange={(v) => updateEmergencyContact(index, { email: v })}
                    placeholder="contact@example.com"
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Relationship</label>
                    <div className="relative">
                      <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                      <Select
                        value={contact.relation}
                        onValueChange={(v) => updateEmergencyContact(index, { relation: v ?? "" })}
                      >
                        <SelectTrigger className={`h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20 ${errorClass(`${index}.relation`)}`}>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationOptions.map((r) => (
                            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors[`${index}.relation`] && <p className="text-red-500 text-xs mt-1">{errors[`${index}.relation`]}</p>}
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addEmergencyContact}
              className="w-full rounded-xl border-border/60 h-11 text-sm font-medium"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Another Emergency Contact
            </Button>

            <hr className="border-border/40" />
            <SaveButton label="Save Emergency Contacts" saved={saved} savedMessage="Emergency contacts saved. Onboarding will auto-fill." errors={errors} />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
