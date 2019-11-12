"# libra-ad" 
This Project creates an identity provider that mocks Azure AD. I call it libra-AD. The identity provider exposes an API that allows for basic authentication and provides a JWT token which details the user credetnials, as well as a list of groups that the user belongs to. 

# Main Features
1. Allows a basic sign in API using a username and passowrd
2. API exposes basic managment API performing CRUD (Create, Read, Update , Delete) on the users in the directoty as well as their groups
3. The managment API is accessible only to the directoy admins
4. Applications can redirect the user to our login page and obtain a signed JWT that includes the user credentials.

# Documented API
