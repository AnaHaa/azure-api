# Info

Ohjelmistotekniikan projektityö backend

## Asennus

Asenna tarvittavat lisäosat
```bash
Node@12.16.1
NPM@6.12.0
Azure Functions Core Tools
Visual Studio Code
VSCode: Azure Functions lisäosa
```

Asenna sovellus
```bash
npm install
```

## Endpointit

GET /api/UsersHttpTrigger
| Params        | Required | Description                |
| ------------- |:--------:| --------------------------:|
| userName      | true     | User's username            |
| passwordHash  | true     | User's password not hashed |

Valid response
```
status: 200,
body: {
  "_id": "userId",
  "name": "name",
  "country": "country",
  "profilePic": "link",
  "userName": "userName"
}
```
Invalid response
```
status: 404,
body: "User not found!"
```

POST / PUT /api/UsersHttpTrigger

Create an user using POST or update an user using PUT (Requires existing user and updates name, country and profilePic fields only)

| Body object   | Required | Description                | Type   |
| ------------- |:--------:| --------------------------:| ------:|
| name          | false    | User's name                | string |
| country       | false    | User's country             | string |
| profilePic    | false    | User's link to picture     | string |
| userName      | true     | User's username            | string |
| passwordHash  | true     | User's password not hashed | string |

Valid response
```
status: 201,
body: "User upsert!"
```
Invalid response
```
status: 400,
body: "User not found!"
```

GET /api/VisitsHttpTrigger
| Params        | Required | Description                |
| ------------- |:--------:| --------------------------:|
| UserId        | true     | User's id                  |

Valid response
```
status: 200,
body: {
    [
        {
            "coordinates": {
                "lat": "latitudeString",
                "lon": "longitudeString"
            },
            "_id": "visitId",
            "UserId": "userId",
            "name": "visitName",
            "dateCreated": "visitCreatedDate",
            "visited": true,
            "comments": [
                {
                    "_id": "commentId",
                    "comment": "commentString"
                },
                {
                    "_id": "commentId",
                    "comment": "commentString"
                }
            ],
            "tags": [
                {
                    "_id": "tagId",
                    "tag": "tagString"
                },
                {
                    "_id": "tagId",
                    "tag": "tagString"
                }
            ],
            "category": "category",
            "pictureLink": [
                {
                    "_id": "pictureLinkId",
                    "link": "pictureLinkString"
                },
                {
                    "_id": "pictureLinkId",
                    "link": "pictureLinkString"
                }
            ],
        },
    ]
}
```
Invalid response
```
status: 404,
body: "Visits not found!"
```

PUT /api/VisitsHttpTrigger

Location can be updated using fields UserId and name to target location object in database

| Body object   | Required | Description                    | Type                  |
| ------------- |:--------:| ------------------------------:| ---------------------:|
| UserId        | true     | User's id                      | string                |
| name          | true     | Visit's name                   | string                |
| dateCreated   | true     | Date created                   | string                |
| visited       | true     | Has user visited location      | boolean               |
| comments      | false    | User's comments of location    | object array          |
| tags          | false    | User's tags of location        | object array          |
| category      | false    | Visit's category               | string                |
| pictureLink   | false    | User's pictures of location    | object array          |
| coordinates   | true     | Object containing lat and lon  | object with strings   |

Valid response
```
status: 201,
body: "Visit upsert!"
```
Invalid response
```
status: 400,
body: "Upsert failed!"
```

DELETE  /api/VisitsHttpTrigger
| Params        | Required | Description                |
| ------------- |:--------:| --------------------------:|
| visitId       | true     | Location's id              |

Valid response
```
status: 202,
body: "Visit deleted!"
```
Invalid response
```
status: 400,
body: "Delete failed!"
```