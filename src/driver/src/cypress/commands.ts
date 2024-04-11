import { allCommands } from "../cy/commands";

const builtInCommands = [
  // `default` is necessary if a file uses `export default` syntax.
  // @ts-ignore
  ..._.toArray(allCommands).map((c) => c.default || c),
];

export default {
  create: (Cypress, cy, state, config) => {
    const commands = {};

    const Commands = {
      add(name, fn) {
        commands[name] = {
          name,
          fn,
        };
        return cy.addCommand(commands[name]);
      },
      addAll(options = {}, obj) {
        for (let name in obj) {
          const fn = obj[name];
          Commands.add(name, fn);
        }
        return null;
      },
    };
    for (let cmd of builtInCommands) {
      cmd(Commands, Cypress, cy, state, config);
    }
    return commands;
  },
};
