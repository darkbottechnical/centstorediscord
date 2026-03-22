import logger from "../util/log.js";

class ChannelManager {
    /**
     * Class to handle and manage channel-level operations as well as
     *  parse transport layer (NOT TCP/IP) data.
     */
    constructor() {
        this.publicChannels = new Map();
        this.privateChannels = new Map();

        this.listeners = new Map();
    }

    /**
     * Helper function to get an object reference of a channel from the manager's channel maps.
     * @param {number | string} identifier - An identifier of the channel - number if public, mac if private
     * @returns {Channel}
     */
    getChannel(identifier) {
        const targetChannelMap =
            typeof identifier === "number"
                ? this.publicChannels
                : typeof identifier === "string"
                  ? this.privateChannels
                  : null;
        if (targetChannelMap == null)
            throw new Error(`Bad channel identifier: ${identifier}`);
        const targetChannel = targetChannelMap.get(identifier);
        if (!targetChannel) targetChannelMap.set(identifier, []);
        targetChannelMap.get(identifier);
    }

    /**
     * Helper function to parse a raw message JSON, and decode it if possible.
     * @param {Buffer} buffer - The JSON as raw bytes.
     * @returns {[string | null, Channel | null, object | null]}
     */

    parseTransportControl(buffer) {
        const parsed = JSON.parse(buffer.toString());
        if (!parsed.access) return [null, null]; // malformed/invalid buffer
        if (parsed.access === "public") {
            const [channelNo, decoded] = this.tryDecodePublicBuffer(
                Buffer.from(parsed.data),
            );
            if (channelNo === null || decoded === null) return;
            const targetChannel = this.getChannel(channelNo);
            return ["public", targetChannel, decoded];
        } else if (parsed.access === "private") {
            if (!parsed.data || !parsed.data.from || !parsed.data.from.mac)
                return;
            const targetChannel = this.getChannel(parsed.data.from.mac);
            return ["private", targetChannel, parsed];
        }
        return [null, null, null];
    }
    handleControl(buffer) {
        const [access, key, data] = this.parseTransportControl(buffer);
        if (access === null || key === null || data === null) return;
    }
    handleMessage(buffer) {
        const [access, key, data] = this.parseTransportControl(buffer);
        if (access === null || key === null || data === null) return;
        this.getChannel(key).pushMessage(data);
    }

    /**
     *
     * @param {Buffer} bytes
     * @returns {[number | null, object | null]}
     */
    tryDecodePublicBuffer(bytes) {
        for (const channel of this.publicChannels.keys()) {
            if (bytes[0] === 123 && bytes[bytes.length - 1] === 125) {
                const decryptedString = bytes
                    .map((byte) => byte - channel)
                    .toString();
                if (decryptedString.includes(`"preamble":`)) {
                    try {
                        return [channel, JSON.parse(decryptedString)];
                    } catch (e) {
                        continue;
                    }
                }
            }
        }
        return [null, null];
    }
}

class Channel {
    constructor() {
        this.messages = [];
        this.userList = new Map();
    }

    pushMessage(message) {
        this.messages.push(message);
    }

    addUser(userInfo) {
        this.userList.set(userInfo.mac, userInfo);
    }
    updateUser(macAddr, userInfo) {
        this.userList.set(macAddr, userInfo);
    }
    removeUser(macAddr) {
        this.userList.delete(macAddr);
    }
}

class PrivateChannel extends Channel {
    constructor(remoteMac) {
        super();
        this.remoteMac = remoteMac;
    }
}
class PublicChannel extends Channel {
    constructor(id) {
        super();
        this.id = id;
    }

    encodeMessage(data) {
        const strung = JSON.stringify(data);
        const buffered = Buffer.from(strung);
        const final = {
            access: "public",
            data: buffered.map((byte) => byte + channel).toString(),
        };
    }
}

export { ChannelManager, Channel, PrivateChannel, PublicChannel };
