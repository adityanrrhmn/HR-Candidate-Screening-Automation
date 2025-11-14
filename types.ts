export interface Country {
  name: string;
  code: string; // e.g., +62
  iso: string; // e.g., ID
}

export interface FormData {
  email: string;
  fullName: string;
  dob: string;
  whatsappNumber: string;
  linkedin: string;
  jobPosition: string;
  cv: File | null;
  portfolio: string;
}

export interface FormErrors {
  email?: string;
  fullName?: string;
  dob?: string;
  whatsappNumber?: string;
  jobPosition?: string;
  cv?: string;
}
