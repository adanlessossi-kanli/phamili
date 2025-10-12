import { FormControl } from '@angular/forms';
import { CustomValidators } from './custom.validators';

describe('CustomValidators', () => {
  describe('strongPassword', () => {
    it('should return null for valid strong password', () => {
      const control = new FormControl('Test123!@#');
      const validator = CustomValidators.strongPassword();
      
      const result = validator(control);
      
      expect(result).toBeNull();
    });

    it('should return error for password without number', () => {
      const control = new FormControl('TestPassword!');
      const validator = CustomValidators.strongPassword();
      
      const result = validator(control);
      
      expect(result).toEqual({ strongPassword: true });
    });

    it('should return error for password without uppercase', () => {
      const control = new FormControl('test123!@#');
      const validator = CustomValidators.strongPassword();
      
      const result = validator(control);
      
      expect(result).toEqual({ strongPassword: true });
    });

    it('should return error for password without lowercase', () => {
      const control = new FormControl('TEST123!@#');
      const validator = CustomValidators.strongPassword();
      
      const result = validator(control);
      
      expect(result).toEqual({ strongPassword: true });
    });

    it('should return error for password without special character', () => {
      const control = new FormControl('Test123456');
      const validator = CustomValidators.strongPassword();
      
      const result = validator(control);
      
      expect(result).toEqual({ strongPassword: true });
    });

    it('should return error for password too short', () => {
      const control = new FormControl('Test1!');
      const validator = CustomValidators.strongPassword();
      
      const result = validator(control);
      
      expect(result).toEqual({ strongPassword: true });
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      const validator = CustomValidators.strongPassword();
      
      const result = validator(control);
      
      expect(result).toBeNull();
    });
  });

  describe('noWhitespace', () => {
    it('should return null for valid non-whitespace value', () => {
      const control = new FormControl('ValidValue');
      const validator = CustomValidators.noWhitespace();
      
      const result = validator(control);
      
      expect(result).toBeNull();
    });

    it('should return error for whitespace-only value', () => {
      const control = new FormControl('   ');
      const validator = CustomValidators.noWhitespace();
      
      const result = validator(control);
      
      expect(result).toEqual({ whitespace: true });
    });

    it('should return error for empty value', () => {
      const control = new FormControl('');
      const validator = CustomValidators.noWhitespace();
      
      const result = validator(control);
      
      expect(result).toEqual({ whitespace: true });
    });

    it('should return null for value with content and whitespace', () => {
      const control = new FormControl('  Valid Content  ');
      const validator = CustomValidators.noWhitespace();
      
      const result = validator(control);
      
      expect(result).toBeNull();
    });
  });
});