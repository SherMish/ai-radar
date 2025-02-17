"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { defaultSettings } from "@/lib/types/cookie-consent";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

export function CookieBanner() {
  const { showBanner, showSettings, settings, setShowSettings, saveSettings } = useCookieConsent();
  const [tempSettings, setTempSettings] = useState(settings);

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-background/80 border-t border-border p-4 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your experience. Choose your preferences or click "Accept All" to agree to our use of cookies.
            </p>
            <div className="flex gap-4 shrink-0">
              <Button variant="outline" onClick={() => setShowSettings(true)}>
                Customize
              </Button>
              <Button variant="outline" onClick={() => saveSettings(defaultSettings)}>
                Decline All
              </Button>
              <Button onClick={() => saveSettings({ ...defaultSettings, analytics: true, marketing: true })}>
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cookie Settings</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Required cookies are necessary for the website to function and cannot be disabled.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Required Cookies</Label>
                <div className="text-sm text-muted-foreground">
                  Necessary for the website to function properly
                </div>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics Cookies</Label>
                <div className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website
                </div>
              </div>
              <Switch
                checked={tempSettings.analytics}
                onCheckedChange={(checked) =>
                  setTempSettings({ ...tempSettings, analytics: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Cookies</Label>
                <div className="text-sm text-muted-foreground">
                  Used to deliver personalized advertisements
                </div>
              </div>
              <Switch
                checked={tempSettings.marketing}
                onCheckedChange={(checked) =>
                  setTempSettings({ ...tempSettings, marketing: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => saveSettings(tempSettings)}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 