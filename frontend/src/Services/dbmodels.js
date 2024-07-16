export class PremiumUser {
  constructor(
    id = null,
    token = null,
    password,
    active = false,
    login_time = new Date(),
    email,
    premium_duration = 3
  ) {
    this.id = id;
    this.token = token;
    this.password = password;
    this.active = active;
    this.login_time = login_time;
    this.email = email;
    this.premium_duration = premium_duration;
  }

  static validateEmail(email) {
    // Implement email validation logic here
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      throw new Error("Invalid email address");
    }
    return email;
  }
}

export class FreeUser {
  constructor(token, login_time = new Date()) {
    this.token = token;
    this.login_time = login_time;
  }
}

export class IBasePremiumUser {
  constructor(id = null, token = null, email) {
    this.id = id;
    this.token = token;
    this.email = email;
  }
}

export class IBaseFreeUser {
  constructor(token) {
    this.token = token;
  }
}

export class IFreeUserCreate extends IBaseFreeUser {
  constructor(token, login_time = new Date()) {
    super(token);
    this.login_time = login_time;
  }
}

export class IFreeUserRead extends IBaseFreeUser {
  constructor(token) {
    super(token);
  }
}

export class FreeUserUpdate extends IBaseFreeUser {
  constructor(token) {
    super(token);
  }
}

export class IPremiumUserCreate extends IBasePremiumUser {
  constructor(id = null, token = null, email, password) {
    super(id, token, email);
    this.password = password;
  }

  static validateEmail(email) {
    // Implement email validation logic here
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      throw new Error("Invalid email address");
    }
    return email;
  }
}

export class IPremiumUserRead extends IBasePremiumUser {
  constructor(id = null, token, email) {
    super(id, token, email);
  }
}
