import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type AuthorPromoModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    metaData: {
        name: string;
    };
};

export const AuthorPromoModal = ({ open, onOpenChange, metaData }: AuthorPromoModalProps) => {
    const [showConfirm, setShowConfirm] = useState(false);

    // Called when user tries to close the main modal
    const handleMainModalChange = (isOpen: boolean) => {
        if (!isOpen) {
            setShowConfirm(true); // Show confirm dialog before closing
        } else {
            onOpenChange(true);
        }
    };

    const handleConfirmClose = () => {
        setShowConfirm(false);
        onOpenChange(false); // Actually close main modal
    };

    return (
        <>
            {/* Main Modal */}
            <Dialog open={open} onOpenChange={handleMainModalChange}>
                <DialogContent className="max-w-4xl bg-green-50 transition-all duration-400 data-[state=open]:animate-modalIn data-[state=closed]:animate-modalOut">
                    <VisuallyHidden>
                        <DialogTitle>Details</DialogTitle>
                    </VisuallyHidden>

                    <section className="py-10 px-4 bg-green-50">
                        <div className="container mx-auto max-w-5xl">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="md:w-1/2">
                                    <div className="flex items-center mb-4">
                                        <Badge className="bg-green-500 text-white mr-2">{metaData.name}</Badge>
                                    </div>
                                    <h2 className="text-xl font-bold mb-2">Want to earn by selling your themes?</h2>
                                    <ul className="text-gray-600 mb-4 text-sm space-y-2">
                                        <li className="flex items-center">
                                            <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                                            <span>Join a growing community of creatives</span>
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                                            <span>Earn passive income from your work</span>
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                                            <span>Full control over your products</span>
                                        </li>
                                    </ul>
                                    <Button asChild className="bg-green-500 hover:bg-green-600 text-white text-xs">
                                        <Link href="./become-author">Become an Author on {metaData.name}</Link>
                                    </Button>
                                    <p className="text-foreground text-sm mt-4">
                                        No setup fees • No monthly charges • Start earning immediately
                                    </p>
                                </div>
                                <div className="md:w-1/2">
                                    <Image
                                        src="/step-illustrations/1.png"
                                        alt="Become an author"
                                        width={400}
                                        height={200}
                                        className="rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </DialogContent>
            </Dialog>

            {/* Confirmation Modal */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="max-w-md bg-white">
                    <VisuallyHidden>
                        <DialogTitle>Continue Later</DialogTitle>
                    </VisuallyHidden>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Want to continue this later?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            You can always become an author from your dashboard at any time.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowConfirm(false)}>
                                Go Back
                            </Button>
                            <Button onClick={handleConfirmClose} className="bg-green-500 hover:bg-green-600 text-white">
                                Close Anyway
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
};
