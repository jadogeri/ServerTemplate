import { isValidEmail, 
         isValidPassword, 
         isValidUsername, 
         isValidatePhoneNumber } 
from "../../../src/utils/inputValidation";
import { input } from "../../__mocks__/inputs"

// math.test.js

describe('input validation', () => {
  test('validates email correctness', () => {
    expect(isValidEmail(input.EMAIL[0])).toBeTruthy();
    expect(isValidEmail(input.EMAIL[1])).toBeFalsy();
    expect(isValidEmail(input.EMAIL[2])).toBeFalsy();
    expect(isValidEmail(input.EMAIL[3])).toBeFalsy();
    expect(isValidEmail(input.EMAIL[4])).toBeFalsy();


  });

  test('validates username correctness', () => {
    expect(isValidUsername(input.USERNAME[0])).toBeTruthy();
    expect(isValidUsername(input.USERNAME[1])).toBeTruthy();
    expect(isValidUsername(input.USERNAME[2])).toBeFalsy();
    expect(isValidUsername(input.USERNAME[3])).toBeFalsy();
    expect(isValidUsername(input.USERNAME[4])).toBeFalsy();


  });

  test('validates password correctness', () => {
    expect(isValidPassword(input.PASSWORD[0])).toBeTruthy();
    expect(isValidPassword(input.PASSWORD[1])).toBeFalsy();
    expect(isValidPassword(input.PASSWORD[2])).toBeFalsy();
    expect(isValidPassword(input.PASSWORD[3])).toBeFalsy();
    expect(isValidPassword(input.PASSWORD[4])).toBeFalsy();


  });  
  
  test('validates phone correctness', () => {
    expect(isValidatePhoneNumber(input.PHONE[0])).toBeTruthy();
    expect(isValidatePhoneNumber(input.PHONE[1])).toBeFalsy();
    expect(isValidatePhoneNumber(input.PHONE[2])).toBeFalsy();
    expect(isValidatePhoneNumber(input.PHONE[3])).toBeFalsy();
    expect(isValidatePhoneNumber(input.PHONE[4])).toBeFalsy();

  });
});