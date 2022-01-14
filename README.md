# Student Management System

## Project setup

### 1. Install Required Modules
```
lerna bootstrap
```
### 2. Build Packages
```
lerna run build
```

### Compiles and hot-reloads for development

#### UI
```
lerna run --stream --scope rampup-ui start
```

#### Crud Service
```
lerna run --stream --scope crud-service start:dev
```

#### File Upload Service
```
lerna run --stream --scope file-upload-service start:dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

