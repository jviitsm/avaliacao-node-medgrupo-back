# avaliacao-node-medgrupo-back

Projeto de avaliacão medgrupo
---

## Requirements

Node
TypeScript
NPM

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

## Install

    $ git clone https://github.com/jviitsm/avaliacao-node-medgrupo-back
    $ cd avaliacao-node-medgrupo-back
    $ npm install

## Running the project
  
    $ tsc
    $ npm start

## Simple build for production

    $ tsc
    
    
    
    
## Collections Postman

```
{
	"info": {
		"_postman_id": "230d68e7-234d-49a9-bdfb-f6dbc3398298",
		"name": "avaliacao-node-medgrupo",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "2820698"
	},
	"item": [
		{
			"name": "find all contact",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "localhost:3000/contatos",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"contatos"
					]
				}
			},
			"response": []
		},
		{
			"name": "find contact by id",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "localhost:3000/contatos/629e25854f704a2ebdae8830",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"contatos",
						"629e25854f704a2ebdae8830"
					]
				}
			},
			"response": []
		},
		{
			"name": "post contact",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"name\" : \"teste\",\n    \"birthday\" : \"1997-03-13\",\n    \"gender\" : \"Male\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/contatos",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"contatos"
					]
				}
			},
			"response": []
		},
		{
			"name": "Delete contact",
			"request": {
				"method": "DELETE",
				"header": [],
				"url": {
					"raw": "localhost:3000/contatos/629f982ddeff3b802ec88f67",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"contatos",
						"629f982ddeff3b802ec88f67"
					]
				}
			},
			"response": []
		},
		{
			"name": "disable contract",
			"request": {
				"method": "PATCH",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"isActive\" : false\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/contatos/disable/629f9dc2ab64bd84334df8d6",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"contatos",
						"disable",
						"629f9dc2ab64bd84334df8d6"
					]
				}
			},
			"response": []
		}
	]
}
```

[avaliacao-node-medgrupo.postman_collection.json.zip](https://github.com/jviitsm/avaliacao-node-medgrupo-back/files/8856492/avaliacao-node-medgrupo.postman_collection.json.zip)

