import { v4 as uuid } from 'uuid';

class Id {
    static gerarHash(): string {
        return uuid();
    }
}

export default Id