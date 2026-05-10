"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Mail, MapPin, Save } from "lucide-react";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-6">Profile</h1>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="border-border/60 bg-card">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-brand-muted text-brand text-lg">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">John Doe</p>
                    <p className="text-sm text-muted-foreground">john@example.com</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" defaultValue="1990-05-15" />
                  </div>
                </div>
                <Button className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={() => setSaved(true)}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
                {saved && <p className="text-sm text-brand">Changes saved.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="border-border/60 bg-card">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="food">Food Preference</Label>
                  <Input id="food" defaultValue="Vegetarian" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input id="allergies" defaultValue="None" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medical">Medical Conditions</Label>
                  <Input id="medical" defaultValue="None" />
                </div>
                <Button className="bg-brand text-brand-foreground hover:bg-brand/90">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="border-border/60 bg-card">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium mb-1">Government ID</p>
                  <p className="text-xs text-muted-foreground mb-3">Aadhaar / Passport / DL</p>
                  <Button variant="outline" size="sm">Upload</Button>
                </div>
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium mb-1">Recent Photo</p>
                  <p className="text-xs text-muted-foreground mb-3">Passport-size for records</p>
                  <Button variant="outline" size="sm">Upload</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card className="border-border/60 bg-card">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="eName">Contact Name</Label>
                    <Input id="eName" defaultValue="Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ePhone">Contact Phone</Label>
                    <Input id="ePhone" defaultValue="+91 98765 43211" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="eRelation">Relationship</Label>
                    <Input id="eRelation" defaultValue="Spouse" />
                  </div>
                </div>
                <Button className="bg-brand text-brand-foreground hover:bg-brand/90">Save Emergency Contact</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
