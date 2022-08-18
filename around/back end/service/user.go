package service //这个是针对user的service
//为什么有时候已保存，有些import就不见了？因为你安装了go的一些插件，
//有了这种插件，甚至都不需要写import
import (
	"around/backend"
	"around/constants"
	"around/model"

	"github.com/olivere/elastic/v7"
)

func CheckUser(username, password string) (bool, error) { //login
	query := elastic.NewBoolQuery()
	query.Must(elastic.NewTermQuery("username", username))
	query.Must(elastic.NewTermQuery("password", password))
	//具体这些api是什么意思不要求掌握，只需要知道这里需要username AND password的共同结果
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.USER_INDEX)

	if err != nil {
		return false, err
	}
	return searchResult.TotalHits() > 0, nil //搜索结果适量>0就return true，否则false
	////return !searchResult, nil

	// var utype model.User//这是教案上的写法，遍历搜索结果，如果匹配，就return true，但没必要
	// for _, item := range searchResult.Each(reflect.TypeOf(utype)) {
	// 	u := item.(model.User)
	// 	if u.Password == password && u.Username == username {
	// 		return true, nil
	// 	}
	// }
	// return false, nil
}

func AddUser(user *model.User) (bool, error) { //register
	query := elastic.NewTermQuery("username", user.Username)
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.USER_INDEX)
	if err != nil {
		return false, err
	}

	if searchResult.TotalHits() > 0 {
		return false, nil
	}
	err = backend.ESBackend.SaveToES(user, constants.USER_INDEX, user.Username)
	if err != nil {
		return false, err
	}
	return true, nil
}
