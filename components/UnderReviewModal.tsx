"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";

interface UnderReviewModalProps {
    open: boolean;
    onClose: () => void;
}

export default function UnderReviewModal({ open, onClose }: UnderReviewModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white">
                <VisuallyHidden>
                    <DialogTitle>Application Under Review</DialogTitle>
                </VisuallyHidden>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-yellow-600 mb-4">
                        Your application is under review
                    </h3>
                    <p className="text-gray-600 mb-6">
                        You’ve successfully applied to become an author. Our team is reviewing your application,
                        and you’ll be notified once it’s approved.
                    </p>
                    <div className="flex justify-end">
                        <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-800 text-white">
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
