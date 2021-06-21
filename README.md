<p align="center">
  <a href="http://www.pickcook.kr/" target="blank"><img src="https://www.pickcook.kr/img/logo.ae204840.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

[Pickcook] 픽쿡 서비스 Nest.JS + TypeORM 픽쿡 서버

## 서버 실행

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start
```

## Environments

- .env 파일 루트에서 생성하고 서버 가동

```bash
# development
  - NODE_ENV=development

#staging
  - NODE_ENV=staging

#production
  - NODE_ENV=production

```

## Controller/Service Method Naming Conventions

```bash
# Admin Controller
 - {methodName}{entityName}ForAdmin
    - findAllCommonCodeForAdmin()

# Common Controller
 - {methodName}{entityName}
    - findallCommonCode()
```

## Controller Endpoint Scheming Conventions

```bash

# Admin Endpoint

  - /admin/{entityName}...
    - @Get('/admin/common-code')
      async findAllCommonCodeForAdmin() ...

# Common Endpoint
  - /{entityName}
    - @Get('/common-code')
      async findAllCommonCode()...
```

## Pagination

```bash
# Pagination Request
  - PaginatedRequest 클래스를 사용해서 쿼리단에다가 삽입

# Pagination 결과
  - PaginatedResponse<ENTITY>로 결과값 받는다
```

## Scaffolding

```bash

# Basic structure
  - src
    - shared
      - common code
    - core
      - errors
      - interceptors
      - typeorm
        - select-query-builder.declaration.ts
      - guards
    - common
    - config
    - locales
      - kr
    - modules

# Module folder structure (src/modules)
  - {camelCaseEntityName}
    - dto
      - admin-{entityName}-{requestMethod}.dto.ts
      - index.ts
    - {entityName}.entity.ts
    - admin-{entityName}.controller.ts
    - {entityName}.controller.ts
    - {entityName}.service.ts

```

## Branches

```bash

# Default Branch
  - development

# Production Branch
  - master
```

## Footnote

- Author - [이상준] illumeweb@gmail.com
- Website - [https://www.pickcook.kr](https://www.pickcook.kr)
- NestJS - [https://nestjs.com](https://nestjs.com/)
- TypeORM - [https://typeorm.io/#/](https://typeorm.io/#/)
