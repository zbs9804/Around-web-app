package backend

import (
	"context"
	"fmt"
	"io"

	"around/constants"

	"cloud.google.com/go/storage"
)

var (
	GCSBackend *GoogleCloudStorageBackend //这是GCS提供的client，对应hibernate的SessionFactory
)

type GoogleCloudStorageBackend struct {
	client *storage.Client
	bucket string
}

func InitGCSBackend() {
	client, err := storage.NewClient(context.Background())
	if err != nil {
		panic(err)
	}
	GCSBackend = &GoogleCloudStorageBackend{
		client: client,
		bucket: constants.GCS_BUCKET,
	}
}
func (gcsbackend *GoogleCloudStorageBackend) SaveToGCS(r io.Reader, objectName string) (string, error) {
	ctx := context.Background() //background是最简单的初始化方法，还可以用withTimeout指定ttl
	object := gcsbackend.client.Bucket(gcsbackend.bucket).Object(objectName)
	//gcsbackend是传入的参数，相当于this.client.Bucket
	wc := object.NewWriter(ctx)
	if _, err := io.Copy(wc, r); err != nil {
		return "", err
	}

	if err := wc.Close(); err != nil {
		return "", err
	}

	if err := object.ACL().Set(ctx, storage.AllUsers, storage.RoleReader); err != nil {
		//ACL是access controller，赋予访问权限的，这个例子是所有人都有read权限
		/*前端和后端是不同的user，所以读取权限的问题，需要考虑，前端收到后端请求到的，
		来自于gcs的img以后如何读取呢？需要后端在上传前用ACL设置访问权限*/
		return "", err
	}

	attrs, err := object.Attrs(ctx)
	if err != nil {
		return "", err
	}

	fmt.Printf("File is saved to GCS: %s\n", attrs.MediaLink)
	return attrs.MediaLink, nil
}
