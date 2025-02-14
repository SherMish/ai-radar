"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToolAdded: () => void;
}

export function AddToolDialog({ open, onOpenChange, onToolAdded }: AddToolDialogProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!url) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add tool');
      }

      onToolAdded();
      onOpenChange(false);
      setUrl('');
    } catch (error) {
      console.error('Error adding tool:', error);
      setError(error instanceof Error ? error.message : 'Failed to add tool');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Tool</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Website URL</Label>
            <Input
              placeholder="Enter website URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !url}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Tool'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 