
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  isPushNotificationSupported, 
  askForNotificationPermission, 
  checkSubscription, 
  unsubscribeFromPushNotifications,
  sendTestNotification
} from '@/services/notificationService';
import { toast } from "sonner";

interface NotificationBellProps {
  variant?: "icon" | "button";
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  variant = "icon",
  className = ""
}) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'default'>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Check notification status on mount
  useEffect(() => {
    const checkNotificationStatus = async () => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
        
        if (Notification.permission === 'granted') {
          const subscribed = await checkSubscription();
          setIsSubscribed(subscribed);
        }
      }
    };
    
    checkNotificationStatus();
  }, []);

  const handleEnableNotifications = async () => {
    const permission = await askForNotificationPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      navigate('/flight-alerts');
    } else if (permission === 'denied') {
      toast.error("Notification permission denied. Please enable notifications in your browser settings.");
    }
  };

  const handleUnsubscribe = async () => {
    const success = await unsubscribeFromPushNotifications();
    
    if (success) {
      setIsSubscribed(false);
      toast.success("Successfully unsubscribed from notifications");
    } else {
      toast.error("Failed to unsubscribe from notifications");
    }
    
    setIsDialogOpen(false);
  };

  const handleTestNotification = () => {
    sendTestNotification();
    toast.success("Test notification sent");
  };

  if (!isPushNotificationSupported()) {
    return null;
  }

  if (variant === "button") {
    return (
      <Button
        onClick={handleEnableNotifications}
        variant="outline"
        className={`flex items-center gap-2 ${className}`}
      >
        <BellRing className="h-4 w-4" />
        Enable Flight Alerts
      </Button>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" 
          size="icon"
          className={`relative ${className}`}
          title={isSubscribed ? "Manage notifications" : "Enable notifications"}
        >
          {isSubscribed ? (
            <>
              <BellRing className="h-5 w-5 text-[#8B0000]" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#8B0000]" />
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-[#1A1A1A] text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSubscribed ? (
              <>
                <BellRing className="h-5 w-5 text-[#8B0000]" />
                Notification Settings
              </>
            ) : (
              <>
                <Bell className="h-5 w-5 text-[#8B0000]" />
                Enable Flight Alerts
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isSubscribed 
              ? "You're currently receiving flight alerts." 
              : "Get real-time notifications about your flights."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {notificationPermission === 'granted' ? (
            isSubscribed ? (
              <div className="space-y-4">
                <p className="text-sm">
                  You're currently receiving flight status notifications. You can unsubscribe at any time.
                </p>
                
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#8B0000]"
                    onClick={handleTestNotification}
                  >
                    Send Test Notification
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="flex-1 flex items-center gap-2"
                    onClick={handleUnsubscribe}
                  >
                    <BellOff className="h-4 w-4" />
                    Unsubscribe
                  </Button>
                </div>
                
                <div className="rounded-md bg-[#222222] p-3 mt-4">
                  <p className="text-xs text-gray-400">
                    Want to manage your notification preferences? Visit your <a href="/flight-alerts" className="text-[#8B0000] hover:underline">Flight Alerts</a> page.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm">
                  You've granted notification permissions, but haven't subscribed to any flight alerts yet.
                </p>
                
                <Button 
                  onClick={() => navigate('/flight-alerts')} 
                  className="w-full bg-[#8B0000] hover:bg-[#A80000] flex items-center gap-2"
                >
                  <BellRing className="h-4 w-4" />
                  Sign Up for Flight Alerts
                </Button>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <p className="text-sm">
                Enable notifications to receive real-time updates about your flights, including:
              </p>
              
              <ul className="text-sm space-y-2 list-disc pl-5 text-gray-300">
                <li>Flight status changes</li>
                <li>Gate changes</li>
                <li>Delay notifications</li>
                <li>Boarding time alerts</li>
              </ul>
              
              <Button 
                onClick={handleEnableNotifications} 
                className="w-full bg-[#8B0000] hover:bg-[#A80000] flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Enable Notifications
              </Button>
              
              {notificationPermission === 'denied' && (
                <div className="rounded-md bg-red-900/20 border border-red-900 p-3 mt-4">
                  <p className="text-xs text-red-400">
                    Notifications are blocked in your browser settings. Please update your browser settings to allow notifications from this site.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationBell;
