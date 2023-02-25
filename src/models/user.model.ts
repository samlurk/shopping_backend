import { MetaData } from '../interfaces/user.interface';

// Declare the Schema of the Mongo model
export default class UserModel {
  constructor(
    private firstName: string,
    private lastName: string,
    private email: string,
    private password: string,
    private role: string = 'customer',
    private phone: string,
    private createAt?: Date,
    private metadata?: MetaData
  ) {
    this.createAt = new Date();
    this.metadata = {
      lastLogin: this.createAt,
      isBlocked: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }
}
