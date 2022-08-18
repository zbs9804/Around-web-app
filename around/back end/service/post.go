package service

//这个post.go是被handler.go call的，名字一样方便设计
//url传进来的是那个user，是什么请求类型，在这里都对应处理
import (
	"mime/multipart"
	"reflect"

	"around/backend"
	"around/constants"
	"around/model"

	"github.com/olivere/elastic/v7"
)

func SearchPostsByUser(user string) ([]model.Post, error) { //一般每个func都要加个error返回
	query := elastic.NewTermQuery("user", user)
	//NewTermQuery： SELECT * FROM POST WHERE USER = XXX
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.POST_INDEX)
	if err != nil {
		return nil, err
	}
	return getPostFromSearchResult(searchResult), nil
}

func SearchPostsByKeywords(keywords string) ([]model.Post, error) {
	query := elastic.NewMatchQuery("message", keywords)
	//NewMatchQuery: SELECT * FROM POST WHERE MESSAGE LIKE XXX AND PASSWORD = YYY
	//当然了，mysql做elsaticsearch肯定是不会有ES快的，所以才用ES
	query.Operator("AND")
	if keywords == "" {
		query.ZeroTermsQuery("all")
	}
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.POST_INDEX)
	if err != nil {
		return nil, err
	}
	return getPostFromSearchResult(searchResult), nil
}

func getPostFromSearchResult(searchResult *elastic.SearchResult) []model.Post {
	var ptype model.Post
	var posts []model.Post

	for _, item := range searchResult.Each(reflect.TypeOf(ptype)) {
		//reflect.TypeOf(ptype)就是按照数据类型搜索，这就是ES和mysql的区别，因为前者是非关系型数据库，
		//所以table里搜出来的可能千奇百怪，所以需要检查数据类型，过滤掉非post类型的搜索结果
		p := item.(model.Post)
		posts = append(posts, p)
	}
	return posts
}

func SavePost(post *model.Post, file multipart.File) error {
	medialink, err := backend.GCSBackend.SaveToGCS(file, post.Id) //让gcs存file，并返回url
	if err != nil {
		return err
	}
	post.Url = medialink

	return backend.ESBackend.SaveToES(post, constants.POST_INDEX, post.Id) //ES存file信息(url)
	/*client提供user id，上gcs存url，并且拿回url，拿到url以后，再上DB(es)存
	  img using url provided by GCS，这么做的好处是gcs是网盘，成本低，各处都有部署，
	  所以就算地理位置距离大，存取url速度也快，然后拿着url去DB（成本比网盘高，相应的数量也就少）
	  里取文件。这么搞的缺点是无法保证存储的原子性，有时候GCS存成功了，ES没成功，
	  导致GCS里存了个没有ref的文件，这时候就需要自己写一个garbage collector，遍历ES，
	  排除GCS里没有ref的文件*/
}

func DeletePost(id string, user string) error {
	query := elastic.NewBoolQuery()
	query.Must(elastic.NewTermQuery("id", id))
	query.Must(elastic.NewTermQuery("user", user))

	return backend.ESBackend.DeleteFromES(query, constants.POST_INDEX)
}
