class Component {
    data;

    /**
     *
     * @param {{customId: string, type: 'modal' | 'select' | 'button', options?: Partial<{ public: boolean }>, run: import("discord.js").Awaitable<(client: typeof(global.client), interaction: import('discord.js').Interaction) => void> }} structure 
     */
    constructor(structure) {
        this.data = {
            __type__: 3, // This used for the handler
            ...structure
        }
    }

    toJSON = () => {
        return { ...this.data }
    }
}

module.exports = Component;
