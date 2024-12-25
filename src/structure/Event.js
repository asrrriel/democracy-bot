/**
 * @template {keyof import('discord.js').ClientEvents} K
 */
class Event {
    data;

    /**
     * @param {{event: K, once?: boolean, run: import("discord.js").Awaitable<(client: typeof(global.client), ...args: import('discord.js').ClientEvents[K]) => void> }} structure 
     */
    constructor(structure) {
        this.data = {
            __type__: 5, // This used for the handler
            ...structure
        }
    }

    toJSON = () => {
        return { ...this.data }
    }
}

module.exports = Event;
