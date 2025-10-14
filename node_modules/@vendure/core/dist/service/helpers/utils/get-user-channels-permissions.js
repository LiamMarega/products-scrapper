"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserChannelsPermissions = getUserChannelsPermissions;
exports.getChannelPermissions = getChannelPermissions;
const unique_1 = require("@vendure/common/lib/unique");
/**
 * Returns an array of Channels and permissions on those Channels for the given User.
 */
function getUserChannelsPermissions(user) {
    return getChannelPermissions(user.roles);
}
/**
 * @description
 * Returns an array of Channels and permissions on those Channels for the given Roles.
 */
function getChannelPermissions(roles) {
    const channelsMap = {};
    for (const role of roles) {
        for (const channel of role.channels) {
            if (!channelsMap[channel.code]) {
                channelsMap[channel.code] = {
                    id: channel.id,
                    token: channel.token,
                    code: channel.code,
                    permissions: [],
                };
            }
            channelsMap[channel.code].permissions = (0, unique_1.unique)([
                ...channelsMap[channel.code].permissions,
                ...role.permissions,
            ]);
        }
    }
    return Object.values(channelsMap).sort((a, b) => (a.id < b.id ? -1 : 1));
}
//# sourceMappingURL=get-user-channels-permissions.js.map