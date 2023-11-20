class User {
  constructor(
    id,
    name,
    username,
    email,
    phone,
    password,
    confirmpassword,
    address,
    companyName,
    taxNumber,
    role,
    bDate,
    gender,
    surname
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.confirmpassword = confirmpassword;
    this.address = address;
    this.companyName = companyName;
    this.taxNumber = taxNumber;
    this.role=role;
    this.bDate=bDate;
    this.gender=gender;
    this.surname=surname;
  }
}
module.exports = User;
