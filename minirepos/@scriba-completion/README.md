## About

## Code Naming Guidelines

This document provides a comprehensive set of guidelines for writing clear, easily navigable, and collaborative code. It focuses on the naming and categorization of files and modules, which are crucial for communicating their scope and function. Adhering to these conventions ensures the code remains modular, readable, and accessible.

### Identifying Modules (Folders & Files)

Since this project is a public npm package, it is important to maintain a clear distinction between public and private modules.

We use the `$` and `_$` prefix naming conventions to distinguish between public and private modules. This applies to both folders and individual file modules. The presence of these prefixes indicates the module's scope and its ability to be imported.

- A `_$` prefix signifies a private module for internal use only. It can only be imported or used within its own domain.

- A `$` prefix denotes a public module that is accessible to a broader range. These modules can be imported or used by the end-user.

In cases where a module is a folder, it is **not** mandatory to have an `index.ts` code-barrel file. However, it is recommended to include one. This allows for the use of the `import * as $SubModule from '$Module/$SubModule'` syntax, which can enhance code readability and maintainability.

### Identifying Public Exports (Files & Methods)

We use the `[ use ] useCamelCase` prefix in file names and `useCamelCase` prefix in method names to indicate single files/functions that are meant to be imported by other modules. The presence of this prefix signifies that the method or function is an exported entity, ready for import by other modules.

### Identifying Private Exports (Files & Folders)

A file or folder without any of the previously mentioned prefixes is considered part of the internal logic of the **current module**. These entities are not meant for import by modules or files **outside the current directory (../)**, thereby maintaining a private scope of functionality. This classification helps in preserving the code's integrity and prevents unintended access or modifications.