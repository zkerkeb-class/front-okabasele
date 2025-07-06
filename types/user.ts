export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  signupDate: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  oauthAccounts: any[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}
