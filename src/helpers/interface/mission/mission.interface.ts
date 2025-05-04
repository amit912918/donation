export interface IMissionData {
    title: string;
    description: string;
    photos: string[];
    videoUrl?: string;
    needyPersonAddress: string;
    needyPersonCity: string;
    needyPersonCount: number;
    contactNumber: string;
    documents?: string[];
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
    upiId?: string;
}
