export const createRegister = () => {

    const events: any[] = [];

    const register = (event: any) => {
        events.push(event);
        console.log(events.length, events.slice(-1)[0])
    }

    const output = () => ({
        'cypress-recorder': {
            "title": "lib events only",
            "steps": events.filter(event => !['navigate', 'request', 'response'].includes(event.type))
        },
        'qa-aas': {
            "title": "all events",
            'steps': events,
        }
    })

    return {
        register,
        output,
    };
}
