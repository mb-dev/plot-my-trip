package bsonHelper

import (
	"encoding/json"
	"fmt"

	"gopkg.in/mgo.v2/bson"
)

// JSONToBSONStruct converts to bson struct
func JSONToBSONStruct(body []byte, out interface{}) error {
	var jsonMap bson.M
	json.Unmarshal(body, &jsonMap)
	if _, ok := jsonMap["_id"]; ok {
		if jsonMap["_id"] != nil {
			jsonMap["_id"] = bson.ObjectIdHex(jsonMap["_id"].(string))
		}
	}
	if _, ok := jsonMap["userId"]; ok {
		jsonMap["userId"] = bson.ObjectIdHex(jsonMap["userId"].(string))
	}
	fmt.Printf("after json unmarshal %#v", jsonMap)
	b, _ := bson.Marshal(&jsonMap)
	return bson.Unmarshal(b, out)
}

// BSONToJSON converts to json struct
func BSONToJSON(in interface{}) (jsonResult bson.M, err error) {
	b, _ := bson.Marshal(in)
	err = bson.Unmarshal(b, &jsonResult)
	return jsonResult, err
}
