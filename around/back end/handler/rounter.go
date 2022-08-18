package handler

//router是client和后端程序之间的第一站，相当于dispatchServlet，所有后端功能都要在这注册
import (
	"net/http"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"

	//这个包在client和server之间，起到过滤错误请求的作用，对应spring的filterchain
	//实际中有10层以上的中间件，检测是否是机器人，是否是不同的设备，是否访问过于频繁...

	jwt "github.com/form3tech-oss/jwt-go" //json web token
	"github.com/gorilla/handlers"         //support CORSOption
	"github.com/gorilla/mux"
)

func InitRouter() http.Handler {
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte(mySigningKey), nil
		},
		SigningMethod: jwt.SigningMethodHS256,
	})

	router := mux.NewRouter()
	//限制只有这种类型的URL和POST请求才能出发，其他的过来找不到匹配，就会返回404
	router.Handle("/upload", jwtMiddleware.Handler(http.HandlerFunc(uploadHandler))).Methods("POST")
	router.Handle("/search", jwtMiddleware.Handler(http.HandlerFunc(searchHandler))).Methods("GET")
	router.Handle("/post/{id}", jwtMiddleware.Handler(http.HandlerFunc(deleteHandler))).Methods("DELETE")

	router.Handle("/signup", http.HandlerFunc(signupHandler)).Methods("POST")
	router.Handle("/signin", http.HandlerFunc(signinHandler)).Methods("POST")

	originsOk := handlers.AllowedOrigins([]string{"*"})
	//src addr：接受一切跨域请求，也可以填前端的地址
	headersOk := handlers.AllowedHeaders([]string{"Authorization", "Content-Type"})
	//支持的数据格式：json
	methodsOk := handlers.AllowedMethods([]string{"GET", "POST", "DELETE"})
	//可以调用的请求类型
	return handlers.CORS(originsOk, headersOk, methodsOk)(router)
}
