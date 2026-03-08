class Channel {
    constructor() {
        this.messages = [];
    }
}

class PrivateChannel extends Channel {
    constructor(remote) {
        super();
    }

    pushMessage(message) {
        this.messages.push(message);
    }
    setRemoteInfo(rinfo) {}
}

class PublicChannel extends Channel {
    constructor(number) {
        super();
        this.activeUsers = [];
        this.number = number;
    }

    pushMessage(message) {
        this.messages.push(message);
    }

    addActiveUser(user) {}
    removeActiveUser(mac) {}
}

module.exports = { Channel, PrivateChannel, PublicChannel };
