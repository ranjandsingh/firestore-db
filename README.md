# Firestore DB

A wrapper for Firestore to query data easily and intuitively with Syntax inspired by Mongodb / Mongoose works with web as well as react-native-firebase sdk.

### Install

`npm install firestore-db`

### Example

```javascript
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { queryBuilder } from 'firestore-db';

// import firestore from '@react-native-firebase/firestore';    // Only for react-native-firebase

const Users = queryBuilder(firebase.firestore().collection("users"));

// One user with firstName John
const OneJohn = Users.findOne({firstName:"John"});

// users age grater than 18 and firstName is John
const findAllAdults = Users.find({ firstName:"John", age:{">=",18}});

//Find All Users From New York and Los Angeles
const NYLA_users = Users.find({
city :["New York","Los Angeles"]
})

// Partial and Matching Text Search
// Find users First Name Starting with Joh
const SearchedUsers = Users.search("firstName","Joh")


```

###Queries
**find()** : find can take an object containing key value pair where query can be string, array or object with operator and value. the param bjects can also take orderBy and limit and returns and array of results no need to call data() functions to get the results.
ex :

```javascript
users.find({
	firstName:"John",
	city :["New York","Los Angeles"],
	age : {">=",18},
	limit:10,
	orderBy:"createdAt",
	//or  orderBy: ['createdAt', 'asc']  // with acs/desc
	//or orderBy: [['userId', 'desc'], ['createdAt', 'asc']] // multiple orderby
	})

	```

| Function name | Description                    |      Params               | Return |
| ------------- | ------------------------------ |------------------------------ |------------------------------ |
| `findOne()`   |returns First Matching result    | same as `find()` | object Ex: `{name:"",age:"",id:""}`|
| `findById()`      |Finds Matching doc with id        | id | object Ex: `{name:"",age:"",id:""}`|
| `create()`      | Creates New Doc      |object  Ex: `{name:"",age:"",}` | Resove/Reject|
| `update()`      | Updates Existing Doc       |id,updatedObject Ex: `"uudefdsds",{name:"",age:""}` | updatedObject|
| `deleteOne()`      | Delete one Doc with id      | id Ex: `"uudefdsds"` |  Resove/Reject
| `deleteMany()`      | Deletes all docs from list of ids      | Array Ex: `[id1,id2,...]` | Resove/Reject
| `search()`      | Simple Text Search with matching Prefix or Whole Text       |key and searchterm Ex: `"name","Joh"` | updatedObject|


###### Note: ids and Keys will always be strings

