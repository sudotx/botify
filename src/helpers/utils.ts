import axios from "axios";

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                         FUNCTIONS                          */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/
export const fetchNeko = async (): Promise<string> => {
    try {
        const response = await axios.get('https://nekos.pro/api/neko', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.url;
    } catch (error) {
        console.error('Error fetching neko image:', error);
        throw error;
    }
};

export const getNsfwNeko = async (): Promise<string> => {
    try {
        const response = await axios.get('https://nekos.pro/api/neko', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.url;
    } catch (error) {
        console.error('Error fetching neko image:', error);
        throw error;
    }
};

export const createEtherWallet = async () => {
}