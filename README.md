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
lerna run --stream --scope rampup-ui
```

#### Crud Service
```
lerna run --stream --scope crud-service
```

#### File Upload Service
```
lerna run --stream --scope file-upload-service
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

