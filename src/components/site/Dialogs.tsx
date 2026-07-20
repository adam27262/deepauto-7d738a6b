import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const bookingSchema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  customer_email: z.string().trim().email().max(200),
  customer_phone: z.string().trim().min(7).max(30),
  service: z.string().min(1),
  vehicle: z.string().trim().max(120).optional(),
  booking_date: z.string().min(1),
  booking_time: z.string().min(1),
  notes: z.string().trim().max(1000).optional(),
});

export function BookingDialog({
  trigger,
  defaultService,
}: {
  trigger: React.ReactNode;
  defaultService?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("bookings").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("Couldn't save booking. Try again.");
      return;
    }
    toast.success("Booking received! We'll confirm shortly.");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Book Your Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="customer_name">Full Name</Label>
            <Input id="customer_name" name="customer_name" required maxLength={80} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="customer_email">Email</Label>
              <Input id="customer_email" name="customer_email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer_phone">Phone</Label>
              <Input id="customer_phone" name="customer_phone" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service">Service</Label>
            <select
              id="service"
              name="service"
              defaultValue={defaultService ?? "Interior Detailing"}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              required
            >
              <option>Interior Detailing</option>
              <option>Exterior Detailing</option>
              <option>Ceramic Coating</option>
              <option>Paint Correction</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vehicle">Vehicle (make / model / year)</Label>
            <Input id="vehicle" name="vehicle" placeholder="e.g. BMW M3 2022" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="booking_date">Date</Label>
              <Input id="booking_date" name="booking_date" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="booking_time">Time</Label>
              <Input id="booking_time" name="booking_time" type="time" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={3} maxLength={1000} />
          </div>
          <Button type="submit" disabled={loading} className="mt-2 rounded-full h-11">
            {loading ? "Sending..." : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const rentalSchema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  customer_email: z.string().trim().email().max(200),
  customer_phone: z.string().trim().min(7).max(30),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  notes: z.string().trim().max(1000).optional(),
});

export function RentalDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const parsed = rentalSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("rentals").insert({ ...parsed.data, vehicle: "Black Truck" });
    setLoading(false);
    if (error) {
      toast.error("Couldn't submit request.");
      return;
    }
    toast.success("Rental request received! We'll confirm availability.");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Reserve the Black Truck</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <Input name="customer_name" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input name="customer_email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input name="customer_phone" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Pickup date</Label>
              <Input name="start_date" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label>Return date</Label>
              <Input name="end_date" type="date" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea name="notes" rows={3} />
          </div>
          <Button type="submit" disabled={loading} className="rounded-full h-11">
            {loading ? "Sending..." : "Request Rental"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
