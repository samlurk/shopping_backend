import { type MetaData } from '../interfaces/user.interface';

// Declare the Schema of the Mongo model
export default class UserModel {
  constructor(
    private readonly firstName: string,
    private readonly lastName: string,
    private readonly email: string,
    private readonly password: string,
    private readonly role: string = 'customer',
    private readonly phone: string,
    private readonly createAt = new Date(),
    private readonly metadata?: MetaData,
    private readonly updateAt: Date | 'never' = 'never'
  ) {
    this.metadata = {
      lastLogin: this.createAt,
      isBlocked: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }
}
