package main

import (
	"fmt"
	"log"
	"net/http"

	"around/backend"
	"around/handler"
)

func main() {
	fmt.Println("started-service")

	backend.InitElasticsearchBackend() //main不会被多线程调用，这样init保证只会执行一次
	backend.InitGCSBackend()

	log.Fatal(http.ListenAndServe(":8080", handler.InitRouter()))
}
