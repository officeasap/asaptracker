import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Bell, BellRing, CheckCircle2, Info, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { askForNotificationPermission, subscribeUserToPushNotifications } from '@/services/notificationService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  flightNumber: z.string().optional(),
  departureAirport: z.string().optional(),
  arrivalAirport: z.string().optional(),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
});

const FlightAlertsSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'default'>('default');
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      flightNumber: "",
      departureAirport: "",
      arrivalAirport: "",
      emailNotifications: true,
      pushNotifications: true,
    },
  });

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      if (data.pushNotifications) {
        const permission = await askForNotificationPermission();
        
        if (permission === 'granted') {
          await subscribeUserToPushNotifications({
            name: data.name,
            email: data.email,
            flightNumber: data.flightNumber || '',
            departureAirport: data.departureAirport || '',
            arrivalAirport: data.arrivalAirport || ''
          });
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Successfully signed up for flight alerts!");
      setIsSubscribed(true);
      
      if (data.pushNotifications && Notification.permission === 'granted') {
        const notification = new Notification("Welcome to ASAP Tracker Alerts!", {
          body: "You'll now receive real-time updates for your flights.",
          icon: "/favicon.ico"
        });
      }
    } catch (error) {
      console.error("Error subscribing to alerts:", error);
      toast.error("There was an error signing up for alerts. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign Up for Free Flight Alerts</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Stay informed about flight changes, delays, and gate updates with our real-time alert system. 
              Never miss important flight information again.
            </p>
          </div>
          
          {isSubscribed ? (
            <Card className="max-w-2xl mx-auto bg-[#1A1A1A] border-[#8B0000]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Subscription Confirmed!
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Thank you for signing up for ASAP Tracker Flight Alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>You are now subscribed to receive real-time flight alerts. Here's what happens next:</p>
                
                <div className="bg-[#222222] p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>You'll receive push notifications for your flight updates</li>
                    <li>Alerts will include gate changes, delays, and status updates</li>
                    <li>You can manage your alert preferences at any time</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsSubscribed(false)}
                >
                  Edit Subscription
                </Button>
                <Button
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="bg-[#1A1A1A] border-[#8B0000]">
                  <CardHeader>
                    <CardTitle>Flight Alert Registration</CardTitle>
                    <CardDescription className="text-gray-400">
                      Enter your details to receive real-time flight alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your name" {...field} className="bg-[#222222]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="your.email@example.com" {...field} className="bg-[#222222]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Flight Details (Optional)</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="flightNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Flight Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. AA1234" {...field} className="bg-[#222222]" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="departureAirport"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Departure from</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. LAX" {...field} className="bg-[#222222]" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="arrivalAirport"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Arrival Airport</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. BKK" {...field} className="bg-[#222222]" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Notification Preferences</h3>
                          <div className="space-y-3">
                            <FormField
                              control={form.control}
                              name="emailNotifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="data-[state=checked]:bg-[#8B0000] data-[state=checked]:border-[#8B0000]"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Email Notifications
                                    </FormLabel>
                                    <FormDescription className="text-gray-400 text-xs">
                                      Receive alerts via email
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="pushNotifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="data-[state=checked]:bg-[#8B0000] data-[state=checked]:border-[#8B0000]"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="flex items-center gap-1">
                                      Push Notifications
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Info className="h-4 w-4 cursor-pointer text-gray-400 hover:text-white" />
                                        </DialogTrigger>
                                        <DialogContent className="bg-[#1A1A1A] text-white">
                                          <DialogHeader>
                                            <DialogTitle>About Push Notifications</DialogTitle>
                                            <DialogDescription className="pt-2 text-gray-400">
                                              Push notifications allow you to receive real-time alerts directly on your device, even when you're not on our website. 
                                              You'll need to grant permission for notifications when prompted.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-2">
                                            <p>Benefits of push notifications:</p>
                                            <ul className="list-disc pl-5 text-sm text-gray-300">
                                              <li>Instant delivery of flight status changes</li>
                                              <li>Gate changes and boarding notifications</li>
                                              <li>Delay and cancellation alerts</li>
                                              <li>Works across browsers and devices</li>
                                            </ul>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </FormLabel>
                                    <FormDescription className="text-gray-400 text-xs">
                                      Receive instant alerts in your browser
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-[#8B0000] hover:bg-[#A80000]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <BellRing className="h-4 w-4" />
                              Sign Up for Free Alerts
                            </span>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-[#1A1A1A] border-[#8B0000]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BellRing className="h-5 w-5 text-[#8B0000]" />
                      Flight Alert Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="h-5 w-5 text-[#8B0000] mt-0.5 shrink-0" />
                        <p className="text-sm">Instant gate change notifications</p>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="h-5 w-5 text-[#8B0000] mt-0.5 shrink-0" />
                        <p className="text-sm">Real-time delay and cancellation alerts</p>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="h-5 w-5 text-[#8B0000] mt-0.5 shrink-0" />
                        <p className="text-sm">Boarding time reminders</p>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="h-5 w-5 text-[#8B0000] mt-0.5 shrink-0" />
                        <p className="text-sm">Weather updates affecting your flight</p>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="h-5 w-5 text-[#8B0000] mt-0.5 shrink-0" />
                        <p className="text-sm">Baggage claim information</p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                {notificationPermission !== 'granted' && (
                  <Card className="bg-[#1A1A1A] border-[#8B0000]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bell className="h-5 w-5 text-[#8B0000]" />
                        Enable Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Allow push notifications to receive instant alerts about your flights, even when you're not on our website.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full border-[#8B0000] text-white hover:bg-[#8B0000]/10"
                        onClick={() => askForNotificationPermission()}
                      >
                        Enable Push Notifications
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FlightAlertsSignup;
