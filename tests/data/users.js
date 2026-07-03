export const validUser = {
  email: 'admin@corp.com',
  pass: 'Admin@123',
}

export const badUsers = {
  wrongPass: { email: 'admin@corp.com', pass: 'wrongpass' },
  wrongEmail: { email: 'nobody@test.com', pass: 'Admin@123' },
  bothWrong: { email: 'fake@fake.com', pass: 'badpass' },
  emptyEmail: { email: '', pass: 'Admin@123' },
  emptyPass: { email: 'admin@corp.com', pass: '' },
  bothEmpty: { email: '', pass: '' },
  noAt: { email: 'adminatcorp.com', pass: 'Admin@123' },
  noDomain: { email: 'admin@', pass: 'Admin@123' },
  spaceEmail: { email: '   ', pass: 'Admin@123' },
  spacePass: { email: 'admin@corp.com', pass: '   ' },
  longEmail: { email: 'a'.repeat(180) + '@corp.com', pass: 'Admin@123' },
  sqlInject: { email: "' OR 1=1 --", pass: 'Admin@123' },
  xssEmail: { email: '<script>alert(1)</script>@x.com', pass: 'Admin@123' },
  multiAt: { email: 'a@@corp.com', pass: 'Admin@123' },
}

export const validEmployee = {
  name: 'Jane Doe',
  email: 'jane@company.com',
  phone: '9876543210',
  dept: 'Engineering',
  role: 'Senior Developer',
}

export const badEmployee = {
  emptyName: '',
  shortName: 'A',
  longName: 'A'.repeat(85),
  numInName: 'John123',
  invalidEmail: 'notanemail',
  shortPhone: '123',
  letterPhone: 'abc12345',
  capsEmail: 'JANE@COMPANY.COM',
  hyphenName: "O'Brien-Smith",
}

export const validRegister = {
  username: 'testuser',
  email: 'test@example.com',
  mobile: '9876543210',
  pass: 'Password1',
}

export const badRegister = {
  shortUser: { username: 'ab', email: 'a@b.com', mobile: '1234567890', pass: 'password1' },
  badEmail: { username: 'user1', email: 'bademail', mobile: '1234567890', pass: 'password1' },
  shortMobile: { username: 'user1', email: 'a@b.com', mobile: '123', pass: 'password1' },
  letterMobile: { username: 'user1', email: 'a@b.com', mobile: 'abcdefghij', pass: 'password1' },
  shortPass: { username: 'user1', email: 'a@b.com', mobile: '1234567890', pass: 'abc' },
  allEmpty: { username: '', email: '', mobile: '', pass: '' },
}
