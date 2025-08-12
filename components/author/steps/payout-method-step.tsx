"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Trash2, University, UniversityIcon, LucideUniversity } from "lucide-react";
import toast from "react-hot-toast";
import { useActiveCurrency } from "@/lib/currencyTag";
import { defaultCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";


interface PayoutMethodStepProps {
    data: any;
    onNext: () => void;
    onPrev: () => void;
    onUpdate: (data: any) => void;
}

const banks = [
    { name: "Access Bank", logo: null },
    { name: "GTBank", logo: null },
    { name: "First Bank", logo: null },
    { name: "UBA", logo: null },
    { name: "Zenith Bank", logo: null },
    { name: "Fidelity Bank", logo: null },
    { name: "Union Bank", logo: null },
    { name: "Stanbic IBTC", logo: null },
    { name: "Ecobank", logo: null },
    { name: "Polaris Bank", logo: null },
    { name: "FCMB", logo: null },
    { name: "Other", logo: null },
];

const fieldLabels: Record<string, string> = {
    bankName: "Bank Name",
    accountNumber: "Account Number",
    accountHolder: "Account Holder Name",
    swiftCode: "SWIFT Code",
    bankAddress: "Bank Address",
};

function BankSelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = banks.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedBank = banks.find((b) => b.name === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start flex items-center space-x-2"
                    onClick={() => setOpen(!open)}
                >
                    {selectedBank ? (
                        <>
                            {selectedBank.logo ? (
                                <img
                                    src={selectedBank.logo}
                                    alt={selectedBank.name}
                                    className="w-5 h-5 rounded-sm"
                                />
                            ) : (
                                <UniversityIcon className="w-5 h-5 text-gray-400" />
                            )}
                            <span>{selectedBank.name}</span>
                        </>
                    ) : (
                        "Select a bank"
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]">
                <div className="p-2 border-b border-gray-200">
                    <Input
                        placeholder="Type to search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                        className="border-0 focus:ring-0 focus:border-0 focus:outline-none"
                    />
                </div>
                <div className="max-h-48 overflow-y-auto">
                    {filtered.length > 0 ? (
                        filtered.map((bank) => (
                            <button
                                key={bank.name}
                                className="w-full text-left px-2 py-1 hover:bg-gray-100 flex items-center space-x-2"
                                onClick={() => {
                                    onChange(bank.name);
                                    setSearch("");
                                    setOpen(false);
                                }}
                            >
                                {bank.logo ? (
                                    <img
                                        src={bank.logo}
                                        alt={bank.name}
                                        className="w-5 h-5 rounded-sm"
                                    />
                                ) : (
                                    <LucideUniversity className="w-5 h-5 text-gray-400" />
                                )}
                                <span>{bank.name}</span>
                            </button>
                        ))
                    ) : (
                        <div className="p-2 text-sm text-gray-500">No matches</div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default function PayoutMethodStep({
    data,
    onNext,
    onPrev,
    onUpdate,
}: PayoutMethodStepProps) {
    const [accounts, setAccounts] = useState(data.payoutMethod || []);
    const [showForm, setShowForm] = useState(false);
    const [formCurrency, setFormCurrency] = useState<"NGN" | "USD" | null>(null);
    const [formDetails, setFormDetails] = useState<any>({});
    const { currency, symbol } = useActiveCurrency(defaultCurrency)
    const [showConfirm, setShowConfirm] = useState(false);
    const [removeIndex, setRemoveIndex] = useState<number | null>(null);
    const handleAddAccount = () => {
        if (!formCurrency) return;

        const requiredFields =
            formCurrency === "NGN"
                ? ["bankName", "accountNumber", "accountHolder"]
                : ["bankName", "accountNumber", "accountHolder", "swiftCode"];

        const missing = requiredFields.filter(
            (field) => !formDetails[field] || formDetails[field].trim() === ""
        );

        if (missing.length > 0) {
            const friendlyFields = missing.map((field) => fieldLabels[field] || field);
            toast.error(`Please fill: ${friendlyFields.join(", ")}`);
            return;
        }

        const newAccount = { currency: formCurrency, details: formDetails };
        //const updatedAccounts = [...accounts, newAccount];
        const updatedAccounts = [...(Array.isArray(accounts) ? accounts : []), newAccount];


        setAccounts(updatedAccounts);
        setShowForm(false);
        setFormDetails({});
        setFormCurrency(null);

        onUpdate({ payoutMethod: updatedAccounts });
    };

    const handleRemoveAccount__ = (index: number) => {

        const confirmed = window.confirm("Are you sure you want to remove this payout account?");
        if (!confirmed) return;

        const updated = accounts.filter((_, i) => i !== index);
        setAccounts(updated);
        onUpdate({ payoutMethod: updated });
    };

    const handleRemoveAccount = (index: number) => {
        setRemoveIndex(index);
        setShowConfirm(true);
    };

    const confirmRemoveAccount = () => {
        if (removeIndex === null) return;
        const updated = accounts.filter((_, i) => i !== removeIndex);
        setAccounts(updated);
        onUpdate({ payoutMethod: updated });
        setShowConfirm(false);
        setRemoveIndex(null);
    };


    const handleDetailChange = (field: string, value: string) => {
        setFormDetails({ ...formDetails, [field]: value });
    };

    // useEffect(() => {
    //     console.log(data, "payout screen");
    // }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payout Methods</h1>
                <p className="text-lg text-gray-600">
                    Add one or more payout accounts. You can receive payments in different currencies.
                </p>
            </div>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Remove Account</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to remove this payout account? This action cannot be undone.</p>
                    <DialogFooter className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowConfirm(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmRemoveAccount}>
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {accounts.length > 0 && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Added Accounts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {accounts.map((acc, index) => (
                            <div
                                key={index}
                                className="border p-3 rounded flex justify-between items-center"
                            >
                                <div>
                                    <div className="font-medium">{acc.currency} Account</div>
                                    <div className="text-sm text-gray-500 capitalize">
                                        {acc.details.accountHolder}
                                        {acc.details.accountNumber
                                            ? ` - ****${acc.details.accountNumber.slice(-4)}`
                                            : ""}
                                    </div>
                                    <div className="text-sm text-gray-500">{acc.details.bankName}</div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveAccount(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {!showForm ? (
                <div className="flex space-x-4 mb-6">
                    <Button
                        onClick={() => {
                            setFormCurrency("NGN");
                            setFormDetails({})
                            setShowForm(true);
                        }}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        Add NGN Account
                    </Button>
                    <Button
                        onClick={() => {
                            setFormCurrency("USD");
                            setFormDetails({})
                            setShowForm(true);
                        }}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        Add USD Account
                    </Button>
                </div>
            ) : (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Add {formCurrency} Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {formCurrency === "NGN" ? (
                            <>
                                <div>
                                    <Label>Select Bank *</Label>
                                    <BankSelect
                                        value={formDetails.bankName}
                                        onChange={(val) => handleDetailChange("bankName", val)}
                                    />
                                </div>
                                <div>
                                    <Label>Account Number *</Label>
                                    <Input
                                        value={formDetails.accountNumber || ""}
                                        onChange={(e) =>
                                            handleDetailChange("accountNumber", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Account Holder Name *</Label>
                                    <Input
                                        value={formDetails.accountHolder || ""}
                                        onChange={(e) =>
                                            handleDetailChange("accountHolder", e.target.value)
                                        }
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <Label>Bank Name *</Label>
                                    <Input
                                        value={formDetails.bankName || ""}
                                        onChange={(e) =>
                                            handleDetailChange("bankName", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Account Number *</Label>
                                    <Input
                                        value={formDetails.accountNumber || ""}
                                        onChange={(e) =>
                                            handleDetailChange("accountNumber", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Account Holder Name *</Label>
                                    <Input
                                        value={formDetails.accountHolder || ""}
                                        onChange={(e) =>
                                            handleDetailChange("accountHolder", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>SWIFT Code *</Label>
                                    <Input
                                        value={formDetails.swiftCode || ""}
                                        onChange={(e) =>
                                            handleDetailChange("swiftCode", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Bank Address</Label>
                                    <Input
                                        value={formDetails.bankAddress || ""}
                                        onChange={(e) =>
                                            handleDetailChange("bankAddress", e.target.value)
                                        }
                                    />
                                </div>
                            </>
                        )}
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setShowForm(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddAccount}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                Save Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}


            <div className="flex justify-between">
                <Button variant="outline" onClick={onPrev}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!accounts.length}
                    className="bg-green-500 hover:bg-green-600 text-white"
                >
                    Continue
                </Button>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-8 pt-5 mt-8">
                <h3 className="font-semibold text-green-500 mb-2">Payout Tips</h3>
                <ul className="text-sm text-green-500 space-y-1">
                    <li>
                        • For security reasons, always use a bank account that matches your
                        registered name.
                    </li>
                    <li>• Ensure your bank details are accurate to avoid payout delays.</li>
                    <li>
                        • Update your payout info only through your account dashboard for
                        safety.
                    </li>
                </ul>
            </div>
        </div>
    );
}
