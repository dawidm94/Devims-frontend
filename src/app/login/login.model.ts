export class SocialUserDto {
  userMail: string;
  firstName: string;
  lastName: string;
  token: string;
  photoUrl: string;
  socialServiceName: string;


  constructor(userMail: string, firstName: string, lastName: string, token: string, photoUrl: string, socialServiceName: string) {
    this.userMail = userMail;
    this.firstName = firstName;
    this.lastName = lastName;
    this.token = token;
    this.photoUrl = photoUrl;
    this.socialServiceName = socialServiceName;
  }
}
