export class ZipCode {
  static MASK = '99999-999';
  static LENGTH = 8;

  static digits(zipCode: string): string {
    return zipCode.replace(/\D/g, '');
  }

  static isComplete(zipCode: string): boolean {
    return ZipCode.digits(zipCode).length === ZipCode.LENGTH;
  }
}
