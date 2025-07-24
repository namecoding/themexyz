// types/paystack-inline-js.d.ts
declare module "@paystack/inline-js" {
    interface TransactionOptions {
        key: string;
        email: string;
        amount: number;
        reference: string;
        currency?: string;
        label?: string;
        onSuccess?: (response: any) => void;
        onCancel?: () => void;
        channels?: string[];
        metadata?: Record<string, any>;
    }

    export default class PaystackPop {
        newTransaction(options: TransactionOptions): void;
        resumeTransaction(access_code: string): void;
    }
}
