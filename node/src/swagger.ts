var swaggerJson = { 
    "swagger": "2.0", 
    "info": { 
        "description": "Api Documentation.", 
        "version": "1.0.0", 
        "title": "Cheffi Api",  
    }, 
    "host": "18.220.121.204", 
    "basePath": "/", 
    "tags": [ 
    { 
        "name": "recipe", 
        "description": "Everything about Recipe Info", 
    }, 
    { 
        "name": "user", 
        "description": "Everything about User Info" 
    }, 
    { 
        "name": "test", 
        "description": "for Test", 
    } ,    
    { 
        "name": "etc", 
        "description": "It could be used one day", 
    } 
    ], 
    "schemes": [ "https" ], 
    "paths": { 
        "/recipe/": { 
            "post": { 
                "tags": [ "recipe" ], 
                "summary": "Add a new pet to the store", 
                "description": "", 
                "operationId": "addPet", 
                "consumes": [ "application/json", "application/xml" ], 
                "produces": [ "application/xml", "application/json" ], 
                "parameters": [ { 
                    "in": "body", 
                    "name": "body", 
                    "description": "Pet object that needs to be added to the store", 
                    "required": true, 
                    "schema": { "$ref": "#/definitions/Pet" } } ], 
                "responses": { 
                    "405": { 
                        "description": "Invalid input" 
                        } }, 
                "security": [ { 
                    "petstore_auth": [ "write:pets", "read:pets" ] 
                    } ] 
            }
        } 
    } 
}
export default swaggerJson