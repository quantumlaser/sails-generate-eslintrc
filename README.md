# sails-generate-eslintrc

## Description
Generate eslint config file which contains sails's globals.<br/>
It will generate .eslintrc-sails(sails globals file ) and .eslintrc (eslint config file. If it exists, it will be updated).

## Parameter
- -m --mode
    + *Default* : Append default globals which contains [sails] and object under ['api/controllers', 'api/models', 'api/services']
    + append: Add other globals given by other parameters(-g, -f), which are appended in sails globals file(.eslintrc-sails)
    + override: Override sails globals file by other parameter(-g, -f). If no other parameters, an empty sails globals file(.eslintrc-sails) will be created.
- -g --globals : Give globals array. Example: -g sails,test1,test2.
- -f --folders : Give folders array containing globals. Example: -f api/models,api/controllers.
- -c --config : Set eslint config file name.
- -p --preset : Set preset code style when creates a new eslint config file.
- -s --show : Show globals added.

## Files Example
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
- global install(Recommend)
    + Install:
        ```
        npm install sails-generate-eslintrc -g
        ```

    + Run:
        * When you run it first:You can run it under project root path in command line.It will add [sails] and object under ['api/controllers', 'api/models', 'api/services']

            ```
            sails-generate-eslintrc
            ```
        * When you want to append some globals:

            ```
            sails-generate-eslintrc -g sails -f api/models -m append
            ```

        * When you want to override config file with globals given by paramters:
            ```
            sails-generate-eslintrc -g sails -f api/models -m override
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

## Tips
- extend: google
    + If you want to use google or others as coding style, you may have to install:
    ```
    npm install eslint-config-google
    ```
