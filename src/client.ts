export const createRegister = () => {

    const events: any[] = [];

    const register = (event: any) => {
        events.push(event);
    }

    const output = () => ({
        "title": "all events",
        'steps': events,
    })

    return {
        register,
        output,
    };
}
