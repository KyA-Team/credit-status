class DBUrlBuilder {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.protocol = 'mongodb';
  }

  withAuth(user, pass) {
    if (user && pass) {
      this.user = encodeURIComponent(user);
      this.pass = encodeURIComponent(pass);
    }
    return this;
  }

  withSRV(isSRV) {
    this.protocol = isSRV ? 'mongodb+srv' : 'mongodb';
    this.isSRV = isSRV;
    return this;
  }

  build() {
    const urlArray = [this.protocol, '://'];
    if (this.user) {
      urlArray.push(this.user, ':', this.pass, '@');
    }
    urlArray.push(this.host);
    if (!this.isSRV) {
      urlArray.push(':', this.port);
    }
    const url = urlArray.join('');
    console.debug(`Connection string generated for mongo: ${url.replace(this.pass, '###')}`); // eslint-disable-line no-console
    return url;
  }
}

module.exports = DBUrlBuilder;
