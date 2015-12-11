# sails-generate-eslintrc

## Description
Generate eslint config file which contains sails's globals.<br/>
It will generate .eslintrc-sails and .eslintrc (if it exists, it will be updated).

## Example
- .eslintrc-sails
    ```
    {
        "globals": {
            "sails": true,
            "UserController": true,
            "User": true
        }
    }
    ```

- .eslintrc
    + If not exists: it will be created.
        ```
        {
            "extends": [
                "google",
                ".eslintrc-sails"
            ]
        }
        ```

    + If exists: it will be updated(fourth line)
        ```
        {
            "extends": [
                "google",
                ".eslintrc-sails"
            ],
            "env": {
                "node": true,
                "browser": true
            },
            "plugins": [
                "jsdoc"
            ],
            "globals": {}
        }  
        ```  

## Usage
- global install
    + Install:
        ```
        npm install sails-generate-eslintrc -g
        ```

    + Run:
        * You need run it under project root path in command line

            ```
            sails-generate-eslintrc
            ```

- install in project path
    + Install:
        ```
        npm install sails-generate-eslintrc
        ```

    + Run:
        * You need run it under project root path in command line

            ```
            node_modules/.bin/sails-generate-eslintrc
            ```
