export interface IMissionData {
    title: string;
    description: string;
    photos: string[]; // array of URLs or paths
    videoUrl?: string;
    address: string;
    memberCount: number;
    city: string;
    contactNumber: string;
    documents?: string[]; // optional document URLs/paths
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
    upiId?: string;
}
