export const createRegister = () => {

    const events: any[] = [];

    const register = (event: any) => {
        events.push(event);
        console.log(events.length, events.slice(-1)[0])
    }

    return register;
}
