import { UsersObjects } from "../server.js";
import fs from 'node:fs/promises';

const databasePath = new URL('../../db.json', import.meta.url) //Cria um "db.json" no diretório global da aplicação

interface UsersObjectsWithoutId extends Omit<UsersObjects, 'id'> {}

interface DatabaseProps {
    users: UsersObjects[];

}

export class Database {
    #database: DatabaseProps = { users: [] };

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data) //Retorna o banco de dados em formato de JSON
            })
            .catch(() => {
                this.#persist() //Persistir mesmo o arquivo estando vazio
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    // Método para selecionar usuários
    select(table: keyof DatabaseProps, search: Partial<Record<keyof UsersObjects, string>> | null) {
        let data = this.#database[table] ?? [];
    
        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return value !== null && row[key as keyof UsersObjects]?.toString().toLowerCase().includes(value.toString().toLowerCase());
                });
            });
        }
    
        return data;
    }

    // Método para inserir um usuário
    insert(table: keyof DatabaseProps, data: any) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()
    }
    //Método para modificar ou mudar dados de um usuário
    update(table: keyof DatabaseProps, id: string, data: UsersObjectsWithoutId){
        const rowIndex = this.#database[table].findIndex(row => row.id === id )

        if(rowIndex > -1) {
            this.#database[table][rowIndex] = {id, ...data}
            this.#persist()
        }
    }
    //Método para deletar um usuário
    delete(table: keyof DatabaseProps, id: string){
        const rowIndex = this.#database[table].findIndex(row => row.id === id )

        if(rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

}
