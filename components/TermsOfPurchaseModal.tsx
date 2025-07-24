'use client'

import { Dialog } from '@headlessui/react'
import { X } from 'lucide-react'

export type TermsOfPurchaseModalProps = {
    isOpen: boolean
    onClose: () => void
}

export default function TermsOfPurchaseModal({
                                                 isOpen,
                                                 onClose,
                                             }: TermsOfPurchaseModalProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-50 bg-black/60"
        >
            <div className="relative w-full h-full overflow-y-auto bg-white p-6 md:p-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Terms of Purchase
                </h2>

                <div className="space-y-4 text-sm text-gray-700 max-w-3xl mx-auto">
                    <p>
                        These Terms of Purchase ("Terms") govern your purchase and use of digital products, software, or services provided by the author or vendor ("Author"). By completing your purchase, you confirm that you have read, understood, and agreed to the following conditions:
                    </p>

                    <ol className="list-decimal space-y-4 pl-4">
                        <li>
                            <strong>Acceptance of Product:</strong> You acknowledge that you have tested and reviewed the product to your satisfaction prior to purchase. All sales are final, and products are provided "as-is" at the time of delivery.
                        </li>

                        <li>
                            <strong>Legal Usage:</strong> You agree not to use the purchased system for any illegal, fraudulent, or unauthorized purposes. Any misuse of the product will result in termination of any support or future agreements.
                        </li>

                        <li>
                            <strong>Future Enhancements:</strong> Requests for updates, new features, or modifications are not covered under the original purchase. Any additional work will require a new agreement and may incur additional fees.
                        </li>

                        <li>
                            <strong>Support Terms:</strong> Support services will be provided in accordance with the duration and terms specified by the product author. The Author reserves the right to define the scope of support provided.
                        </li>

                        <li>
                            <strong>No Refund Policy:</strong> Once payment has been processed and the product has been delivered, no refunds will be issued. This includes cases of buyer’s remorse, preference changes, or post-delivery technical issues unless otherwise agreed upon in writing.
                        </li>

                        <li>
                            <strong>Reporting Period:</strong> Any complaints or requests for support must be reported within <strong>seven (7) working days</strong> from the date of purchase. Failure to report within this period will render the complaint void.
                        </li>

                        <li>
                            <strong>Responsiveness to Support:</strong> If a complaint is lodged and our support team contacts you to resolve the issue, you must respond promptly. Failure to respond to communication attempts within a reasonable time frame will result in the closure of the case.
                        </li>

                        <li>
                            <strong>Author Support Breach:</strong> If a valid complaint is submitted within seven (7) working days regarding the Author's failure to deliver promised support, and the Author does not respond after our team’s intervention, you may be eligible for a refund.
                        </li>

                        <li>
                            <strong>Post-Payout Complaints:</strong> If a complaint is made after the seven (7) working day window and the Author has already received payment, we will attempt to mediate. If the Author is unresponsive, their account may be suspended. Refunds in this case are only possible if the Author has a remaining balance in their account. If no funds remain, no refund will be issued.
                        </li>
                    </ol>

                    <p>
                        By proceeding with the purchase, you agree to all the terms outlined above. Please ensure that you fully understand and accept these conditions before continuing.
                    </p>
                </div>

                <div className="mt-10 text-center">
                    <button
                        onClick={onClose}
                        className="inline-flex items-center px-6 py-2 bg-green-600 hover:bg-[#7aa93c] text-white text-sm font-medium rounded-lg"
                    >
                        I Understand & Accept
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
