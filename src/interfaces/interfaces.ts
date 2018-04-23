export interface IBotCommand{
    name: string;
    function: Function;
    showCmd?: boolean;
    description?: string;
}

export interface IMessageListener{
    channelid: string;
    userid: string;
    onChange: (str : string) => void;
    /**
     * When user writes something, after the valit till this Listener will be removed
     */
    validtill: number;
}

export interface ITrick{
    /**
     * The trick as string
     */
    trick: string;
    /**
     * User id from user that commited this trick
     */
    by: string;
    approved: IApprove;
}

export interface IApprove{
    /**
     * Is this trick approved by an administrator? Only show this trick if it was approved
     */
    isApproved: boolean;
    /**
     * The Userid from the user that approved this trick
     */
    approvedBy: string;
}


export interface ITricks{
    nonawakening: ITrick[];
    awakening: ITrick[];
}

export interface IGlyphbuild{
    /**
     * Picture URL of the glyphbuild
     */
    url: string;
    /**
     * Description that describes the glyphbuild. A reason for what this glyphbuild is used
     */
    description: string;
    /**
     * UserID from the user that commited this glyphbuild
     */
    commitedBy: string;
    approved: IApprove;
    
}

export interface IRotation{
    rotation: {
        /**
         * Name from this rotation
         */
        name: string;
        /**
         *  Description from this rotation
         */
        description: string;
        rotation: string[];
    };
    commitedBy: string;
    approved: IApprove;
}