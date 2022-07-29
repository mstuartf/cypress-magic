export const createRegister = () => {

    const events: any[] = [];

    const register = (event: any) => {
        events.push(event);
        console.log(events.length, events.slice(-1)[0])
    }

    const output = () => ({
        'cypress-recorder': {
            "title": "autogen",
            "steps": events.filter(event => !['navigate', 'request', 'response'].includes(event.type))
        },
        'qa-aas': {
            'steps': events,
        }
    })

    return {
        register,
        output,
    };
}
