# Ivent Test Case - Dog Api Serverless 
## Summary

Project used for test case.
AWS Serverless Framework Used
Dogs Api is using express http api of AWS Serverless.
Auth Api (Signin & Signup) is using native htpp services.
Applicaton follows Router -> Service -> Controller Architecture.
Custom Response helper used for customized responses.
All Dog Api routers are protected by auth middleware.
There are 2 helpers for jwt decode process and current timestamp.
All Functions are configured for CORS.

## Endpoints

API GATEWAY Endpoints Table:

| Endpoint | Body | Method | Response
| ------ | ------ | ------ | ------ |
| /auth/sigin |   { email, password }     |  POST   | 200 - Token Response |
| /auth/sigup | { email, password, name, lastname } |  POST   | 201 |
| /user/me |   |  GET   | 200 - User Informations |
| /dog/breeds |   |  GET   | 200 - Breeds List |
| /dog/images?search=african |   |  GET   | 200 - Dogs List by breed |
| /dog/favorites |   |  GET   | 200 - Favorites List |
| /dog/favorites |  { image }   |  POST   | 201  |
| /dog/favorites/identifier |  |  DELETE   | 200 - Unfavorite dog  |

## Installation

Install the dependencies and devDependencies for start the project.
```sh
npm install
serverless deploy
```

## License

MIT
