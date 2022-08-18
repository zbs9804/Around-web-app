package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"time"

	"around/model"
	"around/service"

	jwt "github.com/form3tech-oss/jwt-go" //相当于在import的时候重命名library为jwt
)

var mySigningKey = []byte("secret")

func signinHandler(w http.ResponseWriter, r *http.Request) { //loginHandler
	fmt.Println("Received one signin request")

	/*用r读取用户提交的信息，并加密*/
	decoder := json.NewDecoder(r.Body)
	var user model.User
	if err := decoder.Decode(&user); err != nil { //把user加密，完了检查是否出错
		http.Error(w, "Failed to decode user data from request body", http.StatusBadRequest)
		return
	}
	exists, err := service.CheckUser(user.Username, user.Password)
	//调用service的user.go检测用户是否存在
	if err != nil {
		http.Error(w, "failed to read from backend", http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "User doesn't exists", http.StatusUnauthorized)
		//401不存在用户，403用户存在但没权限，这里是401
		return
	}

	/*用加密后的user创建token，并写入这个token登录状态和其他信息，并加密返回给用户*/

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": user.Username,                         //这里不要写password，过于隐私的内容写这里都不安全
		"exp":      time.Now().Add(time.Hour * 24).Unix(), //过期时间为当前时间上+24小时，还可以加其他的一些条件
	})

	tokenString, err := token.SignedString(mySigningKey)
	// token是一个go的对象，和err相似，不能直接返回，需要通过密钥加密后再返回
	if err != nil {
		http.Error(w, "failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Write([]byte(tokenString))
	//为什么是pass by string不是pass by array，得去看responseWriter的写法了
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one signup request")
	w.Header().Set("Content-Type", "text/plain")

	decoder := json.NewDecoder(r.Body)
	var user model.User
	if err := decoder.Decode(&user); err != nil {
		http.Error(w, "Cannot decode user data from client", http.StatusBadRequest)
		fmt.Printf("Cannot decode user data from client %v\n", err)
		return
	}

	//sanity check规定user name只能是a-z,0-9，不过这一步放在前端做即使反馈更好
	if user.Username == "" || user.Password == "" ||
		regexp.MustCompile(`^[a-z0-9]$`).MatchString(user.Username) {
		http.Error(w, "Invalid username or password", http.StatusBadRequest)
		fmt.Printf("Invalid username or password\n")
		return
	}

	success, err := service.AddUser(&user)
	if err != nil {
		http.Error(w, "Failed to save user to Elasticsearch", http.StatusInternalServerError)
		fmt.Printf("Failed to save user to Elasticsearch %v\n", err)
		return
	}

	if !success {
		http.Error(w, "User already exists", http.StatusBadRequest)
		fmt.Println("User already exists")
		return
	}
	fmt.Printf("User added successfully: %s.\n", user.Username)
}
