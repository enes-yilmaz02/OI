class User {
    constructor(id, name, username, email, phone,
        password, confirmpassword ) {
            this.id = id;
            this.name = name;
            this.username = username;
            this.email = email;
            this.phone = phone;
            this.password = password;
            this.confirmpassword = confirmpassword;
           
    }
}
module.exports = User;