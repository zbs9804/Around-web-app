FROM golang:1.18
MAINTAINER boshanzhou@gmail.com

WORKDIR /go/src/around
ADD . / /go/src/around/


RUN go get cloud.google.com/go/storage
RUN go get github.com/auth0/go-jwt-middlewares
RUN go get github.com/form3tech-oss/jwt-go
RUN go get github.com/gorilla/handlers
RUN go get github.com/gorilla/mux
RUN go get github.com/olivere/elastic/v7
RUN go get github.com/pborman/uuid
RUN go get gopkg.in/yaml.v2

EXPOSE 8080
CMD ["/usr/local/go/bin/go", "run", "main.go"]
