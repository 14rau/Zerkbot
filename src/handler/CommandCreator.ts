import { IBotCommand } from "../interfaces";

export class CommandBuilder{
    constructor(){}

    public createCommand(command : IBotCommand) : IBotCommand { 
        return command;
    }
}