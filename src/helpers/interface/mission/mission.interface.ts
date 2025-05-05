export interface IMissionData {
    title: string;
    description: string;
    photos: string[];
    videoUrl?: string;
    needyPersonAddress: string;
    needyPersonCity: string;
    memberCount: {
        son: number,
        daughter: number
    };
    isWife: boolean,
    contactNumber: string;
    documents?: string[];
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
    upiId?: string;
}
