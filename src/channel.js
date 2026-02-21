class Channel {
    constructor() {
        this.messages = [];
    }
}

class PrivateChannel extends Channel {
    constructor(remote) {
        super();
    }
}

class PublicChannel extends Channel {
    constructor(number) {
        super();
        this.activeUsers = [];
        this.number = number;
    }

    removeActiveUser(mac) {}
}

module.exports = { Channel, PrivateChannel, PublicChannel };
